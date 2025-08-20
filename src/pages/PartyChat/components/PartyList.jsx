import React from 'react';
import './PartyList.css';

const PartyList = ({
  parties,
  onSelectParty,
  onCreateParty,
  activeTab,
  setActiveTab,
  activeCategory,
  setActiveCategory,
  categories,
  formatRemainingTime,
  currentTime
}) => {
  return (
    <div className="party-list">
      <div className="party-list-header">
        <div className="tab-buttons">
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          진행중인 파티
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          마감된 파티
        </button>
      </div>

        <button
          className="create-party-btn"
          onClick={onCreateParty}
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
        {parties.map(party => (
          <div
            key={party.id}
            className={`party-card ${new Date(party.time).getTime() - currentTime.getTime() <= 0 ? 'closed-party-card' : ''}`}
            onClick={() => onSelectParty(party)}
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
                <span>⏰ {formatRemainingTime(party.time)}</span>
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