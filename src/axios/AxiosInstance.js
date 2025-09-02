import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true, // 쿠키를 포함하여 요청을 보낼 수 있도록 설정
});

const refreshAxiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

const getRefresh = () => refreshAxiosInstance.get('/api/refresh');

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
    // 성공 응답은 그대로 반환
    (response) => response,

    // 에러 처리
    async (error) => {
        const originalConfig = error.config;
        const errorCode = error.response?.data?.code;

        // 1. 액세스 토큰 만료 시, 토큰 갱신 시도
        if (errorCode === 'AUTH_001' && !originalConfig._retry) {
            originalConfig._retry = true; // 무한 루프 방지를 위해 재시도 플래그 설정

            try {
                await getRefresh(); // 새 액세스 토큰 발급 시도
                return axiosInstance(originalConfig); // 원래 요청을 다시 시도
            } catch (refreshError) {
                // 리프레시 토큰마저 만료되었거나 유효하지 않은 경우 -> 로그아웃
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // 2. 유효하지 않은 토큰 / 토큰 없음 에러 시 -> 로그아웃
        if (errorCode === 'AUTH_002' || errorCode === 'AUTH_003') {
            alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // 그 외 다른 모든 에러는 그대로 반환 (AUTH_004 포함)
        return Promise.reject(error);
    }
);

export default axiosInstance;