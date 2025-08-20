import React from 'react';
import './MessageInput.css';

const MessageInput = ({ inputMessage, setInputMessage, onSendMessage, onKeyPress, isDisabled }) => {
  return (
    <div className="input-container">
      <textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="메뉴 추천을 받고 싶은 상황이나 기분을 알려주세요..."
        className="message-input"
        rows="2"
      />
      <button
        onClick={onSendMessage}
        className="send-button"
        disabled={isDisabled}
      >
        전송
      </button>
    </div>
  );
};

export default MessageInput;