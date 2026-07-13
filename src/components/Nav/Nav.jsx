import { Link } from 'react-router-dom'
import './Nav.css'

export default function Nav({ activePage }) {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo" aria-label="UKAP Foundation home">
        {/* Stacked 2×2 brand mark: U(blue) K / A P(red) */}
        <span className="nav-logo-mark" aria-hidden="true">
          <span className="l-blue">U</span><span>K</span><span>A</span><span className="l-red">P</span>
        </span>
        <span className="nav-logo-word">UKAP<em>Foundation</em></span>
      </Link>
      <div className="nav-links">
        <Link to="/about" className={activePage === 'about' ? 'active' : ''}>About</Link>
        <Link to="/" className={activePage === 'contact' ? 'active' : ''}>Contact</Link>
        <Link to="/events" className={activePage === 'events' ? 'active' : ''}>Events</Link>
        <Link to="/sponsors" className={activePage === 'sponsors' ? 'active' : ''}>Sponsors</Link>
        <Link to="/team" className={activePage === 'team' ? 'active' : ''}>Team</Link>
        <Link to="/blog" className={activePage === 'blog' ? 'active' : ''}>Blog</Link>
        <Link to="/donate" className={`nav-donate ${activePage === 'donate' ? 'active' : ''}`}>Donate</Link>
      </div>
    </nav>
  )
}
