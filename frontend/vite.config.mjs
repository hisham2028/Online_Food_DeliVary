import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    historyApiFallback: true, // fixes /menu 404 on refresh
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },

  build: {
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }

          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/@remix-run/')
          ) {
            return 'vendor-router';
          }

          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }

          if (id.includes('node_modules/react-toastify')) {
            return 'vendor-toast';
          }

          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
});