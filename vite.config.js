import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
      },
      exportAsDefault: true,
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // '/api'로 시작하는 요청을 백엔드 서버로 전달합니다.
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true, // CORS 오류를 방지하기 위해 필요합니다.
      },
    },
  },
  base: '/',
});