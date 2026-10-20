"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { whenIntroDone } from "@/lib/intro";
import { cn } from "@/lib/cn";
import { ease, reducedFade, revealStart } from "@/lib/motion";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Seconds after the trigger. */
  delay?: number;
  /** Rise distance in px (02 §5: body copy 12, tiles 24). */
  y?: number;
  /** Animate direct children marked `data-reveal-item` one after another instead of the wrapper. */
  stagger?: number;
  /** Play after the preloader instead of on scroll (above the fold). */
  immediate?: boolean;
  id?: string;
};

/**
 * Scroll entrance for body copy, tiles and cards (02 §5): fade + rise, `expo.out`. Under reduced
 * motion it becomes a 150 ms fade. Content is in the DOM and readable before and after.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 12,
  stagger,
  immediate = false,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();

  useGSAP(
    () => {
      const el = ref.current!;
      el.setAttribute("data-revealed", "");
      const targets = stagger ? el.querySelectorAll("[data-reveal-item]") : el;
      const tween = gsap.from(targets, {
        opacity: 0,
        y: reduced ? 0 : y,
        duration: reduced ? reducedFade : 0.5,
        ease: ease.out,
        delay,
        stagger: reduced ? 0 : stagger,
        paused: immediate,
        scrollTrigger: immediate ? undefined : { trigger: el, start: revealStart, once: true },
      });
      if (immediate) whenIntroDone().then(() => tween.play());
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} id={id} data-reveal className={cn(className)}>
      {children}
    </Tag>
  );
}
