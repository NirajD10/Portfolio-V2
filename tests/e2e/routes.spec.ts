import { expect, test } from "@playwright/test";

const routes = ["/", "/work", "/work/pureplantparadise", "/ai", "/about", "/contact", "/facts"];

for (const route of routes) {
  test(`${route} renders with one h1 and the site chrome`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page).toHaveTitle(/Niraj Deshmukh/);
  });
}

test("unknown route shows the wrong-turn 404", async ({ page }) => {
  const res = await page.goto("/no-such-road");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Wrong turn");
});

test("/facts lists real V1 data", async ({ page }) => {
  await page.goto("/facts");
  for (const company of ["Pure Tech Codex", "Osumare", "Spellsys", "Innovhub"]) {
    await expect(page.getByRole("heading", { level: 3, name: new RegExp(company) })).toBeVisible();
  }
});
