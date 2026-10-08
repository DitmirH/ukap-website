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
 * Resources use generated PDFs plus sample files in scripts/seed-assets (Word, Excel,
 * PowerPoint, CSV, text, images, MP3) so every download type can be tested.
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

/** Minimal one-page PDF (Helvetica text) — so seeded resources have a real download */
function makePdf(title, lines) {
  const esc = (t) => t.replace(/[\\()]/g, (c) => '\\' + c)
  const ops = ['BT', '/F1 22 Tf', '56 780 Td', `(${esc(title)}) Tj`, '/F1 12 Tf', '0 -34 Td']
  lines.forEach((l) => ops.push(`(${esc(l)}) Tj`, '0 -20 Td'))
  ops.push('ET')
  const stream = ops.join('\n')
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = []
  objs.forEach((o, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${o}\nendobj\n` })
  const xref = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(pdf)
}

async function pdfFile(filename, title, lines) {
  const asset = await client.assets.upload('file', makePdf(title, lines), { filename, contentType: 'application/pdf' })
  return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
}

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


  // --- Resources (mixed media: PDF, Word, Excel, PowerPoint, CSV, text, images, audio, video) ---
  const SEED_ASSETS = path.resolve(process.cwd(), 'scripts/seed-assets')
  const TYPES = {
    pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    csv: 'text/csv', txt: 'text/plain', mp3: 'audio/mpeg', png: 'image/png', jpg: 'image/jpeg',
  }
  /** Upload a file from scripts/seed-assets as a downloadable file */
  const seedFile = async (name) => {
    const asset = await client.assets.upload('file', fs.readFileSync(path.join(SEED_ASSETS, name)), { filename: name, contentType: TYPES[name.split('.').pop()] })
    return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
  }
  /** Upload a file from scripts/seed-assets as an image (for image blocks) */
  const seedImage = async (name, alt, caption) => {
    const asset = await client.assets.upload('image', fs.readFileSync(path.join(SEED_ASSETS, name)), { filename: name })
    return { _type: 'image', _key: key(), asset: { _type: 'reference', _ref: asset._id }, alt, caption }
  }
  /** Bullet or numbered list blocks */
  const list = (kind, items) => items.map((text) => ({
    _type: 'block', _key: key(), style: 'normal', listItem: kind, level: 1, markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }))
  const dl = (title, description, file) => ({ _key: key(), _type: 'resourceFile', title, description, file })
  const inlineDl = (title, description, file) => ({ _type: 'fileDownload', _key: key(), title, description, file })
  const lnk = (title, url, description) => ({ _key: key(), _type: 'resourceLink', title, url, description })
  const linkCard = (title, url, description) => ({ _type: 'linkCard', _key: key(), title, url, description })

  const cvChecklist = await pdfFile('ukap-cv-checklist.pdf', 'UKAP CV checklist', [
    '1. Keep it to two pages.',
    '2. Start with a three-line profile tailored to the role.',
    '3. Lead every bullet with an action verb and a result.',
    '4. Quantify: numbers, percentages, money, time saved.',
    '5. Put education first if you graduated in the last two years.',
    '6. Use one clean font and consistent dates.',
    '7. Save and send as PDF named Firstname-Lastname-CV.pdf.',
  ])
  const cvTemplate = await seedFile('ukap-cv-template.docx')
  const cvLayoutFile = await seedFile('cv-layout-example.jpg')
  const financeSlides1 = await pdfFile('finance-2026-session-1.pdf', 'Finance 2026 - Session 1 slides', [
    'Introduction to financial statements',
    'Income statement, balance sheet, cash flow',
    'Exercise: read a real annual report',
    'Homework: build a three-statement summary in Excel',
  ])
  const financeSlides2 = await seedFile('finance-2026-session-2.pptx')
  const financeModel = await seedFile('finance-2026-practice-model.xlsx')
  const financeData = await seedFile('finance-2026-sample-data.csv')
  const financeWorkbook = await pdfFile('finance-2026-workbook.pdf', 'Finance 2026 - Workbook', [
    'Week 1: Accounting basics',
    'Week 2: Valuation and DCF',
    'Week 3: Markets and trading',
    'Week 4: Interviews and assessment centres',
  ])
  const interviewAudio = await seedFile('interview-practice-questions.mp3')
  const starFile = await seedFile('star-method.png')
  const scholarshipChecklist = await seedFile('scholarship-application-checklist.txt')
  const scholarshipGuide = await pdfFile('ukap-scholarship-guide.pdf', 'UKAP scholarship guide', [
    'Who can apply: students in the UK or Albania starting or continuing a degree.',
    'What we fund: tuition contributions, books and equipment, travel.',
    'How to apply: online form, personal statement, two references.',
    'What happens next: shortlisting, interview, decision within six weeks.',
  ])

  const resources = [
    {
      _id: 'seed-resource-cv-tips', title: 'CV writing tips', slug: 'cv-writing-tips', category: 'careers', colour: 'blue-main',
      img: 'graduate-yellow.jpg', featured: true, date: '2026-09-20T09:00:00Z', tags: ['CV', 'applications', 'graduates', 'template'],
      summary: 'Practical advice from UKAP mentors on writing a CV that gets you to interview — with a Word template and printable checklist.',
      content: [
        ...pt('A strong CV is the single most useful thing you can prepare for your career. These tips come from UKAP mentors who read hundreds of applications a year.'),
        { _type: 'tipList', _key: key(), title: '7 CV tips from our mentors', tips: [
          'Keep it to two pages — recruiters spend seconds on the first scan.',
          'Open with a three-line profile tailored to the job you are applying for.',
          'Start every bullet with an action verb and finish with a result.',
          'Quantify wherever you can: numbers, percentages, money, time saved.',
          'Recent graduate? Put education first, with relevant modules and grades.',
          'Use one clean font, consistent dates and no photos.',
          'Send it as a PDF named Firstname-Lastname-CV.pdf.',
        ] },
        ...pt(['h2', 'A layout that works']),
        await seedImage('cv-layout-example.jpg', 'Example one-page CV layout', 'A clean layout: name and contact details, profile, education, experience, skills.'),
        ...pt('Start from our Word template — replace the placeholder text and keep the structure.'),
        inlineDl('CV template (Word)', 'Edit in Word or Google Docs, then save as PDF.', cvTemplate),
        { _type: 'callout', _key: key(), tone: 'tip', title: 'Ask for a review', text: 'UKAP mentees can ask their mentor for a CV review at any session — bring a printed copy.' },
        ...pt(['h2', 'Cover letters'], 'Keep cover letters to one page. Cover three things:'),
        ...list('number', ['Why this company — something specific you admire.', 'Why this role — how it fits your skills and plans.', 'What you will bring — one or two examples with results.']),
        ...pt(['blockquote', '“Mirror the language of the job advert. If they ask for ‘stakeholder management’, use those words.” — UKAP mentor, Finance']),
        linkCard('National Careers Service — CV advice', 'https://nationalcareers.service.gov.uk/careers-advice/cv-sections', 'Free government guidance on each CV section'),
      ],
      downloads: [
        dl('CV template', 'Word document — edit and save as PDF', cvTemplate),
        dl('CV checklist', 'One-page printable checklist', cvChecklist),
        dl('Example CV layout', 'Image you can print or keep as a reference', cvLayoutFile),
      ],
      links: [
        lnk('National Careers Service — CV advice', 'https://nationalcareers.service.gov.uk/careers-advice/cv-sections', 'Free government guidance on each CV section'),
        lnk('Prospects — example CVs', 'https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters', 'Graduate CV examples and templates'),
      ],
    },
    {
      _id: 'seed-resource-finance-2026', title: 'Training materials — Finance 2026', slug: 'training-materials-finance-2026', category: 'finance', colour: 'black-main',
      img: 'training.jpg', date: '2026-09-05T09:00:00Z', tags: ['finance', 'Excel', '2026', 'training', 'DCF'],
      summary: 'Slides, an Excel practice model, sample data and a workbook from the 2026 finance training programme.',
      content: [
        ...pt('Everything from the 2026 finance training programme in one place. Download the slides for each session and work through the exercises using the practice model.'),
        { _type: 'callout', _key: key(), tone: 'info', title: 'Programme dates', text: 'Sessions run monthly from January to April 2026. New materials are added within a week of each session.' },
        ...pt(['h2', 'What you will cover']),
        ...list('bullet', ['Financial statements — income statement, balance sheet, cash flow', 'Valuation — discounted cash flow and comparable companies', 'Markets — how trading desks work', 'Interviews — technical questions and assessment centres']),
        ...pt(['h2', 'Sessions'], ['h3', 'Session 1 — Financial statements']),
        inlineDl('Session 1 slides (PDF)', 'Introduction to the three financial statements', financeSlides1),
        ...pt(['h3', 'Session 2 — Valuation']),
        inlineDl('Session 2 slides (PowerPoint)', 'Valuation basics and DCF', financeSlides2),
        { ...(await photo('training.jpg')), _key: key(), alt: 'Mentees at a finance training session', caption: 'Session 1 at our London venue.' },
        ...pt(['h2', 'Practice'], 'Open the Excel model and complete the three exercises on the second tab. Use the sample company data to try your own comparisons.'),
        { _type: 'tipList', _key: key(), title: 'Before session 3', tips: ['Complete the exercises in the practice model.', 'Value one of the sample companies using a simple DCF.', 'Bring one question for the panel.'] },
      ],
      downloads: [
        dl('Session 1 slides', 'PDF — financial statements', financeSlides1),
        dl('Session 2 slides', 'PowerPoint — valuation and DCF', financeSlides2),
        dl('Practice model', 'Excel — three-statement model with exercises', financeModel),
        dl('Sample company data', 'CSV — open in Excel or Google Sheets', financeData),
        dl('Programme workbook', 'PDF — exercises for weeks 1–4', financeWorkbook),
      ],
      links: [lnk('Corporate Finance Institute — free courses', 'https://corporatefinanceinstitute.com/', 'Free introductory finance courses')],
    },
    {
      _id: 'seed-resource-interview-prep', title: 'Interview preparation guide', slug: 'interview-preparation-guide', category: 'careers', colour: 'gold-main',
      img: 'mentor-chat.jpg', date: '2026-08-15T09:00:00Z', tags: ['interviews', 'STAR', 'audio', 'video'],
      summary: 'How to prepare for competency interviews using the STAR method — with a practice audio, a talk to watch and a printable guide.',
      content: [
        ...pt('Most graduate interviews ask competency questions: "Tell me about a time when…". The STAR method keeps your answers clear and complete.'),
        await seedImage('star-method.png', 'The STAR method: Situation, Task, Action, Result', 'Use STAR to structure every competency answer.'),
        ...pt(['h2', 'Prepare five stories'], 'Pick five experiences from your studies, work or volunteering. Write each one out using STAR. Most questions can be answered with one of them.'),
        ...pt(['h2', 'Practise out loud'], 'Play the practice questions below, pause after each one and answer out loud as if you were in the room.'),
        inlineDl('Practice questions (audio)', 'Three common questions — about one minute', interviewAudio),
        ...pt(['h2', 'Confidence on the day'], 'Body language changes how others see you — and how you feel. This well-known talk is worth ten minutes before an interview.'),
        { _type: 'video', _key: key(), url: 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc', caption: 'Amy Cuddy — Your body language may shape who you are (TED)' },
        { _type: 'tipList', _key: key(), title: 'On the day', tips: ['Arrive ten minutes early, or log in five minutes early online.', 'Bring two questions for the interviewer.', 'Send a short thank-you email the same day.'] },
        { _type: 'callout', _key: key(), tone: 'important', title: 'Online interviews', text: 'Test your camera and microphone the day before, and sit facing a window or lamp.' },
      ],
      downloads: [
        dl('STAR method guide', 'Image — print it or keep it on your phone', starFile),
        dl('Practice questions', 'MP3 audio — about one minute', interviewAudio),
      ],
      links: [lnk('Prospects — interview tips', 'https://www.prospects.ac.uk/careers-advice/interview-tips', 'Common questions and how to answer them')],
    },
    {
      _id: 'seed-resource-scholarship-guide', title: 'Scholarship application guide', slug: 'scholarship-application-guide', category: 'scholarships', colour: 'red-main',
      img: 'scholarships.jpg', date: '2026-07-01T09:00:00Z', tags: ['scholarships', 'personal statement', 'checklist'],
      summary: 'Everything you need to apply for a UKAP scholarship: eligibility, a step-by-step checklist and how to write a strong personal statement.',
      content: [
        ...pt('UKAP scholarships support students in the UK and Albania. Read this guide before you start your application.'),
        { _type: 'callout', _key: key(), tone: 'important', title: 'Deadline', text: 'Applications for the 2027 cohort open in spring 2027.' },
        ...pt(['h2', 'Who can apply']),
        ...list('bullet', ['Students starting or continuing a degree in the UK or Albania', 'Applicants with financial need', 'People who can show commitment to their community']),
        ...pt(['h2', 'Your personal statement'], 'Tell us who you are, what you want to study and why, and what you will do with your degree. Be specific and honest — we want to hear your voice.'),
        ...pt(['blockquote', '“Talent is equally distributed; opportunity is not. Our scholarships exist to close that gap.” — UKAP Foundation']),
        ...pt('Persistence matters as much as grades. This talk explains why:'),
        { _type: 'video', _key: key(), url: 'https://www.youtube.com/watch?v=H14bBuluwB8', caption: 'Angela Lee Duckworth — Grit: the power of passion and perseverance (TED)' },
        inlineDl('Application checklist', 'Plain-text checklist — tick off each item', scholarshipChecklist),
        linkCard('UCAS — student finance', 'https://www.ucas.com/finance', 'Other funding you may be entitled to'),
      ],
      downloads: [
        dl('Scholarship guide', 'PDF — eligibility, funding and process', scholarshipGuide),
        dl('Application checklist', 'Text file', scholarshipChecklist),
      ],
      links: [lnk('UCAS — student finance', 'https://www.ucas.com/finance', 'Other funding you may be entitled to')],
    },
  ]
  for (const r of resources) {
    tx.createOrReplace({
      _id: r._id, _type: 'resource', title: r.title, slug: { _type: 'slug', current: r.slug }, category: r.category,
      summary: r.summary, coverImage: { ...(await photo(r.img)), alt: r.title }, cardColour: r.colour, tags: r.tags,
      publishedAt: r.date, featured: !!r.featured, hidden: false, content: r.content, downloads: r.downloads, links: r.links,
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
