module.exports = function (html) {
  return html.replace(/^[ \t]*<!-- prettier-ignore -->\n/gm, "");
};
