import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
 import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    minify: false,
    sourcemap: false,              // карты тяжелые
    reportCompressedSize: false,   // не считать gzip/brotli
    chunkSizeWarningLimit: 1500,   // просто чтоб не пугало
    // Если у тебя один огромный бандл — разрежь вендоры:
    rollupOptions: {
      treeshake: false,
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
