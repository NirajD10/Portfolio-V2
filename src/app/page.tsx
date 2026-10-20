import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { site } from "@/content/site";
import { isPreview } from "@/lib/env";

/** Home — Phase 1 shell: hero copy + the ride strip slot. Sections H2–H7 arrive in Phase 3. */
export default function HomePage() {
  const [lead, dim] = site.hero.title;
  return (
    <Section rule={false} aria-labelledby="hero-title" className="pt-16 lg:pt-24">
      <div className="grid-frame gap-y-10">
        <SplitHeading
          as="h1"
          id="hero-title"
          lead={lead}
          dim={dim}
          size="xl"
          immediate
          className="col-span-full lg:col-span-7"
        />
        <div className="col-span-full flex flex-col gap-8 lg:col-span-4 lg:col-start-9 lg:pt-3">
          <p className="text-body-lg text-ink-muted">{site.hero.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/work">View selected work</Button>
            <Button href="/about" variant="ghost">
              About me
            </Button>
          </div>
        </div>
      </div>

      {/* Pune ride strip slot (Phase 4) — reserves its height so nothing shifts later */}
      <div aria-hidden className="relative mt-16 aspect-[2320/151] min-h-[96px] w-full border-y border-line">
        {isPreview && (
          <span className="absolute inset-0 grid place-items-center type-label text-ink-dim">
            Pune ride strip · Phase 4
          </span>
        )}
      </div>
    </Section>
  );
}
