import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { client, urlFor } from '../../lib/sanityClient'
import './ProgrammesGrid.css'

// Fallback cards (from the current ukapfoundation.org homepage strip),
// shown until Programme documents are published in Sanity.
const FALLBACK = [
  {
    _id: 'fallback-scholarships',
    title: 'Scholarships',
    description:
      'Merit-based and needs-based scholarships that enable young adults to pursue academic excellence and unlock educational pathways.',
    color: 'blue',
  },
  {
    _id: 'fallback-mentoring',
    title: 'Mentoring',
    description:
      'Develop personal and professional skills, and kick-start or advance your career through our mentorship scheme.',
    color: 'red',
  },
  {
    _id: 'fallback-training',
    title: 'Educational & Skills Training',
    description:
      'Interactive workshops, panels and training sessions to grow skills, knowledge and potential.',
    color: 'gold',
  },
  {
    _id: 'fallback-networking',
    title: 'Networking',
    description:
      'Promote learning, support and growth through collaboration and active participation. Celebrate achievements and instil pride in learning.',
    color: 'blue',
  },
]

function CardBody({ programme }) {
  return (
    <>
      {programme.image && (
        <div className="programme-image">
          <img
            src={urlFor(programme.image).width(500).height(280).url()}
            alt={programme.title}
          />
        </div>
      )}
      <div className="programme-content">
        <h3 className="programme-title">{programme.title}</h3>
        <p className="programme-description">{programme.description}</p>
        {programme.link && <span className="programme-more">Learn more →</span>}
      </div>
    </>
  )
}

export default function ProgrammesGrid() {
  const [programmes, setProgrammes] = useState(FALLBACK)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "programme" && hidden != true] | order(order asc) {
          _id, title, description, image, color, link
        }`
      )
      .then((data) => {
        if (data?.length > 0) setProgrammes(data)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <section className="programmes-section">
      <h2 className="section-title">What we <span className="accent">do</span></h2>
      <p className="programmes-subtitle">
        We advance education for the public benefit through our core programmes
      </p>

      <div className="programmes-grid">
        {programmes.map((programme) => {
          const color = programme.color || 'gold'
          const className = `programme-card color-${color}`

          if (programme.link) {
            const isExternal = programme.link.startsWith('http')
            return isExternal ? (
              <a
                key={programme._id}
                href={programme.link}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                <CardBody programme={programme} />
              </a>
            ) : (
              <Link key={programme._id} to={programme.link} className={className}>
                <CardBody programme={programme} />
              </Link>
            )
          }

          return (
            <div key={programme._id} className={className}>
              <CardBody programme={programme} />
            </div>
          )
        })}
      </div>

      <div className="programmes-cta">
        <h3>Join our team of volunteers</h3>
        <p>
          Join us in making a difference in our community. We believe in the
          power of volunteering to create positive change.
        </p>
        <Link to="/" className="btn-primary">Get in touch</Link>
      </div>
    </section>
  )
}
