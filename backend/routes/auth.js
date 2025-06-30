const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTP } = require('../services/otpService');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user
router.post('/register', [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('identifier').notEmpty().trim(),
  body('password').isLength({ min: 8 }),
  body('verificationType').isIn(['email', 'phone']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, identifier, password, verificationType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: verificationType === 'email' ? identifier : undefined },
        { phone: verificationType === 'phone' ? identifier : undefined },
        { username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const userData = {
      username,
      password,
      verificationType,
      isVerified: false,
    };

    if (verificationType === 'email') {
      userData.email = identifier;
    } else {
      userData.phone = identifier;
    }

    const user = new User(userData);
    await user.save();

    // Generate and send OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await OTP.findOneAndUpdate(
      { identifier },
      { otp: otpCode, verificationType },
      { upsert: true, new: true }
    );

    await sendOTP(identifier, otpCode, verificationType);

    res.status(201).json({ 
      message: `OTP sent to your ${verificationType}. Please verify to complete registration.` 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', [
  body('identifier').notEmpty().trim(),
  body('otp').isLength({ min: 6, max: 6 }),
  body('verificationType').isIn(['email', 'phone']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, otp, verificationType } = req.body;

    // Find OTP
    const otpRecord = await OTP.findOne({ identifier, verificationType });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find and verify user
    const user = await User.findOne({
      [verificationType]: identifier
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ identifier });

    // Generate token
    const token = generateToken(user._id);

    res.json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resend OTP
router.post('/resend-otp', [
  body('identifier').notEmpty().trim(),
  body('verificationType').isIn(['email', 'phone']),
], async (req, res) => {
  try {
    const { identifier, verificationType } = req.body;

    // Check if user exists and is not verified
    const user = await User.findOne({
      [verificationType]: identifier,
      isVerified: false
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found or already verified' });
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await OTP.findOneAndUpdate(
      { identifier },
      { otp: otpCode, verificationType },
      { upsert: true, new: true }
    );

    await sendOTP(identifier, otpCode, verificationType);

    res.json({ message: `New OTP sent to your ${verificationType}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', [
  body('identifier').notEmpty().trim(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your account first' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json(req.user.toJSON());
});

module.exports = router;