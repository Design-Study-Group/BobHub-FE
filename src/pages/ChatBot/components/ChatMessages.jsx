import React, { useRef, useEffect } from 'react';
import './ChatMessages.css';

const ChatMessages = ({ messages, isTyping, messagesEndRef }) => {
  const responseFormat = (text) => {
    // 1. **text**를 <strong>text</strong>로 변환
    const boldedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 2. ! 또는 ?를 자신 뒤에 <br />를 붙여서 변환
    //    이미 줄바꿈이나 <br />로 끝나지 않은 경우에만
    const withPunctuationBreaks = boldedText.replace(/([!?])(?![\n<])/g, '$1<br />');

    // 3. \n을 <br />로 변환
    const withLineBreaks = withPunctuationBreaks.replace(/\n/g, '<br />');

    return { __html: withLineBreaks };
  };

  return (
    <div className="messages-container">
      {messages.map(message => (
        <div key={message.id} className={`message ${message.type}`}>
          <div className="message-content">
            <div dangerouslySetInnerHTML={responseFormat(message.content)} />
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
  )
};

export default ChatMessages;