---
name: easysociable-slideshow
description: >
  Turn page-by-page carousel copy into an editable, ready-to-post Slideshow Run
  in EasySociable Studio. Preserve approved copy, generate layouts from the
  internal design system, render-check every page locally, then create the Run
  and hand the user a Studio link. Accept topic-only input only when the Content
  Skill has already produced the page copy.
  Never block on a question: a missing Brand shows as a bound sample the user
  fills once in Studio. Final pixels come only from Studio Download.
---

# EasySociable Slideshow Skill

The Content Skill owns content. This skill receives page-by-page copy and
returns a Studio link to a carousel that is good enough to post, where every
word is still editable. The output is editable, so **a wrong visual guess is
cheap and a question is expensive**: decide platform, page count, visual
language and layout yourself; the user fixes details in Studio.
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

## Input boundary

Route before designing:

1. **Page-by-page copy** — preserve it verbatim and go straight to layout.
2. **Long-form copy** — do not invent a Formula or restructure the argument
   here. Return to `easysociable-content` and compile it into page-by-page copy,
   then continue here.
3. **Topic only** — return to `easysociable-content` for the fallback writer;
   this skill must not generate the content itself.

Formula selection is not part of this skill. A Formula may be used only when
the user explicitly asks for a legacy Content Engine Topic or names one. A
user's Writing Skill, approved copy and original order always win.

For generated pages, read
[references/DISTILLED_DESIGN_SYSTEM.md](references/DISTILLED_DESIGN_SYSTEM.md).
It is the distilled visual knowledge from the Template catalog, not a list of
templates to select.

## Command output (`--json`)

Read results from these paths; don't guess:

| Command | Result |
|---|---|
| `auth status` | `authenticated`, `status`, `account.email` (no `data` wrapper) |
| `brands list` / `brands get` | `data[]` / `data` (`id`, `name`, `handle`, `colors`, `logoUrl`) |
| `formulas recommend` / `formulas get` | legacy Content Engine handoff only; never required for user-first copy |
| `templates references` / `templates source` | legacy catalog compatibility or explicit reuse only; new pages use generated layouts |
| `icons search --query <word>` | icon list for the word (ids, no SVG) |
| `icons get --id <id> --idempotency-key <any-unique-string>` | `canonicalSvg` to inline |
| `images upload --path …` | `data[]` (`path`, `asset.url`, or `error`); exit 1 if any failed |
| `slideshows create` | top level: `id`, `studioUrl` |

## Workflow

### 0. Login (once per session)

`easysociable auth status --json`.

EasySociable's unified MCP is a local stdio server launched by the host. It
calls `gateway.easysociable.com` itself, so the MCP host process must have
outbound DNS and HTTPS access. Prefer the unified MCP for Gateway operations;
when the CLI is needed, run it through the same network-enabled execution path.
This is an execution prerequisite, not a user setup step.

- `status: unauthenticated` / `authenticated: false` → stop; ask the user to run
  `easysociable auth login` (one browser approval covers CLI and Studio). Draft
  nothing while logged out.
- `status: network_error` / `authenticated: null` → do not ask the user to
  re-authorize and do not draft a Run; report that Gateway connectivity is
  unavailable and retry when the network is available.
- `status: authenticated` / `authenticated: true` → say once: "This Run will be created as
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

This step is only for legacy Topic handoff. In the normal user-first flow, the
Content Skill has already produced the page sequence and this skill must not
rewrite it. A long-form compiler's page order is the content's order, not a
Formula to be replaced.

- For an explicit legacy Formula request, read its beats only as content
  metadata and preserve the requested handoff. Do not call Formula
  recommendation for user-provided copy.
- Platform is what the user said, else the one their Brand/history uses, else
  Instagram 4:5. X multi-image Runs default to the same Instagram-compatible
  4:5 canvas (1080×1350), with 2–20 pages. For approved copy, page count
  follows the supplied pages; do not merge pages to fit a preferred count.
- For generated topic copy, the Content Skill owns the page count and content
  rhythm. This skill may report a layout issue, but must not silently rewrite
  the words to solve it.

### 4. Look and pages

The look is generated from the internal visual system. Templates are not a
user-facing selection step and new pages should not depend on a catalog
`pageTemplateId` or `layoutFamilyId`:

1. The user names a Run or says "same as last time / like this one" →
   "Reuse a Run" below.
2. The user shares a post (screenshot or link) → study its grid, type scale,
   background, density and decoration; translate those observations into the
   internal design system. Never copy its words or images, and do not require a
   catalog reference to reproduce the visual language.
3. The user asks for a different look ("换个样子", "something else") → first
   write 3–5 art directions that differ from each other and from this Brand's
   previous Run (one line each: grid, type treatment, background, density,
   decoration). Drop any the previous Run used and take the least conventional
   one that still keeps the content readable.
4. Otherwise → let the content decide. Choose a visual language, then compose
   each page from layout primitives (text stack, split, proof, comparison,
   steps, image focus, quote, metric and close). Keep one focal point per page,
   vary adjacent pages, and preserve a coherent deck-level system.

Use the internal design grammar and Studio source primitives to create each
page. Choose an image area only when the page's content benefits from one; a
text-only page is valid. Put the result in the pack as a generated page:

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

Write the post's text beside the images into the pack as `post`. The user
publishes from their phone: Studio's **Publish** copies this text and shares
the pages to the app in one tap, so a good draft is most of their work.

```json
{ "schemaVersion": "content-pack.v1", "platform": "xiaohongshu", "title": "…",
  "post": { "title": "…", "description": "…" }, "pages": [ … ] }
```

| Platform | Fields | Limits |
|---|---|---|
| xiaohongshu | `title` + `description` | 20 / 1000 |
| tiktok | `title` + `description` | 90 / 4000 |
| instagram | `description` (caption) | 2200 |
| threads | `description` | 500 |
| linkedin | `description` | 3000 |
| x | `description` (post text) | platform-aware; keep within the current X composer limit |

- Same language, facts and voice as the pages; never a fact the pages and
  knowledge don't have. No title field → no `title`.
- `title`: the hook in the platform's words, not the Run title. `description`:
  what the pages give, in a few short lines, then 3–8 `#hashtags` on the last
  line (Xiaohongshu, Instagram, TikTok, Threads; LinkedIn 0–3).
- Stay under the limits: Studio blocks Share over them. The Run returns them
  as `postLimits`.

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
Studio, then on their phone tap **Publish** → **Share to <platform>**: the
pages go to the app and the text is copied, so they paste once.

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
   Unlisted pages stay untouched. Feedback on the post text ("shorter caption")
   → `{ "post": { "title": "…", "description": "…" } }` in the same patch
   (it replaces both fields; keep the one not asked about).
4. `RUN_REVISION_CONFLICT` → the user saved in Studio meanwhile: `get` again,
   re-apply your change on top, retry once.
5. "Go back to the previous version" → take those pages' `layout` / `slots`
   from the newest `revisions/<runId>-r*.json` before the change and send them
   as a normal patch with the current `baseRevision`. The original generated
   pages are in the Run's `packSnapshot`.

Same `studioUrl`; tell the user to reload Studio. A new Run only for a
different topic, or when the user asks for an alternative version to compare.

## Legacy Formula handoff (only when explicitly requested)

`easysociable formulas get --id <id> --json`. Its `beats` are the pages (same
order and roles); `title_template` with `{X}` = the topic is the arc. Write copy
from each `beat.fill` and your facts; never copy the formula's example posts.
With `Look: L-…` (else the formula's first `looks` entry) the page source is
`look.slides["<n>"]` or `look.layouts[beat.role]` (a design's `familyId`):
read it with `templates source --family` and adapt it as in step 4. The Look
wins over rule 5 of step 4 but not over a Run or post the user named.
Then continue at step 5.

## Reuse a Run's visual language (prompt names a `run_…` for a new topic)

A new topic → a **new** Run; the source Run is never changed. Never ask which
mode; decide from the words and the content:

- **Reuse** — "using run_x as the template", "same as last time", "like
  this one" (last time = the newest Run of this Brand, `slideshows list`).
  Keep the visual language; do not expose or require a catalog Template ID.
- **Style** — "in the style / feel / vibe of run_x", or reuse was asked but
  the new content does not fit its page roles (a "N tips" Run for an "A vs B"
  topic). Take its colours, type treatment, chrome and spacing; lay pages out
  fresh in step 4.

Reuse steps:

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
4. Every plan: up to the platform maximum. X and Instagram: 20 pages; X defaults to 4:5 / 1080×1350. Free: 3 Downloads per month and 1 Brand; Creator: unlimited, 3 Brands; Studio: unlimited, 25 Brands. `BRAND_LIMIT_REACHED` → tell the user their plan's limit and the suggested action; never create a Run without the Brand silently.
5. Identity: create with the user's own login, not `workspace_local` /
   `test-key` (unless they asked for `--allow-local-fixture`). Studio says
   "belongs to another account" → recreate with the current login.
6. Explicit Content Engine runs keep their knowledge gate:
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

The Content Engine optionally owns knowledge pages and legacy Formula research.
The Content Skill owns content generation or long-form compilation. This skill
owns visual composition, generates layouts from the internal design system, and
opens Studio. Catalog designs remain compatibility/evaluation material and are
not required for a new Run.
