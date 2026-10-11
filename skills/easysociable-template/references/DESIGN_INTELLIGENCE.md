# Design intelligence (lightweight)

Curated hints for philosophy, concept, and palette phases when the user has no brand hex. Not a replacement for `DESIGN_PHILOSOPHY.md` or `DESIGN_CONCEPTS.md` — use to seed `movementName`, `paletteCandidates`, and font pairing.

## Movement seeds (adapted from canvas-design; template-safe)

Use these as philosophy starters. Rewrite into `design-plan.json` `philosophy` fields; keep required slots readable.

| Seed movement | Space / composition | Rhythm / motif | Color mood | Font voice | Suggested hex |
|---------------|---------------------|----------------|------------|------------|---------------|
| Editorial Monument | One oversized focal; quiet gutters; thin attribution rail | Ledger rules, folio marks | Warm paper, dark ink, one accent | Editorial (serif display + Inter body) | `#0D9488` light |
| Terminal Pulse | Compact header; centered status metric; tabular footer | Prompt glyph, status dot, hairline grid | Near-black canvas, electric accent | Terminal (JetBrains Mono + Inter) | `#14B8A6` dark |
| Quiet Proof | Centered claim; generous negative space; small evidence row | Thin rules, soft dividers | Off-white, muted slate, restrained accent | Premium / editorial | `#475569` light |
| Warm Folio | Asymmetric author block; hero quote or metric; soft margin marks | Paper edge, soft rules | Cream-warm canvas, amber or deep ink | Premium | `#B45309` light |
| Signal Strip | Strong horizontal bands; one CTA or metric band dominates | Bars, ticks, progress marks | Neutral canvas, semantic green/blue sparingly | Modern SaaS (Inter/Inter) | `#2563EB` light |
| Creator Spark | Playful asymmetry; one bold gesture type; sparse stickers as siblings | Blobs/dots as CSS only | Light canvas, saturated accent | Playful | `#DB2777` light |

Map seed → `philosophy`:

- `movementName` ← seed name
- `space` / `composition` ← Space / composition column
- `rhythm` ← Rhythm / motif
- `color` ← Color mood (no final hex)
- `typographyAccent` ← Font voice + display/body ratio intent
- `craftBar` ← always include: one focal; no overlap; refine before adding decoration

## Archetype → style hints

| Archetype | Prefer movement seed | Layout bias | Palette mood |
|-----------|----------------------|-------------|--------------|
| Editorial / report | Editorial Monument | author rail, oversized metric | warm canvas, dark ink, one accent |
| Terminal / indie hacker | Terminal Pulse | compact header, centered metric | dark canvas, electric accent |
| Playful / creator | Creator Spark | asymmetric blocks | light canvas, saturated accent |
| Luxury / premium | Warm Folio / Quiet Proof | centered hero, small caps metadata | off-white canvas, gold or deep accent |
| Data / dashboard | Signal Strip | grid of metrics (still one primary focal) | neutral canvas, semantic green/red sparingly |

## Suggested brand hex (no user color)

Prefer curated presets in `references/THEME_PRESETS.md` / `theme-presets.json`, then generate with `--preset`. Fall back to mood hexes below only when presets do not fit.

| Mood | Light mode hex | Dark mode hex | Notes | Close preset |
|------|----------------|---------------|-------|--------------|
| Trust / finance | `#0D9488` | `#14B8A6` | teal — readable on white and near-black | `ocean-depths` |
| Energy / growth | `#16A34A` | `#22C55E` | green — watch muted contrast on light gray | `botanical-garden` |
| Tech / product | `#2563EB` | `#3B82F6` | blue — strong default for SaaS | `tech-innovation` |
| Bold / creator | `#DB2777` | `#EC4899` | pink — verify muted text on canvas | `desert-rose` (softer) |
| Premium | `#B45309` | `#D97706` | amber — pair with warm off-white canvas | `golden-hour` |
| Neutral authority | `#475569` | `#94A3B8` | slate — safe when accent must stay subtle | `modern-minimalist` |

## Font pairing (Gateway `themeTokens.fonts`)

| Voice | heading | body |
|-------|---------|------|
| Editorial | Georgia, serif stack | Inter |
| Terminal | JetBrains Mono | Inter |
| Modern SaaS | Inter | Inter |
| Playful | Fredoka | Nunito |
| Premium | Playfair Display | Source Sans 3 |

Use platform-safe stacks if custom fonts are not loaded — default to `Inter` for both when unsure. Do **not** vendor canvas-design’s `canvas-fonts` TTFs into this skill.

## Workflow tie-in

1. After Brief, run `DESIGN_PHILOSOPHY.md` and seed `movementName` from the table above when needed.
2. During `DESIGN_CONCEPTS.md`, attach `philosophyExpression` + named `paletteCandidates` (`name`, `brandHex`, `mode`, `bestFor`, optional `presetId`) per concept.
3. After selection, run `PALETTE_REVIEW.md`: showcase swatches → wait for explicit confirmation → lock winner.
4. Run `THEME_FROM_BRAND.md` (`--preset` or hex) to produce `theme-tokens.json`; do not `theme.create` until confirmed.

Do not treat this table as exhaustive — adjust hex when contrast fails.
