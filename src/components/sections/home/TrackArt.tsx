import type { Track } from "@/content/tracks";

/**
 * Isometric line illustrations for the tracks (04 · H2): line-art with flat fills (02 §6).
 * Groups marked `data-part` float apart on hover. Decorative — hidden from assistive tech.
 */

const STROKE = { strokeWidth: 1.25, strokeLinejoin: "round" as const };

/** Isometric slab: a diamond top face with a short front edge. */
function Slab({
  x,
  y,
  w,
  depth = 10,
  fill = "fill-surface",
}: {
  x: number;
  y: number;
  w: number;
  depth?: number;
  fill?: string;
}) {
  const h = w / 2;
  return (
    <g>
      <path
        d={`M${x} ${y} l${w} ${h} l${-w} ${h} l${-w} ${-h}z`}
        className={`${fill} stroke-ink`}
        {...STROKE}
      />
      <path
        d={`M${x - w} ${y + h} v${depth} l${w} ${h} v${-depth} M${x + w} ${y + h} v${depth} l${-w} ${h}`}
        className="fill-surface-2 stroke-ink"
        {...STROKE}
      />
    </g>
  );
}

/** Upright isometric panel (a "screen") facing left-front. */
function Panel({
  x,
  y,
  w,
  h,
  fill = "fill-surface",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
}) {
  return (
    <path
      d={`M${x} ${y} l${w} ${w / 2} v${h} l${-w} ${-w / 2}z`}
      className={`${fill} stroke-ink`}
      {...STROKE}
    />
  );
}

export function TrackArt({ slug }: { slug: Track["slug"] }) {
  return (
    <svg viewBox="0 0 320 280" aria-hidden className="h-auto w-full max-w-[420px] text-ink" fill="none">
      {slug === "websites" && (
        <>
          <g data-part="base">
            <Slab x={160} y={130} w={110} />
          </g>
          <g data-part="back">
            <Panel x={70} y={40} w={150} h={90} fill="fill-surface-2" />
          </g>
          <g data-part="mid">
            <Panel x={85} y={62} w={110} h={70} />
            <path d="M97 80 l86 43 M97 92 l60 30" className="stroke-ink-muted" strokeWidth={1.25} />
          </g>
          <g data-part="front">
            <Panel x={100} y={96} w={60} h={34} fill="fill-accent-soft" />
            <path d="M112 112 l36 18" className="stroke-accent" strokeWidth={2} />
          </g>
        </>
      )}
      {slug === "web-apps" && (
        <>
          <g data-part="base">
            <Slab x={160} y={140} w={120} />
          </g>
          <g data-part="back">
            <Panel x={60} y={50} w={140} h={80} />
            <path
              d="M74 84 v28 M90 92 v28 M106 92 v36 M122 106 v28"
              className="stroke-accent"
              strokeWidth={6}
            />
          </g>
          <g data-part="front">
            <Panel x={205} y={40} w={34} h={70} fill="fill-accent-soft" />
            <path d="M212 60 l20 10 M212 72 l14 7" className="stroke-ink-muted" strokeWidth={1.25} />
          </g>
        </>
      )}
      {slug === "ai-products" && (
        <>
          <g data-part="base">
            <Slab x={160} y={120} w={70} depth={14} fill="fill-accent-soft" />
            <circle cx="160" cy="155" r="10" className="fill-accent" />
          </g>
          <g data-part="back" className="stroke-ink-muted" strokeWidth={1.25}>
            <path
              d="M160 155 L70 110 M160 155 L250 110 M160 155 L100 205 M160 155 L230 205"
              strokeDasharray="3 4"
            />
          </g>
          <g data-part="mid">
            <Slab x={70} y={92} w={22} depth={6} />
            <Slab x={250} y={92} w={22} depth={6} />
          </g>
          <g data-part="front">
            <Slab x={100} y={190} w={22} depth={6} />
            <Slab x={230} y={190} w={22} depth={6} />
          </g>
        </>
      )}
    </svg>
  );
}
