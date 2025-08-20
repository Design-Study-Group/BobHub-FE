import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturesGrid from './components/FeaturesGrid';
import RecentActivities from './components/RecentActivities';
import QuickStats from './components/QuickStats';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'chatbot',
      title: '🤖 AI 메뉴 추천',
      description: '오늘 뭐 먹을지 고민이세요? AI가 맞춤 메뉴를 추천해드려요!',
      color: '#4f46e5',
      stats: '일일 추천 수: 127개',
      path: '/chatbot'
    },
    {
      id: 'party',
      title: '👥 파티원 모집',
      description: '외식, 배달, 도시락! 함께 먹을 사람들을 찾아보세요.',
      color: '#059669',
      stats: '활성 파티: 8개',
      path: '/party'
    },
    {
      id: 'betting',
      title: '🎲 랜덤 게임',
      description: '사다리타기, 룰렛, 숫자 맞추기로 공정하게 패자를 정해보세요!',
      color: '#dc2626',
      stats: '진행 중인 게임: 3개',
      path: '/betting'
    },
    {
      id: 'restaurant',
      title: '🍽️ 맛집 추천',
      description: '강의장 주변 맛집 정보와 리뷰를 확인해보세요.',
      color: '#ea580c',
      stats: '등록된 맛집: 42개',
      path: '/restaurant'
    }
  ];

  const recentActivities = [
    { type: 'party', message: '김철수님이 "점심 치킨 파티" 모집을 시작했어요', time: '5분 전' },
    { type: 'betting', message: '이영희님이 "커피값 룰렛 게임"에서 패자가 결정되었어요', time: '15분 전' },
    { type: 'chatbot', message: 'AI가 "떡볶이 + 순대" 조합을 추천했어요', time: '30분 전' },
    { type: 'restaurant', message: '새로운 맛집 "홍대 돈까스"가 등록되었어요', time: '1시간 전' }
  ];

  const quickStats = [
    { number: '156', label: '전체 회원' },
    { number: '23', label: '온라인 회원' },
    { number: '89', label: '오늘 추천 수' }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>BobHub에 오신 것을 환영합니다! 🍚</h1>
          <p>부트캠프 수강생들과 함께하는 식사 커뮤니티에서 맛있는 하루를 시작하세요.</p>
        </div>

        <FeaturesGrid features={features} />
        <RecentActivities activities={recentActivities} />
        <QuickStats stats={quickStats} />
      </div>
    </div>
  );
};

export default Dashboard;