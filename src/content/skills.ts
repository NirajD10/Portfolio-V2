/** Skills — V1 groups and items (34), verbatim names normalised for display. */

export type SkillGroup = { group: string; items: string[] };

export const skills: SkillGroup[] = [
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Tailwind CSS"] },
  { group: "Frameworks & libraries", items: ["Next.js", "Framer Motion", "EJS"] },
  { group: "Backend", items: ["Node.js", "Express.js", "Fastify", "Firebase"] },
  {
    group: "Databases",
    items: ["PostgreSQL", "Prisma", "Drizzle", "MySQL", "MongoDB", "Mongoose", "Sequelize"],
  },
  { group: "AI", items: ["Claude Code", "Codex", "Ollama", "RAG", "Generative AI", "LangChain"] },
  { group: "Deployment", items: ["AWS EC2", "Jenkins", "Docker", "AWS S3", "AWS SNS"] },
  { group: "Version control", items: ["Git"] },
  { group: "Design", items: ["Figma", "Photoshop"] },
];

export const skillCount = skills.reduce((n, g) => n + g.items.length, 0);
