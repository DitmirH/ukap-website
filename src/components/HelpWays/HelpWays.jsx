import { Link } from 'react-router-dom'
import './HelpWays.css'

const WAYS = [
  {
    tag: 'Give',
    tone: 'red',
    image: '/images/graduates-red.jpg',
    title: 'Fund a scholarship',
    cta: 'Donate',
    to: '/donate',
  },
  {
    tag: 'Volunteer',
    tone: 'blue',
    image: '/images/volunteers.jpg',
    title: 'Mentor, teach or host an event',
    cta: 'Volunteer with us',
    to: '/#contact',
  },
  {
    tag: 'Partner',
    tone: 'yellow',
    image: '/images/partners.jpg',
    title: 'Partner with UKAP as an organisation',
    cta: 'Become a partner',
    to: '/sponsors',
  },
]

export default function HelpWays() {
  return (
    <section className="help-ways section">
      <div className="container">
        <h2 className="section-title kicker-title">
          <span className="kicker">Your support makes it possible</span>
          You can help, in your way
        </h2>

        <div className="help-grid">
          {WAYS.map((w) => (
            <article key={w.title} className="card help-card">
              <div className="card-media">
                <img src={w.image} alt="" loading="lazy" />
                <span className={`card-tag tone-${w.tone}`}>{w.tag}</span>
              </div>
              <div className="card-body">
                <h3 className="help-title">{w.title}</h3>
                <Link to={w.to} className="btn-sm outline-blue">{w.cta}</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="help-strap">
          <p><strong>Volunteer. Mentor. Partner.</strong> … discover more ways to give your time.</p>
          <Link to="/#contact" className="btn-sm solid-blue">Get involved</Link>
        </div>
      </div>
    </section>
  )
}
