# Palette review

Choose between 2–3 palette directions and lock theme tokens before layout authoring.
Adapted from Anthropic `theme-factory`: **show → ask → wait for explicit choice → apply**.

## When to use

- After concept selection in `DESIGN_CONCEPTS.md`
- Before `AUTHORING_FROM_BRIEF.md` or `AUTHORING_FROM_IMAGE.md` build step
- When co-creating Theme (no reusable `themeId`)

## Steps

1. Build **2–3 named candidates** (not anonymous A/B hexes):
   - From user brand hex → light/dark (or slight hex variants) via generator
   - Or from `references/THEME_PRESETS.md` / `theme-presets.json` when no brand hex
   - Each candidate needs: `name`, `brandHex`, `mode`, `bestFor` (and optional `notFor` / `presetId`)
2. Generate a candidate file per option:

```bash
node scripts/generate-theme-from-hex.mjs --preset ocean-depths -o theme-candidate-ocean.json
node scripts/generate-theme-from-hex.mjs --preset tech-innovation -o theme-candidate-tech.json
node scripts/generate-theme-from-hex.mjs #0D9488 --mode light -o theme-candidate-custom.json
```

3. **Showcase (required)** — present a swatch table before asking the user to choose. Do not dump raw JSON as the only view:

| Name | Preset / custom | Mode | brandHex | Accent | Contrast | bestFor |
|------|-----------------|------|----------|--------|----------|---------|
| Ocean Depths | ocean-depths | light | #1A6B6B | … | pass | Finance, trust metrics |
| Tech Innovation | tech-innovation | dark | #2563EB | … | pass | Startups, launches |

Include one-line canvas/accent feel from each candidate’s `themeTokens.colors`.

4. **Ask and wait** — which theme to apply? Do **not** call `theme.create` or finalize `theme-tokens.json` until the user explicitly confirms (or they already said “直接用 X / 你定”).
5. On confirmation, copy the winner to `theme-tokens.json` and set Theme create **name** to the candidate `name` (e.g. `Ocean Depths`), never `Theme draft_xxx`.
6. Update `design-plan.json`:

```json
"themePreview": {
  "name": "Ocean Depths",
  "presetId": "ocean-depths",
  "brandHex": "#1A6B6B",
  "activeMode": "light",
  "contrastPass": true,
  "bestFor": "Finance, consulting, trust-building metric cards",
  "themeTokensPath": "theme-tokens.json",
  "userConfirmed": true
}
```

7. Run `node scripts/validate-design-v2.mjs design-plan.json` and `theme-tokens.json`.
8. Continue to `THEME_FROM_BRAND.md` only if tokens still need regeneration; otherwise proceed to authoring with the locked file.

## Contrast checklist (before authoring)

- [ ] `text` on `canvas` ≥ 4.5:1 (AA body text)
- [ ] `muted` on `canvas` ≥ 4.5:1
- [ ] `accent` on `canvas` ≥ 3:1 (accent text / links)
- [ ] `label` on `primary` ≥ 3:1 (filled buttons — light text on dark primary in dark mode)
- [ ] Screenshot spot-check: no neon-on-neon or gray-on-gray failures

If any pair fails, regenerate or switch mode — do not proceed to `authoringSource`.

## Do not

- Apply a theme without showcase + explicit confirmation (unless user waived choice)
- Offer palettes that differ only by one shade step
- Skip `theme-tokens.json` when creating a new theme
- Override failed contrast with arbitrary hex without re-running the generator
- Name Gateway themes as `Theme <draftId>`
