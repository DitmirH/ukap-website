import { useState, useEffect } from 'react'
import { Nav, Footer, EmbedCode, PageHeader } from '../../components'
import { client } from '../../lib/sanityClient'
import './Donate.css'

// ⬇️ Your Zeffy donation form. To change forms later, update this slug
// (from your Zeffy embed code: data-form-url="/embed/donation-form/<slug>").
const ZEFFY_FORM_SLUG = 'donate-to-change-lives-16341'

const ZEFFY_FORM_PATH = `/embed/donation-form/${ZEFFY_FORM_SLUG}`
const ZEFFY_FORM_URL = `https://www.zeffy.com${ZEFFY_FORM_PATH}`
const zeffyReady = ZEFFY_FORM_SLUG && !ZEFFY_FORM_SLUG.includes('YOUR-FORM')

// Official Zeffy v2 embed (auto-resizing). Falls back to a fixed-height
// iframe if their script fails to load.
const ZEFFY_EMBED_CODE = `
<div>
  <div data-zeffy-embed data-form-url="${ZEFFY_FORM_PATH}"></div>
  <div data-zeffy-embed-fallback style="display:none;">
    <div style="position:relative;overflow:hidden;height:900px;width:100%;"><iframe title="Donation form powered by Zeffy" style="position:absolute;border:0;top:0;left:0;bottom:0;right:0;width:100%;height:100%" data-zeffy-embed-src="${ZEFFY_FORM_URL}" allowpaymentrequest allowTransparency="true"></iframe></div>
  </div>
  <script src="https://www.zeffy.com/embed/v2/zeffy-embed.js" onerror="document.querySelectorAll('[data-zeffy-embed-fallback]').forEach(function(el){el.style.display='block';el.querySelectorAll('iframe[data-zeffy-embed-src]').forEach(function(f){f.src=f.getAttribute('data-zeffy-embed-src');});});"></script>
</div>`

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
      <PageHeader
        tone="coral"
        photo="/images/graduates-red.jpg"
        eyebrow="Donate"
        title={<>Help us create brighter <span className="accent">futures</span></>}
        subtitle="Your donation funds scholarships, mentoring and opportunities for young people — and with Gift Aid, every £1 becomes £1.25."
        crumbs={[{ label: 'Donate' }]}
      >
        <a href="#donate-form" className="btn btn-yellow">Give now</a>
      </PageHeader>

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

          {/* Gift Aid note */}
          <aside className="giftaid-note-box">
            <span className="giftaid-note-badge">Gift Aid</span>
            <h3>Make your gift worth 25% more — at no extra cost</h3>
            <p>
              If you&rsquo;re a UK taxpayer, please support us by ticking the
              <strong> Gift Aid box</strong> in the form below and completing the required
              details (your full name, home address and postcode) so we can claim Gift Aid
              from HMRC. It costs you nothing and means every &pound;1 you give is worth
              &pound;1.25 to us.
            </p>
            <p className="giftaid-note-foot">
              If any required information is missing, we may reach out to confirm it.
              Thank you for your support. — UKAP
            </p>
          </aside>

          {/* Zeffy Donation Form */}
          <div className="zeffy-widget-container" id="donate-form">
            {zeffyReady ? (
              <div className="zeffy-embed">
                <EmbedCode code={ZEFFY_EMBED_CODE} title="Donate via Zeffy" />
              </div>
            ) : (
              <div className="zeffy-placeholder">
                <div className="placeholder-content">
                  <p>Zeffy donation form</p>
                  <small>
                    Add your Zeffy form slug in <code>src/pages/Donate/Donate.jsx</code> to
                    show the form here.
                  </small>
                </div>
              </div>
            )}
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
            <span className="eyebrow">Where it goes</span>
            <h2>Why your donation matters</h2>
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
            <span className="eyebrow on-dark">2025 at a glance</span>
            <h2>Our impact</h2>
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
