import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 외부 IP 허용
    port: 5173, // 포트 지정
  },
});