import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageStub } from "@/components/sections/PageStub";
import { caseStudies, getProject } from "@/content/work/registry";
import { t } from "@/lib/tbd";

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.oneLiner } : {};
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project || project.placement !== "case-study") notFound();
  return (
    <PageStub chip="CASE STUDY" lead={project.title} phase="Phase 7">
      <p className="text-body-lg text-ink-muted">{t(project.oneLiner)}</p>
    </PageStub>
  );
}
