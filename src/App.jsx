import React, { useState } from 'react';
import useTheme from './hooks/useTheme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/Header/Header';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ChatBot from './pages/ChatBot/ChatBot';
import PartyChat from './pages/PartyChat/PartyChat';
import BettingParty from './pages/BettingParty/BettingParty';
import RestaurantRecommend from './pages/RestaurantRecommend/RestaurantRecommend';
import MyPage from './pages/MyPage/MyPage';
import './App.css';

export default function App() {
  const { theme } = useTheme();
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
      <div className={`app ${theme}`}>
        <Header 
          currentUser={currentUser}
          onLogout={handleLogout}
          theme={theme}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/party" element={<PartyChat currentUser={currentUser} />} />
            <Route path="/betting" element={<BettingParty currentUser={currentUser} />} />
            <Route path="/restaurant" element={<RestaurantRecommend />} />
            <Route path="/mypage" element={<MyPage currentUser={currentUser} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}