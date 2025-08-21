import React from 'react';
import './HamburgerButton.css';

const HamburgerButton = ({ isOpen, onClick }) => {
  return (
    <button className={`hamburger-button ${isOpen ? 'open' : ''}`} onClick={onClick}>
      <div className="hamburger-line"></div>
      <div className="hamburger-line"></div>
      <div className="hamburger-line"></div>
    </button>
  );
};

export default HamburgerButton;