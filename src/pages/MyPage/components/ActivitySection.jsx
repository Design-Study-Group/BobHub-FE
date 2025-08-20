import React from 'react';
import './ActivitySection.css';

const ActivitySection = ({ activityHistory }) => {
  return (
    <section className="activity-section">
      <h2>활동 기록</h2>
      <div className="activity-list">
        {activityHistory.map(activity => (
          <div key={activity.id} className="activity-item">
            <span className="activity-type">{activity.type === 'party' ? '👥 파티' : activity.type === 'betting' ? '🎲 게임' : activity.type === 'restaurant' ? '🍽️ 맛집' : '🤖 AI'}</span>
            <p className="activity-message">{activity.message}</p>
            <span className="activity-date">{activity.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActivitySection;