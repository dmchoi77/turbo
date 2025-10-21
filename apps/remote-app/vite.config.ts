import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

const isProd = process.env.NODE_ENV === "production";

// 배포 환경과 로컬 환경에 따라 base URL을 동적으로 설정
const remoteBaseUrl = isProd
  ? "https://turbo-remote-app.vercel.app"
  : "http://localhost:3200";

export default defineConfig({
  server: {
    port: 3200,
  },
  build: {
    target: "esnext",
  },
  base: remoteBaseUrl,
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
        },
        "react-dom": {
          name: "react-dom",
          singleton: true,
        },
      },
    }),
  ],
});
