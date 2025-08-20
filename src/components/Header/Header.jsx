import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = ({ currentUser, onLogout }) => {
  const navigationItems = [
    { id: 'dashboard', label: '대시보드', icon: '🏠', path: '/' },
    { id: 'chatbot', label: '메뉴 추천', icon: '🤖', path: '/chatbot' },
    { id: 'party', label: '파티원 모집', icon: '👥', path: '/party' },
    { id: 'betting', label: '랜덤 게임', icon: '🎲', path: '/betting' },
    { id: 'restaurant', label: '맛집 추천', icon: '🍽️', path: '/restaurant' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link 
            to="/" 
            className="logo-button" 
            title="홈으로 이동"
          >
            🍚 BobHub
          </Link>
        </div>
        
        <nav className="header-nav">
          {navigationItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="header-right">
          <div className="user-info">
            <img 
              src={currentUser?.profileImage || '/api/placeholder/32/32'} 
              alt="프로필" 
              className="user-avatar"
            />
            <span className="user-name">{currentUser?.name}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;