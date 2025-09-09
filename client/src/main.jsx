import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/* ================== Theme Bootstrap ================== */
const THEME_KEY = 'theme'; // allowed: 'soft-dark' | 'hc' | null/anything else => default (Glassy Dark)

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'soft-dark' || theme === 'hc') {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme'); // default Glassy Dark from :root in index.css
  }
}

try {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved);
} catch {
  // ignore storage access issues
}

// Enable smooth transitions for any subsequent theme changes
document.body?.classList.add('theme-transition');

// Sync theme if changed from another tab/window
window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY) applyTheme(e.newValue);
});
/* ===================================================== */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
