import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css'; // Assuming you might have a global index.css
import './App.css'; // Import App.css
import App from './App.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
