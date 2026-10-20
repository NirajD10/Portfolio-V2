/**
 * Site-wide facts. Source: V1 (nirajdeshmukh.com, read 20 Oct 2026) + docs/plan/04-site-map-and-sections.md.
 * `[[TBD: …]]` marks values only Niraj can confirm — `pnpm assets:check` lists them.
 */

export const site = {
  name: "Niraj Deshmukh",
  firstName: "Niraj",
  wordmark: "niraj",
  url: "https://nirajdeshmukh.com",
  title: "Full-Stack Developer",
  role: "Software Developer",
  company: "Pure Tech Codex Pvt. Ltd.",
  location: {
    city: "Pune",
    country: "India",
    timeZoneLabel: "IST (UTC+5:30)",
    coords: "18.52°N 73.86°E",
  },
  email: "niraj.deshmukh1999@gmail.com",
  replyTime: "[[TBD: reply time — 24 hours?]]",
  availability: "Open to freelance",
  /** V1 tagline, verbatim. */
  tagline:
    "Passionate Indian Full Stack Developer. Enthusiastic about coding, always learning and staying updated with the latest technologies.",
  /** Draft hero copy — option 1 of 3 in 04 until Niraj picks. */
  hero: {
    title: ["I turn ideas into web apps", "and AI-powered products."],
    intro:
      "5+ years building with React, Next.js and Node.js — from e-commerce stores to Generative AI and RAG platforms. Software Developer at Pure Tech Codex, riding across Pune to work every morning.",
  },
  /** V1 About text, verbatim (Niraj's own words). */
  about: [
    "Born with hearing impairment. Passionate Full Stack Developer with expertise in JavaScript, ReactJS, NodeJS/ExpressJS. Experienced in developing web applications with a strong focus on user experience. Skilled in both front-end and back-end technologies, with a proven track record of successfully delivering projects.",
    "Proactive learner who stays updated with the latest advancements in web development. I have a bachelor’s degree in Computer science (B.sc. Computer sci.) having graduated from Sir Parashurambhau College (S.p. College), Pune in 2020.",
  ],
  education: {
    index: "E1",
    school: "Sir Parashurambhau College (S.P. College), Pune",
    degree: "B.Sc. Computer Science",
    year: "2020",
  },
  socials: {
    github: "https://github.com/NirajD10",
    /** V1 links two LinkedIn URLs (header: /in/niraj-deshmukh-340aa0167, footer: this one). */
    linkedin: "https://www.linkedin.com/in/niraj-deshmukh-nd10/",
  },
  /** V1 resume until public/resume/Niraj-Deshmukh-Resume.pdf exists (asset `file.resume`). */
  resumeFallback: "https://nirajdeshmukh.com/Niraj's%20Resume.pdf",
  v1: { label: "V1 (2023)", url: "[[TBD: V1 archive URL — v1.nirajdeshmukh.com?]]" },
  copyrightYear: 2026,
  /** Content freshness date (ISO month) — shown on /facts and used for "years since" maths. */
  contentAsOf: "2026-10",
} as const;

export const nav = [
  { index: "01", label: "Home", href: "/" },
  { index: "02", label: "Work", href: "/work" },
  { index: "03", label: "AI Era", href: "/ai" },
  { index: "04", label: "About", href: "/about" },
  { index: "05", label: "Contact", href: "/contact" },
] as const;
