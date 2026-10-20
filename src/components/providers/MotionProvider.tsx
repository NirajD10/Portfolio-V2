"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { resetScroll, startLenis, stopLenis } from "@/lib/lenis";

/**
 * Site-wide motion: Lenis on gsap.ticker, ScrollTrigger refreshes, and the reduced-motion preference.
 * `reduced` is true when the OS asks for reduced motion OR the visitor turned motion off on the site
 * (stored in localStorage, docs/plan/06 §6). Components read it with useReducedMotionPref();
 * Motion components get it through <MotionScope> (src/components/providers/MotionScope.tsx).
 */

type MotionPref = "full" | "reduce";
type MotionContextValue = {
  reduced: boolean;
  /** The visitor's site toggle (independent of the OS setting). */
  userPref: MotionPref;
  setUserPref: (pref: MotionPref) => void;
};

const MotionContext = createContext<MotionContextValue>({
  reduced: false,
  userPref: "full",
  setUserPref: () => {},
});

const STORAGE_KEY = "nd:motion";
const QUERY = "(prefers-reduced-motion: reduce)";
const prefListeners = new Set<() => void>();

function readUserPref(): MotionPref {
  try {
    return localStorage.getItem(STORAGE_KEY) === "reduce" ? "reduce" : "full";
  } catch {
    return "full";
  }
}

function subscribeUserPref(cb: () => void) {
  prefListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    prefListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function subscribeOs(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const osReduced = useSyncExternalStore(
    subscribeOs,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  const userPref = useSyncExternalStore<MotionPref>(subscribeUserPref, readUserPref, () => "full");
  const reduced = osReduced || userPref === "reduce";

  const setUserPref = useCallback((pref: MotionPref) => {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {}
    prefListeners.forEach((fn) => fn());
  }, []);

  // Flag for CSS (motion-reduce: variant) and start/stop Lenis.
  useEffect(() => {
    const root = document.documentElement;
    if (reduced) root.dataset.motion = "reduce";
    else delete root.dataset.motion;

    if (reduced) return;
    startLenis();
    return () => stopLenis();
  }, [reduced]);

  // Refresh ScrollTrigger once fonts and images have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  // Route change: back to the top, then re-measure.
  const pathname = usePathname();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    resetScroll();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  const value = useMemo(() => ({ reduced, userPref, setUserPref }), [reduced, userPref, setUserPref]);

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useReducedMotionPref() {
  return useContext(MotionContext);
}
