import { useState, useEffect } from 'react'
import { Nav, Footer, TeamCard, PageHeader } from '../../components'
import { client } from '../../lib/sanityClient'
import './Team.css'

export default function Team() {
  const [leads, setLeads] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "teamMember"] | order(order asc) {
          _id,
          name,
          role,
          category,
          image,
          bio,
          linkedIn
        }`
      )
      .then((data) => {
        setLeads(data.filter(m => m.category === 'lead'))
        setVolunteers(data.filter(m => m.category === 'volunteer'))
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="team-page">
      <Nav activePage="team" />

      <PageHeader
        tone="black"
        photo="/images/team.jpg"
        eyebrow="Our people"
        title={<>Meet the <span className="accent">team</span></>}
        subtitle="Students and professionals working together to help young people make meaningful progress in their personal and professional lives."
        crumbs={[{ label: 'Team' }]}
      />

      <main className="team-page-content">

        {loading && <p className="loading">Loading team...</p>}

        {!loading && leads.length > 0 && (
          <section className="team-section">
            <div className="block-head">
              <div className="block-head-text">
                <span className="eyebrow">Leadership</span>
                <h2 className="section-title">Leads</h2>
                <p className="block-head-lead">Our Leads oversee key initiatives and drive the foundation forward.</p>
              </div>
            </div>
            <div className="team-grid">
              {leads.map((member) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          </section>
        )}

        {!loading && volunteers.length > 0 && (
          <section className="team-section">
            <div className="block-head">
              <div className="block-head-text">
                <span className="eyebrow">Volunteers</span>
                <h2 className="section-title">The people behind every event</h2>
                <p className="block-head-lead">A passionate group whose enthusiasm and commitment bring our initiatives to life.</p>
              </div>
            </div>
            <div className="team-grid">
              {volunteers.map((member) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          </section>
        )}

        {!loading && leads.length === 0 && volunteers.length === 0 && (
          <p className="empty">No team members added yet.</p>
        )}
      </main>

      <Footer />
    </div>
  )
}

