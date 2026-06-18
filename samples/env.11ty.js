module.exports = {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      permalink: (data) => `/samples/${data.sample.fileSlug}/app/.env`,
      pagination: {
        data: "collections.samples_ts",
        alias: "sample",
        size: 1,
      },
    };
  },

  render({ sample }) {
    let output = `VITE_WOOSMAP_PUBLIC_API_KEY=${sample.data.WOOSMAP_PUBLIC_API_KEY ? sample.data.WOOSMAP_PUBLIC_API_KEY : "woos-e1e5490b-19d1-34f8-9955-fd5cfc8c880f"}`;
    if (sample.data.GOOGLE_API_KEY) {
      output += `\nVITE_GOOGLE_API_KEY=${sample.data.GOOGLE_API_KEY}`;
    }
    return output;
  },
};
