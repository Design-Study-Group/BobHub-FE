import React, { useState } from 'react';
import './BettingParty.css';
import LadderGame from './LadderGame/LadderGame';
import RouletteGame from './RouletteGame/RouletteGame'; // Import RouletteGame
import Modal from '../../components/Modal/Modal';
import PinballGame from './PinballGame/PinballGame';

const BettingParty = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null); // New state to track selected game

  const games = [
    {
      id: 'ladder',
      title: '사다리타기',
      icon: '🪜',
      description: '클래식한 사다리타기로 운명을 결정하세요.',
    },
    {
      id: 'roulette',
      title: '룰렛',
      icon: '🎯',
      description: '돌아가는 룰렛에 여러분의 운을 시험해보세요.',
    },
    {
      id: 'pinball',
      title: '핀볼',
      icon: '🕹️',
      description: '핀볼 게임으로 점수를 내기를 해보세요.',
    },
  ];

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId); // Set selected game
    if (gameId === 'ladder' || gameId === 'roulette' || gameId === 'pinball') {
      setIsModalOpen(true);
    } else {
      alert('아직 준비 중인 게임입니다.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null); // Reset selected game on close
  };

  return (
    <div className="betting-party-container">
      <div className="betting-party-header">
        <h1>어떤 게임을 할까요?</h1>
        <p>마음에 드는 게임을 선택하여 시작하세요.</p>
      </div>
      <div className="game-selection-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => handleGameSelect(game.id)}
          >
            <div className="game-card-icon">{game.icon}</div>
            <h2 className="game-card-title">{game.title}</h2>
            <p className="game-card-description">{game.description}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} contentClassName="betting-party-modal-content">
        {selectedGame === 'ladder' && <LadderGame />}
        {selectedGame === 'roulette' && <RouletteGame />} {/* Render RouletteGame */}
        {selectedGame === 'pinball' && <PinballGame />}
      </Modal>
    </div>
  );
};

export default BettingParty;
