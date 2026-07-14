import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/nto/ — assets must be prefixed with /nto/.
  base: "/nto/",
  plugins: [react()],
})
