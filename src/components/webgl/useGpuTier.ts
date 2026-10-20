"use client";

import { useEffect, useState } from "react";
import { getGpuTier, type GpuTier } from "@/lib/gpu";

let cached: GpuTier | null = null;
let pending: Promise<GpuTier> | null = null;

/** Resolve the GPU tier once per session, after first paint (idle). `null` until known. */
export function useGpuTier(): GpuTier | null {
  const [tier, setTier] = useState<GpuTier | null>(cached);

  useEffect(() => {
    if (cached !== null) return;
    let alive = true;
    const run = () => {
      pending ??= getGpuTier().catch(() => 0 as GpuTier);
      pending.then((t) => {
        cached = t;
        if (alive) setTier(t);
      });
    };
    const idle = window.requestIdleCallback?.(run, { timeout: 2000 }) ?? window.setTimeout(run, 300);
    return () => {
      alive = false;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  return tier;
}
