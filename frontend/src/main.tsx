import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// import SimpleApp from './SimpleApp.tsx';
import './index.css';
import { checkDemoMode } from './demoTest';

// Check if we're running in demo mode and log it
const isDemoMode = checkDemoMode();
if (isDemoMode) {
  console.log('%c🌟 FarmCareAI is running in DEMO MODE 🌟', 
              'background: #2ecc71; color: white; padding: 5px; border-radius: 5px; font-size: 14px;');
  console.log('No backend connection required. Mock authentication and data will be used.');
  console.log('Use any valid email and password (minimum 6 characters) to log in.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);