import { Link } from 'react-router-dom'
import './ActionCards.css'

const CARDS = [
  {
    title: 'Scholarships',
    text: 'Merit- and needs-based awards that help young people take the next step in their education — including 11 awarded with the CFA Institute.',
    image: '/images/graduate-yellow.jpg',
    cta: 'Find out more',
    to: '/about',
    btn: 'solid-blue',
  },
  {
    title: 'Become a mentor',
    text: 'Share your experience with a student or graduate starting out. Our volunteers span finance, law, tech, healthcare and more.',
    image: '/images/mentor-chat.jpg',
    cta: 'Get involved',
    to: '/#contact',
    btn: 'solid-blue',
  },
  {
    title: 'Give a brighter future',
    text: 'Every gift funds scholarships, mentoring and events. With Gift Aid, every £1 you give is worth £1.25.',
    image: '/images/celebrate.jpg',
    cta: 'Donate now',
    to: '/donate',
    btn: 'solid-red',
  },
]

export default function ActionCards() {
  return (
    <section className="action-cards">
      <div className="container action-grid">
        {CARDS.map((c) => (
          <article key={c.title} className="card">
            <div className="card-media">
              <img src={c.image} alt="" loading="lazy" />
            </div>
            <div className="card-body">
              <h2 className="card-title">{c.title}</h2>
              <p className="card-text">{c.text}</p>
              <Link to={c.to} className={`btn-sm ${c.btn}`}>{c.cta}</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
