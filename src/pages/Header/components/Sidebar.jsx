import React from 'react';
import './Sidebar.css';
import Navigation from './Navigation'; // Re-use Navigation component
import UserProfile from './UserProfile'; // Re-use UserProfile component

const Sidebar = ({ isOpen, onClose, navItems, currentPage, setCurrentPage, currentUser, onLogout, theme, toggleTheme }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-button pixel-button" onClick={onClose}>
          CLOSE
        </button>
      </div>
      <div className="sidebar-content">
        <Navigation navItems={navItems} currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarNav={true} onClose={onClose} />
        
      </div>
    </div>
  );
};

export default Sidebar;