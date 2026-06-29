const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../services/emailService');

// In-memory stores for OTPs
const otpStore = new Map(); // email -> { otp, expiresAt, type }
const pendingRegistrationStore = new Map(); // email -> { otp, expiresAt, data }


// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    email = email.trim().toLowerCase();

    // Check if user exists case-insensitively
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ error: 'Identity not found. Please register first.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      type: 'reset'
    });

    // Send OTP email
    await sendOTPEmail(email, otp, user.name, 'reset');

    res.status(200).json({ message: 'Golden OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset Password - Verify OTP and Save
router.post('/reset-password', async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and New Password are required' });
    }
    email = email.trim().toLowerCase();

    const cachedOtp = otpStore.get(email);
    if (!cachedOtp || cachedOtp.otp !== otp || cachedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'The OTP code is invalid or has expired.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in Supabase using case-insensitive check
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    if (findError || !user) {
      return res.status(404).json({ error: 'Identity not found. Please register first.' });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Clear OTP from cache
    otpStore.delete(email);

    res.status(200).json({ message: 'Your Golden Key (Password) has been updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register OTP - Send OTP for Registration
router.post('/register-otp', async (req, res) => {
  try {
    let { name, phone, email, address, password } = req.body;
    if (!name || !phone || !email || !address || !password) {
      return res.status(400).json({ error: 'All fields are required to join the boutique' });
    }
    email = email.trim().toLowerCase();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`phone.eq.${phone},email.ilike.${email}`)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: 'An artisan with this phone or email already exists. Please login.' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingRegistrationStore.set(email, {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      data: { name, phone, email, address, password }
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name, 'register');

    res.status(200).json({ message: 'Verification OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Register OTP - Save Profile
router.post('/verify-register-otp', async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    email = email.trim().toLowerCase();

    const cachedReg = pendingRegistrationStore.get(email);
    if (!cachedReg || cachedReg.otp !== otp || cachedReg.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'The OTP code is invalid or has expired.' });
    }

    const { name, phone, address, password } = cachedReg.data;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, phone, email, address, password: hashedPassword }])
      .select('id, name, phone, email, address, created_at')
      .single();

    if (insertError) {
      throw insertError;
    }

    // Clear registration from cache
    pendingRegistrationStore.delete(email);

    console.log('[Registration & First Login Success]', newUser.name);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or Get User Profile (Registration) - Legacy direct register
router.post('/profile', async (req, res) => {
  try {
    let { name, phone, email, address, password } = req.body;

    if (!name || !phone || !email || !address || !password) {
      return res.status(400).json({ error: 'All fields, including password, are required to join the boutique' });
    }
    email = email.trim().toLowerCase();

    console.log('[New Registration Attempt]', { name, phone, email });

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`phone.eq.${phone},email.ilike.${email}`)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: 'An artisan with this phone or email already exists. Please login.' });
    }

    // Hash the password for safety
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, phone, email, address, password: hashedPassword }])
      .select('id, name, phone, email, address, created_at') // Don't return the password
      .single();

    if (insertError) {
      console.error('[Insert Error]', insertError);
      throw insertError;
    }
    
    console.log('[Registration Success]', newUser.name);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Secure Login with Phone and Password
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log(`[Login Attempt] Phone: ${phone}`);

    if (!phone || !password) {
      console.log('[Login Failed] Missing phone or password');
      return res.status(400).json({ error: 'Phone and Password are required' });
    }

    // Find user by phone
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (findError || !user) {
      console.log(`[Login Failed] User not found for phone: ${phone}`);
      return res.status(404).json({ error: 'Identity not found. Please register first.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`[Login Failed] Password incorrect for phone: ${phone}`);
      return res.status(401).json({ error: 'The Golden Key (Password) is incorrect.' });
    }

    // Return user profile (exclude password)
    const { password: _, ...userProfile } = user;
    console.log('[Login Success]', userProfile.name);
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('[Login Error]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all Users (For Admin Dashboard)
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, phone, email, address, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User by Phone (Maintained for legacy lookup if needed)
router.get('/:phone', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, phone, email, address, created_at')
      .eq('phone', req.params.phone)
      .single();

    if (error || !data) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Development helper: expose pending OTPs for test scripts
router.get('/dev-otps', (req, res) => {
  const pending = Array.from(pendingRegistrationStore.entries());
  const otps = Array.from(otpStore.entries());
  res.status(200).json({ pending, otps });
});

module.exports = router;
