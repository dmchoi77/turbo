/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  transpilePackages: ['@repo/ui', '@repo/utils'],
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          workspace: {
            test: /[\\/]node_modules[\\/]@repo[\\/]/,
            name: 'workspace-packages',
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
        },
      };
    }

    if (process.env.ANALYZE === 'true' && !isServer && !dev) {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.done.tap('StatsWriterPlugin', (stats) => {
            const statsJson = stats.toJson({
              all: false,
              chunks: true,
              chunkModules: true,
              chunkOrigins: true,
              modules: true,
              moduleTrace: true,
              reasons: false,
              usedExports: false,
            });

            const outputPath = compiler.options.output.path;
            const statsPath = join(outputPath, 'stats.json');
            writeFileSync(statsPath, JSON.stringify(statsJson, null, 2));
          });
        },
      });
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
