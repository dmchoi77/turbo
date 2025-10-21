import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3200,
  },
  plugins: [
    react(),
    federation({
      name: "remote-app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: {
          name: "react",
          singleton: true,
          requiredVersion: "^19.1.1",
        },
        "react-dom": {
          name: "react-dom",
          singleton: true,
          requiredVersion: "^19.1.1",
        },
      },
    }),
  ],
});
