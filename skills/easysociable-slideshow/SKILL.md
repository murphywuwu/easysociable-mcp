---
name: easysociable-slideshow
description: >
  Turn a topic into an editable, ready-to-post carousel (Slideshow Run) in
  EasySociable Studio. Research facts, pick a proven hook and structure
  (Formula), adapt pages from one Deck Style's catalog layouts, render-check
  every page locally, then create the Run and hand the user a Studio link.
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
  Create it with `easysociable brands create --file brand.json` using the
  palette of the chosen Deck Style (`references/DECK_STYLES.md`).
  Skipped → no Brand: header shows the topic, the CTA has no handle, and the
  Deck Style palette goes in `theme.json` as
  `{ "color": { "canvas", "text", "textMuted", "accent", "primary" } }`
  (without a Brand or theme Studio falls back to its dark default).

### 2. Facts

Research the topic from primary sources (official announcement, docs,
reputable press). Keep a source URL for every fact. Drop claims you can only
find in secondary blogs. Never invent numbers, dates, quotes or features.

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
- `easysociable formulas recommend --recipe <recipe> --platform <p> --fact-count <n> --json`
  when the shape is a recipe.
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

### 4. Style and pages

Pick one Deck Style (`references/DECK_STYLES.md`): the Brand's style if it has
one, else by content. Styles that need images only when you have the images.

For each page, take the family that fits its purpose and adapt its source:

```bash
easysociable templates source --family <familyId> --platform <platform> --json
```

Follow "Adapting a family" in `DECK_STYLES.md`. Put the result in the pack as a
generated page:

```json
{ "role": "hook", "slots": { "text_0": "…", "text_1": "…" },
  "layout": { "studioJson": "<div id=\"Graphic\" data-type=\"post\" …>…</div>",
              "canvas": { "width": 1080, "height": 1350 } } }
```

`slots` maps each `data-variable` to its plain text. Generated pages carry no
`layoutFamilyId` / `pageTemplateId`. A Formula with a Look uses the Look's
families as the sources instead of a Deck Style.

### 5. Images

- Real products, apps, people, data → real screenshots or photos only. Never
  an AI-generated picture of a real product UI.
- Concept / mood / background → generate one if this environment has an
  image-generation tool; otherwise leave the page text-only.
- Images never contain text: all words stay in editable text layers.
- **Every page whose content needs a real image you don't have gets a
  placeholder slot** (as many pages as need one), never a text-only layout. Size it into the composition (usually the
  lower half of the page) and label it with exactly what belongs there, e.g.
  "Add: Grok Bot app screenshot". The user selects it in Studio and clicks
  the upload button to replace it. Markup and SVG in `DECK_STYLES.md`
  ("Image placeholder").
- An image you do have: upload it
  (`easysociable images upload --file body.json` with
  `{ "file": "data:image/png;base64,…", "filename": "x.png" }`) and use the
  returned `asset.url` as `src`.
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

Reply once with: the `studioUrl`, the arc in one line, the sources, and each
image placeholder to replace (page + what to upload). Tell them to edit in
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
`look.slides["<n>"]` or `look.layouts[beat.role]`: adapt that family exactly as
in step 4. Then continue at step 5.

## Rules

1. All hosted calls go through the `easysociable` CLI or the unified MCP
   server (Gateway). Never call Directus, R2, Stripe or private services.
2. Final pixels leave only via Studio **Download**. Do not call
   `slideshows render`, `slideshows export`, `renders create`, or MCP
   `render_slideshow_run` / `create_render_job` (`HEADLESS_RENDER_DISABLED`).
3. Revisions edit the same Run page by page (step 8): layout, text and images
   can all change. Page count and order are fixed for now (no add, delete,
   reorder) — if the user needs that, say so; create a new Run only when they agree.
4. Free: up to 8 pages and 3 Downloads per month; paid: 20 pages, unmetered.
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

The Content Engine owns knowledge pages and Formula research. The Template
skill owns authoring new catalog layouts. This skill turns a topic into a Run
and opens Studio.
