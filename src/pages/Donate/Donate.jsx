import { useState, useEffect } from 'react'
import { Nav, Footer } from '../../components'
import { client } from '../../lib/sanityClient'
import './Donate.css'

export default function Donate() {
  const [tiers, setTiers] = useState([])

  useEffect(() => {
    // Fetch sponsorship tiers from Sanity
    client
      .fetch(
        `*[_type == "sponsorshipTier" && hidden != true] | order(order asc) {
          _id,
          name,
          price,
          description,
          benefits,
          highlighted,
          contactLink
        }`
      )
      .then((data) => setTiers(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className="donate-page">
      <Nav activePage="donate" />

      {/* Hero Section */}
      <section className="donate-hero">
        <div className="donate-hero-content">
          <h1>Help Us Create Brighter Futures Through Education</h1>
          <p>Your donation helps us provide scholarships, mentoring, and opportunities for young people.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="donate-content">
        <div className="donate-container">
          
          <div className="donate-intro">
            <p>
              The UKAP Foundation is a UK-registered charity dedicated to advancing the education 
              and life opportunities of young adults, particularly, but not exclusively, those of 
              Albanian heritage. With your help, we can open more doors, fund more programmes and 
              expand our reach to transform even more lives.
            </p>
          </div>

          {/* Givey Widget Placeholder */}
          <div className="givey-widget-container">
            <div className="givey-placeholder">
              {/* 
                GIVEY WIDGET GOES HERE
                Paste your Givey embed code below, replacing this placeholder.
                Example:
                <div data-givey-widget="donation" data-charity-id="YOUR_ID"></div>
              */}
              <div className="placeholder-content">
                <p>Givey Donation Widget</p>
                <small>Paste your Givey embed code here</small>
              </div>
            </div>
          </div>

          {/* Sponsorship Tiers */}
          {tiers.length > 0 && (
            <div className="sponsorship-tiers">
              <h2>Sponsorship Levels</h2>
              <p className="tiers-subtitle">Partner with us to make a lasting impact</p>
              <div className="tiers-grid">
                {tiers.map((tier) => (
                  <div 
                    key={tier._id} 
                    className={`tier-card ${tier.highlighted ? 'highlighted' : ''}`}
                  >
                    {tier.highlighted && <span className="tier-badge">Most Popular</span>}
                    <h3 className="tier-name">{tier.name}</h3>
                    <p className="tier-price">{tier.price}</p>
                    {tier.description && (
                      <p className="tier-description">{tier.description}</p>
                    )}
                    {tier.benefits?.length > 0 && (
                      <ul className="tier-benefits">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    )}
                    {tier.contactLink && (
                      <a 
                        href={tier.contactLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="tier-cta"
                      >
                        Enquire Now
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Donate */}
          <div className="donate-why">
            <h2>Why Your Donation Matters</h2>
            <div className="why-grid">
              <div className="why-card">
                <h3>Scholarships</h3>
                <p>Financial assistance for students demonstrating merit and/or need, helping them access higher education.</p>
              </div>
              <div className="why-card">
                <h3>Mentoring</h3>
                <p>Connecting young people with experienced professionals who guide them on their career journey.</p>
              </div>
              <div className="why-card">
                <h3>Education Events</h3>
                <p>Workshops, panels, and networking events that expand knowledge and open doors.</p>
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className="donate-impact">
            <h2>Our Impact</h2>
            <p className="impact-subtitle">2025 at a Glance</p>
            <div className="impact-grid">
              <div className="impact-stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Learning Events</span>
              </div>
              <div className="impact-stat">
                <span className="stat-number">2,000+</span>
                <span className="stat-label">Participants Reached</span>
              </div>
              <div className="impact-stat">
                <span className="stat-number">42+</span>
                <span className="stat-label">Volunteers</span>
              </div>
              <div className="impact-stat">
                <span className="stat-number">11</span>
                <span className="stat-label">Scholarships Awarded</span>
              </div>
            </div>
          </div>

          <div className="donate-note">
            <p>The UKAP Foundation is proudly registered as a UK charity (Charity No. 1215303)</p>
            <p>Email: <a href="mailto:ukap@ukapfoundation.org">ukap@ukapfoundation.org</a></p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
