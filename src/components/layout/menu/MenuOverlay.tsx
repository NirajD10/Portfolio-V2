"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { useReducedMotionPref } from "@/components/providers/MotionProvider";
import { useCurtain } from "@/components/transition/CurtainProvider";
import { useGpuTier } from "@/components/webgl/useGpuTier";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { dur, ease, reducedFade } from "@/lib/motion";
import { menuItems } from "./items";
import { MenuHudBottom, MenuHudTop } from "./MenuHud";
import { useMenu } from "./MenuProvider";

const GLYPHS = "▖▘▝▗▚▞░▒";
const CLOSE_SPEED = 1.35;
/** Rest positions of the four vertical grid lines (fraction of the width). */
const GRID = [0.12, 0.37, 0.62, 0.86];

/**
 * Cinematic menu overlay (docs/plan/06). One paused GSAP timeline per mount: open = play(),
 * close = reverse() at 1.35×. The block wave is the shared curtain (CurtainProvider) so the same
 * wave doubles as the page transition when an item is picked.
 */
export function MenuOverlay() {
  const { isOpen, setOpen, triggerRef } = useMenu();
  const curtain = useCurtain();
  const { reduced } = useReducedMotionPref();
  const tier = useGpuTier();
  const pathname = usePathname();
  const router = useRouter();

  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const navigating = useRef(false);
  /** The focus we move in after opening isn't a user choice — don't dim the other items for it. */
  const quietFocus = useRef(false);
  const movers = useRef<{
    top: (value: number) => void;
    bottom: (value: number) => void;
    lines: ((value: number) => void)[];
  }>(null);

  const setBackgroundInert = (inert: boolean) => {
    document.getElementById("site-root")?.toggleAttribute("inert", inert);
  };

  const items = () => gsap.utils.toArray<HTMLLIElement>("[data-item]", root.current);

  /** Guide lines + vertical line follow the given item (or rest when null). */
  const track = useCallback(
    (index: number | null) => {
      const m = movers.current;
      const lis = items();
      if (!m || !lis.length || !root.current) return;
      const box = root.current.getBoundingClientRect();
      const width = box.width;

      lis.forEach((li, j) => {
        li.dataset.state = index === null ? "idle" : j === index ? "active" : "dim";
      });

      if (index === null) {
        m.top(lis[0].getBoundingClientRect().top - box.top - 10);
        m.bottom(lis[lis.length - 1].getBoundingClientRect().bottom - box.top + 10);
        GRID.forEach((x, k) => m.lines[k](x * width));
        return;
      }

      const li = lis[index];
      const r = li.getBoundingClientRect();
      m.top(r.top - box.top - 10);
      m.bottom(r.bottom - box.top + 10);

      // The nearest vertical line slides to the index column.
      const indexEl = li.querySelector<HTMLElement>("[data-index]")!;
      const ix = indexEl.getBoundingClientRect().left - box.left - 12;
      let nearest = 0;
      GRID.forEach((x, k) => {
        if (Math.abs(x * width - ix) < Math.abs(GRID[nearest] * width - ix)) nearest = k;
      });
      GRID.forEach((x, k) => m.lines[k](k === nearest ? ix : x * width));

      if (!reduced) {
        const word = li.querySelector<HTMLElement>("[data-word]")!;
        gsap.fromTo(word, { "--split": "2px" }, { "--split": "0px", duration: 2 / 60, ease: "steps(1)" });
        const sub = li.querySelector<HTMLElement>("[data-sub]")!;
        gsap.to(sub, { duration: 0.3, scrambleText: { text: sub.dataset.text!, chars: GLYPHS, speed: 1 } });
      }
    },
    [reduced],
  );

  // ── Guide lines + timeline ─────────────────────────────────────────────────
  // Guide-line movers (06 §5). Built once: a dependency here would revert the whole context —
  // including a menu that is mid-open — when the reduced-motion preference resolves.
  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mover = (el: Element, prop: "x" | "y") => {
        const to = gsap.quickTo(el, prop, { duration: 0.45, ease: ease.out });
        // Reduced motion: guide lines jump without easing (06 §6).
        return (value: number) =>
          document.documentElement.dataset.motion === "reduce" ? gsap.set(el, { [prop]: value }) : to(value);
      };
      movers.current = {
        top: mover(q("[data-guide=top]")[0], "y"),
        bottom: mover(q("[data-guide=bottom]")[0], "y"),
        lines: q("[data-gridline]").map((el) => mover(el, "x")),
      };
    },
    { scope: root },
  );

  // Built fresh each time the menu opens from closed, so it always reflects the current reduced-
  // motion setting and GPU tier (the tier resolves on idle and may arrive after the first open).
  const buildTimeline = () => {
    const q = gsap.utils.selector(root);
    const words = q("[data-word]");
    const proxy = curtain.proxy();
    const applyCurtain = () => curtain.apply(proxy.p);
    // Visibility is set directly on open/close (not in the timeline): pause(0) after a route
    // change must leave the overlay hidden.
    const t = gsap.timeline({ paused: true });

    if (reduced) {
      // 06 §6: no wave, no scramble, no RGB split, no push-back — a 200 ms fade, items together.
      t.fromTo(proxy, { p: 0 }, { p: 1, duration: reducedFade, ease: "none", onUpdate: applyCurtain }, 0);
      t.fromTo(
        q("[data-word], [data-index], [data-hud], [data-gridline], [data-guide]"),
        { opacity: 0 },
        { opacity: 1, duration: reducedFade, ease: "none" },
        0,
      );
    } else {
      t.fromTo(proxy, { p: 0 }, { p: 1, duration: dur.long, ease: ease.inOut, onUpdate: applyCurtain }, 0);

      const main = document.getElementById("main");
      if (main && (tier ?? 0) >= 2 && innerWidth >= 768) {
        t.fromTo(
          main,
          { scale: 1 },
          { scale: 0.985, duration: 0.7, ease: ease.out, transformOrigin: "50% 30%" },
          0.1,
        );
      }

      words.forEach((word, i) => {
        const at = 0.4 + i * 0.07;
        t.fromTo(
          word,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: ease.out,
            scrambleText: { text: word.dataset.text!, chars: GLYPHS, speed: 0.8 },
          },
          at,
        );
        t.fromTo(word, { "--split": "2px" }, { "--split": "0px", duration: 0.35, ease: "none" }, at);
      });
      t.fromTo(q("[data-index]"), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.07 }, 0.55);
      t.fromTo(
        q("[data-hud]"),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: ease.out },
        0.7,
      );
      t.fromTo(
        q("[data-gridline]"),
        { scaleY: 0 },
        { scaleY: 1, duration: 0.5, ease: ease.out, transformOrigin: "top" },
        0.7,
      );
      t.fromTo(q("[data-guide]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.9);
    }

    // Focus the current page's item (or the first) once everything is in.
    t.eventCallback("onComplete", () => {
      const current = root.current?.querySelector<HTMLElement>("a[aria-current='page']");
      (current ?? root.current?.querySelector<HTMLElement>("[data-item] a"))?.focus({ preventScroll: true });
    });
    // Fully closed: hand the page back.
    t.eventCallback("onReverseComplete", () => {
      gsap.set(root.current, { visibility: "hidden" });
      curtain.end();
      setBackgroundInert(false);
      getLenis()?.start();
      triggerRef.current?.focus({ preventScroll: true });
    });

    return t;
  };

  // ── Open / close ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && (!tl.current || tl.current.progress() === 0)) {
      tl.current?.kill();
      // contextSafe: tweens join the useGSAP context and are reverted on unmount.
      tl.current = contextSafe(buildTimeline)();
    }
    const t = tl.current;
    if (!t) return;
    if (isOpen) {
      getLenis()?.stop();
      setBackgroundInert(true);
      gsap.set(root.current, { visibility: "visible" });
      root.current?.focus({ preventScroll: true });
      if (t.progress() === 0) curtain.begin();
      t.timeScale(1).play();
      requestAnimationFrame(() => track(null));
    } else if (!navigating.current && t.progress() > 0) {
      t.timeScale(CLOSE_SPEED).reverse();
    }
    // curtain/track are stable for a given render; re-running on them would replay the menu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Keep guide lines in place when the viewport changes while open.
  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => track(null);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen, track]);

  // ── Selecting an item (06 §3) ──────────────────────────────────────────────
  async function select(e: MouseEvent<HTMLAnchorElement>, href: string, index: number) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const t = tl.current;
    if (!t || navigating.current) return;

    const lis = items();
    lis.forEach((li, j) => (li.dataset.state = j === index ? "active" : "gone"));
    if (!reduced) {
      const word = lis[index].querySelector<HTMLElement>("[data-word]")!;
      gsap
        .timeline()
        .fromTo(word, { "--split": "4px" }, { "--split": "0px", duration: 1 / 60, ease: "steps(1)" })
        .to(
          word,
          { color: "var(--color-accent-text)", duration: 0.09, yoyo: true, repeat: 1, clearProps: "color" },
          0,
        );
    }

    // Same page: close, then scroll to the top 60% of the way through the close.
    if (href === pathname) {
      setOpen(false);
      gsap.delayedCall((t.time() / CLOSE_SPEED) * 0.6, () => {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { duration: 1.2, force: true });
        else window.scrollTo({ top: 0 });
      });
      return;
    }

    // Different route: finish covering, swap the page behind the curtain, then wave it away.
    navigating.current = true;
    if (t.progress() < 1)
      await t
        .timeScale(reduced ? 1 : 1.5)
        .play()
        .then();
    // Items, HUD and grid lines leave first so only the wave sits over the new page.
    const content = root.current!.querySelectorAll("[data-menu-content], [data-menu-lines]");
    await gsap.to(content, { opacity: 0, duration: reduced ? 0 : 0.25 }).then();

    const ready = curtain.waitForPage(href);
    router.push(href);
    await ready;

    setOpen(false);
    gsap.set("#main", { clearProps: "scale,transformOrigin" });
    await curtain.to(
      0,
      reduced ? { duration: reducedFade, ease: "none" } : { duration: dur.long, ease: ease.inOut },
    );

    t.pause(0);
    gsap.set(root.current, { visibility: "hidden" });
    gsap.set(content, { clearProps: "opacity" });
    track(null);
    curtain.end();
    setBackgroundInert(false);
    getLenis()?.start();
    document.getElementById("main")?.focus({ preventScroll: true });
    navigating.current = false;
  }

  // ── Keyboard: Esc closes, Tab is trapped ───────────────────────────────────
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      if (!navigating.current) setOpen(false);
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = Array.from(
      root.current!.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === root.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Clicking empty overlay space closes.
  function onClick(e: MouseEvent<HTMLDivElement>) {
    if (navigating.current) return;
    if (!(e.target as Element).closest("a, button, [data-hud]")) setOpen(false);
  }

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onClick={onClick}
      className="invisible fixed inset-0 z-50 text-menu-ink outline-none"
    >
      {/* Grid + guide lines (decorative) */}
      <div data-menu-lines aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {GRID.map((_, k) => (
          <span key={k} data-gridline className="absolute inset-y-0 left-0 w-px bg-menu-line" />
        ))}
        <span data-guide="top" className="absolute inset-x-0 top-0 h-px bg-menu-line" />
        <span data-guide="bottom" className="absolute inset-x-0 top-0 h-px bg-menu-line" />
      </div>

      <div data-menu-content className="relative flex h-full flex-col">
        <MenuHudTop onClose={() => setOpen(false)} />

        <nav aria-label="Primary" className="frame-col flex flex-1 items-center px-frame-pad">
          <ol ref={list} className="w-full" onMouseLeave={() => track(null)}>
            {menuItems.map((item, i) => {
              const current = item.href === pathname;
              return (
                <li
                  key={item.href}
                  data-item
                  data-state="idle"
                  data-current={current || undefined}
                  className="group/item transition-opacity duration-300 data-[state=gone]:opacity-15"
                >
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    aria-current={current ? "page" : undefined}
                    onClick={(e) => select(e, item.href, i)}
                    onMouseEnter={() => track(i)}
                    onFocus={() => {
                      if (quietFocus.current) quietFocus.current = false;
                      else track(i);
                    }}
                    onPointerDown={(e) => e.pointerType === "touch" && track(i)}
                    className="flex min-h-12 items-center justify-center gap-4 py-1 md:gap-12 lg:pr-[4%]"
                  >
                    <span
                      aria-hidden
                      className="origin-center text-menu-idle transition-[color,scale] duration-300 ease-out group-data-[state=active]/item:scale-x-[1.03] group-data-[state=active]/item:text-menu-ink group-data-[state=dim]/item:text-menu-dim group-data-[current]/item:group-data-[state=idle]/item:text-menu-ink md:flex-1 md:origin-right md:text-right"
                    >
                      <span
                        data-word
                        data-text={item.label.toUpperCase()}
                        className="inline-block font-display text-menu-item uppercase [--split:0px] [text-shadow:calc(var(--split)*-1)_0_var(--color-magenta-400),var(--split)_0_var(--color-blue-400)] max-md:text-[clamp(2rem,9vw,3rem)] max-md:tracking-[0.18em] md:-mr-[0.28em]"
                      >
                        {item.label.toUpperCase()}
                      </span>
                    </span>
                    <span aria-hidden className="relative w-12 shrink-0 md:w-48">
                      <span data-index className="flex items-center gap-1.5 type-index text-accent-text">
                        <span className="-translate-x-2 opacity-0 transition-[translate,opacity] duration-300 group-data-[state=active]/item:translate-x-0 group-data-[state=active]/item:opacity-100">
                          →
                        </span>
                        {current && <span>●</span>}
                        {item.index}
                      </span>
                      <span
                        data-sub
                        data-text={item.sub.toUpperCase()}
                        className="absolute top-full left-0 mt-2 type-label text-[11px] whitespace-nowrap text-menu-muted opacity-0 transition-opacity duration-200 group-data-[state=active]/item:opacity-100 max-md:hidden"
                      >
                        {item.sub.toUpperCase()}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <MenuHudBottom />
      </div>
    </div>
  );
}
