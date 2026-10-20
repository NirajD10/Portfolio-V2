"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

type Link = { label: string; sub: string; href: string };

/**
 * Contact tiles (04 · Contact): Email is the filled tile and copies the address (with a "Copied"
 * toast announced to screen readers); GitHub, LinkedIn and Resume open in a new tab.
 */
export function ContactTiles({ links }: { links: Link[] }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const id = setTimeout(() => setStatus("idle"), 2200);
    return () => clearTimeout(id);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  const tile = "group/tile relative flex min-h-40 flex-col justify-between gap-6 p-6 transition-colors";

  return (
    <div className="relative">
      <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        <li>
          <button
            type="button"
            onClick={copy}
            className={`${tile} h-full w-full bg-accent text-left text-accent-ink hover:bg-accent-hover`}
          >
            <span className="type-label">Email · click to copy</span>
            <span className="flex items-end justify-between gap-4">
              <span className="text-title break-all">{site.email}</span>
              {status === "copied" ? (
                <Check aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
              ) : (
                <Copy aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
              )}
            </span>
          </button>
        </li>
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${tile} h-full bg-bg text-ink hover:bg-surface-2`}
            >
              <span className="type-label text-ink-muted">{l.sub}</span>
              <span className="flex items-end justify-between gap-4">
                <span className="text-title">{l.label}</span>
                <ArrowUpRight
                  aria-hidden
                  className="size-5 transition-transform duration-200 group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5"
                  strokeWidth={1.75}
                />
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>

      {/* Toast */}
      <p
        role="status"
        className="pointer-events-none absolute -top-12 left-0 bg-ink px-3 py-2 type-label text-bg opacity-0 transition-opacity duration-200 data-[on=true]:opacity-100"
        data-on={status !== "idle"}
      >
        {status === "copied" && "Copied"}
        {status === "failed" && `Couldn’t copy — ${site.email}`}
      </p>
    </div>
  );
}
