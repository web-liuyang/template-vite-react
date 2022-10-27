// vite.config.js
import { defineConfig } from "vite";
import reactRefreshPlugin from "@vitejs/plugin-react-refresh";
import legacyPlugin from "@vitejs/plugin-legacy";
import ImporterPlugin from "vite-plugin-importer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefreshPlugin(),
    legacyPlugin({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    ImporterPlugin({
      libraryName: "antd-mobile",
      libraryDirectory: "es/components",
      style: false,
    }),
  ],
  css: {
    preprocessorOptions: {
      less: { javascriptEnabled: true },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@api": path.resolve(__dirname, "src/api"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@store": path.resolve(__dirname, "src/store"),
      "@router": path.resolve(__dirname, "src/router"),
    },
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: "build",
  },
});
