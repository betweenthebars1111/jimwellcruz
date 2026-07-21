import type { Metadata } from "next";
import Link from "next/link";
import { stackCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "stack",
  description: "The full categorized tech stack.",
};

export default function StackPage() {
  return (
    <div className="reveal">
      <Link href="/" className="micro link">
        ← index
      </Link>
      <p className="micro mt-10">tools i reach for</p>
      <h1 className="mt-3 font-pixel text-5xl lowercase leading-none">stack</h1>
      <p className="mt-5 max-w-lg text-gray-500">
        Everything I build with, grouped by where it fits.
      </p>

      <div className="mt-12 space-y-12">
        {stackCategories.map((c, i) => (
          <section key={c.name}>
            <div className="border-b border-gray-200 pb-3">
              <h2 className="font-pixel text-sm lowercase tracking-wide text-gray-400">
                {String(i + 1).padStart(2, "0")} — {c.name.toLowerCase()}
              </h2>
            </div>
            <ul className="grid sm:grid-cols-2 sm:gap-x-8">
              {c.items.map((item) => (
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
