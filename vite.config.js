
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    assetsDir: 'static',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
        chunkFileNames: 'static/js/[name].[hash].js',
        entryFileNames: 'static/js/[name].[hash].js'
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.REACT_APP_API_URL': '"https://helpdesk-backend-ycoo.onrender.com/api"',
    'process.env.REACT_APP_WS_URL': '"wss://helpdesk-backend-ycoo.onrender.com/ws"',
    'process.env.REACT_APP_ENV': '"production"'
  }
})
