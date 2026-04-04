import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // host: 'financeapp.local',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://monity.eu-central-1.elasticbeanstalk.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
