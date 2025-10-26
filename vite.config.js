import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use PostCSS (postcss.config.js) to integrate Tailwind; don't use @tailwindcss/vite here.
export default defineConfig({
  plugins: [react()],
})
