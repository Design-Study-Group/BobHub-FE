import React from 'react';
import './FeaturesGrid.css';

const FeaturesGrid = ({ features, setCurrentPage }) => {
  return (
    <div className="features-section">
      <div className="features-grid">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`feature-card ${feature.color}`}
            onClick={() => setCurrentPage(feature.id)}
          >
            <div className="feature-content">
              {feature.icon && <img src={feature.icon} alt={feature.title} className="feature-icon" />}
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
            <div className="feature-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;