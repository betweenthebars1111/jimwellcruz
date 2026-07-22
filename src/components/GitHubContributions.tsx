import { profile } from "@/lib/content";

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: Day[];
}

/* halftone ramp — dots grow (and firm up) with activity, empties stay faint */
const DOT = [
  { d: 3, o: 0.2 },
  { d: 5, o: 0.5 },
  { d: 7, o: 0.72 },
  { d: 9, o: 0.9 },
  { d: 11, o: 1 },
];
const CELL = 11;

export function githubUsername(): string | null {
  const gh = profile.socials.find((s) => s.label.toLowerCase() === "github");
  if (!gh) return null;
  const m = gh.url.match(/github\.com\/([^/?#]+)/i);
  return m ? m[1] : null;
}

async function fetchContributions(
  user: string,
): Promise<ContributionsResponse | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${user}?y=last`,
      { next: { revalidate: 43200 } }, // refresh at most twice a day
    );
    if (!res.ok) return null;
    return (await res.json()) as ContributionsResponse;
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
  const weeks = data ? toWeeks(data.contributions) : [];
  const total = data?.total?.lastYear ?? null;
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
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[3px]" aria-hidden="true">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={day ? day.date : `e${di}`}
                  className="flex items-center justify-center"
                  style={{ width: CELL, height: CELL }}
                  title={day ? `${day.count} on ${day.date}` : undefined}
                >
                  {day && (
                    <span
                      className="block rounded-full"
                      style={{
                        width: DOT[day.level].d,
                        height: DOT[day.level].d,
                        backgroundColor: `rgb(var(--c-ink) / ${DOT[day.level].o})`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

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
