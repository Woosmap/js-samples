import { Page } from "@playwright/test";

export async function waitForWoosmapToLoad(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    return window.woosmap && window.woosmap.map;
  });
  await page.waitForTimeout(100);
}

export const failOnPageError = (page: Page): void => {
  page.on("pageerror", (e) => {
    console.error(e.message);
    process.emit("uncaughtException", e);
  });
};
