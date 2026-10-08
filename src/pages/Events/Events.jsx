import { Nav, Footer, PageHeader } from '../../components'
import EventsList from '../../components/EventsList'
import './Events.css'

export default function Events() {
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

