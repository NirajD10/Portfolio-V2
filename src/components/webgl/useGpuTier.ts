"use client";

import { useEffect, useState } from "react";
import { getGpuTier, type GpuTier } from "@/lib/gpu";

/**
 * GPU tier, resolved lazily: detection (and anything waiting on it, like the menu shader preload)
 * starts when something calls `warmUpGpu()` — the MENU trigger on hover/focus/touch — or on idle
 * 8 s after load, so it never competes with first paint. `null` until known.
 */

let cached: GpuTier | null = null;
let pending: Promise<GpuTier> | null = null;
const listeners = new Set<(t: GpuTier) => void>();

export function warmUpGpu() {
  if (pending) return pending;
  pending = getGpuTier().catch(() => 0 as GpuTier);
  pending.then((t) => {
    cached = t;
    listeners.forEach((fn) => fn(t));
  });
  return pending;
}

export function useGpuTier(): GpuTier | null {
  const [tier, setTier] = useState<GpuTier | null>(cached);

  useEffect(() => {
    if (cached !== null) return;
    listeners.add(setTier);
    const later = () => {
      const idle = () => window.requestIdleCallback?.(() => warmUpGpu()) ?? warmUpGpu();
      timer = window.setTimeout(idle, 8000);
    };
    let timer: number | undefined;
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => {
      listeners.delete(setTier);
      window.removeEventListener("load", later);
      window.clearTimeout(timer);
    };
  }, []);

  return tier;
}
