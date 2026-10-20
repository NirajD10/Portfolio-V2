"use client";

import Link from "next/link";
import { useRef } from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { site } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { dur, ease } from "@/lib/motion";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { LocalTime } from "./LocalTime";
import { MenuButton } from "./MenuButton";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Fixed 72px header (04 · Global chrome). Transparent at the top; once scrolled it gets the page
 * colour at 85% and a bottom rule. Hides on scroll down, returns on scroll up (not under reduced motion).
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();

  useGSAP(
    () => {
      const el = ref.current!;
      const show = gsap.quickTo(el, "yPercent", { duration: dur.short, ease: ease.out });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          el.toggleAttribute("data-scrolled", self.scroll() > 8);
          if (reduced) return;
          // Keep the header visible while keyboard focus is inside it.
          const hide = self.direction === 1 && self.scroll() > 200 && !el.contains(document.activeElement);
          show(hide ? -100 : 0);
        },
      });
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <header
      ref={ref}
      onFocusCapture={() => gsap.set(ref.current, { yPercent: 0 })}
      className="group/header fixed inset-x-0 top-0 z-20 frame-col h-header border-b border-transparent transition-colors duration-300 data-scrolled:border-line data-scrolled:bg-bg/85 data-scrolled:backdrop-blur-sm"
    >
      <div className="flex h-full items-center justify-between gap-6 px-frame-pad">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="font-display text-2xl font-semibold tracking-tight text-ink"
        >
          {site.wordmark}
          <span className="text-accent">.</span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          <LocalTime />
          <AvailabilityBadge />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <MenuButton />
        </div>
      </div>
    </header>
  );
}
