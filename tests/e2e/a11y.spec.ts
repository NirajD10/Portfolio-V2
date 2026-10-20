import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const routes = [
  "/",
  "/work",
  "/work/pureplantparadise",
  "/ai",
  "/about",
  "/contact",
  "/facts",
  "/no-such-road",
];

for (const scheme of ["light", "dark"] as const) {
  test.describe(`axe · ${scheme}`, () => {
    test.use({ colorScheme: scheme, reducedMotion: "reduce" });
    for (const route of routes) {
      test(`${route} has no WCAG A/AA violations`, async ({ page, load }) => {
        await load(route);
        await page.waitForTimeout(400); // reduced-motion fades (≤ 200 ms) settle
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .exclude("nextjs-portal")
          .analyze();
        const summary = results.violations.map(
          (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
        );
        expect(summary).toEqual([]);
      });
    }
  });
}
