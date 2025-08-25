import api from '../axios/AxiosInstance';

const RECOMMENDATION_API_URL = '/api/recommendation';

// 모든 추천 게시물 조회 (GET)
export const getAllRecommendations = async () => {
  try {
    const response = await api.get(RECOMMENDATION_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching all recommendations:', error);
    throw error;
  }
};

// ID로 특정 추천 게시물 조회 (GET)
export const getRecommendationById = async (id) => {
  try {
    const response = await api.get(`${RECOMMENDATION_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recommendation with id ${id}:`, error);
    throw error;
  }
};

// 새 추천 게시물 생성 (POST)
export const createRecommendation = async (recommendationData) => {
  try {
    const response = await api.post(RECOMMENDATION_API_URL, recommendationData);
    return response.data;
  } catch (error) {
    console.error('Error creating recommendation:', error);
    throw error;
  }
};

// 추천 게시물 수정 (PUT)
export const updateRecommendation = async (id, recommendationData) => {
  try {
    const response = await api.put(`${RECOMMENDATION_API_URL}/${id}`, recommendationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating recommendation with id ${id}:`, error);
    throw error;
  }
};

// 추천 게시물 삭제 (DELETE)
export const deleteRecommendation = async (id) => {
  try {
    const response = await api.delete(`${RECOMMENDATION_API_URL}/${id}`);
    return response.data; // 또는 response.status
  } catch (error) {
    console.error(`Error deleting recommendation with id ${id}:`, error);
    throw error;
  }
};


// Comments API

// 새 댓글 생성 (POST)
export const createComment = async (restaurantId, commentData) => {
  try {
    const response = await api.post(`/api/recommendation/${restaurantId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// 댓글 수정 (PUT)
export const updateComment = async (restaurantId, commentId, commentData) => {
  try {
    const response = await api.put(`/api/recommendation/${restaurantId}/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating comment with id ${commentId}:`, error);
    throw error;
  }
};

// 댓글 삭제 (DELETE)
export const deleteComment = async (restaurantId, commentId) => {
  try {
    await api.delete(`/api/recommendation/${restaurantId}/comments/${commentId}`);
  } catch (error) {
    console.error(`Error deleting comment with id ${commentId}:`, error);
    throw error;
  }
};