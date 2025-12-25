import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // <--- Make sure this is imported

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      // This tells Vite that @/ means the src folder
      "@": path.resolve(__dirname, "./src"),
    },
  },
});