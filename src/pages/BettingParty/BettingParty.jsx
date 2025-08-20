import React, { useState } from 'react';
import CreateGameForm from './components/CreateGameForm';
import GameCard from './components/GameCard';
import GameDetail from './components/GameDetail';
import './BettingParty.css';

const BettingParty = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedGame, setSelectedGame] = useState(null);
  const [createGameForm, setCreateGameForm] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const punishments = [
    { id: 'coffee', label: '커피 사주기', icon: '☕', description: '스타벅스 아메리카노' },
    { id: 'meal', label: '식사 사주기', icon: '🍽️', description: '점심 or 저녁 한 끼' },
    { id: 'dessert', label: '디저트 사주기', icon: '🧁', description: '케이크나 아이스크림' },
    { id: 'delivery', label: '배달비 내기', icon: '🚚', description: '배달 주문 시 배달비 담당' },
    { id: 'errand', label: '심부름하기', icon: '🏃‍♂️', description: '간단한 심부름 (30분 내)' },
    { id: 'snack', label: '간식 사주기', icon: '🍿', description: '편의점 간식거리' },
    { id: 'custom', label: '직접 입력', icon: '✏️', description: '원하는 벌칙 직접 작성' }
  ];

  const [games] = useState([
    {
      id: 1,
      title: '점심값 사다리타기 🪜',
      type: 'ladder',
      creator: '김철수',
      participants: ['김철수', '이영희', '박민수'],
      maxParticipants: 6,
      losersCount: 1,
      punishment: { type: 'meal', custom: null },
      status: 'waiting',
      description: '오늘 점심값 누가 낼지 사다리타기로 정해요!',
      createdAt: '2024-08-20 11:30',
      result: null
    },
    {
      id: 2,
      title: '커피값 룰렛 게임 🎯',
      type: 'roulette',
      creator: '이영희',
      participants: ['이영희', '최지은', '김민지', '정태윤'],
      maxParticipants: 8,
      losersCount: 2,
      punishment: { type: 'coffee', custom: null },
      status: 'active',
      description: '스터디 후 커피 마실 건데 누가 살지 룰렛으로!',
      createdAt: '2024-08-20 14:15',
      result: null
    },
    {
      id: 3,
      title: '숫자 맞추기 - 배달비 게임 🎲',
      type: 'number',
      creator: '박민수',
      participants: ['박민수', '김민지', '정태윤', '이수현', '김철수'],
      maxParticipants: 6,
      losersCount: 1,
      punishment: { type: 'delivery', custom: null },
      status: 'completed',
      description: '1~50 사이 숫자 맞추기! 가장 멀리 틀린 사람이 배달비!',
      createdAt: '2024-08-20 12:00',
      result: {
        targetNumber: 27,
        submissions: [
          { user: '박민수', guess: 25, distance: 2 },
          { user: '김민지', guess: 30, distance: 3 },
          { user: '정태윤', guess: 15, distance: 12 },
          { user: '이수현', guess: 35, distance: 8 },
          { user: '김철수', guess: 10, distance: 17 }
        ],
        losers: ['김철수']
      }
    },
    {
      id: 4,
      title: '간식비 심부름 게임 🏃‍♂️',
      type: 'ladder',
      creator: '최지은',
      participants: ['최지은', '김민지', '정태윤'],
      maxParticipants: 4,
      losersCount: 1,
      punishment: { type: 'errand', custom: null },
      status: 'completed',
      description: '편의점 가서 간식 사올 사람 뽑기',
      createdAt: '2024-08-20 16:00',
      result: {
        losers: ['정태윤']
      }
    }
  ]);

  const [newGameData, setNewGameData] = useState({
    title: '',
    type: 'ladder',
    description: '',
    maxParticipants: 4,
    losersCount: 1,
    punishment: { type: 'coffee', custom: '' }
  });

  const gameTypes = [
    { 
      id: 'ladder', 
      label: '사다리타기', 
      icon: '🪜', 
      description: '클래식한 사다리타기로 랜덤 선택' 
    },
    { 
      id: 'roulette', 
      label: '룰렛', 
      icon: '🎯', 
      description: '돌아가는 룰렛으로 패자 결정' 
    },
    { 
      id: 'number', 
      label: '숫자 맞추기', 
      icon: '🎲', 
      description: '1~50 숫자 맞추기, 가장 멀리 틀린 사람이 패자' 
    }
  ];

  const activeGames = games.filter(game => game.status === 'waiting' || game.status === 'active');
  const completedGames = games.filter(game => game.status === 'completed');

  const handleCreateGame = (e) => {
    e.preventDefault();
    setCreateGameForm(false);
    setNewGameData({
      title: '',
      type: 'ladder',
      description: '',
      maxParticipants: 4,
      losersCount: 1,
      punishment: { type: 'coffee', custom: '' }
    });
  };

  const handleJoinGame = (gameId) => {
  };

  const playLadderGame = (game) => {
    const participants = [...game.participants];
    const shuffled = participants.sort(() => Math.random() - 0.5);
    const losers = shuffled.slice(0, game.losersCount);
    
    setGameResult({
      type: 'ladder',
      participants: shuffled,
      losers: losers,
      ladderPaths: generateLadderPaths(participants.length)
    });
  };

  const playRouletteGame = (game) => {
    const participants = [...game.participants];
    const losers = [];
    
    for (let i = 0; i < game.losersCount; i++) {
      const availableParticipants = participants.filter(p => !losers.includes(p));
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      losers.push(availableParticipants[randomIndex]);
    }
    
    setGameResult({
      type: 'roulette',
      participants: participants,
      losers: losers,
      spins: losers.map(loser => ({
        winner: loser,
        angle: Math.floor(Math.random() * 360)
      }))
    });
  };

  const [numberGuess, setNumberGuess] = useState('');
  const [numberSubmissions, setNumberSubmissions] = useState([]);

  const submitNumberGuess = (game) => {
    const guess = parseInt(numberGuess);
    if (!guess || guess < 1 || guess > 50) {
      alert('1~50 사이의 숫자를 입력해주세요.');
      return;
    }

    const newSubmission = {
      user: currentUser.name,
      guess: guess,
      timestamp: Date.now()
    };

    setNumberSubmissions([...numberSubmissions, newSubmission]);
    setNumberGuess('');

    // 모든 참가자가 제출했는지 확인
    if (numberSubmissions.length + 1 >= game.participants.length) {
      finishNumberGame(game, [...numberSubmissions, newSubmission]);
    }
  };

  const finishNumberGame = (game, submissions) => {
    const targetNumber = Math.floor(Math.random() * 50) + 1;
    
    const results = submissions.map(sub => ({
      ...sub,
      distance: Math.abs(sub.guess - targetNumber)
    }));

    results.sort((a, b) => b.distance - a.distance);
    const losers = results.slice(0, game.losersCount).map(r => r.user);

    setGameResult({
      type: 'number',
      targetNumber: targetNumber,
      submissions: results,
      losers: losers
    });
  };

  const generateLadderPaths = (participantCount) => {
    const paths = Array(participantCount).fill().map(() => []);
    const levels = Math.floor(Math.random() * 5) + 3; // 3-7개 레벨
    
    for (let level = 0; level < levels; level++) {
      const connections = [];
      for (let i = 0; i < participantCount - 1; i++) {
        if (Math.random() > 0.5) {
          connections.push(i);
        }
      }
      paths.forEach((path, index) => {
        path.push(connections.includes(index - 1) || connections.includes(index));
      });
    }
    
    return paths;
  };

  

  

  

  if (selectedGame) {
    return <GameDetail 
      selectedGame={selectedGame}
      currentUser={currentUser}
      onBack={() => setSelectedGame(null)}
      handleJoinGame={handleJoinGame}
      gameTypes={gameTypes}
      punishments={punishments}
      playLadderGame={playLadderGame}
      playRouletteGame={playRouletteGame}
      submitNumberGuess={submitNumberGuess}
      numberGuess={numberGuess}
      setNumberGuess={setNumberGuess}
      numberSubmissions={numberSubmissions}
      gameResult={gameResult}
    />;
  }

  return (
    <div className="betting-party">
      <div className="container">
        <div className="betting-header">
          <h1>🎲 랜덤 게임</h1>
          <p>BobHub의 재미있는 랜덤 게임으로 공정하게 패자를 정해보세요!</p>
        </div>

        <div className="betting-controls">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              진행중인 게임
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              완료된 게임
            </button>
          </div>
          
          <button 
            className="create-game-btn"
            onClick={() => setCreateGameForm(true)}
          >
            + 게임 만들기
          </button>
        </div>

        <div className="games-grid">
          {(activeTab === 'active' ? activeGames : completedGames).map(game => (
            <GameCard key={game.id} game={game} punishments={punishments} onSelectGame={setSelectedGame} />
          ))}
        </div>

        {createGameForm && (
          <CreateGameForm
            newGameData={newGameData}
            setNewGameData={setNewGameData}
            handleCreateGame={handleCreateGame}
            setCreateGameForm={setCreateGameForm}
            gameTypes={gameTypes}
            punishments={punishments}
          />
        )}
      </div>
    </div>
  );
};

export default BettingParty;