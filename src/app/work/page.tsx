import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { WorkProject } from "@/components/sections/work/WorkProject";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { TextLink } from "@/components/ui/TextLink";
import { archive, caseStudies } from "@/content/work/registry";
import { isTbd, t } from "@/lib/tbd";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Websites, web apps and AI products by Niraj Deshmukh — final work and the case studies behind it.",
};

/** Work index (04 · Work, 10 §2): hero, case-study index with view toggle, NDA note, archive. */
export default function WorkPage() {
  return (
    <>
      <Section rule={false} chip="WORK" aria-labelledby="work-title" className="pt-24">
        <div className="grid-frame gap-y-8">
          <SplitHeading
            as="h1"
            id="work-title"
            lead="Things I’ve built"
            dim="and shipped."
            size="xl"
            immediate
            className="col-span-full lg:col-span-8"
          />
          <Reveal immediate delay={0.25} className="col-span-full flex flex-col gap-6 lg:col-span-4 lg:pt-3">
            <p className="text-body-lg text-ink-muted">
              Start with the finished product; switch to the case study for the decisions behind it.
            </p>
            <div>
              <Button href="#case-studies" variant="ghost" arrow={false}>
                Jump to case studies ↓
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <section id="case-studies" aria-label="Case studies" className="scroll-mt-20">
        {caseStudies.map((p, i) => (
          <WorkProject key={p.slug} project={p} index={i} />
        ))}
      </section>

      <Section chip="NDA" aria-labelledby="nda-title">
        <div className="grid-frame">
          <div className="col-span-full lg:col-span-8">
            <h2 id="nda-title" className="font-display text-display-md text-ink">
              Some of my best work sits behind NDAs <span className="text-ink-dim">at Pure Tech Codex.</span>
            </h2>
            <p className="mt-6 text-body-lg text-ink-muted">Happy to walk through it on a call.</p>
            <p className="mt-6">
              <TextLink href="/contact">Get in touch</TextLink>
            </p>
          </div>
        </div>
      </Section>

      <Section chip="ARCHIVE" aria-labelledby="archive-title">
        <div className="grid-frame gap-y-8">
          <h2 id="archive-title" className="col-span-full font-display text-display-md text-ink">
            Smaller builds, <span className="text-ink-dim">kept for the record.</span>
          </h2>
          <ul className="col-span-full divide-y divide-line border-y border-line">
            {archive.map((p) => (
              <li
                key={p.slug}
                id={p.slug}
                className="grid scroll-mt-28 gap-3 py-6 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <span className="type-label text-ink-muted md:col-span-2">
                  {isTbd(p.year) ? t(p.year) : p.year}
                </span>
                <h3 className="text-title text-ink md:col-span-4">{p.title}</h3>
                <span className="text-small text-ink-muted md:col-span-4">{p.stack.join(" · ")}</span>
                <span className="flex gap-5 md:col-span-2 md:justify-end">
                  {p.links?.live && !isTbd(p.links.live) && (
                    <TextLink href={p.links.live} external>
                      Live ↗
                    </TextLink>
                  )}
                  {p.links?.code && (
                    <TextLink href={p.links.code} external>
                      Code ↗
                    </TextLink>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
