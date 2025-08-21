import React, { useState } from 'react';
import './PartyList.css';

const PartyList = ({ parties, activeCategory, setActiveCategory, setSelectedParty, setNewPartyForm }) => {
  const categories = [
    { id: 'all', label: '전체', icon: '🍽️' },
    { id: 'dining', label: '외식', icon: '🍽️' },
    { id: 'delivery', label: '배달', icon: '🚚' },
    { id: 'lunchbox', label: '도시락', icon: '🍱' }
  ];

  const filteredParties = activeCategory === 'all' 
    ? parties 
    : parties.filter(party => party.category === activeCategory);

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
};

export default PartyList;