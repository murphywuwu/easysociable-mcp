---
name: easysociable-slideshow
description: >
  Turn a topic into an editable, ready-to-post carousel (Slideshow Run) in
  EasySociable Studio. Research facts, pick a proven hook and structure
  (Formula), lay pages out from reference designs (the user's, a Formula's,
  or the catalog's, shuffled), render-check every page locally, then create the Run and hand the user a Studio link.
  Ask the user only for what only they know (their Brand, once; their own
  images/screenshots). Final pixels come only from Studio Download.
---

# EasySociable Slideshow Skill

The user gives a topic. You return a Studio link to a carousel that is good
enough to post, where every word is still editable. The output is editable,
so **a wrong guess is cheap and a question is expensive**: decide platform,
page count, arc, style and copy yourself; the user fixes details in Studio.

Ask only for what only the user knows:

- their Brand (IP name, handle, avatar) — once, ever;
- their own material (screenshots, photos) when a page needs it.

## Workflow

### 0. Login (once per session)

`easysociable auth status --json`.

- `authenticated: false` → stop; ask the user to run `easysociable auth login`
  (one browser approval covers CLI and Studio). Draft nothing while logged out.
- `authenticated: true` → say once: "This Run will be created as
  `<account.email>` — open Studio with the same account."

### 1. Brand (ask once, ever)

`easysociable brands list --json`.

- A Brand exists → use it (the most recently updated if several), silently.
- None → ask in **one** message, everything skippable:
  "What name and @handle should appear on your carousels? (Optional: an
  avatar/logo image path.) Reply 'skip' to post without a signature."
  Create it with `easysociable brands create --file brand.json`
  (`{ "name", "handle", "colors", "logoAssetId" }`) using the default palette
  that matches the deck's style (`references/REFERENCES.md`). An avatar: upload
  it first (step 5's `images upload`) and pass the returned `asset.id` as
  `logoAssetId`; `brands get` then returns its `logoUrl`.
  Skipped → no Brand: header shows the topic, the CTA has no handle, and that
  palette goes in `theme.json` (without a Brand or theme Studio falls back to
  its dark default).

### 2. Facts and evidence

Research the topic from primary sources (official announcement, docs,
reputable press). Keep a source URL for every fact. Drop claims you can only
find in secondary blogs. Never invent numbers, dates, quotes or features.

While you read those sources, collect **evidence images**: real pictures that
can be a page's focal point (a product screenshot, a chart, a figure from the
paper). Aim for 2–4 per Run, the cover first. A page built around a real image
reads as proof and looks different from its neighbours; a text-only deck does
neither.

- Sources: only the topic's own primary sources — the product's site, docs,
  blog, press kit or GitHub README; the paper itself (arXiv HTML has each
  figure as its own file); openly licensed images (Wikimedia Commons, CC0/CC BY).
  Never image search, stock sites, news-site photos, other creators' posts or
  anything watermarked.
- Take image URLs from pages you already opened (`og:image`, images in the
  body) and download them: `curl -sL -o assets/<name>.png <url>`. PNG, JPEG or
  WebP only (convert anything else to PNG), ≤ 20 MB.
- **Look at every file** before keeping it. Drop it when it is off-topic,
  unreadable at phone size, would need more than 1.25× upscaling to fill its
  area, carries a watermark, or shows a recognisable person who is not the
  subject.
- Keep each kept image's source URL for the final message.
- Found nothing usable → fine, step 5 handles it. Don't spend more than a few
  fetches looking.

When the user started from a Content Engine run, facts come from its knowledge
pages instead (see `easysociable-content`).

### 3. Hook and structure

Both catalogs are hosted cards distilled from real viral posts, with evidence
pooled across niches (a hook or structure works by its mechanism, not its
niche). Use a card when it fits; otherwise write your own. Never force one.

- Decide the content's **shape** from your facts: N tips → `tip-list`, a
  procedure → `steps`, a transformation → `before-after`, errors →
  `mistake-list`, a single piece of news or a claim → no list recipe.
- `easysociable hooks recommend --json` → one mold per hook type (list-tease,
  contrast, number, identity, …), ranked by evidence.
- **Always** look for a structure first:
  `easysociable formulas recommend [--recipe <recipe>] --platform <p> --fact-count <n> --json`
  (`--recipe` when the shape is a list recipe; without it you see every
  structure and judge fit yourself). Near-equal cards come back shuffled.
  When the user asked for something different from last time, add
  `--exclude <formulaId>` for the Formula that Run used.
- Use a card only if `stop` is false **and** it fits this content (a news
  explainer is not an "N things" list). Prefer `published`; a `hypothesis`
  card is thin evidence: use it only when it clearly fits.
- Hook: fill the mold's `format` with the topic (never copy its example).
  Formula: its `swipe` is the page order and each `beat.fill` guides the copy.
- No fitting card → write the hook and arc yourself (`references/ARC.md`):
  draft 3 hooks of different types, keep the most specific one the carousel
  fully pays off.
- Platform: what the user said, else the one their Brand/history uses, else
  Instagram 4:5. Page count follows the argument (usually 6–9), within
  `references/PLATFORM_CAPS.md`.
- One idea per page, ≤ 45 words per page. Page 1 is the hook. Last page asks
  for one action (comment, save or follow).

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
without a photo (references/REFERENCES.md, "A reference's image area"). Keep a
placeholder only where the content needs a real screenshot or photo (step 5).
`--no-image` is for when you specifically want designs drawn with type alone.
Read each chosen design with `easysociable templates source --family <familyId> --json`
and adapt it as in `references/REFERENCES.md` ("Adapting a reference" and
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
  image-generation tool; otherwise leave the page text-only.
- Generated images never contain text: all words stay in editable text layers.
  (A real screenshot or figure keeps its own text.)
- Fill each image area in this order:
  1. The user's own image, when they gave one.
  2. An evidence image from step 2. Upload it
     (`easysociable images upload --file body.json` with
     `{ "file": "data:image/png;base64,…", "filename": "x.png" }`; build it with
     `node -e "const f=process.argv[1],t=f.match(/\.(jpe?g|webp)$/i)?(/webp/i.test(f)?'webp':'jpeg'):'png';console.log(JSON.stringify({file:'data:image/'+t+';base64,'+require('fs').readFileSync(f,'base64'),filename:require('path').basename(f)}))" assets/x.png > body.json`)
     and use the returned `asset.url` as `src`.
     Crop and scale it (`objectFit: 'cover'`, `objectPosition`), never alter
     what it shows. To point at something in it, add a separate element on top
     (a red ellipse border, an underline bar) so the user can move or delete it.
  3. Something only the user has (their app, their dashboard, their results)
     → a **placeholder slot**, never a text-only layout. Size it into the
     composition (usually the lower half of the page) and label it with
     exactly what belongs there, e.g. "Add: Grok Bot app screenshot". The user
     selects it in Studio and clicks the upload button to replace it. Markup
     and SVG in `references/REFERENCES.md` ("Image placeholder").
  4. Anything else → fill the area from the content or delete it
     (`references/REFERENCES.md`, "A reference's image area").
- List every placeholder in the final message ("page 2: app screenshot").

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

### 7. Create and hand off

```bash
easysociable slideshows create --file pack.json --brand-id <brandId> --json
# no Brand: --theme theme.json instead of --brand-id
```

Reply once with: the `studioUrl`, the arc in one line, the sources (facts and
each evidence image: "p1 image: <url>"), and each image placeholder to replace (page + what to upload). Tell them to edit in
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
   `slots`. Too long → rewrite shorter; never resize boxes or move elements.
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
