import React from 'react';
import ProfileSection from './components/ProfileSection';
import ActivitySection from './components/ActivitySection';
import './MyPage.css';

const MyPage = ({ currentUser }) => {
  // Mock user data (can be replaced with actual user data from props or context)
  const userProfile = currentUser || {
    name: '김철수',
    email: 'kim.chulsoo@example.com',
    profileImage: '/api/placeholder/128/128',
    memberSince: '2024-01-15',
    bio: 'BobHub에서 맛있는 식사를 즐기는 것을 좋아하는 수강생입니다.'
  };

  // Mock activity history
  const activityHistory = [
    { id: 1, type: 'party', message: '"점심 치킨 파티" 모집에 참여했습니다.', date: '2025-08-19 12:00' },
    { id: 2, type: 'betting', message: '"커피값 룰렛 게임"에서 패자가 되었습니다.', date: '2025-08-18 15:30' },
    { id: 3, type: 'restaurant', message: '"홍대 돈까스" 맛집에 리뷰를 남겼습니다.', date: '2025-08-17 19:00' },
    { id: 4, type: 'chatbot', message: 'AI에게 "저녁 메뉴"를 추천받았습니다.', date: '2025-08-16 18:00' },
    { id: 5, type: 'party', message: '"도시락 나눠먹기" 파티를 생성했습니다.', date: '2025-08-15 11:00' },
  ];

  return (
    <div className="mypage-container">
      <div className="container">
        <h1>마이페이지</h1>
        <ProfileSection userProfile={userProfile} />
        <ActivitySection activityHistory={activityHistory} />
      </div>
    </div>
  );
};

export default MyPage;