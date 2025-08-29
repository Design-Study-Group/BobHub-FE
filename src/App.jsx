import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 추가
import useTheme from './hooks/useTheme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/Header/Header';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ChatBot from './pages/ChatBot/ChatBot';
import PartyChat from './pages/PartyChat/PartyChat';
import BettingParty from './pages/BettingParty/BettingParty';
import RestaurantRecommend from './pages/RestaurantRecommend/RestaurantRecommend';
import RestaurantDetail from './pages/RestaurantRecommend/components/RestaurantDetail'; // 추가
import MyPage from './pages/MyPage/MyPage';
import CallBack from './auth/CallBack';
import { logoutUser, getUserProfile } from './api/oauth';
import { getRecommendationById } from './api/restaurantApi'; // 추가
import './App.css';

// RestaurantDetailWrapper 컴포넌트 정의
const RestaurantDetailWrapper = ({ currentUser }) => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRecommendationById(id);
        setRestaurant(data);
      } catch (err) {
        console.error("Failed to fetch restaurant details:", err);
        setError('맛집 상세 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return <div className="loading">맛집 상세 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!restaurant) {
    return <div className="error">맛집 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <RestaurantDetail 
      restaurant={restaurant}
      onBack={() => navigate(-1)} // 뒤로 가기 기능
      currentUser={currentUser} // currentUser 전달
    />
  );
};

export default function App() {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(!!JSON.parse(localStorage.getItem('user')));
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Backend logout failed, proceeding with client-side logout.", error);
    } finally {
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isLoggedIn) {
        try {
          const response = await getUserProfile();
          if (response && response.data) {
            const updatedUser = { ...currentUser, ...response.data };
            setCurrentUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          handleLogout();
        }
      }
    };
    fetchProfile();
  }, [isLoggedIn]);

  const handleLogin = useCallback((userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true);
      setCurrentUser(userData);
    } else {
      console.error("Login failed: No user data provided.", userData);
      alert("로그인에 실패했습니다. 사용자 정보를 확인해주세요.");
    }
  }, []);

  console.log('App.jsx rendering with:', { isLoggedIn, currentUser });
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
              <Route path="/restaurant" element={<RestaurantRecommend currentUser={currentUser} />} />
              <Route path="/restaurant/:id" element={<RestaurantDetailWrapper currentUser={currentUser} />} /> {/* 추가 */}
              <Route path="/mypage" element={<MyPage currentUser={currentUser} />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      )}
    </BrowserRouter>
  );
}