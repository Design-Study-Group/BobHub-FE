import React from 'react';
import FeaturesGrid from './components/FeaturesGrid';
import RecentActivities from './components/RecentActivities';
import QuickStats from './components/QuickStats';
import './Dashboard.css';

const Dashboard = ({ setCurrentPage }) => {
  const features = [
    {
      id: 'chatbot',
      title: 'AI 메뉴 추천',
      description: '오늘 뭐 먹을지 고민이세요? AI가 맞춤 메뉴를 추천해드려요!',
      stats: '일일 추천 수: 127개',
      color: 'soft-purple',
      pixel: '████n█▲▲█n█  █n████',
      icon: '🤖'
    },
    {
      id: 'party',
      title: '파티원 모집',
      description: '외식, 배달, 도시락! 함께 먹을 사람들을 찾아보세요.',
      stats: '활성 파티: 8개',
      color: 'soft-blue',
      pixel: '█ █ n███ n█ █ n█ █ ',
      icon: '👥'
    },
    {
      id: 'betting',
      title: '랜덤 게임',
      description: '사다리타기, 룰렛, 숫자 맞추기로 공정하게 패자를 정해보세요!',
      stats: '진행 중인 게임: 3개',
      color: 'soft-pink',
      pixel: '████n█▼▼█n████n█  █',
      icon: '🎮'
    },
    {
      id: 'restaurant',
      title: '맛집 추천',
      description: '수강생들의 생생한 리뷰를 통해 강의장 주변 맛집을 찾아보세요.',
      stats: '등록된 맛집: 42개',
      color: 'soft-cyan',
      pixel: '▲▲▲▲n████n████n▼▼▼▼',
      icon: '🍕'
    }
  ];

  const recentActivities = [
    { type: 'party', message: '김철수님이 "점심 치킨 파티" 모집을 시작했어요', time: '5분 전' },
    { type: 'betting', message: '이영희님이 "커피값 룰렛 게임"에서 패자가 결정되었어요', time: '15분 전' },
    { type: 'chatbot', message: 'AI가 "떡볶이 + 순대" 조합을 추천했어요', time: '30분 전' },
    { type: 'restaurant', message: '새로운 맛집 "홍대 돈까스"가 등록되었어요', time: '1시간 전' }
  ];

  const stats = [
    { label: 'USERS', value: '42', color: 'soft-purple' },
    { label: 'PARTIES', value: '8', color: 'soft-blue' },
    { label: 'GAMES', value: '23', color: 'soft-pink' },
    { label: 'FOODS', value: '156', color: 'soft-cyan' }
  ];

  return (
    <div className="pixel-dashboard">
      <div className="container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1 className="hero-title subtle-glitch" data-text="WELCOME TO BOBHUB">
              WELCOME TO BOBHUB
            </h1>
            <p className="hero-subtitle">
              THE ULTIMATE FOOD COMMUNITY FOR FASTCAMPUS STUDENTS
            </p>
            <div className="hero-pixel-art">
              <div className="pixel-food-icons">
                🍕 🍔 🌮 🍜 🍱 🍗 🍟 🥤
              </div>
            </div>
          </div>
          <QuickStats stats={stats} />
        </div>

        <FeaturesGrid features={features} setCurrentPage={setCurrentPage} />
        <RecentActivities recentActivities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;