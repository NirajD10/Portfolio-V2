"use client";

import dynamic from "next/dynamic";
import { useRef, type RefObject } from "react";
import { WebGLBoundary } from "@/components/webgl/WebGLBoundary";
import { gsap, useGSAP } from "@/lib/gsap";
import type { GpuTier } from "@/lib/gpu";
import type { CurtainMode } from "./CurtainProvider";

const MenuGlitch = dynamic(() => import("@/components/webgl/menu-glitch/MenuGlitch"), { ssr: false });

const STRIPS = 16;
// Hot colours for the CSS fallback (06 §4): purple-500, purple-300, magenta-400, blue-400, purple-50.
const HOT = ["bg-purple-500", "bg-purple-300", "bg-magenta-400", "bg-blue-400", "bg-purple-50"] as const;

type CurtainProps = {
  mode: CurtainMode | null;
  tier: GpuTier;
  progressRef: RefObject<number>;
  rendererRef: RefObject<{ set: (p: number, mode: CurtainMode) => void } | null>;
  /** The shader failed (no WebGL context, driver error): finish this run with the strips. */
  onShaderError: () => void;
};

/**
 * Renders the curtain. The CSS strips are always in the DOM (16 divs, hidden at 0) so a run can
 * start instantly; the shader canvas mounts only while a "shader" run is active.
 */
export function Curtain({ mode, tier, progressRef, rendererRef, onShaderError }: CurtainProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const strips = gsap.utils.toArray<HTMLElement>("[data-strip]", root.current);
      const hots = gsap.utils.toArray<HTMLElement>("[data-strip-hot]", root.current);
      const fade = root.current!.querySelector<HTMLElement>("[data-fade]")!;

      // Strip timeline (1s long, scrubbed by progress): each strip grows from the right at a
      // random moment, flashes its hot colour, then settles to the base colour.
      const tl = gsap.timeline({ paused: true });
      const starts = gsap.utils.shuffle(strips.map((_, i) => (i / (STRIPS - 1)) * 0.45));
      strips.forEach((strip, i) => {
        tl.fromTo(strip, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, starts[i]);
        tl.fromTo(hots[i], { opacity: 1 }, { opacity: 0, duration: 0.3, ease: "none" }, starts[i] + 0.25);
      });
      tl.set({}, {}, 1);

      rendererRef.current = {
        set(p, m) {
          root.current!.style.visibility = p > 0 ? "visible" : "hidden";
          root.current!.style.pointerEvents = p > 0 ? "auto" : "none";
          tl.progress(m === "strips" ? p : 0);
          fade.style.opacity = m === "fade" ? String(p) : "0";
        },
      };
      return () => {
        rendererRef.current = null;
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none invisible fixed inset-0 z-40">
      <div data-fade className="absolute inset-0 bg-menu-950 opacity-0" />
      <div className="absolute inset-0 flex flex-col">
        {Array.from({ length: STRIPS }, (_, i) => (
          <div key={i} data-strip className="relative flex-1 origin-right scale-x-0 bg-menu-950">
            <div data-strip-hot className={`absolute inset-0 ${HOT[(i * 7) % HOT.length]}`} />
          </div>
        ))}
      </div>
      {mode === "shader" && (
        <WebGLBoundary onError={onShaderError}>
          <MenuGlitch progressRef={progressRef} tier={tier} />
        </WebGLBoundary>
      )}
    </div>
  );
}
