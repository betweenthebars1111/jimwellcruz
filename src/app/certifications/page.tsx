import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { certifications } from "@/lib/content";

export const metadata: Metadata = {
  title: "certifications",
};

const categories = [
  "Cloud & DevOps",
  "AI & Machine Learning",
  "IT & Security",
];

export default function CertificationsPage() {
  return (
    <>
      <section className="reveal">
        <h1 className="font-pixel text-4xl lowercase leading-none sm:text-5xl">
          certifications
        </h1>

        <p className="mt-6 max-w-xl text-gray-500">
          Credentials across AI, cloud, engineering, and security —
          each verifiable at its source.
        </p>
      </section>

      <div className="mt-14 space-y-14">
        {categories.map((category) => {
          const categoryCertifications = certifications.filter(
            (certification) => certification.category === category
          );

          if (categoryCertifications.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="micro mb-5">
                {category}
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categoryCertifications.map((certification) => (
                  <Link
                    key={certification.slug}
                    href={`/certifications/${certification.slug}`}
                    className="group relative flex min-h-[210px] flex-col rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-card transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <div className="flex items-center justify-between">
                      <span className="micro">
                        {certification.date}
                      </span>

                      <span className="micro text-gray-300 transition-colors group-hover:text-gray-500">
                        →
                      </span>
                    </div>

                    <div className="mt-5 flex h-12 items-center">
                      {certification.logo && (
                        <Image
                          src={certification.logo}
                          alt={`${certification.issuer} logo`}
                          width={56}
                          height={56}
                          className="max-h-10 w-auto object-contain"
                        />
                      )}
                    </div>

                    <h3 className="mt-4 text-sm font-medium leading-snug">
                      {certification.title}
                    </h3>

                    <p className="micro mt-auto pt-4">
                      {certification.issuer}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}