import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
export default defineConfig({ base: '/dania-studio-web/', plugins: [react()],
  build: { rollupOptions: { input: { main: resolve(__dirname, 'index.html'), boveda: resolve(__dirname, 'boveda.html') } } } })
