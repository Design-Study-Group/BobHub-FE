import React, { useState } from 'react';
import RestaurantCard from './components/RestaurantCard';
import RestaurantDetail from './components/RestaurantDetail';
import { categories, restaurants as initialRestaurants } from './restaurantData';
import { sortRestaurants } from './utils';
import AddRestaurantForm from './components/AddRestaurantForm';
import './RestaurantRecommend.css';

const RestaurantRecommend = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [sortBy, setSortBy] = useState('rating');
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    category: 'korean',
    rating: 0,
    distance: '',
    price: '',
    tags: [],
    openTime: '',
    phone: '',
    description: '',
    reviews: []
  });
  const [tagInput, setTagInput] = useState('');

  const filteredRestaurants = selectedCategory === 'all' 
    ? restaurants 
    : restaurants.filter(restaurant => restaurant.category === selectedCategory);

  const sortedRestaurants = sortRestaurants(filteredRestaurants, sortBy);

  const handleAddRestaurant = (e) => {
    e.preventDefault();
    
    if (!newRestaurant.name || !newRestaurant.description || !newRestaurant.price || !newRestaurant.openTime) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const restaurantToAdd = {
      ...newRestaurant,
      id: Math.max(...restaurants.map(r => r.id)) + 1,
      rating: 0, // 새로 추가된 맛집은 초기 평점 0
      reviews: []
    };

    setRestaurants([...restaurants, restaurantToAdd]);
    setShowAddForm(false);
    setNewRestaurant({
      name: '',
      category: 'korean',
      rating: 0,
      distance: '',
      price: '',
      tags: [],
      openTime: '',
      phone: '',
      description: '',
      reviews: []
    });
    setTagInput('');

    // 성공 메시지
    alert(`"${restaurantToAdd.name}" 맛집이 성공적으로 추가되었습니다!`);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !newRestaurant.tags.includes(trimmedTag) && newRestaurant.tags.length < 5) {
      setNewRestaurant({
        ...newRestaurant,
        tags: [...newRestaurant.tags, trimmedTag]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewRestaurant({
      ...newRestaurant,
      tags: newRestaurant.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (selectedRestaurant) {
    return (
      <RestaurantDetail 
        restaurant={selectedRestaurant}
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
              onClick={setSelectedRestaurant}
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
            newRestaurant={newRestaurant}
            setNewRestaurant={setNewRestaurant}
            tagInput={tagInput}
            setTagInput={setTagInput}
            handleAddRestaurant={handleAddRestaurant}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            setShowAddForm={setShowAddForm}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantRecommend;