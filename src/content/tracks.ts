/**
 * "What I build" tracks (docs/plan/04 · H2). Lines are drafts from the plan; stack chips come from
 * Niraj's V1 skills list; "since" years follow the experience dates (Innovhub 2021, Spellsys 2022,
 * Pure Tech Codex GenAI/RAG 2024).
 */

export type Track = {
  index: string;
  slug: "websites" | "web-apps" | "ai-products";
  title: string;
  since: string;
  line: string;
  stack: string[];
};

export const tracks: Track[] = [
  {
    index: "01",
    slug: "websites",
    title: "Websites",
    since: "2021",
    line: "Fast, accessible, SEO-ready marketing sites and storefronts — WordPress to Next.js.",
    stack: ["WordPress", "Next.js", "React", "Tailwind CSS"],
  },
  {
    index: "02",
    slug: "web-apps",
    title: "Web apps",
    since: "2022",
    line: "Full-stack products with auth, dashboards, APIs and databases — React, Next.js, Node, Fastify, Postgres.",
    stack: ["Next.js", "Node.js", "Fastify", "PostgreSQL"],
  },
  {
    index: "03",
    slug: "ai-products",
    title: "AI products",
    since: "2024",
    line: "RAG pipelines, Generative AI features and agents built into real apps — secure enough to pass VAPT.",
    stack: ["RAG", "Generative AI", "LangChain", "Ollama"],
  },
];
