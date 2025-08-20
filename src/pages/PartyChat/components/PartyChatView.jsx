import React from 'react';
import './PartyChatView.css';

const PartyChatView = ({ party, currentUser, onBack, onJoinParty }) => {
  return (
    <div className="party-chat">
      <div className="chat-header">
        <button
          className="back-btn"
          onClick={onBack}
        >
          ← 목록으로
        </button>
        <div className="chat-info">
          <h3>{party.title}</h3>
          <span>{party.members.length}/{party.maxMembers}명 참여중</span>
        </div>
        {!party.members.includes(currentUser.name) && (
          <button
            className="join-btn"
            onClick={() => onJoinParty(party.id)}
          >
            참여하기
          </button>
        )}
      </div>

      <div className="chat-messages">
        {party.messages.map(message => (
          <div
            key={message.id}
            className={`chat-message ${message.user === currentUser.name ? 'own' : ''}`}
          >
            <div className="message-info">
              <span className="message-user">{message.user}</span>
              <span className="message-time">{message.time}</span>
            </div>
            <div className="message-content">{message.message}</div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="message-input"
        />
        <button className="send-btn">전송</button>
      </div>
    </div>
  );
};

export default PartyChatView;