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
      "no-unused-vars": [1, { varsIgnorePattern: "init*" }],
      "no-var": 2,
      "@typescript-eslint/no-var-requires": 0,
      "prefer-arrow-callback": 2,
    },
  }),
];
