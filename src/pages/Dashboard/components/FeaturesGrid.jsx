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
            <div className="feature-header">
              <div className="feature-pixel-icon">
                {feature.pixel.split('n').map((line, index) => (
                  <div key={index} className="pixel-line">{line}</div>
                ))}
              </div>
              <div className="feature-icon">{feature.icon}</div>
            </div>
            <div className="feature-content">
              <div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              <div className="feature-card-bottom">
                <div className="feature-stats">{feature.stats}</div>
                <button className="feature-btn pixel-button">
                  ENTER
                </button>
              </div>
            </div>
            <div className="feature-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;