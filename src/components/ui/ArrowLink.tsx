import { TransitionLink } from "@/components/transition/TransitionLink";
import { cn } from "@/lib/cn";

/** "All work →" style link: mono label, accent text, arrow nudges on hover. */
export function ArrowLink({
  href,
  children,
  className,
  arrow = "→",
}: {
  href: string;
  children: string;
  className?: string;
  arrow?: string;
}) {
  return (
    <TransitionLink
      href={href}
      className={cn("group/al inline-flex items-center gap-2 type-label text-accent-text", className)}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-200 ease-out group-hover/al:translate-x-1 group-focus-visible/al:translate-x-1"
      >
        {arrow}
      </span>
    </TransitionLink>
  );
}
