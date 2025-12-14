import { Nav, Footer } from '../../components'
import EventsList from '../../components/EventsList'
import './Events.css'

export default function Events() {
  return (
    <div className="events-page">
      <Nav activePage="events" />
      
      <div className="events-hero">
        <h1>Upcoming Events</h1>
        <p>Join us at our upcoming events and be part of the UKAP community</p>
      </div>

      <div className="events-page-container">
        <EventsList 
          title=""
          style="timeline"
          showPastEvents={true}
          showViewAll={false}
        />
      </div>

      <Footer />
    </div>
  )
}

