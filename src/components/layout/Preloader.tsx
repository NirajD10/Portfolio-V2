"use client";

import { useRef } from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { ease } from "@/lib/motion";

const KEY = "nd:preloaded";
const MAX_RPM = 9000;
const MIN_TIME = 0.9; // s — never a blink
const MAX_TIME = 1.5; // s — never a wait (04 · Preloader)
// Tachometer arc: 240° sweep, needle −120° (0 RPM) → +120° (9000 RPM).
const SWEEP = 240;
const R = 88;

function arc(fromDeg: number, toDeg: number, r = R) {
  const p = (deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${100 + r * Math.cos(a)} ${100 + r * Math.sin(a)}`;
  };
  return `M ${p(fromDeg)} A ${r} ${r} 0 ${toDeg - fromDeg > 180 ? 1 : 0} 1 ${p(toDeg)}`;
}

/**
 * First-visit preloader (04 · Global chrome): a rev counter instead of a progress bar. The needle and
 * the `0000 → 9000 RPM` readout follow real loading (fonts + window load), capped at 1.5 s; at the
 * red line an ignition streak runs across and the page is handed over. Skipped for the rest of the
 * session (sessionStorage, applied before paint by the boot script); reduced motion = 300 ms fade.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const { reduced } = useReducedMotionPref();

  useGSAP(
    () => {
      const el = root.current!;
      if (document.documentElement.classList.contains("preloaded")) {
        markIntroDone();
        return;
      }
      const finish = () => {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
        document.documentElement.classList.add("preloaded");
        el.style.display = "none";
      };

      if (reduced) {
        gsap.to(el, { opacity: 0, duration: 0.3, delay: 0.1, onStart: markIntroDone, onComplete: finish });
        return;
      }

      const q = gsap.utils.selector(el);
      const needle = q("[data-needle]")[0];
      const readout = q("[data-rpm]")[0];
      const state = { rpm: 0 };
      const render = () => {
        gsap.set(needle, { rotate: -SWEEP / 2 + (state.rpm / MAX_RPM) * SWEEP });
        readout.textContent = String(Math.round(state.rpm)).padStart(4, "0");
      };

      // Loading progress: fonts = 60%, window load = 100%; the rev chases it.
      let target = 0.15;
      const loaded = () => document.readyState === "complete";
      document.fonts?.ready.then(() => (target = Math.max(target, 0.6)));
      if (loaded()) target = 1;
      else window.addEventListener("load", () => (target = 1), { once: true });

      const start = performance.now();
      const chase = () => {
        const t = (performance.now() - start) / 1000;
        const goal = t >= MAX_TIME - 0.45 ? 1 : Math.min(target, t / MIN_TIME);
        state.rpm += (goal * MAX_RPM - state.rpm) * 0.18;
        render();
        if (goal >= 1 && state.rpm > MAX_RPM * 0.985) {
          gsap.ticker.remove(chase);
          ignite();
        }
      };
      gsap.ticker.add(chase);

      const ignite = () =>
        gsap
          .timeline({ onComplete: finish })
          .to(state, { rpm: MAX_RPM * 1.06, duration: 0.08, ease: "power2.out", onUpdate: render })
          .to(state, { rpm: MAX_RPM, duration: 0.12, ease: "power2.in", onUpdate: render })
          .fromTo(q("[data-streak]"), { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: ease.out }, "<")
          .to(el, { opacity: 0, duration: 0.25, ease: "none", onStart: markIntroDone }, ">-0.05");

      return () => gsap.ticker.remove(chase);
    },
    { scope: root },
  );

  const redFrom = -SWEEP / 2 + SWEEP * 0.85;
  return (
    <div
      ref={root}
      aria-hidden
      className="preloader fixed inset-0 z-[60] grid place-items-center bg-bg text-ink"
    >
      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 200 200" className="size-48" fill="none">
          <path d={arc(-SWEEP / 2, redFrom)} className="stroke-line-strong" strokeWidth="1.5" />
          <path d={arc(redFrom, SWEEP / 2)} className="stroke-magenta-400" strokeWidth="3" />
          {Array.from({ length: 10 }, (_, i) => {
            const deg = -SWEEP / 2 + (SWEEP / 9) * i;
            return (
              <path
                key={i}
                d={arc(deg - 0.6, deg + 0.6, R - 8)}
                className="stroke-ink-muted"
                strokeWidth="8"
              />
            );
          })}
          <g data-needle style={{ transformOrigin: "100px 100px", transform: `rotate(${-SWEEP / 2}deg)` }}>
            <line x1="100" y1="100" x2="100" y2="22" className="stroke-accent" strokeWidth="2" />
          </g>
          <circle cx="100" cy="100" r="4" className="fill-accent" />
        </svg>
        <p className="type-label text-ink-muted">
          <span data-rpm className="text-ink tabular-nums">
            0000
          </span>{" "}
          RPM
        </p>
      </div>
      <span
        data-streak
        className="absolute inset-x-0 top-1/2 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent"
      />
    </div>
  );
}
