import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailShell from "@/components/DetailShell";
import { getProject, projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return { title: p ? p.title.toLowerCase() : "project" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  return (
    <DetailShell
      backHref="/#projects"
      backLabel="projects"
      kicker={`project — ${p.year} · ${p.status}`}
      title={p.title.toLowerCase()}
      meta={[
        { label: "year", value: p.year },
        { label: "status", value: p.status },
      ]}
      tags={p.tags}
      links={p.links}
      body={p.body}
      highlights={p.highlights}
    />
  );
}
