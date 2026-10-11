# Slot model (single-page template)

A **slot** is a fillable content contract on one page. A **node** is a positioned box on the canvas.

## Node vs slot vs decoration

| | Meaning |
|---|---|
| **Slot** | Declares what can change at render time: `key`, `type`, constraints |
| **Node with `bindingKey`** | Canvas element bound to `slot.key` — filled from bindings |
| **Node without `bindingKey`** | Decoration / fixed chrome — not in the slot table, never filled from content |

Agent must decide which regions are variable (slots) vs fixed (decoration) before create.

## MVP slot types

| `type` | Value | Constraints |
|---|---|---|
| `text` | string | `maxCharacters`, **`maxLines`**, `overflow` |
| `number` | number | optional format hints in `aiHint` |
| `image` | image ref / URL handled by Gateway | optional `aspectRatio` |

**No `list` type in MVP.** The current renderer binds one value per `bindingKey` and uses absolute frames — there is no array repeater. Checklist-like pages use multiple text slots (`text_1`, `text_2`, …).

Also unused for typical authoring: put colors in **Theme**, not `color` slots.

## Naming

Stable opaque keys are allowed and preferred for MVP, e.g.:

- `text_0`, `text_1`, `text_2`
- `number_0`
- `image_0`

Keys must be unique within the page. After Publish, treat keys as immutable (rename = new template or migration).

There is **no global cap** on how many slots a page may have. Count is whatever the layout needs, as long as filled content respects per-slot limits and does not fail layout audit.

## Slot record (authoring-time contract)

Agent should maintain an explicit slot table (even if Gateway compiles bindings server-side):

```ts
type Slot = {
  key: string
  type: 'text' | 'number' | 'image'
  required: boolean
  overflow: 'error' | 'shrink' | 'truncate'
  maxCharacters?: number  // text
  maxLines?: number       // text — required in contract when type is text
  aspectRatio?: string    // image, optional
  label?: string          // human label for Studio / brief
  aiHint?: string
  placeholder?: unknown   // preview-only sample, not the live contract value
}
```

Align with server `TemplateBindingDefinition` where possible (`key`, `type`, `required`, `overflow`, `maxCharacters`, `aiHint`). Persist `maxLines` on the bound text node props and/or authoring metadata until contracts officially add the field.

## Required vs optional

- Default: slots that define the page’s main message are **`required: true`**.
- **`required: false`** is for whole optional blocks (e.g. optional `image_0`), not for “collapse a variable-length bullet list.”
- Variable bullet counts: prefer a template with the right number of text slots, or accept empty optional text slots under the omit rule below (layout will **not** reflow).

## Empty slot → omit node (not hide)

At render time:

1. If a slot value is `null` / `undefined` / `''` → **do not include** the bound node in the render tree.
2. This is **omit**, not CSS `display: none` / visibility hide.
3. Layout is **absolute positioning**. Omitting a node does **not** move other nodes; gaps may remain.
4. **Required** slots that are missing must **fail validation** before render — omit must not paper over missing required content.

## Absolute layout implications

- Do not promise “empty bullets automatically pack upward.”
- Prefer fixed slot counts for dense checklists under absolute layout.
- Optional omit works best for independent regions (corner image, optional CTA block), not mid-stack lists.
- Bound nodes should be **independent absolute frames** on the canvas. Do not put an image/text slot inside another absolute wrapper; omit would leave an empty parent box. See flat-tree rule in `AUTHORING_SOURCE.md`.

## Examples

### KPI / follower milestone (fixed)

```text
text_0     text    required  maxLines=2  maxCharacters=24
number_0   number  required
text_1     text    required  maxLines=1  maxCharacters=16   # label under metric
image_0    image   optional  aspectRatio≈1:1
```

Decoration: background shapes, hairlines, fixed wordmarks — no `bindingKey`.

### Checklist page (fixed three lines — no list type)

```text
text_0  text  required  maxLines=2  maxCharacters=20   # title
text_1  text  required  maxLines=1  maxCharacters=28
text_2  text  required  maxLines=1  maxCharacters=28
text_3  text  required  maxLines=1  maxCharacters=28
```

If content only has two bullets, either use a 2-line template or mark `text_3` optional knowing omit leaves a visual gap under absolute layout.
