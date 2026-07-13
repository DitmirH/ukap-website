import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { client } from '../../lib/sanityClient'
import './MissionStrip.css'

// Fallback copy (from ukapfoundation.org/mission-statement) shown
// until a Mission Section document is published in Sanity.
const FALLBACK = {
  eyebrow: 'Who we are',
  heading: 'Advancing education and life opportunities',
  highlightedWord: 'education',
  body:
    'The UKAP Foundation (UK Albanian Professionals Foundation) is a UK-registered charity dedicated to advancing the education and life opportunities of young adults, particularly, but not exclusively, those of Albanian heritage. Our mission is simple: to strengthen social mobility by giving young people access to knowledge, skills and professional development opportunities.',
  ctaText: 'Learn more about us',
  ctaLink: '/about',
}

// Render heading with the highlighted word wrapped in the brand accent block
const renderHeading = (heading, highlight) => {
  if (!highlight || !heading?.toLowerCase().includes(highlight.toLowerCase())) {
    return heading
  }
  const idx = heading.toLowerCase().indexOf(highlight.toLowerCase())
  return (
    <>
      {heading.slice(0, idx)}
      <span className="accent">{heading.slice(idx, idx + highlight.length)}</span>
      {heading.slice(idx + highlight.length)}
    </>
  )
}

export default function MissionStrip() {
  const [mission, setMission] = useState(FALLBACK)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "missionSection" && active == true][0] {
          eyebrow, heading, highlightedWord, body, ctaText, ctaLink
        }`
      )
      .then((data) => {
        if (data?.heading && data?.body) setMission({ ...FALLBACK, ...data })
      })
      .catch((err) => console.error(err))
  }, [])

  const isExternal = mission.ctaLink?.startsWith('http')

  return (
    <section className="mission-strip">
      <div className="mission-inner">
        <span className="mission-eyebrow">{mission.eyebrow}</span>
        <h2 className="section-title">
          {renderHeading(mission.heading, mission.highlightedWord)}
        </h2>
        <p className="mission-body">{mission.body}</p>
        {mission.ctaText && mission.ctaLink && (
          isExternal ? (
            <a href={mission.ctaLink} target="_blank" rel="noopener noreferrer" className="view-all-link">
              {mission.ctaText}
            </a>
          ) : (
            <Link to={mission.ctaLink} className="view-all-link">
              {mission.ctaText}
            </Link>
          )
        )}
      </div>
    </section>
  )
}
