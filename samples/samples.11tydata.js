const _ = require("lodash");

const data = {
  ..._.pick(
    {
      WOOSMAP_PUBLIC_API_KEY: "woos-48c80350-88aa-333e-835a-07f4b658a9a4",
      ...process.env,
    },
    ["WOOSMAP_PUBLIC_API_KEY"],
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
