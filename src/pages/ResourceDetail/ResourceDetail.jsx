import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { Nav, Footer, PageHeader, ResourceCard } from '../../components'
import { client, urlFor } from '../../lib/sanityClient'
import {
  RESOURCE_PAGE_FIELDS, RESOURCE_CARD_FIELDS, RESOURCE_CYCLE,
  categoryLabel, formatSize, downloadUrl, videoEmbedUrl,
} from '../../lib/resources'
import './ResourceDetail.css'

const isExternal = (href = '') => /^https?:|^mailto:/.test(href)

function FileRow({ file }) {
  const href = downloadUrl(file)
  if (!href) return null
  const ext = (file.ext || file.name?.split('.').pop() || 'file').toUpperCase()
  return (
    <a className="rd-file" href={href} download>
      <span className="rd-file-ext" aria-hidden="true">{ext.slice(0, 4)}</span>
      <span className="rd-file-text">
        <b>{file.title}</b>
        {file.description && <span>{file.description}</span>}
        <small>{[ext, formatSize(file.size)].filter(Boolean).join(' · ')}</small>
      </span>
      <span className="rd-file-action" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 4v11m0 0l-5-5m5 5l5-5M5 20h14" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
      </span>
      <span className="visually-hidden">Download {file.title}</span>
    </a>
  )
}

function LinkRow({ link }) {
  return (
    <a className="rd-link" href={link.url} target="_blank" rel="noopener noreferrer">
      <span className="rd-file-text">
        <b>{link.title}</b>
        {link.description && <span>{link.description}</span>}
        <small>{link.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</small>
      </span>
      <b className="rd-link-arrow" aria-hidden="true">↗</b>
    </a>
  )
}

const components = {
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="rd-figure">
          <img src={urlFor(value).width(1100).url()} alt={value.alt || ''} loading="lazy" />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ) : null,
    tipList: ({ value }) => (
      <div className="rd-tips">
        {value.title && <h3>{value.title}</h3>}
        <ol>{(value.tips || []).map((t, i) => <li key={i}>{t}</li>)}</ol>
      </div>
    ),
    callout: ({ value }) => (
      <aside className={`rd-callout tone-${value.tone || 'tip'}`}>
        {value.title && <strong>{value.title}</strong>}
        <p>{value.text}</p>
      </aside>
    ),
    video: ({ value }) => {
      const src = videoEmbedUrl(value.url)
      if (!src) return <p><a href={value.url} target="_blank" rel="noopener noreferrer">Watch the video ↗</a></p>
      return (
        <figure className="rd-video">
          <div className="rd-video-frame">
            <iframe src={src} title={value.caption || 'Video'} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      )
    },
    fileDownload: ({ value }) => {
      const ext = (value.ext || value.name?.split('.').pop() || '').toLowerCase()
      const isAudio = ['mp3', 'm4a', 'wav', 'ogg', 'aac'].includes(ext)
      const isVideo = ['mp4', 'webm', 'mov'].includes(ext)
      return (
        <div className="rd-inline">
          {isAudio && value.url && <audio className="rd-player" controls preload="none" src={value.url}>Your browser can't play this audio.</audio>}
          {isVideo && value.url && <video className="rd-player is-video" controls preload="metadata" src={value.url} />}
          <FileRow file={value} />
        </div>
      )
    },
    linkCard: ({ value }) => <div className="rd-inline"><LinkRow link={value} /></div>,
  },
  block: {
    h2: ({ children }) => <h2 className="rd-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="rd-h3">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="rd-quote">{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    highlight: ({ children }) => <mark className="rd-mark">{children}</mark>,
    link: ({ value, children }) =>
      isExternal(value?.href) ? (
        <a href={value.href} target="_blank" rel="noopener noreferrer">{children}</a>
      ) : (
        <Link to={value?.href || '/'}>{children}</Link>
      ),
  },
}

export default function ResourceDetail() {
  const { slug } = useParams()
  const [resource, setResource] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    client
      .fetch(
        `{
          "resource": *[_type == "resource" && slug.current == $slug && hidden != true][0]{ ${RESOURCE_PAGE_FIELDS} },
          "others": *[_type == "resource" && slug.current != $slug && hidden != true] | order(publishedAt desc)[0...12]{ ${RESOURCE_CARD_FIELDS} }
        }`,
        { slug }
      )
      .then(({ resource: r, others }) => {
        setResource(r)
        if (r) {
          const same = others.filter((o) => o.category === r.category)
          setRelated([...same, ...others.filter((o) => o.category !== r.category)].slice(0, 3))
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="resource-detail-page">
        <Nav activePage="resources" />
        <div className="container rd-state"><p>Loading…</p></div>
        <Footer />
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="resource-detail-page">
        <Nav activePage="resources" />
        <PageHeader tone="black" eyebrow="Resources" title="Resource not found" crumbs={[{ label: 'Resources', to: '/resources' }, { label: 'Not found' }]} />
        <div className="container rd-state">
          <p>This resource may have moved or been removed.</p>
          <Link to="/resources" className="btn btn-outline">All resources</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const downloads = resource.downloads || []
  const links = resource.links || []
  const hasSide = downloads.length > 0 || links.length > 0
  const colour = resource.cardColour || RESOURCE_CYCLE[0]

  return (
    <div className="resource-detail-page">
      <Nav activePage="resources" />

      <PageHeader
        colour={colour}
        eyebrow={categoryLabel(resource.category)}
        title={resource.title}
        subtitle={resource.summary}
        photo={resource.coverImage ? urlFor(resource.coverImage).width(2000).height(900).url() : null}
        crumbs={[{ label: 'Resources', to: '/resources' }, { label: resource.title }]}
      />

      <section className="section">
        <div className={`container rd-layout ${hasSide ? 'has-side' : ''}`}>
          <article className="rd-body">
            {resource.content?.length ? (
              <PortableText value={resource.content} components={components} />
            ) : (
              !hasSide && <p className="rd-state">More information coming soon.</p>
            )}
            {resource.tags?.length > 0 && (
              <ul className="rd-tagline" aria-label="Tags">
                {resource.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            )}
          </article>

          {hasSide && (
            <aside className="rd-side">
              {downloads.length > 0 && (
                <div className="rd-panel">
                  <h2 className="rd-panel-title">Downloads <span>{downloads.length}</span></h2>
                  {downloads.map((f) => <FileRow key={f._key} file={f} />)}
                </div>
              )}
              {links.length > 0 && (
                <div className="rd-panel">
                  <h2 className="rd-panel-title">Useful links <span>{links.length}</span></h2>
                  {links.map((l) => <LinkRow key={l._key} link={l} />)}
                </div>
              )}
            </aside>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="rd-related-head">
              <h2>More resources</h2>
              <Link to="/resources" className="view-all-link">All resources</Link>
            </div>
            <div className="resource-grid">
              {related.map((r, i) => <ResourceCard key={r._id} resource={r} index={i + 1} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
