/** Shown when there are no upcoming events. */
export default function EventsEmpty({ title = 'New events are on the way' }) {
  return (
    <div className="events-empty-block">
      <span className="events-empty-mark" aria-hidden="true" />
      <div>
        <p className="events-empty-title">{title}</p>
        <p>
          We&rsquo;re planning the next season of panels, workshops and flagship evenings.
          Follow us on{' '}
          <a href="https://www.linkedin.com/company/ukapfoundation/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {' '}or{' '}
          <a href="https://www.instagram.com/ukapfoundation/" target="_blank" rel="noopener noreferrer">Instagram</a>
          {' '}to hear first.
        </p>
      </div>
    </div>
  )
}
