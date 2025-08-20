const { pool } = require('./db');

const Mood = {
  // Create new mood entry
  create: async (moodData) => {
    const { user_id, mood_type, note, ai_insights } = moodData;
    
    const query = 'INSERT INTO moods (user_id, mood_type, note, ai_insights) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [user_id, mood_type, note, ai_insights];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get all moods for a user
  findByUserId: async (userId) => {
    const query = 'SELECT * FROM moods WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Get recent moods for a user (for AI context)
  findRecentByUserId: async (userId, limit = 5) => {
    const query = 'SELECT * FROM moods WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2';
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  },

  // Get a specific mood by ID
  findById: async (id) => {
    const query = 'SELECT * FROM moods WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Update a mood entry
  update: async (id, moodData) => {
    const { mood_type, note } = moodData;
    
    const query = 'UPDATE moods SET mood_type = $1, note = $2 WHERE id = $3 RETURNING *';
    const values = [mood_type, note, id];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete a mood entry
  delete: async (id) => {
    const query = 'DELETE FROM moods WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Mood;
