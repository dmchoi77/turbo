import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3100,
  },
  build: {
    target: "esnext",
  },
  plugins: [
    react(),
    federation({
      name: "host-app",
      remotes: {
        remoteApp: {
          entry: "http://localhost:3200/remoteEntry.js",
          name: "remoteApp",
          type: "module",
        },
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
