# UKAP Web

A modern React website for the UKAP Foundation with Sanity CMS integration.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UKAP WEB ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  SANITY STUDIO  │────►│  SANITY CLOUD   │◄────│  REACT WEBSITE  │
│  (Content CMS)  │     │   (Database)    │     │   (Frontend)    │
│                 │     │                 │     │                 │
│  localhost:3333 │     │   Hosted by     │     │  localhost:5173 │
│                 │     │   Sanity.io     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │   Create/Edit         │   Store Data          │   Fetch & Display
        │   Content             │                       │   Content
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ • Blog Posts    │     │ • Project ID:   │     │ • Homepage      │
│ • Team Members  │     │   ijgeixey      │     │ • Blog Pages    │
│ • Hero Slides   │     │ • Dataset:      │     │ • Team Page     │
│ • Authors       │     │   production    │     │ • Contact Form  │
└─────────────────┘     └─────────────────┘     └─────────────────┘

                        ┌─────────────────┐
                        │                 │
                        │  EXPRESS SERVER │
                        │   (Backend)     │
                        │                 │
                        │  localhost:3001 │
                        │                 │
                        └─────────────────┘
                                │
                                │   Send Emails via
                                │   Microsoft 365 SMTP
                                ▼
                        ┌─────────────────┐
                        │                 │
                        │  EMAIL INBOX    │
                        │                 │
                        │  ditmir@        │
                        │  ukapfoundation │
                        │  .org           │
                        │                 │
                        └─────────────────┘
```

---

## Project Structure

```
ukap_web/
│
├── src/                          # React Frontend
│   ├── components/               # Reusable UI components
│   │   ├── Nav/                  # Navigation bar
│   │   ├── Footer/               # Site footer
│   │   ├── ContactForm/          # Contact form
│   │   ├── BlogCard/             # Blog post card
│   │   ├── TeamCard/             # Team member card
│   │   ├── HeroCarousel/         # Homepage hero carousel
│   │   └── index.js              # Component exports
│   │
│   ├── pages/                    # Page components
│   │   ├── Home/                 # Homepage (/, contact + carousel)
│   │   ├── Blog/                 # Blog listing (/blog)
│   │   ├── BlogPost/             # Individual post (/blog/:slug)
│   │   ├── Team/                 # Team page (/team)
│   │   └── index.js              # Page exports
│   │
│   ├── lib/                      # Utilities
│   │   └── sanityClient.js       # Sanity connection config
│   │
│   ├── styles/                   # Global styles
│   │   └── index.css
│   │
│   └── main.jsx                  # App entry point & routes
│
├── studio/                       # Sanity CMS Studio
│   ├── schemaTypes/              # Content schemas
│   │   ├── post.js               # Blog post schema
│   │   ├── author.js             # Author schema
│   │   ├── teamMember.js         # Team member schema
│   │   ├── heroSlide.js          # Hero carousel schema
│   │   └── index.js              # Schema exports
│   │
│   ├── sanity.config.js          # Studio configuration
│   └── package.json
│
├── server/                       # Express Backend
│   ├── index.js                  # Email server
│   └── package.json
│
├── .env.development              # Dev environment (frontend + server)
├── .env.production               # Prod environment (frontend + server)
├── .env.example                  # Template for env files
├── .gitignore                    # Git ignore rules
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite configuration
└── index.html                    # HTML entry point
```

---

## How Data Flows

### Sanity CMS → Website

1. **Create content** in Sanity Studio (`http://localhost:3333`)
2. **Sanity saves** to cloud database (project: `ijgeixey`)
3. **React fetches** using `@sanity/client`
4. **Components render** the content

```javascript
// Example: Fetching hero slides
import { client } from '../../lib/sanityClient'

useEffect(() => {
  client
    .fetch(`*[_type == "heroSlide" && active == true]`)
    .then((data) => setSlides(data))
}, [])
```

### Contact Form → Email

1. User submits form on website
2. React sends POST to `localhost:3001/api/contact`
3. Express server sends email via Microsoft 365 SMTP
4. Email arrives at `ditmir@ukapfoundation.org`

---

## Sanity Content Types

| Schema | Description | Fields |
|--------|-------------|--------|
| `post` | Blog posts | title, slug, author, image, excerpt, body, style |
| `author` | Blog authors | name, image, role |
| `teamMember` | Team members | name, role, category, image, bio, linkedIn |
| `heroSlide` | Hero carousel | title, subtitle, image, buttons, duration |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Sanity account (free at sanity.io)

### Installation

```bash
# Install frontend dependencies
npm install

# Install studio dependencies
cd studio && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Setup

Copy `.env.example` to create your environment files:

**1. Create `.env.development` (for local dev):**

```env
# Frontend (Sanity)
VITE_SANITY_PROJECT_ID=ijgeixey
VITE_SANITY_DATASET=development

# Server
PORT=3001
SMTP_USER=your-email@ukapfoundation.org
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@ukapfoundation.org
```

**2. Create `.env.production` (for live site):**

```env
# Frontend (Sanity)
VITE_SANITY_PROJECT_ID=ijgeixey
VITE_SANITY_DATASET=production

# Server
PORT=3001
SMTP_USER=your-email@ukapfoundation.org
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@ukapfoundation.org
```

> **Note:** Both frontend and server use the same env file at the project root.

### Running the App

```bash
# Terminal 1 - React Frontend
npm run dev
# → http://localhost:5173

# Terminal 2 - Sanity Studio
cd studio && npm run dev
# → http://localhost:3333

# Terminal 3 - Email Server
cd server && npm run dev
# → http://localhost:3001
```

---

## Deployment

### Deployment Architecture

The website and Sanity Studio are **deployed separately**:

```
┌────────────────────────────────────────────────────────────────────┐
│                     SANITY HOSTING (Free)                          │
│                                                                    │
│                    ukap.sanity.studio                              │
│                           │                                        │
│              ┌────────────┴────────────┐                           │
│              │                         │                           │
│              ▼                         ▼                           │
│     ukap.sanity.studio/dev    ukap.sanity.studio/prod              │
│              │                         │                           │
│              ▼                         ▼                           │
│      development dataset       production dataset                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                      VERCEL (Recommended)                          │
│                                                                    │
│   ┌──────────────────────┐    ┌──────────────────────┐            │
│   │   Static Frontend    │    │  Serverless API      │            │
│   │   (dist/)            │    │  (api/contact.js)    │            │
│   │                      │    │                      │            │
│   │   Fetches from       │    │   Sends emails via   │            │
│   │   Sanity API         │    │   Microsoft 365      │            │
│   └──────────────────────┘    └──────────────────────┘            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

| App | Hosted On | Rebuild for content changes? |
|-----|-----------|------------------------------|
| **Sanity Studio** | sanity.studio (free) | N/A (it's the editor) |
| **Website + API** | Vercel (free) | **No** - fetches live from API |

### 1. Deploy Sanity Studio

The studio is deployed to Sanity's free hosting. One deployment gives you both workspaces:

```bash
cd studio
npx sanity login     # Authenticate (opens browser)
npx sanity deploy    # Deploy studio
```

Choose a hostname (e.g., `ukap`) → Your studio will be at:
- **https://ukap.sanity.studio/dev** → Development dataset
- **https://ukap.sanity.studio/prod** → Production dataset

Content editors use these URLs to create/edit content. No Netlify involvement.

### 2. Deploy Website (Vercel) - Recommended

Vercel is the recommended platform as it supports both the frontend and serverless API functions.

#### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it as a Vite project

#### Step 2: Configure Build Settings

Vercel should auto-detect these, but verify:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

#### Step 3: Add Environment Variables

Go to **Project Settings → Environment Variables** and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_SANITY_PROJECT_ID` | `ijgeixey` | Sanity project ID |
| `VITE_SANITY_DATASET` | `production` | Sanity dataset |
| `SMTP_USER` | `your-email@domain.org` | Microsoft 365 email |
| `SMTP_PASS` | `your-password` | Email password/app password |
| `CONTACT_EMAIL` | `contact@domain.org` | Where to receive form submissions |

#### Step 4: Deploy

Click **Deploy** - Vercel will build and deploy your site.

#### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐          ┌─────────────────┐              │
│   │                 │          │                 │              │
│   │  Static Site    │          │  Serverless     │              │
│   │  (dist/)        │          │  Functions      │              │
│   │                 │          │  (api/)         │              │
│   │  • Homepage     │          │                 │              │
│   │  • Blog         │          │  /api/contact   │              │
│   │  • Team         │          │  → Sends email  │              │
│   │                 │          │                 │              │
│   └─────────────────┘          └─────────────────┘              │
│           │                            │                         │
│           │  Fetches content           │  POST /api/contact      │
│           ▼                            ▼                         │
│   ┌─────────────────┐          ┌─────────────────┐              │
│   │  Sanity API     │          │  Microsoft 365  │              │
│   │  (ijgeixey)     │          │  SMTP           │              │
│   └─────────────────┘          └─────────────────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Project Structure for Vercel

```
ukap-web/
├── api/                    # Vercel Serverless Functions
│   └── contact.js          # POST /api/contact → sends email
├── dist/                   # Built frontend (after npm run build)
├── src/                    # React source
├── vercel.json             # Vercel configuration
└── package.json
```

#### Redeploying

- **Automatic**: Push to `main` branch triggers redeploy
- **Manual**: Vercel Dashboard → Deployments → Redeploy

#### Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors from Sanity | Add your Vercel URL to Sanity CORS origins (see below) |
| Contact form fails | Check environment variables are set in Vercel |
| 404 on page refresh | `vercel.json` handles SPA routing |
| Build fails | Check Node.js version (needs 18+) |

---

### Alternative: Deploy Website (Netlify)

```bash
npm run build
# Deploy dist/ folder
```

**Netlify Environment Variables** (Site settings → Environment variables):

```
VITE_SANITY_PROJECT_ID=ijgeixey
VITE_SANITY_DATASET=production
```

> **Note:** Netlify requires a separate backend for the contact form (see below).

The website fetches content **at runtime** from Sanity's API. When you update content in the studio, the website shows it immediately (after page refresh) - **no rebuild needed!**

### 3. Deploy Email Server (Only if using Netlify)

If using Vercel, the serverless function handles email. If using Netlify, deploy `server/` folder to Railway/Render:

- `PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_EMAIL`

Then update the contact form API URL accordingly.

### Content Workflow

```
1. Editor visits ukap.sanity.studio/prod
2. Creates/edits content (blog post, team member, etc.)
3. Clicks "Publish"
4. Content is live on website immediately (no deploy needed)
```

---

## Dual Dataset Setup (Dev/Prod)

This project uses two Sanity datasets:

| Dataset | Purpose | When Used |
|---------|---------|-----------|
| `development` | Testing & local dev | `npm run dev` |
| `production` | Live website | `npm run build` |

### Sanity Studio Workspaces

The studio has two workspaces:
- **http://localhost:3333/dev** → Development dataset
- **http://localhost:3333/prod** → Production dataset

### Creating the Development Dataset

1. Go to [sanity.io/manage/project/ijgeixey](https://sanity.io/manage/project/ijgeixey)
2. Click **Datasets** tab
3. Click **Create dataset**
4. Name: `development`
5. Visibility: Public

### How It Works

| Command | Env File | Dataset |
|---------|----------|---------|
| `npm run dev` | `.env.development` | development |
| `npm run build` | `.env.production` | production |

The server also reads from the same env files based on `NODE_ENV`.

---

## CORS Configuration

Add your production URLs to Sanity's allowed origins.

### Option 1: Via Sanity CLI (Recommended)

```bash
cd studio

# Add localhost for development
npx sanity cors add http://localhost:5173 --credentials

# Add your Vercel domain
npx sanity cors add https://your-app.vercel.app --credentials

# Add custom domain if you have one
npx sanity cors add https://your-domain.com --credentials
```

### Option 2: Via Sanity Dashboard

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select project → **API** → **CORS origins**
3. Click **Add CORS origin**
4. Add:
   - `http://localhost:5173` (development)
   - `https://your-app.vercel.app` (Vercel)
   - `https://your-domain.com` (custom domain)
5. Enable **"Allow credentials"** for each

### View Current CORS Origins

```bash
cd studio && npx sanity cors list
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router |
| CMS | Sanity.io |
| Backend | Express.js, Nodemailer |
| Email | Microsoft 365 SMTP |
| Styling | CSS (component-scoped) |

---

## License

© 2025 UKAP Foundation

