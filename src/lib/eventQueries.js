/** Shared GROQ projection for event cards. */
export const EVENT_CARD_FIELDS = `
  _id, title, slug, date, time, venue, address, excerpt, image,
  ticketLink, ticketPrice, isFree, category, featured, status, cardColour
`

/** Start of today (UTC ISO) — events on or after this are "upcoming". */
export const todayISO = () => {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return t.toISOString()
}
