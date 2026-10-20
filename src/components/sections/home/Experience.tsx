"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { experience } from "@/content/experience";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * H6 · Experience (04): A1–A4 + E1 cells. Each company cell is a disclosure button; its V1 bullet
 * points open in a panel under the grid (one at a time). The panel fades in — no height animation.
 */
export function Experience() {
  const [open, setOpen] = useState<string | null>(null);
  const job = experience.find((j) => j.index === open);

  return (
    <Section chip="05 / EXPERIENCE" aria-labelledby="exp-title">
      <div className="grid-frame gap-y-10">
        <SplitHeading
          id="exp-title"
          lead="Teams I’ve"
          dim="built with."
          className="col-span-full lg:col-span-8"
        />
        <Reveal className="col-span-full lg:col-span-6">
          <p className="text-body-lg text-ink-muted">
            From a 3D-printing startup I helped run, to enterprise apps that passed VAPT.
          </p>
        </Reveal>

        <Reveal
          as="ul"
          stagger={0.07}
          y={24}
          className="col-span-full grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5"
        >
          {experience.map((j) => {
            const isOpen = open === j.index;
            return (
              <li key={j.index} data-reveal-item className="bg-bg">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls="exp-panel"
                  onClick={() => setOpen(isOpen ? null : j.index)}
                  className={cn(
                    "group/cell flex h-full w-full flex-col items-start gap-3 p-6 text-left outline-offset-[-2px] transition-colors hover:bg-surface-2",
                    isOpen && "bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "type-index text-ink-muted transition-colors group-hover/cell:text-accent-text",
                      isOpen && "text-accent-text",
                    )}
                  >
                    {j.index}
                  </span>
                  <span className="text-title text-ink">{j.company}</span>
                  <span className="type-label text-ink-muted">{j.role}</span>
                  <span className="text-small text-ink-muted">{j.dates}</span>
                  <span className="mt-auto pt-2 type-label text-accent-text">
                    {isOpen ? "Hide details −" : "Details +"}
                  </span>
                </button>
              </li>
            );
          })}
          <li data-reveal-item className="flex flex-col items-start gap-3 bg-bg p-6">
            <span className="type-index text-ink-muted">{site.education.index}</span>
            <span className="text-title text-ink">{site.education.school}</span>
            <span className="type-label text-ink-muted">{site.education.degree}</span>
            <span className="text-small text-ink-muted">{site.education.year}</span>
          </li>
        </Reveal>

        <div id="exp-panel" role="region" aria-label="Experience details" className="col-span-full">
          {job && (
            <div
              key={job.index}
              className="relative animate-[panel-in_0.35s_cubic-bezier(0.16,1,0.3,1)] border border-line bg-surface p-6 motion-reduce:animate-none lg:p-10"
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close details"
                className="absolute top-4 right-4 grid size-10 place-items-center text-ink-muted hover:text-ink"
              >
                <X aria-hidden className="size-5" strokeWidth={1.5} />
              </button>
              <p className="type-index text-accent-text">{job.index}</p>
              <h3 className="mt-2 text-title text-ink">
                {job.role} · {job.company}
              </h3>
              <p className="mt-2 type-label text-ink-muted">{job.dates}</p>
              <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-5 text-ink-muted">
                {job.bullets.map((b) => (
                  <li key={b.slice(0, 32)}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
