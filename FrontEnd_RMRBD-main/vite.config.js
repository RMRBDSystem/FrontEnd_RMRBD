import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/rmrbd': {
        target: 'https://rmrbdapi.somee.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/rmrbd/, ''),
      },
      '/api/nominate': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        secure: true,  // Use true since Nominatim is over HTTPS
        rewrite: (path) => path.replace(/^\/api\/nominate/, ''),
      },
    },
  },
});
