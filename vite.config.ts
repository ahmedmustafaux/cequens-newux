import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    // Enable history API fallback for SPA routing
    open: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    // SPA configuration
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    // Ensure assets are properly built
    assetsDir: 'assets',
    sourcemap: false,
  },
})
