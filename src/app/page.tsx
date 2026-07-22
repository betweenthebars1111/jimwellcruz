import Image from "next/image";
import Link from "next/link";
import GetInTouch from "@/components/GetInTouch";
import GitHubContributions from "@/components/GitHubContributions";
import {
  profile,
  projects,
  experience,
  stackCategories,
  certifications,
  recommendations,
  affiliations,
} from "@/lib/content";

function delay(i: number) {
  return { animationDelay: `${Math.min(50 + i * 70, 330)}ms` };
}

function SectionHeader({
  n,
  title,
  href,
  hrefLabel,
}: {
  n: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
      <h2 className="font-pixel text-sm lowercase tracking-wide text-gray-400">
        {n} — {title}
      </h2>
      {href && (
        <Link href={href} className="micro link">
          {hrefLabel ?? "view all"}
        </Link>
      )}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-300 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-gray-500">
      {children}
    </span>
  );
}

function OuroDivider() {
  return (
    <div className="my-14 flex items-center gap-5" aria-hidden="true">
      <div className="h-px flex-1 bg-gray-200" />
      <Image
        src="/images/ouroboros.png"
        alt=""
        width={28}
        height={28}
        className="ouro opacity-60"
      />
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="reveal" style={delay(0)}>
        <div className="flex flex-col-reverse items-start justify-between gap-8 sm:flex-row">
          <div className="min-w-0">
            <p className="micro flex items-center gap-2">
              <span className="dot-pulse text-ink">●</span> {profile.status}
            </p>
            <h1 className="mt-4 font-pixel text-5xl leading-none">
              {profile.displayName}
            </h1>
            <p className="micro mt-3">
              {profile.role} · {profile.location}
            </p>
            <p className="mt-5 max-w-lg text-gray-500">{profile.bio}</p>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
              {profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="micro link text-gray-500"
                >
                  {s.label} ↗
                </a>
              ))}
              <GetInTouch className="micro link text-gray-500">
                email ↗
              </GetInTouch>
            </div>
          </div>
          <div className="relative shrink-0">
            <Image
              src={profile.photo}
              alt={profile.name}
              width={192}
              height={192}
              priority
              className="halftone-fade-b relative rounded-2xl border border-gray-200"
            />
          </div>
        </div>
      </section>

      <OuroDivider />

      {/* 01 — projects */}
      <section id="projects" className="reveal scroll-mt-20" style={delay(1)}>
        <SectionHeader n="01" title="projects" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group block rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-card transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="micro">{p.year}</span>
                {p.featured ? (
                  <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-bg">
                    featured
                  </span>
                ) : (
                  <span className="micro">{p.status}</span>
                )}
              </div>
              <h3 className="mt-3 font-medium">{p.title}</h3>
              <p className="mt-1 text-[13px] text-gray-500">{p.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 02 — experience */}
      <section
        id="experience"
        className="reveal mt-14 scroll-mt-20"
        style={delay(2)}
      >
        <SectionHeader n="02" title="experience" />
        <div className="divide-y divide-gray-200">
          {experience.map((e) => (
            <Link
              key={e.slug}
              href={`/experience/${e.slug}`}
              className="group flex items-baseline justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <h3 className="font-medium">
                  {e.role}
                  <span className="text-gray-500"> · {e.company}</span>
                  <span className="ml-2 inline-block translate-x-0 text-gray-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                    →
                  </span>
                </h3>
                <p className="mt-1 text-[13px] text-gray-500">{e.summary}</p>
              </div>
              <span className="micro shrink-0">
                {e.start}—{e.end}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 03 — stack */}
      <section id="stack" className="reveal mt-14 scroll-mt-20" style={delay(3)}>
        <SectionHeader n="03" title="stack" href="/stack" hrefLabel="full stack →" />
        <div className="divide-y divide-gray-200">
          {stackCategories.map((c) => (
            <div
              key={c.name}
              className="flex items-baseline justify-between gap-6 py-3"
            >
              <span className="micro shrink-0">{c.name}</span>
              <span className="text-right text-[13px] text-gray-500">
                {c.items
                  .slice(0, 4)
                  .map((i) => i.name)
                  .join(" · ")}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 04 — certifications */}
      <section
        id="certifications"
        className="reveal mt-14 scroll-mt-20"
        style={delay(4)}
      >
        <SectionHeader n="04" title="certifications" />
        <div className="divide-y divide-gray-200">
          {certifications.map((c) => (
            <Link
              key={c.slug}
              href={`/certifications/${c.slug}`}
              className="group flex items-center justify-between gap-4 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {c.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.logo}
                    alt={`${c.issuer} logo`}
                    className="h-7 w-auto max-w-[64px] shrink-0 object-contain"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="font-medium">
                    {c.title}
                    <span className="ml-2 inline-block text-gray-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                      →
                    </span>
                  </h3>
                  <p className="mt-1 text-[13px] text-gray-500">{c.issuer}</p>
                </div>
              </div>
              <span className="micro shrink-0">{c.date}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 05 — recommendations */}
      <section
        id="recommendations"
        className="reveal mt-14 scroll-mt-20"
        style={delay(5)}
      >
        <SectionHeader n="05" title="recommendations" />
        <div className="mt-6 space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((r) => (
              <Link
                key={r.slug}
                href={`/recommendations/${r.slug}`}
                className="block rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-card transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <p className="font-serif text-[17px] italic leading-relaxed">
                  “{r.quote}”
                </p>
                <p className="micro mt-4">
                  {r.name} — {r.role}
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6 text-center">
              <p className="font-serif text-[17px] italic leading-relaxed text-gray-500">
                Recommendations coming soon.
              </p>
              <p className="micro mt-3 text-gray-400">
                references available on request
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 06 — affiliations */}
      <section
        id="affiliations"
        className="reveal mt-14 scroll-mt-20"
        style={delay(6)}
      >
        <SectionHeader n="06" title="affiliations" />
        <div className="divide-y divide-gray-200">
          {affiliations.map((a) => (
            <Link
              key={a.slug}
              href={`/affiliations/${a.slug}`}
              className="group flex items-baseline justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <h3 className="font-medium">
                  {a.org}
                  <span className="text-gray-500"> · {a.role}</span>
                  <span className="ml-2 inline-block text-gray-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                    →
                  </span>
                </h3>
                <p className="mt-1 text-[13px] text-gray-500">{a.summary}</p>
              </div>
              <span className="micro shrink-0">
                {a.start}—{a.end}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 07 — github */}
      <section
        id="github"
        className="reveal mt-14 scroll-mt-20"
        style={delay(7)}
      >
        <SectionHeader n="07" title="github" />
        <GitHubContributions />
      </section>
    </>
  );
}
