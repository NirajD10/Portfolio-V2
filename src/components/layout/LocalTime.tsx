"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { msToNextMinute, puneTime } from "@/lib/time";
import { cn } from "@/lib/cn";

function subscribe(cb: () => void) {
  let interval: ReturnType<typeof setInterval> | undefined;
  const timeout = setTimeout(() => {
    cb();
    interval = setInterval(cb, 60_000);
  }, msToNextMinute());
  return () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };
}

/** `PUNE · 09:41 IST`, ticking on the minute (02 §4). Server HTML shows `--:--` until hydrated. */
export function LocalTime({ className, withCoords = false }: { className?: string; withCoords?: boolean }) {
  const time = useSyncExternalStore(
    subscribe,
    () => puneTime(),
    () => null,
  );
  return (
    <span className={cn("type-label text-ink-muted tabular-nums", className)}>
      {site.location.city.toUpperCase()}
      {withCoords && <> {site.location.coords}</>} · <time suppressHydrationWarning>{time ?? "--:--"}</time>{" "}
      IST
    </span>
  );
}
