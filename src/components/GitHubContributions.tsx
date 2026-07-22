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

/* monochrome ink ramp — empties are barely-there, hot days are full ink */
const LEVEL_FILL = [
  "rgb(var(--c-ink) / 0.06)",
  "rgb(var(--c-ink) / 0.28)",
  "rgb(var(--c-ink) / 0.5)",
  "rgb(var(--c-ink) / 0.74)",
  "rgb(var(--c-ink) / 1)",
];

function githubUsername(): string | null {
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

  return (
    <div className="mt-6">
      {weeks.length > 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-card">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[13px] text-gray-500">
              {total !== null ? (
                <>
                  <span className="font-medium text-ink">{total}</span>{" "}
                  contributions in the last year
                </>
              ) : (
                "contributions in the last year"
              )}
            </p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="micro link shrink-0 text-gray-500"
            >
              @{user} ↗
            </a>
          </div>

          <div className="mt-4 overflow-x-auto pb-1">
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) =>
                    day ? (
                      <div
                        key={day.date}
                        title={`${day.count} on ${day.date}`}
                        className="h-[11px] w-[11px] rounded-[2px]"
                        style={{ backgroundColor: LEVEL_FILL[day.level] }}
                      />
                    ) : (
                      <div key={`e${di}`} className="h-[11px] w-[11px]" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-1.5">
            <span className="micro mr-1">less</span>
            {LEVEL_FILL.map((fill, i) => (
              <div
                key={i}
                className="h-[11px] w-[11px] rounded-[2px]"
                style={{ backgroundColor: fill }}
              />
            ))}
            <span className="micro ml-1">more</span>
          </div>
        </div>
      ) : (
        /* graceful fallback if the API is unreachable at build time */
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6 text-center">
          <p className="text-[13px] text-gray-500">
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
        </div>
      )}

      <p className="mt-4 max-w-measure font-serif text-[15px] italic leading-relaxed text-gray-500">
        i&apos;m sorry — i promise i&apos;m not lazy, just lazy with pushing.
        (this graph is emphatically <span className="text-ink">not</span> a
        measure of how good i actually am. :)
      </p>
    </div>
  );
}
