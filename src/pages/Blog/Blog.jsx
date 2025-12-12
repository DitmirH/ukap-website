import { useState, useEffect } from 'react'
import { Nav, Footer, BlogCard } from '../../components'
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

      <main className="blog-page-content">
        <h1 className="page-title">Latest <span className="accent">News</span></h1>
        
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

