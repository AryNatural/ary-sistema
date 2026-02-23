import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      "wholesome-passion-production-c125.up.railway.app"
    ]
  }
});
