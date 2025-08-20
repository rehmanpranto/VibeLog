// frontend/src/styles.js

const palettes = {
  light: {
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    text: '#2d1b69',
    textSecondary: '#6b46c1',
    primary: '#8b5cf6',
    primaryGradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #feca57 100%)',
    secondaryGradient: 'linear-gradient(135deg, #a29bfe, #fd79a8)',
    border: 'rgba(255, 255, 255, 0.3)',
    inputBg: 'rgba(255, 255, 255, 0.9)',
    moodSelectedBg: 'rgba(255, 107, 107, 0.15)',
    affirmationBg: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    affirmationText: '#ffffff',
    accent: '#fd79a8',
  },
  dark: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #9b59b6 100%)',
    cardBg: 'rgba(44, 62, 80, 0.9)',
    text: '#ecf0f1',
    textSecondary: '#bdc3c7',
    primary: '#e74c3c',
    primaryGradient: 'linear-gradient(135deg, #e74c3c 0%, #f39c12 50%, #2ecc71 100%)',
    secondaryGradient: 'linear-gradient(135deg, #9b59b6, #3498db)',
    border: 'rgba(255, 255, 255, 0.1)',
    inputBg: 'rgba(52, 73, 94, 0.8)',
    moodSelectedBg: 'rgba(231, 76, 60, 0.2)',
    affirmationBg: 'linear-gradient(135deg, #e74c3c, #f39c12)',
    affirmationText: '#ffffff',
    accent: '#9b59b6',
  }
};

const getStyles = (theme = 'light') => {
  const p = palettes[theme];
  return {
    // Global styles
    container: {
      minHeight: '100vh',
      background: p.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxSizing: 'border-box',
      color: p.text,
    },

    // Auth form styles
    card: {
      backgroundColor: p.cardBg,
      backdropFilter: 'blur(25px) saturate(200%)',
      WebkitBackdropFilter: 'blur(25px) saturate(200%)',
      padding: '3rem',
      borderRadius: '28px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      width: '100%',
      maxWidth: '480px',
      border: `2px solid ${p.border}`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    title: {
      fontSize: '3.2rem',
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: '0.75rem',
      background: p.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
      letterSpacing: '1px',
      textShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    subtitle: {
      textAlign: 'center',
      color: p.textSecondary,
      marginBottom: '2.5rem',
      fontSize: '1.05rem',
      fontWeight: '500',
    },
    inputGroup: {
      marginBottom: '1.5rem',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: p.text,
      fontSize: '0.9rem',
    },
    input: {
      width: '100%',
      padding: '1.2rem',
      border: `2px solid ${p.border}`,
      borderRadius: '16px',
      fontSize: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: p.inputBg,
      color: p.text,
      outline: 'none',
      boxSizing: 'border-box',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    },
    button: {
      width: '100%',
      padding: '1.2rem',
      background: p.primaryGradient,
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      position: 'relative',
      overflow: 'hidden',
    },
    link: {
      color: p.primary,
      textDecoration: 'none',
      cursor: 'pointer',
      fontWeight: '600',
    },
    
    // Dashboard styles
    dashboard: {
      width: '100%',
      minHeight: '100vh',
      background: p.background,
      color: p.text,
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      backgroundColor: p.cardBg,
      backdropFilter: 'blur(15px) saturate(150%)',
      WebkitBackdropFilter: 'blur(15px) saturate(150%)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${p.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    headerTitle: {
      fontSize: '2rem',
      fontWeight: '800',
      color: p.text,
      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
      background: p.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    dashboardContent: {
      padding: '2rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      alignItems: 'start',
    },
    dashboardCard: {
      backgroundColor: p.cardBg,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      padding: '2.5rem',
      borderRadius: '24px',
      boxShadow: '0 20px 45px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      border: `1px solid ${p.border}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    },
    fullWidthCard: {
      gridColumn: '1 / -1',
    },
    moodGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    moodOption: {
      padding: '1.2rem 0.8rem',
      borderRadius: '20px',
      border: `2px solid ${p.border}`,
      backgroundColor: p.inputBg,
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
    },
    moodSelected: {
      borderColor: p.primary,
      backgroundColor: p.moodSelectedBg,
      transform: 'scale(1.08) translateY(-2px)',
      boxShadow: `0 12px 30px ${p.primary}40, 0 0 0 1px ${p.accent}50`,
      background: `linear-gradient(135deg, ${p.moodSelectedBg}, ${p.accent}20)`,
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      border: `2px solid ${p.border}`,
      borderRadius: '12px',
      fontSize: '1rem',
      minHeight: '120px',
      resize: 'vertical',
      outline: 'none',
      backgroundColor: p.inputBg,
      color: p.text,
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
    },
    aiInsight: {
      backgroundColor: p.moodSelectedBg,
      border: `1px solid ${p.primary}33`,
      borderRadius: '16px',
      padding: '1.5rem',
      marginTop: '1.5rem',
      fontSize: '0.95rem',
      lineHeight: '1.6',
      color: p.text,
    },
    affirmation: {
      textAlign: 'center',
      padding: '2rem',
      background: p.affirmationBg,
      color: p.affirmationText,
      borderRadius: '24px',
    },
    historyItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.25rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      marginBottom: '1rem',
      border: `1px solid ${p.border}`,
      transition: 'all 0.3s ease-in-out',
    },
    historyList: {
      maxHeight: '400px',
      overflowY: 'auto',
      paddingRight: '1rem',
    },
    latestVibeCard: {
      padding: '2rem',
      borderRadius: '20px',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      transition: 'all 0.3s ease-in-out',
      border: `1px solid ${p.border}`,
    },
    dimmedText: {
      fontSize: '0.85rem',
      color: p.textSecondary,
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      fontWeight: '600',
    },
    themeToggleButton: {
      background: p.inputBg,
      border: `1px solid ${p.border}`,
      color: p.text,
      padding: '0.5rem',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
      transition: 'all 0.3s ease',
    }
  };
};

const mediaQueries = `
  @media (max-width: 900px) {
    .dashboardContent {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .card {
      padding: 2rem;
    }
    .dashboardContent {
      padding: 1rem;
    }
    .header {
      padding: 1rem;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = mediaQueries;
  document.head.appendChild(styleSheet);
}

export default getStyles;
