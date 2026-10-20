import { test as base, expect, type Page } from "@playwright/test";

/**
 * Shared test setup: skip the first-visit preloader (it has its own test) and give helpers that wait
 * for hydration before interacting.
 */
export const test = base.extend<{ load: (path: string) => Promise<void> }>({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      try {
        if (!sessionStorage.getItem("nd:test-preloader")) sessionStorage.setItem("nd:preloaded", "1");
      } catch {}
    });
    await use(page);
  },
  load: async ({ page }, use) => {
    await use(async (path: string) => {
      await page.goto(path);
      await page.locator("html[data-ready]").waitFor({ state: "attached" });
    });
  },
});

export { expect };
export type { Page };
