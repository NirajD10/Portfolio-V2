"use client";

import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";

/**
 * Site-wide "reduce motion" switch (06 §6), saved in localStorage; behaves exactly like the OS
 * setting. Lives in the footer until the menu HUD arrives in Phase 2.
 */
export function MotionToggle({ className }: { className?: string }) {
  const { userPref, setUserPref } = useReducedMotionPref();
  const off = userPref === "reduce";
  return (
    <button
      type="button"
      aria-pressed={off}
      onClick={() => setUserPref(off ? "full" : "reduce")}
      className={cn("type-label text-ink-muted transition-colors hover:text-ink", className)}
    >
      <span aria-hidden>{off ? "▶" : "⏸"}</span> Reduce motion{" "}
      <span className="text-accent-text">{off ? "on" : "off"}</span>
    </button>
  );
}
