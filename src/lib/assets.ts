import type { AssetId, BrandSlug, ImageAssetId } from "@/content/assets";
import generated from "@/content/assets.generated.json";

export type ResolvedImage = {
  kind: "image";
  src: string;
  width: number;
  height: number;
  placeholder: boolean;
  /** 1024px WebP for WebGL (Grainy Carousel slots). */
  texture?: string;
};
export type ResolvedLogo = { kind: "logo"; src: string | null; placeholder: boolean; monogram: string };
export type ResolvedFile = {
  kind: "file" | "sound" | "font" | "reference";
  src: string | null;
  placeholder: boolean;
};
export type ResolvedAsset = ResolvedImage | ResolvedLogo | ResolvedFile;

const table = generated as Record<string, ResolvedAsset>;

/**
 * Resolve an asset slot (docs/plan/13). Returns the final file when it exists, otherwise the placeholder.
 * Never hard-code asset paths in components.
 */
export function asset(id: ImageAssetId): ResolvedImage;
export function asset(id: `brand.${BrandSlug}`): ResolvedLogo;
export function asset(id: AssetId): ResolvedAsset;
export function asset(id: AssetId): ResolvedAsset {
  const entry = table[id];
  if (!entry) throw new Error(`asset("${id}") is not in the manifest — run \`pnpm assets:sync\`.`);
  return entry;
}

/** Resume link: the PDF in public/ once added, the V1 resume until then. */
export function resumeHref(fallback: string) {
  return asset("file.resume").src ?? fallback;
}
