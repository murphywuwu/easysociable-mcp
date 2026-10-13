# Reference designs

A reference is a published catalog design (one canvas: the source post's) made
from a real post. Pages are **adapted from references**: you keep a reference's
composition, type scale, spacing and chrome, and replace content, colours
(Brand) and canvas size. You never copy one verbatim and never draw a page with
no reference at all.

Find references for a page role, shuffled, as short summaries:

```bash
easysociable templates references --role hook,cover [--style <style>] [--exclude <familyIds>] [--no-image] --json
easysociable templates source --family <familyId> --json   # the design's Studio source
```

Roles overlap in the catalog, so pass related ones together: `hook,cover` ·
`point,value,steps,checklist` · `metric,proof,evidence` · `compare` ·
`screenshot` (needs an image) · `recap` · `cta,follow`. Styles: `minimal`,
`editorial`, `swiss`, `dark`, `bold_promo`.

## Adapting a reference (the rules that make it look designed)

1. Start from the reference's source. Keep its chrome (header, pill, page
   number, rule, footer) only if the deck keeps it on every page; keep its
   margins (`left` of the first column), type scale and fonts.
2. Fit the Run's canvas: a reference made for another canvas (3:4, 9:16, 4:5)
   keeps its left margin and type scale; re-space vertically, never squash text.
3. Change text, then fix each text box: explicit `<br />` line breaks, and
   `height` = lines × lineHeight + ~12% of fontSize for descenders.
4. Remove what you do not need; add only elements copied from another reference
   with the same `style` (rule rows, a stat row).
4a. **A reference's image area** when you have no image and the content does
   not need a real one: keep the area's box and fill it from the content with a
   large number or keyword, a short quote with an oversized quote mark, an
   accent-colour block carrying one word, or one icon from
   `easysociable icons search` on a tinted block. Never a grey placeholder or an
   empty box on the cover. If nothing fits, delete the area and give the
   headline its space.
5. Brand chrome: the header label is the Brand name (or the topic when there is
   no Brand); the CTA names the Brand handle. Never leave a reference's original
   name or handle (e.g. "Will.AI.m") on a page. **Bind them** so a Brand change
   updates every page: the element holding only the Brand name gets
   `data-brand="name"`, only the handle `data-brand="handle"`, and an avatar /
   logo `<img>` gets `data-brand="avatar"` with the Brand's `logoUrl` as `src`.
   Without a Brand, leave them unbound (the topic is not the Brand).
6. Accent colour only on large text (≥ 36px, or ≥ 28px bold) and blocks. Small
   labels use the text or muted colour.
7. Semantic `data-type` values (`title`, `subtitle`, `kicker`, `metric`,
   `caption`) get Brand colours forced by Studio. Text on an accent or image
   block uses `label`, `body` or `statement` with an explicit colour.
8. One deck = one `style`. No reference twice in a Run unless the page purpose
   repeats (several numbered points), and no two adjacent pages with the same
   composition.

## Avoid (what makes every Run look the same)

- The same cover composition as this Brand's previous Run, unless the user
  asked for "same as last time".
- Header label + pill + page number + "SWIPE →" on every page by habit: chrome
  comes from the chosen reference, or there is none.
- An accent-coloured second half of the headline on more than two pages.
- A deck that is only left-aligned text stacks: at least one page's focal point
  is not a headline (a big number, an image, a quote, a comparison).
- A generic "Save this / Follow for more" CTA when the content suggests a
  specific action (comment a word, try the prompt, read the source).

## Default palettes (no Brand)

Use one in `theme.json` as `{ "color": { "canvas", "text", "textMuted", "accent", "primary" } }`
(`primary` = `accent`), matched to the deck's style:

| Style | canvas / text / textMuted / accent |
|---|---|
| `editorial` | `#F4EEE7` / `#121A2B` / `#4A4F5C` / `#D4450F` |
| `minimal`, `swiss` | `#FFFFFF` / `#15191E` / `#384352` / `#445164` |
| `dark` | `#06080C` / `#FFFFFF` / `#C7CBD3` / `#4C9BFF` |
| `bold_promo` | `#F9F9F9` / `#0A0A0A` / `#555555` / `#0066DD` |

## Image placeholder

A replaceable image slot for a real screenshot or photo the user will add.
Studio shows an upload button when it is selected.

```jsx
<img data-type="image" data-variable="image_0" data-image-mode="slot_default"
  alt="Add: <what goes here>" src="data:image/svg+xml;base64,<SVG>"
  style={{ position: 'absolute', left: 88, top: 760, width: 904, height: 388, objectFit: 'cover', borderRadius: 24 }} />
```

`<SVG>` is base64 of a grey box with an image icon and the label, sized to the slot:

```xml
<svg xmlns='http://www.w3.org/2000/svg' width='904' height='388' viewBox='0 0 904 388'>
  <rect width='904' height='388' fill='#DDD6CC'/>
  <g transform='translate(416,124)' fill='none' stroke='#8C8781' stroke-width='5' stroke-linejoin='round'>
    <rect width='72' height='56' rx='8'/><path d='M6 50 L26 28 L40 42 L50 34 L66 50'/><circle cx='52' cy='16' r='6'/>
  </g>
  <text x='50%' y='230' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='32' font-weight='600' fill='#6F6A64'>Add: Grok Bot app screenshot</text>
</svg>
```

Put the same data URL in the page's `slots` under `image_N`. Number slots
`image_0`, `image_1`, … per page. Use the style's own colours for the box
(canvas-adjacent grey on light styles, `#1A1F27` on dark ones).
