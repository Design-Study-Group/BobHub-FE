import React from 'react';
import './QuickButtons.css';

const QuickButtons = ({ buttons, onButtonClick }) => {
  return (
    <div className="quick-buttons">
      {buttons.map(button => (
        <button
          key={button}
          className="quick-button"
          onClick={() => onButtonClick(button)}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default QuickButtons;