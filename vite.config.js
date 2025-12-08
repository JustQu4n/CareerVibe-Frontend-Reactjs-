import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy API calls to backend to avoid CORS in development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      // Note: we intentionally do NOT proxy `/socket.io` here because
      // websocket proxying through Vite can cause intermittent ECONNABORTED
      // errors for long-lived socket.io connections. Instead the client
      // should connect directly to the backend socket URL using
      // `VITE_SOCKET_URL` in development (example: `http://localhost:5000`).
    }
  }
})
