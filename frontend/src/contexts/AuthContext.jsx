import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (token exists in local storage)
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('vibelogToken');
      
      if (token) {
        try {
          // Set auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const response = await axios.get('/api/auth/me');
          
          setUser(response.data.user);
          setIsAuthenticated(true);
          setError(null);
        } catch (err) {
          // Token might be expired or invalid
          localStorage.removeItem('vibelogToken');
          setUser(null);
          setIsAuthenticated(false);
          setError('Session expired. Please login again.');
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/auth/register', userData);
      
      // Save token to local storage
      localStorage.setItem('vibelogToken', response.data.token);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      setError(null);
      setIsLoading(false);
      
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/auth/login', userData);
      
      // Save token to local storage
      localStorage.setItem('vibelogToken', response.data.token);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      setError(null);
      setIsLoading(false);
      
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('vibelogToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
