"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useCurtain } from "./CurtainProvider";

type TransitionLinkProps = ComponentProps<typeof Link> & { href: string };

/**
 * next/link that plays the curtain between pages (06 §3): wave covers → route changes behind it →
 * wave reveals the new page. Falls back to a plain navigation for modified clicks, new tabs,
 * same-page links and reduced motion.
 */
export function TransitionLink({ href, onClick, target, ...rest }: TransitionLinkProps) {
  const curtain = useCurtain();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || curtain.reduced) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || target === "_blank") return;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    curtain.navigate(href);
  }

  return <Link href={href} target={target} onClick={handleClick} {...rest} />;
}
