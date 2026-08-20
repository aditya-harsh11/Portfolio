import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api/* is a Vercel serverless function (api/visits.js), which plain
      // `vite dev` doesn't execute locally — forward to the live deployment.
      '/api': {
        target: 'https://aditya-harsh.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
