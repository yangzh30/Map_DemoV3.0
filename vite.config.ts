import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Map_DemoV3.0/',
  server: {
    port: 3000,
    open: true
  }
})
