import React, { useState } from 'react';
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
    console.log('새 랜덤 게임 생성:', newGameData);
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
    console.log('게임 참여:', gameId);
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

  const GameCard = ({ game }) => (
    <div className="game-card" onClick={() => setSelectedGame(game)}>
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

  const GameDetail = () => {
    return (
      <div className="game-detail">
        <div className="game-detail-header">
          <button onClick={() => setSelectedGame(null)} className="back-btn">
            ← 목록으로
          </button>
          <h2>{selectedGame.title}</h2>
          {!selectedGame.participants.includes(currentUser.name) && 
           selectedGame.status === 'waiting' && 
           selectedGame.participants.length < selectedGame.maxParticipants && (
            <button 
              className="join-game-btn"
              onClick={() => handleJoinGame(selectedGame.id)}
            >
              참여하기
            </button>
          )}
        </div>

        <div className="game-info-detail">
          <div className="info-item">
            <span>게임 타입:</span>
            <span>{gameTypes.find(t => t.id === selectedGame.type)?.label}</span>
          </div>
          <div className="info-item">
            <span>벌칙:</span>
            <span>
              {selectedGame.punishment.type === 'custom' 
                ? selectedGame.punishment.custom 
                : punishments.find(p => p.id === selectedGame.punishment.type)?.label}
            </span>
          </div>
          <div className="info-item">
            <span>패자 수:</span>
            <span>{selectedGame.losersCount}명</span>
          </div>
          <div className="info-item">
            <span>참여자:</span>
            <span>{selectedGame.participants.join(', ')}</span>
          </div>
        </div>

        {selectedGame.participants.includes(currentUser.name) && selectedGame.status !== 'completed' && (
          <div className="game-play-area">
            <h3>게임 플레이</h3>
            
            {selectedGame.type === 'ladder' && (
              <div className="ladder-game">
                <p>사다리타기로 패자를 정합니다!</p>
                <button 
                  onClick={() => playLadderGame(selectedGame)} 
                  className="play-btn"
                >
                  🪜 사다리타기 시작
                </button>
              </div>
            )}

            {selectedGame.type === 'roulette' && (
              <div className="roulette-game">
                <p>룰렛을 돌려서 패자를 정합니다!</p>
                <button 
                  onClick={() => playRouletteGame(selectedGame)} 
                  className="play-btn"
                >
                  🎯 룰렛 돌리기
                </button>
              </div>
            )}

            {selectedGame.type === 'number' && (
              <div className="number-game">
                <p>1~50 사이의 숫자를 맞춰보세요! 가장 멀리 틀린 사람이 패자입니다.</p>
                <div className="number-input">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={numberGuess}
                    onChange={(e) => setNumberGuess(e.target.value)}
                    placeholder="숫자 입력 (1-50)"
                  />
                  <button 
                    onClick={() => submitNumberGuess(selectedGame)}
                    className="submit-btn"
                  >
                    제출
                  </button>
                </div>
                <div className="submissions-status">
                  제출: {numberSubmissions.length}/{selectedGame.participants.length}명
                </div>
              </div>
            )}

            {gameResult && (
              <div className="game-result">
                <h4>🎉 게임 결과</h4>
                
                {gameResult.type === 'ladder' && (
                  <div className="ladder-result">
                    <div className="ladder-visual">
                      {gameResult.participants.map((participant, index) => (
                        <div key={index} className="ladder-line">
                          <span className={`participant-name ${gameResult.losers.includes(participant) ? 'loser' : ''}`}>
                            {participant}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="result-losers">
                      😭 패자: {gameResult.losers.join(', ')}
                    </div>
                  </div>
                )}

                {gameResult.type === 'roulette' && (
                  <div className="roulette-result">
                    <div className="roulette-visual">
                      🎯 룰렛 결과
                    </div>
                    <div className="result-losers">
                      😭 패자: {gameResult.losers.join(', ')}
                    </div>
                  </div>
                )}

                {gameResult.type === 'number' && (
                  <div className="number-result">
                    <div className="target-number">
                      🎯 정답: {gameResult.targetNumber}
                    </div>
                    <div className="submissions-list">
                      {gameResult.submissions.map((sub, index) => (
                        <div key={index} className={`submission ${gameResult.losers.includes(sub.user) ? 'loser' : ''}`}>
                          <span>{sub.user}: {sub.guess}</span>
                          <span className="distance">(차이: {sub.distance})</span>
                        </div>
                      ))}
                    </div>
                    <div className="result-losers">
                      😭 패자: {gameResult.losers.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedGame.status === 'completed' && selectedGame.result && (
          <div className="completed-result">
            <h4>완료된 게임 결과</h4>
            {selectedGame.type === 'number' && (
              <div className="number-result">
                <div className="target-number">
                  🎯 정답: {selectedGame.result.targetNumber}
                </div>
                <div className="submissions-list">
                  {selectedGame.result.submissions.map((sub, index) => (
                    <div key={index} className={`submission ${selectedGame.result.losers.includes(sub.user) ? 'loser' : ''}`}>
                      <span>{sub.user}: {sub.guess}</span>
                      <span className="distance">(차이: {sub.distance})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="result-losers">
              😭 패자: {selectedGame.result.losers.join(', ')}
            </div>
          </div>
        )}

        <div className="game-chat">
          <h4>게임 채팅</h4>
          <div className="chat-messages">
            <div className="chat-message">
              <span className="message-user">{selectedGame.creator}</span>
              <span className="message-content">게임 시작해봅시다!</span>
            </div>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="메시지 입력..." />
            <button>전송</button>
          </div>
        </div>
      </div>
    );
  };

  const CreateGameForm = () => (
    <div className="create-game-overlay">
      <div className="create-game-form">
        <div className="form-header">
          <h3>새 랜덤 게임 만들기</h3>
          <button onClick={() => setCreateGameForm(false)} className="close-btn">✕</button>
        </div>

        <form onSubmit={handleCreateGame}>
          <div className="form-group">
            <label>게임 제목</label>
            <input
              type="text"
              value={newGameData.title}
              onChange={(e) => setNewGameData({...newGameData, title: e.target.value})}
              placeholder="ex) 점심값 사다리타기"
              required
            />
          </div>

          <div className="form-group">
            <label>게임 종류</label>
            <div className="game-type-grid">
              {gameTypes.map(type => (
                <div
                  key={type.id}
                  className={`game-type-card ${newGameData.type === type.id ? 'selected' : ''}`}
                  onClick={() => setNewGameData({...newGameData, type: type.id})}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                  <p className="type-description">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>벌칙 종류</label>
            <div className="punishment-grid">
              {punishments.map(punishment => (
                <div
                  key={punishment.id}
                  className={`punishment-card ${newGameData.punishment.type === punishment.id ? 'selected' : ''}`}
                  onClick={() => setNewGameData({
                    ...newGameData, 
                    punishment: { type: punishment.id, custom: '' }
                  })}
                >
                  <span className="punishment-icon">{punishment.icon}</span>
                  <span className="punishment-label">{punishment.label}</span>
                  <p className="punishment-description">{punishment.description}</p>
                </div>
              ))}
            </div>
            
            {newGameData.punishment.type === 'custom' && (
              <input
                type="text"
                value={newGameData.punishment.custom}
                onChange={(e) => setNewGameData({
                  ...newGameData, 
                  punishment: { ...newGameData.punishment, custom: e.target.value }
                })}
                placeholder="벌칙을 직접 입력하세요"
                className="custom-punishment-input"
                required
              />
            )}
          </div>

          <div className="form-group">
            <label>설명</label>
            <textarea
              value={newGameData.description}
              onChange={(e) => setNewGameData({...newGameData, description: e.target.value})}
              placeholder="게임에 대한 설명"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>최대 참여자</label>
              <input
                type="number"
                value={newGameData.maxParticipants}
                onChange={(e) => setNewGameData({...newGameData, maxParticipants: parseInt(e.target.value)})}
                min="2"
                max="10"
              />
            </div>
            <div className="form-group">
              <label>패자 수</label>
              <input
                type="number"
                value={newGameData.losersCount}
                onChange={(e) => setNewGameData({...newGameData, losersCount: parseInt(e.target.value)})}
                min="1"
                max={Math.floor(newGameData.maxParticipants / 2)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setCreateGameForm(false)}>
              취소
            </button>
            <button type="submit" className="submit-btn">
              게임 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (selectedGame) {
    return <GameDetail />;
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
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {createGameForm && <CreateGameForm />}
      </div>
    </div>
  );
};

export default BettingParty;