import React from 'react';
import './CreatePartyForm.css';

const partyCategories = [
  { id: 'delivery', label: '배달' },
  { id: 'dining', label: '외식' },
  { id: 'lunchbox', label: '도시락' },
];

const CreatePartyForm = ({ newPartyData, setNewPartyData, setNewPartyForm, handleCreateParty }) => {
  return (
    <div className="create-party-overlay">
      <div className="create-party-form">
        <div className="form-header">
          <h3>새 파티 만들기</h3>
          <button 
            className="close-btn"
            onClick={() => setNewPartyForm(false)}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateParty}>
          <div className="form-group">
            <label>파티 제목</label>
            <input
              type="text"
              value={newPartyData.title}
              onChange={(e) => setNewPartyData({...newPartyData, title: e.target.value})}
              placeholder="ex) 점심 치킨 파티"
              required
            />
          </div>

          <div className="form-group">
            <label>카테고리 *</label>
            <div className="category-buttons">
              {partyCategories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`category-btn ${newPartyData.category === cat.id ? 'active' : ''}`}
                  onClick={() => setNewPartyData({...newPartyData, category: cat.id})}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>설명</label>
            <textarea
              value={newPartyData.description}
              onChange={(e) => setNewPartyData({...newPartyData, description: e.target.value})}
              placeholder="파티에 대한 설명을 입력하세요"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>최대 인원</label>
              <input
                type="number"
                value={newPartyData.maxMembers}
                onChange={(e) => setNewPartyData({...newPartyData, maxMembers: parseInt(e.target.value)})}
                min="2"
                max="10"
              />
            </div>
            <div className="form-group">
              <label>시간</label>
              <input
                type="time"
                value={newPartyData.time}
                onChange={(e) => setNewPartyData({...newPartyData, time: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>장소</label>
            <input
              type="text"
              value={newPartyData.location}
              onChange={(e) => setNewPartyData({...newPartyData, location: e.target.value})}
              placeholder="ex) 2층 강의실"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setNewPartyForm(false)}>
              취소
            </button>
            <button type="submit" className="submit-btn">
              파티 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePartyForm;