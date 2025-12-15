import { useState, useEffect } from 'react'
import { Nav, Footer } from '../../components'
import { client, urlFor } from '../../lib/sanityClient'
import './Sponsors.css'

// Social media icons
const SocialIcon = ({ type }) => {
  const icons = {
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  }
  return icons[type] || null
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSponsor, setSelectedSponsor] = useState(null)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "sponsor" && hidden != true] | order(tier asc, order asc, name asc) {
          _id,
          name,
          slug,
          logo,
          tier,
          tagline,
          description,
          website,
          email,
          phone,
          socialLinks,
          featured
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

  // Group sponsors by tier
  const tierOrder = ['platinum', 'gold', 'silver', 'bronze', 'partner', 'supporter']
  const tierLabels = {
    platinum: 'Platinum Sponsors',
    gold: 'Gold Sponsors',
    silver: 'Silver Sponsors',
    bronze: 'Bronze Sponsors',
    partner: 'Partners',
    supporter: 'Supporters',
  }

  const groupedSponsors = tierOrder.reduce((acc, tier) => {
    const tierSponsors = sponsors.filter(s => s.tier === tier)
    if (tierSponsors.length > 0) {
      acc[tier] = tierSponsors
    }
    return acc
  }, {})

  if (loading) {
    return (
      <div className="sponsors-page">
        <Nav activePage="sponsors" />
        <div className="sponsors-container">
          <p className="loading">Loading sponsors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sponsors-page">
      <Nav activePage="sponsors" />
      
      <div className="sponsors-hero">
        <h1>Our Sponsors & Partners</h1>
        <p>We're grateful for the support of these amazing organizations</p>
      </div>

      <div className="sponsors-container">
        {Object.entries(groupedSponsors).map(([tier, tierSponsors]) => (
          <section key={tier} className={`sponsors-tier tier-${tier}`}>
            <h2 className="tier-title">{tierLabels[tier]}</h2>
            <div className="sponsors-grid">
              {tierSponsors.map((sponsor) => (
                <article 
                  key={sponsor._id} 
                  className={`sponsor-card tier-${tier}`}
                  onClick={() => setSelectedSponsor(sponsor)}
                >
                  <div className="sponsor-logo">
                    {sponsor.logo && (
                      <img 
                        src={urlFor(sponsor.logo).width(300).height(200).fit('max').url()} 
                        alt={sponsor.logo.alt || sponsor.name} 
                      />
                    )}
                  </div>
                  <div className="sponsor-info">
                    <h3 className="sponsor-name">{sponsor.name}</h3>
                    {sponsor.tagline && (
                      <p className="sponsor-tagline">{sponsor.tagline}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {sponsors.length === 0 && (
          <div className="no-sponsors">
            <p>Sponsor information coming soon.</p>
          </div>
        )}
      </div>

      {/* Sponsor Modal */}
      {selectedSponsor && (
        <div className="sponsor-modal-overlay" onClick={() => setSelectedSponsor(null)}>
          <div className="sponsor-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSponsor(null)}>×</button>
            
            <div className="modal-header">
              {selectedSponsor.logo && (
                <img 
                  src={urlFor(selectedSponsor.logo).width(200).url()} 
                  alt={selectedSponsor.name}
                  className="modal-logo"
                />
              )}
              <div>
                <h2>{selectedSponsor.name}</h2>
                {selectedSponsor.tagline && (
                  <p className="modal-tagline">{selectedSponsor.tagline}</p>
                )}
              </div>
            </div>

            {selectedSponsor.description && (
              <div className="modal-description">
                {/* Simple text render for description */}
                {selectedSponsor.description.map((block, i) => (
                  <p key={i}>{block.children?.map(c => c.text).join('')}</p>
                ))}
              </div>
            )}

            <div className="modal-contact">
              {selectedSponsor.website && (
                <a href={selectedSponsor.website} target="_blank" rel="noopener noreferrer" className="contact-link website">
                  🌐 Visit Website
                </a>
              )}
              {selectedSponsor.email && (
                <a href={`mailto:${selectedSponsor.email}`} className="contact-link email">
                  ✉️ {selectedSponsor.email}
                </a>
              )}
              {selectedSponsor.phone && (
                <a href={`tel:${selectedSponsor.phone}`} className="contact-link phone">
                  📞 {selectedSponsor.phone}
                </a>
              )}
            </div>

            {selectedSponsor.socialLinks && (
              <div className="modal-social">
                {selectedSponsor.socialLinks.linkedin && (
                  <a href={selectedSponsor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                    <SocialIcon type="linkedin" />
                  </a>
                )}
                {selectedSponsor.socialLinks.twitter && (
                  <a href={selectedSponsor.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                    <SocialIcon type="twitter" />
                  </a>
                )}
                {selectedSponsor.socialLinks.instagram && (
                  <a href={selectedSponsor.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                    <SocialIcon type="instagram" />
                  </a>
                )}
                {selectedSponsor.socialLinks.facebook && (
                  <a href={selectedSponsor.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link facebook">
                    <SocialIcon type="facebook" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

