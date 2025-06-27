import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/firebase'; // Initialize Firebase before rendering

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);