import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";

import pkg from "./package.json";

export default {
  input: "src/index.ts",
  plugins: [
    commonjs(),
    nodeResolve({ browser: true }),
    typescript(),
    PeerDepsExternalPlugin(),
  ],
  output: [
    {
      format: "cjs",
      file: pkg.main,
      exports: "auto",
      sourcemap: true,
    },
    {
      format: "esm",
      file: pkg.module,
      sourcemap: true,
    },
  ],
};