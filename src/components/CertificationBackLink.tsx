"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="micro link">
      ← certifications
    </Link>
  );
}

function ResolvedBackLink() {
  const from = useSearchParams().get("from");
  return <BackLink href={from === "all" ? "/certifications" : "/#certifications"} />;
}

/**
 * Points back to wherever the visitor came from, without dragging `searchParams`
 * into the page — that would opt the whole route out of static prerendering.
 * The prerendered HTML ships the home-page link; the client swaps it after hydration.
 */
export default function CertificationBackLink() {
  return (
    <Suspense fallback={<BackLink href="/#certifications" />}>
      <ResolvedBackLink />
    </Suspense>
  );
}
