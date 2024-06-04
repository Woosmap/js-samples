const fs = require("fs");
const path = require("path");

module.exports = {
  ...require("./sample"),
  outputFileExtension: "jsx",
  getData: async function () {
    return {
      tsconfig: JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "..", "..", "..", "tsconfig.json"),
          "utf8",
        ),
      ),
      file: [
        "docs.tsx",
        "docs.jsx",
        "app.tsx",
        "jsfiddle.jsx",
        "highlight.tsx",
        "highlight.jsx",
      ],
      pagination: {
        data: "file",
        alias: "file",
        size: 1,
      },
    };
  },
};
