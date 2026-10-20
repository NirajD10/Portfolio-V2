"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { cssEase, dur } from "@/lib/motion";

/**
 * Light/dark toggle (02 §1.3). With the View Transitions API the new theme is revealed as a circle
 * growing from the button; without it (or under reduced motion) the theme swaps instantly.
 * Both icons are always rendered and CSS shows the right one, so there is no hydration flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { reduced } = useReducedMotionPref();

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const apply = () => {
      flushSync(() => setTheme(next));
      // next-themes applies the attribute in an effect; set it now so the snapshot is correct.
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
    };

    if (reduced || typeof document.startViewTransition !== "function") {
      apply();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: dur.base * 1000, easing: cssEase.inOut, pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className={cn(
        "relative grid size-10 place-items-center text-ink transition-colors hover:text-accent-text",
        className,
      )}
    >
      <Sun
        aria-hidden
        strokeWidth={1.5}
        className="col-start-1 row-start-1 size-5 scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90"
      />
      <Moon
        aria-hidden
        strokeWidth={1.5}
        className="col-start-1 row-start-1 size-5 scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0"
      />
    </button>
  );
}
