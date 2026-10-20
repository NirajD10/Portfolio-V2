"use client";

import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { cssEase, dur } from "@/lib/motion";

/**
 * Theme switching (02 §1.3). With the View Transitions API the new theme is revealed as a circle
 * growing from `origin`; without it, under reduced motion or with no origin, it swaps instantly.
 */
export function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const { reduced } = useReducedMotionPref();

  function toggle(origin?: HTMLElement | null) {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const apply = () => {
      flushSync(() => setTheme(next));
      // next-themes applies the attribute in an effect; set it now so the snapshot is correct.
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
    };

    if (!origin || reduced || typeof document.startViewTransition !== "function") {
      apply();
      return;
    }

    const rect = origin.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document
      .startViewTransition(apply)
      .ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: dur.base * 1000, easing: cssEase.inOut, pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }

  return { theme: resolvedTheme, toggle };
}
