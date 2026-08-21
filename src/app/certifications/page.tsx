import type { Metadata } from "next";
import Link from "next/link";
import CertificationCard from "@/components/CertificationCard";
import { certifications, type Certification } from "@/lib/content";

export const metadata: Metadata = {
  title: "certifications",
  description: "Every credential, grouped by discipline.",
};

/** Preferred display order. Anything else still shows, appended after these. */
const categoryOrder = ["Cloud & DevOps", "AI & Machine Learning", "IT & Security"];

function groupByCategory(items: Certification[]) {
  const groups = new Map<string, Certification[]>(
    categoryOrder.map((name) => [name, []])
  );

  for (const item of items) {
    const name = item.category?.trim() || "Other";
    const group = groups.get(name);
    if (group) group.push(item);
    else groups.set(name, [item]);
  }

  return [...groups].filter(([, group]) => group.length > 0);
}

export default function CertificationsPage() {
  return (
    <div className="reveal">
      <Link href="/" className="micro link">
        ← index
      </Link>

      <p className="micro mt-10">verified credentials</p>
      <h1 className="mt-3 font-pixel text-5xl lowercase leading-none">
        certifications
      </h1>

      <p className="mt-5 max-w-lg text-gray-500">
        Credentials across AI, cloud, engineering, and security — each verifiable
        at its source.
      </p>

      <div className="mt-12 space-y-12">
        {groupByCategory(certifications).map(([category, group]) => (
          <section key={category}>
            <div className="border-b border-gray-200 pb-3">
              <h2 className="font-pixel text-sm lowercase tracking-wide text-gray-400">
                {category.toLowerCase()}
              </h2>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((certification) => (
                <CertificationCard
                  key={certification.slug}
                  certification={certification}
                  from="all"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
