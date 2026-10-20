import { Fragment, type ReactNode } from "react";
import { isPreview } from "./env";

const TBD = /\[\[TBD:?\s*([^\]]*)\]\]/g;

/** True if a content string is still a `[[TBD: …]]` placeholder (or contains one). */
export const isTbd = (value: string) => value.includes("[[TBD");

/**
 * Render content text that may contain `[[TBD: …]]` placeholders. In dev/preview they show as a
 * purple dashed highlight; in production the note is shown as plain text (launch is gated on
 * `pnpm assets:check --strict`, so none should remain).
 */
export function t(text: string): ReactNode {
  if (!isTbd(text)) return text;
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TBD)) {
    parts.push(text.slice(last, m.index));
    const note = m[1] || "TBD";
    parts.push(
      isPreview ? (
        <mark key={m.index} className="tbd" title="Placeholder — Niraj to confirm">
          {note}
        </mark>
      ) : (
        <Fragment key={m.index}>{note}</Fragment>
      ),
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}
