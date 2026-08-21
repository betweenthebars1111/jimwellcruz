import Image from "next/image";
import Link from "next/link";
import type { Certification } from "@/lib/content";

/**
 * The logo sits in a chip rather than leading the card: these are wordmarks,
 * not app icons, and at full size they outshouted the credential itself.
 * The chip stays white in both themes because the artwork is near-black
 * (the AWS wordmark is ~61% rgb(32,32,32)) and vanishes on a dark ground.
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
      className="group flex min-h-[13rem] flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-5 text-center shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-card-hover"
    >
      <div className="flex w-full items-center justify-between">
        <span className="micro">{certification.date}</span>
        <span className="micro text-gray-300 transition-colors duration-300 group-hover:text-gray-500">
          →
        </span>
      </div>

      {certification.logo && (
        <span className="mt-5 inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 transition-colors duration-300 group-hover:border-gray-300">
          <Image
            src={certification.logo}
            alt={`${certification.issuer} logo`}
            width={88}
            height={28}
            className="h-5 w-auto object-contain"
          />
        </span>
      )}

      <h3 className="mt-4 text-balance text-sm font-medium leading-snug">
        {certification.title}
      </h3>

      <p className="micro mt-1.5">
        {certification.issuerShort ?? certification.issuer}
      </p>

      <span className="micro mt-auto flex items-center gap-1.5 pt-5 text-gray-400 transition-colors duration-300 group-hover:text-ink">
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
