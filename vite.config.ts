import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Fall back to localhost so missing .env never silently hits production
  const apiBase = env.VITE_API_BASE_URL || 'http://localhost:8080';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://37tsyfkuv9.eu-central-1.awsapprunner.com',
        changeOrigin: true,
        secure: false,
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});


