# Arc (argument, then pages)

A Slideshow Run is an argument that only works if the viewer turns the page.
Page order is a property of **this piece of content**, not of the catalog.

Do **not** invent a product-level `arc` field, Deck SKU, or
`pageSequence: [cover, point, steps, recap, cta]`.

## Forbidden default

Never default a Pack to Cover → Point → Steps → Recap → CTA
because those are P0 family names. That sequence is one possible recipe, not
the product shape. Page count follows the argument (TikTok often 4–8), not
the number of P0 families.

## Before pages

Write one arc line, then map each beat to slots.

**Page 1 is cover/hook class.** A template is cover/hook class when
`supportedRoles` includes `cover` or `hook`. That class belongs only on
`pages[0]`. Opening copy may still be a cost, quote, or compare *line* —
fill a cover or hook template whose `slotSummary` fits. Do not open with a
metric/point/quote template.

Later pages pick by slot shape (metric, quote, compare, value, steps, cta).

## Recipes (swipe formulas, not system enums)

Pick one, or name a new one-liner. Do not expand this into an official catalog.

| Recipe | Beats |
|---|---|
| cost-mechanism | cost → mechanism → method → close → action |
| listicle | hook + N items + CTA |
| mistakes | hook + errors + fix + CTA |
| claim-proof | claim → evidence → implication → CTA |
| compare | old way / new way / why / CTA |

## After create

Topology is locked. Wrong arc or wrong templates → **new Run**.
Do not PATCH copy into a locked Cover-Point-Steps-Recap-CTA skeleton.
`contentSlug` finds prior drafts; it does not keep a bad sequence alive.
