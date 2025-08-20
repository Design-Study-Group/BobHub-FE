import React from 'react';
import './GameCard.css';

const GameCard = ({ game, punishments, onSelectGame }) => (
  <div className="game-card" onClick={() => onSelectGame(game)}>
    <div className="game-card-header">
      <h3>{game.title}</h3>
      <span className={`game-status ${game.status}`}>
        {game.status === 'waiting' && '참여자 모집중'}
        {game.status === 'active' && '진행중'}
        {game.status === 'completed' && '완료'}
      </span>
    </div>
    <p className="game-description">{game.description}</p>
    <div className="game-info">
      <div className="game-meta">
        <span>👥 {game.participants.length}/{game.maxParticipants}</span>
        <span>😱 패자 {game.losersCount}명</span>
      </div>
      <div className="punishment-info">
        벌칙: {punishments.find(p => p.id === game.punishment.type)?.label}
        {punishments.find(p => p.id === game.punishment.type)?.icon && (
          <img
            src={punishments.find(p => p.id === game.punishment.type).icon}
            alt={punishments.find(p => p.id === game.punishment.type).label}
            className="punishment-icon" // Add a class for styling
          />
        )}
      </div>
      <div className="game-creator">만든이: {game.creator}</div>
      {game.result?.losers && (
        <div className="game-losers">
          😭 패자: {game.result.losers.join(', ')}
        </div>
      )}
    </div>
  </div>
);

export default GameCard;