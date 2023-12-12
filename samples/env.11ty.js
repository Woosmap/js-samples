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
    return `VITE_WOOSMAP_PUBLIC_API_KEY=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`;
  },
};
