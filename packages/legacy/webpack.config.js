import { globSync } from "glob";
import webpack from "webpack";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 모든 TypeScript 파일을 entry로 설정
 * 각 디렉토리의 모든 파일을 빌드하여 index.js에서 re-export할 수 있도록 합니다.
 */
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
    // 확장자 제거하여 entry 이름 생성
    const entryName = file.replace(/\.(ts|tsx)$/, "");
    entries[entryName] = path.resolve(srcDir, file);
  }

  // biome-ignore lint/suspicious/noConsole: 빌드 스크립트에서 디버깅을 위해 console 사용 필요
  console.log(`Found ${Object.keys(entries).length} entries`);
  if (Object.keys(entries).length === 0) {
    // biome-ignore lint/suspicious/noConsole: 빌드 스크립트에서 디버깅을 위해 console 사용 필요
    console.warn(
      "⚠️  No entries found! Check if src directory exists and contains .ts/.tsx files."
    );
  } else {
    // biome-ignore lint/suspicious/noConsole: 빌드 스크립트에서 디버깅을 위해 console 사용 필요
    console.log("Sample entries:", Object.keys(entries).slice(0, 5));
  }

  return entries;
}

/**
 * package.json에서 external로 처리할 패키지 목록 생성
 */
function getExternals() {
  // peerDependencies와 주요 라이브러리들을 external로 처리
  const externals = [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react-dom/client",
  ];

  // node_modules의 다른 패키지들도 external로 처리
  return ({ context: _context, request }, callback) => {
    // 정확한 패키지 이름 매칭
    if (externals.includes(request)) {
      return callback(null, request);
    }

    // @legacy/* path alias는 external로 처리하지 않음 (내부 모듈)
    if (request.startsWith("@legacy/")) {
      return callback();
    }

    // node_modules의 다른 패키지들도 external로 처리
    if (!path.isAbsolute(request) && !request.startsWith(".")) {
      return callback(null, request);
    }

    callback();
  };
}

/**
 * webpack 설정 생성
 */
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
    clean: false, // build:types에서 생성한 .d.ts 파일을 보존하기 위해 false로 설정
    module: true,
    chunkLoading: false, // ESM에서는 chunk loading 불필요
    wasmLoading: false,
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
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: false,
    usedExports: true,
    runtimeChunk: false, // ESM 모듈 출력에서는 런타임 chunk를 생성하지 않음
    splitChunks: false, // 코드 분할 비활성화하여 런타임 chunk 생성 방지
    moduleIds: "deterministic",
    chunkIds: "deterministic",
  },
  devtool: "cheap-module-source-map",
  stats: {
    errorDetails: true,
    modules: false,
    chunks: false,
    chunkModules: false,
  },
};
