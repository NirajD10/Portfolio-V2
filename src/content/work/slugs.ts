/** Project slugs (docs/plan/13-asset-placeholders.md §2.2). Shared by the registry and the asset manifest. */

/** Full case studies: every image slot (cover, hero, 6 desktop + 4 mobile screens). */
export const caseStudySlugs = [
  "pureplantparadise",
  "genai-rag-platform",
  "a3dxyz-spare3d",
  "portfolio-v2",
] as const;

/** Archive rows that also appear in the Work reel: cover only. */
export const reelArchiveSlugs = ["fitness-landing", "weathtemp"] as const;

/** Archive rows with no images. */
export const plainArchiveSlugs = ["portfolio-v1"] as const;

export const projectSlugs = [...caseStudySlugs, ...reelArchiveSlugs, ...plainArchiveSlugs] as const;

export type CaseStudySlug = (typeof caseStudySlugs)[number];
export type ReelArchiveSlug = (typeof reelArchiveSlugs)[number];
export type ProjectSlug = (typeof projectSlugs)[number];
