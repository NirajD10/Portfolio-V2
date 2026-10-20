import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("reduced motion: no Lenis, native scroll", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
});

test("site motion toggle behaves like the OS setting", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.getByRole("button", { name: /reduce motion/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  await context.close();
});
