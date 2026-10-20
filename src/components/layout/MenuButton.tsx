"use client";

import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/cn";

/**
 * MENU trigger (06 §2) — placeholder until the overlay lands in Phase 2. For now it jumps to the
 * footer's page list so it's never a dead control.
 */
export function MenuButton({ className }: { className?: string }) {
  return (
    <a
      href="#site-pages"
      onClick={(e) => {
        const lenis = getLenis();
        if (!lenis) return;
        e.preventDefault();
        lenis.scrollTo("#site-pages");
        document.getElementById("site-pages")?.focus({ preventScroll: true });
      }}
      className={cn("group inline-flex h-10 items-center gap-3 text-ink", className)}
    >
      <span className="type-label">Menu</span>
      <span aria-hidden className="flex w-6 flex-col items-end gap-1.5">
        <span className="h-[1.5px] w-6 bg-current" />
        <span className="h-[1.5px] w-4 origin-right bg-current transition-transform duration-200 group-hover:scale-x-150" />
        <span className="h-[1.5px] w-5 bg-current" />
      </span>
    </a>
  );
}
