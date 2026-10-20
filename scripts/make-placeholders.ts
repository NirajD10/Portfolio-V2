/**
 * Renders a placeholder for every image slot at its exact final size (docs/plan/13 §1):
 * purple diagonal hatching, 1px frame, mono label "PLACEHOLDER · LIFE 03 · 1600×2000".
 * Writes public/placeholders/<id>.webp (+ a 1024px texture for WebGL slots). Skips files that exist;
 * pass --force to redraw everything.
 */
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { assetSlots, placeholderPath, placeholderTexturePath, type AssetSlot } from "../src/content/assets";
import { abs, isMain } from "./lib";

// Placeholder colours (ink-850 ground, purple-500 hatching, purple-300 label) — fixed so they
// read the same in both themes.
const GROUND = "#1C1A22";
const HATCH = "#7149C6";
const LABEL = "#AD86FF";

function svg(slot: AssetSlot) {
  const w = slot.width!;
  const h = slot.height!;
  const unit = Math.max(w, h) / 100; // hatch spacing scales with the image
  const font = Math.round(Math.min(w, h) / 26);
  const text = `PLACEHOLDER · ${slot.label} · ${w}×${h}`;
  const boxW = Math.min(w - unit * 4, text.length * font * 0.68 + font * 2);
  const boxH = font * 2.2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <pattern id="h" width="${unit * 2}" height="${unit * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="${unit * 2}" height="${unit * 2}" fill="${GROUND}"/>
      <rect width="${unit * 0.5}" height="${unit * 2}" fill="${HATCH}" fill-opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#h)"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${HATCH}" stroke-width="1"/>
  <rect x="${(w - boxW) / 2}" y="${(h - boxH) / 2}" width="${boxW}" height="${boxH}" fill="${GROUND}" stroke="${HATCH}" stroke-width="1"/>
  <text x="${w / 2}" y="${h / 2}" fill="${LABEL}" font-family="Geist Mono, DejaVu Sans Mono, monospace" font-size="${font}" letter-spacing="${font * 0.08}" text-anchor="middle" dominant-baseline="central">${text}</text>
</svg>`;
}

export async function makePlaceholders({ force = false } = {}) {
  const images = assetSlots.filter((s) => s.kind === "image");
  let made = 0;
  for (const slot of images) {
    const out = abs(placeholderPath(slot.id));
    const tex = abs(placeholderTexturePath(slot.id));
    if (!force && existsSync(out) && (!slot.texture || existsSync(tex))) continue;
    mkdirSync(path.dirname(out), { recursive: true });
    const buf = await sharp(Buffer.from(svg(slot)))
      .webp({ quality: 70 })
      .toBuffer();
    await sharp(buf).toFile(out);
    if (slot.texture) {
      mkdirSync(path.dirname(tex), { recursive: true });
      await sharp(buf).resize(1024, 1024, { fit: "inside" }).webp({ quality: 80 }).toFile(tex);
    }
    made++;
  }
  return { made, total: images.length };
}

if (isMain(import.meta.url)) {
  makePlaceholders({ force: process.argv.includes("--force") }).then(({ made, total }) =>
    console.log(`placeholders: ${made} rendered, ${total - made} up to date`),
  );
}
