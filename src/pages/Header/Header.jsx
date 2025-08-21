import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import UserProfile from './components/UserProfile';
import HamburgerButton from './components/HamburgerButton';
import Sidebar from './components/Sidebar';
import './Header.css';

import ChatbotLight from '../../assets/icons/chatbot-light.svg';
import ChatbotDark from '../../assets/icons/chatbot-dark.svg';
import PartiesLight from '../../assets/icons/parties-light.svg';
import PartiesDark from '../../assets/icons/parties-dark.svg';
import GamesLight from '../../assets/icons/games-light.svg';
import GamesDark from '../../assets/icons/games-dark.svg';
import RestaurantsLight from '../../assets/icons/restaurants-light.svg';
import RestaurantsDark from '../../assets/icons/restaurants-dark.svg';
import MypageLight from '../../assets/icons/mypage-light.svg';
import MypageDark from '../../assets/icons/mypage-dark.svg';

const Header = ({ currentUser, currentPage, onLogout, theme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { 
      id: 'chatbot', 
      label: 'MENU BOT', 
      icon: {
        light: ChatbotLight,
        dark: ChatbotDark,
      },
    },
    {
      id: 'party',
      label: 'PARTIES',
      icon: {
        light: PartiesLight,
        dark: PartiesDark,
      },
    },
    {
      id: 'betting',
      label: 'GAMES',
      icon: {
        light: GamesLight,
        dark: GamesDark,
      },
    },
    {
      id: 'restaurant',
      label: 'RESTAURANTS',
      icon: {
        light: RestaurantsLight,
        dark: RestaurantsDark,
      },
    },
    { 
      id: 'mypage', 
      label: 'MY PAGE', 
      icon: {
        light: MypageLight,
        dark: MypageDark,
      },
    }
  ];


  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link
            to="/"
            className="logo-button"
          >
            <span className="logo-text soft-glow-text">BOBHUB</span>
          </Link>
        </div>

        <div className="desktop-nav-user-profile">
          <Navigation 
            navItems={navItems.filter(item => item.id !== 'mypage')} 
            currentPage={currentPage} 
            theme={theme} 
          />
          <UserProfile currentUser={currentUser} onLogout={onLogout} />
        </div>

        {/* 모바일 햄버거 버튼 */}
        <HamburgerButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
      </div>
      
      {/* 픽셀 라인 애니메이션 */}
      <div className="header-bottom-line">
        <div className="pixel-line-animation"></div>
      </div>

      {/* 모바일용 사이드바 */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={toggleSidebar} 
        navItems={navItems} 
        currentPage={currentPage} 
        currentUser={currentUser}
        onLogout={onLogout}
        theme={theme}
      />
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </header>
  );
};

export default Header;
