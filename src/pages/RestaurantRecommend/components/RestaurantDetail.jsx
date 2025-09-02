import React, { useState, useEffect } from 'react';
import './RestaurantDetail.css';
import {
  createComment,
  updateComment,
  deleteComment,
  updateRecommendation,
  deleteRecommendation
} from '../../../api/restaurantApi';
import AddRestaurantForm from './AddRestaurantForm';

const RestaurantDetail = ({ restaurant, currentUser, onBack }) => {
  const [currentRestaurant, setCurrentRestaurant] = useState(restaurant);
  const [comments, setComments] = useState(currentRestaurant.comments || []);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingRating, setEditingRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log("RestaurantDetail currentUser:", currentUser);
    console.log("RestaurantDetail currentRestaurant:", currentRestaurant);
  }, [currentRestaurant, currentUser]);

  

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && newRating === 0) return;

    try {
      const createdComment = await createComment(currentRestaurant.id, {
        content: newComment,
        star: newRating,
        userId: currentUser.id,
      });

      const newCommentObject = {
        ...createdComment,
        userName: currentUser.name,
        star: newRating, // Ensure star rating is included for immediate calculation
      };

      const updatedComments = [...comments, newCommentObject];
      setComments(updatedComments);

      // Recalculate average rating and count
      const ratingsWithStars = updatedComments.filter(c => c.star && c.star > 0);
      const newRatingCount = ratingsWithStars.length;
      const newAverageRating = newRatingCount > 0
        ? (ratingsWithStars.reduce((acc, c) => acc + c.star, 0) / newRatingCount)
        : 0;

      // Update the restaurant state to trigger re-render
      setCurrentRestaurant(prev => ({
        ...prev,
        averageRating: newAverageRating,
        ratingCount: newRatingCount
      }));

      setNewComment('');
      setNewRating(0);
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleUpdateComment = async (commentId, content, star) => {
    try {
      await updateComment(currentRestaurant.id, commentId, { content, star });
      
      // Manually update the comment in the local state to ensure content and star are reflected
      const updatedComments = comments.map(c => {
        if (c.id === commentId) {
          return { ...c, content: content, star: star }; 
        }
        return c;
      });
      setComments(updatedComments);

      // Recalculate average rating and count after update
      const ratingsWithStars = updatedComments.filter(c => c.star && c.star > 0);
      const newRatingCount = ratingsWithStars.length;
      const newAverageRating = newRatingCount > 0
        ? (ratingsWithStars.reduce((acc, c) => acc + c.star, 0) / newRatingCount)
        : 0;

      // Update the restaurant state to trigger re-render
      setCurrentRestaurant(prev => ({
        ...prev,
        averageRating: newAverageRating,
        ratingCount: newRatingCount
      }));

      setEditingCommentId(null);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(currentRestaurant.id, commentId);
      const updatedComments = comments.filter(c => c.id !== commentId);
      setComments(updatedComments);

      // Recalculate average rating and count after deletion
      const ratingsWithStars = updatedComments.filter(c => c.star && c.star > 0);
      const newRatingCount = ratingsWithStars.length;
      const newAverageRating = newRatingCount > 0
        ? (ratingsWithStars.reduce((acc, c) => acc + c.star, 0) / newRatingCount)
        : 0;

      // Update the restaurant state to trigger re-render
      setCurrentRestaurant(prev => ({
        ...prev,
        averageRating: newAverageRating,
        ratingCount: newRatingCount
      }));

    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 맛집을 삭제하시겠습니까?')) {
      try {
        await deleteRecommendation(currentRestaurant.id);
        alert('맛집이 삭제되었습니다.');
        onBack();
      } catch (error) {
        console.error('Failed to delete restaurant:', error);
        alert('맛집 삭제에 실패했습니다.');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      const updatedRestaurant = await updateRecommendation(currentRestaurant.id, formData);
      setCurrentRestaurant(updatedRestaurant);
      setIsEditing(false);
      alert('맛집 정보가 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update restaurant:', error);
      alert('맛집 수정에 실패했습니다.');
    }
  };

  if (isEditing) {
    return (
      <AddRestaurantForm 
        initialData={currentRestaurant}
        onSave={handleSave}
        setShowAddForm={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="restaurant-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← 목록으로
        </button>
        <h2>{currentRestaurant.storeName}</h2>
        {currentUser && currentRestaurant.userId === currentUser.id && (
          <div className="action-buttons">
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </div>
        )}
      </div>

      <div className="detail-content">
        <div className="info-section">
          <h3>기본 정보</h3>
          <div className="info-grid">
            <div className="info-item">
              <span>⭐ 평점</span>
              <span>{currentRestaurant.averageRating != null ? currentRestaurant.averageRating.toFixed(1) : 'N/A'}/5.0 ({currentRestaurant.ratingCount || 0})</span>
            </div>
            <div className="info-item">
              <span>🍽️ 대표 메뉴</span>
              <span>{currentRestaurant.description}</span>
            </div>
            <div className="info-item">
              <span>⏰ 예상 소요 시간</span>
              <span>{currentRestaurant.totalTime}분</span>
            </div>
            <div className="info-item">
              <span>💰 1인당 가격</span>
              <span>{currentRestaurant.pricePerPerson}원</span>
            </div>
            <div className="info-item">
              <span>📲 예약 가능 여부</span>
              <span>{currentRestaurant.isReservation ? '가능' : '불가능'}</span>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h3>댓글</h3>
          <div className='review-form'>
            <form onSubmit={handleCommentSubmit}>
              <div className="comment-controls-top">
                <div className="rating-input">
                  <label>별점:</label>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} onClick={() => setNewRating(star)} className={newRating >= star ? 'active' : ''}>★</span>
                    ))}
                  </div>
                </div>
                <button type="submit" className='submit-review-btn'>작성</button>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="comment-textarea"
              />
            </form>
          </div>

          <div className="reviews-list">
            {comments.map(comment => (
              comment.id === editingCommentId ? (
                <div key={comment.id} className="review-item">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateComment(comment.id, e.target.content.value, editingRating);
                    }}>
                      <div className="review-header">
                        {comment.userName ? (
                          <span className="review-user">{comment.userName}</span>
                        ) : (
                          <span className="review-user withdrawn-user">탈퇴한 사용자</span>
                        )}
                        <div className='comment-actions'>
                          <button type="submit" className='submit-review-btn'>수정 완료</button>
                          <button type="button" onClick={() => setEditingCommentId(null)} className='submit-review-btn'>취소</button>
                        </div>
                      </div>
                      <div className="rating-input">
                        <label>별점:</label>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} onClick={() => setEditingRating(star)} className={editingRating >= star ? 'active' : ''}>★</span>
                          ))}
                        </div>
                      </div>
                      <textarea name="content" defaultValue={comment.content} className="comment-textarea" />
                    </form>
                </div>
              ) : (
                <div key={comment.id} className="review-item">
                  <div className="review-header">
                    {comment.userName ? (
                      <span className="review-user">{comment.userName}</span>
                    ) : (
                      <span className="review-user withdrawn-user">탈퇴한 사용자</span>
                    )}
                      {currentUser && comment.userId === currentUser.id && comment.id !== editingCommentId && (
                        <div className="comment-actions">
                          <button onClick={() => { setEditingCommentId(comment.id); setEditingRating(comment.star || 0); }}>수정</button>
                          <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                        </div>
                      )}
                  </div>
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={comment.star >= star ? 'active' : 'inactive'}>★</span>
                    ))}
                  </div>
                  <p className="review-comment">{comment.content}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
