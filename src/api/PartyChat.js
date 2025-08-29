import { GetAxiosInstance, PostAxiosInstance } from '../axios/AxiosMethod';

// 파티 목록 조회
export const fetchParties = async (category = "DELIVERY") => {
  try {
    let url = '/parties';
    
    // 카테고리 파라미터 추가
    if (category) {
      url += `?category=${category}`;
    }
    
    const response = await GetAxiosInstance(url);
    
    // 백엔드에서 보낸 메시지가 있으면 alert
    if (response.data.message) {
      alert(response.data.message);
    }
    
    return response.data;
  } catch (error) {
    console.error('파티 목록 조회 실패:', error);
    
    // 에러 응답에서 메시지 추출
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    }
    
    return [];
  }
};

// 새 파티 생성 (JSON으로 전송)
export const createParty = async (payload) => {
  try {
    const response = await PostAxiosInstance('/parties', payload);
    
    // 백엔드에서 보낸 메시지가 있으면 alert
    if (response.data.message) {
      alert(response.data.message);
    }
    
    return response.data;
  } catch (error) {
    console.error('파티 생성 실패:', error);
    
    // 에러 응답에서 메시지 추출
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('파티 생성에 실패했습니다.');
    }
    
    throw error;
  }
};

// 파티 참여
export const joinParty = async (partyId) => {
  try {
    const response = await PostAxiosInstance(`/parties/${partyId}/join`, {});
    
    // 백엔드에서 보낸 메시지가 있으면 alert
    if (response.data.message) {
      alert(response.data.message);
    }
    
    return response.data;
  } catch (error) {
    console.error('파티 참여 실패:', error);
    
    // 에러 응답에서 메시지 추출
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('파티 참여에 실패했습니다.');
    }
    
    throw error;
  }
};