"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { Section } from "@/components/layout/Section";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { tracks } from "@/content/tracks";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { TrackArt } from "./TrackArt";

/**
 * H2 · What I build (04): three tracks. Desktop shows one at a time with prev/next (the others are
 * `visibility: hidden`, so they leave the tab order and accessibility tree); mobile stacks all three.
 * Hovering a track floats its illustration pieces apart.
 */
export function Tracks() {
  const [active, setActive] = useState(0);
  const scope = useRef<HTMLDivElement>(null);
  const { reduced } = useReducedMotionPref();
  const go = (dir: 1 | -1) => setActive((i) => (i + dir + tracks.length) % tracks.length);

  const { contextSafe } = useGSAP({ scope });
  const float = contextSafe((slide: HTMLElement, apart: boolean) => {
    if (reduced) return;
    const parts = (name: string) => slide.querySelectorAll(`[data-part=${name}]`);
    const vars = { duration: 0.6, ease: ease.out, overwrite: "auto" as const };
    gsap.to(parts("back"), { y: apart ? -10 : 0, ...vars });
    gsap.to(parts("mid"), { y: apart ? -4 : 0, ...vars });
    gsap.to(parts("front"), { y: apart ? 8 : 0, x: apart ? 4 : 0, ...vars });
  });

  return (
    <Section chip="01 / BUILD" aria-labelledby="tracks-title">
      <div className="grid-frame gap-y-10">
        <div className="col-span-full flex flex-wrap items-end justify-between gap-6">
          <SplitHeading id="tracks-title" lead="What I" dim="build." breakLine={false} />
          <div className="hidden items-center gap-3 lg:flex">
            <p aria-live="polite" className="mr-3 type-label text-ink-muted">
              Track {active + 1} of {tracks.length}
            </p>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous track"
              className="grid size-11 place-items-center border border-line-strong text-ink transition-colors hover:bg-surface-2"
            >
              <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next track"
              className="grid size-11 place-items-center border border-line-strong text-ink transition-colors hover:bg-surface-2"
            >
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div ref={scope} className="col-span-full grid gap-16 lg:gap-0">
          {tracks.map((track, i) => (
            <article
              key={track.slug}
              aria-labelledby={`track-${track.slug}`}
              data-active={i === active}
              onMouseEnter={(e) => float(e.currentTarget, true)}
              onMouseLeave={(e) => float(e.currentTarget, false)}
              className="grid items-center gap-10 transition-[opacity,translate,visibility] duration-500 ease-out lg:col-start-1 lg:row-start-1 lg:grid-cols-12 lg:gap-6 lg:data-[active=false]:invisible lg:data-[active=false]:translate-y-3 lg:data-[active=false]:opacity-0"
            >
              <Reveal className="lg:col-span-5">
                <p className="type-index text-accent-text">{track.index}</p>
                <h3 id={`track-${track.slug}`} className="mt-3 font-display text-display-md text-ink">
                  {track.title}
                </h3>
                <p className="mt-3 type-label text-ink-muted">Since {track.since}</p>
                <p className="mt-6 max-w-md text-body-lg text-ink-muted">{track.line}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${track.title} stack`}>
                  {track.stack.map((s) => (
                    <li key={s}>
                      <Chip>{s}</Chip>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <div className="flex justify-center lg:col-span-6 lg:col-start-7">
                <TrackArt slug={track.slug} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
