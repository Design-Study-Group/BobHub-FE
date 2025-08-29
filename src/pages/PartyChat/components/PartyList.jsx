import React, { useState } from 'react';
import './PartyList.css';

const PartyList = ({ parties, activeCategory, setActiveCategory, setSelectedParty, setNewPartyForm }) => {
  const categories = [
    { id: 'ALL', label: '전체', icon: '🍽️' },
    { id: 'DINE_OUT', label: '외식', icon: '🍽️' },
    { id: 'DELIVERY', label: '배달', icon: '🚚' },
    { id: 'LUNCHBOX', label: '도시락', icon: '🍱' }
  ];

  // 카테고리 ID를 라벨로 변환하는 함수
  const getCategoryLabel = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.label : categoryId;
  };

  const filteredParties = activeCategory === 'all' 
    ? parties 
    : parties.filter(party => party.category === activeCategory);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="party-list">
      <div className="party-list-header">
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

        <button 
          className="create-party-btn"
          onClick={() => setNewPartyForm(true)}
        >
          + 파티 만들기
        </button>
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
              <span className={`party-status ${party.isOpen ? 'recruiting' : 'closed'}`}>
                {party.isOpen ? '모집중' : '모집완료'}
              </span>
            </div>
            
            <div className="party-info">
              <div className="party-meta">
                <span>👤 {party.currentPeople}/{party.limitPeople}</span>
                <span>🏷️ {getCategoryLabel(party.category)}</span>
                {party.finishedAt && <span>⏰ 종료: {formatDate(party.finishedAt)}</span>}
              </div>
              {party.limitPrice > 0 && (
                <div className="party-price">1인 한도: {party.limitPrice.toLocaleString()}원</div>
              )}
              <div className="party-created">생성: {formatDate(party.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartyList;