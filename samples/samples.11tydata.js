const _ = require("lodash");

const data = {
  ..._.pick(
    {
      WOOSMAP_PUBLIC_API_KEY: "woos-4fdc8f8d-e161-3fb8-9a57-e1759c71716a",
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
