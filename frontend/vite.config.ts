import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the built app works when served from a GitHub Pages
  // project subpath (https://<user>.github.io/<repo>/) without needing to
  // hardcode the repository name.
  base: './',
})
