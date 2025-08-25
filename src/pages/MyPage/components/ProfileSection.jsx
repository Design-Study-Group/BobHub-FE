import React, { useState } from 'react';
import './ProfileSection.css';
import defaultProfileImage from '../../../assets/icons/default-profile.png';

const ProfileSection = ({ userProfile }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <section className="profile-section">
      <h2>내 프로필</h2>
      <div className="profile-card">
        <img 
          src={imageError ? defaultProfileImage : (userProfile.picture || defaultProfileImage)}
          alt="프로필 이미지"
          className="profile-image"
          onError={handleImageError}
        />
        <div className="profile-info">
          <h3>{userProfile.name}</h3>
          <p>이메일: {userProfile.email}</p>
          <p>{userProfile.bio}</p>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;