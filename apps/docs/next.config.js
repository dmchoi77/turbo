/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';
import { writeFileSync } from 'fs';
import { join } from 'path';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (process.env.ANALYZE === 'true' && !isServer && !dev) {
      // Generate stats.json for bundle analysis in .next directory
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
