# Screenshot-based Visual QA (V2.1)

Run after draft creation and before the user handoff. Source inspection alone is not visual QA.

## Render evidence

1. Prefer opening `authoringStudioUrl` with available browser control and capture the rendered canvas.
2. If browser control is unavailable, record QA as pending; the unified CLI has
   no separate `easysociable-template preview` command. A final render is not a
   substitute for inspecting Authoring Studio.
3. Record an inspectable screenshot path or URL in `visual-qa.json`.
4. Never mark QA as passed when the page did not render or the screenshot could not be inspected.

## Review order

0. If `theme-tokens.json` exists, compare screenshot contrast to its `contrast` report for the active mode. Failed pairs are hard failures or cap `colorContrast` at 5. When `surfacePreview.kind` is `gradient` or `image`, also check text against `contrastAnchor` / scrim — do not assume Theme.canvas alone matches the wash.

0b. **Reference compare (required when `source.kind = image_reference`)** — before numeric scoring:
   - Open the **reference image** and the **Studio canvas screenshot** side by side
   - Check against `design-plan.json` → `referenceSpec`: margins, card stack order, radii, gaps, type hierarchy, badge/icon box sizes
   - Confirm every `referenceImageInventory` entry is an **image-slot frame** on canvas (not CSS fake faces/illustrations). Missing inventory → hard failure
   - Confirm recognizable glyphs used Icon Catalog (or documented degrade), not hand-drawn substitutes
   - A draft that is “structurally educational” but clearly a different layout/density than the reference **fails** this pass even if the numeric rubric might scrape by
   - Record on `visual-qa.json`: `sourceKind: "image_reference"` and `referenceCompare: { performed, geometryMatch, imageSlotsMatchInventory, notes? }`. A `pass` verdict requires all three booleans `true` (`validate-design-v2.mjs` enforces)
   - If browser/screenshot tools are unavailable, mark reference compare **pending** (`performed: false`) and do not claim Visual QA passed

1. **Craft Pass (philosophy discipline)** — before numeric scoring:
   - Read `design-plan.json` → `philosophy.craftBar` and the selected concept’s `philosophyExpression`
   - If the screenshot contradicts the philosophy (e.g. generic SaaS three-card grid vs “monumental single metric”), treat that as a composition/hierarchy issue and plan a revise toward the stated expression
   - For `iteration >= 1`, default revisions **tighten existing nodes** (size, position, whitespace, type scale, contrast). Do **not** add large new decoration layers or new illustrations to chase points
   - If a full-bleed gradient or photo surface is already the signature, do not add a second competing atmosphere layer
   - Prefer high-impact changes: focal size/position, whitespace, alignment, type scale, contrast, then decoration

2. Check hard failures:

- render/runtime error
- clipped or overflowing text
- overlapping content
- off-canvas elements or unsafe margins
- unreadable contrast
- missing required slot content/image
- background or decoration obscuring the focal message
- third-party temp URLs or broken CDN for image surface/slots
- **reference path:** pictorial regions replaced by CSS/emoji stand-ins; composition clearly diverged from the reference without user acceptance
3. Score the fixed rubric in `references/DESIGN_V2_1.md`:

- hierarchy 20
- composition 15
- spacing/alignment 15
- typography 15
- color/contrast 10
- asset relevance 10
- content resilience 10
- editability 5

## Revision loop

- Pass only with no hard failures and total score `>= 80`.
- For a failure, list concrete issues by region/node and revise `authoringSource`.
- In `changesMade`, describe refine-first edits; avoid “added new decorative panel/illustration” unless the user explicitly asked or an assetPlan required asset was missing.
- Validate the updated source, update the same `draftId`, and capture a new screenshot.
- Perform at most **two automatic revisions** (`iteration` 0, 1, 2). Ask before doing more.
- Do not hide a layout problem by rasterising the whole design.

Validate the final `visual-qa.json` with `scripts/validate-design-v2.mjs`. If visual tools are unavailable, disclose the missing QA instead of fabricating a passing artifact.
