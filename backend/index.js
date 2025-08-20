require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/moods');
const { initDatabase, pool } = require('./models/db');

// Create Express app
const app = express();

// Test database connection and initialize tables
pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
    
    // Initialize database tables
    await initDatabase();
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5175',
  credentials: true
}));
app.use(express.json());

// Session configuration for OAuth
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to VibeLog API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };
