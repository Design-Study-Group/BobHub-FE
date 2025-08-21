import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      // svgr options
      svgrOptions: {
        // icon: true, // This option can be useful if you want to optimize SVGs for icons
      },
      // Explicitly set to export as default
      exportAsDefault: true,
    }),
  ],
  server: {
    host: true, // 외부 IP 허용
    port: 5173, // 포트 지정
  },
});