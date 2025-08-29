import React, { useState, useEffect, useRef } from 'react';
import { categories } from '../restaurantData';
import './AddRestaurantForm.css';

const AddRestaurantForm = ({
  onSave,
  setShowAddForm,
  initialData
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      storeName: '',
      category: '',
      description: '',
      totalTime: 0,
      pricePerPerson: 0,
      isReservation: false,
    }
  );

  const formRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="add-restaurant-overlay">
      <div className="add-restaurant-form" ref={formRef}>
        <div className="form-header">
          <h3>{initialData ? '맛집 수정하기' : '맛집 등록하기'}</h3>
          <button 
            className="close-btn"
            onClick={() => setShowAddForm(false)}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>가게 이름 *</label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => {
                setFormData(prev => ({...prev, storeName: e.target.value}));
              }}
              placeholder="ex) 홍대 맛집"
              required
            />
          </div>

          <div className="form-group">
            <label>카테고리 *</label>
            <div className="category-buttons">
              {categories.filter(c => c.id !== 'all').map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`category-btn ${formData.category === cat.id ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({...prev, category: cat.id}))}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>대표 메뉴 *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => {
                setFormData(prev => ({...prev, description: e.target.value}));
              }}
              placeholder="ex) 순대국, 된장찌개"
            />
          </div>

          <div className="form-group">
            <label>예상 소요 시간 (분) *</label>
            <input
              type="number"
              value={formData.totalTime}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFormData(prev => ({...prev, totalTime: isNaN(value) ? 0 : value}));
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>1인당 가격 (원) *</label>
            <input
              type="number"
              value={formData.pricePerPerson}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFormData(prev => ({...prev, pricePerPerson: isNaN(value) ? 0 : value}));
              }}
              placeholder="ex) 15000"
              required
            />
          </div>

          <div className="form-group">
            <label>예약 가능 여부 *</label>
            <div className="category-buttons">
              <button
                type="button"
                className={`category-btn ${formData.isReservation === true ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({...prev, isReservation: true}))}
              >
                Y
              </button>
              <button
                type="button"
                className={`category-btn ${formData.isReservation === false ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({...prev, isReservation: false}))}
              >
                N
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowAddForm(false)}>
              취소
            </button>
            <button type="submit" className="submit-btn">
              {initialData ? '맛집 수정하기' : '맛집 추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantForm;