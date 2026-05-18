const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

// Create or Get User Profile (Registration)
router.post('/profile', async (req, res) => {
  try {
    const { name, phone, email, address, password } = req.body;

    if (!name || !phone || !email || !address || !password) {
      return res.status(400).json({ error: 'All fields, including password, are required to join the boutique' });
    }

    console.log('[New Registration Attempt]', { name, phone, email });

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`phone.eq.${phone},email.eq.${email}`)
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

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and Password are required' });
    }

    // Find user by phone
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (findError || !user) {
      return res.status(404).json({ error: 'Identity not found. Please register first.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'The Golden Key (Password) is incorrect.' });
    }

    // Return user profile (exclude password)
    const { password: _, ...userProfile } = user;
    console.log('[Login Success]', userProfile.name);
    res.status(200).json(userProfile);
  } catch (error) {
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

module.exports = router;
