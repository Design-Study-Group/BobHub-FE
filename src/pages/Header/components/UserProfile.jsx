import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = ({ currentUser, onLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-profile-menu" ref={profileMenuRef}>
      <button className="user-profile-button" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
        <img
          src={currentUser?.profileImage || '/api/placeholder/32/32'}
          alt="프로필"
          className="user-avatar"
        />
        <span className="user-name">{currentUser?.name}</span>
      </button>

      {isProfileMenuOpen && (
        <div className="profile-dropdown">
          <Link to="/mypage" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
            마이페이지
          </Link>
          <button className="dropdown-item" onClick={() => { onLogout(); setIsProfileMenuOpen(false); }}>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;