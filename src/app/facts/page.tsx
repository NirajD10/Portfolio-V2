import type { Metadata } from "next";
import Link from "next/link";
import { TextLink } from "@/components/ui/TextLink";
import { experience } from "@/content/experience";
import { numbers } from "@/content/numbers";
import { site } from "@/content/site";
import { skills } from "@/content/skills";
import { tools } from "@/content/tools";
import { caseStudies } from "@/content/work/registry";
import { resumeHref } from "@/lib/assets";
import { isTbd, t } from "@/lib/tbd";

export const metadata: Metadata = {
  title: "Facts",
  description: `Plain fact sheet: ${site.name}, ${site.title.toLowerCase()} in ${site.location.city}.`,
};

/** Plain, text-only fact sheet for readers and AI crawlers (04 · Facts). Generated from src/content. */
export default function FactsPage() {
  const glance: [string, string][] = [
    ["Role", `${site.role}, ${site.company}`],
    ["Title", site.title],
    ["Location", `${site.location.city}, ${site.location.country} · ${site.location.timeZoneLabel}`],
    ["Education", `${site.education.degree}, ${site.education.school}, ${site.education.year}`],
    ["Stack", "React, Next.js, Node.js, Fastify, TypeScript, PostgreSQL, MongoDB, RAG / Generative AI"],
    ["Availability", site.availability],
  ];

  return (
    <article className="mx-auto max-w-[680px] px-frame-pad py-24 text-body">
      <p className="type-label text-ink-muted">Fact sheet</p>
      <h1 className="mt-3 font-display text-display-md text-ink">{site.name}</h1>
      <p className="mt-3 type-label text-ink-dim">
        Last updated <time dateTime={site.contentAsOf}>{site.contentAsOf}</time>
      </p>

      <h2 className="mt-14 text-title text-ink">Summary</h2>
      <p className="mt-3 text-ink-muted">{site.tagline}</p>
      {site.about.map((p) => (
        <p key={p.slice(0, 24)} className="mt-3 text-ink-muted">
          {p}
        </p>
      ))}

      <h2 className="mt-14 text-title text-ink">At a glance</h2>
      <dl className="mt-3 divide-y divide-line border-y border-line">
        {glance.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-3">
            <dt className="pt-1 type-label text-ink-muted">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-14 text-title text-ink">Numbers</h2>
      <ul className="mt-3 space-y-1 text-ink-muted">
        {numbers
          .filter((n) => !isTbd(n.value))
          .map((n) => (
            <li key={n.label}>
              <span className="text-ink">{n.value}</span> — {n.label}
            </li>
          ))}
      </ul>

      <h2 className="mt-14 text-title text-ink">Experience</h2>
      <ol className="mt-3 space-y-8">
        {experience.map((job) => (
          <li key={job.index}>
            <h3 className="text-ink">
              {job.role} · {job.company}
            </h3>
            <p className="mt-1 type-label text-ink-muted">{job.dates}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-muted">
              {job.bullets.map((b) => (
                <li key={b.slice(0, 32)}>{b}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 text-title text-ink">Skills</h2>
      <dl className="mt-3 space-y-2">
        {skills.map((g) => (
          <div key={g.group}>
            <dt className="inline text-ink">{g.group}: </dt>
            <dd className="inline text-ink-muted">{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-14 text-title text-ink">Case studies</h2>
      <ul className="mt-3 space-y-2">
        {caseStudies.map((p) => (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`} className="text-accent-text underline underline-offset-4">
              {p.title}
            </Link>{" "}
            <span className="text-ink-muted">— {t(p.oneLiner)}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-title text-ink">AI tools</h2>
      <ul className="mt-3 space-y-1 text-ink-muted">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <span className="text-ink">{tool.name}</span> ({tool.maker}) — {tool.use}
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-title text-ink">Contact</h2>
      <ul className="mt-3 space-y-1">
        <li>
          <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
        </li>
        <li>
          <TextLink href={site.socials.github} external>
            GitHub
          </TextLink>
        </li>
        <li>
          <TextLink href={site.socials.linkedin} external>
            LinkedIn
          </TextLink>
        </li>
        <li>
          <TextLink href={resumeHref(site.resumeFallback)} external>
            Resume (PDF)
          </TextLink>
        </li>
      </ul>
    </article>
  );
}
