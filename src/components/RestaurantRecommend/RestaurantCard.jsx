import React from 'react';

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div className="restaurant-card" onClick={() => onClick(restaurant)}>
      <div className="restaurant-image">
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="rating-badge">
          ⭐ {restaurant.rating}
        </div>
      </div>
      
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <div className="restaurant-meta">
          <span className="distance">📍 {restaurant.distance}</span>
          <span className="price">💰 {restaurant.price}</span>
        </div>
        <div className="restaurant-tags">
          {restaurant.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
        <p className="description">{restaurant.description}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;