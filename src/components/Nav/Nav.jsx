import { Link } from 'react-router-dom'
import './Nav.css'

export default function Nav({ activePage }) {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">UKAP</Link>
      <div className="nav-links">
        <Link to="/" className={activePage === 'contact' ? 'active' : ''}>Contact</Link>
        <Link to="/events" className={activePage === 'events' ? 'active' : ''}>Events</Link>
        <Link to="/team" className={activePage === 'team' ? 'active' : ''}>Team</Link>
        <Link to="/blog" className={activePage === 'blog' ? 'active' : ''}>Blog</Link>
      </div>
    </nav>
  )
}

