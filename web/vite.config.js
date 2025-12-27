import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

// Set vite to run on different host
  server: {
    host: true,      // Listen on all network interfaces
    port: 5173,      // Ensure it stays on 5173
    strictPort: true // If 5173 is busy, fail instead of picking a random port
  }
});