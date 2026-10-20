"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { ease, reducedFade, revealStart } from "@/lib/motion";

/** Image entrance (02 §5): clip-path inset 12% → 0 while the image settles from 1.08 → 1. */
export function RevealImage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useReducedMotionPref();

  useGSAP(
    () => {
      const el = ref.current!;
      el.setAttribute("data-revealed", "");
      const scrollTrigger = { trigger: el, start: revealStart, once: true };
      if (reduced) {
        gsap.from(el, { opacity: 0, duration: reducedFade, scrollTrigger });
        return;
      }
      const inner = el.firstElementChild;
      gsap
        .timeline({ scrollTrigger, defaults: { duration: 1.1, ease: ease.out } })
        .from(el, { clipPath: "inset(12% 12% 12% 12%)" }, 0)
        .from(inner, { scale: 1.08 }, 0);
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={ref} data-reveal className={cn("overflow-hidden [clip-path:inset(0)]", className)}>
      {children}
    </div>
  );
}
