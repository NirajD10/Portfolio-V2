import { isPreview } from "@/lib/env";
import { cn } from "@/lib/cn";

/** Small corner tag on placeholder assets — dev and preview deployments only, never in production. */
export function PlaceholderTag({ className }: { className?: string }) {
  if (!isPreview) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-2 left-2 z-10 bg-accent px-1.5 py-0.5 type-label text-[10px] text-accent-ink",
        className,
      )}
    >
      Placeholder
    </span>
  );
}
