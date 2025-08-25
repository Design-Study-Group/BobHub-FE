import React, { useState, useCallback, useEffect } from 'react';
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
import CallBack from './auth/CallBack';
import { logoutUser, getUserProfile } from './api/oauth';
import './App.css';


export default function App() {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const fetchProfile = async () => {
      if (isLoggedIn) {
        try {
          const response = await getUserProfile();
          if (response && response.data) {
            setCurrentUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      }
    };
    fetchProfile();
  }, [isLoggedIn]);

  const handleLogin = useCallback((userData) => {
    // 백엔드 응답에 'accessToken' 필드가 포함되어 있다고 가정합니다.
    // 필드명이 다를 경우 (예: token) 이 부분을 수정해야 합니다.
    if (userData && userData.accessToken) {
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true);
      setCurrentUser(userData);
    } else {
      console.error("Login failed: No accessToken in response.", userData);
      alert("로그인에 실패했습니다. 서버 응답을 확인해주세요.");
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Backend logout failed, proceeding with client-side logout.", error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, []);

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/auth/CallBack" element={<CallBack onLogin={handleLogin} />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      ) : (
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
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      )}
    </BrowserRouter>
  );
}