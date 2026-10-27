---
name: easysociable-slideshow
description: >
  Turn a topic into an editable, ready-to-post carousel (Slideshow Run) in
  EasySociable Studio. Research facts, pick a proven structure (Formula),
  lay pages out from reference designs (the user's, a Formula's,
  or the catalog's, shuffled), render-check every page locally, then create the Run and hand the user a Studio link.
  Never block on a question: a missing Brand shows as a bound sample the user
  fills once in Studio. Final pixels come only from Studio Download.
---

# EasySociable Slideshow Skill

The user gives a topic. You return a Studio link to a carousel that is good
enough to post, where every word is still editable. The output is editable,
so **a wrong guess is cheap and a question is expensive**: decide platform,
page count, arc, style and copy yourself; the user fixes details in Studio.
Approved copy is the exception: when it is supplied, it is final (below).

What only the user has never blocks the Run; it becomes a visible, replaceable
stand-in they fill in Studio:

- their Brand (name, handle, avatar) → bound samples (step 1);
- their own material (screenshots, photos, results) → a finished stand-in now,
  and one "swap in yours" line in the final message (step 5).

## User-supplied / approved copy (copy-lock)

When the user or a Content Engine note supplies page-by-page copy (【逐页】, a
script, "use this text", a `note.md` with locked copy), that text is **final**:

- Place it verbatim, page for page. Never paraphrase, shorten, merge or reorder.
- Skip your own hook/arc/CTA writing, the ≤ 45 words rule and "too long →
  rewrite shorter". Overflow is a layout fix only: smaller type, more lines,
  taller box.
- `Pn 作用：…` lines are meta for you, never slide copy.
- Allowed extra chrome only: page number, Brand name/handle, and labels that
  appear in the note (第一步/第二步/第三步, STEP, 做什么, 为什么, 新手提醒,
  适合谁, 资料去处). Empty unused template slots or remove the element rather
  than inventing a label, title or slogan.
- A line looks wrong against `source.md`? Keep it and list it under "Copy
  concerns" in the final message; never rewrite it.
- Gate: `scripts/check-copy.mjs` in step 6, `--copy-lock` in step 7.

## Command output (`--json`)

Read results from these paths; don't guess:

| Command | Result |
|---|---|
| `auth status` | `authenticated`, `account.email` (no `data` wrapper) |
| `brands list` / `brands get` | `data[]` / `data` (`id`, `name`, `handle`, `colors`, `logoUrl`) |
| `formulas recommend` | `data.cards[]` (`id`, `status`, `recipe`, `swipe`), `data.stop` |
| `formulas get` | `data` (`beats[]`, `looks[].layouts`) |
| `templates references` | a top-level array (`familyId`, `name`, `roles`, `style`, `requiresImage`) |
| `templates source` | top level: `familyId`, `canvas`, `studioJson`; several `--family a,b,c` → an array in that order |
| `icons search --query <word>` | icon list for the word (ids, no SVG) |
| `icons get --id <id> --idempotency-key <any-unique-string>` | `canonicalSvg` to inline |
| `images upload --path …` | `data[]` (`path`, `asset.url`, or `error`); exit 1 if any failed |
| `slideshows create` | top level: `id`, `studioUrl` |

## Workflow

### 0. Login (once per session)

`easysociable auth status --json`.

- `authenticated: false` → stop; ask the user to run `easysociable auth login`
  (one browser approval covers CLI and Studio). Draft nothing while logged out.
- `authenticated: true` → say once: "This Run will be created as
  `<account.email>` — open Studio with the same account."

### 1. Brand (never ask)

`easysociable brands list --json`.

- A Brand exists → use it (the most recently updated if several), silently.
  Its colours and fonts style the Run (`--brand-id` in step 7).
- None, but the prompt gives a name / handle / avatar → create it:
  `easysociable brands create --file brand.json`
  (`{ "name", "handle", "colors", "logoAssetId" }`, colours = the deck style's
  default palette in `references/REFERENCES.md`). An avatar: upload it first
  (`images upload --path <file> --json`) and pass `data[0].asset.id` as
  `logoAssetId`.
- None and nothing given → no Brand, no question. The style's palette goes in
  `theme.json`.

Either way every Run carries the Brand spots (cover signature, CTA handle),
bound with `data-brand`; whatever the Brand lacks shows the sample `Your Name`
/ `@yourhandle` / sample avatar (`references/REFERENCES.md` rule 5). Studio
asks the user for exactly those fields and updates every page when they fill them.

### 2. Facts and evidence

Research the topic from primary sources (official announcement, docs,
reputable press). Keep a source URL for every fact. Drop claims you can only
find in secondary blogs. Never invent numbers, dates, quotes or features.
A first-person result ("I tested", "亲测", "it replied …") is a fact too: write
it only when the user's material or a knowledge page records it. Otherwise
write the step as an instruction ("send it this prompt"), not a report.

**Evidence images** are their own search, whatever the facts came from: real
pictures that can be a page's focal point (a product screenshot, a chart, a figure from the
paper). Aim for 2–4 per Run, the cover first. A page built around a real image
reads as proof and looks different from its neighbours; a text-only deck does
neither.

- Sources: only the topic's own primary sources — the product's site, docs,
  blog, press kit or GitHub README; the paper itself (arXiv HTML has each
  figure as its own file); openly licensed images (Wikimedia Commons, CC0/CC BY).
  Never image search, stock sites, news-site photos, other creators' posts or
  anything watermarked.
- Start from the subject itself: open its official site, docs or help pages,
  launch post and launch video (a knowledge page's source links are a good
  start). Take image URLs from those pages (`og:image`, images in the body)
  and download them: `curl -sL -o assets/<name>.png <url>`. PNG, JPEG or
  WebP only (convert anything else to PNG), ≤ 20 MB.
- Launch posts often show the product only in demo videos: pull frames of the
  real UI straight from the video URL, without downloading the whole file
  (`ffmpeg -ss <seconds> -i <video url> -frames:v 1 frame.png`; a contact sheet
  to find the moment: `ffmpeg -i <video url> -vf "fps=1/3,scale=240:-1,tile=6x2"
  -frames:v 1 sheet.jpg`), then crop to the phone or window. A frame where the key moment is
  on screen (an approval prompt, a result) beats a generic screen.
- **Look at every file** before keeping it. Drop it when it is off-topic,
  unreadable at phone size, would need more than 1.25× upscaling to fill its
  area, carries a watermark, or shows a recognisable person who is not the
  subject.
- Keep each kept image's source URL for the final message.
- Done when the official site, docs and launch post/video were checked.
  Nothing usable → fine, step 5 still gives every page a finished image.

When the user started from a Content Engine run, facts come from its knowledge
pages (see `easysociable-content`) and copy from the approved note's 【逐页】,
verbatim (copy-lock, above); evidence images are still searched as above.

### 3. Structure and hook

Formulas are hosted cards distilled from real viral posts, with evidence
pooled across niches (a structure works by its mechanism, not its niche).
Use a card when it fits; otherwise write your own. Never force one.

- Decide the content's **shape** from your facts: N tips → `tip-list`, a
  procedure → `steps`, a transformation → `before-after`, errors →
  `mistake-list`, a single piece of news or a claim → no list recipe.
- **Always** look for a structure first:
  `easysociable formulas recommend [--recipe <recipe>] --platform <p> --fact-count <n> --json`
  (`--recipe` when the shape is a list recipe; without it you see every
  structure and judge fit yourself). Near-equal cards come back shuffled.
  When the user asked for something different from last time, add
  `--exclude <formulaId>` for the Formula that Run used.
- Use a card only if `stop` is false **and** it fits this content (a news
  explainer is not an "N things" list). Prefer `published`; a `hypothesis`
  card is thin evidence: use it only when it clearly fits.
- Formula: its `swipe` is the page order and each `beat.fill` guides the copy.
  Page 1 is its `hook` beat: write the opening line from that beat's `fill`.
- No fitting card → write the hook and arc yourself (`references/ARC.md`):
  draft 3 hooks of different types, keep the most specific one the carousel
  fully pays off.
- Platform: what the user said, else the one their Brand/history uses, else
  Instagram 4:5. Page count follows the argument (usually 6–9), within
  `references/PLATFORM_CAPS.md`.
- One idea per page, ≤ 45 words per page. Page 1 is the hook. Last page asks
  for one action (comment, save or follow). Approved copy → skip this step's
  copy writing; the note's pages are the arc (copy-lock).

### 4. Look and pages

Structure (step 3) and look are chosen separately. The look comes from a
**reference**; the first rule that applies wins:

1. The user names a Run or says "same as last time / like this one" →
   "Reuse a Run" below.
2. The user shares a post (screenshot or link) → study its grid, type scale,
   background, density and decoration; take the closest catalog references as
   structure and restyle them to match the post. Never copy its words or images.
3. A Formula with a Look → the Look's designs (Formula handoff below).
4. The user asks for a different look ("换个样子", "something else") → first
   write 3–5 art directions that differ from each other and from this Brand's
   previous Run (one line each: grid, type treatment, background, density,
   decoration). Drop any the previous Run used, take the least conventional
   one, and pick references whose `style` fits it.
5. Otherwise → the content decides: get candidates for the cover with
   `easysociable templates references --role hook,cover --json`
   (results are shuffled) and take the first that fits the content. Its
   `style` is the deck's style; for each other page ask for that page's roles
   with `--style <style>`. A number → `metric,proof`; a list item →
   `point,value,steps`; a comparison → `compare`; a page with an evidence
   image (step 2) or a real product → `screenshot`. No match in that style →
   any style, keeping the cover's chrome.

Don't filter out references that need an image just because you have none:
most covers in the library have an image area. Use one and fill that area
without a photo (references/REFERENCES.md, "A reference's image area"). Decide
each page's image (step 5) while you pick its reference: a diagram needs the
image area, a large evidence image needs a large one.
`--no-image` is for when you specifically want designs drawn with type alone.
Pick every page's design first, then read them all in one call:
`easysociable templates source --family <familyId>,<familyId>,… --json`
(one per page, same order). Adapt each as in `references/REFERENCES.md` ("Adapting a reference" and
"Avoid"). Put the result in the pack as a generated page:

```json
{ "role": "hook", "slots": { "text_0": "…", "text_1": "…" },
  "layout": { "studioJson": "<div id=\"Graphic\" data-type=\"post\" …>…</div>",
              "canvas": { "width": 1080, "height": 1350 } } }
```

`slots` maps each `data-variable` to its plain text. Generated pages carry no
`layoutFamilyId` / `pageTemplateId`.

In the final message, add one line: "Want future carousels to look like this?
Say 'same as this'. Want another look? Say 'different look'."

### 5. Images

- Real products, apps, people, data → real screenshots or photos only. Never
  an AI-generated picture of a real product UI.
- Concept / mood / background → generate one if this environment has an
  image-generation tool; otherwise a diagram (3 below).
- Generated images never contain text: all words stay in editable text layers.
  (A real screenshot or figure keeps its own text.)
- Every image area ships finished: never a grey placeholder, never "add
  later". Fill it with the first of these you can do:
  1. The user's own image, when they gave one.
  2. An evidence image from step 2. Upload it
     (all at once: `easysociable images upload --path assets/a.png assets/b.jpg --json`)
     and use each returned `data[i].asset.url` as `src`.
     Crop and scale it (`objectFit: 'cover'`, `objectPosition`), never alter
     what it shows. To point at something in it, add a separate element on top
     (a red ellipse border, an underline bar) so the user can move or delete it.
     A screen you can capture yourself right now (a browser tool, no login,
     no region block) counts too; never type a password or stop to ask.
  3. A diagram drawn from the page's own words (references/REFERENCES.md,
     "A reference's image area"): a prompt card for a tutorial step, A vs B
     cards, ✗ / ✓, a 3–4 step flow, a big number. Always possible.
- Never: a drawn imitation of a real product's UI, an invented AI reply or
  screenshot, an invented number without "示例 / example" on it, an image from
  someone else's post.
- What only the user can add (their screenshot after logging in, their
  dashboard, their results) is an upgrade, not a gap: list it at the end of
  the final message, page by page, with how to get it and what the copy may
  then say ("p2–4: log in to Doubao, send the prompt, screenshot the
  correction; then the caption can say '亲测'").

### 6. Check (hard gate)

```bash
easysociable brands get --id <brandId> --json > brand.json
node <skill>/scripts/check-pages.mjs pack.json --out ./check --brand brand.json
# no Brand: --theme theme.json instead of --brand brand.json
```

- Exit 1 → fix every ERROR (overflow, off-canvas, text overlap, contrast) and
  re-run. Do not create the Run with errors.
- Warnings (small text, too many words, empty band) → fix unless deliberate.
- Open `check/grid.png` and review it as a designer: one clear focal point per
  page, nothing cramped, no two adjacent pages alike, reads in 2 seconds.
  At most two fix rounds.
- Exit 2 (no Chrome) → continue, and tell the user the visual check was skipped.

Approved copy (copy-lock) → also run the fidelity gate:

```bash
node <skill>/scripts/check-copy.mjs pack.json --note note.md [--brand-name <name> --handle <@h>]
```

- Exit 1 → put the note's text back verbatim / remove invented copy, re-run.
  Do not create the Run with errors. `--allow-extra '<regex>'` only for
  layout chrome you can name in the final message.
- Paste the script's output (the `P1 OK … check-copy: PASS` lines) in the
  final message as the fidelity check; never summarise changes from memory.

Post has primary media (`source-video.*`, `assets/*.png|jpg|webp`, screenshots
or clips at the post root, local media named in `source.md`) → also run the
evidence gate:

```bash
node <skill>/scripts/check-evidence.mjs pack.json --post-dir posts/<slug> [--source-media a.mp4,b.png]
```

- Exit 1 → the pack shows zero uploaded evidence: only the Brand avatar and
  icons. Extract frames / screenshots, `images upload`, place them as
  `<img data-type="image" src="https://…">` (step 5), re-run. Icons never
  stand in for the media. Do not create the Run with errors.
- `--allow-icon-only` passes with a WARN; use it only when the user said so
  and name it in the final message.
- Accounts / Content Engine dispatch can require this gate for every post
  (`--require-evidence` at create).

### 7. Create and hand off

```bash
easysociable slideshows create --file pack.json --brand-id <brandId> --json
# no Brand: --theme theme.json instead of --brand-id
# approved copy: add --copy-lock note.md (refuses to create if check-copy fails)
# post with media: add --require-evidence posts/<slug> (refuses to create if check-evidence fails)
```

Reply once with: the `studioUrl`, the arc in one line, any Brand sample
left ("The name, handle and avatar on pages 1 and 6 are samples: fill them
once in the bar at the top of Studio, or in Brands at
https://my.easysociable.com/brands, and every page updates"; name only the
fields that are samples), the sources (facts and
each evidence image: "p1 image: <url>"), and the optional upgrades (step 5). Tell them to edit in
Studio and click **Download** for the PNG ZIP.

### 8. Revise (same Run, never a copy)

Feedback on an existing Run ("page 3 looks off", "shorter hook") edits that Run.

1. `easysociable slideshows get --id <runId> --json > revisions/<runId>-r<revision>.json`
   — the saved Run is the source of truth (it holds the user's Studio edits);
   never rebuild from your local pack.json. The file is also the backup.
2. Change only the pages the user named. Start from each page's saved `layout`
   and `slots`, adapt as in step 4, and run step 6 on the changed pages.
3. Write `patch.json` and apply it:
   ```json
   { "baseRevision": <run.revision>,
     "pages": [{ "pageIndex": 2, "layout": { "studioJson": "…", "canvas": { "width": 1080, "height": 1350 } }, "slots": { … } }] }
   ```
   ```bash
   easysociable slideshows update --id <runId> --file patch.json --json
   ```
   `slots` replaces the page's slots, so send the full set for that page.
   Unlisted pages stay untouched.
4. `RUN_REVISION_CONFLICT` → the user saved in Studio meanwhile: `get` again,
   re-apply your change on top, retry once.
5. "Go back to the previous version" → take those pages' `layout` / `slots`
   from the newest `revisions/<runId>-r*.json` before the change and send them
   as a normal patch with the current `baseRevision`. The original generated
   pages are in the Run's `packSnapshot`.

Same `studioUrl`; tell the user to reload Studio. A new Run only for a
different topic, or when the user asks for an alternative version to compare.

## Formula handoff (prompt names `Formula: F-…`)

`easysociable formulas get --id <id> --json`. Its `beats` are the pages (same
order and roles); `title_template` with `{X}` = the topic is the arc. Write copy
from each `beat.fill` and your facts; never copy the formula's example posts.
With `Look: L-…` (else the formula's first `looks` entry) the page source is
`look.slides["<n>"]` or `look.layouts[beat.role]` (a design's `familyId`):
read it with `templates source --family` and adapt it as in step 4. The Look
wins over rule 5 of step 4 but not over a Run or post the user named.
Then continue at step 5.

## Reuse a Run (prompt names a `run_…` for a new topic)

A new topic → a **new** Run; the source Run is never changed. Never ask which
mode; decide from the words and the content:

- **Template** — "using run_x as the template", "same as last time", "like
  this one" (last time = the newest Run of this Brand, `slideshows list`).
  Keep every page's look: only slot content changes.
- **Style** — "in the style / feel / vibe of run_x", or Template was asked but
  the new content does not fit its page roles (a "N tips" Run for an "A vs B"
  topic). Take its colours, type treatment, chrome and spacing; lay pages out
  fresh in step 4.

Template steps:

1. `easysociable slideshows get --id <runId> --json`. Its pages' `role`,
   `layout` and `slots` are the source (they include the user's Studio edits).
2. Write facts and the arc for the new topic (steps 2–3, no Formula search).
3. Pages by role: one-off roles (hook, cta) copy that page's `layout`
   verbatim; repeated roles (point, step) reuse the source page of that role
   **as many times as the new content needs** (4 tips → 4 pages, 6 → 6). Drop
   roles the new content has none of.
4. Change only text inside `data-variable` elements and send matching
   `slots`. Too long → rewrite shorter (only copy you wrote; approved copy →
   smaller type or taller box instead); otherwise never resize or move elements.
   Every source image is replaced for the new topic (step 5 order);
   Brand avatar/logo stay.
5. Step 6 check, then create (step 7). In the reply, say in one line what
   differs from the source ("6 tips, so 6 point pages instead of 4") and that
   the user can say "back to 4 pages" or "different layout".

## Rules

1. All hosted calls go through the `easysociable` CLI or the unified MCP
   server (Gateway). Never call Directus, R2, Stripe or private services.
2. Final pixels leave only via Studio **Download**. Do not call
   `slideshows render`, `slideshows export`, `renders create`, or MCP
   `render_slideshow_run` / `create_render_job` (`HEADLESS_RENDER_DISABLED`).
3. Revisions edit the same Run page by page (step 8): layout, text and images
   can all change. Page count and order are fixed for now (no add, delete,
   reorder) — if the user needs that, say so; create a new Run only when they agree.
4. Every plan: up to 20 pages. Free: 3 Downloads per month and 1 Brand; Creator: unlimited, 3 Brands; Studio: unlimited, 25 Brands. `BRAND_LIMIT_REACHED` → tell the user their plan's limit and the suggested action; never create a Run without the Brand silently.
5. Identity: create with the user's own login, not `workspace_local` /
   `test-key` (unless they asked for `--allow-local-fixture`). Studio says
   "belongs to another account" → recreate with the current login.
6. Content Engine runs keep their knowledge gate:
   `easysociable engine validate --run <run-dir> --require-knowledge`.
   Topic-only requests (no Content Engine) use researched, sourced facts.

## Failure handling

- `CONTENT_PACK_INVALID` → fix the pack field it names; do not drop pages silently.
- `BRAND_NOT_FOUND` → the Brand belongs to another account; list Brands again.
- `USAGE_LIMIT_REACHED` / past due → tell the user to upgrade or update billing.
- `RUN_REVISION_CONFLICT` → `slideshows get`, re-apply on the latest revision, retry once.
- `RUN_TOPOLOGY_LOCKED` → you sent a full `pack` or a `pageTemplateId`; send
  page `layout` / `slots` instead (step 8).

## Handoff boundary

The Content Engine owns knowledge pages and Formula research. Reference
designs are authored internally (Template skill); this skill only reads them. This skill turns a topic into a Run
and opens Studio.
