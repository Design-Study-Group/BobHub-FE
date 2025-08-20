import React from 'react';
import './QuickStats.css';

const QuickStats = ({ stats }) => {
  return (
    <div className="quick-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <div className="stat-number">{stat.number}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;