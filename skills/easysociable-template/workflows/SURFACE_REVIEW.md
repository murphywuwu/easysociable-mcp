# Surface review (atmosphere layer)

Choose and confirm the canvas **surface** before authoring. Surface is independent of Theme semantic colors.

```text
Theme  = identity (solid semantic colors + fonts)
Surface = atmosphere (flat | gradient | image)
```

Aligned with ADR-0020 (photos) and ADR-0023 (icons): photo discovery may use host MCPs; icon discovery uses Gateway Icon Catalog; materialization only through Template Gateway.

## When to run

- After concept selection (`DESIGN_CONCEPTS.md`) and Theme lock (`PALETTE_REVIEW` / `THEME_FROM_BRAND`) when co-creating
- During `ASSET_PLAN.md` when the brief needs wash, photography backdrop, or icons
- Skip only when surface is clearly `flat` (typography-only / Theme.canvas) and no icons/photos are required

## Surface kinds

| `kind` | Discovery | After user confirms | Authoring result |
|---|---|---|---|
| `flat` | None | — | Theme.canvas only |
| `gradient` | Template MCP/CLI `gradients list\|search\|get` | Inline CSS decoration sibling (no `bindingKey`) | Atmosphere wash / band |
| `image` | Host **Pinterest / Unsplash / Pexels** MCP (not Template MCP) | Gateway draft image import → stable CDN `imageId` | Background usually `fixed` |
| (+ icons) | Template MCP/CLI `search_icons` / `get_icon` | Materialize `TemplateIconAsset` → inline `canonicalSvg` / `iconAssetId` (Theme via `currentColor`) | Icon chrome |

Photography for **slots** (avatar, hero well) also uses host image MCPs + Gateway import; ask `fixed` vs `slot_default` (surface background defaults to **`fixed`**).

## Steps

### 1. Decide kind

From brief + philosophy `color` / `rhythm` + selected concept:

- Sparse copy + atmospheric mood → prefer `gradient` or soft `image`
- Dense metrics / checklist → prefer `flat` or a thin gradient band (not full-bleed noisy photo)
- User asks for photo backdrop / Unsplash vibe → `image`
- User asks for gradient / wash → `gradient`
- Default when unsure → `flat`, then ask

Record intent in `design-plan.json` → `surfacePreview.kind` (may be unconfirmed).

### 2. Discover (bounded candidates only)

**Gradient**

```bash
easysociable templates gradients search --q "<mood>" --limit 8 --json
# or MCP: search_gradients / list_gradients
easysociable templates gradients get --id <id> --json   # only after shortlist interest
```

Show a **text table** (MVP: no thumbnails): name, stopSummary, tags, textSafeZone, bestFor.

**Image (surface or slot)**

1. Call host Unsplash / Pexels / Pinterest MCP with a short query.
2. Show ≤8 candidates (thumb + attribution if the host MCP returns them).
3. If the MCP is missing → degrade: say which provider is missing; offer `flat`, `gradient`, user upload, or skip. Do **not** invent URLs or proxy search through Template MCP.

**Icons (hard rule)**

```bash
easysociable icons search --query "<concept>" --limit 8 --json
# or MCP: search_icons
easysociable icons get --icon-id <iconId> --idempotency-key <key> --json   # only after user confirms
# or MCP: get_icon
```

**MUST path (every icon, including “just add an arrow”):**

1. Call Template `search_icons` / CLI `icons search` (Gateway Icon Catalog). Show ≤8 candidates with `iconId`, collection, style, license.
2. Wait for user choice — or explicit waive of choice: “你定 / 用第 N 个 / 随便好看一点的向右箭头”.  
   Unselected search hits produce **zero** `TemplateIconAsset` writes.
3. After confirm, call `get_icon` / CLI `icons get` with a **stable** `idempotencyKey`.  
   Embed returned **`canonicalSvg`** only; record **`iconAssetId`**, `iconId`, collection, license, contentHash on the decoration node (e.g. `data-icon-asset-id`, `data-icon-id`).
4. Color with Theme `currentColor` / `--es-*` on the wrapper; never bake Theme hex into the SVG paths.
5. If Gateway Icon Catalog / auth **fails** → say so → degrade to **omit** or temporary CSS/SVG shape **only after user agrees**.  
   Do **not** fall back to Better Icons MCP, client Iconify, or silent hand-drawn paths.

**Forbidden by default (not a shortcut):**

- Hand-writing SVG `<path d="…">` for arrows, chevrons, checks, social marks, “next page” cues, or any symbol the catalog can supply.
- Using emoji as a substitute for catalog icons.
- Skipping search because “it’s only a small arrow” or “faster to draw”.

**Allowed without catalog (not icons):** pure geometry with no symbol meaning — hairlines, solid rails, anonymous disc washes. If it **reads as a UI/icon glyph**, it is an icon → catalog path.

### 3. Confirm gate (required)

Do **not** mutate Draft / Authoring Source until the user:

- picks one candidate, or
- explicitly waives (“flat 就行 / 你定 / 不要背景”)

Unselected candidates produce **zero** EasySociable writes (no R2, no Directus Image, no decoration node, no gradient get baked into draft).

### 4. Materialize (Gateway / Authoring only)

| Kind | Materialize |
|---|---|
| `flat` | Nothing extra |
| `gradient` | `gradients get` → write absolute background decoration with `style.backgroundImage = <css>`; record `recipeId`, provider, license in `surfacePreview` / node comment |
| `image` | Import via Template Gateway draft images (when available) or document the import step for TMP-024; Authoring references **CDN / imageId only** — never third-party temp URLs. Mode: surface background → `fixed`; slot → ask `fixed` \| `slot_default` |
| icon | Inline sanitized SVG as decoration sibling; record `iconAssetId`, provider, collection, license, contentHash |

Prefer band or panel geometry over full-bleed when copy is dense. Keep Theme.canvas as a safe solid under translucent washes when needed (`textSafeZone` / `needs_scrim`).

### 5. Record in `design-plan.json`

```json
"surfacePreview": {
  "kind": "gradient",
  "userConfirmed": true,
  "recipeId": "grad_001_warm-flame",
  "name": "Warm Flame",
  "provider": "webgradients",
  "textSafeZone": "light_end",
  "contrastAnchor": "#FAD0C4",
  "placement": "full_bleed",
  "notes": "Dark type on light end"
}
```

For image:

```json
"surfacePreview": {
  "kind": "image",
  "userConfirmed": true,
  "imageMode": "fixed",
  "imageId": "img_…",
  "provider": "unsplash",
  "query": "soft paper texture",
  "rightsState": "licensed_for_publish",
  "placement": "full_bleed"
}
```

For flat: `{ "kind": "flat", "userConfirmed": true }`.

Also mirror assets in `assetPlan` with sources `gradient_catalog` | `external_photo` | `template_icon_catalog` when used.

### 6. Validate

```bash
node scripts/validate-design-v2.mjs design-plan.json
```

If `surfacePreview.kind` is `gradient` or `image`, `userConfirmed` must be `true` and required ids must be present before authoring.

## Fixture paths (Skill smoke)

| Path | Expectation |
|---|---|
| flat | No host MCP; no gradients get into draft |
| gradient | Template `gradients.*` only; confirmation → CSS decoration |
| image | Host image MCP → confirm → CDN/`imageId`; no temp URL in source |
| icon | `search_icons` → confirm → `get_icon` → inline canonical SVG / `iconAssetId` |
| none / waive | Explicit waive; remain flat |

## Do not

- Proxy Unsplash / Pexels / Pinterest **search** through Template MCP/CLI
- Require Better Icons MCP, client Iconify credentials, or runtime Provider fetches for icons
- **Hand-draw icon paths when Icon Catalog search works** (arrows, chevrons, checks, …)
- Put third-party temporary URLs or local paths into Authoring Source / Publish
- Call `theme.create` with gradient CSS (Theme stays solid semantics)
- Stack a second rainbow signature when a full-bleed gradient is already the signature
- Treat unselected search hits as EasySociable assets
- Require `easysociable-media` Skill/CLI/MCP

## Agent self-check before Save handoff (icons)

- [ ] Every symbol-like decoration has `iconAssetId` / came from `get_icon`
- [ ] No hand-authored icon `<path>` when catalog was available
- [ ] User confirmed pick (or explicit “你定 / 第 N 个”) before `get_icon`
- [ ] Icon color uses `currentColor` / `--es-*` (dark/light safe)
