import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PostAxiosInstance } from '../axios/AxiosMethod';

const CallBack = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      // 이 로직은 기존 Login.jsx의 onSuccess 핸들러에서 가져왔습니다.
      const exchangeCodeForToken = async () => {
        try {
          const backendResponse = await PostAxiosInstance('/api/auth/google', { code });
          
          if (backendResponse.status >= 200 && backendResponse.status < 300) {
            // 여기서 백엔드로부터 받은 사용자 정보나 토큰을 저장하는 로직이 필요합니다.
            // (예: Recoil, Redux, Context API 등)
            // 지금은 성공 알림 후 메인 페이지로 이동시킵니다.
            alert('로그인 성공!');
            navigate('/'); // 성공 시 메인 페이지로 이동
          } else {
            const errorData = backendResponse.data;
            console.error('Backend authentication failed:', errorData.message);
            alert('로그인 실패: ' + (errorData.message || '서버 오류'));
            navigate('/login'); // 실패 시 로그인 페이지로 이동
          }
        } catch (error) {
          console.error('Error during Google login callback:', error);
          alert('로그인 중 오류가 발생했습니다.');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>로그인 처리 중입니다. 잠시만 기다려주세요...</h2>
    </div>
  );
};

export default CallBack;
