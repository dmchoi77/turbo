import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default [
  // ESM build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.mjs",
      format: "es",
      sourcemap: true,
    },
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationDir: undefined,
      }),
    ],
  },
  // CJS build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationDir: undefined,
      }),
    ],
  },
];

