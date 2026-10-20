import { isPreview } from "@/lib/env";
import { cn } from "@/lib/cn";

/** Reserved space for a scene that arrives in a later phase — keeps layout stable, labelled in dev. */
export function SceneSlot({ label, className }: { label: string; className?: string }) {
  return (
    <div aria-hidden className={cn("relative border-y border-line", className)}>
      {isPreview && (
        <span className="absolute inset-0 grid place-items-center px-4 text-center type-label text-ink-dim">
          {label}
        </span>
      )}
    </div>
  );
}
