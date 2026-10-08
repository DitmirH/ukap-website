/**
 * Site-wide password gate (Vercel Routing Middleware).
 *
 * - Set SITE_PASSWORD in Vercel → Settings → Environment Variables to turn it on.
 * - Delete SITE_PASSWORD (and redeploy) to make the site public.
 * - Changing the password logs everyone out.
 * - The live domains (PRODUCTION_HOSTS) stay public unless PROTECT_PRODUCTION=true,
 *   so the staging vercel.app URL can stay locked after launch.
 * Only runs on Vercel — `npm run dev` is not affected.
 */
import { next } from '@vercel/functions'

export const config = { runtime: 'nodejs' }

const PRODUCTION_HOSTS = ['ukapfoundation.org', 'www.ukapfoundation.org']
const COOKIE = 'ukap_preview'
const LOGIN_PATH = '/__unlock'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days
// Needed by the password page itself
const PUBLIC_PREFIXES = ['/brand/', '/fonts/', '/favicon']

async function sha256(text) {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || ''
  const match = header.split(/;\s*/).find((c) => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

const safeNext = (value) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/')

function page({ error = false, nextPath = '/' } = {}) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>UKAP Foundation — Preview</title>
<link rel="icon" type="image/png" href="/brand/favicon-64.png" />
<style>
  @font-face { font-family: Selawik; src: url(/fonts/selawk.woff2) format("woff2"); font-weight: 400; }
  @font-face { font-family: Selawik; src: url(/fonts/selawkb.woff2) format("woff2"); font-weight: 700; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh; display: grid; place-items: center; padding: 24px;
    font-family: Selawik, "Segoe UI", system-ui, sans-serif; color: #111317;
    background: #0b0b0c;
  }
  .card { width: 100%; max-width: 440px; background: #fff; }
  .bar { display: grid; grid-template-columns: 1fr 1fr 1fr; height: 8px; }
  .bar span:nth-child(1) { background: #3f7ec2; }
  .bar span:nth-child(2) { background: #db4a47; }
  .bar span:nth-child(3) { background: #e2be74; }
  .inner { padding: 40px 36px 36px; }
  .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
  .brand img { height: 44px; }
  .brand b { display: block; font-size: 1.15rem; letter-spacing: .02em; line-height: 1; }
  .brand small { display: block; font-size: .62rem; letter-spacing: .24em; text-transform: uppercase; color: #545b67; margin-top: 4px; }
  h1 { font-size: 1.9rem; line-height: 1; text-transform: uppercase; margin-bottom: 10px; }
  p { color: #4a515c; line-height: 1.5; margin-bottom: 24px; }
  label { display: block; font-weight: 700; font-size: .9rem; margin-bottom: 6px; }
  input {
    width: 100%; font: inherit; font-size: 1rem; padding: 14px 16px;
    border: 2px solid #c9ced6; background: #f4f6f8; outline: none;
  }
  input:focus { border-color: #3f7ec2; background: #fff; }
  button {
    width: 100%; margin-top: 16px; padding: 15px; border: 0; cursor: pointer;
    font: inherit; font-weight: 700; font-size: 1rem; background: #e2be74; color: #111317;
  }
  button:hover { background: #111317; color: #fff; }
  .error { background: #fbced1; color: #8e111a; padding: 10px 14px; font-weight: 700; font-size: .92rem; margin-bottom: 16px; }
</style>
</head>
<body>
  <main class="card">
    <div class="bar"><span></span><span></span><span></span></div>
    <div class="inner">
      <div class="brand">
        <img src="/brand/ukap-mark.png" alt="" />
        <span><b>UKAP</b><small>Foundation</small></span>
      </div>
      <h1>Preview access</h1>
      <p>This site is in preview. Enter the password to continue.</p>
      ${error ? '<div class="error" role="alert">Incorrect password. Please try again.</div>' : ''}
      <form method="POST" action="${LOGIN_PATH}">
        <input type="hidden" name="next" value="${nextPath.replace(/"/g, '&quot;')}" />
        <label for="pw">Password</label>
        <input id="pw" name="password" type="password" autocomplete="current-password" required autofocus />
        <button type="submit">Enter site</button>
      </form>
    </div>
  </main>
</body>
</html>`
  return new Response(html, {
    status: 401,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  })
}

export default async function middleware(request) {
  const password = process.env.SITE_PASSWORD
  if (!password) return next() // gate disabled

  const url = new URL(request.url)
  if (PRODUCTION_HOSTS.includes(url.hostname) && process.env.PROTECT_PRODUCTION !== 'true') return next()
  if (PUBLIC_PREFIXES.some((p) => url.pathname.startsWith(p))) return next()

  const expected = await sha256(`ukap:${password}`)

  // Handle the password form
  if (url.pathname === LOGIN_PATH && request.method === 'POST') {
    const form = await request.formData()
    const nextPath = safeNext(String(form.get('next') || '/'))
    if (String(form.get('password') || '') !== password) {
      return page({ error: true, nextPath })
    }
    return new Response(null, {
      status: 303,
      headers: {
        location: nextPath,
        'set-cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
        'cache-control': 'no-store',
      },
    })
  }

  if (readCookie(request, COOKIE) === expected) return next()

  return page({ nextPath: url.pathname === LOGIN_PATH ? '/' : url.pathname + url.search })
}
