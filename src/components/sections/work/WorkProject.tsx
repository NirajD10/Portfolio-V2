"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { AssetImage } from "@/components/ui/AssetImage";
import { Chip } from "@/components/ui/Chip";
import type { ImageAssetId } from "@/content/assets";
import type { Project } from "@/content/work/registry";
import { cn } from "@/lib/cn";
import { isTbd, t } from "@/lib/tbd";

type View = "final" | "case";

/**
 * One project on /work (04 · Work, 10 §2). The left column (name, tags, one-liner, view toggle) is
 * sticky while its own screens scroll past, so the index always describes what's on screen. The
 * Final work / Case study toggle swaps the right column with a short fade (CSS, no library).
 */
export function WorkProject({ project, index }: { project: Project; index: number }) {
  const [view, setView] = useState<View>("final");
  const slug = project.slug;
  const shot = (s: string) => `work.${slug}.${s}` as ImageAssetId;

  return (
    <article
      id={slug}
      aria-labelledby={`${slug}-title`}
      className="grid-frame scroll-mt-28 gap-y-8 border-t border-line py-16 lg:py-24"
    >
      <div className="col-span-full lg:col-span-4">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
          <p className="type-index text-accent-text">{String(index + 1).padStart(2, "0")}</p>
          <h2 id={`${slug}-title`} className="mt-3 font-display text-display-md text-ink">
            {project.title}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Chip>{tag}</Chip>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-body text-ink-muted">{t(project.oneLiner)}</p>

          <div
            role="group"
            aria-label={`${project.title}: view`}
            className="mt-8 inline-flex border border-line-strong p-1"
          >
            {(["final", "case"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-2 type-label transition-colors",
                  view === v ? "bg-accent text-accent-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {v === "final" ? "Final work" : "Case study"}
              </button>
            ))}
          </div>

          <p className="mt-6">
            <TransitionLink
              href={`/work/${slug}`}
              className="inline-flex items-center gap-2 type-label text-accent-text hover:underline"
            >
              Read the full case study <span aria-hidden>↗</span>
            </TransitionLink>
          </p>
        </div>
      </div>

      <div className="col-span-full lg:col-span-8">
        {view === "final" ? (
          <div key="final" className="grid animate-[panel-in_0.3s_ease-out] gap-5 motion-reduce:animate-none">
            <AssetImage
              id={shot("hero")}
              alt={`${project.title} — hero`}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="overflow-hidden rounded-card"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {["screen-desktop-01", "screen-desktop-02"].map((s) => (
                <AssetImage
                  key={s}
                  id={shot(s)}
                  alt={`${project.title} — desktop screen`}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="overflow-hidden rounded-card"
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-5 sm:w-2/3">
              {["screen-mobile-01", "screen-mobile-02"].map((s) => (
                <AssetImage
                  key={s}
                  id={shot(s)}
                  alt={`${project.title} — mobile screen`}
                  sizes="(min-width: 1024px) 20vw, 45vw"
                  className="overflow-hidden rounded-card"
                />
              ))}
            </div>
          </div>
        ) : (
          <dl
            key="case"
            className="grid animate-[panel-in_0.3s_ease-out] gap-px border border-line bg-line motion-reduce:animate-none sm:grid-cols-2"
          >
            {[
              ["Problem", project.problem],
              ["Role", project.role],
              ["Stack", project.stack.join(", ")],
              ["Outcome", project.outcome],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface p-6">
                <dt className="type-label text-ink-muted">{k}</dt>
                <dd className={cn("mt-3 text-body", isTbd(v) ? "text-ink-muted" : "text-ink")}>{t(v)}</dd>
              </div>
            ))}
            <div className="bg-surface p-6 sm:col-span-2">
              <dt className="type-label text-ink-muted">Summary</dt>
              <dd className="mt-3 text-body text-ink">{t(project.summary)}</dd>
            </div>
          </dl>
        )}
        {project.nda && (
          <p className="mt-5 border-l-2 border-accent pl-4 text-small text-ink-muted">
            Built under NDA — details stay high-level.
          </p>
        )}
      </div>
    </article>
  );
}
