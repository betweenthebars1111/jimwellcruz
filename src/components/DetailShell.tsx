import Link from "next/link";
import type { ItemLink } from "@/lib/content";

interface MetaRow {
  label: string;
  value: string;
}

export default function DetailShell({
  backHref,
  backLabel,
  kicker,
  title,
  logo,
  meta,
  tags,
  links,
  quote,
  body,
  highlights,
}: {
  backHref: string;
  backLabel: string;
  kicker: string;
  title: string;
  logo?: string;
  meta?: MetaRow[];
  tags?: string[];
  links?: ItemLink[];
  quote?: string;
  body: string[];
  highlights?: string[];
}) {
  return (
    <article className="reveal">
      <Link href={backHref} className="micro link">
        ← {backLabel}
      </Link>
      <p className="micro mt-10">{kicker}</p>
      <h1 className="mt-3 font-pixel text-4xl lowercase leading-none">
        {title}
      </h1>

      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt=""
          className="mt-6 h-10 w-auto max-w-[120px] object-contain"
        />
      )}

      {meta && meta.length > 0 && (
        <dl className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
          {meta.map((m) => (
            <div
              key={m.label}
              className="flex items-baseline justify-between gap-4 py-2.5"
            >
              <dt className="micro">{m.label}</dt>
              <dd className="text-right font-mono text-xs text-gray-600">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {quote && (
        <p className="mt-10 font-serif text-xl italic leading-relaxed">
          “{quote}”
        </p>
      )}

      <div className="mt-10 space-y-5">
        {body.map((p, i) => (
          <p
            key={i}
            className="font-serif text-[17px] leading-[1.75] text-gray-700"
          >
            {p}
          </p>
        ))}
      </div>

      {highlights && highlights.length > 0 && (
        <div className="mt-12">
          <p className="micro border-b border-gray-200 pb-3">highlights</p>
          <ul className="divide-y divide-gray-200">
            {highlights.map((h) => (
              <li key={h} className="py-3 text-[13px] text-gray-600">
                <span className="micro mr-3">—</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="mt-12 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-gray-300 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-gray-500"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {links && links.filter((l) => l.url).length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          {links
            .filter((l) => l.url)
            .map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="micro link text-gray-500"
              >
                {l.label} ↗
              </a>
            ))}
        </div>
      )}
    </article>
  );
}
