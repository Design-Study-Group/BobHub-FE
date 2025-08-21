import React from 'react';
import './RecentActivities.css';

const RecentActivities = ({ recentActivities }) => {
  return (
    <div className="activities-section">
      <h2 className="section-title soft-glow-text">RECENT ACTIVITIES</h2>
      <div className="activities-container pixel-card">
        {recentActivities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className={`activity-icon ${activity.color}`}>
              <div className="pixel-dot">█</div>
            </div>
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
            <div className="activity-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;