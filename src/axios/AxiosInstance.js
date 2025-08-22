import axios from "axios";
import { getRefresh } from '../api/oauth';

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL });

axiosInstance.interceptors.request.use(
    async (config) => {
        // 로그인 요청과 같이 토큰이 필요 없는 API 경로 목록
        const publicApiUrls = ['/api/oauth/google'];

        // 현재 요청 경로가 publicApiUrls에 포함되어 있다면 토큰 검사를 건너뜁니다.
        if (publicApiUrls.includes(config.url)) {
            return config;
        }

        const accessToken = localStorage.getItem('token');

        if(!accessToken){
            localStorage.clear();
            window.location.href = '/login';
            throw new Error('AccessToken 없음');
        }

        config.headers['Authorization'] = `Bearer ${accessToken}`;
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
        if (error.response?.data?.code === 'AUTH_001'){
            console.log('토큰 만료, 갱신 시도');
            const originalConfig = error.config;
            try {
                const refresh = localStorage.getItem('refresh');
                const res = await getRefresh(refresh);
                localStorage.setItem('token', res.data.token);
                originalConfig.headers['Authorization'] = `Bearer ${res.data.token}`;
                return axiosInstance(originalConfig);
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;