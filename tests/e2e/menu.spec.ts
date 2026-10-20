import { expect, test, type Page } from "@playwright/test";

const trigger = (page: Page) => page.locator("header [aria-controls='site-menu']");
const dialog = (page: Page) => page.getByRole("dialog", { name: "Site menu" });

async function load(page: Page, path: string) {
  await page.goto(path);
  await page.locator("html[data-ready]").waitFor({ state: "attached" });
}

async function openMenu(page: Page, via: "click" | "keyboard" = "click") {
  if (via === "click") await trigger(page).click();
  else {
    await trigger(page).focus();
    await page.keyboard.press("Enter");
  }
  await expect(dialog(page)).toBeVisible();
  // Focus lands on the current page's item once the open timeline completes.
  await expect(dialog(page).locator("a[aria-current='page']")).toBeFocused({ timeout: 10_000 });
}

test.describe("menu overlay", () => {
  test("opens with click and Enter; aria-expanded mirrors state", async ({ page }) => {
    await load(page, "/");
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
    await openMenu(page, "click");
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(trigger(page)).toBeFocused();
    await openMenu(page, "keyboard");
  });

  test("screen readers get real item names, not scrambled glyphs", async ({ page }) => {
    await load(page, "/");
    await openMenu(page);
    for (const name of ["Home", "Work", "AI Era", "About", "Contact"]) {
      await expect(dialog(page).getByRole("link", { name, exact: true })).toBeVisible();
    }
    await expect(dialog(page).getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("background is inert and focus is trapped", async ({ page }) => {
    await load(page, "/");
    await openMenu(page);
    await expect(page.locator("#site-root")).toHaveAttribute("inert", "");
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => !!document.activeElement?.closest("#site-menu"));
      expect(inside).toBe(true);
    }
    await page.keyboard.press("Shift+Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("#site-menu"))).toBe(true);
  });

  test("keyboard focus drives the same visuals as hover", async ({ page }) => {
    await load(page, "/");
    await openMenu(page);
    await page.keyboard.press("Tab"); // Home → Work
    const items = dialog(page).locator("[data-item]");
    await expect(items.nth(1)).toHaveAttribute("data-state", "active");
    await expect(items.nth(0)).toHaveAttribute("data-state", "dim");
  });

  test("✕ and outside click close; focus returns to the trigger", async ({ page }) => {
    await load(page, "/");
    await openMenu(page);
    await dialog(page).getByRole("button", { name: "Close menu" }).click();
    await expect(dialog(page)).toBeHidden();
    await expect(trigger(page)).toBeFocused();
    await expect(page.locator("#site-root")).not.toHaveAttribute("inert", "");

    await openMenu(page);
    await page.mouse.click(20, 110); // empty overlay space, below the HUD's top row
    await expect(dialog(page)).toBeHidden();
  });

  test("selecting an item navigates under the curtain", async ({ page }) => {
    await load(page, "/");
    await openMenu(page);
    await dialog(page).getByRole("link", { name: "Work", exact: true }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(dialog(page)).toBeHidden({ timeout: 5000 });
    await expect(page.getByRole("heading", { level: 1 }).filter({ visible: true })).toContainText("built");
    await expect(page.locator("#site-root")).not.toHaveAttribute("inert", "");
    // The menu now marks Work as current.
    await openMenu(page);
    await expect(dialog(page).getByRole("link", { name: "Work", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("footer links use the curtain transition and land on the new page", async ({ page }) => {
    await load(page, "/");
    await page.locator("footer").getByRole("link", { name: /About/ }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("[aria-hidden][class*='z-40']")).toBeHidden({ timeout: 5000 });
  });
});

test.describe("menu overlay · reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("opens and closes without the wave", async ({ page }) => {
    await load(page, "/");
    await openMenu(page);
    expect(await page.locator("canvas").count()).toBe(0);
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
  });
});
