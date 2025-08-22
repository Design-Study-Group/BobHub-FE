import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import defaultProfileImage from '../../../assets/icons/default-profile.png';

const UserProfile = ({ currentUser, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false); // New state for image error
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMyPageClick = () => {
    navigate('/mypage');
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="user-profile-container">
      <div className="user-info-clickable" onClick={toggleDropdown}>
        <img
          src={imageError ? defaultProfileImage : (currentUser?.profileImage || defaultProfileImage)}
          alt="프로필"
          className="user-avatar"
          onError={handleImageError}
        />
        <span className="user-name">{currentUser?.name || 'PLAYER'}</span>
      </div>

      {isDropdownOpen && (
        <div className="user-dropdown">
          <button className="dropdown-item pixel-button" onClick={handleMyPageClick}>
            MY PAGE
          </button>
          <button className="dropdown-item pixel-button primary" onClick={handleLogoutClick}>
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;