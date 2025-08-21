import React from 'react';
import './GameDetail.css';

const GameDetail = ({ 
  selectedGame,
  currentUser,
  onBack,
  handleJoinGame,
  gameTypes,
  punishments,
  playLadderGame,
  playRouletteGame,
  submitNumberGuess,
  numberGuess,
  setNumberGuess,
  numberSubmissions,
  gameResult
}) => {
  return (
    <div className="game-detail">
      <div className="game-detail-header">
        <div className="game-detail-buttons">
          <button onClick={onBack} className="back-btn">
            ← 목록으로
          </button>
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
        <h2>{selectedGame.title}</h2>
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

export default GameDetail;