import React from 'react';
import './QuickButtons.css';

const QuickButtons = ({ buttons, onButtonClick }) => {
  return (
    <div className="quick-buttons">
      {buttons.map(button => (
        <button
          key={button.value}
          className="quick-button"
          onClick={() => onButtonClick(button)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default QuickButtons;