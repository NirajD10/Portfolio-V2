/**
 * `pnpm size` (after `pnpm build`) — first-load JS (gzip) per route, checked against the budget:
 * ≤ 100 KB on top of the framework baseline (CLAUDE.md · Performance budgets, DECISIONS.md).
 * The baseline is a bare create-next-app@16.4.2 home page, measured 2026-10-20. Re-measure it
 * when Next or React is upgraded.
 */
import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { abs } from "./lib";

const FRAMEWORK_BASELINE_KB = 176.8;
const APP_BUDGET_KB = 100;
const ROUTES: Record<string, string> = {
  "/": "index",
  "/work": "work",
  "/ai": "ai",
  "/about": "about",
  "/contact": "contact",
  "/facts": "facts",
};

const limit = FRAMEWORK_BASELINE_KB + APP_BUDGET_KB;
let failed = false;

console.log(
  `\nFirst-load JS (gzip) · budget ${limit.toFixed(0)} KB = ${FRAMEWORK_BASELINE_KB} framework + ${APP_BUDGET_KB} app\n`,
);
for (const [route, file] of Object.entries(ROUTES)) {
  const htmlPath = abs(`.next/server/app/${file}.html`);
  if (!existsSync(htmlPath)) {
    console.log(`  ${route.padEnd(10)} not prerendered — run pnpm build`);
    continue;
  }
  const html = readFileSync(htmlPath, "utf8");
  const scripts = [...new Set([...html.matchAll(/src="\/_next\/(static\/[^"]+\.js)"/g)].map((m) => m[1]))];
  const kb = scripts.reduce((sum, s) => sum + gzipSync(readFileSync(abs(`.next/${s}`))).length, 0) / 1024;
  const app = kb - FRAMEWORK_BASELINE_KB;
  const over = kb > limit;
  if (route === "/" && over) failed = true;
  console.log(
    `  ${route.padEnd(10)} ${kb.toFixed(1).padStart(6)} KB  (app ${app.toFixed(1)} KB)${over ? "  ✗ over budget" : ""}`,
  );
}
console.log("");
if (failed) process.exit(1);
