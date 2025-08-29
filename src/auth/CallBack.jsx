import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PostAxiosInstance } from '../axios/AxiosMethod';
import { getUserProfile } from '../api/oauth';

const CallBack = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      const exchangeCodeForToken = async () => {
        try {
          const backendResponse = await PostAxiosInstance('/api/oauth/google', { code });
          
          if (backendResponse.status >= 200 && backendResponse.status < 300) {
            const userProfile = await getUserProfile();
            if (userProfile && userProfile.data) {
              onLogin(userProfile.data);
              navigate('/'); // 성공 시 메인 페이지로 이동
            } else {
              console.error('Failed to fetch user profile after login.');
              alert('로그인 후 사용자 정보를 불러오는 데 실패했습니다.');
              navigate('/login');
            }
          } else {
            const errorData = backendResponse.data;
            console.error('Backend authentication failed:', errorData.message);
            alert('로그인 실패: ' + (errorData.message || '서버 오류'));
            navigate('/login'); // 실패 시 로그인 페이지로 이동
          }
        } catch (error) {
          console.error('Error during Google login callback:', error);
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            alert(`로그인 실패: ${error.response.data.message || '서버 오류'}`);
          } else if (error.request) {
            console.error('Request data:', error.request);
            alert('로그인 중 네트워크 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
          } else {
            console.error('Error message:', error.message);
            alert('로그인 요청 중 오류가 발생했습니다.');
          }
          navigate('/login'); // 오류 시 로그인 페이지로 이동
        }
      };

      exchangeCodeForToken();
    } else {
      // URL에 코드가 없는 경우
      console.error("Google OAuth code not found in callback URL.");
      alert("로그인에 필요한 인증 코드를 찾을 수 없습니다.");
      navigate('/login');
    }
  }, [location, navigate, onLogin]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>로그인 처리 중입니다. 잠시만 기다려주세요...</h2>
    </div>
  );
};

export default CallBack;
