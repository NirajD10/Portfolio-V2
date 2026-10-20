import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { clash } from "./clash.generated";

/**
 * Font variables for <html>: Geist (--font-geist-sans), Geist Mono (--font-geist-mono) and
 * Clash Grotesk (--font-clash). When the Clash file is missing, clash.generated.ts exports an empty
 * class and --font-display falls back to Geist (see tokens.css).
 */
export const fontVariables = [GeistSans.variable, GeistMono.variable, clash.variable]
  .filter(Boolean)
  .join(" ");
