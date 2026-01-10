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
  "data-visualization",
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
    external: ["react", "react-dom", "framer-motion"],
    plugins: [
      peerDepsExternal(),
      resolve({ browser: true }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true, // 타입 선언도 함께 생성
        declarationDir: "dist",
      }),
    ],
  },

  // ESM build - root index
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "es",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].mjs",
    },
    external: ["react", "react-dom", "framer-motion"],
    plugins: [
      peerDepsExternal(),
      resolve({ browser: true }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true, // 타입 선언도 함께 생성
        declarationDir: "dist",
      }),
    ],
  },
];
