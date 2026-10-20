import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ["dist/**"],
  },
  ...compat.config({
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      sourceType: "module",
      requireConfigFile: false,
      ecmaVersion: 2017,
    },
    globals: {
      woosmap: "writable",
    },
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    rules: {
      // The TS rule replaces the base one under @typescript-eslint/recommended,
      // so the initMap-style callback exemption has to live on it.
      "no-unused-vars": 0,
      "@typescript-eslint/no-unused-vars": [2, { varsIgnorePattern: "^init" }],
      "no-var": 2,
      // The build scripts are CommonJS (typescript-eslint v8 renamed no-var-requires).
      "@typescript-eslint/no-require-imports": 0,
      "prefer-arrow-callback": 2,
    },
  }),
];
