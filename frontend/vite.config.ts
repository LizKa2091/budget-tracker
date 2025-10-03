import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
   globals: true,
   environment: 'jsdom',
   setupFiles: './src/setupTests.ts'
  },
  resolve: {
   alias: {
      '@': path.resolve(__dirname, './src'),
   }
  },
  css: {
   preprocessorOptions: {
      scss: {
         additionalData: `@use "@/styles/variables" as *;`
      }
   }
  }
})