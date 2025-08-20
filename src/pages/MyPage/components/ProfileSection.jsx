import React from 'react';
import './ProfileSection.css';

const ProfileSection = ({ userProfile }) => {
  return (
    <section className="profile-section">
      <h2>내 프로필</h2>
      <div className="profile-card">
        <img src={userProfile.profileImage} alt="프로필 이미지" className="profile-image" />
        <div className="profile-info">
          <h3>{userProfile.name}</h3>
          <p>이메일: {userProfile.email}</p>
          <p>가입일: {userProfile.memberSince}</p>
          <p>{userProfile.bio}</p>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;