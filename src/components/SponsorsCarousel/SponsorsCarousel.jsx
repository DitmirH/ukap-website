import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { client, urlFor } from '../../lib/sanityClient'
import './SponsorsCarousel.css'

export default function SponsorsCarousel() {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "sponsor" && hidden != true] | order(tier asc, order asc) {
          _id,
          name,
          logo,
          website
        }`
      )
      .then((data) => {
        setSponsors(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading || sponsors.length === 0) {
    return null
  }

  // Duplicate sponsors for seamless infinite scroll
  const duplicatedSponsors = [...sponsors, ...sponsors]

  return (
    <section className="sponsors-carousel-section">
      <h3 className="sponsors-carousel-title">Our Sponsors & Partners</h3>
      
      <div className="sponsors-carousel-wrapper">
        <div className="sponsors-carousel-track">
          {duplicatedSponsors.map((sponsor, index) => (
            <div key={`${sponsor._id}-${index}`} className="sponsor-slide">
              {sponsor.website ? (
                <a 
                  href={sponsor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="sponsor-logo-link"
                  title={sponsor.name}
                >
                  {sponsor.logo && (
                    <img 
                      src={urlFor(sponsor.logo).width(180).height(100).fit('max').url()} 
                      alt={sponsor.logo.alt || sponsor.name} 
                    />
                  )}
                </a>
              ) : (
                <div className="sponsor-logo-link" title={sponsor.name}>
                  {sponsor.logo && (
                    <img 
                      src={urlFor(sponsor.logo).width(180).height(100).fit('max').url()} 
                      alt={sponsor.logo.alt || sponsor.name} 
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Link to="/sponsors" className="sponsors-view-all">
        View all sponsors →
      </Link>
    </section>
  )
}

