# Author from reference image

Intake when the user provides a poster / card image to turn into a **single-page** template.

## Goal

Vision/LLM understanding stays **local**. Rebuild the page as a slotted `authoringSource` that **follows the reference as a layout and visual specification**, not as a loose mood board.

User always finishes in Authoring Studio. Do **not** claim a pixel-perfect clone is guaranteed under absolute layout — but do **not** treat approximation as permission to invent a different composition.

## Non-negotiable (reference path)

When `source.kind = image_reference` (user gave a reference image):

1. **Spec over vibes.** Target function is **minimize visual distance to the reference** under slot/Theme/flat-tree constraints — not “ship any educational card that validates.”
2. **Measure before inventing.** Extract and record **`referenceSpec`** in `design-plan.json` (required fields: `stackOrder`, `margins`, `gaps`, `radii`, `typeScale` — contract in `references/DESIGN_V2_1.md`). Validator rejects plans without it.
3. **Inventory every pictorial region.** Before building nodes, list all **bitmap-like content** in the reference into **`referenceImageInventory`** (see § Image inventory). Each must become an **`image` slot** (or Icon Catalog for true icons — see below). **Forbidden:** replacing those regions with CSS fake faces, emoji, or invented SVG “because it’s faster.”
4. **Editable copy stays nodes.** Rebuild typography and numbers as text/number slots. Never flatten replaceable text into a baked background image.
5. **Visual QA must compare to the reference.** Studio screenshot alone is not enough — side-by-side against the reference is required before handoff (`VISUAL_QA.md` § Reference compare). `visual-qa.json` must set `sourceKind: image_reference` and a passing `referenceCompare`.

## Image inventory (what must become an image slot)

Treat as **pictorial / bitmap content** → **`image` slot** (`image_0`, `image_1`, …) with `imageRoles` set:

| Include as image slot | Examples |
|-----------------------|----------|
| Photos | People, product, lifestyle |
| Illustrations / drawn characters | Soft person illustrations, mascots |
| Screenshots / UI captures | App frames, dashboards |
| Avatars / logos used as content | Profile photos, brand marks used as imagery |
| Any non-geometric picture inside a frame | Rounded photo wells, poster insets |

**Not** image slots (CSS / Theme / Icon Catalog instead):

| Keep as chrome | How |
|----------------|-----|
| Solid/gradient panels, hairlines, anonymous discs used only as wash | CSS decoration |
| Number badges that are pure typography in a circle | decoration + fixed or `text`/`number` if variable |
| Recognizable **icons/glyphs** (arrows, checks, UI symbols) | **Icon Catalog** (`SURFACE_REVIEW.md` § Icons) — not hand-drawn; not a photo slot unless the reference literally uses a photo there |

If unsure whether a region is “illustration” vs “icon”: prefer **image slot** when it looks like artwork/photo; use Icon Catalog when it is a standard UI glyph.

### Image slot rules on this path

- Each inventoried picture → one `image` slot; set `requiresImage` / `imageRoles` / `slotSummary.image` accordingly.
- Authoring nodes for those slots: absolute `img` (or image host) with `data-variable="image_N"` — **empty placeholder frame** matching reference geometry (size, radius, position). Do not fill with CSS person-shapes.
- At create time, placeholders may be empty; fill later via account `imageId` (`FILL_AND_RENDER.md`). Optional: import a cropped stand-in from the reference only when the user supplies/exports that crop as an upload — never keep third-party temp URLs in Authoring Source.
- Write inventory into `design-plan.json` → `referenceImageInventory` **and** matching `assetPlan[]` rows with the same `slotKey` (see `DESIGN_V2_1.md`). Do not leave inventory only in chat.

## Steps

1. Confirm single-page intent (not “rebuild this whole carousel as one Agent pack”).
2. Read `references/PLATFORM_SPECS.md` when mapping detected aspect → platform defaults. Prefer the platform the user named; otherwise infer from aspect and **confirm**.
3. **Read the reference pixels with a vision-capable tool** (`read_file` on the image path, or equivalent). Do **not** invent geometry or image inventory from a filename, caption, or memory alone. Then extract **into a written checklist** (show the user before heavy authoring when geometry is ambiguous):
   - Canvas aspect / preset + suggested pixel size; likely `platforms`
   - Likely **pageRoles** (1–2), contentFamily / archetypes, density, visualStyle
   - Layout regions and **stack order** (title, cards, tip, CTA, …)
   - **`referenceSpec`:** margins, gaps, radii, typeScale, stackOrder
   - **`referenceImageInventory`:** every pictorial region → `image_N` + `imageRole` + `boxApprox`
   - **Variable vs fixed:** copy/data → slots; pure chrome → decoration; pictures → image slots; glyphs → Icon Catalog
   - Theme candidates (canvas/text/accent/muted, font feel) sampled from the reference
4. Reverse-engineer a short shared philosophy (`workflows/DESIGN_PHILOSOPHY.md`) from the reference — movement name + space/color/rhythm/composition/type/craftBar. Write it into `design-plan.json` `philosophy`. Philosophy must **serve the measured layout**, not excuse a different grid.
5. Treat the reconstruction as the selected concept (one concept is enough), with `philosophyExpression` describing how the rebuilt zones express that philosophy **and** match the reference zones. Then follow `workflows/ASSET_PLAN.md` and `workflows/SURFACE_REVIEW.md`:
   - Pictorial regions → `image` slots (`user_upload` / import) with `assetPlan[].slotKey`, not `css_svg` stand-ins
   - Icons/glyphs → Icon Catalog confirm → `get_icon`
   - Rebuild editable typography, data, and **geometric** decoration with nodes/CSS
   - Never flatten replaceable text or data into a generated image
   - Never keep third-party temporary image URLs in Authoring Source
   - Write `referenceSpec` + `referenceImageInventory` + `assetPlan`, then `node scripts/validate-design-v2.mjs design-plan.json` (must pass); `image_reference` may contain one concept
   - When co-creating Theme, run `THEME_FROM_BRAND.md` (sample colors from reference → `brandHex`) and validate `theme-tokens.json`
6. Build **P0 selection metadata** (`references/CATALOG_METADATA.md`) — infer, then confirm with the user.
7. Build an explicit **slot table** (`references/SLOTS.md`):
   - Types: `text` | `number` | `image` only
   - Keys may be `text_0`, `image_0`, …
   - Every `text` slot includes `maxLines` (+ `maxCharacters` when known)
   - Every inventoried picture has a corresponding `image_*` entry
   - No `list` type — repeated lines → `text_1`…`text_n` + `fixedItemCount` when checklist/steps
8. Map regions to **flat absolutely positioned** canvas siblings (no absolute-inside-absolute groups; card chrome = decoration sibling). Set `data-variable` / binding on fillable nodes only. **Match the geometry spec** (positions/sizes within a tight tolerance of the measured reference, scaled to the chosen canvas). Put exact geometry and critical typography in inline `style={{...}}`; do not use Tailwind arbitrary-value layout classes. Fill `slotSummary` / `requiresImage` / `imageRoles`.
9. Propose Theme reuse or `ThemeTokens` create from `theme-tokens.json` (`references/THEME_TOKENS.md`).
10. Show the user: geometry summary, **image inventory → slot map**, selection metadata, Theme. Call out any region you could not match and why. Proceed when they accept.
11. Run `scripts/validate-authoring-source.mjs <authoring-source.json>` and fix every error.
12. Continue with `workflows/AUTHORING_STUDIO.md` (`source.kind = image_reference`, brief = path or short note) → **`MULTI_PLATFORM_FAMILY.md`** (derive + hand-tune other presets). Run Visual QA **including reference compare on the master** before handoff; still QA each derived variant for fit/clipping.

## Limits (state upfront when relevant)

- Complex photography collages, heavy effects, or handwritten type may still need Studio polish; still inventory pictures as image slots and match overall geometry.
- Absolute layout: do not promise empty lines will pack upward.
- Never Publish from Agent until the user has Saved in Studio and explicitly asked to publish (`PUBLISH_FROM_DRAFT.md`).

## Do not

- Treat the reference bitmap as the whole template (must become slotted authoring source)
- Use the reference as a **mood board** while shipping a different composition/density
- Replace pictorial regions with CSS fake people, emoji, or invented illustrations
- Skip vision read of the reference / invent inventory from filename or memory alone
- Skip `referenceSpec` / `referenceImageInventory` or skip image slots for detected pictures
- Skip reverse-engineered philosophy / `philosophyExpression`
- Skip reference-compare Visual QA (`sourceKind` + `referenceCompare` on `visual-qa.json`)
- Copy private Binding/AST formats into Gateway requests
- Use runtime Tailwind arbitrary-value classes for critical geometry or typography
- Nest absolute frames inside wrapper cards/groups (flatten to canvas siblings instead)
- Start Content Skill / render a slideshow from this path
