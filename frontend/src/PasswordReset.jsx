import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasswordReset = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError('Invalid reset link');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword
      });
      
      setMessage('Password reset successfully! You can now login with your new password.');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

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
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      textAlign: 'center',
      color: '#64748b',
      marginBottom: '2.5rem',
      fontSize: '1.1rem',
      fontWeight: '500'
    },
    inputGroup: {
      marginBottom: '1.5rem'
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
      backgroundColor: '#fafafa',
      outline: 'none',
      fontFamily: 'inherit'
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
      marginBottom: '1.5rem'
    },
    error: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fca5a5',
      color: '#dc2626',
      padding: '0.75rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontSize: '0.9rem'
    },
    success: {
      backgroundColor: '#d1fae5',
      border: '1px solid #86efac',
      color: '#065f46',
      padding: '0.75rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>VibeLog</h1>
        <p style={styles.subtitle}>Reset Your Password</p>
        
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
        
        {!message && (
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input
                style={styles.input}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                minLength={6}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                style={styles.input}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                minLength={6}
              />
            </div>
            
            <button 
              style={{
                ...styles.button,
                opacity: isLoading ? 0.7 : 1
              }}
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? '🔄 Resetting...' : '🔐 Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
