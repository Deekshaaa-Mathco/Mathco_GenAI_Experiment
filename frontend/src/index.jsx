

import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. REACT 18+ ERROR HOOKS FOR SENTRY!
root.render(<App />);

// 3. PERFORMANCE TRACING
reportWebVitals();