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

  render() {
    return `VITE_WOOSMAP_PUBLIC_API_KEY=woos-48c80350-88aa-333e-835a-07f4b658a9a4`;
  },
};
