# Design philosophy (after brief, before concepts)

Borrow canvas-design’s order: name a visual movement, write the aesthetic worldview, then express it as layout concepts. This is **not** a free-art poster workflow — the philosophy must serve a one-glance social template with editable slots.

## When to run

- After `DESIGN_BRIEF.md` for `source.kind = text_brief`
- After image inspection for `AUTHORING_FROM_IMAGE.md` (short reverse-engineered philosophy is enough)
- Before `DESIGN_CONCEPTS.md`

Skip only when reusing an already validated `design-plan.json` that already contains `philosophy`.

## Goal

Produce one shared philosophy that later concepts will express differently in space. Do **not** invent three unrelated slogans.

## Steps

### 1. Name the movement (1–2 words)

Examples adapted for social templates: `Editorial Ledger`, `Terminal Pulse`, `Quiet Proof`, `Monument Metric`, `Warm Folio`.

Seed from `references/DESIGN_INTELLIGENCE.md` when stuck.

### 2. Write the philosophy (4–6 short paragraphs or structured fields)

Cover each once (no redundancy):

| Field | Ask |
|-------|-----|
| `space` | Margins, breathing room, density, where emptiness works |
| `color` | Mood and limit strategy (not final hex — that comes from Theme pipeline) |
| `rhythm` | Repeating system: rules, dots, grids, cadence of decoration |
| `composition` | Zones, focal placement, what stays quiet |
| `typographyAccent` | Display vs body ratio; where type is a gesture vs metadata |
| `craftBar` | One sentence: museum-grade spacing, no overlap, one focal, refine before adding |

Optional but recommended:

| Field | Ask |
|-------|-----|
| `subtleReference` | Quiet conceptual DNA (jazz quote, not a label sticker) |
| `templateConstraints` | Slots stay bindable; flat absolute siblings; Theme owns color; never flatten copy into a poster |

Also write companion `design-philosophy.md` for humans using the structure in `references/DESIGN_V2_1.md`.

### 3. Template hard constraints (must appear in philosophy or `templateConstraints`)

Rewrite canvas-design’s “minimal text / pure art” into template-safe rules:

1. **Slots win clarity** — required brief slots become bindable nodes; philosophy may demand sparse chrome, not missing content.
2. **Theme owns hex** — philosophy states mood/limit only; concrete colors go through `PALETTE_REVIEW.md` + `THEME_FROM_BRAND.md`.
3. **Decoration is rhythm** — prefer CSS/SVG repeats (lines, dots, grids) over new illustrations.
4. **Flat absolute layout** — zones are canvas siblings; card chrome is a background sibling, never a nested absolute group.
5. **Readable focal** — subtle reference is allowed, but title/metric must be one-glance clear on social canvases.

### 4. Hand off

Continue to `DESIGN_CONCEPTS.md`. Every concept must include `philosophyExpression` describing how **this** spatial plan expresses the shared philosophy.

Embed `philosophy` into `design-plan.json` before validation.

## Do not

- Skip philosophy and jump to SaaS three-card layouts
- Write a philosophy that forbids required text slots
- Encode final brand hex only inside philosophy prose (use Theme pipeline)
- Treat philosophy as a PNG art brief that replaces `authoringSource`
- Ship canvas-design font files; map voice → Theme fonts via `DESIGN_INTELLIGENCE.md`
