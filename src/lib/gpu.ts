"use client";

/**
 * GPU tiering (docs/plan/03-architecture.md §5). The WebGL stage arrives in Phase 5;
 * this only resolves and caches the tier so later phases can read it.
 */

export type GpuTier = 0 | 1 | 2 | 3;

const KEY = "nd:gpu-tier";

export async function getGpuTier(): Promise<GpuTier> {
  try {
    const cached = sessionStorage.getItem(KEY);
    if (cached !== null) return Number(cached) as GpuTier;
  } catch {}

  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  let tier: GpuTier = 0;
  if (!nav.connection?.saveData) {
    const { getGPUTier } = await import("detect-gpu");
    const result = await getGPUTier();
    tier = Math.max(0, Math.min(3, result.tier)) as GpuTier;
  }

  try {
    sessionStorage.setItem(KEY, String(tier));
  } catch {}
  return tier;
}

/** Device-pixel-ratio cap per tier: 1.5 on tier 2+, 1 otherwise. */
export function dprForTier(tier: GpuTier): [number, number] {
  return [1, tier >= 2 ? 1.5 : 1];
}
