const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const emailService = require('../services/emailService');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Create new user
    const newUser = await User.create({ username, email, password });
    
    // Send welcome email (don't wait for it)
    emailService.sendWelcomeEmail(email, username).catch(console.error);
    
    // Create and send JWT token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login existing user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }
    
    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await User.verifyPassword(user, password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create and send JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Please provide email address' });
    }
    
    // Generate reset token
    const resetToken = await User.generatePasswordResetToken(email);
    
    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetToken);
    
    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'No account found with that email address' });
    }
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Reset password
    await User.resetPassword(token, newPassword);
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.message === 'Invalid or expired reset token') {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// OAuth success callback
const oauthSuccess = async (req, res) => {
  try {
    const user = req.user;
    
    // Create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email
    }))}`);
  } catch (error) {
    console.error('OAuth success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

// OAuth failure callback
const oauthFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  oauthSuccess,
  oauthFailure,
  getCurrentUser
};
