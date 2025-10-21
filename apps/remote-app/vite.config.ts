import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3200,
  },
  build: {
    target: "esnext",
  },
  plugins: [
    react(),
    federation({
      name: "remote-app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      publicPath: process.env.VITE_REMOTE_APP_URL || "http://localhost:3200",
      shared: {
        react: {
          name: "react",
          singleton: true,
        },
        "react-dom": {
          name: "react-dom",
          singleton: true,
        },
      },
    }),
  ],
});
