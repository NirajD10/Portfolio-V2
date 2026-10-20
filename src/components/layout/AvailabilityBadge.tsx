import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** Pill with a pulsing dot (02 §4) — the only pill on the site. Text lives in site.ts. */
export function AvailabilityBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 type-label text-ink-muted",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-2 animate-[pulse-dot_2s_ease-in-out_infinite] rounded-full bg-teal-300 motion-reduce:animate-none"
      />
      {site.availability}
    </span>
  );
}
