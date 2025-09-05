import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'

export default defineConfig({
  plugins: [react()],
  root: './src/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      external: ['electron'],
    },
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src/renderer'),
    },
  },
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ['@xenova/transformers'],
  },
  define: {
    global: 'globalThis',
  },
  worker: {
    format: 'es'
  },
})
