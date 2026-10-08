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

// Placeholder photography per programme until CMS images are added
const photoFor = (title = '') => {
  const t = title.toLowerCase()
  if (t.includes('scholar')) return '/images/scholarships.jpg'
  if (t.includes('mentor')) return '/images/mentoring.jpg'
  if (t.includes('network') || t.includes('community')) return '/images/networking.jpg'
  return '/images/training.jpg'
}

function Card({ programme }) {
  const img = programme.image
    ? urlFor(programme.image).width(600).height(700).url()
    : photoFor(programme.title)
  const link = programme.link || '/about'
  const external = /^https?:/.test(link)
  const More = external ? 'a' : Link
  const moreProps = external ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : { to: link }

  return (
    <article className="prog-card">
      <div className="prog-media">
        <img src={img} alt="" loading="lazy" />
      </div>
      <div className="prog-body">
        <h3 className="prog-title">{programme.title}</h3>
        <p className="prog-text">{programme.description}</p>
        <More {...moreProps} className="prog-more">Read more</More>
      </div>
    </article>
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
    <section className="programmes-section section">
      <div className="container">
        <h2 className="section-title">What we do</h2>
        <p className="programmes-lead">
          We advance education for the public benefit through our core programmes —
          every one designed and delivered by volunteers.
        </p>
        <div className="prog-grid">
          {programmes.map((p) => <Card key={p._id} programme={p} />)}
        </div>
      </div>
    </section>
  )
}
