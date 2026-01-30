const { NextFederationPlugin } = require("@module-federation/nextjs-mf");
const path = require("path");

const REMOTE_APP_URL = process.env.REMOTE_APP_URL || "http://localhost:3200";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    const { isServer } = options;

    if (isServer) {
      // On server, alias remoteApp/* to empty module
      config.resolve.alias["remoteApp/App"] = path.resolve(
        __dirname,
        "lib/empty-module.js"
      );
    } else {
      // On client, use Module Federation
      config.plugins.push(
        new NextFederationPlugin({
          name: "nextjsHost",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            remoteApp: `remoteApp@${REMOTE_APP_URL}/mf-manifest.json`,
          },
          shared: {
            react: {
              singleton: true,
              requiredVersion: false,
            },
            "react-dom": {
              singleton: true,
              requiredVersion: false,
            },
          },
          extraOptions: {
            exposePages: false,
            skipSharingNextInternals: true,
          },
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
