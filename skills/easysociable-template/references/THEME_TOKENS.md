# Theme tokens (page authoring)

Theme is the **skin** (color / font / surface). The page template is the **structure + slots**.

**External gradients and photo washes are not Theme assets.** They are Surface decorations (`workflows/SURFACE_REVIEW.md`): confirm a Gateway `gradients` recipe or imported `imageId`, then inline CSS / CDN background nodes. Theme remains solid semantic colors for contrast and Studio editing. Authoring derives six explainable two-stop Brand Hex recommendations and brand-tinted previews of Gateway Catalog recipes for the left Theme panel (`palette.gradient`, exposed as `--es-gradient-from/to`). Editing Brand Hex refreshes those cards and any selected catalog variant linked to the brand; the original Catalog recipe remains immutable and traceable through `catalogRecipeId`. Clicking a card or applying a custom pair explicitly changes the active global gradient and records `palette.gradientSelection`. The right-side Gradient controller remains local to the selected element, and manual choices are marked fixed. These recommendations do not replace a confirmed Surface decoration.

## When creating a single-page template

1. Prefer **reuse** `themeId` if the user already has a Look.
2. Otherwise **co-create** full `ThemeTokens` with the draft (`theme.create`):
   - If user provides brand hex → `workflows/THEME_FROM_BRAND.md` → `theme-tokens.json`
   - If multiple palette directions → `workflows/PALETTE_REVIEW.md` first
   - If no brand hex → seed from `references/DESIGN_INTELLIGENCE.md`, then generate
3. Page chrome should reference semantic CSS variables (`--es-color-*`, `--es-font-*`, `--es-surface-*`), not hard-coded brand colors on every node.

## Gateway payload (`theme_schema_v1`)

Authoring persists Studio preview tokens on **`TemplateLayoutFamily.preview_tokens`** (not a TemplateTheme row). Fill/render uses Brand `themeSnapshot` first, then family preview tokens, then a service default (ADR-0033). When `palette` is present, treat tokens as `theme_schema_v2`. The `colors` object includes six semantic roles: `canvas`, `text`, `accent`, `muted`, `primary`, `border`.

```ts
{
  colors: {
    canvas: '#FFFFFF',
    text: '#042F2B',
    accent: '#0D9B8F',
    muted: '#0B7F75',
    primary: '#0B7F75',
    border: '#C6F5F1',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  surfaces: {
    radius: '12px',
    shadow: '0 8px 24px rgba(0,0,0,.12)',
  },
  logoAssetId?: string,
  lockedKeys?: string[],
}
```

## Local artifact (`theme_tokens_v2`)

`theme-tokens.json` is a workflow artifact (not a Gateway DTO). Generate with:

```bash
node scripts/generate-theme-from-hex.mjs <#hex> --mode light|dark -o theme-tokens.json
node scripts/validate-design-v2.mjs theme-tokens.json
```

Contains:

| Field | Purpose |
|-------|---------|
| `scale` | 11-shade brand scale (`50`–`950`) |
| `semantic.light` / `semantic.dark` | Resolved semantic roles per mode |
| `themeTokens` | Active mode — use for `theme.create` |
| `themeTokensLight` / `themeTokensDark` | Both modes for comparison |
| `contrast` | WCAG ratio report per pair and mode |
| `contrastPass` | `true` when all pairs meet AA |

Semantic roles in scale (internal): `canvas`, `text`, `accent`, `muted`, `primary`, `border`. All six are stored in `themeTokens.colors` for v2; Authoring Studio displays them plus the 11-shade scale.

Runtime CSS variables (authoring + renderer):

| Variable | Source |
|----------|--------|
| `--es-color-canvas` / `text` / `accent` / `muted` | Active semantic colors |
| `--es-color-primary` / `border` | v2 palette semantic extras |
| `--es-scale-50` … `--es-scale-950` | Brand scale when `palette` present |
| `--es-font-*` / `--es-surface-*` | Fonts and surfaces |

Templates may use `var(--es-scale-600)` directly in inline styles or classNames.

## Light vs dark mode

- **Light canvas** (editorial, paper, playful): `--mode light` → white canvas, dark text, accent from scale 600
- **Dark canvas** (terminal, neon, cinematic): `--mode dark` → scale 950 canvas, light text, accent from scale 500

Match `activeMode` to the selected concept `colorStrategy`. Do not mix light tokens on a dark-canvas concept.

## Rules

- Do not model accent/canvas as content slots (`color` binding) for normal templates.
- Do not hand-pick four hex values when `brandHex` is known — run the generator.
- Co-created Theme may be published with the page when the Agent runs `PUBLISH_FROM_DRAFT.md` after user Save + approval.
- Legacy hardcoded templates may open in Studio without full Theme restyle; new authoring must be Theme-aware.
- If `contrastPass` is false, fix before `theme.create` (switch mode, adjust hex, or document trade-off).
