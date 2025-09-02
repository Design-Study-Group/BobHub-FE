import React, { useState, useEffect } from 'react';
import './ProfileSection.css';
import defaultProfileImage from '../../../assets/icons/default-profile.png';
import { updateUserProfile, deleteUser, logoutUser } from '../../../api/oauth';

// SVG Icon Component
const PencilIcon = () => (
  <svg width="20" height="20" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1128_12284)">
      <path d="M32.8501 6.1H31.3201V10.67H32.8501V6.1Z" fill="currentColor"/>
      <path d="M31.32 10.67H29.8V12.19H31.32V10.67Z" fill="currentColor"/>
      <path d="M31.32 4.57H29.8V6.1H31.32V4.57Z" fill="currentColor"/>
      <path d="M29.8002 12.19H28.2802V13.71H29.8002V12.19Z" fill="currentColor"/>
      <path d="M29.8002 3.05H28.2802V4.57H29.8002V3.05Z" fill="currentColor"/>
      <path d="M28.2801 13.71H26.7501V15.24H28.2801V13.71Z" fill="currentColor"/>
      <path d="M28.2801 10.67H26.7501V12.19H28.2801V10.67Z" fill="currentColor"/>
      <path d="M28.2801 1.52H26.7501V3.05H28.2801V1.52Z" fill="currentColor"/>
      <path d="M26.7501 15.24H25.2301V16.76H26.7501V15.24Z" fill="currentColor"/>
      <path d="M26.7501 9.14H25.2301V10.67H26.7501V9.14Z" fill="currentColor"/>
      <path d="M25.2301 16.76H23.7001V18.29H25.2301V16.76Z" fill="currentColor"/>
      <path d="M25.2301 10.67H23.7001V12.19H25.2301V10.67Z" fill="currentColor"/>
      <path d="M25.2301 7.62H23.7001V9.14H25.2301V7.62Z" fill="currentColor"/>
      <path d="M26.7501 0H22.1801V1.52H26.7501V0Z" fill="currentColor"/>
      <path d="M23.7001 18.29H22.1801V19.81H23.7001V18.29Z" fill="currentColor"/>
      <path d="M23.7001 12.19H22.1801V13.71H23.7001V12.19Z" fill="currentColor"/>
      <path d="M23.7001 6.1H22.1801V7.62H23.7001V6.1Z" fill="currentColor"/>
      <path d="M22.1802 19.81H20.6602V21.33H22.1802V19.81Z" fill="currentColor"/>
      <path d="M22.1802 13.71H20.6602V15.24H22.1802V13.71Z" fill="currentColor"/>
      <path d="M22.1802 7.62H20.6602V9.14H22.1802V7.62Z" fill="currentColor"/>
      <path d="M22.1802 4.57H20.6602V6.1H22.1802V4.57Z" fill="currentColor"/>
      <path d="M22.1802 1.52H20.6602V3.05H22.1802V1.52Z" fill="currentColor"/>
      <path d="M20.6601 21.33H19.1301V22.86H20.6601V21.33Z" fill="currentColor"/>
      <path d="M20.6601 15.24H19.1301V16.76H20.6601V15.24Z" fill="currentColor"/>
      <path d="M20.6601 9.14H19.1301V10.67H20.6601V9.14Z" fill="currentColor"/>
      <path d="M20.6601 3.05H19.1301V4.57H20.6601V3.05Z" fill="currentColor"/>
      <path d="M19.1301 22.86H17.6101V24.38H19.1301V22.86Z" fill="currentColor"/>
      <path d="M19.1301 16.76H17.6101V18.29H19.1301V16.76Z" fill="currentColor"/>
      <path d="M19.1301 10.67H17.6101V12.19H19.1301V10.67Z" fill="currentColor"/>
      <path d="M19.1301 4.57H17.6101V6.1H19.1301V4.57Z" fill="currentColor"/>
      <path d="M17.6101 24.38H16.0901V25.9H17.6101V24.38Z" fill="currentColor"/>
      <path d="M17.6101 18.29H16.0901V19.81H17.6101V18.29Z" fill="currentColor"/>
      <path d="M17.6101 12.19H16.0901V13.71H17.6101V12.19Z" fill="currentColor"/>
      <path d="M17.6101 6.1H16.0901V7.62H17.6101V6.1Z" fill="currentColor"/>
      <path d="M16.0901 25.9H14.5601V27.43H16.0901V25.9Z" fill="currentColor"/>
      <path d="M16.0901 19.81H14.5601V21.33H16.0901V19.81Z" fill="currentColor"/>
      <path d="M16.0901 13.71H14.5601V15.24H16.0901V13.71Z" fill="currentColor"/>
      <path d="M16.0901 7.62H14.5601V9.14H16.0901V7.62Z" fill="currentColor"/>
      <path d="M14.56 27.43H13.04V28.95H14.56V27.43Z" fill="currentColor"/>
      <path d="M14.56 21.33H13.04V22.86H14.56V21.33Z" fill="currentColor"/>
      <path d="M14.56 15.24H13.04V16.76H14.56V15.24Z" fill="currentColor"/>
      <path d="M14.56 9.14H13.04V10.67H14.56V9.14Z" fill="currentColor"/>
      <path d="M13.0401 22.86H11.5101V24.38H13.0401V22.86Z" fill="currentColor"/>
      <path d="M13.0401 16.76H11.5101V18.29H13.0401V16.76Z" fill="currentColor"/>
      <path d="M13.0401 10.67H11.5101V12.19H13.0401V10.67Z" fill="currentColor"/>
      <path d="M11.5101 30.48H13.0401V28.95H11.5101V24.38H8.4701V21.33H3.9001V19.81H2.3701V21.33H0.850098V32H11.5101V30.48ZM9.9901 30.48H5.4201V28.95H3.9001V27.43H2.3701V22.86H6.9401V25.9H9.9901V30.48Z" fill="currentColor"/>
      <path d="M11.5101 18.29H9.99011V19.81H11.5101V18.29Z" fill="currentColor"/>
      <path d="M11.5101 12.19H9.99011V13.71H11.5101V12.19Z" fill="currentColor"/>
      <path d="M9.99009 19.81H8.47009V21.33H9.99009V19.81Z" fill="currentColor"/>
      <path d="M9.99009 13.71H8.47009V15.24H9.99009V13.71Z" fill="currentColor"/>
      <path d="M8.47006 15.24H6.94006V16.76H8.47006V15.24Z" fill="currentColor"/>
      <path d="M6.94004 16.76H5.42004V18.29H6.94004V16.76Z" fill="currentColor"/>
      <path d="M5.42015 18.29H3.90015V19.81H5.42015V18.29Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_1128_12284">
        <rect width="32" height="32" fill="white" transform="translate(0.850098)"/>
      </clipPath>
    </defs>
  </svg>
);

const ProfileSection = ({ userProfile, setCurrentUser }) => {
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [initialName, setInitialName] = useState(userProfile.name);

  useEffect(() => {
    setName(userProfile.name);
    setInitialName(userProfile.name);
  }, [userProfile.name]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setName(initialName);
    }
    setIsEditing(!isEditing);
  };

  const handleNameSave = async () => {
    if (name === initialName) {
      setIsEditing(false);
      return;
    }
    try {
      await updateUserProfile({ name: name });
      const updatedUser = { ...userProfile, name };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setInitialName(name);
      setIsEditing(false);
      alert('이름이 성공적으로 변경되었습니다.');
    } catch (error) {
      alert('이름 변경에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 회원에서 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await deleteUser();
        alert('회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');

        // 탈퇴 성공 후 로그아웃 처리
        try {
          await logoutUser();
        } finally {
          window.location.href = '/'; // 로그아웃 API 호출 결과와 상관없이 홈으로 이동
        }
      } catch (error) {
        alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
      }
    }
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
          {isEditing ? (
            <div className="inline-edit-container">
              <input type="text" value={name} onChange={handleNameChange} className="profile-name-input" />
              <button onClick={handleNameSave} className="btn btn-save">저장</button>
              <button onClick={handleEditToggle} className="btn btn-cancel">취소</button>
            </div>
          ) : (
            <div className="profile-name-container">
              <h3>{name}</h3>
              <button onClick={handleEditToggle} className="edit-icon-btn">
                <PencilIcon />
              </button>
            </div>
          )}
          <p>이메일: {userProfile.email}</p>
          <button onClick={handleDeleteAccount} className="btn-delete">회원 탈퇴</button>
          <p>{userProfile.bio}</p>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;