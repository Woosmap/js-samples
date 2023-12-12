module.exports = function (content, outputPath) {
  if (!content) {
    return content;
  }

  if (/app\/index\.tsx?$/.test(outputPath)) {
    content = content.replace(
      /"YOUR_API_KEY"/g,
      "import.meta.env.VITE_WOOSMAP_PUBLIC_API_KEY!",
    );
  }
  return content;
};
