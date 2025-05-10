import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Add uuid for generating unique IDs
import { v4 as uuidv4 } from 'uuid';
window.uuidv4 = uuidv4;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
