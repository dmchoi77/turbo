import { globSync } from "glob";
import webpack from "webpack";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEntries() {
  const srcDir = path.resolve(__dirname, "src");
  const files = globSync("**/*.{ts,tsx}", {
    cwd: srcDir,
    ignore: [
      "**/*.d.ts",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/*.stories.ts",
      "**/*.stories.tsx",
    ],
  });

  const entries = {};
  for (const file of files) {
    const entryName = file.replace(/\.(ts|tsx)$/, "");
    entries[entryName] = path.resolve(srcDir, file);
  }

  return entries;
}

function getExternals() {
  const externals = [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react-dom/client",
  ];

  return ({ context: _context, request }, callback) => {
    if (externals.includes(request)) {
      return callback(null, request);
    }

    if (request.startsWith("@legacy/")) {
      return callback();
    }

    if (!path.isAbsolute(request) && !request.startsWith(".")) {
      return callback(null, request);
    }

    callback();
  };
}

const entries = getEntries();

export default {
  mode: "production",
  entry: entries,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: {
      type: "module",
    },
    chunkFormat: "module",
    environment: {
      module: true,
    },
    clean: false,
    module: true,
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      "@legacy/definitions": path.resolve(__dirname, "src/definitions"),
      "@legacy/helpers": path.resolve(__dirname, "src/helpers"),
    },
  },
  externals: getExternals(),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                  decorators: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                  },
                },
                target: "esnext",
                loose: false,
              },
              module: {
                type: "es6",
              },
              sourceMaps: true,
              minify: false,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: false,
    runtimeChunk: false,
    splitChunks: false,
  },
};
