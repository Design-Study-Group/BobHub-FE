import React, { useState, useEffect, useCallback } from 'react';
import RestaurantCard from './components/RestaurantCard';
import { categories } from './restaurantData';
import { sortRestaurants } from './utils';
import AddRestaurantForm from './components/AddRestaurantForm';
import RestaurantDetail from './components/RestaurantDetail';
import { getAllRecommendations, createRecommendation } from '../../api/restaurantApi';
import './RestaurantRecommend.css';

const RestaurantRecommend = ({ currentUser }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [restaurants, setRestaurants] = useState([]); // 초기 맛집 목록 비워둠
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 맛집 목록 불러오기
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllRecommendations();
      setRestaurants(data);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
      setError('맛집 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const filteredRestaurants = selectedCategory === 'all'
    ? restaurants
    : restaurants.filter(restaurant => restaurant.category === selectedCategory);

  const sortedRestaurants = sortRestaurants(filteredRestaurants, sortBy);

  const handleAddRestaurant = async (formData) => {
    if (!formData.storeName ||
        !formData.category ||
        formData.star === undefined || formData.star === null ||
        formData.totalTime === undefined || formData.totalTime === null ||
        formData.pricePerPerson === undefined || formData.pricePerPerson === null) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      // 백엔드에 새 맛집 데이터 전송
      const createdRestaurant = await createRecommendation({
        ...formData,
        userId: currentUser.id // Add userId here
      });

      // 성공 메시지
      alert(`"${createdRestaurant.storeName}"이(가) 성공적으로 추가되었습니다!`);

      // 폼 초기화 및 목록 새로고침
      setShowAddForm(false);
      fetchRestaurants(); // 목록 새로고침
    } catch (err) {
      console.error("Failed to add restaurant:", err);
      alert('맛집 추가에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="loading">맛집 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (selectedRestaurant) {
    return (
      <RestaurantDetail
        restaurant={selectedRestaurant}
        currentUser={currentUser}
        onBack={() => setSelectedRestaurant(null)}
      />
    );
  }

  return (
    <div className="restaurant-recommend">
      <div className="container">
        <div className="restaurant-header">
          <h1>맛집 추천</h1>
          <p>강의장 주변 맛집을 찾아보세요!</p>
          <p>실제 수강생들의 리뷰와 평점을 확인할 수 있어요.</p>
        </div>

        <div className="restaurant-controls">
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
          <div className="controls-right">
            <div className="sort-controls">
              <label>정렬:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="rating">평점순</option>
                <option value="distance">거리순</option>
                <option value="name">이름순</option>
              </select>
            </div>
            
            <button 
              className="add-restaurant-btn"
              onClick={() => setShowAddForm(true)}
            >
              + 맛집 추가
            </button>
          </div>
        </div>

        <div className="restaurants-grid">
          {sortedRestaurants.map(restaurant => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant}
              onClick={() => setSelectedRestaurant(restaurant)}
            />
          ))}
        </div>

        {sortedRestaurants.length === 0 && (
          <div className="no-results">
            <div className="no-results-content">
              <h3>해당 카테고리에 맛집이 없습니다</h3>
              <p>원하는 맛집이 없다면 직접 추가해보세요!</p>
              <button 
                className="add-restaurant-btn"
                onClick={() => setShowAddForm(true)}
              >
                + 첫 번째 맛집 추가하기
              </button>
            </div>
          </div>
        )}

        {showAddForm && (
          <AddRestaurantForm
            onSave={handleAddRestaurant}
            setShowAddForm={setShowAddForm}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantRecommend;