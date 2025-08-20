import React from 'react';
import ReactDOM from 'react-dom/client';
import EnhancedVibeLog from './EnhancedApp';
import PasswordReset from './PasswordReset';
import './index.css';

// Simple router based on URL
const App = () => {
  const path = window.location.pathname;
  
  if (path === '/reset-password') {
    return <PasswordReset />;
  }
  
  return <EnhancedVibeLog />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
