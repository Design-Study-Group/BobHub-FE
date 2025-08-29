import React from 'react';
import FeaturesGrid from './components/FeaturesGrid';
import RecentActivities from './components/RecentActivities';
import './Dashboard.css';

const Dashboard = ({ setCurrentPage }) => {
  const features = [
    {
      id: 'chatbot',
      title: 'AI 메뉴 추천',
      description: 'AI가 맞춤 메뉴를 추천해드려요.',
      color: 'soft-purple',
    },
    {
      id: 'party',
      title: '파티원 모집',
      description: '함께 먹을 사람들을 찾아보세요.',
      color: 'soft-blue',
    },
    {
      id: 'betting',
      title: '랜덤 게임',
      description: '공정하게 패자를 정하는 게임을 즐겨보세요.',
      color: 'soft-pink',
    },
    {
      id: 'restaurant',
      title: '맛집 추천',
      description: '수강생 리뷰로 강의장 주변 맛집을 찾아보세요.',
      color: 'soft-cyan',
    }
  ];

  const recentActivities = [
    { type: 'party', message: '김철수님이 "점심 치킨 파티" 모집을 시작했어요', time: '5분 전', color: 'soft-blue' },
    { type: 'betting', message: '이영희님이 "커피값 룰렛 게임"에서 패자가 결정되었어요', time: '15분 전', color: 'soft-pink' },
    { type: 'chatbot', message: 'AI가 "떡볶이 + 순대" 조합을 추천했어요', time: '30분 전', color: 'soft-purple' },
    { type: 'restaurant', message: '새로운 맛집 "홍대 돈까스"가 등록되었어요', time: '1시간 전', color: 'soft-cyan' }
  ];

  return (
    <div className="pixel-dashboard">
      <div className="container">
        <div className="dashboard-intro">
          <div className="intro-content">
            <h1 className="intro-title subtle-glitch" data-text="WELCOME TO BOBHUB">
              WELCOME TO BOBHUB
            </h1>
            <p className="intro-subtitle">
              THE ULTIMATE FOOD COMMUNITY FOR FASTCAMPUS STUDENTS
            </p>
            <div className="intro-pixel-art">
              <div className="pixel-food-icons">
                🍕 🍔 🌮 🍜 🍱 🍗 🍟 🥤
              </div>
            </div>
          </div>
          <FeaturesGrid features={features} setCurrentPage={setCurrentPage} />
        </div>

        <RecentActivities recentActivities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;