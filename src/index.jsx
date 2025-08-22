import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import './App.css'; // Import App.css
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
);
