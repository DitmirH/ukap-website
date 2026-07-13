import { Link } from 'react-router-dom'
import { Nav, Footer } from '../../components'
import './About.css'

const PROGRAMMES = [
  {
    title: 'Scholarships',
    color: 'blue',
    text: 'Providing merit-based and needs-based scholarships that enable young adults to pursue academic excellence and unlock educational pathways.',
  },
  {
    title: 'Mentoring',
    color: 'red',
    text: 'Connecting students and early career professionals with experienced mentors who offer guidance, industry perspectives and career development support.',
  },
  {
    title: 'Educational & Skills Training',
    color: 'gold',
    text: 'Delivering workshops, panel discussions and training sessions that build capabilities, enhance competencies and equip young adults with practical skills for their future.',
  },
]

const ACHIEVEMENTS = [
  { title: 'Gala for a Brighter Future', text: 'welcomed 190 guests and raised over £8,000' },
  { title: 'CFA Institute Collaboration', text: 'awarded 11 scholarships to young people entering the investment sector' },
  { title: 'Advancing Learning Panel at London Business School', text: 'supported students exploring business education and early career development' },
  { title: 'Navigating Law Panel at Akin Gump', text: 'offered guidance to aspiring legal professionals' },
  { title: 'Design Horizons Panel at UCL', text: 'explored careers in design and creative industries' },
  { title: 'Kosova in International Relations at LSE', text: "examined Kosovo's geopolitical role and global partnerships" },
  { title: "International Women's Day Panel", text: "hosted at a City law firm, celebrated women's achievements and the transformative impact of education" },
]

export default function About() {
  return (
    <div className="about-page">
      <Nav activePage="about" />

      {/* Hero */}
      <div className="about-hero">
        <h1>About the <span className="accent">UKAP</span> Foundation</h1>
        <p>Advancing education and learning — scholarships, mentoring and events</p>
      </div>

      <main className="about-container">
        {/* Who we are */}
        <section className="about-section">
          <h2 className="section-title">Who we are</h2>
          <p className="about-lead">
            The UKAP Foundation (UK Albanian Professionals Foundation) is a UK-registered
            charity dedicated to advancing the education and life opportunities of young
            adults, particularly, but not exclusively, those of Albanian heritage.
          </p>
          <p>
            What began in 2010 as a volunteer-led network of graduates and young
            professionals has grown into a formal charitable organisation with education
            at its heart. Guided by our Board of Trustees and powered by more than 42
            committed volunteers, our work was formally recognised with full charitable
            status in October 2025.
          </p>
        </section>

        {/* Mission statement */}
        <section className="about-mission">
          <span className="about-mission-label">Our mission</span>
          <blockquote>
            To strengthen social mobility by giving young people access to knowledge,
            skills and professional development opportunities.
          </blockquote>
        </section>

        {/* What we do */}
        <section className="about-section">
          <h2 className="section-title">What we do</h2>
          <p>We advance education for the public benefit through three core programmes:</p>
          <div className="about-programmes">
            {PROGRAMMES.map((p, i) => (
              <div
                key={p.title}
                className={`about-programme color-${p.color} ${i % 2 === 1 ? 'flip reveal-right' : 'reveal-left'}`}
              >
                <div className="programme-text">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p>
            These activities form the heart of our charitable purpose: advancing
            education and creating opportunities for learning, growth and advancement
            within our community and beyond.
          </p>
        </section>

        {/* Impact */}
        <section className="about-section">
          <h2 className="section-title">Our impact</h2>
          <p>
            In 2025 alone, we delivered more than 15 learning events, workshops, webinars
            and activities. Our programmes support students, unemployed young adults and
            emerging professionals by connecting them with industry leaders and
            delivering resources that build confidence and capability. To date, we have
            supported more than 2,000 participants across the UK and internationally.
          </p>

          <h3 className="about-subheading">Recent 2025 achievements</h3>
          <ul className="about-achievements">
            {ACHIEVEMENTS.map((a) => (
              <li key={a.title}>
                <strong>{a.title}</strong> {a.text}
              </li>
            ))}
          </ul>

          <p>
            Through collaboration, partnership-building and the unwavering commitment of
            our volunteer community, the UKAP Foundation continues to expand
            opportunities for learning and development, shaping brighter futures for the
            next generation.
          </p>
        </section>

        {/* Community note */}
        <aside className="about-note">
          <h3>Our community</h3>
          <p>
            Please note that <strong>UKAP Networking</strong>, an association of
            volunteers, organises general community networking events separately. This
            association does not benefit from the activities or resources of the UKAP
            Foundation.
          </p>
        </aside>

        {/* CTA */}
        <section className="about-cta">
          <h2>Be part of it</h2>
          <p>
            Join us in making a difference — as a volunteer, mentor, partner or donor.
          </p>
          <div className="about-cta-buttons">
            <Link to="/donate" className="btn-primary">Donate</Link>
            <Link to="/team" className="view-all-link">Meet the team</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
