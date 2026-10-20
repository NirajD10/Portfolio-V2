import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small outlined stack/tag chip (mono label). Square corners — chips are never pills (02 §3). */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex border border-line px-2 py-1 type-label text-ink-muted", className)}>
      {children}
    </span>
  );
}
