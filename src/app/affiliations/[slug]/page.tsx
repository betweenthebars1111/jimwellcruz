import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailShell from "@/components/DetailShell";
import { affiliations, getAffiliation } from "@/lib/content";

export function generateStaticParams() {
  return affiliations.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getAffiliation(slug);
  return { title: a ? a.org.toLowerCase() : "affiliation" };
}

export default async function AffiliationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getAffiliation(slug);
  if (!a) notFound();
  return (
    <DetailShell
      backHref="/#affiliations"
      backLabel="affiliations"
      kicker={`affiliation — ${a.start}—${a.end}`}
      title={a.org.toLowerCase()}
      meta={[
        { label: "role", value: a.role },
        { label: "period", value: `${a.start}—${a.end}` },
      ]}
      links={a.url ? [{ label: "website", url: a.url }] : []}
      body={a.body}
    />
  );
}
