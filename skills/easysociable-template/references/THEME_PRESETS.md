# Theme presets (EasySociable)

Curated menu adapted from Anthropic `theme-factory`, rewritten to EasySociable Theme contracts (`brandHex` + `mode` + Studio fonts + `bestFor`).

**Not** a replacement for `generate-theme-from-hex.mjs` — presets supply inputs; the generator still builds the 11-shade scale, six semantic colors, and WCAG report.

## How to use

1. When the user has no brand hex, offer **2–3 presets** (or show a short swatch table) from this list — see `workflows/PALETTE_REVIEW.md`.
2. Wait for **explicit confirmation** of preset (or custom hex) before locking `theme-tokens.json` or calling `theme.create`.
3. Generate:

```bash
node scripts/generate-theme-from-hex.mjs --preset ocean-depths --mode light -o theme-tokens.json
# or with explicit hex override:
node scripts/generate-theme-from-hex.mjs --preset tech-innovation #2563EB --mode dark -o theme-tokens.json
```

Machine-readable source: [`theme-presets.json`](theme-presets.json).

## Preset catalog

| id | Name | Mode bias | brandHex | heading / body | bestFor |
|----|------|-----------|----------|----------------|---------|
| `ocean-depths` | Ocean Depths | light | `#1A6B6B` | Inter / Inter | Finance, consulting, trust-building metric cards |
| `sunset-boulevard` | Sunset Boulevard | light | `#E85D04` | Inter / Inter | Launch, lifestyle, warm creator promos |
| `forest-canopy` | Forest Canopy | light | `#2D6A4F` | Georgia / Inter | Sustainability, outdoor, grounded reports |
| `modern-minimalist` | Modern Minimalist | light | `#475569` | Inter / Inter | Architecture, product UI shots, clean SaaS |
| `golden-hour` | Golden Hour | light | `#B45309` | Playfair Display / Source Sans 3 | Premium, autumnal, milestone celebrate |
| `arctic-frost` | Arctic Frost | light | `#0284C7` | Inter / Inter | Winter campaigns, crisp tech, health |
| `desert-rose` | Desert Rose | light | `#C45C6A` | Inter / Inter | Soft beauty, hospitality, gentle social proof |
| `tech-innovation` | Tech Innovation | dark | `#2563EB` | Inter / Inter | Startups, AI updates, product launches |
| `botanical-garden` | Botanical Garden | light | `#16A34A` | Inter / Inter | Growth metrics, wellness, organic brands |
| `midnight-galaxy` | Midnight Galaxy | dark | `#7C3AED` | Inter / Inter | Entertainment, gaming, bold night creatives |

## Field mapping to Gateway

After generation, `themeTokens` carries:

- `colors`: `canvas`, `text`, `accent`, `muted`, `primary`, `border`
- `fonts.heading` / `fonts.body` from the preset (override with `--heading` / `--body`)
- `palette` with full scale + contrast

Suggested Theme **name** for `theme.create`: the preset display `name` (e.g. `Ocean Depths`), not `Theme draft_xxx`.

## Custom themes

If no preset fits, invent a name + `brandHex` + fonts the same way, show the swatch/contrast summary, get confirmation, then generate and apply (`THEME_FROM_BRAND.md`).
