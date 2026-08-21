import Image from "next/image";
import Link from "next/link";
import type { Certification } from "@/lib/content";

/**
 * The logo sits bare on the card, no plate behind it. Wide issuer wordmarks and
 * square credential badges need different heights to carry the same weight, so
 * `logoBadge` picks the taller box; wordmarks get `logo-lift` so the near-black
 * artwork survives the dark theme.
 */
export default function CertificationCard({
  certification,
  from,
}: {
  certification: Certification;
  from: "home" | "all";
}) {
  return (
    <Link
      href={`/certifications/${certification.slug}?from=${from}`}
      className="group flex min-h-[14rem] flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-5 text-center shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-card-hover"
    >
      <div className="flex w-full items-center justify-between">
        <span className="micro text-gray-500">{certification.date}</span>
        <span
          aria-hidden="true"
          className="micro text-gray-400 transition-colors duration-300 group-hover:text-ink"
        >
          →
        </span>
      </div>

      <div className="mt-4 flex h-16 w-full items-center justify-center">
        {certification.logo && (
          <Image
            src={certification.logo}
            alt={`${certification.issuer} logo`}
            width={certification.logoBadge ? 120 : 176}
            height={certification.logoBadge ? 128 : 96}
            className={`w-auto object-contain ${
              certification.logoBadge ? "max-h-16" : "logo-lift max-h-9"
            }`}
          />
        )}
      </div>

      <h3 className="mt-3 text-balance text-sm font-medium leading-snug">
        {certification.title}
      </h3>

      <p className="micro mt-1.5 text-gray-500">
        {certification.issuerShort ?? certification.issuer}
      </p>

      <span className="micro mt-auto flex items-center gap-1.5 pt-5 text-gray-500 transition-colors duration-300 group-hover:text-ink">
        <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-0.5">
          ‹
        </span>
        view
        <span className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5">
          ›
        </span>
      </span>
    </Link>
  );
}
