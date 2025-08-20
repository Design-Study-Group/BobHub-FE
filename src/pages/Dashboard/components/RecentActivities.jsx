import React from 'react';
import './RecentActivities.css';

const RecentActivities = ({ activities }) => {
  return (
    <div className="recent-section">
      <h2>최근 활동</h2>
      <div className="recent-activities">
        {activities.map((activity, index) => (
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
  );
};

export default RecentActivities;