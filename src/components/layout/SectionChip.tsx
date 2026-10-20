"use client";

import { useRef } from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { revealStart } from "@/lib/motion";

/**
 * Square accent chip that sits on a section's top rule (02 §3). Scrambles in from block glyphs
 * when it scrolls into view (02 §5); the real label is always in the accessible name.
 */
export function SectionChip({ label, className }: { label: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { reduced } = useReducedMotionPref();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.from(ref.current, {
        duration: 0.5,
        scrambleText: { text: label, chars: "▖▘▝▗", speed: 0.6, revealDelay: 0.1 },
        scrollTrigger: { trigger: ref.current, start: revealStart, once: true },
      });
    },
    { dependencies: [reduced, label], revertOnUpdate: true },
  );

  return (
    <span
      className={cn(
        "inline-flex bg-accent px-2.5 py-1 type-label whitespace-nowrap text-accent-ink",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      <span ref={ref} aria-hidden>
        {label}
      </span>
    </span>
  );
}
