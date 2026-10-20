import { expect, test } from "./fixtures";

test("tracks: prev/next switch the visible track (desktop)", async ({ page, load, isMobile }) => {
  test.skip(isMobile, "tracks stack on mobile");
  await load("/");
  const tracks = page.locator("article[aria-labelledby^='track-']");
  await expect(tracks.nth(0)).toHaveAttribute("data-active", "true");
  await page.getByRole("button", { name: "Next track" }).click();
  await expect(tracks.nth(1)).toHaveAttribute("data-active", "true");
  await expect(page.getByText("Track 2 of 3")).toBeVisible();
  await page.getByRole("button", { name: "Previous track" }).click();
  await page.getByRole("button", { name: "Previous track" }).click();
  await expect(tracks.nth(2)).toHaveAttribute("data-active", "true");
});

test("experience: a cell opens its V1 details", async ({ page, load }) => {
  await load("/");
  const cell = page.getByRole("button", { name: /Spellsys Technologies/ });
  await cell.scrollIntoViewIfNeeded();
  await cell.click();
  await expect(cell).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("region", { name: "Experience details" })).toContainText("30%");
  await page.getByRole("button", { name: "Close details" }).click();
  await expect(cell).toHaveAttribute("aria-expanded", "false");
});

test("numbers show only real values", async ({ page, load }) => {
  await load("/");
  const section = page.locator("section", { has: page.locator("#numbers-title") });
  await expect(section.getByText("Projects shipped")).toHaveCount(0);
  await expect(section.locator(".sr-only", { hasText: "30%" })).toHaveCount(1);
});

test("work: view toggle swaps final work and case study", async ({ page, load }) => {
  await load("/work");
  const project = page.locator("article#pureplantparadise");
  await project.getByRole("button", { name: "Case study" }).click();
  await expect(project.getByRole("button", { name: "Case study" })).toHaveAttribute("aria-pressed", "true");
  await expect(project.getByText("Problem", { exact: true })).toBeVisible();
  await project.getByRole("button", { name: "Final work" }).click();
  await expect(project.getByText("Problem", { exact: true })).toHaveCount(0);
});

test("contact: email tile copies and confirms", async ({ page, load, context, browserName }) => {
  test.skip(browserName !== "chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await load("/contact");
  await page.getByRole("button", { name: /Email · click to copy/ }).click();
  await expect(page.getByRole("status").filter({ hasText: "Copied" })).toBeVisible();
});

test.describe("preloader", () => {
  test("shows on the first visit only, then hands over", async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("nd:test-preloader", "1"));
    await page.addInitScript(() => sessionStorage.removeItem("nd:preloaded"));
    await page.goto("/");
    const pre = page.locator(".preloader");
    await expect(pre).toBeVisible();
    await expect(pre).toBeHidden({ timeout: 4000 });
    expect(await page.evaluate(() => sessionStorage.getItem("nd:preloaded"))).toBe("1");
  });
});
