"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* full-screen ouroboros splash shown on initial page load only —
   client-side navigations never remount the root layout, so it won't replay */
export default function Splash() {
  const [phase, setPhase] = useState<"shown" | "fading" | "done">("shown");

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const t = window.setTimeout(() => setPhase("fading"), reduced ? 0 : 1000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "fading") return;
    const t = window.setTimeout(() => setPhase("done"), 500);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-bg transition-opacity duration-500 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src="/images/ouroboros.png"
        alt=""
        width={56}
        height={56}
        priority
        className="ouro"
      />
    </div>
  );
}
