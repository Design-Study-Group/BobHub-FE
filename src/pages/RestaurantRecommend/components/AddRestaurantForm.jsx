import React, { useRef } from 'react';
import { categories } from '../restaurantData';
import './AddRestaurantForm.css';

const AddRestaurantForm = ({
  newRestaurant,
  setNewRestaurant,
  tagInput,
  setTagInput,
  handleAddRestaurant,
  handleAddTag,
  handleRemoveTag,
  setShowAddForm
}) => {
  const formRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="add-restaurant-overlay">
      <div className="add-restaurant-form" ref={formRef}>
        <div className="form-header">
          <h3>새 맛집 추가하기</h3>
          <button 
            className="close-btn"
            onClick={() => setShowAddForm(false)}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddRestaurant}>
          <div className="form-group">
            <label>가게 이름 *</label>
            <input
              type="text"
              value={newRestaurant.name}
              onChange={(e) => {
                setNewRestaurant(prev => ({...prev, name: e.target.value}));
              }}
              placeholder="ex) 홍대 맛집"
              required
            />
          </div>

          <div className="form-group">
            <label>카테고리 *</label>
            <select
              value={newRestaurant.category}
              onChange={(e) => setNewRestaurant(prev => ({...prev, category: e.target.value}))}
            >
              {categories.filter(cat => cat.id !== 'all').map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>거리</label>
              <input
                type="text"
                value={newRestaurant.distance}
                onChange={(e) => setNewRestaurant(prev => ({...prev, distance: e.target.value}))}
                placeholder="ex) 100m"
              />
            </div>
            <div className="form-group">
              <label>가격대 *</label>
              <input
                type="text"
                value={newRestaurant.price}
                onChange={(e) => setNewRestaurant(prev => ({...prev, price: e.target.value}))}
                placeholder="ex) 8,000-15,000원"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>영업시간 *</label>
            <input
              type="text"
              value={newRestaurant.openTime}
              onChange={(e) => setNewRestaurant(prev => ({...prev, openTime: e.target.value}))}
              placeholder="ex) 11:00-21:00"
              required
            />
          </div>

          <div className="form-group">
            <label>전화번호</label>
            <input
              type="text"
              value={newRestaurant.phone}
              onChange={(e) => setNewRestaurant(prev => ({...prev, phone: e.target.value}))}
              placeholder="ex) 02-1234-5678"
            />
          </div>

          <div className="form-group">
            <label>설명 *</label>
            <textarea
              value={newRestaurant.description}
              onChange={(e) => setNewRestaurant(prev => ({...prev, description: e.target.value}))}
              placeholder="가게에 대한 간단한 설명을 입력하세요"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>태그 (최대 5개)</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="태그를 입력하고 Enter를 누르세요"
              />
              <button type="button" onClick={handleAddTag} className="tag-add-btn">
                추가
              </button>
            </div>
            <div className="tags-display">
              {newRestaurant.tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <p className="tag-help">예: 가성비, 깔끔한, 혼밥가능, 데이트, 단체모임</p>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowAddForm(false)}>
              취소
            </button>
            <button type="submit" className="submit-btn">
              맛집 추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantForm;