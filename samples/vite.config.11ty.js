module.exports = {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      permalink: (data) =>
        `/samples/${data.sample.fileSlug}/app/vite.config.js`,
      pagination: {
        data: "collections.samples_ts",
        alias: "sample",
        size: 1,
      },
    };
  },

  render() {
    return `import { defineConfig } from "vite";

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
`;
  },
};
