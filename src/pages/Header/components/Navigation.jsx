import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ navItems, currentPage, isSidebarNav, onClose, theme }) => {
  return (
    <nav className={`header-nav ${isSidebarNav ? 'sidebar-nav' : ''}`}>
      {navItems.map((item) => {
        const IconComponent = item.icon ? item.icon[theme] : null; // Get the correct icon component

        return (
          <Link
            key={item.id}
            to={`/${item.id}`}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={onClose} // Close sidebar on navigation item click
          >
            <div className="nav-icon">
              {IconComponent ? (
                <img src={IconComponent} alt={item.label} className="nav-svg-icon" />
              ) : (
                // Fallback for pixel art if needed, though all should be SVG now
                item.pixel && item.pixel.split('n').map((line, index) => (
                  <div key={index} className="pixel-line">{line}</div>
                ))
              )}
            </div>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;