"use client";

import { useRef } from "react";
import { Section } from "@/components/layout/Section";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { numbers } from "@/content/numbers";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease, revealStart } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { isTbd } from "@/lib/tbd";

// Only real values get a bar (13 §2.6: "bar hidden until set").
const stats = numbers.filter((n) => !isTbd(n.value));
const split = (value: string) => {
  const m = value.match(/^(\d+)(.*)$/);
  return m ? { n: Number(m[1]), suffix: m[2] } : { n: 0, suffix: value };
};

/**
 * H3 · Numbers (04): hatched bars rise while the numbers count up. On desktop the section pins for
 * ~150vh and the scroll scrubs it; on mobile it plays once on entry; reduced motion shows the end
 * state. Bars are equal height on purpose — the stats have different units, so heights would imply
 * a comparison that isn't there.
 */
export function Numbers() {
  const scope = useRef<HTMLDivElement>(null);
  const { reduced } = useReducedMotionPref();

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(scope);
      const bars = q("[data-bar]");
      const digits = q("[data-digits]");

      const build = (tl: gsap.core.Timeline) => {
        digits.forEach((d) => (d.textContent = "0"));
        bars.forEach((bar, i) => {
          const { n } = split(stats[i].value);
          const proxy = { v: 0 };
          const at = i * 0.18;
          tl.fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: ease.out }, at);
          tl.to(
            proxy,
            {
              v: n,
              duration: 0.6,
              ease: "power2.out",
              snap: { v: 1 },
              onUpdate: () => (digits[i].textContent = String(proxy.v)),
            },
            at,
          );
        });
        return tl;
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        build(
          gsap.timeline({
            scrollTrigger: { trigger: scope.current, start: "top top", end: "+=150%", pin: true, scrub: 0.6 },
          }),
        );
      });
      mm.add("(max-width: 1023.98px)", () => {
        build(gsap.timeline({ scrollTrigger: { trigger: scope.current, start: revealStart, once: true } }));
      });
      // Text isn't reverted by GSAP: put the real values back when the animation is torn down.
      return () => digits.forEach((d, i) => (d.textContent = String(split(stats[i].value).n)));
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <Section chip="02 / NUMBERS" aria-labelledby="numbers-title" className="py-0">
      <div ref={scope} className="flex min-h-dvh flex-col justify-center gap-12 py-section lg:py-24">
        <div className="grid-frame gap-y-6">
          <SplitHeading
            id="numbers-title"
            lead="Since 2021,"
            dim="in plain numbers."
            className="col-span-full lg:col-span-8"
          />
          <div className="col-span-full flex items-end lg:col-span-4 lg:justify-end">
            <ArrowLink href="/about">More about me</ArrowLink>
          </div>
        </div>

        <ul className="grid-frame gap-y-12">
          {stats.map((stat) => {
            const { n, suffix } = split(stat.value);
            return (
              <li key={stat.label} className="col-span-2 flex flex-col gap-4 lg:col-span-3">
                <p className="font-display text-display-lg text-ink">
                  <span className="sr-only">{stat.value}</span>
                  <span aria-hidden className="tabular-nums">
                    <span data-digits>{n}</span>
                    {suffix}
                  </span>
                </p>
                <div aria-hidden className="relative h-[clamp(120px,28vh,280px)] border-b border-line-strong">
                  <span
                    data-bar
                    className={cn(
                      "absolute inset-x-0 top-0 bottom-0 origin-bottom",
                      stat.fill === "accent"
                        ? "bg-[repeating-linear-gradient(135deg,var(--accent)_0_2px,transparent_2px_8px)]"
                        : "border border-accent bg-[repeating-linear-gradient(135deg,var(--accent-soft)_0_2px,transparent_2px_8px)]",
                    )}
                  />
                </div>
                <p className="text-small text-ink-muted">{stat.label}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
