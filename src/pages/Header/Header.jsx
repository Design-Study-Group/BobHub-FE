import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import UserProfile from './components/UserProfile';
import Sidebar from './components/Sidebar';
import HamburgerButton from './components/HamburgerButton';
import './Header.css';

const Header = ({ currentUser, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'chatbot', label: '메뉴 추천', icon: '🤖', path: '/chatbot' },
    { id: 'party', label: '파티원 모집', icon: '👥', path: '/party' },
    { id: 'betting', label: '랜덤 게임', icon: '🎲', path: '/betting' },
    { id: 'restaurant', label: '맛집 추천', icon: '🍽️', path: '/restaurant' }
  ];

  const sidebarNavItems = navigationItems.filter(item =>
    ['party', 'betting', 'restaurant'].includes(item.id)
  );

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link
            to="/"
            className="logo-button"
            title="홈으로 이동"
          >
            BobHub
          </Link>
        </div>

        <Navigation items={navigationItems} />

        <div className="header-right">
          <UserProfile currentUser={currentUser} onLogout={onLogout} />
          <HamburgerButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
      </div>

      <Sidebar
        items={sidebarNavItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
};

export default Header;