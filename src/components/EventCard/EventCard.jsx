import { Link } from 'react-router-dom'
import { urlFor } from '../../lib/sanityClient'
import { swatch } from '../../lib/palette'
import './EventCard.css'

const CATEGORY_LABEL = {
  concert: 'Concert', workshop: 'Workshop', networking: 'Networking', gala: 'Gala',
  fundraiser: 'Fundraiser', exhibition: 'Exhibition', conference: 'Conference', other: 'Event',
}
const STATUS_LABEL = { 'sold-out': 'Sold out', cancelled: 'Cancelled', postponed: 'Postponed' }

const venueLine = (venue = '', address = '') => {
  const v = venue.trim()
  const a = address.trim().replace(/\s*\n\s*/g, ', ')
  if (!a) return v
  if (!v || a.toLowerCase().startsWith(v.toLowerCase())) return a
  return `${v}, ${a}`
}

/**
 * Poster-style event card.
 * - Whole card + "More info →" → /events/{slug}
 * - "Book now" → ticket link (hidden when past / sold out / cancelled / no link)
 */
export default function EventCard({ event, colour, index = 0, overrides = {} }) {
  const d = new Date(event.date)
  const isPast = d < new Date(new Date().setHours(0, 0, 0, 0))
  const sw = swatch(colour || event.cardColour, index)
  const href = `/events/${event.slug?.current || ''}`
  const title = overrides.title || event.title
  const description = overrides.description || event.excerpt
  const image = overrides.image || event.image
  const canBook = event.ticketLink && !isPast && !['sold-out', 'cancelled'].includes(event.status)

  const tag = [CATEGORY_LABEL[event.category], event.featured && !isPast ? 'Featured' : null]
    .filter(Boolean).join(' · ')
  const dateLine = [
    d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', ...(isPast ? { year: 'numeric' } : {}) }),
    event.time,
  ].filter(Boolean).join(' | ')

  // Badge contrasts with the card: gold on dark/colour cards, black on gold cards
  const goldCard = sw.key.startsWith('gold')

  return (
    <article
      className={`event-card-poster ${isPast ? 'is-past' : ''} ${sw.isLight ? 'is-light' : ''} ${sw.isDark ? 'is-dark' : ''}`}
      style={{ '--ec-bg': sw.bg, '--ec-text': sw.text, '--ec-heading': sw.heading }}
    >
      <div className="ecp-media">
        {image ? (
          <img src={urlFor(image).width(800).height(600).url()} alt="" loading="lazy" />
        ) : (
          <div className="ecp-media-fallback" aria-hidden="true"><span className="ukap-watermark" /></div>
        )}
        <div className={`ecp-badge ${goldCard ? 'on-gold' : ''}`} aria-hidden="true">
          <span className="ecp-day">{d.getDate()}</span>
          <span className="ecp-month">{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
        </div>
      </div>

      <div className="ecp-body">
        <div className="ecp-tags">
          {tag && <span className="ecp-tag">{tag}</span>}
          {STATUS_LABEL[event.status] && <span className="ecp-tag is-status">{STATUS_LABEL[event.status]}</span>}
          {isPast && !STATUS_LABEL[event.status] && <span className="ecp-tag is-status">Past event</span>}
        </div>

        <h3 className="ecp-title">
          {/* Stretched link: makes the whole card clickable */}
          <Link to={href} className="ecp-link">{title}</Link>
        </h3>
        {description && <p className="ecp-desc">{description}</p>}

        <div className="ecp-when">
          <strong>{dateLine}</strong>
          {(event.venue || event.address) && <span>{venueLine(event.venue, event.address)}</span>}
        </div>

        <div className="ecp-foot">
          {canBook ? (
            <a href={event.ticketLink} target="_blank" rel="noopener noreferrer" className="ecp-book">
              Book now
            </a>
          ) : <span />}
          <span className="ecp-more" aria-hidden="true">More info <b>→</b></span>
        </div>
      </div>
    </article>
  )
}
