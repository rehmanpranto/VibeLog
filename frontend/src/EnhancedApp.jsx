import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getStyles from './styles';
import logo from './assets/logo.png';
import './animations.css';

// Helper component for the latest vibe
const LatestVibe = ({ latest, moodOptions, styles }) => {
  if (!latest) return null;

  const moodData = moodOptions.find(m => m.value === latest.mood_type);
  const vibeColor = moodData ? moodData.color : '#e5e7eb';

  return (
    <div style={{ 
      ...styles.latestVibeCard, 
      background: `linear-gradient(135deg, ${vibeColor}2A, ${vibeColor}0A)`,
      position: 'relative',
      overflow: 'hidden'
    }} 
    className="card-hover animate-fadeInUp">
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${vibeColor}, ${vibeColor}80)`,
        borderRadius: '24px 24px 0 0'
      }}></div>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }} className="animate-float">{moodData?.emoji}</div>
      <div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: styles.title.color, marginBottom: '0.5rem' }}>
          Your Latest Vibe: {moodData?.label}
        </h3>
        <p style={{ ...styles.dimmedText, fontSize: '1rem' }}>
          Logged on {new Date(latest.created_at).toLocaleString()}
        </p>
        {latest.note && (
          <p style={{ 
            marginTop: '1rem', 
            color: styles.text, 
            fontStyle: 'italic',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            borderLeft: `4px solid ${vibeColor}`
          }}>
            "{latest.note}"
          </p>
        )}
      </div>
    </div>
  );
};

const EnhancedVibeLog = () => {
  const [theme, setTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [moodDate, setMoodDate] = useState(new Date().toISOString().split('T')[0]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [moodTrends, setMoodTrends] = useState(null);
  const [dailyAffirmation, setDailyAffirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('vibeLogToken'));
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    resetEmail: ''
  });

  const styles = getStyles(theme);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const API_BASE = 'http://localhost:5000/api';

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // On initial load, get user data if token exists
      if (!user) {
        getCurrentUser();
      }
    }
  }, [token, user]);



// This is now handled in styles.js
// const styles = { ... };

const moodOptions = [
  { value: 'happy', emoji: '😊', label: 'Happy', color: '#ff6b6b' },
  { value: 'sad', emoji: '😢', label: 'Sad', color: '#74b9ff' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', color: '#a29bfe' },
  { value: 'angry', emoji: '😡', label: 'Angry', color: '#fd79a8' },
  { value: 'neutral', emoji: '😐', label: 'Neutral', color: '#fdcb6e' }
];

  // API Functions
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE}/auth/me`);
      setUser(response.data.user);
      setCurrentPage('dashboard');
      getMoodHistory();
    } catch (error) {
      console.error('Get user failed:', error);
      // Don't automatically logout - let user try to login again
      setCurrentPage('login');
      setToken(null);
      localStorage.removeItem('vibeLogToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      setToken(response.data.token);
      localStorage.setItem('vibeLogToken', response.data.token);
      setUser(response.data.user);
      setCurrentPage('dashboard');
      getDailyAffirmation();
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username: formData.username,
        password: formData.password
      });
      
      setToken(response.data.token);
      localStorage.setItem('vibeLogToken', response.data.token);
      setUser(response.data.user);
      setCurrentPage('dashboard');
      getMoodHistory();
      getDailyAffirmation();
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(`${API_BASE}/auth/forgot-password`, {
        email: formData.resetEmail
      });
      alert('Password reset email sent! Check your inbox.');
      setCurrentPage('login');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/moods`);
      setMoodHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch mood history:', error);
    }
  };

  const getMoodTrends = async () => {
    try {
      const response = await axios.get(`${API_BASE}/moods/trends`);
      setMoodTrends(response.data);
    } catch (error) {
      console.error('Failed to fetch mood trends:', error);
    }
  };

  const getDailyAffirmation = async () => {
    try {
      const response = await axios.get(`${API_BASE}/moods/affirmation`);
      setDailyAffirmation(response.data.affirmation);
    } catch (error) {
      console.error('Failed to fetch affirmation:', error);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/moods`, {
        mood_type: selectedMood,
        note: journalEntry,
        created_at: moodDate,
      });
      
      setMoodHistory([response.data, ...moodHistory]);
      
      // Show AI insights if available
      if (response.data.ai_insights) {
        setAiInsights(response.data.ai_insights);
      }
      
      setSelectedMood('');
      setJournalEntry('');
      getDailyAffirmation();
    } catch (error) {
      setError('Failed to log mood');
    } finally {
      setIsLoading(false);
    }
  };



  const logout = () => {
    setToken(null);
    setUser(null);
    setCurrentPage('login');
    setMoodHistory([]);
    setAiInsights(null);
    setMoodTrends(null);
    setDailyAffirmation('');
    localStorage.removeItem('vibeLogToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Debug logging
  console.log('Current state - Page:', currentPage, 'User:', user, 'Token:', token);

  if (currentPage === 'dashboard' && user) {
    return (
      <div style={styles.dashboard}>
        <header style={{
          ...styles.header,
          padding: '1.5rem 2rem',
          borderBottom: 'none',
          background: 'transparent'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src={logo} 
              alt="VibeLog Logo" 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%',
                filter: 'brightness(1.1)',
              }} 
            />
            <h1 style={{
              ...styles.headerTitle,
              fontSize: '1.5rem'
            }}>VibeLog</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '500', fontSize: '0.9rem', color: styles.textSecondary }}>
              {user.username}
            </span>
            <button 
              onClick={toggleTheme} 
              style={{
                fontSize: '1.2rem',
                padding: '0.5rem',
                borderRadius: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: styles.textSecondary
              }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button 
              onClick={logout} 
              style={{ 
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                background: 'none',
                border: `1px solid ${styles.border}`,
                borderRadius: '6px',
                color: styles.textSecondary,
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main style={{
          padding: '3rem 2rem',
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem'
        }}>
          {/* Welcome Section */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '600',
              color: styles.text,
              marginBottom: '0.5rem',
              fontFamily: "'Fredoka One', cursive"
            }}>
              How are you feeling today?
            </h2>
            <p style={{ fontSize: '1rem', color: styles.textSecondary, fontWeight: '400' }}>
              Track your mood and reflect on your day
            </p>
          </div>

          {/* Mood Selection */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {moodOptions.map((mood) => (
              <div
                key={mood.value}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '1.5rem',
                  minWidth: '100px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: selectedMood === mood.value ? `2px solid ${mood.color}` : '2px solid transparent',
                  background: selectedMood === mood.value ? `${mood.color}10` : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSelectedMood(mood.value)}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '0.5rem' 
                }}>
                  {mood.emoji}
                </div>
                <div style={{ 
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: selectedMood === mood.value ? mood.color : styles.textSecondary
                }}>
                  {mood.label}
                </div>
              </div>
            ))}
          </div>

          {/* Journal Section */}
          {selectedMood && (
            <div style={{
              background: styles.cardBg,
              borderRadius: '16px',
              padding: '2rem',
              border: `1px solid ${styles.border}`,
              animation: 'fadeInUp 0.3s ease-out'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: styles.text
                }}>
                  Date
                </label>
                <input
                  type="date"
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${styles.border}`,
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: styles.inputBg,
                    color: styles.text,
                    outline: 'none',
                    width: '200px'
                  }}
                  value={moodDate}
                  onChange={(e) => setMoodDate(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: styles.text
                }}>
                  How was your day? (optional)
                </label>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '1rem',
                    border: `1px solid ${styles.border}`,
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: styles.inputBg,
                    color: styles.text,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Share your thoughts about today..."
                />
              </div>

              <button
                style={{
                  padding: '0.75rem 2rem',
                  background: styles.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={handleMoodSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Entry'}
              </button>

              {aiInsights && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: `${styles.primary}10`,
                  borderRadius: '8px',
                  border: `1px solid ${styles.primary}20`
                }}>
                  <h4 style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: styles.text, 
                    marginBottom: '0.5rem' 
                  }}>
                    AI Insight
                  </h4>
                  <p style={{ 
                    fontSize: '0.85rem',
                    color: styles.textSecondary, 
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {aiInsights}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recent Entries */}
          {moodHistory.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: styles.text,
                marginBottom: '1rem'
              }}>
                Recent Entries
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {moodHistory.slice(0, 5).map((entry) => {
                  const moodData = moodOptions.find(m => m.value === entry.mood_type);
                  return (
                    <div 
                      key={entry.id} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: styles.cardBg,
                        borderRadius: '8px',
                        border: `1px solid ${styles.border}`
                      }}
                    >
                      <div style={{ fontSize: '1.5rem' }}>
                        {moodData?.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '0.9rem',
                          fontWeight: '500', 
                          color: styles.text
                        }}>
                          {moodData?.label}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem',
                          color: styles.textSecondary
                        }}>
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {entry.note && (
                        <div style={{ 
                          fontSize: '0.8rem',
                          color: styles.textSecondary,
                          fontStyle: 'italic',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {entry.note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Daily Affirmation - Simplified */}
          {dailyAffirmation && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: `${styles.primary}08`,
              borderRadius: '12px',
              border: `1px solid ${styles.primary}20`
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>✨</div>
              <p style={{ 
                fontSize: '1rem', 
                fontStyle: 'italic',
                color: styles.text,
                lineHeight: '1.6',
                margin: 0
              }}>
                "{dailyAffirmation}"
              </p>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (currentPage === 'forgot-password') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
            <img 
              src={logo} 
              alt="VibeLog Logo" 
              style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%',
                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: 'brightness(1.1) contrast(1.1)',
              }} 
            />
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '20px',
              height: '20px',
              background: 'linear-gradient(135deg, #ff6b6b, #fd79a8)',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
            }}></div>
          </div>
          <h1 style={styles.title}>VibeLog</h1>
          <p style={styles.subtitle}>Reset your password</p>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleForgotPassword}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                name="resetEmail"
                placeholder="Enter your email address"
                value={formData.resetEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button style={styles.button} type="submit" disabled={isLoading}>
              {isLoading ? '📧 Sending...' : '📧 Send Reset Email'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', fontSize: '0.95rem' }}>
            Remember your password?{' '}
            <span 
              style={styles.link} 
              onClick={() => setCurrentPage('login')}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
            <img 
              src={logo} 
              alt="VibeLog Logo" 
              style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%',
                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: 'brightness(1.1) contrast(1.1)',
              }} 
            />
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '20px',
              height: '20px',
              background: 'linear-gradient(135deg, #ff6b6b, #fd79a8)',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
              animation: 'pulse 2s infinite'
            }}></div>
          </div>
          <h1 style={styles.title}>VibeLog</h1>
          <p style={styles.subtitle}>
            {currentPage === 'login' ? 'Sign in to track your mood' : 'Create a new account'}
          </p>        {error && <div style={styles.error}>{error}</div>}
        

        
        <form onSubmit={currentPage === 'login' ? handleLogin : handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {currentPage === 'register' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {currentPage === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <span 
                style={styles.link} 
                onClick={() => setCurrentPage('forgot-password')}
              >
                Forgot password?
              </span>
            </div>
          )}
          
          <button style={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? (
              currentPage === 'login' ? '🔄 Signing in...' : '🔄 Creating account...'
            ) : (
              currentPage === 'login' ? '🚀 Sign In' : '✨ Create Account'
            )}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', fontSize: '0.95rem' }}>
          {currentPage === 'login' ? (
            <>
              Don't have an account?{' '}
              <span 
                style={styles.link} 
                onClick={() => setCurrentPage('register')}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span 
                style={styles.link} 
                onClick={() => setCurrentPage('login')}
              >
                Sign in
              </span>
            </>
          )}
        </p>

        {isLoading && (
          <div style={styles.loading}>
            Processing your request...
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedVibeLog;
