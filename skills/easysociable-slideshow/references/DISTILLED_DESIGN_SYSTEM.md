# Distilled Design System

This document is the internal visual system distilled from the current Template
catalog snapshot: 48 published page designs, 2026-11-08. It replaces template
selection for new Runs. Template IDs remain compatibility and evaluation data.

Sources: the public Gateway catalog (`/v1/catalog/templates`) and its detail
records (`/v1/catalog/templates/:id`), plus the local template authoring design
intelligence and visual-QA contracts. The catalog was grouped by visual
language, density, canvas, role, slot shape and use/not-use guidance rather
than copied as a list of template IDs.

## Corpus findings

- 27 designs are minimal, 12 editorial, 3 dark, 3 Swiss and 3 bold-promo.
- 28 designs are low density, 15 medium and 5 high.
- 38 designs use an image; 10 are text-only.
- Canvas coverage is 29 designs at 3:4, 16 at 4:5, 2 at 9:16 and 1 at 1:1.
- The catalog is mainly utility (28), then narrative (12), conversion (6) and
  social proof (2).
- Covers are usually low density with one dominant promise and optional hero,
  product or screenshot. Evidence, comparison and paragraph pages tolerate
  higher density but need stronger alignment and grouping.

## Visual languages

Choose one language for a deck, then vary composition inside it.

### Minimal

Quiet background, large readable type, generous whitespace, one product,
screenshot or simple focal object. Default for tutorials, tools and lists.

### Editorial

Paper-like surface, issue/tag metadata, strong headline, rail or rule, compact
source/value details. Use for opinion, news, career and evidence-heavy pages.

### Dark

Dark canvas, high-contrast type, restrained highlight color and a large hero or
fact block. Use for dramatic news or product evidence; avoid when the Brand is
light and calm.

### Swiss

Grid-first composition, restrained type, explicit columns and labeled blocks.
Use for product systems, comparisons and technical explanations.

### Bold promo

Large branded object, high-contrast accent and short promise. Use for launches,
milestones and product covers, not dense explanations.

## Layout primitives

Compose a page from these primitives instead of copying a template:

| Primitive | Use when | Constraints |
|---|---|---|
| Text stack | Claim, opinion, hook or close | One dominant headline; body is secondary. |
| Image focus | Product, screenshot, photo or proof is the argument | The image must be legible at phone size and get the largest useful area. |
| Split | Text and screenshot need equal attention | Keep one reading direction; do not create two competing headlines. |
| Step frame | One action in a procedure | Show action, expected result and optional evidence. |
| Proof / metric | One number, quote, chart or result | One proof claim per page; label the source or context. |
| Compare ledger | Before/after or without/with | Align paired rows and keep the comparison axis constant. |
| Prompt / code card | Copyable input or structured instruction | Preserve monospace hierarchy and visibly separate input/output/rules. |
| List marker | A repeated series | Use numbered markers only when order matters. |
| Close | Save, follow or next action | One action, low density, no new argument. |

## Composition by page role

- `cover` / `hook`: low density, one promise, tension or result; favor text
  stack plus one hero/product/screenshot, or a clean text-only poster.
- `setup` / `context`: establish the frame with a short dek, not a paragraph.
- `point` / `value`: one idea, optionally paired with one image or app object.
- `steps`: action + expected result; use a screenshot when the action is visual.
- `proof` / `evidence` / `metric`: make the evidence dominant; reduce chrome.
- `compare`: use aligned rows or two columns; never use unrelated cards.
- `cta` / `follow` / `recap`: quiet close with one action and enough breathing
  room.

## Image rules distilled from the catalog

- Use an image when it proves, demonstrates or materially clarifies the page.
- Use a screenshot for a product action, a product object for a tool reveal, a
  hero/photo for a story or news claim, and an avatar only for identity or
  social proof.
- Do not add an image to a text-only argument merely to fill space.
- Covers can use one focal image or a small repeated object set; body pages
  should not turn a single idea into a collage.
- Fixed-count compositions are exceptional: 3-, 4- or 5-item designs must only
  be used when the copy contains exactly that many items.

## Density and rhythm

- Start low density on page 1.
- Increase density only when the content requires comparison, evidence or a
  structured prompt.
- Follow a dense page with a breathing page when the deck is long.
- Do not repeat the same composition on adjacent pages. Reuse the visual
  language, not the exact layout.
- Keep the same type roles, spacing scale, alignment edge and accent behavior
  across the deck.

## Generation constraints

1. The copy is the authority; layout must adapt to it.
2. Every page has one focal point and one dominant reading path.
3. Align text and media to a shared grid and keep platform safe areas clear.
4. Never solve overflow by silently changing copy; resize, reflow or choose a
   more suitable primitive.
5. Never use a fixed-count layout when the count does not match the copy.
6. Prefer generated `layout.studioJson` + `canvas` with no Template ID.
7. Render-check every page for overflow, overlap, contrast, legibility and
   adjacent-page repetition.

## Evaluation cases

Every change to the layout generator should be checked against:

- a text-only hook;
- a screenshot-led tutorial step;
- a data/proof page;
- a before/after comparison;
- a 5-item list cover;
- a quiet CTA page;
- a long deck where adjacent pages must not repeat the same composition.
