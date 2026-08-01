import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

const isProd = process.env.NODE_ENV === "production";

// 배포 환경과 로컬 환경에 따라 base URL을 동적으로 설정
const hostBaseUrl = isProd
  ? process.env.VITE_HOST_APP_URL
  : "http://localhost:3100";

export default defineConfig({
  server: {
    port: 3100,
  },
  build: {
    target: "esnext",
  },
  base: hostBaseUrl,
  plugins: [
    react(),
    federation({
      name: "host-app",
      filename: "hostEntry.js",
      exposes: {
        "./user": "./src/stores/user.ts",
      },
      remotes: {
        remoteApp: {
          entry:
            process.env.VITE_REMOTE_APP_ENTRY_URL ||
            "http://localhost:3200/remoteEntry.js",
          name: "remoteApp",
          type: "module",
        },
      },
      shared: {
        react: {
          name: "react",
          version: "18.3.1",
          singleton: true,
          requiredVersion: "^18.3.1",
        },
        "react-dom": {
          name: "react-dom",
          version: "18.3.1",
          singleton: true,
          requiredVersion: "^18.3.1",
        },
        jotai: {
          name: "jotai",
          version: "2.15.0",
          singleton: true,
          requiredVersion: "^2.15.0",
        },
      },
    }),
  ],
});
