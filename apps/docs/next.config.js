/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';
import { StatsWriterPlugin } from 'webpack-stats-plugin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (process.env.ANALYZE === 'true' && !isServer && !dev) {
      // Generate stats.json for bundle analysis in .next directory
      config.plugins.push(
        new StatsWriterPlugin({
          filename: 'stats.json',
          stats: {
            all: false,
            chunks: true,
            chunkModules: true,
            chunkOrigins: true,
            modules: true,
            moduleTrace: true,
            reasons: false,
            usedExports: false,
          },
        })
      );
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
