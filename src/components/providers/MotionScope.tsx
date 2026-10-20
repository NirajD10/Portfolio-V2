"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotionPref } from "./MotionProvider";

const loadFeatures = () => import("motion/react").then((mod) => mod.domAnimation);

/**
 * Wrap a feature that uses Motion (`m.*` components, AnimatePresence, layout) in this. Motion then
 * loads with that feature instead of in every page's first-load bundle, and honours the site's
 * reduced-motion preference (OS setting or the site toggle).
 */
export function MotionScope({ children }: { children: ReactNode }) {
  const { reduced } = useReducedMotionPref();
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>
    </LazyMotion>
  );
}
