# Catalog / selection metadata (single-page template)

Metadata that makes a published page template **discoverable and choosable** when Content Skill builds a slideshow.  
Private AST/bindings stay server-side; this document is the **public selection contract** Agents must fill before Publish.

## Design choices (locked)

1. **One closed `pageRoles` set** (stored as `supportedRoles`) — a **retrieval tag for layout kind**, not page position and not a story recipe. `cover` means poster-like slots, not “must be page 1”. Do not add a parallel `arc` / `pageSequence` taxonomy.
2. **`platforms` is a multi-select array**. Include `generic` when the page fits any platform at that aspect.
3. **P0 fields are required to Publish.** P1 should be filled when known; P2 optional.
4. **Family `name` describes layout**, not a narrative beat. Prefer Poster / Stack / Count / Stair / Close (plus platform). Do not name families Cover / Point / Steps / Recap / CTA — choosers will glue those five names into one default pack.

Max **1–2** `supportedRoles` per page (primary + optional secondary).

---

## Closed enums

### Platforms (`platforms: Platform[]`)

```text
xiaohongshu | tiktok | instagram | threads | x | linkedin | wechat_cover | generic
```

Multi-select. Use `x` for X/Twitter. See **exact recommended pixels** in `references/PLATFORM_SPECS.md` before choosing `canvasPreset`.

### Canvas preset (`canvasPreset`)

```text
3:4 | 4:5 | 9:16 | 16:9 | 1:1 | 21:9 | custom
```

Always also store exact `canvas: { width, height }`. Use `16:9` for X **1200×675** in-stream; use `custom` for non-standard boards like link cards **1200×628**. Prefer the platform **Recommended** row in `PLATFORM_SPECS.md`.

### Page roles (`supportedRoles` / pageRoles) — pick 1–2

| Role | Layout kind (not sequence position) |
|---|---|
| `cover` | Poster / first-frame-capable layout — may open a run, need not |
| `hook` | Scroll-stop / short-copy layout |
| `setup` | Problem-framing layout |
| `context` | Background / context layout |
| `value` | Single takeaway layout |
| `point` | One sharp point (lighter than value) |
| `checklist` | Fixed N text lines (no list binding type) |
| `proof` | Proof / credibility layout |
| `evidence` | Evidence artifacts (data, case) |
| `compare` | Before/after or A/B layout — valid as page 1 |
| `screenshot` | App/web UI screenshot frame |
| `metric` | Big number / KPI — valid as page 1 |
| `quote` | Pull quote / testimonial — valid as page 1 |
| `steps` | Fixed-step howto layout |
| `cta` | Call to action layout |
| `follow` | Follow / profile CTA layout |
| `recap` | Summary / closing layout |

Legacy-compatible: `cover`, `setup`, `value`, `proof`, `cta` remain valid.

### Content family (`contentFamily`) — pick one

```text
narrative | utility | social_proof | conversion
```

### Content archetypes (`contentArchetypes`) — pick ≥1 from closed set

```text
product_review | tool_demo | tutorial | listicle
personal_story | opinion | news_explainer
lifestyle | travel | fitness | food_recipe
career | finance_lite | ai_update
launch | changelog | milestone_celebrate
ugc_repost | quote_card
```

### Density (`density`)

```text
low | medium | high
```

Align with `textDensityRange` when both are set (e.g. low → `[0, 0.34]`, medium → `[0.33, 0.67]`, high → `[0.66, 1]`).

### Visual style (`visualStyle`) — P1

```text
swiss | editorial | bold_promo | minimal | dark
```

### Image roles (`imageRoles`) — when any image slot exists

```text
hero | screenshot | avatar | product
```

---

## P0 — required before Publish / must appear on Catalog summary

| Field | Type | Notes |
|---|---|---|
| `name` | string | Public card title: what the layout is + style, then the ratio (e.g. `Five-Step How-To List — Quiet Ledger 9:16`). No internal prefixes (`P0`), no single platform name — the family spans platforms; the ratio suffix is stripped on cards. Keep equal to the page `name` |
| `shortDescription` | string | One sentence for chooser UI |
| `platforms` | `Platform[]` | Multi-select; use `generic` when truly cross-platform |
| `canvasPreset` | preset enum | Plus exact `canvas` pixels |
| `canvas` | `{ width, height }` | Exact board |
| `supportedRoles` | pageRole[1..2] | Closed set above |
| `contentFamily` | enum | Narrows before archetype |
| `contentArchetypes` | archetype[] | ≥1 from closed set |
| `density` | low/medium/high | |
| `textDensityRange` | `[number, number]` | Keep in sync with density |
| `requiresImage` | boolean | |
| `imageRoles` | imageRole[] | Required if `requiresImage` or any image slot |
| `mediaRequirements` | string[] | Normalized hints, e.g. `image`, `screenshot` |
| `slotSummary` | `{ text, number, image }` | Counts of slots by type |
| `fixedItemCount` | number? | Set for `checklist` / `steps` (absolute layout) |
| `previewImageUrl` | url? | Required when Gateway/Studio can supply; block Publish if product requires it |
| `tier` | `free` \| `paid` | From entitlement / owner; do not invent paid for free users |

### `slotSummary` example

```json
{ "text": 4, "number": 1, "image": 1 }
```

Derived from the slot table in `SLOTS.md`.

---

## P1 — fill when known (strongly recommended)

| Field | Type | Notes |
|---|---|---|
| `bestFor` | string[2..4] | “适合…” bullets for users |
| `notFor` | string[1..3] | Honest exclusions |
| `selectionHints` | string | Short Agent-only hint |
| `visualStyle` | enum | Look affinity |
| `locale` | `zh-CN` \| `en` \| `bilingual` | |
| `exampleFilledPreviewUrl` | url? | Filled sample beats empty shell |

Do **not** put Theme FKs (`defaultThemeId`, `compatibleThemeIds`) on published selection metadata (ADR-0033). Runtime look comes from Brand `themeSnapshot`.

---

## P2 — optional

| Field | Notes |
|---|---|
| `safeAreaProfile` | e.g. `xhs_default`, `ig_feed` |
| `featured` | Catalog boost |
| `colorDependency` | `theme_only` (preferred for new templates) \| `has_hardcoded_accents` |
| `tags` | Free-form search aides only — never replace closed enums |

---

## Agent selection order (for Content → slideshow)

Content Skill exports a template-neutral `ContentDocument` (slide roles + fields only).  
**Compose** (Template Skill / Desktop / render workflow) then selects pages:

```text
1. platforms ∩ aspect/canvasPreset
2. slide needs role ∈ supportedRoles
3. contentFamily / contentArchetypes match topic
4. requiresImage / imageRoles vs available assets
5. density + slotSummary (+ fixedItemCount) fit copy
6. Present 3–5 candidates: preview + name + shortDescription + bestFor
7. User confirms, or accept account/system default Look (Theme) separately
8. createRender with selected pageTemplateIds (never dump AST to the agent)
```

Example list call:

```bash
easysociable templates list --platforms x --roles metric --density low --limit 5 --json
# MCP: list_templates({ platforms:['xiaohongshu'], roles:['metric'], density:'low', limit:5 })
```

**Catalog rules**

- Only **published** pages with complete P0 `selection_metadata` appear in `list`.
- Do **not** list every PageTemplate AST. Explain choices with this public metadata only.
- Content Skill must not call Directus / TemplatePage; keep ADR-0019 surface split.

---

## Authoring checklist (before create / before Publish)

Agent must produce a `selection-metadata.json` (or equivalent fields on the draft) containing **all P0** keys. Confirm with the user when roles/platforms were inferred from a brief or reference image.

```json
{
  "name": "XHS Count 3:4",
  "shortDescription": "大数字涨粉庆祝页，可选头像",
  "platforms": ["xiaohongshu", "generic"],
  "canvasPreset": "3:4",
  "canvas": { "width": 1080, "height": 1440 },
  "supportedRoles": ["metric", "cover"],
  "contentFamily": "conversion",
  "contentArchetypes": ["milestone_celebrate", "launch"],
  "density": "low",
  "textDensityRange": [0, 0.34],
  "requiresImage": false,
  "imageRoles": ["avatar"],
  "mediaRequirements": [],
  "slotSummary": { "text": 2, "number": 1, "image": 1 },
  "fixedItemCount": null,
  "visualStyle": "swiss",
  "bestFor": ["涨粉节点", "数据庆祝封面"],
  "notFor": ["长清单干货", "多步教程"],
  "selectionHints": "Prefer when slotSummary has one number + short text (KPI / cost hook), any page index.",
  "locale": "zh-CN"
}
```

## Anti-patterns

- Tagging five roles on one page “just in case”
- Using only free-form `tags` instead of `supportedRoles` / archetypes
- Checklist without `fixedItemCount`
- `requiresImage: true` but `imageRoles` empty
- Platforms empty or inventing values outside the enum
- Naming a family Cover / Point / Steps / Recap / CTA so choosers assemble that sequence
- Treating `supportedRoles` as “this page must appear at this beat in every Run”
