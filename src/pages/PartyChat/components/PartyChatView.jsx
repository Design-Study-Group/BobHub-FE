import React, { useEffect, useState } from 'react';
import './PartyChatView.css';
import { GetAxiosInstance, PostAxiosInstance } from '../../../axios/AxiosMethod';

const PartyChatView = ({ selectedParty, setSelectedParty, handleJoinParty, currentUser }) => {
  const categories = [
    { id: 'DINE_OUT', label: '외식' },
    { id: 'DELIVERY', label: '배달' },
    { id: 'LUNCHBOX', label: '도시락' }
  ];

  const getCategoryLabel = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.label : categoryId;
  };

  const [posts, setPosts] = useState([]);
  const [boardContent, setBoardContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = async () => {
    try {
      const res = await GetAxiosInstance(`/api/parties/${selectedParty.id}/comments`);
      const data = res?.data;
      setPosts(Array.isArray(data) ? data : []);
    } catch (_) {
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedParty.id]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!boardContent.trim()) return;
    try {
      setSubmitting(true);
      await PostAxiosInstance(`/api/parties/${selectedParty.id}/comments`, { comments: boardContent });
      setBoardContent('');
      await loadPosts();
    } finally {
      setSubmitting(false);
    }
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
          <button
            className="members-btn"
            onClick={() => alert('참여 멤버 보기 기능은 준비 중입니다.')}
          >
            참여멤버
          </button>
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

      <div className="content-section">
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
      </div>

      <h4 className="section-title">댓글</h4>
      <div className="comments-section">
        <div className="chat-messages">
          {posts.length === 0 ? (
            <div className="message-info">아직 댓글이 없습니다.</div>
          ) : (
            posts.map((m) => (
              <div 
                key={m.id} 
                className={`chat-message ${m.name && currentUser?.name && m.name === currentUser.name ? 'own' : ''}`}
              >
                <div className="message-info">
                  <span className="message-user">{m.name || '익명'}</span>
                  <span className="message-time">{m.createdAt ? new Date(m.createdAt).toLocaleString('ko-KR') : ''}</span>
                </div>
                <div className="message-content">{m.comments}</div>
              </div>
            ))
          )}
        </div>

        <form className="chat-input" onSubmit={handleSubmitPost}>
          <input 
            type="text" 
            placeholder="댓글을 입력하세요..."
            className="message-input"
            value={boardContent}
            onChange={(e) => setBoardContent(e.target.value)}
          />
          <button className="send-btn" type="submit" disabled={submitting}>
            {submitting ? '전송중...' : '전송'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartyChatView;