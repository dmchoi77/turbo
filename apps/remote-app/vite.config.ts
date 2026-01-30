import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

const REMOTE_APP_URL = process.env.VITE_REMOTE_APP_URL || "http://localhost:3200";

export default defineConfig({
  server: {
    port: 3200,
    cors: true,
    origin: REMOTE_APP_URL,
  },
  preview: {
    port: 3200,
    cors: true,
  },
  base: `${REMOTE_APP_URL}/`,
  build: {
    target: "chrome89",
    minify: false,
    cssCodeSplit: false,
  },
  plugins: [
    react(),
    federation({
      name: "remoteApp",
      filename: "remoteEntry.js",
      manifest: true,
      exposes: {
        "./App": "./src/App.tsx",
        "./count": "./src/stores/count.ts",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
      },
    }),
  ],
});
