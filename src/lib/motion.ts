/** Motion tokens (docs/plan/02-design-system.md §5). Every animation takes its easing and duration from here. */

export const ease = {
  out: "expo.out", // entrances, hovers
  inOut: "power3.inOut", // menu wave, page transitions
  soft: "sine.inOut", // loops, bobbing
  snap: "back.out(1.6)", // small confirmations
} as const;

/** CSS / WAAPI / Motion equivalents of `ease`, for places GSAP doesn't drive. */
export const cssEase = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  soft: "cubic-bezier(0.37, 0, 0.63, 1)",
  snap: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

/** Motion (`motion/react`) takes bezier arrays. */
export const motionEase = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  soft: [0.37, 0, 0.63, 1],
  snap: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<keyof typeof ease, readonly [number, number, number, number]>;

/** Seconds. */
export const dur = {
  micro: 0.18, // hover, press
  short: 0.35, // small reveals
  base: 0.6, // text line reveals
  long: 1.1, // menu wave, section intros
  scene: 2.4, // ride stop/start
} as const;

/** Under reduced motion every entrance becomes a fade of at most this long (seconds). */
export const reducedFade = 0.15;

export const stagger = { chars: 0.018, words: 0.04, lines: 0.08, items: 0.07 } as const;

/** ScrollTrigger start for scroll entrances. */
export const revealStart = "top 80%";
