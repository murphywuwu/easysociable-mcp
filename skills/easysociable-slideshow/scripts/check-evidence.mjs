#!/usr/bin/env node
// Evidence gate: when the post has primary media (source video, assets/ frames, screenshots), the pack must
// show at least one uploaded evidence image — icons and the Brand avatar don't count.
// Exit 0 = pass (or no primary media), 1 = media exists but zero evidence images, 2 = usage.
//
//   node check-evidence.mjs pack.json --post-dir posts/<slug> [--source-media a.mp4,b.png] [--allow-icon-only]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const flag = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined }
const valued = ['--post-dir', '--source-media'].map(flag)
const packPath = args.find(a => !a.startsWith('--') && !valued.includes(a))
const postDir = flag('--post-dir')
if (!packPath || !postDir || !existsSync(postDir)) { console.error('usage: node check-evidence.mjs pack.json --post-dir <posts/slug> [--source-media a.mp4,b.png] [--allow-icon-only]'); process.exit(2) }

const MEDIA = /\.(mp4|webm|mov|m4v|png|jpe?g|webp|gif)$/i
const IMAGE = /\.(png|jpe?g|webp)$/i
// Brand-only files at post root (avatar / logo / brand kit) are not primary media.
const BRAND = /^(avatar|logo|brand|og)\b/i
const isFile = p => { try { return statSync(p).isFile() } catch { return false } }
const ls = d => { try { return readdirSync(d) } catch { return [] } }
const at = p => resolve(postDir, p)

const media = new Set()
for (const f of ls(postDir)) if (isFile(at(f)) && (/^source-video\./i.test(f) || (MEDIA.test(f) && !BRAND.test(f)))) media.add(f)
for (const f of ls(at('assets'))) if (IMAGE.test(f) && isFile(at(join('assets', f)))) media.add(join('assets', f))
// source.md may list local media paths (`frames/x.png`, ./clip.mp4); count those that exist on disk.
if (isFile(at('source.md')))
  for (const m of readFileSync(at('source.md'), 'utf8').matchAll(/(?:^|[\s`'"(<\[])((?!https?:)[^\s`'"()<>\[\]]+\.(?:mp4|webm|mov|m4v|png|jpe?g|webp|gif))(?=$|[\s`'")>\]])/gim))
    if (isFile(at(m[1]))) media.add(m[1])
for (const p of (flag('--source-media') ?? '').split(',').map(s => s.trim()).filter(Boolean))
  if (isFile(at(p))) media.add(p)
// Local previews (images/p01.png …) are rendered output, never evidence sources.
for (const m of media) if (/^images[\\/]p\d+\.png$/i.test(m)) media.delete(m)

// Every <img data-type="image"> anywhere in the pack (layout.studioJson and any other string field).
const pack = JSON.parse(readFileSync(packPath, 'utf8'))
const strings = []
const walk = v => typeof v === 'string' ? strings.push(v) : v && typeof v === 'object' && Object.values(v).forEach(walk)
walk(pack.pages ?? pack)
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{\\s*["'\`]([^"'\`]*)["'\`]\\s*\\})`, 'i'))?.slice(1).find(x => x !== undefined)
const evidence = new Set()
for (const s of strings)
  for (const [tag] of s.matchAll(/<img\b[^>]*>/gi)) {
    const src = attr(tag, 'src') ?? ''
    if (attr(tag, 'data-type') === 'image' && attr(tag, 'data-brand') === undefined && /^https?:\/\//i.test(src.trim())) evidence.add(src.trim())
  }

const list = [...media].slice(0, 5).join(', ') + (media.size > 5 ? ', …' : '')
if (!media.size) console.log('check-evidence: PASS — no primary media in post dir; icon-only is OK')
else if (evidence.size) console.log(`check-evidence: PASS — ${evidence.size} evidence image(s) for ${media.size} media file(s)`)
else if (args.includes('--allow-icon-only')) console.log(`check-evidence: WARN — --allow-icon-only: ${media.size} media file(s) (${list}) but 0 evidence images; PASS`)
else {
  console.log(`check-evidence: FAIL — post has ${media.size} media file(s) (${list}) but the pack has 0 non-avatar <img data-type="image"> uploaded URLs; extract frames/screenshots, images upload, place them, then re-run`)
  process.exit(1)
}
