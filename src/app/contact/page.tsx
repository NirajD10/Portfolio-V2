import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { ContactTiles } from "@/components/sections/contact/ContactTiles";
import { SceneSlot } from "@/components/sections/SceneSlot";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { site } from "@/content/site";
import { resumeHref } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Contact",
  description: `Say hello to ${site.name} — websites, web apps and AI features, from ${site.location.city}.`,
};

/** Contact (04): title, tiles, and the arrival scene slot (Phase 9). */
export default function ContactPage() {
  return (
    <>
      <Section
        rule={false}
        chip={`CONTACT — ${site.location.city.toUpperCase()} · ${site.location.timeZoneLabel}`}
        aria-labelledby="contact-title"
        className="pt-24"
      >
        <div className="grid-frame gap-y-8">
          <SplitHeading
            as="h1"
            id="contact-title"
            lead="Say"
            dim="hello."
            breakLine={false}
            size="xl"
            immediate
            className="col-span-full"
          />
          <Reveal immediate delay={0.2} className="col-span-full lg:col-span-6">
            <p className="text-body-lg text-ink-muted">
              Websites, web apps and AI features — for teams and founders anywhere.
            </p>
          </Reveal>
          <Reveal immediate delay={0.35} className="col-span-full mt-8">
            <ContactTiles
              links={[
                { label: "GitHub", sub: "Code", href: site.socials.github },
                { label: "LinkedIn", sub: "Work history", href: site.socials.linkedin },
                { label: "Resume", sub: "PDF", href: resumeHref(site.resumeFallback) },
              ]}
            />
          </Reveal>
        </div>
      </Section>
      <SceneSlot label="Arrival scene · Phase 9" className="aspect-[16/5] max-h-[420px] w-full" />
    </>
  );
}
