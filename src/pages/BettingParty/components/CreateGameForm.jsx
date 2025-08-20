import React from 'react';
import './CreateGameForm.css';

const CreateGameForm = ({ newGameData, setNewGameData, handleCreateGame, setCreateGameForm, gameTypes, punishments }) => (
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

export default CreateGameForm;