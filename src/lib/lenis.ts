"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * One Lenis instance for the whole site, driven by gsap.ticker (one RAF loop).
 * Never created under reduced motion — native scroll is used instead.
 */

export type ScrollState = { velocity: number; direction: 1 | -1 | 0; progress: number };

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;
const state: ScrollState = { velocity: 0, direction: 0, progress: 0 };
const listeners = new Set<(s: ScrollState) => void>();

export function startLenis(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
  lenis.on("scroll", (l: Lenis) => {
    state.velocity = l.velocity;
    state.direction = l.direction;
    state.progress = l.progress;
    ScrollTrigger.update();
    listeners.forEach((fn) => fn(state));
  });
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopLenis() {
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
  state.velocity = 0;
  state.direction = 0;
}

export function getLenis() {
  return lenis;
}

/** Live scroll velocity/direction/progress for the ride and shaders. Returns an unsubscribe function. */
export function onScroll(fn: (s: ScrollState) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getScrollState(): Readonly<ScrollState> {
  return state;
}

/** Scroll to the top instantly (route changes), with or without Lenis. */
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
