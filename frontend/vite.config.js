import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    // Raise the warning threshold so you only hear about truly large chunks
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ── Core React runtime ──────────────────────────────────────────
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }

          // ── Routing ─────────────────────────────────────────────────────
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run/')) {
            return 'vendor-router';
          }

          // ── Animation (framer-motion is large ~100 kB) ──────────────────
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }

          // ── Toast notifications ─────────────────────────────────────────
          if (id.includes('node_modules/react-toastify')) {
            return 'vendor-toast';
          }

          // ── Everything else in node_modules → shared vendor chunk ────────
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
});