import React, { useState, useEffect } from 'react';
import FeaturesGrid from './components/FeaturesGrid';
import RecentActivities from './components/RecentActivities';
import './Dashboard.css';
import axiosInstance from '../../axios/AxiosInstance';

const Dashboard = ({ setCurrentPage }) => {
  const features = [
    {
      id: 'chatbot',
      title: 'AI 메뉴 추천',
      description: 'AI가 맞춤 메뉴를 추천해드려요.',
      color: 'soft-purple',
    },
    {
      id: 'party',
      title: '파티원 모집',
      description: '함께 먹을 사람들을 찾아보세요.',
      color: 'soft-blue',
    },
    {
      id: 'betting',
      title: '랜덤 게임',
      description: '공정하게 패자를 정하는 게임을 즐겨보세요.',
      color: 'soft-pink',
    },
    {
      id: 'restaurant',
      title: '맛집 추천',
      description: '수강생 리뷰로 강의장 주변 맛집을 찾아보세요.',
      color: 'soft-cyan',
    }
  ];

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const response = await axiosInstance.get('/api/recent-activities');
        setRecentActivities(response.data);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      }
    };

    fetchRecentActivities();
  }, []);

  return (
    <div className="pixel-dashboard">
      <div className="container">
        <div className="dashboard-intro">
          <div className="intro-content">
            <h1 className="intro-title subtle-glitch" data-text="WELCOME TO BOBHUB">
              WELCOME TO BOBHUB
            </h1>
            <p className="intro-subtitle">
              THE ULTIMATE FOOD COMMUNITY FOR FASTCAMPUS STUDENTS
            </p>
            <div className="intro-pixel-art">
              <div className="pixel-food-icons">
                🍕 🍔 🌮 🍜 🍱 🍗 🍟 🥤
              </div>
            </div>
          </div>
          <FeaturesGrid features={features} setCurrentPage={setCurrentPage} />
        </div>

        <RecentActivities recentActivities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;