import React, { useState, useEffect } from 'react';
import './ProfileSection.css';
import defaultProfileImage from '../../../assets/icons/default-profile.png';
import { updateUserProfile, deleteUser } from '../../../api/oauth';
import PencilIcon from '../../../assets/icons/pencil.svg?react';

const ProfileSection = ({ userProfile }) => {
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
        await logoutUser();
      } catch (error) {
        alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
      } finally {
        window.location.href = '/';
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