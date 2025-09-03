import React, { useEffect, useState, useRef } from 'react';
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

  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  // 채팅방 조회
  const loadChatRoom = async () => {
    try {
      setLoading(true);
      const response = await GetAxiosInstance(`/api/parties/${selectedParty.id}/comments`);
      const data = response?.data;
      
      if (data) {
        setChatRoom(data);
        await loadMessages(data.partyId);
      } else {
        setChatRoom(null);
      }
    } catch (error) {
      console.error('채팅방 조회 실패:', error);
      setChatRoom(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPartyAndRefresh = async (partyId) => {
  await handleJoinParty(partyId);
  await loadChatRoom();
};


  const loadMessages = async (roomId) => {
    try {
      // 임시로 더미 메시지 로드 (실제로는 API에서 가져옴)
      const dummyMessages = [
        { 
          id: 'system-1', 
          sender: '시스템', 
          content: '파티가 참여되었습니다! \n 모집이 완료되면 채팅을 사용할 수 없습니다.', 
          timestamp: new Date().toISOString() 
        }
      ];
      setMessages(dummyMessages);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim() || !chatRoom || !isConnected) return;

    try {
      setSubmitting(true);
      const newMessage = {
        id: Date.now(), // 임시 고유 id
        sender: currentUser?.name || '익명',
        content: messageContent,
        timestamp: new Date().toISOString()
      };

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(newMessage));
        setMessageContent('');
      } else {
        alert('WebSocket 연결이 끊어졌습니다.');
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

useEffect(() => {
  if (!selectedParty) return;

  const ws = new WebSocket(`ws://localhost:8080/ws/chat/${selectedParty.id}`);
  socketRef.current = ws;

  ws.onopen = () => {
    setIsConnected(true);
    // 입장 메시지 전송
    const enterMessage = {
      type: 'ENTER',
      sender: currentUser?.name,
      userId: currentUser?.id,
      content: `${currentUser?.name}`,
      timestamp: new Date().toISOString()
    };
    ws.send(JSON.stringify(enterMessage));
  };

   ws.onmessage = (event) => {
    try {
      const messageData = JSON.parse(event.data);
      if (messageData.type === "CLOSED") {
        setChatRoom({ type: "CLOSED", message: messageData.message });
        setMessages([]); // 채팅 메시지 초기화
      } else {
        setMessages((prev) => [...prev, messageData]);
      }
    } catch (error) {
      console.error('메시지 파싱 실패:', error);
    }
  };
    ws.onclose = () => setIsConnected(false);
    ws.onerror = (error) => {
      console.error('WebSocket 에러:', error);
      setIsConnected(false);
    };

    loadChatRoom();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [selectedParty]);

  if (loading) {
    return (
      <div className="party-chat">
        <div className="chat-loading"><p>채팅방을 불러오는 중...</p></div>
      </div>
    );
  }

  return (
    <div className="party-chat">
      <div className="chat-header">
        <button className="back-btn" onClick={() => setSelectedParty(null)}>← 목록으로</button>
        <div className="chat-info">
          <h3>{selectedParty.title}</h3>
          <span>{selectedParty.currentPeople}/{selectedParty.limitPeople}명 참여중</span>
        </div>
        <div className="chat-actions">
          <button className="members-btn" onClick={() => alert('참여 멤버 보기 준비중')}>참여멤버</button>
          {selectedParty.isOpen && (
            <button className="join-btn" onClick={() => handleJoinPartyAndRefresh(selectedParty.id)}>참여하기</button>
          )}
        </div>
      </div>

      <div className="content-section">
        <div className="party-details">
          <div className="detail-item"><span className="detail-label">카테고리:</span><span className="detail-value">{getCategoryLabel(selectedParty.category)}</span></div>
          {selectedParty.limitPrice > 0 && <div className="detail-item"><span className="detail-label">1인 한도:</span><span className="detail-value">{selectedParty.limitPrice.toLocaleString()}원</span></div>}
          <div className="detail-item"><span className="detail-label">상태:</span><span className={`detail-value ${selectedParty.isOpen ? 'open' : 'closed'}`}>{selectedParty.isOpen ? '모집중' : '모집완료'}</span></div>
          <div className="detail-item"><span className="detail-label">생성일:</span><span className="detail-value">{new Date(selectedParty.createdAt).toLocaleString('ko-KR')}</span></div>
          {selectedParty.finishedAt && <div className="detail-item"><span className="detail-label">종료일:</span><span className="detail-value">{new Date(selectedParty.finishedAt).toLocaleString('ko-KR')}</span></div>}
        </div>
      </div>

      <div className="chat-section">
          {!chatRoom ? (
            <div className="chat-loading"><p>채팅방을 불러올 수 없습니다.</p></div>
          ) : chatRoom.type === "CLOSED" ? (
            <div className="chat-loading"><p>{chatRoom.message}</p></div>
          ) : (
          <>
            <div className="chat-header-info">
              <h4>파티 채팅방</h4>
              <div className="chat-status">
                <span className="chat-room-id">방 ID: {chatRoom.partyId}</span>
                <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>{isConnected ? '🟢 연결됨' : '🔴 연결 끊김'}</span>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="message-info">아직 메시지가 없습니다.</div>
              ) : (
                messages.map((message, index) => {
                  const isMine = message.sender === (currentUser?.name || '익명');
                  return (
                    <div
                      key={message.id || index}
                      className={`chat-message ${isMine ? 'mine' : 'other'}`}
                    >
                      <div className="message-content">{message.content}</div>
                      <div className="message-meta">
                        <span className="message-sender">{isMine ? '나' : message.sender}</span>
                        <span className="message-time">{new Date(message.timestamp).toLocaleTimeString('ko-KR')}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form className="chat-input" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder={isConnected ? "메시지를 입력하세요..." : "연결을 기다리는 중..."}
                className="message-input"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                disabled={submitting || !isConnected}
              />
              <button className="send-btn" type="submit" disabled={submitting || !messageContent.trim() || !isConnected}>
                {submitting ? '전송중...' : '전송'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PartyChatView;