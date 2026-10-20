"use client";

import { useRef } from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { revealStart } from "@/lib/motion";

/**
 * Count-up number (02 §5: GSAP, snap 1, 1.2 s). Splits "30+" / "30%" into a number and suffix;
 * the full value is always in the accessible text, the ticking digits are aria-hidden.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { reduced } = useReducedMotionPref();
  const match = value.match(/^(\d+)(.*)$/);

  useGSAP(
    () => {
      if (!match || reduced) return;
      const el = ref.current!;
      const target = Number(match[1]);
      const proxy = { n: 0 };
      gsap.to(proxy, {
        n: target,
        duration: 1.2,
        ease: "power2.out",
        snap: { n: 1 },
        onUpdate: () => (el.textContent = String(proxy.n)),
        scrollTrigger: { trigger: el, start: revealStart, once: true },
      });
      el.textContent = "0";
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  if (!match) return <span className={className}>{value}</span>;
  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="tabular-nums">
        <span ref={ref}>{match[1]}</span>
        {match[2]}
      </span>
    </span>
  );
}
