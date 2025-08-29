import React, { useEffect, useState } from 'react';
import PartyList from './components/PartyList';
import PartyChatView from './components/PartyChatView';
import CreatePartyForm from './components/CreatePartyForm';
import './PartyChat.css';
import { fetchParties, createParty, joinParty } from '../../api/PartyChat';

const PartyChat = ({ currentUser }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedParty, setSelectedParty] = useState(null);
  const [newPartyForm, setNewPartyForm] = useState(false);
  const [parties, setParties] = useState([]);
  const [newPartyData, setNewPartyData] = useState({
    title: '',
    category: 'DELIVERY',
    limitPeople: 4,
    limitPrice: 0,
    finishedDate: new Date().toISOString().slice(0, 10),
    finishedTime: '12:30'
  });

  const loadParties = async () => {
    try {
      const categoryKey = activeCategory === 'all' ? 'all' : activeCategory.toUpperCase();
      const list = await fetchParties(categoryKey);
      setParties(list || []);
    } catch (error) {
      console.error('파티 목록 로드 실패:', error);
      setParties([]);
    }
  };

  useEffect(() => {
    loadParties();
  }, [activeCategory]);

  const handleCreateParty = async (e) => {
    e.preventDefault();
    try {
      // 날짜와 시간을 합쳐서 finishedAt 생성
      const finishedAt = newPartyData.finishedDate && newPartyData.finishedTime 
        ? `${newPartyData.finishedDate}T${newPartyData.finishedTime}`
        : null;

      const payload = {
        title: newPartyData.title,
        category: newPartyData.category,
        limitPeople: newPartyData.limitPeople,
        limitPrice: newPartyData.limitPrice,
        finishedAt: finishedAt
      };
      await createParty(payload);
      setNewPartyForm(false);
      setNewPartyData({
        title: '',
        category: 'DELIVERY',
        limitPeople: 4,
        limitPrice: 0,
        finishedDate: new Date().toISOString().slice(0, 10),
        finishedTime: '12:30'
      });
      await loadParties(); // 목록 새로고침
    } catch (error) {
      console.error('파티 생성 실패:', error);
      alert('파티 생성에 실패했습니다.');
    }
  };

  const handleJoinParty = async (partyId) => {
    try {
      await joinParty(partyId);
      await loadParties(); // 목록 새로고침
    } catch (error) {
      console.error('파티 참여 실패:', error);
      alert('파티 참여에 실패했습니다.');
    }
  };

  return (
    <div className="party-chat-container">
      <div className="container">
        {!selectedParty && (
          <div className="party-header">
            <h1>파티원 모집</h1>
            <p>BobHub에서 함께 먹을 사람들을 찾아보세요!</p>
            <p>외식, 배달, 도시락까지 다양한 파티가 있어요.</p>
          </div>
        )}

        {selectedParty ? (
          <PartyChatView 
            selectedParty={selectedParty} 
            setSelectedParty={setSelectedParty} 
            handleJoinParty={handleJoinParty} 
            currentUser={currentUser} 
          />
        ) : (
          <PartyList 
            parties={parties} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
            setSelectedParty={setSelectedParty} 
            setNewPartyForm={setNewPartyForm} 
          />
        )}
        {newPartyForm && (
          <CreatePartyForm 
            newPartyData={newPartyData} 
            setNewPartyData={setNewPartyData} 
            setNewPartyForm={setNewPartyForm} 
            handleCreateParty={handleCreateParty} 
          />
        )}
      </div>
    </div>
  );
};

export default PartyChat;