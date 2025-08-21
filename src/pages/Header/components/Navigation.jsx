import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ navItems, currentPage, isSidebarNav, onClose }) => {
  return (
    <nav className={`header-nav ${isSidebarNav ? 'sidebar-nav' : ''}`}>
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={`/${item.id}`}
          className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
          onClick={onClose} // Close sidebar on navigation item click
        >
          <div className="nav-pixel-icon">
            {item.pixel.split('n').map((line, index) => (
              <div key={index} className="pixel-line">{line}</div>
            ))}
          </div>
          <span className="nav-label">{item.label}</span>
        </Link> // Changed to Link
      ))}
    </nav>
  );
};

export default Navigation;