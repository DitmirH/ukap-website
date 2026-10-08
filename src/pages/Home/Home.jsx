import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Nav, Footer, ContactForm, BlogCard, HeroCarousel, EventsList, SponsorsCarousel, MissionStrip, ProgrammesGrid, AnnouncementModal, SectionHead, ActionCards, FeatureBanner, HelpWays } from '../../components'
import { client } from '../../lib/sanityClient'
import './Home.css'

export default function Home() {
  const [posts, setPosts] = useState([])
  const location = useLocation()

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post"] | order(publishedAt desc)[0...3] {
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          mainImage
        }`
      )
      .then((data) => setPosts(data))
      .catch((err) => console.error(err))
  }, [])

  // Support /#contact links from the nav and footer
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [location.hash])

  return (
    <div className="home">
      <AnnouncementModal />

      <Nav activePage={location.hash === '#contact' ? 'contact' : 'home'} />

      <HeroCarousel />

      <ActionCards />

      <MissionStrip />

      <ProgrammesGrid />

      <FeatureBanner
        image="/images/gala.jpg"
        imagePosition="center 80%"
        eyebrow="Gala for a Brighter Future"
        title="190 guests. £8,000 raised."
        text="Our 2025 gala brought the community together to fund scholarships, mentoring and events for the year ahead."
        cta="See upcoming events"
        to="/events"
        tone="red"
      />

      {/* Upcoming Events */}
      <section className="events-preview section section-alt">
        <div className="container">
          <SectionHead title="Upcoming events" action={{ to: '/events', label: 'All events' }} />
          <EventsList title="" limit={3} style="cards" showViewAll={false} />
        </div>
      </section>

      {posts.length > 0 && (
        <section className="blog-preview section">
          <div className="container">
            <SectionHead title="Latest updates" action={{ to: '/blog', label: 'All news' }} />
            <div className="blog-grid">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <HelpWays />

      {/* Contact */}
      <section className="contact-section" id="contact">
        <div className="contact-grid">
          <div className="contact-intro">
            <span className="eyebrow">Contact</span>
            <h2>Get in touch</h2>
            <p>
              Whether you want to volunteer, become a mentor, partner with us or ask about a
              programme — send us a message and the team will get back to you.
            </p>
            <a href="mailto:ukap@ukapfoundation.org" className="contact-email">
              ukap@ukapfoundation.org
            </a>
            <span className="ukap-watermark contact-watermark" aria-hidden="true" />
          </div>
          <div className="contact-form-col">
            <ContactForm />
          </div>
        </div>
      </section>

      <SponsorsCarousel />

      <Footer />
    </div>
  )
}
