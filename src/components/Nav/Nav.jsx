import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Nav.css'

const LINKS = [
  { to: '/about', key: 'about', label: 'About' },
  { to: '/events', key: 'events', label: 'Events' },
  { to: '/blog', key: 'blog', label: 'News' },
  { to: '/resources', key: 'resources', label: 'Resources' },
  { to: '/team', key: 'team', label: 'Team' },
  { to: '/sponsors', key: 'sponsors', label: 'Partners' },
  { to: '/#contact', key: 'contact', label: 'Contact' },
]

export default function Nav({ activePage }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-locked', open)
    return () => document.body.classList.remove('nav-locked')
  }, [open])

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="UKAP Foundation home">
          <img src="/brand/ukap-mark.png" alt="" width="34" height="46" />
          <span className="nav-logo-word">
            UKAP
            <em>Foundation</em>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <div className="nav-links" id="nav-menu">
          {LINKS.map((l) => (
            <Link key={l.key} to={l.to} className={activePage === l.key ? 'active' : ''}>
              {l.label}
            </Link>
          ))}
          <Link to="/donate" className={`nav-donate ${activePage === 'donate' ? 'active' : ''}`}>
            Donate
          </Link>
        </div>
      </div>
    </nav>
  )
}
