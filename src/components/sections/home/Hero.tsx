import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { site } from "@/content/site";
import { isPreview } from "@/lib/env";

/** H1 · Hero (04): title cols 1–7, intro + buttons cols 9–12, the Pune ride strip below (Phase 4). */
export function Hero() {
  const [lead, dim] = site.hero.title;
  return (
    <Section rule={false} aria-labelledby="hero-title" className="pt-16 pb-0 lg:pt-24">
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
          <Reveal immediate delay={0.25}>
            <p className="text-body-lg text-ink-muted">{site.hero.intro}</p>
          </Reveal>
          <Reveal immediate delay={0.4} className="flex flex-wrap gap-3">
            <Button href="/work">View selected work</Button>
            <Button href="/about" variant="ghost">
              About me
            </Button>
          </Reveal>
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
