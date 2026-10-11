# Design concepts (text brief V2.1)

Run after `DESIGN_PHILOSOPHY.md` (and `DESIGN_BRIEF.md` for text intake). Act as an art director expressing one shared philosophy, not a slogan generator.

## Output

Create **2–3 materially different concepts**. They are **spatial variations of the same `philosophy`**, like canvas-design multi-page twists — not three unrelated moods.

Each concept must specify:

- `id`, name, one-sentence rationale, and a recognisable visual motif
- `philosophyExpression` — how this layout expresses the shared philosophy in space (required)
- Canvas zones with approximate `x/y/width/height`
- Focal hierarchy: primary, secondary, attribution
- Typography system: display/body contrast and approximate scale ratio (traceable to `philosophy.typographyAccent`)
- Color strategy: canvas/ink/muted/one dominant accent (mood only; hex via Theme pipeline)
- `paletteCandidates` (optional but recommended): named options such as `[{ "name": "Ocean Depths", "presetId": "ocean-depths", "brandHex": "#1A6B6B", "mode": "light", "bestFor": "…" }]` — prefer `references/THEME_PRESETS.md` when user has no brand color
- Asset strategy: none, CSS/SVG, reuse, or generate
- Whitespace/density strategy and concrete risks

Changing only colors, radius, or shadows does not create a different concept. Change at least two of: composition, focal placement, type treatment, visual motif, asset role.

`layout` / `hierarchy` / `typography` must be clearly derivable from `philosophy.space` / `composition` / `rhythm` / `typographyAccent`.

## Selection

- Show concise concept summaries when the user asked to choose or collaborate.
- Otherwise recommend and select the strongest concept; state why it best serves the one-glance job **and** the shared philosophy.
- Keep rejected concepts in `design-plan.json` so the decision remains auditable.
- Use one concept only for `source.kind = image_reference`, where the reference already determines composition (still require `philosophyExpression`).

## Guardrails

- Use one dominant focal idea.
- Prefer editorial hierarchy over a grid of generic SaaS cards.
- Make decorative choices reinforce the philosophy’s rhythm; do not add illustration by default.
- Keep replaceable text, numbers, avatars, and logos editable.
- Design for realistic stress content: long name, large number, missing optional asset.
- Do not invent a second philosophy per concept.

Continue to `ASSET_PLAN.md`, then `PALETTE_REVIEW.md` and `THEME_FROM_BRAND.md` when co-creating a theme. Validate `design-plan.json` and `theme-tokens.json` using `references/DESIGN_V2_1.md`.
