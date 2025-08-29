import React from 'react';
import './PartyChatView.css';

const PartyChatView = ({ selectedParty, setSelectedParty, handleJoinParty, currentUser }) => {
  // 카테고리 매핑
  const categories = [
    { id: 'DINE_OUT', label: '외식' },
    { id: 'DELIVERY', label: '배달' },
    { id: 'LUNCHBOX', label: '도시락' }
  ];

  // 카테고리 ID를 라벨로 변환하는 함수
  const getCategoryLabel = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.label : categoryId;
  };

  return (
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
          <span>{selectedParty.currentPeople}/{selectedParty.limitPeople}명 참여중</span>
        </div>
        <div className="chat-actions">
          {selectedParty.isOpen && (
            <button 
              className="join-btn"
              onClick={() => handleJoinParty(selectedParty.id)}
            >
              참여하기
            </button>
          )}
        </div>
      </div>

      <div className="party-details">
        <div className="detail-item">
          <span className="detail-label">카테고리:</span>
          <span className="detail-value">{getCategoryLabel(selectedParty.category)}</span>
        </div>
        {selectedParty.limitPrice > 0 && (
          <div className="detail-item">
            <span className="detail-label">1인 한도:</span>
            <span className="detail-value">{selectedParty.limitPrice.toLocaleString()}원</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">상태:</span>
          <span className={`detail-value ${selectedParty.isOpen ? 'open' : 'closed'}`}>
            {selectedParty.isOpen ? '모집중' : '모집완료'}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">생성일:</span>
          <span className="detail-value">
            {new Date(selectedParty.createdAt).toLocaleString('ko-KR')}
          </span>
        </div>
        {selectedParty.finishedAt && (
          <div className="detail-item">
            <span className="detail-label">종료일:</span>
            <span className="detail-value">
              {new Date(selectedParty.finishedAt).toLocaleString('ko-KR')}
            </span>
          </div>
        )}
      </div>

      {/* 메시지 기능은 백엔드 스펙 확정 후 연동합니다. */}
      <div className="chat-placeholder">
        <p>채팅 기능은 준비 중입니다.</p>
      </div>
    </div>
  );
};

export default PartyChatView;