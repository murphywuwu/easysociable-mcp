# Multi-platform Layout Family (default create path)

**SoT for creating templates that ship on several platforms at once.**  
One user-facing **Layout Family**; one **master** canvas page; additional **variant** pages per aspect preset. Studio switches variants with platform chips — it does not resize one AST (ADR-0033).

Single-page ≠ single-platform. Still never create slideshow/carousel packs (`OUT_OF_SCOPE.md`).

## Default when the user asks to create a template

Unless they explicitly want **one platform only**:

1. Lock a **master** platform + recommended canvas (`PLATFORM_SPECS.md`).
2. Create the master draft (Family is created with it).
3. **Derive** missing vertical presets for the family.
4. **Hand-tune** each variant’s absolute layout (do not ship raw derive output for dense pages).
5. Visual-QA master + each variant, then hand off Studio with chip switching.

### Default vertical bucket (most social covers)

| Role | Preset | Pixels | Platforms on that variant |
|---|---|---|---|
| Master (typical) | `3:4` | 1080×1440 | `xiaohongshu` |
| Variant | `4:5` | 1080×1350 | `instagram` + `threads` (shared tree) |
| Variant | `9:16` | 1080×1920 | `tiktok` |
| Variant | `1:1` | 1080×1080 | `linkedin` |

If the user’s primary platform is already `4:5` / `9:16` / `1:1`, that page is master; derive the other presets in the bucket (see Gateway `defaultDerivePolicyForPreset`).

Skip or trim targets only when the user names a subset (“只要 IG 和 LinkedIn”).

## CLI

```bash
# After create-draft, read familyId from the draft view (or families list)
easysociable templates families get --id <familyId> --json

# Create missing presets (idempotent; use --presets to limit)
easysociable templates families derive --id <familyId> --presets 4:5,9:16,1:1 --json

# Hand-tuned layout per variant pageId
easysociable templates update-draft --id <variantPageId> --file ./variant-4x5.patch.json --json
```

Gateway equivalents: `GET/POST /v1/template-families/:id`, `POST /v1/template-families/:id/derive`.

If CLI `--json` fails Zod on new family fields (`familyId`, `variants`, …) but HTTP succeeded, re-fetch with `families get` / `list-drafts` or raw Gateway — do not assume create/derive failed.

## Hand-tune rules (required after derive)

`derive` applies pin `v1_vertical` (scale + bottom/center corrections). That is a **starting point**, not shippable layout for dense covers.

For **each** variant page:

1. Keep the **same slots / copy / icons** as master (same `data-variable` keys).
2. Rebuild absolute geometry for the target `canvas` (`width`/`height` + root Graphic size must match preset pixels).
3. Distribute vertical rhythm across the full board: even section gaps; **no** packed header + empty foot.
4. TikTok `9:16`: keep critical UI out of bottom ~120–160px chrome.
5. JSX styles must be `style={{ ... }}` (double braces). Python f-strings turn `{{` into `{` — validate with Babel/`validate-authoring-source.mjs` before update.
6. Per-variant `selectionMetadata.platforms` / `canvasPreset` / `canvas` must match that page only (IG+Threads both listed on the `4:5` page).
7. Theme/preview tokens stay on the **Family** (`preview_tokens` via `theme.create` on draft) — not a TemplateTheme row (`THEME_TOKENS.md`, ADR-0033).

```bash
node scripts/validate-authoring-source.mjs ./variant-4x5.authoring.json
easysociable templates update-draft --id <variantPageId> --file ./variant-4x5.patch.json --json
```

## Visual QA

Run `VISUAL_QA.md` on the **master** and **each derived preset** (screenshot Studio at that draft URL / platform chip). Fail if any variant has clipped content, overlapping bands, or large empty voids with cramped clusters.

## Handoff

After QA, open the **master** Studio URL and tell the user they can switch platforms with the top-bar chips (each chip is a real canvas variant). Save still applies to the active variant; Agent publish remains post-Save (`PUBLISH_FROM_DRAFT.md`). Include every variant `pageId` + preset in the handoff notes.

## Do not

- Author one AST and claim it fits 3:4 + 9:16 + 1:1
- Leave dense pages on raw derive output
- Put Instagram and Threads on different presets when both are 4:5
- Create a second Family for the same template identity
- Treat multi-platform variants as a slideshow / carousel pack
