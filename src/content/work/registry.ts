/**
 * Work registry (docs/plan/03-architecture.md §6, 10-case-studies.md, 13 §2.2).
 * Seeded from V1 project cards and experience text. Images resolve through asset(id).
 * MDX bodies (`Body`) are added in Phase 7.
 */

import type { ImageAssetId } from "../assets";
import type { ProjectSlug } from "./slugs";

export type Tag = "AI" | "Web app" | "Website" | "E-commerce" | "Product";

export type Project = {
  slug: ProjectSlug;
  title: string;
  oneLiner: string;
  tags: Tag[];
  role: string;
  stack: string[];
  year: string;
  company?: string;
  links?: { live?: string; code?: string };
  nda?: boolean;
  /** "case-study" → /work/[slug]; "archive" → one row on /work. */
  placement: "case-study" | "archive";
  /** Shown in the Work reel (Grainy Carousel). */
  inReel: boolean;
  cover?: ImageAssetId;
  hero?: ImageAssetId;
  summary: string;
  /** Case-study summary card on /work (Problem / Role / Stack / Outcome). */
  problem: string;
  outcome: string;
  metrics?: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "genai-rag-platform",
    title: "GenAI / RAG platform",
    oneLiner: "Generative AI and Retrieval-Augmented Generation (RAG) based solutions at Pure Tech Codex.",
    tags: ["AI", "Web app"],
    role: "Software Developer",
    stack: ["React", "Next.js", "Node.js", "Fastify", "TypeScript", "RAG"],
    year: "[[TBD: year]]",
    company: "Pure Tech Codex Pvt. Ltd.",
    nda: true,
    placement: "case-study",
    inReel: true,
    cover: "work.genai-rag-platform.cover",
    hero: "work.genai-rag-platform.hero",
    summary: "[[TBD: NDA-safe summary — problem, architecture, Niraj's role]]",
    problem: "[[TBD: problem]]",
    outcome: "[[TBD: outcome]]",
  },
  {
    slug: "a3dxyz-spare3d",
    title: "A3DXYZ & Spare3D",
    oneLiner: "3D-printer brand sites and spare-parts e-commerce, built and run at Innovhub.",
    tags: ["Website", "E-commerce"],
    role: "Former Director",
    stack: ["WordPress", "React"],
    year: "[[TBD: year]]",
    company: "Innovhub Systems Pvt. Ltd.",
    links: { live: "[[TBD: live URLs]]" },
    placement: "case-study",
    inReel: true,
    cover: "work.a3dxyz-spare3d.cover",
    hero: "work.a3dxyz-spare3d.hero",
    summary:
      "Developed and maintained (Wordpress and ReactJS) for A3DXYZ and Spare3D Website. Managed ecommerce operations for 3D printer spare parts.",
    problem: "[[TBD: problem]]",
    outcome: "[[TBD: outcome]]",
  },
  {
    slug: "pureplantparadise",
    title: "PurePlantParadise",
    oneLiner: "An indoor-plants e-commerce store built on the MERN stack.",
    tags: ["E-commerce", "Web app"],
    role: "[[TBD: role]]",
    stack: ["React", "Express.js", "Node.js", "MongoDB", "Tailwind CSS", "Firebase"],
    year: "[[TBD: year]]",
    links: {
      live: "https://pureplantparadise.netlify.app/",
      code: "https://github.com/NirajD10/pureplantparadise",
    },
    placement: "case-study",
    inReel: true,
    cover: "work.pureplantparadise.cover",
    hero: "work.pureplantparadise.hero",
    summary:
      "Welcome to PurePlantParadise – your premier online destination for indoor plants powered by advanced MERN Stack technology for a seamless shopping experience.",
    problem: "[[TBD: problem]]",
    outcome: "[[TBD: outcome]]",
  },
  {
    slug: "portfolio-v2",
    title: "This site",
    oneLiner: "Portfolio V2 — the Pune ride, built with Next.js, GSAP and Three.js.",
    tags: ["Website", "AI"],
    role: "Design & development",
    stack: ["Next.js", "GSAP", "Three.js"],
    year: "2026",
    links: { code: "https://github.com/NirajD10/Portfolio-V2" },
    placement: "case-study",
    inReel: true,
    cover: "work.portfolio-v2.cover",
    hero: "work.portfolio-v2.hero",
    summary: "[[TBD: written in Phase 10 from the build itself]]",
    problem: "[[TBD: problem]]",
    outcome: "[[TBD: outcome]]",
  },
  {
    slug: "fitness-landing",
    title: "Fitness Landing Page",
    oneLiner: "The Fitness Landing Page is a web application designed to fitness business website.",
    tags: ["Website"],
    role: "[[TBD: role]]",
    stack: ["React", "Framer Motion", "CSS"],
    year: "[[TBD: year]]",
    links: {
      live: "https://fitness-lp.netlify.app/",
      code: "https://github.com/NirajD10/Fitness-Landing-Page",
    },
    placement: "archive",
    inReel: true,
    cover: "work.fitness-landing.cover",
    summary: "The Fitness Landing Page is a web application designed to fitness business website.",
    problem: "[[TBD: problem]]",
    outcome: "[[TBD: outcome]]",
  },
  {
    slug: "weathtemp",
    title: "WeathTemp",
    oneLiner: "WeathTemp is weather temperature website searched based by city or location.",
    tags: ["Web app"],
    role: "[[TBD: role]]",
    stack: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
    year: "[[TBD: year]]",
    links: {
      live: "https://nirajd10.github.io/WeathTemp/",
      code: "https://github.com/NirajD10/WeathTemp",
    },
    placement: "archive",
    inReel: true,
    cover: "work.weathtemp.cover",
    summary: "WeathTemp is weather temperature website searched based by city or location.",
    problem: "[[TBD: problem]]",
    outcome: "[[TBD: outcome]]",
  },
  {
    slug: "portfolio-v1",
    title: "Portfolio V1",
    oneLiner:
      "Welcome to my portfolio website! It's a showcase of my work and skills as a Full Stack Developer.",
    tags: ["Website"],
    role: "Design & development",
    stack: ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
    year: "2023",
    links: { live: "https://nirajdeshmukh.com/", code: "https://github.com/NirajD10/portfolio" },
    placement: "archive",
    inReel: false,
    summary:
      "Welcome to my portfolio website! It's a showcase of my work and skills as a Full Stack Developer.",
    problem: "[[TBD: problem]]",
    outcome: "[[TBD: outcome]]",
  },
];

export const caseStudies = projects.filter((p) => p.placement === "case-study");
export const archive = projects.filter((p) => p.placement === "archive");

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
