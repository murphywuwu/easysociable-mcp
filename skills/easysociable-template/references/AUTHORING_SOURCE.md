# Authoring source (Agent → Gateway)

The Agent produces a public **single-page** `authoringSource`. The server compiles it into private Safe AST / bindings. Clients never receive Binding Map or private AST.

## Required payload shape

```ts
type AuthoringSource = {
  canvas: { width: number, height: number }  // e.g. 1080×1350, 1080×1440
  json: unknown  // Studio projection (nodes / snapshot-like structure)
  // optional: data, style, font — only if Gateway/Studio expect them
}
```

Provenance on create:

```ts
source: {
  kind: 'image_reference' | 'text_brief' | 'manual' | 'import'
  brief?: string
}
```

## What the Agent must decide before `create`

1. **Canvas** — width / height + `canvasPreset` from `PLATFORM_SPECS.md` Recommended row + `CATALOG_METADATA.md`.
2. **Selection metadata (P0)** — platforms, supportedRoles (pageRoles), contentFamily, contentArchetypes, density, media/slotSummary, shortDescription — see `CATALOG_METADATA.md`. Write `selection-metadata.json` alongside the authoring source.
3. **Slot table** — see `SLOTS.md` (`text` / `number` / `image` only; no `list`). Derive `slotSummary` (+ `fixedItemCount` for checklist/steps).
4. **Node layout** — flat absolute positions on the canvas; each fillable node has `bindingKey` = slot key.
5. **Decoration** — nodes without `bindingKey` (including visual card backgrounds as **siblings**, not parents).
6. **Theme** — reuse `themeId` or full `ThemeTokens` create (`THEME_TOKENS.md`).
7. **Placeholders** — sample strings/images for Studio preview only.

## Layout model

- Nodes are **absolutely positioned** (independent frames) under the canvas frame (`data-type="post"` / Graphic).
- **Flat tree rule:** every layout node is a **direct child of the canvas frame**, with coordinates relative to the **canvas**, not to another box.
- **Forbidden:** nesting `position: 'absolute'` inside another `position: 'absolute'` (e.g. `profile-card` wrapping avatar + name + handle). Studio select/drag writes canvas coordinates; nested frames cause elements to jump or move as a group unintentionally.
- **Allowed text nesting:** a text host (`h1`–`h6`, `p`, `span`, or one absolute text unit) may contain **non-positioned** inline children (emphasis marks, split currency + number spans). Those children must **not** set `position: 'absolute'`.
- **Visual “card” pattern:** draw the card panel as its own absolute **decoration** sibling; place `img` / name / handle as separate absolute siblings using canvas coordinates (convert any local offsets: `canvasLeft = cardLeft + localLeft`).
- Do not assume flex/flow reflow when a node is omitted.
- Empty optional slots → omit node at render (see `SLOTS.md`).

Bad — layout group wrapper (absolute inside absolute):

```jsx
<div
  style={{ position: 'absolute', right: 56, top: 62, width: 270, height: 214 /* card */ }}
  data-type="profile-card"
>
  <img style={{ position: 'absolute', left: 24, top: 24, width: 76, height: 76 }} /* nested */ />
  <div style={{ position: 'absolute', left: 24, top: 122 }}>Alex Chen</div>
</div>
```

Good — flat siblings (card chrome + content share the canvas):

```jsx
<div
  style={{ position: 'absolute', left: 874, top: 62, width: 270, height: 214 /* panel only */ }}
  data-type="decoration"
/>
<img
  style={{ position: 'absolute', left: 898, top: 86, width: 76, height: 76 }}
  data-type="image"
/>
<div style={{ position: 'absolute', left: 898, top: 184, width: 220 }} data-type="title">
  Alex Chen
</div>
```

## Studio runtime CSS contract

Authoring Studio loads `authoringSource.json` **at runtime**. Tailwind only emits CSS for classes found during the Studio build, so remote arbitrary-value utilities have no guaranteed CSS.

For every value that controls composition, use JSX inline styles:

- Geometry: `position`, `left`, `right`, `top`, `bottom`, `width`, `height`
- Critical type: `fontSize`, `lineHeight`, `letterSpacing`, `fontWeight`
- Runtime Theme values: `var(--es-color-*)`, `var(--es-font-*)`, `var(--es-surface-*)`

Bad — class names exist in the DOM but their CSS may not:

```jsx
<h1 className="absolute left-[56px] top-[120px] w-[720px] text-[42px]">
  Revenue
</h1>
```

Good — deterministic after runtime loading:

```jsx
<h1
  style={{
    position: 'absolute',
    left: 56,
    top: 120,
    width: 720,
    fontSize: 42,
    color: 'var(--es-color-text,#F7F9F9)',
    fontFamily: 'var(--es-font-heading,Inter)',
  }}
>
  Revenue
</h1>
```

Use `className` only for non-critical static utilities known to exist in the Studio bundle. Never use Tailwind arbitrary-value tokens (`...-[...]`) for authoring geometry, typography, or Theme colors.

Before create/update, run the bundled validator relative to this Skill directory:

```bash
node scripts/validate-authoring-source.mjs ./authoring-source.json
```

Treat any validator error as blocking.

## Forbidden in Agent output

- Private Safe AST as if it were the public contract
- `bindingMap` / full bindings objects in Gateway requests
- Multi-page / carousel pack structures
- Claiming pixel-perfect recreation of a competitor poster without Studio review
- Critical runtime layout expressed with Tailwind arbitrary-value classes

## Hand-off

After create, open `authoringStudioUrl` and send the handoff message in `AUTHORING_STUDIO.md`.  
User edits and **Saves** in Studio (no Publish button). Agent publishes only after the user asks — see `PUBLISH_FROM_DRAFT.md`.
