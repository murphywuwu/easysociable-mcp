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
4a. **A reference's image area** when you have no real image: keep the area's
   box and draw a diagram from the page's own words, every part editable text
   or shapes:
   - prompt card: the exact prompt the page tells the reader to send, in a
     chat-bubble-like card with no product logo or UI chrome;
   - A vs B: two cards side by side, a "vs" or arrow between;
   - ✗ / ✓: the wrong and right version of the same thing;
   - flow: 3–4 nodes with arrows for steps;
   - a large number or keyword, a short quote with an oversized quote mark,
     or an accent block carrying one word.
   Icons: `easysociable icons search --query <word>`, then `icons get` for its
   `canonicalSvg`. Made-up figures carry "示例 / example". Never an empty box. If
   nothing fits, delete the area and give the headline its space.
5. Brand chrome — every Run carries the Brand, bound so one Brand edit updates
   every page. The cover has a signature (avatar + name + handle); the CTA has
   avatar + handle next to the action. Inner pages keep only the Brand spots
   their reference already has (never add chrome by habit). Never leave a
   reference's original name or handle (e.g. "Will.AI.m") on a page.
   - The element holding only the name gets `data-brand="name"`, only the
     handle `data-brand="handle"`, the avatar / logo `<img>` `data-brand="avatar"`.
   - Value: the Brand's `name`, `@handle`, `logoUrl`. A field the Brand lacks
     (or no Brand at all) → the sample: `Your Name`, `@yourhandle`, and the
     sample avatar below, still bound. Studio swaps each sample the moment the
     user fills that field, and asks for it until then.
   - Size the spots for a real name (up to ~22 characters) — `check-pages`
     renders them with a long one.

   Sample avatar (`objectFit: 'cover'`, round it with `borderRadius: '50%'`):
   `data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNjAnIGhlaWdodD0nMTYwJyB2aWV3Qm94PScwIDAgMTYwIDE2MCc+PHJlY3Qgd2lkdGg9JzE2MCcgaGVpZ2h0PScxNjAnIGZpbGw9JyNDOUNERDMnLz48Y2lyY2xlIGN4PSc4MCcgY3k9JzYyJyByPScyOCcgZmlsbD0nI0Y0RjVGNycvPjxwYXRoIGQ9J00yOCAxNjBjMi0zNCAyNC01MiA1Mi01MnM1MCAxOCA1MiA1MnonIGZpbGw9JyNGNEY1RjcnLz48L3N2Zz4=`

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

