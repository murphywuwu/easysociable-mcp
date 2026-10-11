# Authoring Studio (create → edit → Save → Agent publish)

Primary interactive path for **single-page** template drafts. Create the draft, run screenshot-based Visual QA, then hand off the reviewed draft. Do **not** create a Hosted Preview Job merely to show the user a URL.

Studio has **Save only** (no Publish button). Publishing is an Agent step after the user saves and asks to publish — see `PUBLISH_FROM_DRAFT.md`.

## Preconditions

Complete intake first:

- `AUTHORING_FROM_BRIEF.md` or `AUTHORING_FROM_IMAGE.md`
- Selected concept + Asset Plan in a valid `design-plan.json`
- Slot table + `authoringSource` + Theme decision ready
- `authoringSource` passes `scripts/validate-authoring-source.mjs`
- Optional draft-stage `selectionMetadata` (P0 can be completed at publish time)
- References: `SLOTS.md`, `AUTHORING_SOURCE.md`, `THEME_TOKENS.md`, `CATALOG_METADATA.md`

## Layout Family (multi-platform)

New drafts create a **Layout Family** (`familyId`) plus a master canvas page.
**Default create path:** after the master draft exists, follow `MULTI_PLATFORM_FAMILY.md` (derive + hand-tune variants) before handoff unless the user asked for one platform only.

- Authoring URL: `/authoring/{draftId}?platform=…`. Top bar **platform chips** switch variants (do not resize one AST).
- Preview skin = Family `preview_tokens` from `theme.create`; fill/render uses Brand snapshot first (ADR-0033).
- Legacy drafts without `familyId` auto-wrap on `getDraft` / `listDrafts`. Bulk: `easysociable templates families migrate-legacy --json`.

## Flow

1. Run the required local preflights (resolve scripts relative to this Skill directory):

```bash
node scripts/validate-design-v2.mjs ./design-plan.json
node scripts/validate-authoring-source.mjs ./authoring-source.json
```

Do not create or update a draft when this command fails.

2. Create the remote draft:

```bash
easysociable templates create-draft --file ./draft.json --json
```

The JSON file contains the public `name`, `source`, `authoringSource`, optional
`selectionMetadata`, and optional `theme`/`themeId` fields. Do not pass private
AST or Binding Maps.

3. Read `data.id` / `data.templateId` / `data.familyId` / `data.authoringStudioUrl` (and `data.variants` when present).

4. **Multi-platform (default):** run `workflows/MULTI_PLATFORM_FAMILY.md` — derive target presets, hand-tune each variant, QA each canvas. Skip only when the user asked for a single platform.

5. **Before handoff, run `workflows/VISUAL_QA.md`** on the master (and each variant from step 4). Open the actual Studio render; inspect screenshots, not only source. When a draft fails, fix authoring JSON, validate, update that page id, and re-render:

```bash
node scripts/validate-authoring-source.mjs ./authoring-source.json
easysociable templates update-draft --id <id> --file ./draft-patch.json --json
```

Stop after two automatic revisions per page unless the user explicitly requests more. Validate the passing QA artifact:

```bash
node scripts/validate-design-v2.mjs ./visual-qa.json
```

6. **Required user handoff message** (paste only after QA — customize URLs):

```text
已创建多平台模板 Family（master + 变体）。请打开 Authoring Studio：
{authoringStudioUrl}

顶栏平台芯片可切换画布（如小红书 3:4 / IG·Threads 4:5 / TikTok 9:16 / LinkedIn 1:1）。
可直接改当前变体的布局、文案和 Theme。满意后点 Save（页面上没有 Publish）。
保存完成后回复我「publish」或「发布该模板」，我会补齐选型元数据并发布。
```

English equivalent when the session is EN:

```text
Multi-platform template Family created (master + variants). Open Authoring Studio:
{authoringStudioUrl}

Use the top-bar platform chips to switch canvases (e.g. XHS 3:4 / IG·Threads 4:5 / TikTok 9:16 / LinkedIn 1:1).
Edit the active variant’s layout, copy, and Theme. When satisfied, click Save (no Publish button).
Then reply “publish” and I will complete catalog metadata and publish.
```

7. User previews/edits in the **slim** Authoring Studio:
   - Canvas + right property panel
   - Left: Theme / preview tokens + optional Catalog hints
   - Top bar: **platform chips**, **Save**, **Fork**. Final PNG rendering is delegated to the unified CLI/MCP after the user confirms the saved draft.
   - **No** Publish button; **No** left SidebarMenu (no AI / select-template / typeset rail)

8. When the user says publish → run `workflows/PUBLISH_FROM_DRAFT.md`.

## SDK shape

```ts
const draft = await client.createDraft({
  name: 'Dark CTA Poster',
  source: { kind: 'text_brief', brief: '1080x1350 KPI milestone card' },
  authoringSource: {
    canvas: { width: 1080, height: 1350 },
    json: { /* Studio projection; fillable nodes carry bindingKey e.g. text_0 */ },
  },
  theme: {
    create: {
      name: 'Dark CTA',
      tokens: {
        colors: { canvas: '#0f1419', text: '#e8eef5', accent: '#5b8cff', muted: '#8b9bb0' },
        fonts: { heading: 'Inter', body: 'Inter' },
        surfaces: { radius: '12px', shadow: '0 8px 24px rgba(0,0,0,.35)' },
      },
    },
  },
})
// Always send the handoff message with draft.authoringStudioUrl
```

## Rules

- Agent vision/LLM understanding stays local; Gateway stores/compiles `authoringSource` and Theme.
- Single-page only — never create Carousel packs via this skill.
- Phase 1: new templates consume Theme via `--es-*` variables.
- Exact geometry and critical typography use inline styles; runtime arbitrary-value Tailwind classes are forbidden.
- CLI/MCP must not start Local Runtime or import `template-renderer-react`.
- There is no separate `easysociable-template preview` command in V1; Authoring
  Studio is the visual QA surface.
- Never claim Visual QA passed without inspectable screenshot evidence. If no visual surface is available, disclose that QA was skipped and ask the user to review in Studio.
- Do not hand off a draft with hard visual failures or a score below 80/100 unless the user explicitly accepts it.
- The only V1 authoring surface is `/authoring/{draftId}`; the retired full
  product editor and Carousel routes are not public entry points.
- Do not instruct the user to Publish in Studio — instruct **Save**, then Agent publish.
- Remind user: empty optional slots omit nodes at render; absolute layout does not reflow.
- Flat canvas tree: no absolute-inside-absolute wrappers (validator enforces); visual cards = decoration sibling + content siblings.
- **Icons:** when adding/changing arrows, chevrons, checks, or any glyph, follow `SURFACE_REVIEW.md` § Icons (`search_icons` → confirm → `get_icon`). Do not hand-draw icon paths while the Icon Catalog works. Fillable text uses **`data-variable`**, not inventing bindings only in private AST.
