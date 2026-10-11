# Author from text brief

Primary intake when the user describes a single-page template in words (no reference image, or image is secondary).

## Goal

One publishable **single-page** template **Family** (master canvas + multi-platform variants by default): Design Brief → Design Philosophy → 2–3 Concepts → Asset Plan → Theme lock → master layout → Authoring Studio → `MULTI_PLATFORM_FAMILY.md`.

## Steps

1. Confirm this is **one page**, not a slideshow. If they want a multi-slide deck, stop and hand off (`OUT_OF_SCOPE.md`). Multi-platform variants of the same page are expected — that is not a slideshow.
2. Read `references/PLATFORM_SPECS.md`. Lock **master** platform + recommended canvas, and the default vertical derive targets unless the user limited platforms (`MULTI_PLATFORM_FAMILY.md`).
3. **Mandatory — V2.1 design plan first** (no reference image):
   - Follow `workflows/DESIGN_BRIEF.md`
   - Follow `workflows/DESIGN_PHILOSOPHY.md`; lock shared `philosophy` (+ companion `design-philosophy.md`)
   - Follow `workflows/DESIGN_CONCEPTS.md`; create 2–3 spatial expressions of that philosophy and select one (`philosophyExpression` on each)
   - Follow `workflows/ASSET_PLAN.md`; give every planned visual asset a role and source
   - Follow `workflows/SURFACE_REVIEW.md` when atmosphere, photography, or icons are needed (`flat` | `gradient` | `image`)
   - Follow `workflows/PALETTE_REVIEW.md` and `workflows/THEME_FROM_BRAND.md` when co-creating Theme (no `themeId`)
   - Write and validate `design-plan.json` and `theme-tokens.json` using `scripts/validate-design-v2.mjs`
   - Do not build `authoringSource` before philosophy, concept selection, theme lock, surface confirmation (when applicable), and design-plan validation
4. After design-plan acceptance, build:
   - `selection-metadata.json` with all P0 fields (+ P1 when known) — `references/CATALOG_METADATA.md`
   - Slot table per `references/SLOTS.md` (no `list`; checklists = multiple `text_n` + `fixedItemCount`)
   - Flat absolutely positioned nodes (canvas siblings only; no absolute-inside-absolute wrappers); bind fillable text/number with **`data-variable`** (Studio/Gateway compile); images use `data-image-mode` + binding per image docs
   - Inline `style={{...}}` for exact geometry and critical typography; no Tailwind arbitrary-value layout classes
   - Surface: gradient → unbound CSS decoration sibling; image → CDN/`imageId` background (`fixed` default)
   - **Icons:** only Gateway `search_icons` → confirm → `get_icon` → `canonicalSvg` + `iconAssetId` (`SURFACE_REVIEW.md`). Never hand-draw icon paths when catalog works.
   - Other decorations as CSS geometry (rails, hairlines, discs) that obey `philosophy.rhythm` — not new illustrations or fake icons by default
   - `authoringSource` per `references/AUTHORING_SOURCE.md` (flat tree + text-nesting exception)
   - Theme per `references/THEME_TOKENS.md` — use `themeTokens` from validated `theme-tokens.json` for `theme.create`
5. Run `scripts/validate-authoring-source.mjs <authoring-source.json>` and fix every error.
6. Continue with `workflows/AUTHORING_STUDIO.md` (`source.kind = text_brief`) → **`MULTI_PLATFORM_FAMILY.md`** (derive + hand-tune + QA each variant) before handoff.

## Checklist pages

- Prefer a **fixed** number of required text slots matching the design brief.
- Do not promise automatic packing when some lines are empty (absolute layout).
- Optional text lines are allowed but omitting them leaves gaps.

## Do not

- Create multi-page packs
- Invent `list` / bullets array bindings
- Skip Design Brief, Philosophy, Concepts, or Asset Plan when there is no reference image
- Produce concepts that differ only by color or ignore the shared philosophy
- Generate a whole flattened poster instead of editable text/image/layout nodes
- Pick a non-recommended canvas without telling the user why
- Use `left-[...]`, `top-[...]`, `w-[...]`, `text-[...]`, or other arbitrary-value classes for critical runtime layout
- Nest absolutely positioned nodes inside cards/groups (`profile-card` wrapping avatar + name, etc.)
- Auto-publish without user Save + explicit “publish” request (`PUBLISH_FROM_DRAFT.md`)
- Hand-draw SVG icon paths (arrows, chevrons, checks, next cues, …) when Icon Catalog search works — use `search_icons` → confirm → `get_icon`
