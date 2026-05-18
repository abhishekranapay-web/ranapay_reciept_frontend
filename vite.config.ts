import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";
import tailwindVite from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tsConfigPaths(), tailwindVite()],
  build: {
    target: "ES2020",
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["@tanstack/react-router"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
  ssr: undefined,
});
