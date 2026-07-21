import type { Metadata } from "next";
import Link from "next/link";
import { gearSections } from "@/lib/content";

export const metadata: Metadata = {
  title: "gear",
  description: "Hardware and OS setup.",
};

export default function GearPage() {
  return (
    <div className="reveal">
      <Link href="/" className="micro link">
        ← index
      </Link>
      <p className="micro mt-10">hardware & os</p>
      <h1 className="mt-3 font-pixel text-5xl lowercase leading-none">gear</h1>
      <p className="mt-5 max-w-lg text-gray-500">
        The physical setup behind the work.
      </p>

      <div className="mt-12 space-y-12">
        {gearSections.map((s, i) => (
          <section key={s.name}>
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <h2 className="font-pixel text-sm lowercase tracking-wide text-gray-400">
                {String(i + 1).padStart(2, "0")} — {s.name.toLowerCase()}
              </h2>
              <span className="micro">{s.items.length} items</span>
            </div>
            <ul>
              {s.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-4 border-b border-gray-200 py-2.5"
                >
                  <span className="text-sm">{item.name}</span>
                  {item.note && (
                    <span className="micro text-right">{item.note}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
