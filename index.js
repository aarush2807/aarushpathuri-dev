import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This imports your Tailwind styles
import App from './App';

// Create the root element where the React app will live
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside StrictMode for development best practices
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);