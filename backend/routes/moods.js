const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const auth = require('../middleware/auth');

// Protect all mood routes
router.use(auth);

// Create a new mood entry
router.post('/', moodController.createMood);

// Get all moods for the current user
router.get('/', moodController.getUserMoods);

// Get mood trends and AI analysis
router.get('/trends', moodController.getMoodTrends);

// Get daily affirmation
router.get('/affirmation', moodController.getDailyAffirmation);

// Get a specific mood by ID
router.get('/:id', moodController.getMoodById);

// Update a mood entry
router.put('/:id', moodController.updateMood);

// Delete a mood entry
router.delete('/:id', moodController.deleteMood);

module.exports = router;
