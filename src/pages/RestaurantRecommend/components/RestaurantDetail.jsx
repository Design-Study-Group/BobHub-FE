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
  const [editingComment, setEditingComment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log("RestaurantDetail currentUser:", currentUser);
    console.log("RestaurantDetail currentRestaurant:", currentRestaurant);
  }, [currentRestaurant, currentUser]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const createdComment = await createComment(currentRestaurant.id, {
        content: newComment,
        userId: currentUser.id,
      });

      // Add userName to the new comment object for immediate display
      const newCommentObject = {
        ...createdComment,
        userName: currentUser.name
      };

      setComments([...comments, newCommentObject]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const updated = await updateComment(currentRestaurant.id, commentId, { content });
      setComments(comments.map(c => c.id === commentId ? updated : c));
      setEditingComment(null);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(currentRestaurant.id, commentId);
      setComments(comments.filter(c => c.id !== commentId));
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
              <span>{currentRestaurant.star}/5.0</span>
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
              <span>예약 가능 여부</span>
              <span>{currentRestaurant.isReservation ? '가능' : '불가능'}</span>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h3>댓글</h3>
          <div className='review-form'>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
              />
              <div className='review-form-controls'>
                <button type="submit" className='submit-review-btn'>작성</button>
              </div>
            </form>
          </div>

          <div className="reviews-list">
            {comments.map(comment => (
              <div key={comment.id} className="review-item">
                <div className="review-header">
                  <span className="review-user">{comment.userName}</span>
                    {currentUser && comment.userId === currentUser.id && (
                      <div className="comment-actions">
                        <button onClick={() => setEditingComment(comment)}>수정</button>
                        <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                      </div>
                    )}
                </div>
                <p className="review-comment">{comment.content}</p>
              </div>
            ))}
          </div>

          {editingComment && (
            <div className='review-form'>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateComment(editingComment.id, e.target.content.value);
                }}>
                  <textarea name="content" defaultValue={editingComment.content} />
                  <div className='review-form-controls'>
                    <button type="submit" className='submit-review-btn'>수정 완료</button>
                    <button onClick={() => setEditingComment(null)}>취소</button>
                  </div>
                </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
