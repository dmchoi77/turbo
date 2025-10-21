import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

const isProd = process.env.NODE_ENV === "production";

// 배포 환경과 로컬 환경에 따라 base URL을 동적으로 설정
const hostBaseUrl = isProd
  ? "https://turbo-my-app.vercel.app"
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
        jotai: {
          name: "jotai",
          singleton: true,
        },
      },
    }),
  ],
});
