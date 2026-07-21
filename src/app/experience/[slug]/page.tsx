import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailShell from "@/components/DetailShell";
import { experience, getExperience } from "@/lib/content";

export function generateStaticParams() {
  return experience.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = getExperience(slug);
  return {
    title: e
      ? `${e.role.toLowerCase()} — ${e.company.toLowerCase()}`
      : "experience",
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getExperience(slug);
  if (!e) notFound();
  return (
    <DetailShell
      backHref="/#experience"
      backLabel="experience"
      kicker={`experience — ${e.start}—${e.end}`}
      title={e.role.toLowerCase()}
      meta={[
        { label: "company", value: e.company },
        { label: "location", value: e.location },
        { label: "period", value: `${e.start}—${e.end}` },
      ]}
      tags={e.tags}
      body={e.body}
      highlights={e.highlights}
    />
  );
}
