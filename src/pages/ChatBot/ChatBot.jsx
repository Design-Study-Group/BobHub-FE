import React, { useState, useRef, useEffect } from 'react';
import ChatMessages from './components/ChatMessages';
import QuickButtons from './components/QuickButtons';
import MessageInput from './components/MessageInput';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '안녕하세요! 메뉴 추천 AI입니다. 오늘 뭐 드시고 싶으신가요?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickButtons = [
    '🍚 한식', '🍕 양식', '🍜 중식', '🍱 일식',
    '🌮 분식', '🍗 치킨', '🍔 패스트푸드', '☕ 카페'
  ];

  const menuRecommendations = {
    '한식': ['김치찌개', '된장찌개', '비빔밥', '불고기', '갈비탕'],
    '양식': ['파스타', '피자', '스테이크', '리조또', '샐러드'],
    '중식': ['짜장면', '짬뽕', '탕수육', '마파두부', '볶음밥'],
    '일식': ['초밥', '라멘', '우동', '돈까스', '규동'],
    '분식': ['떡볶이', '김밥', '순대', '어묵', '라면'],
    '치킨': ['후라이드', '양념치킨', '간장치킨', '허니머스타드', '치킨버거'],
    '패스트푸드': ['햄버거', '감자튀김', '핫도그', '너겟', '콜라'],
    '카페': ['아메리카노', '라떼', '샌드위치', '케이크', '쿠키']
  };

  const handleSendMessage = (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    for (const [category, items] of Object.entries(menuRecommendations)) {
      if (lowerMessage.includes(category.toLowerCase()) ||
          lowerMessage.includes(category.slice(2))) {
        const randomItems = items.sort(() => 0.5 - Math.random()).slice(0, 3);
        return `${category} 메뉴 추천드려요! 🍽️\n\n${randomItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}\n\n어떤 메뉴가 마음에 드시나요?`;
      }
    }

    const defaultResponses = [
      '음... 🤔 더 구체적으로 알려주시면 더 정확한 추천을 드릴 수 있어요!',
      '어떤 종류의 음식을 원하시나요? 위의 카테고리 버튼을 눌러보세요!',
      '오늘의 기분이나 상황을 알려주시면 맞춤 추천해드릴게요! 😊'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
