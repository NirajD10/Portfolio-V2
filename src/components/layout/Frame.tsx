import type { ReactNode } from "react";

/**
 * The structural frame (docs/plan/02 §3): a centred column with 1px rules on both sides from the top
 * of the page to the footer, and a faint line texture in the gutters outside it.
 * Sections stay transparent so the WebGL stage (Phase 5) shows through; the page colour is on <body>.
 */
export function Frame({ children }: { children: ReactNode }) {
  return (
    <>
      <div aria-hidden className="frame-texture pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-[1] frame-col flex min-h-dvh flex-col border-x border-line">{children}</div>
    </>
  );
}
