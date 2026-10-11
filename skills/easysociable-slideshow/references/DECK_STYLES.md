# Deck Styles

A Deck Style is a set of catalog Layout Families that share one visual language
(type scale, margins, chrome, palette). Every page of a Run is **adapted from one
family of a single Deck Style** — never drawn from scratch, never mixed across styles.

Read a family's Studio source for the Run's platform:

```bash
easysociable templates source --family <familyId> --platform <platform> --json
```

Pick the style from the Brand's default style. No Brand style yet → pick by content:

| Style | Use for | Needs images | Brand palette (canvas / text / textMuted / accent) |
|---|---|---|---|
| `cream-editorial` | explainers, opinions, news breakdowns, prompts — text-first | no | `#F4EEE7` / `#121A2B` / `#4A4F5C` / `#D4450F` |
| `quiet-ledger` | frameworks, tips, how-tos, lessons — calm, structured | no | `#FFFFFF` / `#15191E` / `#384352` / `#445164` |
| `dark-news` | breaking AI/tech news with a strong photo or product shot | yes (hero photo) | `#06080C` / `#FFFFFF` / `#C7CBD3` / `#4C9BFF` |
| `phone-showcase` | app tips, tool demos, "how I use X" — real screenshots | yes (screenshots) | `#F9F9F9` / `#0A0A0A` / `#555555` / `#0066DD` |

No images available and none can be generated → only `cream-editorial` or `quiet-ledger`.

## cream-editorial

Big 112px headline with an accent-coloured second half, mono page number, pill tag, rule, SWIPE footer.

| Family | Page purpose |
|---|---|
| `fam_0488u93z` Cream Editorial Headline Poster | hook / cover: headline + one-line aside |
| `fam_w3p02voe` Cream Five-Line Headline Poster | hook / cover: headline only, up to 5 lines |
| `fam_vt5zt1xg` Accent Rail Paragraph Chart | context / evidence: one paragraph on an accent rail + 3 numbers |
| `fam_vw68bzh1` Cream Mono Prompt Card | value / steps: a mono "card" (prompt, quote, example input) |
| `fam_x6gdbad3` Accent Rail Paragraph Logo Row | proof: paragraph + logo row (needs logos) |
| `fam_9hlr90o1` Cream Big Button Follow Close | cta / follow: big question + accent button |

Point / list / metric pages are not in the catalog for this style: adapt the
headline poster (title on top, 2–3 rows or one huge number below), keeping its chrome.

## quiet-ledger

White, small caps labels, soft green gradient blob, one idea per card.

| Family | Page purpose |
|---|---|
| `fam_49c6pout` Title + Subtitle Cover | cover |
| `fam_qery74q3` Bold Claim Hook with Swipe Arrow | hook |
| `fam_e8d1qpn2` Problem Setup Card | setup / problem |
| `fam_k9wge9gc` Single Takeaway Card | value / key idea |
| `fam_ue542bvy` Numbered Point Card | point (one per page, big number) |
| `fam_78vpdf64` Five-Step How-To List | steps |
| `fam_3tw3wbxx` Big Metric Proof Card | proof / metric |
| `fam_eh8wkyql` Closing Recap Summary | recap |

CTA: adapt `fam_rahs52cl` Bookmark Save Close into this palette.

## dark-news

Near-black, full-bleed photo with headline over a fade.

| Family | Page purpose |
|---|---|
| `fam_321v25e7` Dark News Hero Poster | cover / hook over a hero photo |
| `fam_rms4v81m` Dark News Story Stack | point / evidence: image + short story |
| `fam_9lkrmau1` Monument Metric | metric / proof: one huge number |

CTA: adapt `fam_9hlr90o1` (button close) into the dark palette.

## phone-showcase

Light grey, a phone mockup holding a real screenshot, short caption.

| Family | Page purpose |
|---|---|
| `fam_itnu5iiq` Title Over Fading Phone Poster | cover |
| `fam_wb2l75gl` Phone Left Title Right Poster | cover / screenshot |
| `fam_nk61xu51` One-Phone Prompt Tip | point: one phone + tip text |
| `fam_t2x277j8` Two-Phone Tip | point: before / after |
| `fam_99xxcxs0` Centered App Spotlight Stack | point: app icon + name + one line |
| `fam_ct0pajcy` Caption Over Big Phone | steps: one step per page |
| `fam_4ct2w5n5` Phone Left Step Note | steps |
| `fam_v4yktlzk` Phone Bottom Edge Caption | steps |
| `fam_sgif0njo` Twin Phones Follow Close | follow |
| `fam_6lxgv3nd` Follow Me Avatar Close | cta with the Brand avatar |
| `fam_rahs52cl` Bookmark Save Close | cta: save for later |

## Adapting a family (the rules that make it look designed)

1. Copy the family source. Keep its chrome (header, pill, page number, rule,
   footer), margins (`left` of the first column), type scale and fonts.
2. Change text, then fix each text box: explicit `<br />` line breaks, and
   `height` = lines × lineHeight + ~12% of fontSize for descenders.
3. Remove what you do not need; add only elements copied from a sibling family
   of the same style (e.g. the rule rows or stat row).
4. Brand chrome: the header label is the Brand name (or the topic when there is
   no Brand); the CTA names the Brand handle. Never leave a template's original
   name or handle (e.g. "Will.AI.m") on a page.
5. Accent colour only on large text (≥ 36px, or ≥ 28px bold) and blocks. Small
   labels use the text or muted colour.
6. Semantic `data-type` values (`title`, `subtitle`, `kicker`, `metric`,
   `caption`) get Brand colours forced by Studio. Text on an accent or image
   block uses `label`, `body` or `statement` with an explicit colour.
7. One family per page, no family twice in a Run unless the page purpose
   repeats (e.g. several numbered points), and no two adjacent pages with the
   same composition.

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
