import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // Vite 8 transforms JSX/TSX with Oxc, which honors the app tsconfig's
  // "jsx": "preserve". Force the automatic runtime so React samples build.
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  server: {
    hmr: process.env.CODESANDBOX_SSE ? 443 : undefined,
  },
});
