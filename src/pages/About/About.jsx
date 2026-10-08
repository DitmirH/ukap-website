import { Link } from 'react-router-dom'
import { Nav, Footer, PageHeader, SectionHead, FeatureBanner } from '../../components'
import './About.css'

const PROGRAMMES = [
  {
    title: 'Scholarships',
    image: '/images/scholarships.jpg',
    color: 'blue',
    text: 'Providing merit-based and needs-based scholarships that enable young adults to pursue academic excellence and unlock educational pathways.',
  },
  {
    title: 'Mentoring',
    image: '/images/mentoring.jpg',
    color: 'red',
    text: 'Connecting students and early career professionals with experienced mentors who offer guidance, industry perspectives and career development support.',
  },
  {
    title: 'Educational & Skills Training',
    image: '/images/training.jpg',
    color: 'gold',
    text: 'Delivering workshops, panel discussions and training sessions that build capabilities, enhance competencies and equip young adults with practical skills for their future.',
  },
]

const IMPACT = [
  { num: '2,000+', label: 'participants supported to date, in the UK and internationally', tint: 'blue' },
  { num: '15+', label: 'learning events, workshops and webinars delivered in 2025', tint: 'red' },
  { num: '11', label: 'scholarships awarded with the CFA Institute', tint: 'yellow' },
  { num: '42+', label: 'volunteers powering every programme we run', tint: 'blue' },
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

      <PageHeader
        tone="blue"
        photo="/images/students.jpg"
        eyebrow="About us"
        title={<>About the <span className="accent">UKAP</span> Foundation</>}
        subtitle="Advancing education and learning through scholarships, mentoring and events."
        crumbs={[{ label: 'About' }]}
      />

      {/* Who we are */}
      <section className="section">
        <div className="container about-split">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="section-title">From volunteer network to registered charity</h2>
          </div>
          <div className="about-prose">
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
          </div>
        </div>
      </section>

      {/* Mission statement — full-bleed red block */}
      <section className="about-mission">
        <div className="container">
          <span className="eyebrow on-dark">Our mission</span>
          <blockquote>
            To strengthen social mobility by giving young people access to knowledge,
            skills and professional development opportunities.
          </blockquote>
        </div>
        <span className="ukap-watermark about-mission-mark" aria-hidden="true" />
      </section>

      {/* What we do */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="What we do"
            title="Three core programmes"
            lead="We advance education for the public benefit through three core programmes."
          />
          <div className="about-programmes">
            {PROGRAMMES.map((p) => (
              <article key={p.title} className="card">
                <div className="card-media">
                  <img src={p.image} alt="" loading="lazy" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-text">{p.text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="about-after">
            These activities form the heart of our charitable purpose: advancing
            education and creating opportunities for learning, growth and advancement
            within our community and beyond.
          </p>
        </div>
      </section>

      <FeatureBanner
        image="/images/volunteers.jpg"
        eyebrow="Powered by volunteers"
        title="42+ professionals giving their time"
        text="From finance and law to healthcare, engineering and the creative industries — our volunteers mentor, teach and organise every programme we run."
        cta="Meet the team"
        to="/team"
        tone="blue"
        align="left"
      />

      {/* Impact */}
      <section className="section section-alt">
        <div className="container">
          <SectionHead
            eyebrow="Our impact"
            title={<>2025 in <span className="accent">numbers</span></>}
            lead="Our programmes support students, unemployed young adults and emerging professionals by connecting them with industry leaders and delivering resources that build confidence and capability."
          />
          <div className="about-stats">
            {IMPACT.map((s) => (
              <div key={s.num} className={`tile tint-${s.tint}`}>
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="about-split about-highlights">
            <div>
              <span className="eyebrow">Highlights</span>
              <h3 className="about-subheading">Recent 2025 achievements</h3>
              <p className="about-muted">
                Through collaboration, partnership-building and the unwavering commitment of
                our volunteer community, we continue to expand opportunities for learning and
                development.
              </p>
            </div>
            <ul className="about-achievements">
              {ACHIEVEMENTS.map((a) => (
                <li key={a.title}>
                  <strong>{a.title}</strong>
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Community note */}
      <section className="section about-note-wrap">
        <div className="container">
          <aside className="about-note">
            <h3>A note on our community</h3>
            <p>
              <strong>UKAP Networking</strong>, an association of volunteers, organises
              general community networking events separately. This association does not
              benefit from the activities or resources of the UKAP Foundation.
            </p>
          </aside>
        </div>
      </section>

      <section className="cta-band tone-blue">
        <div className="container cta-band-inner">
          <div>
            <span className="eyebrow on-dark">Be part of it</span>
            <h2>Volunteer, mentor, partner or donate</h2>
          </div>
          <div className="about-cta-buttons">
            <Link to="/donate" className="btn btn-yellow">Donate</Link>
            <Link to="/team" className="btn btn-outline-light">Meet the team</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
