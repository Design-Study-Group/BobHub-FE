import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 추가
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate(); // 추가

  const handleClick = () => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  return (
    <div className="restaurant-card" onClick={handleClick}>
      <div className="restaurant-info">
        <h3>{restaurant.storeName}</h3>
        <div className="restaurant-meta">
          <span className="ratings">⭐ {restaurant.averageRating}/5.0 ({restaurant.ratingCount})</span>
          <span className="total-time">⏰ {restaurant.totalTime}분</span>
          <span className="price-per-person">💰 {restaurant.pricePerPerson}원</span>
        </div>
        {/* isReservation 필드는 카드에 직접 표시하지 않음 */}
      </div>
    </div>
  );
};

export default RestaurantCard;
