import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ navItems, currentPage, isSidebarNav, onClose, theme }) => {
  return (
    <nav className={`header-nav ${isSidebarNav ? 'sidebar-nav' : ''}`}>
      {navItems.map((item) => {
        

        return (
          <Link
            key={item.id}
            to={`/${item.id}`}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={onClose} // Close sidebar on navigation item click
          >
            <div className="nav-icon">
              <img src={item.icon.default} alt={item.label} className="nav-svg-icon nav-svg-icon-default" />
              <img src={item.icon.active} alt={item.label} className="nav-svg-icon nav-svg-icon-active" />
            </div>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;