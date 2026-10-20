import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { SceneSlot } from "@/components/sections/SceneSlot";
import { AssetImage } from "@/components/ui/AssetImage";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { TextLink } from "@/components/ui/TextLink";
import type { ImageAssetId } from "@/content/assets";
import { experience } from "@/content/experience";
import { site } from "@/content/site";
import { skills } from "@/content/skills";
import { isPreview } from "@/lib/env";
import { isTbd, t } from "@/lib/tbd";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name}, ${site.title.toLowerCase()} from ${site.location.city}: story, experience and skills.`,
};

const life = ["01", "02", "03", "04", "05", "06", "07", "08"] as const;
const path = [...experience].reverse(); // oldest first: Innovhub → Spellsys → Osumare → Pure Tech Codex

/** About (04): statement, story, timeline, skills, Life in frames. Desk illustration → Phase 9. */
export default function AboutPage() {
  return (
    <>
      {/* 1 · Statement */}
      <Section rule={false} chip="ABOUT" aria-labelledby="about-title" className="pt-24">
        <div className="mx-auto max-w-5xl px-frame-pad text-center">
          <SplitHeading
            as="h1"
            id="about-title"
            size="md"
            immediate
            breakLine={false}
            lead="I’m Niraj, a full-stack developer from Pune. I’ve built storefronts, 3D-printing businesses, enterprise apps and AI products —"
            dim="and I still get excited every time something ships."
          />
        </div>
      </Section>

      {/* 2 · Desk illustration slot (Phase 9) */}
      <SceneSlot label="Desk illustration · Phase 9" className="aspect-[16/7] max-h-[520px] w-full" />

      {/* 3 · Story */}
      <Section chip="STORY" aria-labelledby="story-title">
        <div className="grid-frame gap-y-10">
          <h2 id="story-title" className="sr-only">
            Story
          </h2>
          <Reveal className="col-span-full space-y-5 text-body-lg text-ink-muted lg:col-span-6">
            {site.about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="col-span-full lg:col-span-5 lg:col-start-8">
            <p className="type-label text-ink-muted">The path so far</p>
            <ol className="mt-4 divide-y divide-line border-y border-line">
              {path.map((j) => (
                <li key={j.index} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="text-ink">{j.company}</span>
                  <span className="shrink-0 type-label text-ink-muted">{j.start.slice(0, 4)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-small text-ink-muted">
              {site.education.degree}, {site.education.school} · {site.education.year}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* 4 · Timeline (the travelling bike arrives in Phase 9) */}
      <Section chip="EXPERIENCE" aria-labelledby="timeline-title">
        <div className="grid-frame gap-y-12">
          <SplitHeading id="timeline-title" lead="Where I’ve" dim="worked." className="col-span-full" />
          <ol className="relative col-span-full border-l border-line lg:col-span-10 lg:col-start-2">
            {experience.map((j) => (
              <Reveal
                as="li"
                key={j.index}
                className="relative grid gap-3 pb-12 pl-8 last:pb-0 md:grid-cols-[10rem_1fr] md:gap-8"
              >
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-[5px] size-[9px] border border-accent bg-bg"
                />
                <p className="type-label text-ink-muted">{j.dates}</p>
                <div>
                  <h3 className="text-title text-ink">{j.company}</h3>
                  <p className="mt-1 type-label text-accent-text">{j.role}</p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
                    {j.bullets.map((b) => (
                      <li key={b.slice(0, 32)}>{b}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* 5 · Skills */}
      <Section chip="SKILLS" aria-labelledby="skills-title">
        <div className="grid-frame gap-y-10">
          <SplitHeading id="skills-title" lead="The stack," dim="grouped." className="col-span-full" />
          <Reveal
            as="dl"
            stagger={0.05}
            className="col-span-full grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
          >
            {skills.map((g) => (
              <div key={g.group} data-reveal-item className="bg-bg p-6">
                <dt className="type-label text-ink-muted">{g.group}</dt>
                <dd className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <Chip key={s} className="text-ink">
                      {s}
                    </Chip>
                  ))}
                </dd>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* 6 · Life in frames — plain row now; the Grainy Carousel takes over in Phase 6 */}
      <Section chip="LIFE IN FRAMES" aria-labelledby="life-title">
        <div className="grid-frame gap-y-6">
          <SplitHeading id="life-title" lead="Life," dim="in frames." className="col-span-full" />
          {isPreview && <p className="col-span-full type-label text-ink-dim">Grainy Carousel · Phase 6</p>}
        </div>
        <ul
          tabIndex={0}
          aria-label="Life in frames (scrolls sideways)"
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-frame-pad pb-4 outline-offset-[-2px]"
        >
          {life.map((n) => (
            <li key={n} className="w-[min(60vw,280px)] shrink-0 snap-start">
              <AssetImage
                id={`life.${n}` as ImageAssetId}
                alt=""
                sizes="(min-width: 768px) 280px, 60vw"
                className="overflow-hidden rounded-card"
              />
            </li>
          ))}
        </ul>
        <p className="mt-12 px-frame-pad text-small text-ink-muted">
          Looking for the 2023 version?{" "}
          {isTbd(site.v1.url) ? t(site.v1.url) : <TextLink href={site.v1.url}>Visit V1 ↗</TextLink>}
        </p>
      </Section>
    </>
  );
}
