import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const entries = [
  "alert",
  "avatar",
  "badge",
  "button",
  "card",
  "checkbox",
  "code",
  "divider",
  "input",
  "modal",
  "pagination",
  "progress",
  "radio",
  "select",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
];

// Create input object for component entries (excluding root index)
const componentInput = entries.reduce((acc, entry) => {
  acc[entry] = `src/${entry}/index.tsx`;
  return acc;
}, {});

export default [
  // ESM build - components only
  {
    input: componentInput,
    output: {
      dir: "dist",
      format: "es",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name]/index.mjs",
    },
    external: ["react", "react-dom"],
    plugins: [
      peerDepsExternal(),
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

  // ESM build - root index only (without preserveModules)
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.mjs",
      format: "es",
      sourcemap: true,
    },
    external: ["react", "react-dom"],
    plugins: [
      peerDepsExternal(),
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
  // TypeScript declarations - components only
  {
    input: componentInput,
    output: {
      dir: "dist",
      format: "es",
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name]/index.d.ts",
    },
    external: ["react", "react-dom", "framer-motion"],
    plugins: [
      peerDepsExternal(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist",
        emitDeclarationOnly: true,
      }),
    ],
  },
  // TypeScript declarations - root index only
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    external: ["react", "react-dom"],
    plugins: [
      peerDepsExternal(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist",
        emitDeclarationOnly: true,
      }),
    ],
  },
];
