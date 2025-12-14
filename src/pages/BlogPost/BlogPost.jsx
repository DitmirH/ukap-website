import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { Nav, Footer, ContactForm } from '../../components'
import { client, urlFor } from '../../lib/sanityClient'
import './BlogPost.css'

const portableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure className="content-image">
        <img 
          src={urlFor(value).width(900).url()} 
          alt={value.alt || ''} 
        />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
    contactFormEmbed: ({ value }) => {
      // If form data was expanded in query, use it directly
      if (value.formRef) {
        return (
          <div className="embedded-contact-form">
            <ContactForm 
              config={value.formRef}
              overrideTitle={value.overrideTitle}
              className="inline"
            />
          </div>
        )
      }
      return null
    },
  },
  block: {
    h2: ({ children }) => <h2 className="content-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="content-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="content-h4">{children}</h4>,
    blockquote: ({ children }) => <blockquote className="content-quote">{children}</blockquote>,
    normal: ({ children }) => <p className="content-p">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    highlight: ({ children }) => <mark className="highlight">{children}</mark>,
    link: ({ value, children }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer" className="content-link">
        {children}
      </a>
    ),
  },
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          mainImage,
          style,
          body[]{
            ...,
            _type == "contactFormEmbed" => {
              ...,
              formRef->{
                name,
                title,
                highlightedWord,
                description,
                fields,
                placeholders,
                buttonText,
                sendingText,
                successMessage,
                errorMessage,
                recipients,
                emailSubjectPrefix,
                styling
              }
            }
          },
          author->{
            name,
            image,
            role
          }
        }`,
        { slug }
      )
      .then((data) => {
        setPost(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="blog-post-page">
        <Nav activePage="blog" />
        <div className="blog-post-container">
          <p className="loading">Loading...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-post-page">
        <Nav activePage="blog" />
        <div className="blog-post-container">
          <h1>Post not found</h1>
          <Link to="/blog" className="back-link">← Back to blog</Link>
        </div>
      </div>
    )
  }

  const postStyle = post.style || 'default'

  return (
    <div className={`blog-post-page style-${postStyle}`}>
      <Nav activePage="blog" />
      
      <div className="blog-post-container">
        <Link to="/blog" className="back-link">← Back to blog</Link>
        
        {post.mainImage && (
          <div className={`blog-post-hero ${postStyle === 'featured' ? 'featured-hero' : ''}`}>
            <img 
              src={urlFor(post.mainImage).width(1200).height(postStyle === 'featured' ? 700 : 500).url()} 
              alt={post.title} 
            />
            {post.mainImage.caption && (
              <p className="hero-caption">{post.mainImage.caption}</p>
            )}
          </div>
        )}
        
        <article className="blog-post-content">
          <time className="blog-post-date">
            {new Date(post.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </time>
          
          <h1 className="blog-post-title">{post.title}</h1>
          
          {post.author && (
            <div className="blog-post-author">
              {post.author.image && (
                <img 
                  src={urlFor(post.author.image).width(80).height(80).url()} 
                  alt={post.author.name}
                  className="author-image"
                />
              )}
              <div className="author-info">
                <span className="author-name">{post.author.name}</span>
                {post.author.role && <span className="author-role">{post.author.role}</span>}
              </div>
            </div>
          )}
          
          {post.excerpt && <p className="blog-post-excerpt">{post.excerpt}</p>}
          
          {post.body && (
            <div className="blog-post-body">
              <PortableText value={post.body} components={portableTextComponents} />
            </div>
          )}
        </article>
      </div>

      <Footer />
    </div>
  )
}

