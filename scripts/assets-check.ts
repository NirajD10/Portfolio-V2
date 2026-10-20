/**
 * `pnpm assets:check` — lists every slot still on a placeholder and every [[…]] text placeholder in
 * src/content (docs/plan/13 §1). `--strict` exits 1 if anything remains (launch gate, Phase 10).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { assetSlots, type AssetKind } from "../src/content/assets";
import { abs, findFinal, ROOT } from "./lib";

const strict = process.argv.includes("--strict");

const GROUPS: [AssetKind, string][] = [
  ["reference", "Ride references (not shipped)"],
  ["image", "Images"],
  ["logo", "Brand logos (monogram tile meanwhile)"],
  ["file", "Files"],
  ["font", "Fonts"],
  ["sound", "Sound (Phase 10)"],
];

let pending = 0;
console.log("\nAsset slots still on a placeholder\n");
for (const [kind, title] of GROUPS) {
  const missing = assetSlots.filter((s) => s.kind === kind && !findFinal(s));
  if (!missing.length) continue;
  pending += missing.length;
  console.log(`  ${title} — ${missing.length}`);
  for (const s of missing) {
    const size = s.width ? `  ${s.width}×${s.height}` : "";
    console.log(`    · ${s.id.padEnd(42)} → ${s.path}.{${s.exts.join(",")}}${size}`);
  }
  console.log("");
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.(ts|tsx|mdx|md)$/.test(name) ? [p] : [];
  });
}

const TBD = /\[\[(?:TBD[^\]]*)\]\]/g;
const texts: string[] = [];
for (const file of walk(abs("src/content"))) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (/^\s*(\/\/|\/?\*)/.test(line)) return; // comments that document the convention
      for (const m of line.matchAll(TBD)) texts.push(`    · ${path.relative(ROOT, file)}:${i + 1}  ${m[0]}`);
    });
}
if (texts.length) {
  console.log(`  Text placeholders — ${texts.length}`);
  console.log(texts.join("\n") + "\n");
}

const total = pending + texts.length;
console.log(`${pending} asset slots + ${texts.length} text placeholders remaining.\n`);
if (strict && total > 0) process.exit(1);
