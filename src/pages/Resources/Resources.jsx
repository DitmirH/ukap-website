import { useEffect, useMemo, useState } from 'react'
import { Nav, Footer, PageHeader, ResourceCard } from '../../components'
import { client } from '../../lib/sanityClient'
import { RESOURCE_CARD_FIELDS, RESOURCE_CATEGORIES } from '../../lib/resources'
import './Resources.css'

/** /resources — every Resource document, with category filter + search. */
export default function Resources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    client
      .fetch(`*[_type == "resource" && hidden != true] | order(featured desc, publishedAt desc){ ${RESOURCE_CARD_FIELDS} }`)
      .then((data) => setResources(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Only show category buttons that have resources
  const categories = useMemo(() => {
    const counts = {}
    resources.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1 })
    return Object.keys(RESOURCE_CATEGORIES).filter((k) => counts[k]).map((k) => ({ key: k, label: RESOURCE_CATEGORIES[k], count: counts[k] }))
  }, [resources])

  const q = query.trim().toLowerCase()
  const shown = resources.filter((r) => {
    if (category !== 'all' && r.category !== category) return false
    if (!q) return true
    return [r.title, r.summary, RESOURCE_CATEGORIES[r.category], ...(r.tags || [])].join(' ').toLowerCase().includes(q)
  })

  return (
    <div className="resources-page">
      <Nav activePage="resources" />

      <PageHeader
        tone="black"
        photo="/images/training.jpg"
        eyebrow="Resources"
        title="Learn, train and grow"
        subtitle="Guides, templates, training materials and recordings from UKAP programmes — free to use."
        crumbs={[{ label: 'Resources' }]}
      />

      <section className="section">
        <div className="container">
          {!loading && resources.length > 0 && (
            <div className="resources-tools">
              <div className="resources-filter" role="tablist" aria-label="Filter by category">
                <button role="tab" aria-selected={category === 'all'} className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>
                  All <span>{resources.length}</span>
                </button>
                {categories.map((c) => (
                  <button key={c.key} role="tab" aria-selected={category === c.key} className={category === c.key ? 'active' : ''} onClick={() => setCategory(c.key)}>
                    {c.label} <span>{c.count}</span>
                  </button>
                ))}
              </div>
              <label className="resources-search">
                <span className="visually-hidden">Search resources</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" /></svg>
                <input type="search" placeholder="Search resources" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
            </div>
          )}

          {loading ? (
            <div className="resource-grid" aria-busy="true">
              {[0, 1, 2].map((i) => <div key={i} className="resource-skeleton" />)}
            </div>
          ) : resources.length === 0 ? (
            <div className="resources-empty">
              <h2>Resources are on the way</h2>
              <p>We're putting together guides, templates and training materials. Check back soon.</p>
            </div>
          ) : shown.length === 0 ? (
            <div className="resources-empty">
              <h2>No matches</h2>
              <p>Nothing matches that search. Try another word or pick "All".</p>
              <button className="btn btn-outline no-arrow" onClick={() => { setQuery(''); setCategory('all') }}>Show all resources</button>
            </div>
          ) : (
            <div className="resource-grid">
              {shown.map((r, i) => <ResourceCard key={r._id} resource={r} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
