import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initDynamic3DFavicon } from './utils/dynamicFavicon';

// Initialize real-time 3D gyroscopic animated browser favicon
initDynamic3DFavicon();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
