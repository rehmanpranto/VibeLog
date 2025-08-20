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

// Database connection with better error handling
const connectDatabase = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    
    // Initialize database tables
    await initDatabase();
    console.log('✅ Database tables initialized');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    console.log('📊 Using demo mode until database is connected...');
  }
};

// Initialize database connection
connectDatabase();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://vibelog.vercel.app',
    'https://*.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Session configuration for OAuth
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-key',
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

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: dbResult.rows[0].now,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'VibeLog API is running! 🚀',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      moods: '/api/moods'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };
