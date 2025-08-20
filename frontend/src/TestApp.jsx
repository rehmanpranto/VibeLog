import React from 'react';

const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>VibeLog Test</h1>
      <p>If you can see this, React is working!</p>
      <p>Date: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default TestApp;
