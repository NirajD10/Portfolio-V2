"use client";

import { X } from "lucide-react";
import { useSyncExternalStore } from "react";
import { LocalTime } from "@/components/layout/LocalTime";
import { MotionToggle } from "@/components/layout/MotionToggle";
import { useThemeSwitch } from "@/components/layout/useThemeSwitch";
import { site } from "@/content/site";
import { resumeHref } from "@/lib/assets";
import { menuTagline } from "./items";

/** Top row of the overlay HUD (06 §1): accent bar + tagline, and CLOSE ──── ✕ where the trigger sits. */
export function MenuHudTop({ onClose }: { onClose: () => void }) {
  return (
    <div className="frame-col flex h-header shrink-0 items-center justify-between gap-6 px-frame-pad">
      <p data-hud className="flex items-center gap-3">
        <span aria-hidden className="h-5 w-1 bg-accent" />
        <span className="type-label text-menu-muted max-sm:hidden">{menuTagline}</span>
      </p>
      <button
        data-hud
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className="inline-flex h-10 items-center gap-3 text-menu-ink"
      >
        <span aria-hidden className="type-label">
          Close
        </span>
        <span aria-hidden className="h-px w-10 bg-current" />
        <X aria-hidden className="size-6" strokeWidth={1.5} />
      </button>
    </div>
  );
}

/** Bottom rows of the HUD: wordmark, coordinates + IST, toggles; socials, resume, email, ©. */
export function MenuHudBottom() {
  const { theme, toggle } = useThemeSwitch();
  // The theme is only known on the client; render its name after hydration to avoid a mismatch.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const links = [
    { label: "GitHub ↗", href: site.socials.github },
    { label: "LinkedIn ↗", href: site.socials.linkedin },
    { label: "Resume ↗", href: resumeHref(site.resumeFallback) },
  ];

  return (
    <div className="frame-col shrink-0 space-y-4 px-frame-pad pb-6">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-menu-line pt-5">
        <span data-hud className="font-display text-xl font-semibold text-menu-ink max-md:hidden">
          {site.wordmark}
          <span className="text-accent">.</span>
        </span>
        <span data-hud>
          <LocalTime withCoords className="text-menu-muted" />
        </span>
        <span data-hud className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => toggle()}
            className="type-label text-menu-muted transition-colors hover:text-menu-ink"
          >
            <span aria-hidden>◐</span> Theme <span className="text-accent-text">{mounted ? theme : ""}</span>
          </button>
          {/* Sound toggle appears in Phase 10, once the sound files exist (13 §2.5). */}
          <MotionToggle className="text-menu-muted hover:text-menu-ink" />
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <ul data-hud className="flex flex-wrap gap-x-6 gap-y-2 type-label text-menu-muted">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-menu-ink">
                {l.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.email}`} className="normal-case hover:text-menu-ink">
              {site.email}
            </a>
          </li>
        </ul>
        <p data-hud className="type-label text-menu-muted">
          © {site.copyrightYear}
        </p>
      </div>
    </div>
  );
}
