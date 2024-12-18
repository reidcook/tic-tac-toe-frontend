import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      cert: './cert/cert.pem',
      key: './cert/key.pem'
    },
  }
})
