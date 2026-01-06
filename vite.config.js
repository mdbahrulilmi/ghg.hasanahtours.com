import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
  proxy: {
    "/duft": {
      target: "https://testing.duft.co.id",
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/duft/, "")
    }
  }
}
});
