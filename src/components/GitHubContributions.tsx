import { profile } from "@/lib/content";

interface Day {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
}

interface Contributions {
  total: number;
  days: Day[];
}

/* halftone ramp — dots grow (and firm up) with activity, empties stay faint */
const DOT = [
  { r: 1.5, o: 0.2 },
  { r: 2.5, o: 0.5 },
  { r: 3.5, o: 0.72 },
  { r: 4.5, o: 0.9 },
  { r: 5.5, o: 1 },
];
/* svg grid pitch — the viewBox scales to the column, so no horizontal scroll */
const PITCH = 14;

export function githubUsername(): string | null {
  const gh = profile.socials.find((s) => s.label.toLowerCase() === "github");
  if (!gh) return null;
  const m = gh.url.match(/github\.com\/([^/?#]+)/i);
  return m ? m[1] : null;
}

/* read GitHub's own public contribution graph — no third-party cache in the
   way, so the count tracks whatever github.com shows (private contributions
   included, once the profile setting is on) */
async function fetchContributions(
  user: string,
): Promise<Contributions | null> {
  try {
    const res = await fetch(
      `https://github.com/users/${user}/contributions`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (jimwellcruz-portfolio)" },
        next: { revalidate: 43200 }, // refresh at most twice a day
      },
    );
    if (!res.ok) return null;
    const html = await res.text();

    const days: Day[] = [];
    const cell = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"/g;
    for (const m of html.matchAll(cell)) {
      days.push({ date: m[1], level: Number(m[2]) as Day["level"] });
    }
    if (days.length === 0) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));

    // the headline total is the sum of every day's tooltip count
    let total = 0;
    const tip = /<tool-tip[^>]*>([^<]*)<\/tool-tip>/g;
    for (const m of html.matchAll(tip)) {
      const n = m[1].match(/^([\d,]+)\s+contribution/);
      if (n) total += Number(n[1].replace(/,/g, ""));
    }

    return { total, days };
  } catch {
    return null;
  }
}

/* pad the front so week 1 starts on the correct weekday, then chunk by 7 */
function toWeeks(days: Day[]): (Day | null)[][] {
  if (days.length === 0) return [];
  const lead = new Date(`${days[0].date}T00:00:00`).getDay();
  const cells: (Day | null)[] = [...Array(lead).fill(null), ...days];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default async function GitHubContributions() {
  const user = githubUsername();
  const data = user ? await fetchContributions(user) : null;
  const weeks = data ? toWeeks(data.days) : [];
  const total = data?.total ?? null;
  const profileUrl = user ? `https://github.com/${user}` : "#";

  if (weeks.length === 0) {
    return (
      <p className="mt-6 text-[13px] text-gray-500">
        my contribution graph is taking a nap.{" "}
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link text-ink"
        >
          see it on github ↗
        </a>
      </p>
    );
  }

  return (
    <div className="mt-7">
      <svg
        viewBox={`0 0 ${weeks.length * PITCH} ${7 * PITCH}`}
        className="block w-full"
        role="img"
        aria-label="github contribution graph"
      >
        {weeks.map((week, wi) =>
          week.map(
            (day, di) =>
              day && (
                <circle
                  key={day.date}
                  cx={wi * PITCH + PITCH / 2}
                  cy={di * PITCH + PITCH / 2}
                  r={DOT[day.level].r}
                  style={{ fill: `rgb(var(--c-ink) / ${DOT[day.level].o})` }}
                >
                  <title>{day.date}</title>
                </circle>
              ),
          ),
        )}
      </svg>

      {total !== null && (
        <p className="micro mt-5">
          {total.toLocaleString()} contributions in the last year
        </p>
      )}

      <p className="mt-2 text-[13px] italic text-gray-500">
        i&apos;m sorry — i promise i&apos;m not lazy, just lazy with pushing. :)
      </p>
    </div>
  );
}
