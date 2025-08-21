import React, { useRef, useEffect } from 'react';
import './ChatMessages.css';

const ChatMessages = ({ messages, isTyping, messagesEndRef }) => {
  

  return (
    <div className="messages-container">
      {messages.map(message => (
        <div key={message.id} className={`message ${message.type}`}>
          <div className="message-content">
            {message.content.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <div className="message-time">
            {message.timestamp.toLocaleTimeString('ko-KR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="message bot">
          <div className="message-content typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;