const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_KEY || 'placeholder'
);

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ name, email, branch, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;

    // Create JWT
    const payload = { userId: newUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { name: newUser.name, email: newUser.email, branch: newUser.branch } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error || !user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { name: user.name, email: user.email, branch: user.branch } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Fetch user profile from Google using the access token
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const payload = await response.json();
    
    if (!response.ok || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    // Check if user exists
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', payload.email)
      .single();
    
    if (!user) {
      // Create new user if they don't exist
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ 
          name: payload.name, 
          email: payload.email, 
          branch: 'Any', 
          password: hashedPassword 
        }])
        .select()
        .single();
        
      if (error) throw error;
      user = newUser;
    }

    // Create JWT
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: { name: user.name, email: user.email, branch: user.branch } });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
});

module.exports = router;
