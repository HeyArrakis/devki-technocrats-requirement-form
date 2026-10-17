import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` makes every asset path relative, so the build works on
// GitHub Pages (https://<user>.github.io/<repo>/) without knowing the repo name.
export default defineConfig({
  plugins: [react()],
  base: './',
})
