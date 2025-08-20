const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findByProvider('google', profile.id);
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    user = await User.findByEmail(profile.emails[0].value);
    
    if (user) {
      // Link Google account to existing user
      const query = 'UPDATE users SET provider = $1, provider_id = $2 WHERE id = $3';
      await require('../models/db').pool.query(query, ['google', profile.id, user.id]);
      user.provider = 'google';
      user.provider_id = profile.id;
      return done(null, user);
    }
    
    // Create new user
    user = await User.createOAuthUser({
      username: profile.displayName || profile.emails[0].value.split('@')[0],
      email: profile.emails[0].value,
      provider: 'google',
      providerId: profile.id
    });
    
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Facebook ID
    let user = await User.findByProvider('facebook', profile.id);
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    if (profile.emails && profile.emails[0]) {
      user = await User.findByEmail(profile.emails[0].value);
      
      if (user) {
        // Link Facebook account to existing user
        const query = 'UPDATE users SET provider = $1, provider_id = $2 WHERE id = $3';
        await require('../models/db').pool.query(query, ['facebook', profile.id, user.id]);
        user.provider = 'facebook';
        user.provider_id = profile.id;
        return done(null, user);
      }
    }
    
    // Create new user
    user = await User.createOAuthUser({
      username: profile.displayName || `user_${profile.id}`,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@facebook.local`,
      provider: 'facebook',
      providerId: profile.id
    });
    
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

module.exports = passport;
