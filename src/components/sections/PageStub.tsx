import type { ReactNode } from "react";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { isPreview } from "@/lib/env";

type PageStubProps = {
  chip: string;
  lead: string;
  dim?: string;
  /** Which build phase fills this page (shown in dev/preview only). */
  phase: string;
  breakLine?: boolean;
  children?: ReactNode;
};

/** Empty route shell for Phase 1: real heading, real chrome, content arrives in a later phase. */
export function PageStub({ chip, lead, dim, phase, breakLine, children }: PageStubProps) {
  return (
    <Section chip={chip} rule={false} className="min-h-[60vh]">
      <div className="grid-frame gap-y-10 pt-8">
        <SplitHeading
          as="h1"
          lead={lead}
          dim={dim}
          breakLine={breakLine}
          size="xl"
          immediate
          className="col-span-full lg:col-span-10"
        />
        {children && <div className="col-span-full lg:col-span-8">{children}</div>}
        {isPreview && <p className="col-span-full type-label text-ink-dim">Content arrives in {phase}</p>}
      </div>
    </Section>
  );
}
