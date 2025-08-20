import React, { useState } from 'react';
import './PartyChat.css';

const PartyChat = ({ currentUser }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedParty, setSelectedParty] = useState(null);
  const [newPartyForm, setNewPartyForm] = useState(false);
  const [newPartyData, setNewPartyData] = useState({
    title: '',
    category: 'delivery',
    description: '',
    maxMembers: 4,
    location: '',
    time: ''
  });

  const categories = [
    { id: 'all', label: '전체', icon: '🍽️' },
    { id: 'dining', label: '외식', icon: '🍽️' },
    { id: 'delivery', label: '배달', icon: '🚚' },
    { id: 'lunchbox', label: '도시락', icon: '🍱' }
  ];

  const [parties] = useState([
    {
      id: 1,
      title: '점심 치킨 파티 🍗',
      category: 'delivery',
      description: '교촌치킨 레드콤보 주문할 사람 구해요!',
      creator: '김철수',
      members: ['김철수', '이영희'],
      maxMembers: 4,
      location: '2층 강의실',
      time: '12:30',
      status: 'recruiting',
      messages: [
        { id: 1, user: '김철수', message: '치킨 먹고 싶어서 파티 만들었어요!', time: '12:10' },
        { id: 2, user: '이영희', message: '저도 참여할게요! 콤보 맛있죠', time: '12:15' }
      ]
    },
    {
      id: 2,
      title: '카페 디저트 모임 ☕',
      category: 'dining',
      description: '스타벅스 가서 디저트랑 커피 마실 분들 모집',
      creator: '박민수',
      members: ['박민수', '최지은', '김민지'],
      maxMembers: 5,
      location: '스타벅스 홍대점',
      time: '15:00',
      status: 'recruiting',
      messages: [
        { id: 1, user: '박민수', message: '오늘 날씨 좋아서 카페 가려고 해요', time: '14:30' },
        { id: 2, user: '최지은', message: '좋아요! 저도 갈게요', time: '14:35' },
        { id: 3, user: '김민지', message: '저도 참여합니다~', time: '14:40' }
      ]
    },
    {
      id: 3,
      title: '도시락 나눠먹기 🍱',
      category: 'lunchbox',
      description: '엄마가 싸주신 도시락이 너무 많아요. 나눠먹어요!',
      creator: '이수현',
      members: ['이수현', '정태윤'],
      maxMembers: 3,
      location: '3층 휴게실',
      time: '12:00',
      status: 'recruiting',
      messages: [
        { id: 1, user: '이수현', message: '엄마표 도시락 나눠먹을 분 구해요!', time: '11:45' },
        { id: 2, user: '정태윤', message: '우와 엄마표라니! 저 참여할게요', time: '11:50' }
      ]
    }
  ]);

  const filteredParties = activeCategory === 'all' 
    ? parties 
    : parties.filter(party => party.category === activeCategory);

  const handleCreateParty = (e) => {
    e.preventDefault();
    // 실제로는 API 호출이나 상태 업데이트가 필요
    console.log('새 파티 생성:', newPartyData);
    setNewPartyForm(false);
    setNewPartyData({
      title: '',
      category: 'delivery',
      description: '',
      maxMembers: 4,
      location: '',
      time: ''
    });
  };

  const handleJoinParty = (partyId) => {
    // 실제로는 API 호출이나 상태 업데이트가 필요
    console.log('파티 참여:', partyId);
  };

  const PartyList = () => (
    <div className="party-list">
      <div className="party-list-header">
        <h2>활성 파티 목록</h2>
        <button 
          className="create-party-btn"
          onClick={() => setNewPartyForm(true)}
        >
          + 파티 만들기
        </button>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      <div className="parties-grid">
        {filteredParties.map(party => (
          <div 
            key={party.id} 
            className="party-card"
            onClick={() => setSelectedParty(party)}
          >
            <div className="party-card-header">
              <h3>{party.title}</h3>
              <span className={`party-status ${party.status}`}>
                {party.status === 'recruiting' ? '모집중' : '모집완료'}
              </span>
            </div>
            
            <p className="party-description">{party.description}</p>
            
            <div className="party-info">
              <div className="party-meta">
                <span>👤 {party.members.length}/{party.maxMembers}</span>
                <span>📍 {party.location}</span>
                <span>⏰ {party.time}</span>
              </div>
              <div className="party-creator">만든이: {party.creator}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PartyChat = () => (
    <div className="party-chat">
      <div className="chat-header">
        <button 
          className="back-btn"
          onClick={() => setSelectedParty(null)}
        >
          ← 목록으로
        </button>
        <div className="chat-info">
          <h3>{selectedParty.title}</h3>
          <span>{selectedParty.members.length}/{selectedParty.maxMembers}명 참여중</span>
        </div>
        {!selectedParty.members.includes(currentUser.name) && (
          <button 
            className="join-btn"
            onClick={() => handleJoinParty(selectedParty.id)}
          >
            참여하기
          </button>
        )}
      </div>

      <div className="chat-messages">
        {selectedParty.messages.map(message => (
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

  const CreatePartyForm = () => (
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
            <label>카테고리</label>
            <select
              value={newPartyData.category}
              onChange={(e) => setNewPartyData({...newPartyData, category: e.target.value})}
            >
              <option value="delivery">배달</option>
              <option value="dining">외식</option>
              <option value="lunchbox">도시락</option>
            </select>
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

  return (
    <div className="party-chat-container">
      <div className="container">
        <div className="party-header">
          <h1>👥 파티원 모집</h1>
          <p>BobHub에서 함께 먹을 사람들을 찾아보세요! 외식, 배달, 도시락까지 다양한 파티가 있어요.</p>
        </div>

        {selectedParty ? <PartyChat /> : <PartyList />}
        {newPartyForm && <CreatePartyForm />}
      </div>
    </div>
  );
};

export default PartyChat;