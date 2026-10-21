const _ = require("lodash");

const data = {
  ..._.pick(
    {
      WOOSMAP_PUBLIC_API_KEY: "woos-e1e5490b-19d1-34f8-9955-fd5cfc8c880f",
      WOOSMAP_SDK_HOST: "https://sdk.woosmap.com",
      ...process.env,
    },
    ["WOOSMAP_PUBLIC_API_KEY", "WOOSMAP_SDK_HOST"],
  ),
  libraries: [],
  mode: ["jsfiddle", "docs", "app", "highlight"],
  availableTypings: ["@types/woosmap.map", "@types/geojson"],
  devDependencies: ["@types/woosmap.map", "typescript", "vite"],
  dependencies: [],
  scripts: {
    dev: "vite",
    start: "vite",
    build: "vite build --outDir dist --base './'",
    test: "tsc --no-emit",
    preview: "vite preview",
  },
};

module.exports = data;
