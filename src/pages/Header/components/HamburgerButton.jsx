import React from 'react';
import './HamburgerButton.css';

const HamburgerButton = ({ onClick }) => {
  return (
    <button
      className="hamburger-button"
      onClick={onClick}
      aria-label="메뉴 열기"
    >
      ☰
    </button>
  );
};

export default HamburgerButton;