import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
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

  // 메시지가 업데이트될 때마다 자동 스크롤
  useLayoutEffect(() => {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // 채팅방 조회
  const loadChatRoom = async () => {
    try {
      setLoading(true);
      const response = await GetAxiosInstance(`/api/parties/${selectedParty.id}/comments`);
      const data = response?.data;
      
      if (data) {
        setChatRoom(data);
        // 채팅방 정보를 불러온 후 히스토리 로드
        await loadChatHistory(data.partyId);
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

  // 채팅 히스토리 로드 함수 추가
  const loadChatHistory = async (partyId) => {
    try {
      console.log('채팅 히스토리 로드 시작:', partyId);
      // 실제 API 호출로 채팅 히스토리 불러오기
      const response = await GetAxiosInstance(`/api/parties/${partyId}/comments/history`);
      const historyData = response?.data;
      console.log('채팅 히스토리 데이터:', historyData);
      
      if (historyData && historyData.length > 0) {
        // DB에서 가져온 히스토리 메시지들을 설정
        const historyMessages = historyData.map(msg => ({
          id: msg.id,
          roomId: msg.roomId,
          sender: msg.sender,
          userId: msg.userId,
          content: msg.content,
          timestamp: msg.timestamp,
          isHistory: true // 히스토리 메시지임을 표시
        }));
        
        console.log('채팅 히스토리 로드 완료:', historyMessages.length, '개 메시지');
        setMessages(historyMessages);
      } else {
        // 히스토리가 없으면 시스템 메시지만 표시
        const systemMessage = { 
          id: 'system-1', 
          sender: '시스템', 
          content: '파티가 참여되었습니다! \n 모집이 완료되면 채팅을 사용할 수 없습니다.', 
          timestamp: new Date().toISOString(),
          isHistory: false
        };
        setMessages([systemMessage]);
      }
    } catch (error) {
      console.error('채팅 히스토리 로드 실패:', error);
      // 에러 발생시 기본 시스템 메시지 표시
      const systemMessage = { 
        id: 'system-1', 
        sender: '시스템', 
        content: '파티에 참여되었습니다! 모집이 완료되면 채팅을 사용할 수 없습니다.', 
        timestamp: new Date().toISOString(),
        isHistory: false
      };
      setMessages([systemMessage]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim() || !chatRoom || !isConnected) return;

    try {
      setSubmitting(true);
      const newMessage = {
        id: Date.now(), // 임시 고유 id
        roomId: chatRoom.partyId,
        type: 'TALK',
        sender: currentUser?.name || '익명',
        userId: currentUser?.id,
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
        roomId: `${selectedParty.id}`,
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
          console.log(messageData.message);
          setChatRoom({ type: "CLOSED", message: messageData.message });
          setMessages([]); // 채팅 메시지 초기화
        } else if(messageData.type === "NONMEMBER") {
          setMessages([]); // 채팅 메시지 초기화
          console.log(messageData.message);
          setChatRoom({ type: "NONMEMBER", message: messageData.message });
        } else {
          // 실시간 메시지는 기존 메시지에 추가
          setMessages((prev) => [...prev, { ...messageData, isHistory: false }]);
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

    // 채팅방 정보와 히스토리를 먼저 로드
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
          ) : chatRoom.type === "NONMEMBER" ? (
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
                // userId 비교 로직 개선
                console.log('Current User ID:', currentUser?.id, 'Message User ID:', message.userId);
                const currentUserId = currentUser?.id;
                const messageUserId = message.userId;
                const isMine = currentUserId && messageUserId && currentUserId === messageUserId;
                
                return (
                  <div
                    key={`${message.userId}-${message.timestamp}-${index}`} // 더 고유한 키 사용
                    className={`chat-message ${isMine ? 'mine' : 'other'} ${message.isHistory ? 'history' : 'realtime'}`}
                  >
                    <div className="message-content">{message.content}</div>
                    <div className="message-meta">
                      <span className="message-sender">
                        {isMine ? '나' : (message.sender || '알 수 없음')}
                      </span>
                      <span className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString('ko-KR')}
                      </span>
                      {message.isHistory && <span className="history-indicator"></span>}
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