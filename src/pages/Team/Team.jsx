import { useState, useEffect } from 'react'
import { Nav, Footer, TeamCard } from '../../components'
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

      <main className="team-page-content">
        <header className="team-header">
          <h1 className="page-title">Meet the <span className="accent">Team</span></h1>
          <p className="page-description">
            The UKAP Foundation is supported by students and professionals who work together 
            to help members achieve meaningful progress in their personal and professional lives.
          </p>
        </header>

        {loading && <p className="loading">Loading team...</p>}

        {!loading && leads.length > 0 && (
          <section className="team-section">
            <h2 className="section-title">Leads</h2>
            <p className="section-description">
              Our Leads oversee key initiatives and drive the foundation forward.
            </p>
            <div className="team-grid">
              {leads.map((member) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          </section>
        )}

        {!loading && volunteers.length > 0 && (
          <section className="team-section">
            <h2 className="section-title">Volunteers</h2>
            <p className="section-description">
              A passionate group whose enthusiasm and commitment bring our initiatives to life.
            </p>
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

