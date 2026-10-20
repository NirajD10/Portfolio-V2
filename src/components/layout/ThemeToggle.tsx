"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { useThemeSwitch } from "./useThemeSwitch";

/**
 * Header light/dark toggle. Both icons are always rendered and CSS shows the right one, so there is
 * no hydration flash. The switch itself lives in useThemeSwitch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { toggle } = useThemeSwitch();
  return (
    <button
      type="button"
      onClick={(e) => toggle(e.currentTarget)}
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
