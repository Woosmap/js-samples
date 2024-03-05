import { test } from "@playwright/test";
import {
  waitForWoosmapToLoad,
  waitForAutocompleteFetch,
  failOnPageError,
} from "../utils";
import fs from "fs";

export const BROKEN_APP_SAMPLES = [
  "store-locator-widget-baidu", // too long to load
];
export const AUTOCOMPLETE_WITHOUT_MAP_SAMPLES = [
  "localities-api-autocomplete",
  "localities-api-autocomplete-advanced",
];

const samples = fs
  .readdirSync("samples", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !BROKEN_APP_SAMPLES.includes(name));

test.describe.parallel("sample applications", () => {
  samples.forEach((sample) => {
    test.describe(sample, () => {
      test(`app loads without error ${sample}`, async ({ page }) => {
        test.slow();
        failOnPageError(page);

        // go to page and fail if errors
        await page.goto(`/samples/${sample}/app/dist`, {
          waitUntil: "networkidle",
        });

        if (AUTOCOMPLETE_WITHOUT_MAP_SAMPLES.includes(sample)) {
          // wait for #suggestions-list li elements to be visible
          await waitForAutocompleteFetch(page);
        } else {
          // wait for woosmap.map to be loaded
          await waitForWoosmapToLoad(page);
        }
      });
    });
  });
});
