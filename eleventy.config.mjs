import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { EventEmitter } from "node:events";
import { fileURLToPath } from "node:url";

import Image from "@11ty/eleventy-img";
import chalk from "chalk";
import prettier from "prettier";
import { build as viteBuild } from "vite";

import typescript from "./src/engines/typescript/sample.js";
import typescriptJSX from "./src/engines/typescript/sample-jsx.js";
import sass from "./src/engines/sass.js";
import stripRegionTags from "./src/transforms/strip-region-tags.js";
import yourAPIKey from "./src/transforms/your-api-key.js";
import format from "./src/transforms/format.js";
import minify from "./src/transforms/minify.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./shared/**/*");
  eleventyConfig.addWatchTarget(".env*");

  eleventyConfig.configureErrorReporting({ allowMissingExtensions: true });

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", sass);

  eleventyConfig.addNunjucksAsyncShortcode("svgIcon", async (filename) => {
    const metadata = await Image(`./src/_includes/assets/${filename}`, {
      formats: ["svg"],
      dryRun: true,
    });
    return metadata.svg[0].buffer.toString();
  });

  eleventyConfig.addTemplateFormats("ts");
  eleventyConfig.addExtension("ts", typescript);
  eleventyConfig.addTemplateFormats("tsx");
  eleventyConfig.addExtension("tsx", typescriptJSX);

  eleventyConfig.addTransform("yourAPIKey", yourAPIKey);
  eleventyConfig.addTransform("stripRegionTags", stripRegionTags);
  eleventyConfig.addTransform("minify", minify);
  eleventyConfig.addTransform("format", format);

  eleventyConfig.addCollection("samples_ts", (collectionApi) => {
    const samples = collectionApi.getFilteredByGlob("samples/*/index.ts*");

    if (samples.length === 0) {
      throw new Error("No samples found in samples collection");
    }
    return samples;
  });

  eleventyConfig.on("eleventy.after", async () => {
    console.log(chalk.green("[11ty.after] Building dist/samples/*/app"));

    const samplesPath = path.join(__dirname, "dist", "samples");

    const samples = fs
      .readdirSync(samplesPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    EventEmitter.defaultMaxListeners = samples.length * 2;

    const inlinePlugin = {
      name: "vite:singlefile",
      transformIndexHtml: {
        enforce: "post",
        transform(html, ctx) {
          for (const asset of Object.values(ctx.bundle)) {
            switch (asset.name) {
              case "index.css":
                html = html.replace(
                  /<link rel="stylesheet" crossorigin href="\.\/assets\/index-.+\.css">/gm,
                  () => `<style>${asset.source.trim()}</style>`,
                );
                break;
              case "index":
                html = html.replace(
                  /<script type="module" crossorigin src="\.\/assets\/index-.+\.js"><\/script>/gm,
                  () =>
                    `<script type="module" crossorigin>${asset.code.trim()}</script>`,
                );
                break;
              default:
                throw new Error(`Expected asset ${asset.name} to be inlined.`);
            }
          }
          return prettier.format(html, { parser: "html" });
        },
      },
    };

    const baseConfig = {
      plugins: [],
      base: "./",
      logLevel: "error",
      build: {
        target: "es2019",
      },
    };

    await Promise.all(
      samples.map(async (sample) => {
        const root = path.join(samplesPath, sample, "app");
        await viteBuild({ ...baseConfig, root });
        await viteBuild({
          ...baseConfig,
          build: {
            ...baseConfig.build,
            outDir: path.join(samplesPath, sample, "iframe"),
          },
          plugins: [...(baseConfig.plugins || []), inlinePlugin],
          root,
        });
      }),
    );

    console.log(
      chalk.green("[11ty.after] Finished building dist/samples/*/app"),
    );
  });

  return {
    dir: {
      input: "samples",
      layouts: "src/_layouts",
      output: "dist",
      data: "src/_data",
      includes: "src/_includes",
    },
  };
}
