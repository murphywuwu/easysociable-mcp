#!/usr/bin/env node
// Render every page of a content-pack.v1 with the system Chrome (no npm deps) and check it
// the way a phone viewer sees it. Exit 0 = pass, 1 = errors (fix before create), 2 = no Chrome.
//
//   node check-pages.mjs pack.json --out ./shots [--brand brand.json | --theme theme.json]
//
// --brand takes `easysociable brands get --id <id> --json` output; without it the Studio
// default (dark) theme is used, same as a Run without a Brand.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const flag = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined }
const packPath = args.find(a => !a.startsWith('--') && a !== flag('--out') && a !== flag('--brand') && a !== flag('--theme'))
if (!packPath) { console.error('usage: node check-pages.mjs pack.json --out <dir> [--brand brand.json]'); process.exit(1) }
const outDir = resolve(flag('--out') ?? 'shots')
mkdirSync(outDir, { recursive: true })

const pack = JSON.parse(readFileSync(packPath, 'utf8'))
const themeFile = flag('--brand') ?? flag('--theme')
const brandRaw = themeFile ? JSON.parse(readFileSync(themeFile, 'utf8')) : null
const brand = brandRaw?.data ?? brandRaw
const c = brand?.colors ?? brand?.color ?? {}
// Studio default theme (apps/easysociable/app/lib/themeTokens.ts DEFAULT_AUTHORING_THEME_TOKENS).
const colors = { canvas: c.canvas ?? '#0f1419', text: c.text ?? '#e8eef5', muted: c.textMuted ?? c.muted ?? '#8b9bb0', accent: c.accent ?? '#5b8cff', primary: c.primary ?? c.accent ?? '#5b8cff' }

const chrome = [process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find(p => p && existsSync(p))
if (!chrome) { console.error('No Chrome/Chromium found (set CHROME_PATH). Render checks skipped.'); process.exit(2) }

// ponytail: mirrors Studio's forced semantic colors by data-type; update if themeTokens.ts changes.
const themeCss = `[data-authoring-theme]{--es-color-canvas:${colors.canvas};--es-color-text:${colors.text};--es-color-muted:${colors.muted};--es-color-accent:${colors.accent};--es-color-primary:${colors.primary}}
[data-authoring-theme] [data-type="post"]{background-color:var(--es-color-canvas);color:var(--es-color-text)}
[data-authoring-theme] [data-type="title"],[data-authoring-theme] [data-type="subtitle"]{color:var(--es-color-text)!important}
[data-authoring-theme] [data-type="kicker"]{color:var(--es-color-accent)!important}
[data-authoring-theme] [data-type="metric"]{color:var(--es-color-primary)!important}
[data-authoring-theme] [data-type="caption"]{color:var(--es-color-muted)!important}
html,body{margin:0;background:#fff}#report{display:none}`

// Runs inside the Chrome page: JSX source → DOM, then measure. Source is evaluated in the page sandbox, not in Node.
const pageScript = String.raw`
const UNITLESS = new Set(['fontWeight','lineHeight','opacity','zIndex','flex','flexGrow','flexShrink'])
const toCss = o => Object.entries(o).map(([k,v]) => k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()) + ':' + (typeof v === 'number' && !UNITLESS.has(k) ? v + 'px' : v)).join(';')
const toHtml = jsx => jsx
  .replace(/style=\{\{([\s\S]*?)\}\}/g, (_, body) => 'style="' + toCss(Function('return {' + body + '}')()).replace(/"/g, "'") + '"')
  .replace(/style="([^"]*)"/g, (_, body) => 'style="' + body.replace(/(^|;)\s*([a-z]+[A-Z][A-Za-z]*)\s*:/g, (m, sep, k) => sep + k.replace(/[A-Z]/g, c => '-' + c.toLowerCase()) + ':') + '"')
  .replace(/className=/g, 'class=').replace(/\{' '\}/g, ' ')
  .replace(/<(div|p|h1|h2|h3|span|img)(\s[^>]*?)\s*\/>/g, (_, t, a) => t === 'img' ? '<img' + a + '>' : '<' + t + a + '></' + t + '>')
const stage = document.getElementById('stage'), GRID = location.hash === '#grid', S = 0.5
for (const [i, src] of SOURCES.entries()) {
  const box = document.createElement('div')
  box.setAttribute('data-authoring-theme', '')
  box.innerHTML = toHtml(src.json)
  if (GRID) { box.style.cssText = 'width:' + src.width * S + 'px;height:' + src.height * S + 'px;overflow:hidden'; box.firstElementChild.style.transform = 'scale(' + S + ')'; box.firstElementChild.style.transformOrigin = '0 0' }
  stage.appendChild(box)
}
if (GRID) stage.style.cssText = 'display:grid;grid-template-columns:repeat(' + COLS + ',max-content);gap:16px;padding:16px;background:#888'
const lum = rgb => { const [r,g,b] = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126*r + 0.7152*g + 0.0722*b }
const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { rgb: p.slice(0,3), a: p[3] ?? 1 } }
const ratio = (a, b) => { const [x,y] = [lum(a), lum(b)].sort((m,n) => n - m); return (x + 0.05) / (y + 0.05) }
function measure(root) {
  const R = root.getBoundingClientRect(), W = R.width, H = R.height, k = W / 1080
  const errors = [], warnings = []
  const texts = [...root.querySelectorAll('[data-variable^="text"], p, h1, h2, h3')].filter((e, i, all) => e.textContent.trim() && !all.some(o => o !== e && o.contains(e)))
  const label = e => (e.dataset.variable ? e.dataset.variable + ' ' : '') + JSON.stringify(e.textContent.trim().slice(0, 40))
  let words = 0
  for (const e of texts) {
    const cs = getComputedStyle(e), r = e.getBoundingClientRect(), size = parseFloat(cs.fontSize), n = e.textContent.trim().split(/\s+/).length
    if (e.dataset.type !== 'decoration' && e.dataset.type !== 'label') words += n
    if (e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2) errors.push('overflow: ' + label(e) + ' needs ' + e.scrollWidth + 'x' + e.scrollHeight + ', box ' + e.clientWidth + 'x' + e.clientHeight)
    if (r.left < R.left - 2 || r.top < R.top - 2 || r.right > R.right + 2 || r.bottom > R.bottom + 2) errors.push('off-canvas: ' + label(e))
    if (n >= 6 && size < 28 * k) warnings.push('small text (' + size + 'px, min ' + Math.round(28 * k) + '): ' + label(e))
    // Contrast: the element and each coloured span against the first opaque background under its centre.
    const stack = document.elementsFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, size))
    let bg = null
    for (const el of stack) { if (el.tagName === 'IMG') break; const p = parse(getComputedStyle(el).backgroundColor); if (p && p.a > 0.5) { bg = p.rgb; break } }
    if (bg) for (const part of [e, ...e.querySelectorAll('span')]) {
      if (part !== e && !part.textContent.trim()) continue
      const pc = getComputedStyle(part), fg = parse(pc.color), fs = parseFloat(pc.fontSize), large = fs >= 36 * k || (fs >= 28 * k && Number(pc.fontWeight) >= 700)
      const cr = fg && ratio(fg.rgb, bg)
      if (cr && cr < 3) errors.push('contrast ' + cr.toFixed(2) + ':1 (min ' + (large ? 3 : 4.5) + '): ' + label(part))
      else if (cr && !large && cr < 4.5) warnings.push('contrast ' + cr.toFixed(2) + ':1 on small text (min 4.5): ' + label(part))
    }
  }
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const a = texts[i].getBoundingClientRect(), b = texts[j].getBoundingClientRect()
    const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left), iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
    if (ix > 4 && iy > 4) errors.push('text overlap: ' + label(texts[i]) + ' / ' + label(texts[j]))
  }
  if (words > 60) warnings.push(words + ' words on one page (aim <= 45): split it')
  // Largest empty horizontal band, ignoring full-bleed backgrounds.
  const spans = [...root.querySelectorAll('*')].map(e => e.getBoundingClientRect()).filter(r => r.width * r.height > 0 && r.width * r.height < 0.8 * W * H).map(r => [r.top - R.top, r.bottom - R.top]).sort((a, b) => a[0] - b[0])
  let cursor = 0, gap = 0
  for (const [t, b] of spans) { gap = Math.max(gap, t - cursor); cursor = Math.max(cursor, b) }
  gap = Math.max(gap, H - cursor)
  if (gap > 0.25 * H) warnings.push('empty band ' + Math.round(gap) + 'px (' + Math.round(100 * gap / H) + '% of height): rebalance the layout')
  return { errors, warnings }
}
if (!GRID) document.fonts.ready.then(() => {
  document.getElementById('report').textContent = JSON.stringify([...stage.children].map(box => { try { return measure(box.firstElementChild) } catch (e) { return { errors: ['render failed: ' + e.message], warnings: [] } } }))
})
`

const pages = pack.pages.map((page, i) => ({ n: i + 1, role: page.role, json: page.layout?.studioJson, ...(page.layout?.canvas ?? { width: 1080, height: 1350 }) })).filter(p => p.json)
for (const page of pack.pages) if (!page.layout?.studioJson) console.log(`page ${pack.pages.indexOf(page) + 1}: no layout.studioJson (catalog page) — skipped`)
const COLS = 4
const html = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=block">
<style>${themeCss}</style><div id="stage"></div><pre id="report"></pre>
<script>const SOURCES = ${JSON.stringify(pages).replace(/</g, '\\u003c')}, COLS = ${COLS};${pageScript}</script>`
const file = join(outDir, 'pages.html')
writeFileSync(file, html)
const W = Math.max(...pages.map(p => p.width)), Hs = pages.map(p => p.height)
const base = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=5000']
// Measure at full size (all pages stacked, so every page is inside the viewport).
const dom = execFileSync(chrome, [...base, `--window-size=${W},${Hs.reduce((a, b) => a + b, 0)}`, '--dump-dom', pathToFileURL(file).href], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 })
// One contact sheet at 50% for the visual review.
const rows = Math.ceil(pages.length / COLS)
execFileSync(chrome, [...base, `--window-size=${Math.min(COLS, pages.length) * (W / 2 + 16) + 16},${rows * (Math.max(...Hs) / 2 + 16) + 16}`, `--screenshot=${join(outDir, 'grid.png')}`, pathToFileURL(file).href + '#grid'], { stdio: 'ignore' })
const raw = dom.match(/<pre id="report">([\s\S]*?)<\/pre>/)?.[1]?.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
const reports = raw ? JSON.parse(raw) : pages.map(() => ({ errors: ['no report (page script did not finish)'], warnings: [] }))
let failed = false
for (const [i, page] of pages.entries()) {
  const report = reports[i]
  if (report.errors.length) failed = true
  console.log(`page ${page.n} (${page.role}): ${report.errors.length ? 'FAIL' : 'ok'}`)
  for (const e of report.errors) console.log(`  ERROR ${e}`)
  for (const w of report.warnings) console.log(`  warn  ${w}`)
}
console.log(`contact sheet: ${join(outDir, 'grid.png')} — look at it before creating the Run.`)
process.exit(failed ? 1 : 0)
