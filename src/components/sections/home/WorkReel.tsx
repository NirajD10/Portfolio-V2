import { Section } from "@/components/layout/Section";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { AssetImage } from "@/components/ui/AssetImage";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { projects } from "@/content/work/registry";
import { isPreview } from "@/lib/env";
import { isTbd } from "@/lib/tbd";

const reel = projects.filter((p) => p.inReel && p.cover);

/**
 * H5 · Selected work (04): plain DOM row of covers with scroll-snap — the Grainy Carousel (Phase 6)
 * takes this row over and keeps it as its tier-0 / reduced-motion fallback.
 */
export function WorkReel() {
  return (
    <Section chip="04 / SELECTED WORK" aria-labelledby="reel-title">
      <div className="grid-frame gap-y-10">
        <SplitHeading
          id="reel-title"
          lead="Selected work,"
          dim="in motion."
          className="col-span-full lg:col-span-8"
        />
        <div className="col-span-full flex items-end lg:col-span-4 lg:justify-end">
          <ArrowLink href="/work">All work</ArrowLink>
        </div>
      </div>

      <div className="relative mt-12">
        {isPreview && (
          <p className="px-frame-pad pb-3 type-label text-ink-dim">Grainy Carousel takes over · Phase 6</p>
        )}
        <Reveal
          as="ul"
          y={24}
          stagger={0.07}
          className="flex snap-x snap-mandatory [scrollbar-width:thin] gap-5 overflow-x-auto px-frame-pad pb-4"
        >
          {reel.map((p, i) => {
            const href = p.placement === "case-study" ? `/work/${p.slug}` : `/work#${p.slug}`;
            return (
              <li key={p.slug} data-reveal-item className="w-[min(78vw,360px)] shrink-0 snap-start">
                <TransitionLink href={href} className="group/card block">
                  <AssetImage
                    id={p.cover!}
                    alt=""
                    sizes="(min-width: 768px) 360px, 78vw"
                    className="overflow-hidden rounded-card"
                    imgClassName="transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
                  />
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="type-index text-accent-text">{String(i + 1).padStart(2, "0")}</p>
                      <h3 className="mt-2 text-title text-ink">{p.title}</h3>
                      <p className="mt-2 type-label text-ink-muted">
                        {p.tags.join(" · ")}
                        {!isTbd(p.year) && ` · ${p.year}`}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="shrink-0 pt-1 type-label text-accent-text opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 group-focus-visible/card:opacity-100"
                    >
                      {p.placement === "case-study" ? "View case study ↗" : "View ↗"}
                    </span>
                  </div>
                </TransitionLink>
              </li>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
