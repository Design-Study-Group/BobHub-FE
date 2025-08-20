import React from 'react';
import './Dashboard.css';

const Dashboard = ({ setCurrentPage }) => {
  const features = [
    {
      id: 'chatbot',
      title: '🤖 AI 메뉴 추천',
      description: '오늘 뭐 먹을지 고민이세요? AI가 맞춤 메뉴를 추천해드려요!',
      color: '#4f46e5',
      stats: '일일 추천 수: 127개'
    },
    {
      id: 'party',
      title: '👥 파티원 모집',
      description: '외식, 배달, 도시락! 함께 먹을 사람들을 찾아보세요.',
      color: '#059669',
      stats: '활성 파티: 8개'
    },
    {
      id: 'betting',
      title: '🎲 랜덤 게임',
      description: '사다리타기, 룰렛, 숫자 맞추기로 공정하게 패자를 정해보세요!',
      color: '#dc2626',
      stats: '진행 중인 게임: 3개'
    },
    {
      id: 'restaurant',
      title: '🍽️ 맛집 추천',
      description: '강의장 주변 맛집 정보와 리뷰를 확인해보세요.',
      color: '#ea580c',
      stats: '등록된 맛집: 42개'
    }
  ];

  const recentActivities = [
    { type: 'party', message: '김철수님이 "점심 치킨 파티" 모집을 시작했어요', time: '5분 전' },
    { type: 'betting', message: '이영희님이 "커피값 룰렛 게임"에서 패자가 결정되었어요', time: '15분 전' },
    { type: 'chatbot', message: 'AI가 "떡볶이 + 순대" 조합을 추천했어요', time: '30분 전' },
    { type: 'restaurant', message: '새로운 맛집 "홍대 돈까스"가 등록되었어요', time: '1시간 전' }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>BobHub에 오신 것을 환영합니다! 🍚</h1>
          <p>부트캠프 수강생들과 함께하는 식사 커뮤니티에서 맛있는 하루를 시작하세요.</p>
        </div>

        <div className="features-grid">
          {features.map(feature => (
            <div 
              key={feature.id}
              className="feature-card"
              onClick={() => setCurrentPage(feature.id)}
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-header">
                <h3>{feature.title}</h3>
                <div className="feature-icon-bg">
                  <span>{feature.title.split(' ')[0]}</span>
                </div>
              </div>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-stats">{feature.stats}</div>
              <button className="feature-btn">시작하기 →</button>
            </div>
          ))}
        </div>

        <div className="recent-section">
          <h2>최근 활동</h2>
          <div className="recent-activities">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'party' && '👥'}
                  {activity.type === 'betting' && '🎲'}
                  {activity.type === 'chatbot' && '🤖'}
                  {activity.type === 'restaurant' && '🍽️'}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-number">156</div>
            <div className="stat-label">전체 회원</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">23</div>
            <div className="stat-label">온라인 회원</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">89</div>
            <div className="stat-label">오늘 추천 수</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;