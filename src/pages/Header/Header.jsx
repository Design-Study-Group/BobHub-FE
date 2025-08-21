import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for logo
import Navigation from './components/Navigation';
import UserProfile from './components/UserProfile';
import HamburgerButton from './components/HamburgerButton';
import Sidebar from './components/Sidebar';
import './Header.css';

// Removed setCurrentPage from Header props
const Header = ({ currentUser, currentPage, onLogout, theme, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { 
      id: 'chatbot', 
      label: 'MENU BOT', 
      icon: '🤖',
      pixel: '████n█▲▲█n█  █n████'
    },
    { 
      id: 'party', 
      label: 'PARTIES', 
      icon: '👥',
      pixel: '█ █ n███ n█ █ n█ █ '
    },
    { 
      id: 'betting', 
      label: 'GAMES', 
      icon: '🎮',
      pixel: '████n█▼▼█n████n█  █'
    },
    { 
      id: 'restaurant', 
      label: 'RESTAURANTS', 
      icon: '🍕',
      pixel: '▲▲▲▲n████n████n▼▼▼▼'
    },
    { 
      id: 'mypage', 
      label: 'MY PAGE', 
      icon: '👤',
      pixel: '█  █n████n█  █n█  █'
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
            // Removed setCurrentPage
          />
          <UserProfile currentUser={currentUser} onLogout={onLogout} /* Removed setCurrentPage */ />
        </div>

        {/* Mobile Hamburger Button */}
        <HamburgerButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
      </div>
      
      {/* 픽셀 라인 애니메이션 */}
      <div className="header-bottom-line">
        <div className="pixel-line-animation"></div>
      </div>

      {/* Sidebar for Mobile */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={toggleSidebar} 
        navItems={navItems} 
        currentPage={currentPage} 
        // Removed setCurrentPage
        currentUser={currentUser}
        onLogout={onLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </header>
  );
};

export default Header;