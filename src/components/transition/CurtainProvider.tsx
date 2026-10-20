"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { useGpuTier } from "@/components/webgl/useGpuTier";
import { gsap } from "@/lib/gsap";
import { dur, ease, reducedFade } from "@/lib/motion";
import { Curtain } from "./Curtain";

/**
 * The curtain: one full-screen wave shared by the menu overlay and page transitions (06 §3–4).
 * Progress 0 = page visible, 1 = fully covered by the menu base colour.
 *
 * Renderers, picked when a run begins:
 *  - "shader": the glitch-block shader (GPU tier ≥ 1, module loaded)
 *  - "strips": 16 CSS strips (tier 0, no WebGL, or shader not loaded yet)
 *  - "fade":   a plain 200 ms fade (reduced motion)
 */

export type CurtainMode = "shader" | "strips" | "fade";

export type CurtainApi = {
  /** Pick a renderer and mount it. Call before animating from 0. */
  begin: () => CurtainMode;
  /** Unmount the renderer once progress is back at 0. */
  end: () => void;
  /** Apply a progress value (used by timelines that own the tween, e.g. the menu). */
  apply: (p: number) => void;
  /** Tween progress to a value. */
  to: (p: number, vars?: { duration?: number; ease?: string }) => Promise<void>;
  /** Proxy object timelines can tween directly (`{ p }`) — call apply in onUpdate. */
  proxy: () => { p: number };
  /** Cover → router.push → wait for the new page → reveal. */
  navigate: (href: string) => Promise<void>;
  /** Resolves once the given path has rendered and painted (or after a timeout). */
  waitForPage: (path: string) => Promise<void>;
  reduced: boolean;
};

const CurtainContext = createContext<CurtainApi | null>(null);

type Renderer = { set: (p: number, mode: CurtainMode) => void };

export function CurtainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { reduced } = useReducedMotionPref();
  const tier = useGpuTier();

  const [active, setActive] = useState<CurtainMode | null>(null);
  const [shaderReady, setShaderReady] = useState(false);
  // Mutable proxy that GSAP tweens; created once and never replaced.
  const stateRef = useRef({ p: 0 });
  const modeRef = useRef<CurtainMode>("strips");
  const renderer = useRef<Renderer | null>(null);
  const progressRef = useRef(0);
  const busy = useRef(false);

  // Preload the shader module on idle once we know the GPU can take it.
  useEffect(() => {
    if (tier === null || tier < 1 || reduced) return;
    let alive = true;
    import("@/components/webgl/menu-glitch/MenuGlitch").then(() => alive && setShaderReady(true));
    return () => {
      alive = false;
    };
  }, [tier, reduced]);

  const apply = useCallback((p: number) => {
    stateRef.current.p = p;
    progressRef.current = p;
    renderer.current?.set(p, modeRef.current);
  }, []);

  const begin = useCallback((): CurtainMode => {
    const mode: CurtainMode = reduced ? "fade" : shaderReady && (tier ?? 0) >= 1 ? "shader" : "strips";
    modeRef.current = mode;
    setActive(mode);
    return mode;
  }, [reduced, shaderReady, tier]);

  // WebGL failed mid-run: never try the shader again this session, finish with the strips.
  const onShaderError = useCallback(() => {
    setShaderReady(false);
    modeRef.current = "strips";
    setActive("strips");
    renderer.current?.set(stateRef.current.p, "strips");
  }, []);

  const end = useCallback(() => {
    apply(0);
    setActive(null);
  }, [apply]);

  const to = useCallback(
    (p: number, vars?: { duration?: number; ease?: string }) =>
      new Promise<void>((resolve) => {
        const state = stateRef.current;
        gsap.to(state, {
          p,
          duration: vars?.duration ?? (modeRef.current === "fade" ? reducedFade : dur.long * 0.75),
          ease: vars?.ease ?? ease.inOut,
          overwrite: true,
          onUpdate: () => apply(state.p),
          onComplete: () => resolve(),
        });
      }),
    [apply],
  );

  // Page-ready signal: resolves waiters once the new pathname has committed and painted.
  const waiters = useRef(new Map<string, () => void>());
  useEffect(() => {
    const resolve = waiters.current.get(pathname);
    if (!resolve) return;
    waiters.current.delete(pathname);
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }, [pathname]);

  const waitForPage = useCallback(
    (path: string) =>
      new Promise<void>((resolve) => {
        const done = () => {
          clearTimeout(timer);
          resolve();
        };
        const timer = setTimeout(() => {
          waiters.current.delete(path);
          resolve();
        }, 2500);
        waiters.current.set(path, done);
      }),
    [],
  );

  const navigate = useCallback(
    async (href: string) => {
      const target = new URL(href, location.href);
      if (busy.current || target.pathname === location.pathname) {
        router.push(href);
        return;
      }
      busy.current = true;
      if (reduced) {
        router.push(href);
        busy.current = false;
        return;
      }
      begin();
      await to(1);
      const ready = waitForPage(target.pathname);
      router.push(href);
      await ready;
      await to(0);
      end();
      busy.current = false;
    },
    [begin, end, reduced, router, to, waitForPage],
  );

  const proxy = useCallback(() => stateRef.current, []);
  const api = useMemo<CurtainApi>(
    () => ({ begin, end, apply, to, proxy, navigate, waitForPage, reduced }),
    [begin, end, apply, to, proxy, navigate, waitForPage, reduced],
  );

  return (
    <CurtainContext.Provider value={api}>
      {children}
      <Curtain
        mode={active}
        tier={tier ?? 0}
        progressRef={progressRef}
        rendererRef={renderer}
        onShaderError={onShaderError}
      />
    </CurtainContext.Provider>
  );
}

export function useCurtain() {
  const ctx = useContext(CurtainContext);
  if (!ctx) throw new Error("useCurtain must be used inside <CurtainProvider>");
  return ctx;
}
