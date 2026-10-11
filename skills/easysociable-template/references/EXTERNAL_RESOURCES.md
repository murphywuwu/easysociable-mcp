# External resources & Surface routing

Template Skill **orchestrates** discovery; EasySociable **owns** materialization.

## Boundary

| Phase | Who | Tools |
|---|---|---|
| Discover photos | Host Agent MCPs | Pinterest, Unsplash, Pexels |
| Discover icons | Template product | MCP/CLI `search_icons` / `get_icon` → Gateway Icon Catalog (ADR-0023) |
| Discover gradients | Template product | MCP/CLI `gradients list\|search\|get` → Gateway |
| Materialize | Template Gateway only | Image import (R2 + Directus `Image`), icon materialize (`TemplateIconAsset`), inline gradient CSS, Draft update, Preview, Publish |

Template MCP/CLI must **not** expose Unsplash/Pexels/Pinterest search tools. Icons are **not** discovered via Better Icons MCP — use the internal catalog only.

## Decision order

```text
user_upload / brand_kit
→ Design Primitive / CSS-SVG
→ gradients (Gateway catalog)
→ search_icons / get_icon (Gateway Icon Catalog)
→ Pinterest / Unsplash / Pexels (host MCP)
→ generated topic image (last resort)
→ omit
```

## Degradation

| Missing | Agent behavior |
|---|---|
| Unsplash/Pexels/Pinterest MCP | Say so; offer flat / gradient / user upload; continue without photo |
| Icon Catalog / Gateway auth | Return Gateway error (`ICON_*` / `TEMPLATE_API_KEY_REQUIRED`); offer CSS/SVG mark or omit icon — do **not** install or call Better Icons |
| Gradients API / auth | Fall back to `flat` or simple CSS two-stop only if user supplies hexes; do not scrape WebGradients at runtime |
| Draft image import unavailable | Keep confirmed photo out of Publish path; do not embed temp URLs; ask user to upload in Studio |

## Rights

- Record provider, source URL, creator, query, license/Attribution, rights state when importing images.
- Pinterest often starts `reference_only` / needs explicit publish-rights confirmation.
- Unsplash/Pexels follow provider license + Attribution rules.
- Gradients: record `provider` + `license` from catalog detail; inline CSS only.
- Icons: use `iconAssetId` + provenance from `get_icon`; Theme colors via `currentColor` / `--es-*` — never bake Theme hex into canonical SVG.
- Publish must reject unresolved rights (product gate); Skill must not pretend rights are cleared.

## Modes

- Surface background image → default **`fixed`**
- Slot image → ask **`fixed`** or **`slot_default`**
- Rights state is orthogonal to mode

See `workflows/SURFACE_REVIEW.md` for the confirmation loop.
