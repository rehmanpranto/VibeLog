const OpenAI = require('openai');

class AIService {
  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  async generateMoodInsight(moodType, journalEntry, recentMoods = []) {
    if (!this.openai) {
      return null; // AI not configured
    }

    try {
      const moodHistory = recentMoods.map(mood => 
        `${mood.mood_type}: ${mood.note || 'No note'} (${new Date(mood.created_at).toLocaleDateString()})`
      ).join('\n');

      const prompt = `
        As an empathetic AI mental wellness companion, analyze this mood entry and provide helpful insights:
        
        Current Mood: ${moodType}
        Journal Entry: ${journalEntry || 'No journal entry provided'}
        
        Recent Mood History:
        ${moodHistory || 'No recent mood history available'}
        
        Please provide:
        1. A warm, supportive response acknowledging their current mood
        2. Gentle insights about patterns or triggers you notice
        3. 2-3 actionable, specific suggestions for emotional wellness
        4. Encouragement and validation
        
        Keep your response:
        - Warm and empathetic (not clinical)
        - Around 150-200 words
        - Focused on actionable advice
        - Respectful of their experience
        - Encouraging but not dismissive of negative emotions
        
        If the mood seems concerning, gently suggest professional support while being supportive.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a compassionate AI wellness companion helping people understand their emotions and improve their mental well-being. You provide warm, supportive, and actionable advice while being careful not to provide medical advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI insight generation failed:', error);
      return null;
    }
  }

  async generateMoodTrends(moodData) {
    if (!this.openai || !moodData || moodData.length === 0) {
      return null;
    }

    try {
      const moodSummary = this.summarizeMoodData(moodData);
      
      const prompt = `
        Analyze this mood tracking data and provide insights about patterns and trends:
        
        ${moodSummary}
        
        Please provide:
        1. Key patterns you notice in their mood journey
        2. Potential triggers or positive influences
        3. Trends over time (improving, stable, concerning)
        4. 3-4 personalized recommendations for emotional wellness
        5. Celebration of positive progress
        
        Keep your response:
        - Encouraging and strength-focused
        - Around 200-250 words
        - Data-driven but warm
        - Actionable and specific
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI wellness coach analyzing mood patterns to help users understand their emotional journey and improve their well-being."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 350,
        temperature: 0.6
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Mood trends analysis failed:', error);
      return null;
    }
  }

  summarizeMoodData(moodData) {
    const moodCounts = {};
    const recentEntries = moodData.slice(0, 10).map(entry => 
      `${entry.mood_type} - ${entry.note || 'No note'} (${new Date(entry.created_at).toLocaleDateString()})`
    );

    moodData.forEach(entry => {
      moodCounts[entry.mood_type] = (moodCounts[entry.mood_type] || 0) + 1;
    });

    const totalEntries = moodData.length;
    const timeSpan = moodData.length > 1 ? 
      Math.ceil((new Date(moodData[0].created_at) - new Date(moodData[moodData.length - 1].created_at)) / (1000 * 60 * 60 * 24)) : 1;

    return `
      Mood Tracking Summary:
      - Total entries: ${totalEntries} over ${timeSpan} days
      - Mood distribution: ${Object.entries(moodCounts).map(([mood, count]) => `${mood}: ${count} (${Math.round(count/totalEntries*100)}%)`).join(', ')}
      
      Recent entries:
      ${recentEntries.join('\n')}
    `;
  }

  async generateDailyAffirmation(mood) {
    if (!this.openai) {
      // Fallback affirmations
      const affirmations = {
        happy: "Your joy is contagious and makes the world brighter! 🌟",
        sad: "It's okay to feel sad. You're processing emotions in a healthy way. 💙",
        anxious: "You have the strength to handle whatever comes your way. 💪",
        angry: "Your feelings are valid. Take a deep breath and be kind to yourself. 🌱",
        neutral: "Every day is a new opportunity for growth and discovery. ✨"
      };
      return affirmations[mood] || "You are worthy of love, happiness, and peace. 🌈";
    }

    try {
      const prompt = `Generate a personalized, uplifting affirmation for someone feeling ${mood}. Keep it warm, encouraging, and around 15-20 words. Include a relevant emoji.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You create warm, personalized affirmations that validate emotions and encourage self-compassion."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.8
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Affirmation generation failed:', error);
      return "You are exactly where you need to be in this moment. 🌟";
    }
  }
}

module.exports = new AIService();
