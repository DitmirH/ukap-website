# UKAP Foundation website — guide for AI agents and developers

Read this first, then `docs/BRAND.md` (brand rules — with screenshots of the original Betsu Works
brand guide in `docs/brand-guide/`) and `WEBSITE-OVERVIEW.md` (full technical tour).

## What this is

Public website for the **UKAP Foundation** (UK Albanian Professionals Foundation), a UK-registered
charity (No. 1215303) advancing education for young adults through scholarships, mentoring and
skills training. React + Vite front end; almost all content comes from **Sanity CMS**.

## Working rules

- **Do not commit, push or create PRs unless the owner explicitly asks.** Leave changes in the
  working tree and list the files you touched.
- **Follow `docs/BRAND.md`.** Gold + black lead, blue + coral are accents, square blocks, uppercase
  condensed headings, coral highlight blocks. Use CSS tokens from `src/styles/index.css` — never
  hard-code hex values in components.
- **Keep Sanity fallbacks.** Components render hard-coded defaults when Sanity has no document, so
  the site never looks broken on an empty dataset. Don't remove that behaviour.
- **Don't change Sanity schemas** (`studio/schemaTypes/`) unless asked — editors depend on them, and
  schema changes need `npx sanity deploy` from `studio/`.
- **Verify visually.** Run `npm run build`, then check pages at 1440px and 390px wide before saying
  you're done.
- Use UK English in copy.

## Commands

```bash
npm run dev:frontend   # site (http://localhost:5173) + Sanity Studio (http://localhost:3333)
npm run dev:all        # the above + local contact-form email server (http://localhost:3001)
npm run dev            # site only
npm run build          # production build → dist/
cd studio && npx sanity deploy   # publish Studio changes (hosted by Sanity, not Vercel)
```

The site **must run on port 5173** locally: Sanity's CORS list only allows that origin, so any other
port loads with no CMS content.

## Layout of the repo

```
src/main.jsx            routes
src/styles/index.css    design tokens + shared classes (buttons, cards, eyebrow, accent, tri-bar,
                        brand strip, watermark, scroll-reveal)
src/components/<Name>/  one folder per component: Name.jsx, Name.css, index.js (barrel);
                        re-exported from src/components/index.js
src/pages/<Name>/       one folder per route, same convention
src/lib/sanityClient.js Sanity client + urlFor() image builder
src/lib/scrollReveal.js global scroll animations (auto-tags elements by selector)
public/brand/           logo files (see docs/BRAND.md §4)
public/images/          placeholder photography (see public/images/CREDITS.md)
public/fonts/           Selawik (body) + Archivo (display)
api/contact.js          Vercel serverless contact-form endpoint (production)
server/                 Express version of the same endpoint (local dev only)
middleware.js           Vercel password gate (see below)
studio/                 Sanity Studio (separate npm app)
docs/BRAND.md           brand rules for the web
docs/brand-guide/       screenshots of the original Betsu Works brand guide (source of truth)
```

## Key building blocks

| Component | Purpose |
|---|---|
| `PageHeader` | Every inner page's header. `photo` prop → full-bleed photo + overlapping card; without it → solid colour block. `tone`: `black`, `gold`, `coral`. |
| `HeroCarousel` | Homepage hero. A fixed brand slide always comes first; Sanity `heroSlide` docs follow. (No `BrandStrip` here — owner removed it from the hero.) |
| `BrandStrip` | Gold vertical "UKAP FOUNDATION" strip (footer only). |
| `ActionCards` | Three homepage action cards — **content hard-coded** in the component. |
| `MissionStrip` | Black impact band; text from Sanity `missionSection`, **stats hard-coded**. |
| `ProgrammesGrid` | "What we do" cards from Sanity `programme` (falls back to defaults + stock photos). |
| `FeatureBanner` | Wide photo with an overlapping colour card — **not Sanity; content passed as props in `Home.jsx` / `About.jsx`**. Props: `image`, `title`, `text`, `cta`, `to`, `tone`, `align`. |
| `HelpWays` | "You can help, in your way" cards — **content hard-coded**. |
| `SectionHead` | Uppercase section title + optional "View all" link. |
| `EventsList`, `BlogCard`, `TeamCard`, `SponsorsCarousel`, `ContactForm`, `AnnouncementModal` | Sanity-driven content components. |

Untracked work-in-progress components (`AnnouncementBanner`, `AudiencePathways`,
`FinalActionSelector`, `InteractiveImpact`) are not wired into any page — leave them alone unless asked.

## Sanity

- Project `ijgeixey`. Production dataset `production`.
- **Gotcha:** `.env.development` points at the `development` dataset, so local dev may show
  different content from the live site.
- Hero slides: title, subtitle, image, buttons, duration are used. The solid-colour, custom hex,
  text-alignment and overlay options are ignored by the current design.
- Programme `color` field is ignored. Blog/event images ≥ 1000px wide become full-bleed headers;
  smaller ones show beside the title.
- CORS origins (sanity.io/manage → API) must include every domain the site runs on.

## Deployment (Vercel)

- Import as a **single Vite project** at the repo root. Do **not** use Vercel's "Services"
  multi-app setup — `server/` is local-only and `studio/` deploys to Sanity.
- Env vars: `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `SMTP_USER`, `SMTP_PASS`,
  `CONTACT_EMAIL`, and optionally `SITE_PASSWORD`.
- `vercel.json` rewrites everything to `index.html` (SPA) except `/api/*`.

## Password gate

`middleware.js` (Vercel Routing Middleware) shows a branded password page when the env var
`SITE_PASSWORD` is set. Remove the variable and redeploy to make the site public. Changing the
password logs everyone out. It never runs in `npm run dev`.

## Known content to clean up

- Sanity has test content ("UKAP ONE / this is a test" hero slides; a post whose image is a QR code).
- Placeholder stock photos in `public/images/`.
- Logo PNGs are low-res; SVGs from Betsu Works would be better.
