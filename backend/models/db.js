const { Pool } = require('pg');

// Support both connection string and individual parameters
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_CONNECTION_STRING,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initDatabase = async () => {
  try {
    // Create users table with OAuth and password reset support
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100),
        provider VARCHAR(20) DEFAULT 'local',
        provider_id VARCHAR(100),
        reset_token VARCHAR(100),
        reset_token_expiry TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create moods table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS moods (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        mood_type VARCHAR(20) NOT NULL,
        note TEXT,
        ai_insights TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = { initDatabase, pool };
