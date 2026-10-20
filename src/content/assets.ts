/**
 * Asset manifest — one entry per slot (docs/plan/13-asset-placeholders.md).
 *
 * Components never hard-code paths: they call asset(id) from src/lib/assets.ts, which reads
 * assets.generated.json (written by scripts/assets-sync.ts on predev/prebuild). A slot whose final
 * file is missing resolves to its placeholder, which already has the final size, so nothing shifts
 * when the real file arrives.
 *
 * Plain relative imports only — scripts/ import this file through tsx.
 */

import { caseStudySlugs, reelArchiveSlugs, type CaseStudySlug, type ReelArchiveSlug } from "./work/slugs";

export type AssetKind = "image" | "logo" | "file" | "font" | "sound" | "reference";

export type AssetSlot = {
  id: string;
  kind: AssetKind;
  /** Final location relative to the repo root, without extension when several are accepted. */
  path: string;
  /** Accepted extensions, tried in order. */
  exts: readonly string[];
  /** Final pixel size (images): placeholders are rendered at exactly this size. */
  width?: number;
  height?: number;
  /** Also produce a 1024px WebP for WebGL (Grainy Carousel). */
  texture?: boolean;
  usedBy: string;
  /** Short label printed on the placeholder image. */
  label: string;
  /** Monogram shown instead of a missing brand logo. */
  monogram?: string;
};

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

const DESKTOP = ["01", "02", "03", "04", "05", "06"] as const;
const MOBILE = ["01", "02", "03", "04"] as const;
const LIFE = ["01", "02", "03", "04", "05", "06", "07", "08"] as const;

export type WorkSlot =
  | "cover"
  | "hero"
  | `screen-desktop-${(typeof DESKTOP)[number]}`
  | `screen-mobile-${(typeof MOBILE)[number]}`;

const BRANDS = {
  chatgpt: "CG",
  claude: "CL",
  antigravity: "AG",
  manus: "MA",
  cursor: "CU",
  "google-ai-mode": "GA",
  "claude-code": "CC",
  codex: "CX",
  ollama: "OL",
  langchain: "LC",
} as const;
export type BrandSlug = keyof typeof BRANDS;

const SOUNDS = ["tick", "rev", "whoosh"] as const;

export type AssetId =
  | `work.${CaseStudySlug}.${WorkSlot}`
  | `work.${ReelArchiveSlug}.cover`
  | `life.${(typeof LIFE)[number]}`
  | `brand.${BrandSlug}`
  | `sound.${(typeof SOUNDS)[number]}`
  | "ride.bike"
  | "ride.helmet"
  | "ride.outfit"
  | "ride.office"
  | "file.resume"
  | "font.clash";

/** Image slots only (what next/image can render). */
export type ImageAssetId = Extract<AssetId, `work.${string}` | `life.${string}`>;

const upper = (s: string) => s.replace(/-/g, " ").toUpperCase();

function cover(slug: string): AssetSlot {
  return {
    id: `work.${slug}.cover`,
    kind: "image",
    path: `public/work/${slug}/cover`,
    exts: IMAGE_EXTS,
    width: 1600,
    height: 2000,
    texture: true,
    usedBy: "Work reel (Grainy Carousel), /work index card",
    label: `${upper(slug)} COVER`,
  };
}

function caseStudySlots(slug: CaseStudySlug): AssetSlot[] {
  return [
    cover(slug),
    {
      id: `work.${slug}.hero`,
      kind: "image",
      path: `public/work/${slug}/hero`,
      exts: IMAGE_EXTS,
      width: 2400,
      height: 1350,
      usedBy: "Case-study hero",
      label: `${upper(slug)} HERO`,
    },
    ...DESKTOP.map((n): AssetSlot => ({
      id: `work.${slug}.screen-desktop-${n}`,
      kind: "image",
      path: `public/work/${slug}/screen-desktop-${n}`,
      exts: ["png", "webp", "jpg"],
      width: 2880,
      height: 1800,
      usedBy: "Final work gallery",
      label: `${upper(slug)} DESKTOP ${n}`,
    })),
    ...MOBILE.map((n): AssetSlot => ({
      id: `work.${slug}.screen-mobile-${n}`,
      kind: "image",
      path: `public/work/${slug}/screen-mobile-${n}`,
      exts: ["png", "webp", "jpg"],
      width: 1170,
      height: 2532,
      usedBy: "Final work gallery",
      label: `${upper(slug)} MOBILE ${n}`,
    })),
  ];
}

export const assetSlots: AssetSlot[] = [
  // 2.1 Ride — reference material only (never shipped); drawn as SVG in Phase 4
  {
    id: "ride.bike",
    kind: "reference",
    path: "docs/plan/references/ref-my-bike-yamaha-mt15",
    exts: ["png", "jpg"],
    usedBy: "Bike.tsx (SVG drawing)",
    label: "YAMAHA MT-15",
  },
  {
    id: "ride.helmet",
    kind: "reference",
    path: "docs/plan/references/ref-helmet-ls2-ff320-stream2",
    exts: ["png", "jpg"],
    usedBy: "Rider.tsx (SVG drawing)",
    label: "LS2 FF320 STREAM II",
  },
  {
    id: "ride.outfit",
    kind: "reference",
    path: "assets-inbox/rider/outfit",
    exts: ["jpg", "jpeg", "png", "webp"],
    usedBy: "ride/rider.config.ts colours (jacket, gloves, jeans, shoes)",
    label: "RIDING OUTFIT",
  },
  {
    id: "ride.office",
    kind: "reference",
    path: "assets-inbox/office/facade",
    exts: ["jpg", "jpeg", "png", "webp"],
    usedBy: "OfficeFacade.tsx (SVG drawing)",
    label: "OFFICE FACADE",
  },

  // 2.2 Projects
  ...caseStudySlugs.flatMap(caseStudySlots),
  ...reelArchiveSlugs.map(cover),

  // 2.3 Life in frames
  ...LIFE.map((n): AssetSlot => ({
    id: `life.${n}`,
    kind: "image",
    path: `public/life/life-${n}`,
    exts: IMAGE_EXTS,
    width: 1600,
    height: 2000,
    texture: true,
    usedBy: "About · Life in frames (Grainy Carousel)",
    label: `LIFE ${n}`,
  })),

  // 2.4 Brand logos — official files only; a missing logo renders its monogram tile
  ...(Object.entries(BRANDS) as [BrandSlug, string][]).map(([slug, monogram]): AssetSlot => ({
    id: `brand.${slug}`,
    kind: "logo",
    path: `public/brand/${slug}`,
    exts: ["svg"],
    usedBy: "AI tools tiles / chips",
    label: upper(slug),
    monogram,
  })),

  // 2.5 Files
  {
    id: "file.resume",
    kind: "file",
    path: "public/resume/Niraj-Deshmukh-Resume",
    exts: ["pdf"],
    usedBy: "Header menu HUD, footer, contact, /resume redirect",
    label: "RESUME PDF",
  },
  {
    id: "font.clash",
    kind: "font",
    path: "src/fonts/ClashGrotesk-Variable",
    exts: ["woff2"],
    usedBy: "--font-display (falls back to Geist when missing)",
    label: "CLASH GROTESK",
  },
  ...SOUNDS.map((name): AssetSlot => ({
    id: `sound.${name}`,
    kind: "sound",
    path: `public/sound/${name}`,
    exts: ["mp3"],
    usedBy: "Opt-in sound (Phase 10) — toggle hidden until files exist",
    label: `SOUND ${upper(name)}`,
  })),
];

/** Placeholder path for an image slot (generated by scripts/make-placeholders.ts). */
export const placeholderPath = (id: string) => `public/placeholders/${id}.webp`;
export const placeholderTexturePath = (id: string) => `public/placeholders/textures/${id}-1024.webp`;
