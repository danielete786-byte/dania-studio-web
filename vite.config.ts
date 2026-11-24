import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
export default defineConfig({ base: '/dania-studio-web/', plugins: [react()],
  build: { rollupOptions: { input: {
    main: resolve(__dirname, 'index.html'),
    // Webs de muestra para clientes (propuestas comerciales)
    vegawagen: resolve(__dirname, 'demos/vegawagen/index.html') } } } })
