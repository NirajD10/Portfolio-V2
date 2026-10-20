import type { Metadata } from "next";
import { PageStub } from "@/components/sections/PageStub";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageStub
      chip={`CONTACT — PUNE · ${site.location.timeZoneLabel}`}
      lead="Say"
      dim="hello."
      breakLine={false}
      phase="Phase 3"
    >
      <div className="flex flex-wrap gap-3">
        <Button href={`mailto:${site.email}`}>Email me</Button>
        <CopyEmail />
      </div>
    </PageStub>
  );
}
