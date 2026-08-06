import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: fileURLToPath(new URL('./src/index.html', import.meta.url)),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/framer-motion')) return 'framer-motion';
        }
      }
    }
  }
})
