import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AssetSlot } from "../src/content/assets";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const abs = (p: string) => path.join(ROOT, p);

/** The final file for a slot, if Niraj has added it (first matching extension). */
export function findFinal(slot: AssetSlot): string | null {
  for (const ext of slot.exts) {
    const rel = `${slot.path}.${ext}`;
    if (existsSync(abs(rel))) return rel;
  }
  return null;
}

/** "public/work/x/cover.jpg" → "/work/x/cover.jpg" */
export const toUrl = (rel: string) => "/" + path.relative("public", rel).split(path.sep).join("/");

/** Where the WebGL texture for a final image lives (docs/plan/03 §2: /work/<slug>/textures/<slug>-1024.webp). */
export function finalTexturePath(slot: AssetSlot) {
  const dir = path.dirname(slot.path);
  const name = slot.id.startsWith("work.") ? path.basename(dir) : path.basename(slot.path);
  return `${dir}/textures/${name}-1024.webp`;
}

/** True when this module is the script being run (works with spaces in the path). */
export const isMain = (metaUrl: string) =>
  !!process.argv[1] && fileURLToPath(metaUrl) === path.resolve(process.argv[1]);
