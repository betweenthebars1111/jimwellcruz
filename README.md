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
- `public/images/ouroboros.png` — logo mark / dividers / 404 (white-on-transparent; auto-inverted in light mode)
- `public/resume.pdf` — **add this** (linked from hero + footer)
- `public/fonts/GeistPixel.woff2` — display font (Geist Pixel Square, from vercel/geist-font)

## Features

- Dark/light toggle (defaults to dark, persisted in `localStorage`)
- **Alt+M** (or the sidebar/footer link) opens a fully playable Minesweeper — 9×9, 10 mines, first click always safe, right-click or ⚑-mode to flag. Beat the randomized "my time" and it concedes.
- Halftone texture, pixel-font headings, hairline dividers, staggered entrance animation (disabled under `prefers-reduced-motion`)

## Deploy

Push to GitHub → import the repo on [vercel.com](https://vercel.com) → framework auto-detects Next.js → deploy. No env vars needed.
