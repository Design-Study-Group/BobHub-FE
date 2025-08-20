import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ChatBot from './components/ChatBot/ChatBot';
import PartyChat from './components/PartyChat/PartyChat';
import BettingParty from './components/BettingParty/BettingParty';
import RestaurantRecommend from './components/RestaurantRecommend/RestaurantRecommend';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Header 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/party" element={<PartyChat currentUser={currentUser} />} />
            <Route path="/betting" element={<BettingParty currentUser={currentUser} />} />
            <Route path="/restaurant" element={<RestaurantRecommend />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}