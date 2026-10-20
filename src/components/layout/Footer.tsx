import { CopyEmail } from "@/components/ui/CopyEmail";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { TextLink } from "@/components/ui/TextLink";
import { nav, site } from "@/content/site";
import { resumeHref } from "@/lib/assets";
import { isPreview } from "@/lib/env";
import { isTbd, t } from "@/lib/tbd";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { MotionToggle } from "./MotionToggle";

const online = [
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Resume", href: resumeHref(site.resumeFallback) },
];

/** Footer on every page (04 · Global chrome). Static in Phase 1; the parked ride strip arrives in Phase 4. */
export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-line">
      {/* 1 · CTA */}
      <div className="grid-frame gap-y-10 py-section">
        <SplitHeading
          lead="Got a product in mind?"
          dim="Let’s build it."
          className="col-span-full lg:col-span-8"
        />
        <div className="col-span-full flex flex-wrap items-end gap-3 lg:col-span-4 lg:justify-end">
          <Button href="/contact">Start a project</Button>
          <CopyEmail />
        </div>
      </div>

      {/* 2 · Parked strip slot (Phase 4) */}
      <div aria-hidden className="relative h-[120px] border-y border-line">
        {isPreview && (
          <span className="absolute inset-0 grid place-items-center type-label text-ink-dim">
            Parked ride strip · Phase 4
          </span>
        )}
      </div>

      {/* 3 · Columns */}
      <div className="grid-frame gap-y-10 py-16">
        <div className="col-span-2 lg:col-span-3">
          <h2 className="mb-4 type-label text-ink-muted">Contact</h2>
          <p className="text-small">
            <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
          </p>
          <p className="mt-3 text-small text-ink-muted">Replies within {t(site.replyTime)}</p>
        </div>
        <nav aria-labelledby="footer-pages" className="col-span-2 lg:col-span-3">
          <h2 id="footer-pages" className="mb-4 type-label text-ink-muted">
            Pages
          </h2>
          <ul className="space-y-2 text-small">
            {nav.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  className="group inline-flex gap-3 text-ink hover:text-accent-text"
                >
                  <span className="pt-0.5 type-index text-accent-text">{item.index}</span>
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-2 lg:col-span-3">
          <h2 className="mb-4 type-label text-ink-muted">Online</h2>
          <ul className="space-y-2 text-small">
            {online.map((item) => (
              <li key={item.label}>
                <TextLink href={item.href} external>
                  {item.label} ↗
                </TextLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 lg:col-span-3">
          <h2 className="mb-4 type-label text-ink-muted">Based in</h2>
          <p className="text-small text-ink">
            {site.location.city}, {site.location.country}
          </p>
          <p className="mt-1 text-small text-ink-muted">{site.location.timeZoneLabel}</p>
        </div>
      </div>

      {/* 4 · Bottom bar */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line px-frame-pad py-5">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 type-label text-ink-muted">
          <li>
            © {site.copyrightYear} {site.name}
          </li>
          <li>
            <TransitionLink href="/facts" className="hover:text-ink">
              Facts
            </TransitionLink>
          </li>
          <li>
            {isTbd(site.v1.url) ? (
              t(`${site.v1.label} ${site.v1.url}`)
            ) : (
              <a href={site.v1.url} className="hover:text-ink">
                {site.v1.label}
              </a>
            )}
          </li>
          <li>Built with Next.js, GSAP &amp; Three.js</li>
        </ul>
        <MotionToggle />
      </div>
    </footer>
  );
}
