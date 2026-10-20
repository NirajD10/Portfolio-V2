import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Stack rules from CLAUDE.md: one animation engine per job, one smooth-scroll library.
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "framer-motion", message: "Import from motion/react." },
            { name: "animejs", message: "Not allowed — use GSAP." },
            { name: "jquery", message: "Not allowed." },
            { name: "locomotive-scroll", message: "Lenis is the only smooth-scroll library." },
          ],
          patterns: [
            { group: ["gsap/ScrollSmoother"], message: "Lenis is the only smooth-scroll library." },
            { group: ["@mui/*", "@chakra-ui/*"], message: "No UI kits that ship their own design." },
          ],
        },
      ],
    },
  },
  {
    // Design tokens only in components: no raw hex colours.
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "Use a design token (bg-surface, text-ink, …) instead of a raw hex colour.",
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "Use a design token (bg-surface, text-ink, …) instead of a raw hex colour.",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
