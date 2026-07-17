import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = document.getElementById('root')!;
// routes are prerendered to static HTML for crawlers; the live app replaces it
if (root.hasChildNodes()) root.innerHTML = '';
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
