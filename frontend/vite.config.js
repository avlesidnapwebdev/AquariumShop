import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",   // 👈 for local development
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // redirect all /api requests to backend
    }
  }
});
