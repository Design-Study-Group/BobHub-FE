import React from 'react';
import './Sidebar.css';
import Navigation from '../../components/Navigation';
import UserProfile from '../../components/UserProfile';

const Sidebar = ({ isOpen, onClose, navItems, currentPage, setCurrentPage, currentUser, onLogout, theme }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-button pixel-button" onClick={onClose}>
          CLOSE
        </button>
      </div>
      <div className="sidebar-content">
        <Navigation navItems={navItems} currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarNav={true} onClose={onClose} theme={theme} />
        <div className="sidebar-footer">
          <button className="logout-button pixel-button" onClick={() => { onLogout(); onClose(); }}>
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;