# Theme from brand color

Generate deterministic, WCAG-checked theme tokens from a brand hex or curated preset before `theme.create`.

## When to use

- User provides a brand color (hex) or brand kit with primary color
- User confirmed a preset from `PALETTE_REVIEW.md` / `references/THEME_PRESETS.md`
- Selected concept has a concrete color direction (not only free-text `colorStrategy`)
- No existing `themeId` to reuse

Skip when the user already selected a published theme or only wants to tweak an existing theme.

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| `brandHex` **or** `--preset <id>` | Yes | Preset supplies hex + fonts + suggested mode |
| `activeMode` | Yes | `light` or `dark` — match concept / preset bias |
| `heading` / `body` font | No | Default from preset or `Inter` |
| Theme `name` | Yes for create | Human name (preset `name` or custom), not `Theme draft_xxx` |
| User confirmation | Yes | From `PALETTE_REVIEW` unless user waived |

## Steps

1. Resolve inputs:
   - Brand hex from brief / brand kit / user message, **or**
   - `--preset` id from `references/theme-presets.json` after user confirmation
2. Pick `activeMode` from selected concept / preset:
   - Light canvas / editorial paper → `light`
   - Dark canvas / terminal / neon → `dark`
3. Run:

```bash
node scripts/generate-theme-from-hex.mjs <#hex> \
  --mode <light|dark> \
  --heading "<Font>" \
  --body "<Font>" \
  --output theme-tokens.json

# or
node scripts/generate-theme-from-hex.mjs --preset ocean-depths \
  --output theme-tokens.json

node scripts/generate-theme-from-hex.mjs --list-presets
```

4. Validate:

```bash
node scripts/validate-design-v2.mjs theme-tokens.json
```

5. If `contrastPass` is `false`, adjust before authoring:
   - Try the other mode (`light` ↔ `dark`)
   - Shift brand hex slightly (darker/lighter) and regenerate
   - Try another preset
   - Document the trade-off in `design-plan.json` `selectionReason`
6. **Confirmation gate:** do not call Gateway `theme.create` until `themePreview.userConfirmed` is true (or the user explicitly waived palette choice).
7. Use `themeTokens` from `theme-tokens.json` for Gateway `theme.create` — includes embedded `palette` for `theme_schema_v2`. Pass a readable `name` (preset name or custom label).
8. Keep `theme-tokens.json` alongside `design-plan.json` for Visual QA contrast reference.

## Output artifact

`theme-tokens.json` — schema `theme_tokens_v2`. See `references/DESIGN_V2_1.md`. May include `preset: { id, name, bestFor, notFor }` when generated from `--preset`.

## Do not

- Hand-pick four colors without running the generator when a brand hex or preset exists
- Put scale shades (`500`, `700`) directly on page nodes as hard-coded hex — prefer `--es-color-*` / `--es-scale-*`
- Skip contrast validation when `colorContrast` is scored in Visual QA
- Create `authoringSource` or `theme.create` before `theme-tokens.json` validates and the user confirmed (when no `themeId`)
- Create themes named only after draft ids
