import React, { useState, useRef, useEffect } from 'react';
import ChatMessages from './components/ChatMessages';
import QuickButtons from './components/QuickButtons';
import MessageInput from './components/MessageInput';
import { quickButtons } from './menuData';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '안녕하세요! 메뉴 추천 AI입니다. 오늘 뭐 드시고 싶으신가요?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8080`;
    console.log('Backend URL:', backendUrl);
    const socket = new SockJS(`${backendUrl}/api/chatbot`, null, {
      transportOptions: {
        xhr: {
          withCredentials: true,
        },
      },
    });
    stompClient.current = Stomp.over(socket); // STOMP 클라이언트 생성 및 ref에 할당

    stompClient.current.connect({}, (frame) => {
      setIsConnected(true);
      console.log('Connected: ' + frame);

      // 메시지 구독
      stompClient.current.subscribe('/topic/messages', (message) => {
        setIsTyping(false);
        const receivedMessage = message.body;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.type === 'bot' && lastMessage.isStreaming) {
            return prev.map((msg, index) => 
              index === prev.length - 1 
                ? { ...msg, content: msg.content + receivedMessage } 
                : msg
            );
          } else {
            const newBotMessage = {
              id: Date.now(),
              type: 'bot',
              content: receivedMessage,
              timestamp: new Date(),
              isStreaming: false,
            };
            return [...prev, newBotMessage];
          }
        });
      });
    }, (error) => {
      console.error('STOMP Error: ', error);
      setIsConnected(false);
      setIsTyping(false);
      setMessages(prev => prev.map(msg => ({ ...msg, isStreaming: false })));
    });

    return () => {
      if (stompClient.current) {
        // STOMP 연결 끊김 및 오류 디버깅을 위한 핸들러 추가
        stompClient.current.onclose = (event) => {
          console.log('STOMP Connection Closed:', event);
          setIsConnected(false);
          setMessages(prev => prev.map(msg => ({ ...msg, isStreaming: false })));
        };

        stompClient.current.onerror = (error) => {
          console.error('STOMP Connection Error:', error);
          setIsConnected(false);
          setIsTyping(false);
          setMessages(prev => prev.map(msg => ({ ...msg, isStreaming: false })));
        };

        if (stompClient.current.connected) {
          stompClient.current.disconnect(() => {
            console.log('Disconnected');
            setIsConnected(false);
          });
        }
      }
    };
  }, []);

  const handleSendMessage = (message = inputMessage) => {
    let messageToSend;
    let displayMessage;

    if (typeof message === 'object' && message !== null && 'label' in message && 'value' in message) {
      displayMessage = message.label;
      messageToSend = JSON.stringify({ category: message.value });
    } else {
      displayMessage = message.trim();
      if (!displayMessage) return;
      messageToSend = displayMessage;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: displayMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setMessages(prev => prev.map(msg => ({ ...msg, isStreaming: true })));

    // STOMP를 사용하여 메시지 전송
    console.log('stompClient.current:', stompClient.current);
    console.log('stompClient.current.connected:', stompClient.current?.connected); // 연결 상태 확인

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.send("/app/chatbot", {}, messageToSend); // /app/chatbot으로 전송
    } else {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '죄송합니다, 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <h1>AI 메뉴 추천</h1>
        <p>무엇을 먹을지 고민될 때, AI가 맞춤 메뉴를 추천해드려요!</p>
        {!isConnected && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            서버 연결 중... 연결에 실패하면 새로고침 해주세요.
          </p>
        )}
      </div>

      <div className="chat-container">
        <ChatMessages messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef} />
        <QuickButtons buttons={quickButtons} onButtonClick={handleSendMessage} />
        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          isDisabled={!inputMessage.trim() || isTyping}
        />
      </div>
    </div>
  );
};

export default ChatBot;
