/**
 * AI tools (docs/plan/09-ai-era.md §1). `use` lines are drafts from the plan (`draft: true`) —
 * Niraj rewrites them in his own words. Logos resolve through asset(`brand.<slug>`); a missing
 * logo renders a monogram tile, never a redrawn mark.
 */

export type Stage = "research" | "plan" | "build" | "automate" | "review" | "ship";

export type Tool = {
  slug: "chatgpt" | "claude" | "antigravity" | "manus" | "cursor" | "google-ai-mode";
  name: string;
  maker: string;
  /** Two-letter monogram for the placeholder tile. */
  monogram: string;
  logoMono?: boolean;
  use: string;
  detail: string;
  stages: Stage[];
  url: string;
  draft: boolean;
};

export const tools: Tool[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    maker: "OpenAI",
    monogram: "CG",
    use: "Research, brainstorming, explaining unfamiliar APIs, first drafts of copy and docs",
    detail: "[[TBD: 2–3 lines on how Niraj uses ChatGPT]]",
    stages: [],
    url: "https://chatgpt.com",
    draft: true,
  },
  {
    slug: "claude",
    name: "Claude",
    maker: "Anthropic",
    monogram: "CL",
    use: "Long-context reasoning: specs, architecture reviews, refactor plans, code review; Claude Code in the terminal for multi-file changes",
    detail: "[[TBD: 2–3 lines on how Niraj uses Claude]]",
    stages: [],
    url: "https://claude.ai",
    draft: true,
  },
  {
    slug: "antigravity",
    name: "Antigravity",
    maker: "Google",
    monogram: "AG",
    use: "Agent-first IDE: hand off multi-step tasks across editor, terminal and browser, then review the agent's plans and screenshots",
    detail: "[[TBD: 2–3 lines on how Niraj uses Antigravity]]",
    stages: [],
    url: "https://antigravity.google",
    draft: true,
  },
  {
    slug: "manus",
    name: "Manus",
    maker: "Manus AI",
    monogram: "MA",
    use: "Autonomous agent for research-heavy, multi-step jobs — competitor scans, data gathering, report drafts",
    detail: "[[TBD: 2–3 lines on how Niraj uses Manus]]",
    stages: [],
    url: "https://manus.im",
    draft: true,
  },
  {
    slug: "cursor",
    name: "Cursor",
    maker: "Anysphere",
    monogram: "CU",
    use: "Day-to-day coding in existing codebases: inline edits, multi-file refactors, quick fixes",
    detail: "[[TBD: 2–3 lines on how Niraj uses Cursor]]",
    stages: [],
    url: "https://cursor.com",
    draft: true,
  },
  {
    slug: "google-ai-mode",
    name: "Google AI Mode",
    maker: "Google",
    monogram: "GA",
    use: "Fast, cited answers for docs, errors and “what changed in v-next” questions",
    detail: "[[TBD: 2–3 lines on how Niraj uses Google AI Mode]]",
    stages: [],
    url: "https://www.google.com/search?udm=50",
    draft: true,
  },
];

/** Secondary chips (from V1 skills). */
export const secondaryTools = ["Claude Code", "Codex", "Ollama", "LangChain", "RAG", "Generative AI"];
