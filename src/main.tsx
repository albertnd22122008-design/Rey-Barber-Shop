import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker for offline support & installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        // SW registered
      })
      .catch((err) => {
        console.warn('[PWA] SW registration notice:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
