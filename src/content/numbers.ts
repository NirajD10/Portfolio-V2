/**
 * Home "Numbers" section (docs/plan/04 · H3). Only real values; a `[[TBD]]` value hides its bar.
 */

import { careerStart, experience } from "./experience";
import { site } from "./site";
import { skillCount } from "./skills";

export type Stat = {
  value: string;
  label: string;
  source: string;
  /** Hatched fill (first two) or outline hatching (rest). */
  fill: "accent" | "outline";
};

/** Whole years between two ISO months ("2021-09" → "2026-10" = 5). */
function yearsBetween(from: string, to: string) {
  const months = (iso: string) => {
    const [y, m] = iso.split("-").map(Number);
    return y * 12 + m;
  };
  return Math.floor((months(to) - months(from)) / 12);
}

export const numbers: Stat[] = [
  {
    value: `${yearsBetween(careerStart, site.contentAsOf)}+`,
    label: "Years building for the web",
    source: "Sep 2021 → today",
    fill: "accent",
  },
  {
    value: String(experience.length),
    label: "Companies",
    source: "V1 experience",
    fill: "accent",
  },
  {
    value: `${Math.floor(skillCount / 10) * 10}+`,
    label: "Tools & technologies",
    source: `V1 skills list (${skillCount})`,
    fill: "outline",
  },
  {
    value: "30%",
    label: "Traffic lift from SEO work",
    source: "Spellsys Technologies",
    fill: "outline",
  },
  {
    value: "[[TBD: projects shipped]]",
    label: "Projects shipped",
    source: "Niraj",
    fill: "outline",
  },
];
