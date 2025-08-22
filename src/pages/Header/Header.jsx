import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import UserProfile from './components/UserProfile';
import HamburgerButton from './components/HamburgerButton';
import Sidebar from './components/Sidebar';
import './Header.css';

import ChatbotDefault from '../../assets/icons/chatbot-default.svg';
import ChatbotActive from '../../assets/icons/chatbot-active.svg';
import PartiesDefault from '../../assets/icons/parties-default.svg';
import PartiesActive from '../../assets/icons/parties-active.svg';
import GamesDefault from '../../assets/icons/games-default.svg';
import GamesActive from '../../assets/icons/games-active.svg';
import RestaurantsDefault from '../../assets/icons/restaurants-default.svg';
import RestaurantsActive from '../../assets/icons/restaurants-active.svg';
import MypageDefault from '../../assets/icons/mypage-default.svg';
import MypageActive from '../../assets/icons/mypage-active.svg';

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
        default: ChatbotDefault,
        active: ChatbotActive,
      },
    },
    {
      id: 'party',
      label: 'PARTIES',
      icon: {
        default: PartiesDefault,
        active: PartiesActive,
      },
    },
    {
      id: 'betting',
      label: 'GAMES',
      icon: {
        default: GamesDefault,
        active: GamesActive,
      },
    },
    {
      id: 'restaurant',
      label: 'RESTAURANTS',
      icon: {
        default: RestaurantsDefault,
        active: RestaurantsActive,
      },
    },
    { 
      id: 'mypage', 
      label: 'MY PAGE', 
      icon: {
        default: MypageDefault,
        active: MypageActive,
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
