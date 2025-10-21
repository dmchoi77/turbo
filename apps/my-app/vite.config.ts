import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

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
          entry:
            process.env.VITE_REMOTE_APP_URL ||
            "http://localhost:3200/remoteEntry.js",
          name: "remoteApp",
          type: "module",
        },
      },
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
