/**
 * Seed demo content into the DEVELOPMENT dataset only.
 *
 *   cd studio
 *   npx sanity exec scripts/seed-dev.js --with-user-token            # add / refresh demo content
 *   npx sanity exec scripts/seed-dev.js --with-user-token -- --delete  # remove it again
 *
 * Every seeded document has an _id starting with "seed-", so re-running replaces
 * rather than duplicates, and --delete removes exactly what this script created.
 * Photos come from ../public/images (placeholder stock photos, see CREDITS.md).
 * Sponsors are fictional demo companies with generated logos.
 */
import fs from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

const DATASET = 'development' // hard-coded on purpose: never touch production
const client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ dataset: DATASET })

const IMAGES = path.resolve(process.cwd(), '../public/images')
let k = 0
const key = () => `k${(k++).toString(36)}${Math.random().toString(36).slice(2, 7)}`

/** Portable Text from simple entries: 'text', ['h2', 'text'], ['blockquote', 'text'] */
const pt = (...items) =>
  items.map((it) => {
    const [style, text] = Array.isArray(it) ? it : ['normal', it]
    return { _type: 'block', _key: key(), style, markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] }
  })

const uploadCache = {}
async function photo(file) {
  if (!uploadCache[file]) {
    const asset = await client.assets.upload('image', fs.readFileSync(path.join(IMAGES, file)), { filename: file })
    uploadCache[file] = asset._id
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: uploadCache[file] } }
}

function logoSvg(name, mark, bg, fg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="200" viewBox="0 0 640 200">
  <rect x="20" y="40" width="120" height="120" fill="${bg}"/>
  <text x="80" y="122" font-family="Arial Black, Arial, sans-serif" font-size="64" font-weight="900" fill="${fg}" text-anchor="middle">${mark}</text>
  <text x="166" y="120" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="#0B0B0C">${name}</text>
</svg>`
}

async function logo(slug, name, mark, bg, fg) {
  const asset = await client.assets.upload('image', Buffer.from(logoSvg(name, mark, bg, fg)), {
    filename: `${slug}.svg`,
    contentType: 'image/svg+xml',
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: `${name} logo` }
}

const day = (iso) => new Date(iso).toISOString()

async function seed() {
  console.log(`Seeding demo content into "${DATASET}"…`)
  const tx = client.transaction()

  // --- Author ---
  tx.createOrReplace({ _id: 'seed-author-ukap', _type: 'author', name: 'UKAP Team', role: 'UK Albanian Professionals Foundation' })
  const author = { _type: 'reference', _ref: 'seed-author-ukap' }

  // --- Articles ---
  const posts = [
    {
      id: 'seed-post-scholars-2026', slug: 'meet-our-2026-scholars', date: '2026-09-28T09:00:00Z', img: 'graduates-red.jpg',
      title: 'Meet our 2026 scholars',
      excerpt: 'Twelve students from across the UK and Albania join this year’s scholarship cohort — here’s what they’re studying and why.',
      body: pt(
        'This autumn we welcomed twelve new scholars, our largest cohort yet. Between them they are studying medicine, engineering, law, economics and the creative arts at universities across the UK and Albania.',
        ['h2', 'More than a grant'],
        'Every scholar is matched with a mentor from our professional network and joins a year of skills workshops, from CV writing to public speaking.',
        ['blockquote', '“The funding matters, but the people behind it matter more.” — 2026 scholar'],
        'Applications for the 2027 cohort open in the spring. Sign up to our newsletter to be the first to hear.'
      ),
    },
    {
      id: 'seed-post-mentoring-spring', slug: 'mentoring-programme-opens-for-spring', date: '2026-09-10T09:00:00Z', img: 'mentor-chat.jpg',
      title: 'Mentoring programme opens for spring',
      excerpt: 'We’re looking for students and early-career professionals who want one-to-one support from a mentor in their field.',
      body: pt(
        'Our spring mentoring programme pairs mentees with experienced professionals in finance, law, medicine, technology and the public sector.',
        ['h2', 'How it works'],
        'Mentors and mentees meet at least once a month for six months, online or in person, with a shared goal agreed at the start.',
        'Applications close at the end of November. Mentors are also welcome — we are especially keen to hear from engineers and healthcare professionals.'
      ),
    },
    {
      id: 'seed-post-finance-recap', slug: 'albanians-in-finance-highlights', date: '2026-08-22T09:00:00Z', img: 'networking.jpg',
      title: 'Albanians in Finance: highlights from the night',
      excerpt: 'Over 150 guests joined us in the City for an evening of panels, networking and a few surprise announcements.',
      body: pt(
        'Our flagship finance evening brought together bankers, analysts, founders and students for a candid conversation about building a career in the City.',
        ['h2', 'What we heard'],
        'Panellists shared how they broke into the industry, the mistakes they would avoid and the skills they look for when hiring graduates.',
        'Thank you to everyone who came, and to our hosts for the venue. Photos from the night are on our Instagram.'
      ),
    },
    {
      id: 'seed-post-volunteers', slug: 'volunteers-wanted-for-our-winter-gala', date: '2026-07-30T09:00:00Z', img: 'volunteers.jpg',
      title: 'Volunteers wanted for our winter gala',
      excerpt: 'Help us make this year’s gala the best yet — we need volunteers for welcome, auctions and behind-the-scenes support.',
      body: pt(
        'Our winter gala is our biggest fundraiser of the year, and it only happens thanks to volunteers.',
        ['h2', 'Roles available'],
        'We need help with guest welcome, the silent auction, photography and set-up. No experience needed — just energy and a smile.',
        'Get in touch through our contact form and tell us which role you’d like.'
      ),
    },
  ]
  for (const p of posts) {
    tx.createOrReplace({
      _id: p.id, _type: 'post', title: p.title, slug: { _type: 'slug', current: p.slug }, author,
      mainImage: await photo(p.img), publishedAt: p.date, excerpt: p.excerpt, style: 'default', body: p.body,
    })
  }

  // --- Future events ---
  const events = [
    {
      id: 'seed-event-careers-workshop', slug: 'careers-in-law-workshop', date: '2026-11-14T10:00:00Z', time: '10:00am – 1:00pm',
      title: 'Careers in law workshop', category: 'workshop', img: 'training.jpg', price: 'Free', isFree: true, colour: 'blue-main',
      venue: 'UKAP Learning Space', address: '1 Example Street, London EC1A 1AA',
      excerpt: 'A hands-on morning with practising solicitors and barristers: applications, interviews and what the first year is really like.',
    },
    {
      id: 'seed-event-winter-gala', slug: 'winter-gala-2026', date: '2026-12-05T18:30:00Z', time: '6:30pm – 11:30pm',
      title: 'Winter Gala 2026', category: 'gala', img: 'gala.jpg', price: 'From £85', featured: true, colour: 'black-main',
      venue: 'The Grand Hall', address: '10 Example Square, London W1A 1AA',
      excerpt: 'Our annual black-tie evening of dinner, music and a charity auction — every ticket funds scholarships for young people.',
    },
    {
      id: 'seed-event-tech-networking', slug: 'albanians-in-tech-networking', date: '2027-01-21T18:00:00Z', time: '6:00pm – 9:00pm',
      title: 'Albanians in Tech networking', category: 'networking', img: 'audience.jpg', price: '£10', colour: 'red-main',
      venue: 'Shoreditch Studio', address: '25 Example Road, London E1 6AA',
      excerpt: 'Founders, engineers and product people share how they got started — followed by drinks and networking.',
    },
    {
      id: 'seed-event-education-conference', slug: 'future-of-education-conference', date: '2027-03-06T09:30:00Z', time: '9:30am – 5:00pm',
      title: 'Future of education conference', category: 'conference', img: 'students.jpg', price: '£25 (students £5)', colour: 'gold-main',
      venue: 'Conference Centre', address: '50 Example Lane, London WC1A 1AA',
      excerpt: 'A day of talks and workshops on access to higher education, scholarships and skills for the next generation.',
    },
  ]
  for (const e of events) {
    tx.createOrReplace({
      _id: e.id, _type: 'event', title: e.title, slug: { _type: 'slug', current: e.slug }, date: day(e.date), time: e.time,
      venue: e.venue, address: e.address, excerpt: e.excerpt, image: { ...(await photo(e.img)), alt: e.title },
      body: pt(e.excerpt, ['h2', 'What to expect'], 'Full programme and speakers to be announced. Tickets are limited, so book early.'),
      ticketLink: 'https://www.tickettailor.com/', ticketPrice: e.price, isFree: !!e.isFree, category: e.category,
      featured: !!e.featured, hidden: false, cardColour: e.colour,
    })
  }

  // --- Sponsors (fictional demo companies) ---
  const sponsors = [
    { id: 'seed-sponsor-northvale', name: 'Northvale Capital', mark: 'N', bg: '#0B0B0C', fg: '#E2BE74', tier: 'gold', tagline: 'Investing in future talent' },
    { id: 'seed-sponsor-adriatica', name: 'Adriatica Legal', mark: 'A', bg: '#3F7EC2', fg: '#FFFFFF', tier: 'silver', tagline: 'Proud supporter of UKAP scholarships' },
    { id: 'seed-sponsor-ilirion', name: 'Ilirion Tech', mark: 'I', bg: '#DB4A47', fg: '#FFFFFF', tier: 'partner', tagline: 'Mentoring the next generation of engineers' },
  ]
  for (const [i, s] of sponsors.entries()) {
    const slug = s.id.replace('seed-sponsor-', '')
    tx.createOrReplace({
      _id: s.id, _type: 'sponsor', name: s.name, slug: { _type: 'slug', current: slug },
      logo: await logo(slug, s.name, s.mark, s.bg, s.fg), tier: s.tier, tagline: s.tagline,
      description: pt(`${s.name} is a demo sponsor added for testing the development site.`),
      featured: i === 0, order: 100 + i, hidden: false,
    })
  }

  const res = await tx.commit()
  console.log(`Done: ${res.results.length} documents written to "${DATASET}".`)
}

async function remove() {
  const ids = await client.fetch(`*[_id match "seed-*"]._id`)
  if (!ids.length) return console.log('Nothing to delete.')
  const tx = client.transaction()
  ids.forEach((id) => tx.delete(id))
  await tx.commit()
  console.log(`Deleted ${ids.length} seeded documents from "${DATASET}". (Uploaded images stay in the media library.)`)
}

;(process.argv.includes('--delete') ? remove() : seed()).catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
