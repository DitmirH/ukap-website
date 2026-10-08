import { Link } from 'react-router-dom'
import { urlFor } from '../../lib/sanityClient'
import './BlogCard.css'

export default function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug?.current}`} className="blog-card-link">
      <article className="blog-card">
        {post.mainImage ? (
          <div className="blog-card-image">
            <img 
              src={urlFor(post.mainImage).width(600).height(400).url()} 
              alt={post.title} 
            />
          </div>
        ) : (
          <div className="blog-card-image blog-card-noimg" aria-hidden="true">
            <span className="ukap-watermark" />
          </div>
        )}
        <div className="blog-card-content">
          <time className="blog-card-date">
            {new Date(post.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </time>
          <h3 className="blog-card-title">{post.title}</h3>
          {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
          <span className="blog-card-more">Read more</span>
        </div>
      </article>
    </Link>
  )
}

