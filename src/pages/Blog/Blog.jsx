import { useState, useEffect } from 'react'
import { Nav, Footer, BlogCard, PageHeader } from '../../components'
import { client } from '../../lib/sanityClient'
import './Blog.css'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          mainImage
        }`
      )
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="blog-page">
      <Nav activePage="blog" />

      <PageHeader
        tone="gold"
        photo="/images/celebrate.jpg"
        eyebrow="News"
        title={<>Stories from the <span className="accent">community</span></>}
        subtitle="Updates, event recaps and insights from the UKAP Foundation and the people we support."
        crumbs={[{ label: 'News' }]}
      />

      <main className="blog-page-content">
        
        {loading && <p className="loading">Loading posts...</p>}
        
        {!loading && posts.length === 0 && (
          <p className="empty">No posts yet. Check back soon!</p>
        )}

        <div className="blog-grid">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

