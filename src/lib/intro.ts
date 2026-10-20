"use client";

/**
 * "Intro done" signal: the preloader resolves it when it hands the page over (or immediately when
 * it's skipped), so above-the-fold entrances (hero title, intro, buttons) start after it — not
 * behind it.
 */

let resolveIntro: () => void = () => {};
const intro =
  typeof window === "undefined" ? Promise.resolve() : new Promise<void>((r) => (resolveIntro = r));

export function markIntroDone() {
  resolveIntro();
}

export function whenIntroDone(): Promise<void> {
  return intro;
}
