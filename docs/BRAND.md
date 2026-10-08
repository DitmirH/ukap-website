# UKAP Foundation — Brand Guidelines for the Web

The source of truth is **"UKAP Foundation Brand Identity" by Betsu Works (2025)** — a Canva document
(cover, scope, The Foundation(s), Logotype, Colour Palette, Typography, Collateral). This file
translates that guide into rules for this website. If you change the site's look, follow this file;
if this file and the Betsu Works guide disagree, raise it with the UKAP team rather than guessing.

**Reference copies of the guide pages are in [`docs/brand-guide/`](./brand-guide/)** (screenshots of
the Canva document — look at them before making visual decisions):

| File | Page |
|---|---|
| `01-cover.png` | Cover — gold vertical strip, black field, outline "UKAP" letters, "BRAND IDENTITY" lockup |
| `02-scope.png` | Scope of the guide |
| `03-the-foundations.png` | The Foundation(s) — story, mission, brand character (coral highlight block) |
| `04-logotype.png` | Logotype — full colour, positive and negative monochrome, icon-only |
| `05-colour-palette.png` | Colour palette — primary, lighter variant, softest tint (note: hex labels don't match swatches, see §2) |
| `06-typography.png` | Typography — Segoe Pro Display Bold / Semibold / Light |
| `07-collateral.png` | Collateral examples (leaflets/posters — style reference only, photos are not for the site) |

If you get the original Canva/PDF export, add it to that folder too.

All values below live as CSS custom properties in `src/styles/index.css`. **Never hard-code a hex
value in a component** — use the token.

---

## 1. Brand character

From the guide: the identity balances **tradition and momentum**. It "doesn't shout, but doesn't
fade into the background". Bold, austere, clear, authoritative — young and forward-looking, never
nostalgic. In practice for the web:

- Flat colour **blocks**, square corners, no gradients, no glows, no soft drop shadows.
- Big, heavy, condensed **uppercase** headings.
- Strong contrast: gold against black, black type on gold.
- Photography of real people, overlapped by solid colour cards (see §6).

---

## 2. Colour

### The rendered palette (what we use)

The guide's swatches and its printed hex labels **do not match** (e.g. the blue swatch is labelled
`#02537e` but renders as a bright logo blue; two "lighter variant" labels are swapped). The site
follows the colours **as they actually appear** in the guide, the logo and the printed collateral.

| Role | Token | Hex | Use |
|---|---|---|---|
| **Gold** (lead) | `--ukap-gold` | `#E2BE74` | Brand backgrounds, contact panel, buttons on black, vertical strip, headline colour on black |
| Gold light | `--ukap-gold-light` | `#F8DCA0` | Subtle fills |
| Gold soft | `--ukap-gold-soft` | `#FCF0D7` | Alternate section background (`--color-bg-alt`) |
| Gold deep | `--ukap-gold-deep` | `#8A6A24` | Gold-family **text** on light backgrounds |
| **Black** (lead) | `--ukap-black` | `#0B0B0C` | Hero card, impact band, footer, primary buttons, headings |
| **Blue** (accent) | `--ukap-blue` | `#3F7EC2` | Logo blue. Accents: stat rules, bullets, focus ring, tags |
| Blue deep | `--ukap-blue-deep` | `#1F4F86` | **Text-safe** blue: links, "Read more", blue text on white |
| Blue soft | `--ukap-blue-soft` | `#CCE9FC` | Info tiles, empty states |
| **Coral** (accent) | `--ukap-red` | `#DB4A47` | Logo red. Highlight blocks, Donate buttons, coral header cards |
| Coral deep | `--ukap-red-deep` | `#B5322F` | **Text-safe** coral: dates, labels, errors on white |
| Coral soft | `--ukap-red-soft` | `#F3C9CB` | Tinted tiles |
| White | `--ukap-white` | `#FFFFFF` | Page background, cards |

Legacy names `--ukap-yellow*` are aliases of gold — prefer `--ukap-gold*` in new code.

Meaning carried over from the guide: **blue = professional / academic / formal**, **coral =
mentorship / student / festive**, **gold = generic / everything else**.

### Colour rules

1. **Gold and black lead; blue and coral are accents.** A page should read as gold + black first.
   Don't build large blue surfaces.
2. **Gold is always paired with black text** (never white on gold).
3. On **black**, headings are gold and body text is white.
4. On **coral**, text is black.
5. **Never set small text in `--ukap-blue` or `--ukap-red` on white** — both fail WCAG AA at body
   sizes. Use `--ukap-blue-deep` / `--ukap-red-deep` for text; keep the bright versions for
   fills, rules and large display type.
6. The three-colour bar (`.tri-bar`, blue · coral · gold) is the only multi-colour device. No gradients.

---

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Body, UI | **Selawik** (`--font-sans`) | Microsoft's free, metric-compatible stand-in for the brand face **Segoe Pro Display**. Self-hosted in `public/fonts/` (light 300, regular 400, semibold 600, bold 700). |
| Big headings | **Archivo** variable, weight ~850, width ~78% (`--font-display`) | Matches the heavy condensed lockups in the guide ("BRAND IDENTITY"). Self-hosted `public/fonts/archivo-wdth.woff2` (OFL). |

Guide weights → web: **Bold** = headings and emphasis, **Semibold** = subheadings and important
text, **Light** = body copy and small details.

Rules:
- Section, page, hero and banner titles are **UPPERCASE** in the display face. The classes
  `.section-title`, `.page-title`, `.hero-title`, `.php-title`, `.phb-title`, `.fb-title` and
  `.display` get this automatically.
- Card titles and body copy stay in Selawik, sentence case.
- Small caps-style labels use `.eyebrow` (tracked uppercase with a square colour marker).

---

## 4. Logo

Assets are in `public/brand/` (extracted from the brand deck; ~350px PNGs — replace with SVGs from
Betsu Works when available):

| File | What | Where it's used |
|---|---|---|
| `ukap-logo.png` | Full colour lockup (icon + "UKAP FOUNDATION" in a square frame) | Source/reference |
| `ukap-logo-white.png` | Negative monochrome lockup | Footer |
| `ukap-mark.png` | Icon only (U blue, K black / A black, P coral) | Nav, vertical strip, password page |
| `ukap-outline.png` | Outline "UKAP" letterforms | Background watermark (`.ukap-watermark`, tinted via CSS mask) |
| `favicon-64.png`, `apple-touch-icon.png` | Favicons | `index.html` |

Rules from the guide:
- **Full colour** is the standard for official use; **black monochrome** and **white negative**
  versions are for specific contexts and dark backgrounds.
- The **icon-only** version is for compact layouts (the nav uses it next to a typeset wordmark).
- Don't recolour, stretch, rotate or add effects to the logo. Don't rebuild it in live text.

---

## 5. Signature patterns

These are what make the site recognisably UKAP. Reuse them; don't invent new decorative devices.

| Pattern | Where in the guide | Implementation |
|---|---|---|
| **Highlight block** — a coral block behind a key word in a heading | "The **Foundation(s)**", "Registered **Charity**" | `<span className="accent">word</span>` (coral, black text). On a coral background it flips to black. |
| **Vertical brand strip** — gold band with the icon and "UKAP FOUNDATION" set vertically | Cover, Collateral page | `<BrandStrip />` (`src/components/BrandStrip`). Used in the footer only (removed from the homepage hero at the owner's request); hidden on mobile. |
| **Outline monogram** — huge outline "UKAP" letters | Cover background | `.ukap-watermark` (CSS mask over `ukap-outline.png`; set `color` to tint). |
| **Three-colour bar** | Logo colours | `<div className="tri-bar"><span/><span/><span/></div>` |
| **Square blocks** | Throughout | Radii tokens are 2–4px; keep everything square. |

---

## 6. Layout language (website)

The page layouts follow a charity-site pattern (reference: oxfam.org.uk) expressed in UKAP colours:

- **Photo + overlapping colour card**: full-bleed photo with a solid card hanging over its bottom
  edge — homepage hero (`HeroCarousel`), every inner page header (`PageHeader` with `photo`), and
  feature banners (`FeatureBanner`).
- **Cards**: image on top, white body, black title, short text, one solid button (`.card`).
- **Section headings**: uppercase display title, optional "View all →" link on the right
  (`SectionHead`).
- **Bands**: full-width black impact band with gold numbers; gold contact panel.

Header card tones per page (keep the mix — don't make every page the same colour):

| Page | Tone |
|---|---|
| Home hero (brand slide) | black, gold title |
| About, Team, blog posts, custom & legal pages | black |
| News, Partners | gold |
| Events, event pages, Donate | coral |

---

## 7. Photography

- Real people, warm and candid: students, graduates, mentors, panels and events.
- `public/images/` currently holds **free-licence stock placeholders** (Pexels/Unsplash) — see
  `public/images/CREDITS.md`. Replace them with real UKAP event photography using the same file
  names (landscape, ~2000px wide, compressed JPEG).
- Avoid images with text baked in. Avoid low-resolution or square graphics as header images
  (blog/event headers fall back to a side image when the Sanity image is < 1000px wide).

---

## 8. Voice

From the guide: serious and steady, but young and forward-looking. Signals integrity, access to
opportunity and empowerment. Short, plain sentences; active verbs; UK English (organisation,
programme, colour).

---

## 9. Checklist before shipping a visual change

- [ ] Colours come from tokens; gold + black dominate the page.
- [ ] No small text in bright blue or coral on white.
- [ ] Big headings are uppercase display face; highlight word uses `.accent`.
- [ ] Corners square, no gradients/glows/shadows added.
- [ ] Checked at 1440px and 390px wide.
