const { pool } = require('./db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = {
  // Find user by username
  findByUsername: async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const query = 'SELECT id, username, email, created_at, provider, provider_id FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Find user by OAuth provider
  findByProvider: async (provider, providerId) => {
    const query = 'SELECT * FROM users WHERE provider = $1 AND provider_id = $2';
    const result = await pool.query(query, [provider, providerId]);
    return result.rows[0];
  },

  // Create new user (regular registration)
  create: async (userData) => {
    const { username, email, password } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at';
    const values = [username, email, hashedPassword];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Create OAuth user
  createOAuthUser: async (userData) => {
    const { username, email, provider, providerId } = userData;
    
    const query = 'INSERT INTO users (username, email, provider, provider_id) VALUES ($1, $2, $3, $4) RETURNING id, username, email, created_at';
    const values = [username, email, provider, providerId];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Generate password reset token
  generatePasswordResetToken: async (email) => {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    const query = 'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3';
    await pool.query(query, [resetToken, resetTokenExpiry, user.id]);

    return resetToken;
  },

  // Reset password using token
  resetPassword: async (token, newPassword) => {
    const query = 'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()';
    const result = await pool.query(query, [token]);
    
    if (result.rows.length === 0) {
      throw new Error('Invalid or expired reset token');
    }

    const user = result.rows[0];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updateQuery = 'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2';
    await pool.query(updateQuery, [hashedPassword, user.id]);

    return user;
  },

  // Verify password
  verifyPassword: async (user, password) => {
    if (!user.password) {
      return false; // OAuth users don't have passwords
    }
    return await bcrypt.compare(password, user.password);
  }
};

module.exports = User;
