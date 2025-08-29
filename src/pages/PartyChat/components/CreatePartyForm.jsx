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

          <div className="form-row">
            <div className="form-group">
              <label>최대 인원</label>
              <input
                type="number"
                value={newPartyData.limitPeople}
                onChange={(e) => setNewPartyData({...newPartyData, limitPeople: parseInt(e.target.value)})}
                min="2"
                max="10"
                required
              />
            </div>
            <div className="form-group">
              <label>1인 한도 금액 (원)</label>
              <input
                type="number"
                value={newPartyData.limitPrice}
                onChange={(e) => setNewPartyData({...newPartyData, limitPrice: parseInt(e.target.value)})}
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>종료 날짜</label>
              <input
                type="date"
                value={newPartyData.finishedDate || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setNewPartyData({...newPartyData, finishedDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>종료 시간</label>
              <select
                value={newPartyData.finishedTime || '12:30'}
                onChange={(e) => setNewPartyData({...newPartyData, finishedTime: e.target.value})}
              >
                <option value="06:00">오전 6:00</option>
                <option value="07:00">오전 7:00</option>
                <option value="08:00">오전 8:00</option>
                <option value="09:00">오전 9:00</option>
                <option value="10:00">오전 10:00</option>
                <option value="11:00">오전 11:00</option>
                <option value="12:00">오후 12:00</option>
                <option value="12:30">오후 12:30</option>
                <option value="13:00">오후 1:00</option>
                <option value="13:30">오후 1:30</option>
                <option value="14:00">오후 2:00</option>
                <option value="14:30">오후 2:30</option>
                <option value="15:00">오후 3:00</option>
                <option value="15:30">오후 3:30</option>
                <option value="16:00">오후 4:00</option>
                <option value="16:30">오후 4:30</option>
                <option value="17:00">오후 5:00</option>
                <option value="17:30">오후 5:30</option>
                <option value="18:00">오후 6:00</option>
                <option value="18:30">오후 6:30</option>
                <option value="19:00">오후 7:00</option>
                <option value="19:30">오후 7:30</option>
                <option value="20:00">오후 8:00</option>
                <option value="20:30">오후 8:30</option>
                <option value="21:00">오후 9:00</option>
                <option value="21:30">오후 9:30</option>
                <option value="22:00">오후 10:00</option>
                <option value="22:30">오후 10:30</option>
                <option value="23:00">오후 11:00</option>
                <option value="23:30">오후 11:30</option>
              </select>
            </div>
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