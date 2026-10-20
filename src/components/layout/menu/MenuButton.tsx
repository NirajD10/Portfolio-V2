"use client";

import { useRef } from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { useMenu } from "./MenuProvider";

const MORPH = 0.45;

/**
 * MENU trigger (06 §2): label + three uneven lines. Opening morphs the lines into an ✕, scrambles
 * MENU → CLOSE and draws a 40px line between label and icon; closing plays it back exactly.
 */
export function MenuButton({ className }: { className?: string }) {
  const { isOpen, setOpen, triggerRef } = useMenu();
  const { reduced } = useReducedMotionPref();
  const scope = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(scope);
      tl.current = gsap
        .timeline({ paused: true, defaults: { duration: MORPH, ease: ease.inOut } })
        .to(q("[data-line=top]"), { y: 7.5, rotate: 45 }, 0)
        .to(q("[data-line=bottom]"), { y: -7.5, rotate: -45 }, 0)
        .to(q("[data-line=mid]"), { scaleX: 0 }, 0)
        .fromTo(q("[data-rule]"), { scaleX: 0 }, { scaleX: 1 }, 0)
        .to(q("[data-label]"), { scrambleText: { text: "Close", chars: "▖▘▝▗", speed: 0.8 } }, 0);
    },
    // Built once; reduced motion jumps to the end state instead (a rebuild would revert mid-morph).
    { scope },
  );

  useGSAP(() => {
    const t = tl.current;
    if (!t) return;
    if (reduced) t.pause().progress(isOpen ? 1 : 0);
    else if (isOpen) t.timeScale(1).play();
    else t.timeScale(1.35).reverse();
  }, [isOpen, reduced]);

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-expanded={isOpen}
      aria-controls="site-menu"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      onClick={() => setOpen(!isOpen)}
      className={cn("group inline-flex h-10 items-center text-ink", className)}
    >
      <span ref={scope} aria-hidden className="inline-flex items-center gap-3">
        <span data-label className="min-w-[5ch] text-right type-label">
          Menu
        </span>
        <span data-rule className="h-px w-10 origin-right scale-x-0 bg-current" />
        <span className="relative flex h-[16.5px] w-6 flex-col items-end justify-between">
          <span data-line="top" className="h-[1.5px] w-6 bg-current" />
          <span data-line="mid" className="h-[1.5px] w-4 origin-right bg-current" />
          <span data-line="bottom" className="h-[1.5px] w-5 bg-current" />
        </span>
      </span>
    </button>
  );
}
