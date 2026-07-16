const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-luxury-secret-key';

const { authRateLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validator');

// Admin Login
router.post('/login', authRateLimiter, validate('adminLogin'), async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin in Supabase
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      console.log(`Admin not found: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log(`Password mismatch for: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`Login successful: ${email}`);

    // Generate JWT
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({ token, admin: { email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const authMiddleware = require('../middleware/auth');
router.get('/verify', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true, admin: req.admin });
});

module.exports = router;
