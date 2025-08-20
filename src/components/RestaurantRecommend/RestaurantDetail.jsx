import React, { useState } from 'react';
import './RestaurantDetail.css';

const RestaurantDetail = ({ restaurant, onBack }) => {
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log('새 리뷰:', newReview);
    setNewReview({ rating: 5, comment: '' });
  };

  return (
    <div className="restaurant-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← 목록으로
        </button>
        <h2>{restaurant.name}</h2>
      </div>

      <div className="detail-content">
        <div className="detail-image">
          <img src={restaurant.image} alt={restaurant.name} />
        </div>

        <div className="detail-info">
          <div className="info-section">
            <h3>기본 정보</h3>
            <div className="info-grid">
              <div className="info-item">
                <span>⭐ 평점</span>
                <span>{restaurant.rating}/5.0</span>
              </div>
              <div className="info-item">
                <span>📍 거리</span>
                <span>{restaurant.distance}</span>
              </div>
              <div className="info-item">
                <span>💰 가격대</span>
                <span>{restaurant.price}</span>
              </div>
              <div className="info-item">
                <span>⏰ 운영시간</span>
                <span>{restaurant.openTime}</span>
              </div>
              <div className="info-item">
                <span>📞 전화번호</span>
                <span>{restaurant.phone}</span>
              </div>
            </div>
            
            <div className="restaurant-tags">
              {restaurant.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
            
            <p className="description">{restaurant.description}</p>
          </div>

          <div className="reviews-section">
            <h3>리뷰 ({restaurant.reviews.length})</h3>
            
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="rating-input">
                <label>평점:</label>
                <select 
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                >
                  {[5,4,3,2,1].map(rating => (
                    <option key={rating} value={rating}>
                      {'⭐'.repeat(rating)} ({rating}점)
                    </option>
                  ))}
                </select>
              </div>
              
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="리뷰를 작성해주세요..."
                rows="3"
                required
              />
              
              <button type="submit" className="submit-review-btn">
                리뷰 작성
              </button>
            </form>

            <div className="reviews-list">
              {restaurant.reviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="review-user">{review.user}</span>
                    <span className="review-rating">
                      {'⭐'.repeat(review.rating)}
                    </span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;