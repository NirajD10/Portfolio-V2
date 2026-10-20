import { expect, test } from "@playwright/test";

test("theme toggle persists across reload with no flash", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "Toggle light and dark theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");

  // The theme must already be set in the server-rendered document before any React code runs.
  await page.route("**/*.js", (route) => route.abort());
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
});

test("system preference is the default", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
