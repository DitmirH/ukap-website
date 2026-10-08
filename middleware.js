/**
 * Password gate for the hidden editor guide ONLY (Vercel Routing Middleware).
 * The rest of the site is public — the `matcher` below limits this to /editor-guide.
 *
 * - The guide lives at https://<site>/editor-guide (not linked anywhere, noindex).
 *   Its source is studio/EDITOR-MANUAL.html, copied into the build by vite.config.js.
 * - Set EDITOR_GUIDE_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.
 *   If it isn't set, the guide returns 404 (never public by accident).
 * - Changing the password logs everyone out.
 * Only runs on Vercel — `npm run dev` is not affected.
 */
import { rewrite } from '@vercel/functions'

export const config = {
  runtime: 'nodejs',
  matcher: ['/editor-guide', '/editor-guide/:path*'],
}

const GUIDE_PATH = '/editor-guide'
const GUIDE_FILE = '/editor-guide/index.html'
const COOKIE = 'ukap_editor_guide'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

async function sha256(text) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || ''
  const match = header.split(/;\s*/).find((c) => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

const headers = (extra = {}) => ({
  'cache-control': 'no-store',
  'x-robots-tag': 'noindex, nofollow',
  ...extra,
})

function loginPage(error = false) {
  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>UKAP Editor Guide</title>
<link rel="icon" type="image/png" href="/brand/favicon-64.png" />
<style>
  @font-face { font-family: Selawik; src: url(/fonts/selawk.woff2) format("woff2"); font-weight: 400; }
  @font-face { font-family: Selawik; src: url(/fonts/selawkb.woff2) format("woff2"); font-weight: 700; }
  @font-face { font-family: Archivo; src: url(/fonts/archivo-wdth.woff2) format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { min-height: 100vh; display: grid; place-items: center; padding: 24px; font-family: Selawik, "Segoe UI", system-ui, sans-serif; color: #0b0b0c; background: #0b0b0c; }
  .card { width: 100%; max-width: 440px; background: #fff; }
  .bar { display: grid; grid-template-columns: 1fr 1fr 1fr; height: 8px; }
  .bar span:nth-child(1) { background: #3f7ec2; } .bar span:nth-child(2) { background: #db4a47; } .bar span:nth-child(3) { background: #e2be74; }
  .inner { padding: 40px 36px 36px; }
  .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
  .brand img { height: 44px; }
  .brand b { display: block; font-size: 1.15rem; letter-spacing: .02em; line-height: 1; }
  .brand small { display: block; font-size: .62rem; letter-spacing: .24em; text-transform: uppercase; color: #545b67; margin-top: 4px; }
  h1 { font-family: Archivo, "Arial Narrow", sans-serif; font-weight: 850; font-stretch: 78%; font-size: 2.2rem; line-height: .95; text-transform: uppercase; margin-bottom: 10px; }
  h1 span { background: #db4a47; color: #fff; padding: 0 .12em; }
  p { color: #4a515c; line-height: 1.5; margin-bottom: 24px; }
  label { display: block; font-weight: 700; font-size: .9rem; margin-bottom: 6px; }
  input { width: 100%; font: inherit; font-size: 1rem; padding: 14px 16px; border: 2px solid #c9ced6; background: #f4f6f8; outline: none; }
  input:focus { border-color: #3f7ec2; background: #fff; }
  button { width: 100%; margin-top: 16px; padding: 15px; border: 0; cursor: pointer; font: inherit; font-weight: 700; font-size: 1rem; background: #e2be74; color: #0b0b0c; }
  button:hover { background: #0b0b0c; color: #fff; }
  .error { background: #fbced1; color: #8e111a; padding: 10px 14px; font-weight: 700; font-size: .92rem; margin-bottom: 16px; }
</style>
</head>
<body>
  <main class="card">
    <div class="bar"><span></span><span></span><span></span></div>
    <div class="inner">
      <div class="brand"><img src="/brand/ukap-mark.png" alt="" /><span><b>UKAP</b><small>Foundation</small></span></div>
      <h1>Editor <span>guide</span></h1>
      <p>For UKAP website editors. Enter the password to continue.</p>
      ${error ? '<div class="error" role="alert">Incorrect password. Please try again.</div>' : ''}
      <form method="POST" action="${GUIDE_PATH}">
        <label for="pw">Password</label>
        <input id="pw" name="password" type="password" autocomplete="current-password" required autofocus />
        <button type="submit">Open the guide</button>
      </form>
    </div>
  </main>
</body>
</html>`
  return new Response(html, { status: 401, headers: headers({ 'content-type': 'text/html; charset=utf-8' }) })
}

export default async function middleware(request) {
  const password = process.env.EDITOR_GUIDE_PASSWORD
  if (!password) return new Response('Not found', { status: 404, headers: headers() })

  const expected = await sha256(`ukap-guide:${password}`)

  // Password form posts back to /editor-guide
  if (request.method === 'POST') {
    const form = await request.formData()
    if (String(form.get('password') || '') !== password) return loginPage(true)
    return new Response(null, {
      status: 303,
      headers: headers({
        location: GUIDE_PATH,
        'set-cookie': `${COOKIE}=${expected}; Path=${GUIDE_PATH}; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
      }),
    })
  }

  if (readCookie(request, COOKIE) !== expected) return loginPage()

  // Signed in: serve the guide (works for /editor-guide, /editor-guide/ and /editor-guide/index.html)
  return rewrite(new URL(GUIDE_FILE, request.url), { headers: headers() })
}
