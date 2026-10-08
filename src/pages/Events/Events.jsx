import { useEffect, useMemo, useState } from 'react'
import { Nav, Footer, PageHeader, EventCard } from '../../components'
import EventsEmpty from '../../components/WhatsOn/EventsEmpty'
import { client } from '../../lib/sanityClient'
import { EVENT_CARD_FIELDS, todayISO } from '../../lib/eventQueries'
import './Events.css'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState('all')

  useEffect(() => {
    client
      .fetch(`*[_type == "event" && hidden != true] | order(date asc){ ${EVENT_CARD_FIELDS} }`)
      .then((data) => setEvents(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const now = todayISO()
  const upcoming = events.filter((e) => e.date >= now)
  const past = useMemo(
    () => events.filter((e) => e.date < now).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [events, now]
  )
  const years = useMemo(
    () => [...new Set(past.map((e) => new Date(e.date).getFullYear()))].sort((a, b) => b - a),
    [past]
  )
  const archive = year === 'all' ? past : past.filter((e) => new Date(e.date).getFullYear() === year)

  return (
    <div className="events-page">
      <Nav activePage="events" />

      <PageHeader
        tone="coral"
        photo="/images/audience.jpg"
        eyebrow="Events"
        title={<>Learn, connect and <span className="accent">grow</span></>}
        subtitle="Panels, workshops, webinars and flagship evenings that connect young people with industry leaders."
        crumbs={[{ label: 'Events' }]}
      />

      {/* Upcoming */}
      <section className="section">
        <div className="container">
          <h2 className="section-title events-group-title">What&rsquo;s on</h2>
          {loading ? (
            <p className="loading">Loading events…</p>
          ) : upcoming.length > 0 ? (
            <div className="event-card-grid">
              {upcoming.map((e, i) => <EventCard key={e._id} event={e} index={i} />)}
            </div>
          ) : (
            <EventsEmpty />
          )}
        </div>
      </section>

      {/* Archive */}
      {!loading && past.length > 0 && (
        <section className="section section-alt events-archive" id="archive">
          <div className="container">
            <div className="events-archive-head">
              <h2 className="section-title events-group-title">Archive</h2>
              <div className="year-filter" role="tablist" aria-label="Filter past events by year">
                <button
                  role="tab"
                  aria-selected={year === 'all'}
                  className={year === 'all' ? 'active' : ''}
                  onClick={() => setYear('all')}
                >
                  All years <span>{past.length}</span>
                </button>
                {years.map((y) => (
                  <button
                    key={y}
                    role="tab"
                    aria-selected={year === y}
                    className={year === y ? 'active' : ''}
                    onClick={() => setYear(y)}
                  >
                    {y} <span>{past.filter((e) => new Date(e.date).getFullYear() === y).length}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="event-card-grid">
              {archive.map((e, i) => <EventCard key={e._id} event={e} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
