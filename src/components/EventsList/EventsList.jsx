import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { client, urlFor } from '../../lib/sanityClient'
import './EventsList.css'

export default function EventsList({ 
  title = 'Upcoming Events',
  showPastEvents = false,
  limit,
  category,
  style = 'timeline',
  showViewAll = true,
  events: propEvents // Allow passing events directly
}) {
  const [events, setEvents] = useState(propEvents || [])
  const [loading, setLoading] = useState(!propEvents)
  const [expandedEvent, setExpandedEvent] = useState(null)

  useEffect(() => {
    if (propEvents) return

    // Get today's date at midnight for comparison
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()
    
    const hiddenFilter = `&& hidden != true`
    const dateFilter = showPastEvents ? '' : `&& date >= "${todayISO}"`
    const categoryFilter = category ? `&& category == "${category}"` : ''
    const limitClause = limit ? `[0...${limit}]` : ''

    client
      .fetch(
        `*[_type == "event" ${hiddenFilter} ${dateFilter} ${categoryFilter}] | order(date asc) ${limitClause} {
          _id,
          title,
          slug,
          date,
          endDate,
          time,
          venue,
          address,
          excerpt,
          image,
          ticketLink,
          ticketPrice,
          isFree,
          category,
          featured,
          status
        }`
      )
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [propEvents, showPastEvents, limit, category])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-GB', { month: 'short' }),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      weekday: date.toLocaleDateString('en-GB', { weekday: 'long' }),
    }
  }

  const toggleExpand = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId)
  }

  if (loading) {
    return <div className="events-loading">Loading events...</div>
  }

  if (events.length === 0) {
    return (
      <div className="events-empty">
        <p>No upcoming events at the moment.</p>
        <p>Check back soon!</p>
      </div>
    )
  }

  return (
    <div className={`events-list style-${style}`}>
      {title && <h2 className="events-title">{title}</h2>}
      
      <div className="events-container">
        {events.map((event) => {
          const date = formatDate(event.date)
          const isExpanded = expandedEvent === event._id
          const isPast = new Date(event.date) < new Date()
          
          return (
            <article 
              key={event._id} 
              className={`event-item ${isPast ? 'past' : ''} ${event.featured ? 'featured' : ''} ${event.status ? `status-${event.status}` : ''}`}
            >
              {/* Timeline Style */}
              {style === 'timeline' && (
                <>
                  <div className="event-date-column">
                    <time className="event-date">
                      <span className="date-day">{date.day}</span>
                      <span className="date-month">/{String(new Date(event.date).getMonth() + 1).padStart(2, '0')}</span>
                      <span className="date-year">/{date.year}</span>
                    </time>
                    {isPast && !event.status && <span className="date-past-label">Past</span>}
                  </div>
                  
                  <div className="event-content">
                    <h3 className="event-name">
                      <Link to={`/events/${event.slug?.current}`}>{event.title}</Link>
                      {event.status === 'sold-out' && <span className="status-badge sold-out">Sold Out</span>}
                      {event.status === 'cancelled' && <span className="status-badge cancelled">Cancelled</span>}
                      {event.status === 'postponed' && <span className="status-badge postponed">Postponed</span>}
                    </h3>
                    
                    {event.excerpt && (
                      <p className="event-excerpt">{event.excerpt}</p>
                    )}
                    
                    <button 
                      className="event-toggle"
                      onClick={() => toggleExpand(event._id)}
                    >
                      {isExpanded ? '− Hide Details' : '+ Event Details'}
                    </button>
                    
                    {isExpanded && (
                      <div className="event-details">
                        {event.time && (
                          <p className="event-time">🕐 {event.time}</p>
                        )}
                        {event.address && (
                          <p className="event-address">📍 {event.address}</p>
                        )}
                        {(event.ticketPrice || event.isFree) && (
                          <p className="event-price">
                            🎟️ {event.isFree ? 'Free' : event.ticketPrice}
                          </p>
                        )}
                        {event.ticketLink && event.status === 'upcoming' && (
                          <a 
                            href={event.ticketLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="event-ticket-btn"
                          >
                            Get Tickets →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="event-venue-column">
                    {event.venue && <span className="event-venue">{event.venue}</span>}
                  </div>
                </>
              )}

              {/* Cards Style */}
              {style === 'cards' && (
                <div className="event-card">
                  {event.image && (
                    <div className="event-card-image">
                      <img src={urlFor(event.image).width(400).height(250).url()} alt={event.title} />
                      {event.category && (
                        <span className="event-category">{event.category}</span>
                      )}
                    </div>
                  )}
                  <div className="event-card-content">
                    <time className="event-card-date">
                      {date.weekday}, {date.full}
                    </time>
                    <h3 className="event-name">
                      <Link to={`/events/${event.slug?.current}`}>{event.title}</Link>
                    </h3>
                    {event.venue && <p className="event-venue">📍 {event.venue}</p>}
                    {event.excerpt && <p className="event-excerpt">{event.excerpt}</p>}
                    <div className="event-card-footer">
                      {event.isFree ? (
                        <span className="event-price free">Free</span>
                      ) : event.ticketPrice && (
                        <span className="event-price">{event.ticketPrice}</span>
                      )}
                      <Link to={`/events/${event.slug?.current}`} className="event-link">
                        Learn More →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Compact Style */}
              {style === 'compact' && (
                <Link to={`/events/${event.slug?.current}`} className="event-compact">
                  <time className="event-compact-date">{date.full}</time>
                  <span className="event-compact-title">{event.title}</span>
                  <span className="event-compact-venue">{event.venue}</span>
                </Link>
              )}
            </article>
          )
        })}
      </div>

      {showViewAll && (
        <div className="events-view-all">
          <Link to="/events" className="view-all-link">View All Events →</Link>
        </div>
      )}
    </div>
  )
}

