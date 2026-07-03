import vike from "vike/plugin";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const railsProxyTarget = env.VITE_RAILS_PROXY_TARGET || "http://localhost:5001";
  const devPort = Number(env.VITE_PORT || env.PORT || 3000);

  return {
    plugins: [vike(), react(), tailwindcss()],
    server: {
      port: devPort,
      strictPort: true,
      proxy: {
        "/auth": {
          target: railsProxyTarget,
          changeOrigin: false,
        },
        "/api": {
          target: railsProxyTarget,
          changeOrigin: false,
        },
      },
    },
  };
});
