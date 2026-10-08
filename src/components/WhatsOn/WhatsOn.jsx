import { useEffect, useState } from 'react'
import { client } from '../../lib/sanityClient'
import { EVENT_CARD_FIELDS, todayISO } from '../../lib/eventQueries'
import EventCard from '../EventCard'
import SectionHead from '../SectionHead'
import EventsEmpty from './EventsEmpty'
import './WhatsOn.css'

/**
 * Homepage "What's on" — driven by the Sanity "What's On (Events cards)" document.
 * Hand-picked mode: shows the chosen event pages (with optional overrides).
 * Automatic mode (default, or when no document exists): next N upcoming events.
 */
export default function WhatsOn() {
  const [state, setState] = useState({ loading: true, title: "What's on", viewAll: 'All events', cards: [] })

  useEffect(() => {
    const now = todayISO()
    client
      .fetch(
        `{
          "section": *[_type == "eventsSection"] | order(_updatedAt desc)[0]{
            title, mode, limit, viewAllLabel,
            cards[]{ cardColour, titleOverride, descriptionOverride, imageOverride, event->{ ${EVENT_CARD_FIELDS}, hidden } }
          },
          "upcoming": *[_type == "event" && hidden != true && date >= $now] | order(date asc)[0...12]{ ${EVENT_CARD_FIELDS} }
        }`,
        { now }
      )
      .then(({ section, upcoming }) => {
        let cards
        if (section?.mode === 'manual' && section.cards?.length) {
          cards = section.cards
            .filter((c) => c.event && !c.event.hidden)
            .map((c) => ({
              event: c.event,
              colour: c.cardColour,
              overrides: { title: c.titleOverride, description: c.descriptionOverride, image: c.imageOverride },
            }))
        } else {
          cards = (upcoming || []).slice(0, section?.limit || 3).map((e) => ({ event: e }))
        }
        setState({
          loading: false,
          title: section?.title || "What's on",
          viewAll: section?.viewAllLabel || 'All events',
          cards,
        })
      })
      .catch((err) => {
        console.error(err)
        setState((s) => ({ ...s, loading: false }))
      })
  }, [])

  return (
    <section className="whats-on section">
      <div className="container">
        <SectionHead title={state.title} action={{ to: '/events', label: state.viewAll }} />
        {state.loading ? (
          <div className="event-card-grid whats-on-skeleton" aria-hidden="true"><span /><span /><span /></div>
        ) : state.cards.length > 0 ? (
          <div className="event-card-grid">
            {state.cards.map((c, i) => (
              <EventCard key={c.event._id + i} event={c.event} colour={c.colour} overrides={c.overrides} index={i} />
            ))}
          </div>
        ) : (
          <EventsEmpty />
        )}
      </div>
    </section>
  )
}
