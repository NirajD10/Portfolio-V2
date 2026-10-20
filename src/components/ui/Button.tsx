import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Common = {
  variant?: "primary" | "ghost";
  /** Trailing ↗ arrow (default true). */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};
type AsLink = Common & { href: string; external?: boolean; onClick?: never; type?: never };
type AsButton = Common & { href?: never; external?: never; onClick?: () => void; type?: "button" | "submit" };
export type ButtonProps = AsLink | AsButton;

/**
 * Primary / ghost button (02 §4). Sharp corners; the ↗ arrow nudges 2px up-right on hover/focus and
 * the button scales to .98 on press — plain CSS transforms (180 ms, ease.out), so no animation
 * library ships with every page. See DECISIONS.md.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", arrow = true, className, children } = props;
  const classes = cn(
    "group/btn inline-flex items-center gap-2.5 px-[22px] py-4 text-[15px] leading-none font-medium",
    "transition-[background-color,transform] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]",
    variant === "primary"
      ? "bg-accent text-accent-ink hover:bg-accent-hover"
      : "border border-line-strong text-ink hover:bg-surface-2",
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          aria-hidden
          strokeWidth={1.75}
          className="size-4 transition-transform duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 group-focus-visible/btn:translate-x-0.5 group-focus-visible/btn:-translate-y-0.5"
        />
      )}
    </>
  );

  if (props.href !== undefined) {
    if (props.external) {
      return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className={classes}>
          {content}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} className={classes}>
      {content}
    </button>
  );
}
