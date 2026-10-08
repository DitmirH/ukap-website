# Design concepts

Mockups agreed with the UKAP team (October 2026). Static images.

Status: **events list / poster cards — built** (`EventCard`, `WhatsOn`, `/events` archive, Sanity `eventsSection`, 15-colour picker). **Event detail page — not built yet.**
Build from them following `docs/BRAND.md`.

## Event page — `/events/{slug}` — APPROVED

| File | What |
|---|---|
| `event-page/00-FINAL-desktop.jpg` | **Final concept — desktop (build from this)** |
| `event-page/00-FINAL-mobile.jpg` | **Final concept — mobile** |
| `event-page/01-approved-event-page.jpg` | Earlier approved layout (same design) |
| `event-page/02-header-colour-options.jpg` | Examples of the selectable header-card colour |
| `event-page/03-speaker-colour-picker.jpg` | Studio colour picker + speaker card colour examples |
| `event-page/alt-B-event-launch.jpg`, `alt-C-editorial.jpg` | Alternatives that were **not** chosen (reference only) |

### Page structure (top to bottom)
1. **Header** — full-width event photo with an overlapping colour card: breadcrumbs, category tag, uppercase title, "date · time · venue" line. Card colour is chosen per event (see palette). Default: Red · Main.
2. **Intro** — event summary (`excerpt`) as a large lead line, then the rich-text `body`. No "Who should attend" heading.
3. **Speakers** — one card per speaker, full width: **photo on the left**; on the right a solid colour panel with **name** (uppercase display heading), **role** (bold, with a rule underneath), **profile overview**, optional LinkedIn link. Panel colour chosen per speaker; text colour auto black/white for contrast; name turns gold on Black · Main / Black · Lighter; white/off-white panels get a thin border. If no colour is set, cycle coral → black → gold.
4. **Agenda** — rows: time (display numerals) + optional duration, session title, optional description, chips of the speakers in that session.
5. **Getting there** — map + venue name, address, "Open in Google Maps" (`mapLink`).
6. **Buy tickets band** — black band with gold top border: "Tickets from £X" tag, event name in gold, date · time · venue, coral **Buy tickets** button → `ticketLink`. Hidden when there's no ticket link, or the event is sold out / cancelled / past.

**No** sticky/sidebar ticket panel. **No** speaker pop-up.

Speakers, Agenda and Getting there each hide when empty.

### Sanity changes required — ONE document, no separate components

Everything for an event page is configured inside the existing **Event** document
(Studio → **Pages → Events**). **No separate Speaker document or component** — speakers and
agenda items are entered inline on the event. Existing events keep working; all new fields are
optional.

Organise the Event form into tabs (field groups) so it stays manageable:

| Tab | Fields |
|---|---|
| **Basics** | `title`, `slug`, `date`, `endDate`, `time`, `category`, `status`, `featured`, `hidden` (existing) |
| **Header** | `image` (existing), `headerColour` (palette swatch, default Red · Main) |
| **Content** | `excerpt`, `body` (existing) |
| **Speakers** | `speakers[]` — inline objects: `name`, `role`, `overview`, `image` (hotspot), `linkedIn` (optional), `cardColour` (palette swatch, optional). Drag to reorder. |
| **Agenda** | `agenda[]` — inline objects: `time`, `duration` (optional), `title`, `description` (optional), `speakerNames[]` (pick from this event's speakers) |
| **Venue** | `venue`, `address`, `mapLink` (existing) |
| **Tickets** | `ticketLink`, `ticketPrice`, `isFree` (existing) — drive the Buy-tickets band |

Colour fields use one shared custom swatch input showing the 15 colours below.

### Palette (15 swatches — Main / Lighter / Softest from the brand guide; Black and White rows added)
| | Main | Lighter | Softest |
|---|---|---|---|
| Blue | #3F7EC2 | #55ADFA | #CCE9FC |
| Red | #DB4A47 | #E06E71 | #F3C9CB |
| Gold | #E2BE74 | #F8DCA0 | #FCF0D7 |
| Black | #0B0B0C | #3A3B3F | #6B6E75 |
| White | #FFFFFF | #F5F3EE | #EDEAE3 |

Store a stable key (e.g. `blue-main`, `gold-lighter`) rather than the hex, and map keys → hex in code, so the palette can be tweaked later without editing content.

## Events cards — "What's on" — APPROVED (poster cards)

| File | What |
|---|---|
| `events-list/00-FINAL-poster-cards.jpg` | **Final — build from this** |
| `events-list/A-ticket-rows.jpg`, `C-editorial-agenda.jpg` | Alternatives not chosen (reference only) |

### Card behaviour
- Poster-style card: photo with a date badge (top-left), coloured body with category tag, uppercase
  title, short description, rule, date | time line, venue line.
- **Whole card is clickable → the linked event page** (`/events/{slug}`).
- **"More info →"** (larger text link, bottom-right) → the linked event page.
- **"Book now"** → the event's Ticket Tailor link (`ticketLink`), opens in a new tab. Hidden if there's
  no ticket link or the event is sold out / cancelled / past.
- Hover: card lifts slightly, photo zooms, arrow nudges right.

### Sanity — "Events cards" component (Studio → Components)
One configurable component (no separate sub-components):
- `title` — section heading (default "What's on")
- `cards[]` — each card:
  - **`eventPage`** — **reference: pick an existing Event page** (Pages → Events). Required.
    The card links to it and pulls title, date, time, venue, image, summary, category and ticket
    link from it automatically.
  - `cardColour` — palette swatch (15 colours). Default cycles coral → black → gold.
  - Optional overrides: `titleOverride`, `descriptionOverride`, `imageOverride` (only if the card
    should differ from the event page).
- `showAutomatically` (boolean) — alternative mode: show the next N upcoming events with no manual
  picking (`limit`, default 3).

## Events list — earlier options (superseded by poster cards above)
| File | Concept |
|---|---|
| `events-list/A-ticket-rows.jpg` | Full-width rows: black date block, photo, uppercase title, details, buttons; Upcoming / Past groups |
| `events-list/B-poster-cards.jpg` | Poster-style cards in gold / black / coral with a gold date badge (suggested for the homepage) |
| `events-list/C-editorial-agenda.jpg` | Giant date numerals, gold month bands, thin rules |
