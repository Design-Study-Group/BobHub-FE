import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeaturesGrid.css';

const FeaturesGrid = ({ features }) => {
  const navigate = useNavigate();

  return (
    <div className="features-grid">
      {features.map(feature => (
        <div 
          key={feature.id}
          className="feature-card"
          onClick={() => navigate(feature.path)}
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
  );
};

export default FeaturesGrid;