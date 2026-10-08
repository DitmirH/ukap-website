# UKAP Foundation Website — Technical Overview

A complete rundown of how the site is built, structured and styled. Written so that any developer (or AI assistant) can understand the whole project from this one document.

## What it is

The public website for the **UKAP Foundation** (UK Albanian Professionals Foundation), a UK-registered charity (Charity No. 1215303) focused on advancing education for young adults through scholarships, mentoring and skills training. Nearly all content is editor-managed through **Sanity CMS** — the React frontend is a presentation layer over Sanity documents.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 (JavaScript, no TypeScript), `react-router-dom` v7 (client-side SPA routing) |
| CMS | Sanity v4 (hosted dataset, project ID `ijgeixey`, dataset `production`), queried with GROQ via `@sanity/client`; rich text rendered with `@portabletext/react`; images via `@sanity/image-url` |
| Styling | Plain CSS, one file per component/page, global design tokens in `src/styles/index.css` (CSS custom properties). No CSS framework, no preprocessor |
| Contact email | Express + Nodemailer server (local dev, `server/index.js`, port 3001) and a Vercel serverless function (`api/contact.js`) in production. Sends via Microsoft 365 SMTP; supports base64 file attachments |
| Donations | Zeffy embedded form (third-party); ticketing via TicketTailor embeds |
| Hosting | Vercel, single Vite project (SPA rewrite of all routes to `index.html`, `/api/*` to serverless functions — see `vercel.json`). Studio is hosted by Sanity (`npx sanity deploy`). Hidden editor guide at `/editor-guide` (password `EDITOR_GUIDE_PASSWORD`, see `middleware.js`). |

## Repository layout

```
ukap-web/
├── index.html                  # Vite entry
├── vite.config.js
├── vercel.json                 # SPA + API rewrites, function config
├── .env.development/.production # VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET, SMTP creds
├── CLAUDE.md / AGENTS.md       # Working rules for AI agents & developers
├── docs/BRAND.md               # Brand guidelines for the web (colours, type, logo, patterns)
├── public/fonts/               # Selawik (body, 300/400/600/700) + Archivo variable (display)
├── public/brand/               # Logo lockups, icon, outline monogram, favicons
├── public/images/              # Placeholder photography + CREDITS.md
├── api/contact.js              # Vercel serverless contact-form endpoint
├── server/                     # Express dev server for the same endpoint
├── src/
│   ├── main.jsx                # Router + route table; calls initScrollReveal()
│   ├── lib/
│   │   ├── sanityClient.js     # Sanity client + urlFor() image builder
│   │   └── scrollReveal.js     # Global IntersectionObserver scroll animations
│   ├── styles/index.css        # Design tokens + shared patterns (see Design system)
│   ├── components/             # One folder per component: X/X.jsx, X/X.css, X/index.js
│   └── pages/                  # Same convention, one folder per route
└── studio/                     # Sanity Studio (separate npm app)
    ├── sanity.config.js
    ├── deskStructure.js        # Custom desk: "Pages" and "Components" groups
    └── schemaTypes/            # All document schemas (see Sanity schemas)
```

Dev scripts (root `package.json`): `npm run dev` (site), `dev:studio`, `dev:server`, `dev:all` (all three concurrently), `build`, `preview`.

## Routes (src/main.jsx)

| Path | Page | Data source |
|---|---|---|
| `/` | Home | heroSlide, missionSection, programme, event, post, contactForm, sponsor, announcementModal |
| `/about` | About | Static (content ported from the charity's mission statement) |
| `/events` | Events | event documents (timeline list incl. past) |
| `/events/:slug` | EventDetail | single event (body, venue, tickets, status) |
| `/blog` | Blog | post documents |
| `/blog/:slug` | BlogPost | single post (Portable Text body, author, embeds) |
| `/resources` | Resources | resource documents (category filter + search) |
| `/resources/:slug` | ResourceDetail | single resource (content, downloads, useful links, related) |
| `/team` | Team | teamMember, grouped by category (lead / volunteer) |
| `/sponsors` | Sponsors | sponsor, grouped by tier, with detail modal |
| `/donate` | Donate | sponsorshipTier + hardcoded Zeffy embed + impact stats |
| `/page/:slug` | CustomPage | customPage (fully CMS-composed pages) |
| `/privacy-policy` | PrivacyPolicy | Static default legal text; overridden by a customPage with slug `privacy-policy` if one exists |
| `/terms-and-conditions` | TermsAndConditions | Same override pattern, slug `terms-and-conditions` |

## Components (src/components/)

Layout & brand
- **Nav** — white sticky bar; UKAP icon + typeset wordmark; red underline on active link; gold square Donate button; full-screen black menu on mobile (hamburger).
- **Footer** — black; gold vertical `BrandStrip` on the left; white negative logo lockup; Explore / Get involved / Contact columns; social icons; legal links. Hidden strip on mobile.
- **PageHeader** — header for every inner page. With `photo`: full-bleed photo + overlapping colour card (crumbs, eyebrow, uppercase title, subtitle, actions). Without: solid colour block with outline monogram. `tone`: black / gold / coral.
- **SectionHead** — uppercase section title + optional "View all" link.
- **BrandStrip** — gold vertical "UKAP FOUNDATION" strip with icon (brand-guide cover pattern).

Homepage sections
- **HeroCarousel** — full-bleed photo with an overlapping card (black, gold title). A fixed brand slide always shows first; Sanity `heroSlide` docs rotate after it (title, subtitle, image, buttons, duration).
- **ActionCards** — three image cards (Scholarships, Become a mentor, Donate). Content hard-coded.
- **MissionStrip** — black impact band: Sanity `missionSection` text (with fallback) + four hard-coded stats in gold.
- **ProgrammesGrid** — "What we do" 2×2 image-left cards from Sanity `programme` (fallback content + stock photos).
- **FeatureBanner** — wide photo with a colour card hanging off its corner (used for the Gala on Home, volunteers on About). Not Sanity — content is passed as props in the page file.
- **WhatsOn** — "What's on" section: Sanity `eventsSection` (Automatic = next N upcoming events; Hand-picked = cards referencing Events, with optional colour/title/description/image overrides). Branded `EventsEmpty` block when nothing is upcoming.
- **HelpWays** — "You can help, in your way" image cards with tags + strap line. Content hard-coded.

Content components
- **EventCard** — poster card: image + gold date badge, colour body (15-swatch palette), tags, title, date/venue line, "Book now" (Ticket Tailor, hidden when past/sold out/cancelled) and "More info →" (whole card links to `/events/{slug}`). Past events go greyscale. Used on Home and `/events`.
- **ResourceCard** — colour-block card for `/resources` (category tag, uppercase title, summary, download/link counts).
- **EventsList** — (older component, still used by `customPage` embeds) — `timeline`, `cards`, `compact` styles; filters; status badges; branded empty state.
- **BlogCard** — news card matching the event cards (colour bar + tag, uppercase title, "Read more →"); `variant="feature"` (lead story) and `variant="compact"` (list row) are used on Home, which shows the latest 5 posts.
- **TeamCard** — square image card.
- **SponsorsCarousel** — logo marquee (hidden when no sponsors).
- **ContactForm** — Sanity-configurable form engine; posts JSON to `/api/contact`.
- **AnnouncementModal** — homepage popup driven by `announcementModal`.
- **EmbedCode / TicketTailorEmbed** — raw embed helpers (Zeffy, TicketTailor).

Work in progress (untracked, not wired in): AnnouncementBanner, AudiencePathways, FinalActionSelector, InteractiveImpact.

## Sanity schemas (studio/schemaTypes/)

`post`, `author`, `teamMember`, `heroSlide`, `contactForm`, `customPage`, `event`, `sponsor`, `donationPage`, `sponsorshipTier`, `missionSection`, `programme`, `announcementModal`, `eventsSection` (What's On cards), `resource` (Resources pages at `/resources/{slug}` — rich content, downloads, links).

Shared: `colourField()` + `ColourSwatchInput` give any field the 15-colour swatch picker (`studio/lib/palette.js`, mirrored in `src/lib/palette.js` — keep in sync). `event.cardColour` uses it.

Events page (`/events`): upcoming cards, then an Archive of past events with a year filter.

Notable: `customPage` composes pages from Portable Text plus custom blocks (images with sizes, CTAs, dividers, two-column layouts, info boxes, embedded contact forms, events lists, TicketTailor and raw embeds, hero styles overlay/banner/contained/none). `event` carries date/venue/tickets/category/status/featured. `contactForm` defines the entire form structure including email routing and subject prefix. The frontend generally treats Sanity as read-only (public dataset, CDN reads in prod).

## Design system (src/styles/index.css)

Full rules: **`docs/BRAND.md`**. Summary:

- **Colours** follow the Betsu Works brand guide *as rendered* (its printed hex labels are wrong): gold `#E2BE74` and black lead; logo blue `#3F7EC2` and coral `#DB4A47` are accents; `-deep` variants are the text-safe versions; `-soft` tints for tiles. Tokens only — never hard-code hex.
- **Typography**: Selawik (Segoe Pro Display substitute) for body/UI; Archivo variable (heavy, condensed, uppercase) for big headings via `--font-display`.
- **Signature patterns**: coral highlight block (`.accent`), vertical gold `BrandStrip`, outline monogram watermark (`.ukap-watermark`), three-colour bar (`.tri-bar`).
- **Shape**: square corners (2–4px radii), flat colour, no gradients or glows.
- **Shared classes**: `.container`, `.section`, `.section-alt`, `.eyebrow`, `.section-title`, `.kicker-title`, `.card` (+ `.card-media`, `.card-body`, `.card-tag`), `.btn` / `.btn-sm` variants, `.view-all-link`, `.tile`, `.stat-num`.
- **Assets**: logos in `public/brand/`, placeholder photos in `public/images/` (see `CREDITS.md`), fonts in `public/fonts/`.

## Animation / interactivity

`src/lib/scrollReveal.js` runs one global IntersectionObserver + MutationObserver: it auto-tags a selector list of elements (cards, titles, sections) with `data-reveal`, staggers siblings, and adds `.in-view` on scroll. CSS hides pre-reveal state **only** when `body.reveal-ready` is set by JS, so content never sticks invisible if JS fails. Directional variants `.reveal-left` / `.reveal-right` slide from the sides (used on the About page's alternating programme rows). All animation respects `prefers-reduced-motion`. Other micro-interactions are pure CSS: card hover lifts, image zooms, nav underline, marquee, modal transitions.

## Conventions & gotchas

- Component pattern: `Folder/Component.jsx` + `Folder/Component.css` + `Folder/index.js` barrel; re-exported from `components/index.js` and `pages/index.js`.
- Sanity-first with fallbacks: MissionStrip, ProgrammesGrid and the legal pages render hardcoded defaults when no matching Sanity document exists, so the site never looks broken on an empty dataset.
- The Zeffy donation form slug is hardcoded in `src/pages/Donate/Donate.jsx` (`ZEFFY_FORM_SLUG`).
- Legal pages contain drafted (not lawyer-reviewed) UK GDPR privacy and standard T&C text; both are overridable from Sanity by slug.
- `heroSlide` allows a custom hex colour — the one place an editor can pick an off-brand colour.
- Contact API expects JSON with dynamic fields plus `recipients`, `emailSubjectPrefix` and optional base64 `attachments`; dev URL is `http://localhost:3001/api/contact`, prod is `/api/contact`.
- No tests and no linter are currently configured.
- Local dev must use port 5173 (Sanity CORS).
- Dataset is chosen by domain (`src/lib/sanityClient.js`): ukapfoundation.org → `production`; staging (ukap-website-rose.vercel.app), previews and localhost → `development`.
- Agent/developer working rules live in `CLAUDE.md` (also referenced from `AGENTS.md`).
