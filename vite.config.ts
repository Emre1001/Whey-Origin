import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: '/Whey-Origin/' => correct subpath for GitHub Pages deployment
export default defineConfig({
  base: '/Whey-Origin/',
  plugins: [react(), tailwindcss()],
})
