const Mood = require('../models/mood');
const aiService = require('../services/aiService');

// Create a new mood entry
const createMood = async (req, res) => {
  try {
    const { mood_type, note, created_at } = req.body;
    
    // Validate input
    if (!mood_type) {
      return res.status(400).json({ message: 'Mood type is required' });
    }
    
    // Get recent moods for AI context
    const recentMoods = await Mood.findRecentByUserId(req.userId, 5);
    
    // Generate AI insights
    let aiInsights = null;
    try {
      aiInsights = await aiService.generateMoodInsight(mood_type, note, recentMoods);
    } catch (error) {
      console.error('AI insights generation failed:', error);
    }
    
    // Create mood entry
    const moodData = {
      user_id: req.userId,
      mood_type,
      note: note || null,
      ai_insights: aiInsights,
      created_at: created_at ? new Date(created_at) : new Date(),
    };
    
    const newMood = await Mood.create(moodData);
    
    res.status(201).json(newMood);
  } catch (error) {
    console.error('Create mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all moods for the current user
const getUserMoods = async (req, res) => {
  try {
    const moods = await Mood.findByUserId(req.userId);
    res.json(moods);
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get mood trends and AI analysis
const getMoodTrends = async (req, res) => {
  try {
    const moods = await Mood.findByUserId(req.userId);
    
    if (moods.length === 0) {
      return res.json({ message: 'No mood data available for analysis' });
    }
    
    // Generate AI trends analysis
    let trendsAnalysis = null;
    try {
      trendsAnalysis = await aiService.generateMoodTrends(moods);
    } catch (error) {
      console.error('Trends analysis failed:', error);
    }
    
    // Calculate basic statistics
    const moodCounts = {};
    moods.forEach(mood => {
      moodCounts[mood.mood_type] = (moodCounts[mood.mood_type] || 0) + 1;
    });
    
    const totalEntries = moods.length;
    const moodPercentages = {};
    Object.keys(moodCounts).forEach(mood => {
      moodPercentages[mood] = Math.round((moodCounts[mood] / totalEntries) * 100);
    });
    
    res.json({
      totalEntries,
      moodCounts,
      moodPercentages,
      trendsAnalysis,
      recentMoods: moods.slice(0, 7) // Last 7 entries
    });
  } catch (error) {
    console.error('Get mood trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get daily affirmation based on recent mood
const getDailyAffirmation = async (req, res) => {
  try {
    const recentMood = await Mood.findRecentByUserId(req.userId, 1);
    const latestMoodType = recentMood.length > 0 ? recentMood[0].mood_type : 'neutral';
    
    let affirmation = null;
    try {
      affirmation = await aiService.generateDailyAffirmation(latestMoodType);
    } catch (error) {
      console.error('Affirmation generation failed:', error);
      affirmation = "You are worthy of love, happiness, and peace. 🌈";
    }
    
    res.json({
      affirmation,
      basedOnMood: latestMoodType
    });
  } catch (error) {
    console.error('Get affirmation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific mood by ID
const getMoodById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const mood = await Mood.findById(id);
    
    if (!mood) {
      return res.status(404).json({ message: 'Mood not found' });
    }
    
    // Check if the mood belongs to the current user
    if (mood.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to access this mood' });
    }
    
    res.json(mood);
  } catch (error) {
    console.error('Get mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a mood entry
const updateMood = async (req, res) => {
  try {
    const { id } = req.params;
    const { mood_type, note } = req.body;
    
    // Validate input
    if (!mood_type) {
      return res.status(400).json({ message: 'Mood type is required' });
    }
    
    // Check if mood exists
    const existingMood = await Mood.findById(id);
    
    if (!existingMood) {
      return res.status(404).json({ message: 'Mood not found' });
    }
    
    // Check if the mood belongs to the current user
    if (existingMood.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this mood' });
    }
    
    // Update mood
    const updatedMood = await Mood.update(id, { mood_type, note });
    
    res.json(updatedMood);
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a mood entry
const deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if mood exists
    const existingMood = await Mood.findById(id);
    
    if (!existingMood) {
      return res.status(404).json({ message: 'Mood not found' });
    }
    
    // Check if the mood belongs to the current user
    if (existingMood.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this mood' });
    }
    
    // Delete mood
    const deletedMood = await Mood.delete(id);
    
    res.json({ message: 'Mood deleted successfully', mood: deletedMood });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createMood,
  getUserMoods,
  getMoodTrends,
  getDailyAffirmation,
  getMoodById,
  updateMood,
  deleteMood
};
