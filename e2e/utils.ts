import { Page } from "@playwright/test";

export async function waitForWoosmapToLoad(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    return window.woosmap && window.woosmap.map;
  });
  await page.waitForTimeout(100);
}

export async function waitForAutocompleteFetch(page: Page): Promise<void> {
  await page.fill("#autocomplete-input", "Paris");
  await page.waitForSelector(`//ul[@id='suggestions-list']/li`, {
    state: "visible",
  });
}

export const failOnPageError = (page: Page): void => {
  page.on("pageerror", (e) => {
    console.error(e.message);
    process.emit("uncaughtException", e);
  });
};
