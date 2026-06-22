import vike from "vike/plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const railsProxyTarget = import.meta.env.VITE_RAILS_PROXY_TARGET || "http://127.0.0.1:5000";

export default defineConfig({
  plugins: [vike(), react(), tailwindcss()],
  server: {
    proxy: {
      "/auth": {
        target: railsProxyTarget,
        changeOrigin: true,
      },
      "/api": {
        target: railsProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
