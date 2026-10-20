/** Experience — V1 text, verbatim (nirajdeshmukh.com, read 20 Oct 2026). Newest first. */

export type Experience = {
  index: string;
  company: string;
  role: string;
  /** ISO month, for sorting and the About timeline. */
  start: string;
  end: string | null;
  /** As shown on V1. */
  dates: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    index: "A1",
    company: "Pure Tech Codex Pvt. Ltd.",
    role: "Software Developer",
    start: "2024-11",
    end: null,
    dates: "Nov 2024 – Present",
    bullets: [
      "Developed scalable web applications using React.js, Next.js, Tailwind CSS, ShadCN, Node.js, Fastify, and TypeScript.",
      "Worked on Generative AI and Retrieval-Augmented Generation (RAG) based solutions.",
      "Contributed to secure applications that successfully passed high-level VAPT security testing.",
    ],
  },
  {
    index: "A2",
    company: "Osumare Marketing Solutions",
    role: "Full Stack Developer – Intern",
    start: "2024-07",
    end: "2024-11",
    dates: "Jul 2024 – Nov 2024",
    bullets: [
      "Actively working on projects using the MERN stack (MongoDB, Express.js, React, Node.js) with TailwindCSS for styling and UI design.",
      "Collaborating with the team through GitHub for version control, code reviews, and seamless project management.",
      "Lead and manage team projects, with practical knowledge of Scrum methodologies.",
      "Experience in deployment using AWS EC2, S3, Docker, and Jenkins.",
      "Basic knowledge of React Native for mobile app development.",
    ],
  },
  {
    index: "A3",
    company: "Spellsys Technologies",
    role: "Full Stack Developer",
    start: "2022-02",
    end: "2023-02",
    dates: "Feb 2022 – Feb 2023",
    bullets: [
      "Developed Website by using JS, ReactJS, Nodejs/Express JS, and MySQL/PostgresSQL, PHP.",
      "I increased website traffic by 30% through search engine optimization efforts and developed attractive website using Wordpress.",
    ],
  },
  {
    index: "A4",
    company: "Innovhub Systems Pvt. Ltd.",
    role: "Former Director",
    start: "2021-09",
    end: "2023-10",
    dates: "Sep 2021 – Oct 2023",
    bullets: [
      "Successfully led research and development as well as operation and assembly processes efforts, resulting in the development of innovative prototypes for 3D Printer Machine.",
      "Developed and maintained (Wordpress and ReactJS) for A3DXYZ and Spare3D Website.",
      "Managed ecommerce operations for 3D printer spare parts, resulting in increased sales and customer satisfaction. Developed and implemented effective inventory management strategies, resulting in improved stock control and reduced costs.",
    ],
  },
];

/** First professional month — the "since 2021" anchor for years-of-experience copy. */
export const careerStart = "2021-09";
