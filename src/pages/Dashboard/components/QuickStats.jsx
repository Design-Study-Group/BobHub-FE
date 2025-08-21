import React from 'react';
import './QuickStats.css';

const QuickStats = ({ stats }) => {
  return (
    <div className="hero-stats">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-item ${stat.color}`}>
          <div className="stat-number">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;