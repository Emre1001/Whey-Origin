import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' => relative asset paths so it works on GitHub Pages under any repo subpath.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
