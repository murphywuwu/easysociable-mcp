---
name: easysociable-template
description: >
  Create single-page social image templates for EasySociable via the unified
  Template MCP or `easysociable` CLI. Default create path is a Layout Family:
  one master canvas plus derived multi-platform variants (e.g. XHS 3:4, IG/Threads 4:5,
  TikTok 9:16, LinkedIn 1:1) with hand-tuned layouts per preset. Use when the user wants
  to author a page template from a reference image or text brief, write a shared visual
  design philosophy, explore layout concepts, co-create Theme/preview tokens, pull icons
  via search_icons/get_icon, open Authoring Studio, or publish. Do not use for
  fill-slots hosted PNG jobs (`create_render_job` is retired), multi-slide slideshow
  composition, ContentDocument as render input, or carousel packs. Customer PNG packs
  come from Slideshow Studio Download.
---

# EasySociable Template Skill

The public entry points are the unified `easysociable` CLI and one unified MCP
server. Do not install or invoke `easysociable-template`, `easysociable-slideshow`,
`easysociable-content`, or a separate Content/Slideshow MCP in V1.

**This skill owns template authoring:**

1. **Author** templates as a **Layout Family** (master + multi-platform variants) → Studio + Publish (`workflows/MULTI_PLATFORM_FAMILY.md`).
2. Fill-slots Hosted Render (`create_render_job`) is **retired** as a paid delivery path. Customer PNG packs come from Slideshow Studio Download.

It is a template factory. It is **not** a multi-slide slideshow compositor and it is **not** a PNG API.

Every published page must carry **P0 catalog metadata** so Agents can filter and fill templates (`references/CATALOG_METADATA.md`).

Out of scope (hand off):

- Generating爆款 copy / Working Draft as a **Content** product (Content Skill)
- Multi-slide slideshow composition / Slideshow Run → **easysociable-slideshow**
- Local Runtime, SQLite, Content Version library
- Using `ContentDocument` / `contentDocumentHash` as Template render input

## Rules

1. Prefer the unified EasySociable MCP. Fall back only to the unified `easysociable` CLI.
2. Submit only public Gateway DTOs. Never invent or request private Safe AST / Binding Map / RenderPlan.
3. Do not start Local Runtime, read content library SQLite, or call Content MCP/CLI for Template work.
4. Catalog and create targets are **single-page** only. Never treat site Carousel packs as Agent templates.
5. After `create` / `createDraft`, the primary authoring path is `authoringStudioUrl` (`/authoring/{draftId}`). **Default:** run `workflows/MULTI_PLATFORM_FAMILY.md` (derive + hand-tune variants) before handoff unless the user asked for one platform only. Always send the handoff in `AUTHORING_STUDIO.md` (edit → **Save** → tell Agent to publish). Do not require a Hosted Preview Job for interactive authoring.
6. Studio has **Save only** — no Publish button. Publish only after the user saves and **explicitly** asks to publish; then run `workflows/PUBLISH_FROM_DRAFT.md`.
7. **Do not Publish without complete P0 selection metadata** (`CATALOG_METADATA.md`). Gateway enforces this. Each family variant carries its own `platforms` / `canvasPreset` / `canvas`.
8. Theme/preview: co-create `ThemeTokens` on draft create (`theme.create`) → Family `preview_tokens` (ADR-0033). No authoring TemplateTheme row. Colors/fonts via semantic `--es-*` on page nodes.
9. Layout model is **absolute positioning** on a **flat canvas tree** (see prior authoring rules / `AUTHORING_SOURCE.md`).
10. **Runtime layout CSS:** put exact geometry in JSX inline `style={{...}}`. Never depend on Tailwind arbitrary-value classes for geometry.
11. Run `scripts/validate-authoring-source.mjs` before every create/update.
12. `supportedRoles` uses closed **pageRoles** as a **weak retrieval tag**, not sequence position. Family `name` describes **layout** (Poster / Stack / Count / Stair / Close), not a narrative beat. `platforms` is a multi-select array.
13. Canvas sizes must follow `references/PLATFORM_SPECS.md`.
14. **Text-only V2.1 authoring:** `DESIGN_BRIEF` → Philosophy → Concepts → assets/surface → author → Visual QA.
15. **Visual QA** before Studio handoff when authoring. For `image_reference`, QA **must** side-by-side compare Studio canvas to the reference (`VISUAL_QA.md` § Reference compare).
16. Prefer **reusable/brand assets**, Gateway gradient recipes, and catalog icons for deterministic visuals. Geometric chrome (hairlines, rails, discs) may use plain CSS shapes — **not** as a substitute for named icons **or** for pictorial regions on a reference-image rebuild.
16b. **Reference image → template (hard):** follow `workflows/AUTHORING_FROM_IMAGE.md` as SoT. **Read the reference with a vision tool**, write `referenceSpec` + `referenceImageInventory` into `design-plan.json`, and place pictorial regions as **`image` slots** (empty frames matching the boxes). `validate-design-v2.mjs` rejects `image_reference` plans missing those fields or using `css_svg` stand-ins for inventoried pictures. Do not mood-board a different layout.
17. Preserve `draftId`, `templateId`, `themeId`, `jobId`, `authoringStudioUrl`, and `previewUrl` across steps.
18. **Theme / Surface confirmation gates** unchanged for authoring (see `PALETTE_REVIEW`, `SURFACE_REVIEW`).
19. **Consumption is Slideshow Studio Download**, not fill-slots Hosted Render. `create_render_job` / CLI `renders create` return `HEADLESS_RENDER_DISABLED`. See `workflows/FILL_AND_RENDER.md`.
20. **Do not** treat Hosted Capture or local html-to-image as the Agent primary PNG path.
21. **Icons (hard rule — no shortcuts):**
    - Any **recognizable icon** (arrows, chevrons, checkmarks, social glyphs, UI symbols, “next page” cues, etc.) **MUST** use Gateway Icon Catalog:
      `search_icons` / CLI `icons search` → show ≤8 candidates → **user confirm** (or explicit “你定 / 用第 N 个”) → `get_icon` / CLI `icons get --idempotency-key …` → embed returned **`canonicalSvg`** and record **`iconAssetId`** / `iconId` on the decoration node.
    - **Forbidden by default:** hand-authored SVG `<path>` icons, emoji-as-icon, Iconify/Better Icons MCP, inventing icon markup “because it’s faster”.
    - **Not icons (CSS chrome OK without catalog):** pure geometry with no symbol meaning — e.g. solid rectangle rail, hairline rule, plain circle blob used only as wash.
    - **Degrade only if** search/get fails or catalog unavailable: say so, then offer omit **or** temporary CSS/SVG shape **after user agrees**. Never silently hand-draw when catalog works.
    - Color with `currentColor` / `--es-*`; never bake brand hex into the SVG. Full procedure: `workflows/SURFACE_REVIEW.md` § Icons.

## Bootstrap

```bash
easysociable auth status --json
```

## Intent routing

| User intent | Workflow |
|---|---|
| Text description → template (incl. multi-platform) | `DESIGN_BRIEF.md` → … → `AUTHORING_STUDIO.md` → **`MULTI_PLATFORM_FAMILY.md`** (derive + hand-tune) |
| Reference image → template | `AUTHORING_FROM_IMAGE.md` → … → `AUTHORING_STUDIO.md` → **`MULTI_PLATFORM_FAMILY.md`** + reference-compare QA on master |
| “只要某一个平台” | Same authoring path; skip derive / only named presets in `MULTI_PLATFORM_FAMILY.md` |
| Need gradient / photo surface / icons only | `SURFACE_REVIEW.md` |
| **Add / change an icon** (arrow, chevron, check, …) | **MUST** `SURFACE_REVIEW.md` § Icons — search → confirm → get_icon. **Do not** hand-draw SVG paths. |
| Already have authoring payload / continue Studio | `workflows/AUTHORING_STUDIO.md` (+ family derive if variants still missing) |
| User says publish / 发布该模板 (after Save) | `workflows/PUBLISH_FROM_DRAFT.md` |
| Browse published single-page templates | `list` / `get_template` + public metadata |
| **Fill a published template → PNG/JPEG** | `workflows/FILL_AND_RENDER.md` |
| 「做一套多页 slideshow / deck / carousel 出图」 | **Stop multi-slide composition** → **easysociable-slideshow**. Per-page fill-slots render still uses this skill’s `FILL_AND_RENDER` when orchestrated by slideshow. |

## Core model

- `workflows/MULTI_PLATFORM_FAMILY.md` — **default** multi-platform create (Family + derive + hand-tune)
- `references/PLATFORM_SPECS.md`
- `references/CATALOG_METADATA.md`
- `references/SLOTS.md` — public slot contract for fill-slots render
- `references/AUTHORING_SOURCE.md`
- `references/THEME_TOKENS.md` — Family `preview_tokens` (no TemplateTheme)
- `references/EXTERNAL_RESOURCES.md`
- `references/GATEWAY.md` — CLI / MCP including families derive + `render`
- `workflows/FILL_AND_RENDER.md` — get_template → slots → Hosted Render
- Authoring V2.1 workflows + validators as before

## MCP

See `workflows/MCP_FIRST.md`.
