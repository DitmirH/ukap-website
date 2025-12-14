import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { Nav, Footer, ContactForm, EventsList, TicketTailorEmbed, EmbedCode } from '../../components'
import { client, urlFor } from '../../lib/sanityClient'
import './CustomPage.css'

// Portable Text components for page content
const pageContentComponents = {
  types: {
    image: ({ value }) => {
      const sizeClass = value.size || 'large'
      return (
        <figure className={`page-image size-${sizeClass}`}>
          <img 
            src={urlFor(value).width(sizeClass === 'full' ? 1200 : sizeClass === 'large' ? 900 : sizeClass === 'medium' ? 600 : 400).url()} 
            alt={value.alt || ''} 
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      )
    },
    formEmbed: ({ value }) => {
      if (value.form) {
        return (
          <div className="page-form-embed">
            <ContactForm 
              config={value.form}
              overrideTitle={value.overrideTitle}
            />
          </div>
        )
      }
      return null
    },
    cta: ({ value }) => {
      const isExternal = value.openExternal || value.link?.startsWith('http')
      
      if (isExternal) {
        return (
          <div className={`page-cta align-${value.alignment || 'left'}`}>
            <a 
              href={value.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`cta-button style-${value.style || 'primary'}`}
            >
              {value.text}
              <span className="external-icon"> ↗</span>
            </a>
          </div>
        )
      }
      
      return (
        <div className={`page-cta align-${value.alignment || 'left'}`}>
          <Link 
            to={value.link} 
            className={`cta-button style-${value.style || 'primary'}`}
          >
            {value.text}
          </Link>
        </div>
      )
    },
    divider: ({ value }) => {
      if (value.style === 'line') {
        return <hr className="page-divider" />
      }
      return <div className={`page-spacer ${value.style}`} />
    },
    twoColumn: ({ value }) => (
      <div className={`two-column-layout ratio-${value.ratio || '50-50'}`}>
        <div className="column left-column">
          {value.leftColumn && <PortableText value={value.leftColumn} components={pageContentComponents} />}
        </div>
        <div className="column right-column">
          {value.rightColumn && <PortableText value={value.rightColumn} components={pageContentComponents} />}
        </div>
      </div>
    ),
    infoBox: ({ value }) => (
      <div className={`info-box type-${value.type || 'info'}`}>
        {value.title && <h4 className="info-box-title">{value.title}</h4>}
        {value.content && <p className="info-box-content">{value.content}</p>}
      </div>
    ),
    eventsList: ({ value }) => (
      <div className="page-events-embed">
        <EventsList
          title={value.title}
          showPastEvents={value.showPastEvents}
          limit={value.limit}
          category={value.category}
          style={value.style || 'timeline'}
          showViewAll={value.showViewAll}
        />
      </div>
    ),
    ticketTailor: ({ value }) => (
      <div className="page-ticket-tailor-embed">
        <TicketTailorEmbed
          eventUrl={value.eventUrl}
          showSearchFilter={value.showSearchFilter}
          showDateFilter={value.showDateFilter}
          showSort={value.showSort}
          minimal={value.minimal}
          showLogo={value.showLogo}
          bgFill={value.bgFill}
        />
      </div>
    ),
    embedCode: ({ value }) => (
      <EmbedCode code={value.code} title={value.title} />
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="page-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="page-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="page-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="page-h4">{children}</h4>,
    blockquote: ({ children }) => <blockquote className="page-quote">{children}</blockquote>,
    normal: ({ children }) => <p className="page-p">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    highlight: ({ children }) => <span className="highlight">{children}</span>,
    link: ({ value, children }) => {
      const target = value.openInNewTab ? '_blank' : undefined
      return (
        <a href={value.href} target={target} rel={target ? 'noopener noreferrer' : undefined} className="page-link">
          {children}
        </a>
      )
    },
  },
}

export default function CustomPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "customPage" && slug.current == $slug][0]{
          _id,
          title,
          slug,
          description,
          heroImage,
          heroStyle,
          content[]{
            ...,
            _type == "formEmbed" => {
              ...,
              form->{
                name,
                slug,
                headerContent,
                emailFieldLabel,
                emailFieldPlaceholder,
                fields,
                footerContent,
                submitButton,
                messages,
                emailSettings,
                styling
              }
            },
            _type == "twoColumn" => {
              ...,
              leftColumn[]{...},
              rightColumn[]{...}
            }
          },
          seo
        }`,
        { slug }
      )
      .then((data) => {
        setPage(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="custom-page">
        <Nav />
        <div className="page-container">
          <p className="loading">Loading...</p>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="custom-page">
        <Nav />
        <div className="page-container">
          <h1>Page not found</h1>
          <Link to="/" className="back-link">← Back to home</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const heroStyle = page.heroStyle || 'overlay'

  return (
    <div className="custom-page">
      <Nav />
      
      {/* Hero Section */}
      {page.heroImage && heroStyle !== 'none' && (
        <div className={`page-hero hero-${heroStyle}`}>
          <img 
            src={urlFor(page.heroImage).width(1400).height(heroStyle === 'banner' ? 400 : 500).url()} 
            alt={page.heroImage.alt || page.title} 
          />
          {heroStyle === 'overlay' && (
            <div className="hero-overlay">
              <h1 className="hero-title">{page.title}</h1>
              {page.description && <p className="hero-description">{page.description}</p>}
            </div>
          )}
        </div>
      )}

      <div className="page-container">
        {/* Title if no hero or hero without overlay */}
        {(heroStyle === 'none' || heroStyle === 'banner' || heroStyle === 'contained') && (
          <header className="page-header">
            <h1 className="page-title">{page.title}</h1>
            {page.description && <p className="page-description">{page.description}</p>}
          </header>
        )}

        {/* Contained hero image */}
        {page.heroImage && heroStyle === 'contained' && (
          <div className="page-hero-contained">
            <img 
              src={urlFor(page.heroImage).width(900).url()} 
              alt={page.heroImage.alt || page.title} 
            />
          </div>
        )}

        {/* Page Content */}
        {page.content && (
          <div className="page-content">
            <PortableText value={page.content} components={pageContentComponents} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

