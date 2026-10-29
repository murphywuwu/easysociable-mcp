#!/usr/bin/env node
// Approved-copy (copy-lock) gate: every line of the note's 【逐页】 must sit verbatim on its slide,
// and no slide may carry copy the note doesn't have. Exit 0 = pass, 1 = errors (fix before create), 2 = usage.
//
//   node check-copy.mjs pack.json --note note.md [--section 逐页] [--brand-name 不急同学] [--handle @buji_ai] [--allow-extra <regex>]
//
// Comparison ignores whitespace, punctuation/symbols, full/half width and Latin case, so layout
// line breaks and ，/, swaps pass while paraphrase, deletion and invented labels fail.
import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const flag = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined }
const valued = ['--note', '--section', '--brand-name', '--handle', '--allow-extra'].map(flag)
const packPath = args.find(a => !a.startsWith('--') && !valued.includes(a))
const notePath = flag('--note')
if (!packPath || !notePath) { console.error('usage: node check-copy.mjs pack.json --note note.md [--section 逐页] [--brand-name <name>] [--handle <@handle>] [--allow-extra <regex>]'); process.exit(2) }

const norm = s => String(s).normalize('NFKC').replace(/<[^>]*>/g, '').toLowerCase().replace(/[\p{P}\p{S}\s]/gu, '')
const clip = s => { const t = String(s).replace(/\s+/g, ' ').trim(); return t.length > 60 ? `${t.slice(0, 60)}…` : t }

// note.md 【section】 → [{ lines: [...], segments: [...] }] indexed by P number - 1.
function parseNote(text, section) {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex(l => l.trim().startsWith(`【${section}】`))
  if (start < 0) return null
  const pages = []
  let cur = null
  for (const raw of [lines[start].trim().slice(section.length + 2), ...lines.slice(start + 1)]) {
    let line = raw.trim()
    if (line.startsWith('【')) break
    // C-15: strip markdown bullet / bold markers before the 'Pn' heading test.
    line = line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '')
    const head = line.match(/^P(\d+)\b\s*/i)
    if (head) {
      cur = pages[Number(head[1]) - 1] = { lines: [], segments: [] }
      const rest = line.slice(head[0].length)
      // C-15: remaining text is editor page title (skip) unless it starts with a known copy label
      // (legacy "P3 小字：xxx" must still count as copy — do not blind-continue).
      if (rest && !/^(大字|小字|做什么|为什么|新手提醒|适合谁|资料去处)\s*[:：]/.test(rest)) continue
      line = rest
    }
    // C-15: bare editor label line ('文案：' / '文字：' / '内容：') is not copy.
    if (/^(文案|文字|内容)\s*[:：]\s*$/.test(line)) continue
    if (!cur || !line || /作用\s*[:：]/.test(line)) continue
    line = line.replace(/^(大字|小字|做什么|为什么|新手提醒|适合谁|资料去处)\s*[:：]\s*/, '')
    cur.lines.push(line)
    // Split cover 'A / B' and sentences; do NOT split bare / inside URLs (git+https://…).
    for (const seg of line.split(/\s*[／]\s*|\s+\/\s+|[。！？!?；;]/)) if (norm(seg)) cur.segments.push(seg.trim())
  }
  return pages
}

const brandAllow = new Set(['不急同学', '@buji_ai', flag('--brand-name'), flag('--handle')].filter(Boolean).map(norm))
const extra = flag('--allow-extra') ? new RegExp(`^(?:${flag('--allow-extra')})$`, 'u') : null
const chrome = s => /^\s*P?\d{1,3}\s*(?:[\/／]\s*\d{1,3})?\s*$/i.test(s)
  || brandAllow.has(norm(s))
  || /^(?:step\d*|第[一二三四五六七八九十\d]+步|做什么|为什么|新手提醒|适合谁|资料去处)$/.test(norm(s))
  || Boolean(extra && (extra.test(s.trim()) || extra.test(norm(s))))

const pack = JSON.parse(readFileSync(packPath, 'utf8'))
const notePages = parseNote(readFileSync(notePath, 'utf8'), flag('--section') ?? '逐页')
if (!notePages?.length) { console.error(`check-copy: no 【${flag('--section') ?? '逐页'}】 P1..Pn pages in ${notePath}`); process.exit(2) }

let errors = 0
const total = Math.max(notePages.length, pack.pages?.length ?? 0)
for (let i = 0; i < total; i++) {
  const note = notePages[i] ?? { lines: [], segments: [] }
  const slots = Object.entries(pack.pages?.[i]?.slots ?? {}).filter(([, v]) => typeof v === 'string' && !/^(https?:|data:)/.test(v.trim()))
  const slide = norm(slots.map(([, v]) => v).join(''))
  const noteText = norm(note.lines.join(''))
  const problems = []
  if (!pack.pages?.[i]) problems.push('slide missing from pack')
  else if (!notePages[i]) problems.push('no note page for this slide')
  for (const seg of note.segments) if (!slide.includes(norm(seg))) problems.push(`note copy not on slide (paraphrased/dropped): "${clip(seg)}"`)
  for (const [key, v] of slots) if (norm(v).length > 4 && !noteText.includes(norm(v)) && !chrome(v)) problems.push(`slot ${key} not in note (invented copy): "${clip(v)}"`)
  errors += problems.length
  console.log(problems.length ? problems.map(p => `P${i + 1} ERROR ${p}`).join('\n') : `P${i + 1} OK`)
}
console.log(errors ? `check-copy: FAIL — ${errors} error(s); place the note's copy verbatim, then re-run` : `check-copy: PASS — ${total} page(s) match the approved copy`)
process.exit(errors ? 1 : 0)
