const path = require("path");
const prettier = require("prettier");
const stripPrettierIgnore = require("./strip-prettier-ignore");

module.exports = function (content, outputPath) {
  if (!content) {
    return content;
  }

  if (["vite.config.js"].includes(path.basename(outputPath))) {
    return prettier.format(content, { parser: "babel" });
  }

  if (outputPath.match(/env\.d\.ts$/)) {
    return prettier.format(content, { parser: "typescript" });
  }

  const ext = path.extname(outputPath);
  switch (ext) {
    case ".md":
      return prettier.format(content, { parser: "markdown" });
    case ".html": {
      const html = prettier.format(content, { parser: "html" });
      // The iframe build formats app/index.html again and needs the marker.
      return /\/app\//.test(outputPath) ? html : html.then(stripPrettierIgnore);
    }
    case ".js": // done as part of an earlier step
    default:
      return content;
  }
};
