import React, { useState, useEffect, useMemo } from 'react';
import CreatePartyForm from './components/CreatePartyForm';
import PartyList from './components/PartyList';
import PartyChatView from './components/PartyChatView';
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

  const [parties, setParties] = useState([
    {
      id: 1,
      title: '점심 치킨 파티 🍗',
      category: 'delivery',
      description: '교촌치킨 레드콤보 주문할 사람 구해요!',
      creator: '김철수',
      members: ['김철수', '이영희'],
      maxMembers: 4,
      location: '2층 강의실',
      time: '2025-10-02T12:30',
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
      time: '2025-09-20T15:00',
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
      time: '2025-10-20T12:00',
      status: 'recruiting',
      messages: [
        { id: 1, user: '이수현', message: '엄마표 도시락 나눠먹을 분 구해요!', time: '11:45' },
        { id: 2, user: '정태윤', message: '우와 엄마표라니! 저 참여할게요', time: '11:50' }
      ]
    },
    {
      id: 4,
      title: '지난 점심 파티 🍝',
      category: 'dining',
      description: '지난주에 맛있게 먹었던 파스타 파티',
      creator: '김철수',
      members: ['김철수', '이영희', '박민수'],
      maxMembers: 3,
      location: '강의실 101',
      time: '2025-08-15T13:00', // Past date
      status: 'completed',
      messages: [
        { id: 1, user: '김철수', message: '파스타 맛있었어요!', time: '13:05' }
      ]
    },
    {
      id: 5,
      title: '종료된 배달 파티 🍕',
      category: 'delivery',
      description: '피자 배달 파티는 이미 끝났어요',
      creator: '이영희', 
      members: ['이영희', '최지은'],
      maxMembers: 2,
      location: '스터디룸',
      time: '2025-08-18T19:00', // Past date
      status: 'completed',
      messages: [
        { id: 1, user: '이영희', message: '피자 잘 먹었습니다!', time: '19:30' }
      ]
    },
    {
      id: 6,
      title: '오래된 도시락 모임 🍱',
      category: 'lunchbox',
      description: '오래전에 진행했던 도시락 모임',
      creator: '박민수',
      members: ['박민수', '김민지', '정태윤'],
      maxMembers: 3,
      location: '휴게실',
      time: '2025-07-25T12:00', // Past date
      status: 'completed',
      messages: [
        { id: 1, user: '박민수', message: '도시락 맛있었어요!', time: '12:10' }
      ]
    },
    {
      id: 7,
      title: '마감된 카페 모임 ☕',
      category: 'dining',
      description: '지난달에 있었던 카페 모임',
      creator: '최지은',
      members: ['최지은', '이수현'],
      maxMembers: 2,
      location: '카페',
      time: '2025-07-10T16:00', // Past date
      status: 'completed',
      messages: [
        { id: 1, user: '최지은', message: '즐거운 시간이었어요!', time: '16:30' }
      ]
    }
  ]);

  const handleCreateParty = (e) => {
    e.preventDefault();
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
  };

  const [activeTab, setActiveTab] = useState('active');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRemainingTime = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = currentTime;
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) {
      return '마감';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let result = '';
    if (days > 0) result += `${days}일 `;
    if (hours > 0 || days > 0) result += `${hours}시간 `;
    result += `${minutes}분`;
    return result.trim();
  };

  const partiesByStatus = useMemo(() => {
    const now = currentTime.getTime();
    const active = parties.filter(party => new Date(party.time).getTime() > now);
    const completed = parties.filter(party => new Date(party.time).getTime() <= now);
    return activeTab === 'active' ? active : completed;
  }, [parties, activeTab, currentTime]);

  const finalFilteredParties = activeCategory === 'all'
    ? partiesByStatus
    : partiesByStatus.filter(party => party.category === activeCategory);

  return (
    <div className="party-chat-container">
      <div className="container">
        <div className="party-header">
          <h1>👥 파티원 모집</h1>
          <p>외식, 배달, 도시락까지! BobHub에서 함께 먹을 사람들을 찾아보세요!</p>
        </div>

        {selectedParty ? (
          <PartyChatView
            party={selectedParty}
            currentUser={currentUser}
            onBack={() => setSelectedParty(null)}
            onJoinParty={handleJoinParty}
          />
        ) : (
          <PartyList
            parties={finalFilteredParties}
            onSelectParty={setSelectedParty}
            onCreateParty={() => setNewPartyForm(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={categories}
            formatRemainingTime={formatRemainingTime}
            currentTime={currentTime}
          />
        )}

        {newPartyForm && (
          <CreatePartyForm
            newPartyData={newPartyData}
            setNewPartyData={setNewPartyData}
            handleCreateParty={handleCreateParty}
            setNewPartyForm={setNewPartyForm}
          />
        )}
      </div>
    </div>
  );
};

export default PartyChat;