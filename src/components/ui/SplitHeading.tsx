"use client";

import { useRef, type ElementType } from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { dur, ease, reducedFade, revealStart, stagger } from "@/lib/motion";

type SplitHeadingProps = {
  as?: Extract<ElementType, "h1" | "h2" | "h3">;
  /** First phrase, in ink. */
  lead: string;
  /** Second phrase, dimmed (keep ≥ 24px so its contrast counts as large text). */
  dim?: string;
  /** Put the dim phrase on its own line. */
  breakLine?: boolean;
  size?: "xl" | "lg" | "md";
  /** Play on mount instead of on scroll (hero). */
  immediate?: boolean;
  className?: string;
  id?: string;
};

const sizes = {
  xl: "text-display-xl",
  lg: "text-display-lg",
  md: "text-display-md",
} as const;

/**
 * Two-tone heading (02 §2.2) with a SplitText line reveal (02 §5): lines rise from 100% inside a
 * mask. SplitText keeps the real text in aria-label; reduced motion gets a short fade instead.
 */
export function SplitHeading({
  as: Tag = "h2",
  lead,
  dim,
  breakLine = true,
  size = "lg",
  immediate = false,
  className,
  id,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { reduced } = useReducedMotionPref();

  useGSAP(
    () => {
      const el = ref.current!;
      const trigger = immediate ? undefined : { trigger: el, start: revealStart, once: true };
      el.setAttribute("data-revealed", "");

      if (reduced) {
        gsap.from(el, { opacity: 0, duration: reducedFade, scrollTrigger: trigger });
        return;
      }

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 100,
            duration: dur.base,
            ease: ease.out,
            stagger: stagger.lines,
            scrollTrigger: trigger,
          });
        },
      });
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  // SplitText rewrites the heading's children, so React must not own them: the markup goes in as
  // an opaque HTML string. The space before <br> keeps "apps and" apart in the generated aria-label.
  const html =
    escapeHtml(lead) +
    (dim ? ` ${breakLine ? "<br>" : ""}<span class="text-ink-dim">${escapeHtml(dim)}</span>` : "");

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal
      className={cn("font-display text-ink", sizes[size], className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
