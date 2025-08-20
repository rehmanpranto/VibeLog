import React, { useState } from 'react';

const BeautifulVibeLog = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '3rem',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '480px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      textAlign: 'center',
      color: '#64748b',
      marginBottom: '2.5rem',
      fontSize: '1.1rem',
      fontWeight: '500'
    },
    inputGroup: {
      marginBottom: '1.5rem',
      position: 'relative'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#374151',
      fontSize: '0.95rem'
    },
    input: {
      width: '100%',
      padding: '1rem 1.25rem',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      backgroundColor: '#fafafa',
      outline: 'none',
      fontFamily: 'inherit'
    },
    inputFocus: {
      borderColor: '#667eea',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
    },
    button: {
      width: '100%',
      padding: '1rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '1.5rem',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'color 0.3s ease'
    },
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
      paddingBottom: '2rem'
    },
    header: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '2rem'
    },
    headerTitle: {
      fontSize: '1.8rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.2rem'
    },
    logoutBtn: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    dashboardCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '2.5rem',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      margin: '0 2rem 2rem',
      transition: 'transform 0.3s ease'
    },
    moodGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    moodOption: {
      padding: '1.5rem 1rem',
      borderRadius: '20px',
      border: '2px solid #e5e7eb',
      backgroundColor: '#fafafa',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      fontWeight: '600'
    },
    moodSelected: {
      borderColor: '#667eea',
      backgroundColor: '#667eea',
      color: 'white',
      transform: 'scale(1.05)',
      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
    },
    textarea: {
      width: '100%',
      padding: '1.25rem',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      fontSize: '1rem',
      minHeight: '150px',
      resize: 'vertical',
      outline: 'none',
      backgroundColor: '#fafafa',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    },
    historyItem: {
      padding: '1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '16px',
      marginBottom: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s ease'
    },
    moodBadge: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      borderRadius: '25px',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 2rem',
      color: '#64748b'
    },
    floatingElements: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden'
    },
    floatingCircle: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      animation: 'float 6s ease-in-out infinite'
    }
  };

  const moodOptions = [
    { value: 'happy', emoji: '😊', label: 'Happy', color: '#10b981' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: '#3b82f6' },
    { value: 'anxious', emoji: '😰', label: 'Anxious', color: '#8b5cf6' },
    { value: 'angry', emoji: '😡', label: 'Angry', color: '#ef4444' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: '#6b7280' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ username: formData.username });
    setCurrentPage('dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setUser({ username: formData.username });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setFormData({ username: '', email: '', password: '' });
    setSelectedMood('');
    setJournalEntry('');
  };

  const handleMoodSubmit = () => {
    if (!selectedMood) return;
    
    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: journalEntry,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };
    
    setMoodHistory([newEntry, ...moodHistory]);
    setSelectedMood('');
    setJournalEntry('');
  };

  const getMoodColor = (mood) => {
    const moodData = moodOptions.find(m => m.value === mood);
    return moodData ? moodData.color : '#6b7280';
  };

  if (currentPage === 'dashboard' && user) {
    return (
      <div style={styles.dashboard}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>VibeLog</h1>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: '600', color: '#374151' }}>
              Hello, {user.username}
            </span>
            <button 
              style={styles.logoutBtn}
              onClick={handleLogout}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Logout
            </button>
          </div>
        </div>
        
        <div style={styles.dashboardCard}>
          <h2 style={{ ...styles.title, fontSize: '2.5rem', marginBottom: '2rem' }}>
            How are you feeling today?
          </h2>
          
          <div style={styles.moodGrid}>
            {moodOptions.map((mood) => (
              <div
                key={mood.value}
                style={{
                  ...styles.moodOption,
                  ...(selectedMood === mood.value ? styles.moodSelected : {})
                }}
                onClick={() => setSelectedMood(mood.value)}
                onMouseEnter={(e) => {
                  if (selectedMood !== mood.value) {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMood !== mood.value) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {mood.emoji}
                </div>
                <div>{mood.label}</div>
              </div>
            ))}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Journal Entry (Optional):</label>
            <textarea
              style={styles.textarea}
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write about your day, thoughts, or feelings..."
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.backgroundColor = '#fafafa';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            style={{
              ...styles.button,
              opacity: selectedMood ? 1 : 0.6,
              cursor: selectedMood ? 'pointer' : 'not-allowed'
            }}
            onClick={handleMoodSubmit}
            disabled={!selectedMood}
            onMouseEnter={(e) => {
              if (selectedMood) {
                Object.assign(e.target.style, styles.buttonHover);
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ✨ Log My Mood
          </button>
        </div>

        <div style={styles.dashboardCard}>
          <h2 style={{ ...styles.title, fontSize: '2rem', marginBottom: '2rem' }}>
            Your Mood Journey
          </h2>
          
          {moodHistory.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌟</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                Start Your Journey
              </h3>
              <p>You haven't logged any moods yet. Start by sharing how you feel today!</p>
            </div>
          ) : (
            moodHistory.map((entry) => {
              const moodData = moodOptions.find(m => m.value === entry.mood);
              return (
                <div
                  key={entry.id}
                  style={styles.historyItem}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span
                      style={{
                        ...styles.moodBadge,
                        backgroundColor: getMoodColor(entry.mood),
                        color: 'white'
                      }}
                    >
                      {moodData?.emoji} {moodData?.label}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      {entry.date} at {entry.time}
                    </span>
                  </div>
                  {entry.note && (
                    <p style={{ color: '#374151', lineHeight: '1.6', fontSize: '1rem' }}>
                      {entry.note}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }



  if (currentPage === 'dashboard' && user) {
    return (
      <div style={styles.dashboard}>
        <div style={styles.header}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>VibeLog</h1>
          <div>
            <span style={{ marginRight: '1rem' }}>Hello, {user.username}</span>
            <button 
              onClick={handleLogout}
              style={{
                ...styles.button,
                width: 'auto',
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280'
              }}
            >
              Logout
            </button>
          </div>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <div style={styles.card}>
            <h2 style={styles.title}>How are you feeling today?</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Select Mood:
              </label>
              <select style={styles.input}>
                <option value="">Select a mood</option>
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="anxious">😰 Anxious</option>
                <option value="angry">😡 Angry</option>
                <option value="neutral">😐 Neutral</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Journal Entry (Optional):
              </label>
              <textarea
                style={{
                  ...styles.input,
                  minHeight: '150px',
                  resize: 'vertical'
                }}
                placeholder="Write about your day..."
              />
            </div>

            <button style={styles.button}>
              Log Mood
            </button>
          </div>

          <div style={{ ...styles.card, marginTop: '2rem' }}>
            <h2 style={styles.title}>Your Mood History</h2>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              You haven't logged any moods yet. Start by logging your first mood above!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>VibeLog</h1>
        <p style={styles.subtitle}>
          {currentPage === 'login' ? 'Sign in to track your mood' : 'Create a new account'}
        </p>
        
        <form onSubmit={currentPage === 'login' ? handleLogin : handleRegister}>
          <input
            style={styles.input}
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          
          {currentPage === 'register' && (
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          )}
          
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          <button style={styles.button} type="submit">
            {currentPage === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center' }}>
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
      </div>
    </div>
  );
};

export default BeautifulVibeLog;
