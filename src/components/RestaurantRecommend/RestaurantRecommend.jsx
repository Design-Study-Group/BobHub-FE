import React, { useState } from 'react';
import RestaurantCard from './RestaurantCard';
import RestaurantDetail from './RestaurantDetail';
import { categories, restaurants } from './restaurantData';
import { sortRestaurants } from './utils';
import './RestaurantRecommend.css';

const RestaurantRecommend = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [sortBy, setSortBy] = useState('rating');

  const filteredRestaurants = selectedCategory === 'all' 
    ? restaurants 
    : restaurants.filter(restaurant => restaurant.category === selectedCategory);

  const sortedRestaurants = sortRestaurants(filteredRestaurants, sortBy);

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
          <h1>🍽️ 맛집 추천</h1>
          <p>강의장 주변 맛집을 찾아보세요! 실제 수강생들의 리뷰와 평점을 확인할 수 있어요.</p>
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
            <p>해당 카테고리에 맛집이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantRecommend;