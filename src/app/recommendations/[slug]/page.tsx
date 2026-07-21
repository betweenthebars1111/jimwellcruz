import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailShell from "@/components/DetailShell";
import { getRecommendation, recommendations } from "@/lib/content";

export function generateStaticParams() {
  return recommendations.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getRecommendation(slug);
  return { title: r ? r.name.toLowerCase() : "recommendation" };
}

export default async function RecommendationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getRecommendation(slug);
  if (!r) notFound();
  return (
    <DetailShell
      backHref="/#recommendations"
      backLabel="recommendations"
      kicker={`recommendation — ${r.date}`}
      title={r.name.toLowerCase()}
      meta={[
        { label: "role", value: r.role },
        { label: "relation", value: r.relation },
      ]}
      quote={r.quote}
      body={r.body}
    />
  );
}
