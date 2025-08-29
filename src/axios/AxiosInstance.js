import axios from "axios";
import { getRefresh } from '../api/oauth';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // 쿠키를 포함하여 요청을 보낼 수 있도록 설정
});

axiosInstance.interceptors.request.use(
    async (config) => {
        // 로그인 요청과 같이 토큰이 필요 없는 API 경로 목록
        const publicApiUrls = ['/api/oauth/google'];

        // 현재 요청 경로가 publicApiUrls에 포함되어 있다면 토큰 검사를 건너뜁니다.
        if (publicApiUrls.includes(config.url)) {
            return config;
        }
        // 토큰이 쿠키에 저장되므로, 브라우저가 자동으로 요청에 포함시킵니다.
        // 따라서 클라이언트에서 수동으로 헤더에 추가할 필요가 없습니다.
        return config;
    }, (error) => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    async (response) => {
        return response;
    },

    async (error) => {
        // 토큰 만료 에러 코드 (예: AUTH_001)가 발생했을 때만 처리
        if (error.response?.data?.code === 'AUTH_001') {
            console.log('토큰 만료, 갱신 시도');
            const originalConfig = error.config;
            // 재요청을 한 번만 시도하도록 플래그 설정 (무한 루프 방지)
            if (originalConfig._retry) {
                localStorage.clear();
                window.location.href = '/login';
                alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                return Promise.reject(error);
            }
            originalConfig._retry = true;

            try {
                // getRefresh 함수는 이제 백엔드에서 쿠키를 통해 리프레시 토큰을 처리한다고 가정합니다.
                // 따라서 클라이언트에서 리프레시 토큰을 명시적으로 전달할 필요가 없습니다.
                // 백엔드는 리프레시 토큰 쿠키를 확인하고 새 액세스 토큰 쿠키를 설정할 것입니다.
                await getRefresh(); // 리프레시 토큰을 인자로 전달하지 않음

                // 새 액세스 토큰은 쿠키에 설정되었으므로, 다음 요청 시 브라우저가 자동으로 포함합니다.
                // 따라서 originalConfig.headers['Authorization']을 수동으로 업데이트할 필요가 없습니다.
                return axiosInstance(originalConfig);
            } catch (e) {
                // 리프레시 실패 시 로그인 페이지로 리다이렉트
                localStorage.clear();
                window.location.href = '/login';
                alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                return Promise.reject(e);
            }
        }
        // 다른 종류의 에러는 그대로 반환
        return Promise.reject(error);
    }
);

export default axiosInstance;