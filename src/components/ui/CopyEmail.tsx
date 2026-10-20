"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** Copies the email address; the result is announced politely to screen readers. */
export function CopyEmail({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const id = setTimeout(() => setStatus("idle"), 2000);
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

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex items-center gap-2.5 border border-line-strong px-[22px] py-4 text-[15px] leading-none font-medium text-ink transition-colors hover:bg-surface-2",
          className,
        )}
      >
        {status === "copied" ? (
          <Check aria-hidden className="size-4 text-accent-text" strokeWidth={1.75} />
        ) : (
          <Copy aria-hidden className="size-4" strokeWidth={1.75} />
        )}
        <span>{status === "copied" ? "Copied" : "Copy email"}</span>
      </button>
      <span role="status" className="sr-only">
        {status === "copied" && `${site.email} copied to clipboard`}
        {status === "failed" && `Couldn't copy. The email is ${site.email}`}
      </span>
    </>
  );
}
