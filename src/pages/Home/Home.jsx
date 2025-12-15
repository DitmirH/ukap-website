import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer, ContactForm, BlogCard, HeroCarousel, EventsList, SponsorsCarousel } from '../../components'
import { client } from '../../lib/sanityClient'
import './Home.css'

export default function Home() {
  const [posts, setPosts] = useState([])

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

  return (
    <div className="home">
      <Nav activePage="home" />

      <HeroCarousel />

      <section className="contact-section">
        <div className="ambient-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        <div className="contact-content">
          {/* ContactForm fetches default form config from Sanity */}
          <ContactForm />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="events-preview">
        <EventsList 
          title="Upcoming Events"
          limit={3}
          style="timeline"
          showViewAll={true}
        />
      </section>

      {posts.length > 0 && (
        <section className="blog-preview">
          <h2 className="section-title">Latest <span className="accent">News</span></h2>
          <div className="blog-grid">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          <Link to="/blog" className="view-all-link">View all posts →</Link>
        </section>
      )}

      <SponsorsCarousel />

      <Footer />
    </div>
  )
}

