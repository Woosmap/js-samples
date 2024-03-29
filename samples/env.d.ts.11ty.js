module.exports = {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      permalink: (data) => `/samples/${data.sample.fileSlug}/app/env.d.ts`,
      pagination: {
        data: "collections.samples_ts",
        alias: "sample",
        size: 1,
      },
    };
  },

  render({ sample }) {
    let output = `/// <reference types="vite/client" />

/**
 *  @external https://vitejs.dev/guide/env-and-mode.html
 */
interface ImportMetaEnv {
    readonly VITE_WOOSMAP_PUBLIC_API_KEY: string`;

    if (sample.data.GOOGLE_API_KEY) {
      output += `
    readonly VITE_GOOGLE_API_KEY: string`;
    }

    output += `
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}`;

    return output;
  },
};
