import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { Nav, Footer, EmbedCode, PageHeader } from '../../components'
import { client, urlFor } from '../../lib/sanityClient'
import './EventDetail.css'

const portableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure className="event-body-image">
        <img src={urlFor(value).width(800).url()} alt={value.alt || ''} />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
    embedCode: ({ value }) => (
      <EmbedCode code={value.code} title={value.title} />
    ),
  },
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
  },
}

export default function EventDetail() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "event" && slug.current == $slug][0]{
          _id,
          title,
          date,
          endDate,
          time,
          venue,
          address,
          mapLink,
          excerpt,
          image,
          body,
          ticketLink,
          ticketPrice,
          isFree,
          category,
          status
        }`,
        { slug }
      )
      .then((data) => {
        setEvent(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="event-detail-page">
        <Nav activePage="events" />
        <div className="event-detail-container">
          <p className="loading">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="event-detail-page">
        <Nav activePage="events" />
        <div className="event-detail-container">
          <h1>Event not found</h1>
          <Link to="/events" className="back-link">← Back to events</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const isPast = new Date(event.date) < new Date()

  return (
    <div className="event-detail-page">
      <Nav activePage="events" />
      
      <PageHeader
        tone="red"
        eyebrow={[event.category, isPast ? 'Past event' : null].filter(Boolean).join(' · ') || 'Event'}
        title={
          <>
            {event.title}
            {event.status === 'sold-out' && <span className="status-tag sold-out">Sold Out</span>}
            {event.status === 'cancelled' && <span className="status-tag cancelled">Cancelled</span>}
            {event.status === 'postponed' && <span className="status-tag postponed">Postponed</span>}
          </>
        }
        subtitle={[formatDate(event.date), event.venue].filter(Boolean).join(' — ')}
        photo={event.image ? urlFor(event.image).width(2000).url() : '/images/audience.jpg'}
        crumbs={[{ label: 'Events', to: '/events' }, { label: event.title }]}
      />

      <div className="event-detail-container">

        <div className="event-detail-grid">
          <div className="event-main-content">
            {event.excerpt && (
              <p className="event-lead">{event.excerpt}</p>
            )}
            
            {event.body && (
              <div className="event-body">
                <PortableText value={event.body} components={portableTextComponents} />
              </div>
            )}
          </div>

          <aside className="event-sidebar">
            <div className="event-info-card">
              <h3>Event Details</h3>
              
              <div className="info-item">
                <span className="info-icon">📅</span>
                <div>
                  <strong>Date</strong>
                  <p>{formatDate(event.date)}</p>
                  {event.endDate && <p>to {formatDate(event.endDate)}</p>}
                </div>
              </div>

              {event.time && (
                <div className="info-item">
                  <span className="info-icon">🕐</span>
                  <div>
                    <strong>Time</strong>
                    <p>{event.time}</p>
                  </div>
                </div>
              )}

              {event.venue && (
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div>
                    <strong>Venue</strong>
                    <p>{event.venue}</p>
                    {event.address && <p className="address">{event.address}</p>}
                    {event.mapLink && (
                      <a href={event.mapLink} target="_blank" rel="noopener noreferrer" className="map-link">
                        View on Map →
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="info-item">
                <span className="info-icon">🎟️</span>
                <div>
                  <strong>Tickets</strong>
                  <p>{event.isFree ? 'Free Entry' : event.ticketPrice || 'See details'}</p>
                </div>
              </div>

              {/* Show ticket button only for upcoming events that aren't sold out/cancelled */}
              {event.ticketLink && !isPast && event.status !== 'sold-out' && event.status !== 'cancelled' && (
                <a 
                  href={event.ticketLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ticket-button"
                >
                  {event.isFree ? 'Register Now' : 'Get Tickets'}
                </a>
              )}

              {/* Show sold out message */}
              {event.status === 'sold-out' && !isPast && (
                <p className="event-status-notice sold-out">🔴 This event is sold out</p>
              )}

              {/* Show cancelled message */}
              {event.status === 'cancelled' && (
                <p className="event-status-notice cancelled">❌ This event has been cancelled</p>
              )}

              {/* Show postponed message */}
              {event.status === 'postponed' && (
                <p className="event-status-notice postponed">⏸️ This event has been postponed</p>
              )}

              {/* Show past event message (only if not cancelled) */}
              {isPast && event.status !== 'cancelled' && (
                <p className="event-past-notice">This event has already taken place.</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}

