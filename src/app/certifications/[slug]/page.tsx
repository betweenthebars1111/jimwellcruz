import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailShell from "@/components/DetailShell";
import { certifications, getCertification } from "@/lib/content";

export function generateStaticParams() {
  return certifications.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCertification(slug);
  return { title: c ? c.title.toLowerCase() : "certification" };
}

export default async function CertificationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCertification(slug);
  if (!c) notFound();
  const meta = [
    { label: "issuer", value: c.issuer },
    { label: "issued", value: c.date },
  ];
  if (c.credentialId)
    meta.push({ label: "credential id", value: c.credentialId });
  return (
    <DetailShell
      backHref="/#certifications"
      backLabel="certifications"
      kicker="certification"
      title={c.title.toLowerCase()}
      logo={c.logo}
      meta={meta}
      tags={c.tags}
      links={c.url ? [{ label: "verify credential", url: c.url }] : []}
      body={c.body}
    />
  );
}
