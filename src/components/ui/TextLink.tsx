import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextLinkProps = {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Accent text link (02 §4): 1px underline 4px below the text at rest; on hover/focus a full-strength
 * underline draws left → right (transform only).
 */
export function TextLink({ href, external, className, children }: TextLinkProps) {
  const classes = cn(
    "relative inline-block text-accent-text",
    "before:absolute before:inset-x-0 before:-bottom-1 before:h-px before:bg-current before:opacity-40",
    "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out",
    "hover:after:scale-x-100 focus-visible:after:scale-x-100",
    className,
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
