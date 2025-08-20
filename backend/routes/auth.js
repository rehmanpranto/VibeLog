const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Forgot password route
router.post('/forgot-password', authController.forgotPassword);

// Reset password route
router.post('/reset-password', authController.resetPassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/auth/failure' }),
  authController.oauthSuccess
);

// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/api/auth/failure' }),
  authController.oauthSuccess
);

// OAuth failure route
router.get('/failure', authController.oauthFailure);

// Get current user route (protected)
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
