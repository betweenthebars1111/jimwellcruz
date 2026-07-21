# jimwellcruz — personal portfolio

Minimal, monochrome portfolio built with Next.js (App Router) + TypeScript + Tailwind CSS, styled after the bryl-minimal design language. All content lives in editable JSON files — no database, no admin. Deploys free on Vercel's Hobby tier.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages prerender statically)
```

## Editing content

Everything you see on the site comes from `/content`. Edit a file, push to Git, and Vercel redeploys.

| File | Drives |
|---|---|
| `content/profile.json` | Hero — name, bio, photo, status, socials, email, resume path |
| `content/projects.json` | 01 — Projects (cards + `/projects/[slug]` pages) |
| `content/experience.json` | 02 — Experience (rows + `/experience/[slug]` pages) |
| `content/stack.json` | 03 — Stack preview + `/stack` page |
| `content/certifications.json` | 04 — Certifications (+ detail pages) |
| `content/recommendations.json` | 05 — Recommendations (+ detail pages) |
| `content/affiliations.json` | 06 — Affiliations (+ detail pages) |
| `content/gear.json` | `/gear` page |

Collection items are keyed by `slug` (also the URL). `body` is an array of paragraph strings. Dates: years as `"2024"` / `"present"`, cert dates as `"YYYY-MM"`.

### Certification logos

Each certification can carry an optional issuer logo. Add a `"logo"` field and paste
an image location — either a path to a file in `/public` or a full URL:

```json
{
  "slug": "some-cert",
  "title": "Some Certification",
  "issuer": "Some Company",
  "logo": "/images/certs/cisco-networking-academy.png",
  "...": "other fields"
}
```

- **Same company:** reuse the same path (all four Cisco certs point at
  `/images/certs/cisco-networking-academy.png`).
- **Different company:** drop the image in `public/images/certs/` and paste its path
  (`/images/certs/<file>.png`), or paste a full `https://…` URL.
- **No logo:** omit the field entirely — the row just shows text, no broken image.

The logo appears next to the title in the homepage list (04) and near the heading on the
cert's detail page. Keep source images small — the Cisco file was downscaled to 480px wide
(~9 KB) before committing.

The TypeScript shapes live in `src/lib/content.ts` — the build fails loudly if a JSON file drifts from the schema.

### Adding recommendations (currently a placeholder)

`content/recommendations.json` is intentionally empty (`[]`) — the homepage shows a
"Recommendations coming soon / references available on request" card until real ones exist.
Once someone writes you a recommendation, replace `[]` with entries in this shape and the
placeholder is automatically swapped for real cards (no code changes needed):

```json
[
  {
    "slug": "recommender-one",
    "name": "Recommender One",
    "role": "Engineering Manager, Company One",
    "relation": "managed me directly",
    "date": "2025-11",
    "quote": "A short pull-quote shown on the homepage card — one or two sentences from the recommendation.",
    "body": [
      "The full recommendation text goes here, paragraph by paragraph.",
      "Second paragraph of the recommendation, if there is one."
    ]
  },
  {
    "slug": "recommender-two",
    "name": "Recommender Two",
    "role": "Senior Engineer, Company Two",
    "relation": "worked with me on the same team",
    "date": "2024-06",
    "quote": "Another short placeholder pull-quote for the homepage.",
    "body": [
      "Full placeholder recommendation text."
    ]
  }
]
```

Field notes: `slug` becomes the URL (`/recommendations/<slug>`) and must be unique; `quote` is
the short pull-quote on the homepage card; `body` is an array of full paragraphs for the detail page.

## Assets

- `public/images/portrait.png` — hero photo
- `public/images/ouroboros.png` — logo mark / dividers / 404 (white-on-transparent; auto-inverted in light mode). Also the source for the browser-tab favicon (`src/app/icon.png` + `src/app/apple-icon.png`).
- `public/images/certs/` — certification issuer logos (see "Certification logos" above)
- `public/fonts/GeistPixel.woff2` — display font (Geist Pixel Square, from vercel/geist-font)

> No resume PDF is shipped on the site by design — the resume points people *to* the site, not the other way around. To re-add one later: drop `resume.pdf` into `public/`, set `"resume": "/resume.pdf"` in `content/profile.json`, and wire a link where you want it.

## Features

- Dark/light toggle (defaults to dark, persisted in `localStorage`)
- **Alt+M** (or the sidebar/footer link) opens a fully playable Minesweeper — 9×9, 10 mines, first click always safe, right-click or ⚑-mode to flag. Beat the randomized "my time" and it concedes.
- Halftone texture, pixel-font headings, hairline dividers, staggered entrance animation (disabled under `prefers-reduced-motion`)

## Deploy

First-time setup: push to GitHub → import the repo on [vercel.com](https://vercel.com) → framework auto-detects Next.js → deploy. No env vars needed.

### Updating the live site yourself (no Claude Code needed)

The repo is already connected to Vercel: **every push to `main` triggers an automatic redeploy** (usually live within a minute). So updating the site is just three git commands in this folder:

```bash
cd /var/www/html/jimwellcruz

# 1. see what you changed (optional sanity check)
git status

# 2. stage everything and commit with a message
git add -A
git commit -m "describe what you changed"

# 3. push — this is what triggers the Vercel redeploy
git push
```

That's it. Edit any file in `content/*.json` (or swap an image in `public/`), run those three commands, and Vercel rebuilds and publishes automatically. Watch the build at [vercel.com/dashboard](https://vercel.com/dashboard) → your project → **Deployments**.

**Common edits, all just content files:**

| Want to… | Edit |
|---|---|
| Add/edit a certification (with logo) | `content/certifications.json` |
| Add a project or experience | `content/projects.json` / `content/experience.json` |
| Change bio, email, socials, location | `content/profile.json` |
| Add a real recommendation | `content/recommendations.json` |
| Swap the tab favicon | replace `src/app/icon.png` |

**If a push is rejected** (e.g. "updates were rejected because the remote contains work you do not have"), pull first, then push again:

```bash
git pull --rebase
git push
```

**Auth note:** pushing uses the GitHub login stored by the `gh` CLI on this machine. If git ever asks for a username/password, run `gh auth login` once to refresh it, then push again.
