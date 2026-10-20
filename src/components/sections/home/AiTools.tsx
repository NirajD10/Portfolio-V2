import { Section } from "@/components/layout/Section";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { secondaryTools, tools } from "@/content/tools";
import { asset } from "@/lib/assets";

/**
 * H4 · AI toolkit (04, 09 §2): six square tiles. Logos come from public/brand/ (official files only);
 * until a file exists the tile shows its two-letter monogram — never a redrawn logo. The "what I use
 * it for" line slides up on hover/focus, and is always shown on touch screens.
 */
export function AiTools() {
  return (
    <Section chip="03 / AI TOOLKIT" aria-labelledby="ai-title">
      <div className="grid-frame gap-y-10">
        <SplitHeading
          id="ai-title"
          lead="Six AI tools,"
          dim="open every workday."
          className="col-span-full lg:col-span-8"
        />
        <Reveal className="col-span-full lg:col-span-6">
          <p className="text-body-lg text-ink-muted">
            Not a gimmick — these are the tools I reach for to go from an idea to a shipped, tested product.
          </p>
        </Reveal>

        <Reveal
          as="ul"
          y={24}
          stagger={0.06}
          className="col-span-full grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6"
        >
          {tools.map((tool) => {
            const logo = asset(`brand.${tool.slug}`);
            return (
              <li key={tool.slug} data-reveal-item className="bg-bg">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/tile relative flex aspect-square flex-col items-center justify-center gap-4 overflow-hidden bg-surface-2 p-4 outline-offset-[-2px] transition-colors hover:bg-surface"
                >
                  {/* Accent border on hover/focus (inset ring, no layout change) */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-200 group-hover/tile:border-accent group-focus-visible/tile:border-accent"
                  />
                  {logo.src ? (
                    // eslint-disable-next-line @next/next/no-img-element -- official SVG, monochrome via CSS
                    <img
                      src={logo.src}
                      alt=""
                      className="size-10 grayscale transition group-hover/tile:grayscale-0"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="grid size-12 place-items-center border border-line-strong font-mono text-sm text-ink transition-transform duration-500 ease-out group-hover/tile:scale-110"
                    >
                      {tool.monogram}
                    </span>
                  )}
                  <span className="type-label text-ink">{tool.name}</span>
                  <span className="sr-only">
                    {" "}
                    — {tool.use} (opens {tool.maker}’s site in a new tab)
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 translate-y-full bg-surface px-3 py-2 text-[12px] leading-snug text-ink-muted transition-transform duration-300 ease-out group-hover/tile:translate-y-0 group-focus-visible/tile:translate-y-0 [@media(hover:none)]:static [@media(hover:none)]:translate-y-0 [@media(hover:none)]:bg-transparent [@media(hover:none)]:p-0 [@media(hover:none)]:text-center"
                  >
                    {tool.use}
                  </span>
                </a>
              </li>
            );
          })}
        </Reveal>

        <div className="col-span-full flex flex-wrap items-center justify-between gap-6">
          <ul className="flex flex-wrap gap-2" aria-label="Also in the toolkit">
            {secondaryTools.map((name) => (
              <li key={name}>
                <Chip>{name}</Chip>
              </li>
            ))}
          </ul>
          <ArrowLink href="/ai">See how I work with AI</ArrowLink>
        </div>
      </div>
    </Section>
  );
}
