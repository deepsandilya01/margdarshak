import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/lingva': {
        target: 'https://lingva.ml',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lingva/, '/api/v1')
      }
    }
  }
})
