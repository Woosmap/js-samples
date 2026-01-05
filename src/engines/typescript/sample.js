/* eslint-disable @typescript-eslint/no-require-imports */
const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const prettier = require("prettier");
const Linter = require("eslint").Linter;
const { pathToFileURL } = require("url");

const linter = new Linter({ configType: "flat" });

// Lightweight ESLint config for transpiled JS output
// Comprehensive padding rules for optimal code readability in documentation
const transpiledJsConfig = Promise.resolve([
  {
    rules: {
      "no-unused-vars": [1, { varsIgnorePattern: "init*" }],
      "no-var": 2,
      "prefer-arrow-callback": 2,
      "padding-line-between-statements": [
        1,
        {
          blankLine: "always",
          prev: ["block-like", "block", "class", "const", "do", "for", "function", "if", "let", "switch", "try", "while", "with"],
          next: ["block-like", "block", "class", "do", "for", "function", "expression", "if", "switch", "try", "while", "with"],
        },
        {
          blankLine: "always",
          prev: ["block-like", "block", "class", "do", "expression", "for", "function", "if", "switch", "try", "while", "with"],
          next: ["const", "let"],
        },
        {
          blankLine: "always",
          prev: ["*"],
          next: ["function", "for"],
        },
      ],
    },
  },
]);

// Full ESLint config for raw TypeScript files
const fullLintConfig = import(
  pathToFileURL(
    path.join(__dirname, "..", "..", "..", "eslint.config.mjs"),
  ).href,
).then(({ default: config }) => config);

const formatWithLint = async (source, data) => {
  const lintConfig = await fullLintConfig;
  const cleaned = source.replace(/^.*PRESERVE_COMMENT_ABOVE.*\n?/gm, "");

  const { messages, output } = linter.verifyAndFix(cleaned, lintConfig, {
    filename: data.page.outputPath,
  });

  if (messages.filter((m) => m.severity === 2).length > 0) {
    throw new Error(
      JSON.stringify(
        { input: cleaned, messages, page: data.page, lintConfig },
        null,
        2,
      ),
    );
  }

  return output;
};

const compileTypescriptSample = async (source, data) => {
  let output = ts
    .transpileModule(source, { ...data.tsconfig, jsx: "preserve" })
    .outputText.replace(/export {([\w\d\s_,]*|\n)*};/g, "")
    .replace(/^.*PRESERVE_COMMENT_ABOVE.*\n?/gm, "")
    .trim();

  const startRegionTag = `// [START woosmap_${data.tag}]`;
  if (output.indexOf(startRegionTag) === -1) {
    const lines = output.split("\n");
    output = [...lines.slice(0, 5), startRegionTag, ...lines.slice(5)].join(
      "\n",
    );
  }

  const endRegionTag = `// [END woosmap_${data.tag}]`;
  if (output.indexOf(endRegionTag) === -1) {
    output += `\n// [END woosmap_${data.tag}]\n`;
  }

  const lintConfig = await transpiledJsConfig;
  const input = output;
  let messages;

  ({ messages, output } = linter.verifyAndFix(output, lintConfig, {
    filename: data.page.outputPath,
  }));

  if (messages.filter((m) => m.severity === 2).length > 0) {
    throw new Error(
      JSON.stringify(
        { input, messages, page: data.page, lintConfig },
        null,
        2,
      ),
    );
  }

  output = await prettier.format(output, {
    quoteProps: "consistent",
    parser: "babel",
  });

  return output;
};

module.exports = {
  outputFileExtension: "js",
  compile: async (inputContent) => {
    return async (data) => {
      switch (data.file) {
        case "app.ts":
        case "app.tsx":
        case "highlight.ts":
        case "highlight.tsx":
        case "docs.ts":
        case "docs.tsx":
          return formatWithLint(inputContent, data);
        default:
          return compileTypescriptSample(inputContent, data);
      }
    };
  },
  getData: async function () {
    return {
      tsconfig: JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "..", "..", "..", "tsconfig.json"),
          "utf8",
        ),
      ),
      file: [
        "docs.js",
        "docs.ts",
        "app.ts",
        "jsfiddle.js",
        "highlight.ts",
        "highlight.js",
      ],
      pagination: {
        data: "file",
        alias: "file",
        size: 1,
      },
    };
  },
  compileOptions: {
    permalink: function () {
      return (data) => {
        const [folder, ext] = data.file.split(".");

        return `/samples${data.page.filePathStem
          .split("/")
          .slice(0, 2)
          .join("/")}/${folder}/${
          data.file.startsWith("jsfiddle.") ? "demo" : "index"
        }.${ext}`;
      };
    },
  },
};
