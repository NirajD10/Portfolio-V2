import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SectionChip } from "./SectionChip";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /** e.g. "01 / BUILD" — sits on the top rule. */
  chip?: string;
  /** Draw the top rule + corner ticks (default true). */
  rule?: boolean;
  children: ReactNode;
};

/** Section boundary (02 §3): full-column top rule, 8px corner ticks at both ends, optional chip. */
export function Section({ chip, rule = true, className, children, ...rest }: SectionProps) {
  return (
    <section className={cn("relative py-section", rule && "border-t border-line", className)} {...rest}>
      {rule && (
        <>
          <span
            aria-hidden
            className="absolute -top-px -left-px size-2 border-t border-l border-line-strong"
          />
          <span
            aria-hidden
            className="absolute -top-px -right-px size-2 border-t border-r border-line-strong"
          />
        </>
      )}
      {chip && (
        <div className="absolute top-0 left-frame-pad -translate-y-1/2">
          <SectionChip label={chip} />
        </div>
      )}
      {children}
    </section>
  );
}
