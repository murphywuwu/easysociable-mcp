# V2.1 design and visual-QA contracts

Use these local artifacts to make art direction and screenshot review explicit. They are workflow artifacts, not Gateway DTOs.

## Contents

- `design-philosophy.md`: human-readable visual philosophy (optional companion to the JSON field)
- `design-plan.json`: philosophy, art direction, concept selection, asset decisions, and theme preview
- `theme-tokens.json`: generated brand scale, semantic colors, and WCAG contrast report
- `visual-qa.json`: screenshot evidence, fixed scores, and pass/revise verdict

## `design-plan.json`

```json
{
  "schemaVersion": "design_plan_v2_1",
  "sourceKind": "text_brief",
  "intent": {
    "jobToBeDone": "Make monthly revenue understandable in one glance",
    "primaryPlatform": "x",
    "canvas": { "width": 1200, "height": 675 }
  },
  "philosophy": {
    "movementName": "Editorial Ledger",
    "space": "Generous top margin; one monumental metric zone; quiet side gutters",
    "color": "Warm paper canvas, near-black ink, one teal accent; decoration stays ink-weight",
    "rhythm": "Horizontal ledger rules and folio marks at a fixed cadence",
    "composition": "Author rail top; oversized metric center-left; breakdown as a thin footer band",
    "typographyAccent": "Display metric ~4x body; metadata in small caps or mono; no paragraph stacks",
    "craftBar": "Museum-grade spacing; no overlap; one focal; refine before adding decoration",
    "subtleReference": "Monthly close / ledger credibility without literal spreadsheet chrome",
    "templateConstraints": "Required brief slots stay bindable; flat absolute siblings; Theme owns color; never flatten copy into a generated poster"
  },
  "concepts": [
    {
      "id": "editorial-ledger",
      "name": "Editorial ledger",
      "rationale": "Use report-like credibility and one oversized metric",
      "philosophyExpression": "Monumental metric left of center; rules as quiet rhythm; author attribution as a thin top rail",
      "visualMotif": "ledger rules and folio marks",
      "layout": "author rail at top, metric center-left, breakdown footer",
      "hierarchy": "revenue > period/title > author > breakdown",
      "typography": "display metric at roughly 4x body scale",
      "colorStrategy": "warm canvas, dark ink, one green accent",
      "paletteCandidates": [
        {
          "name": "Ocean Depths",
          "presetId": "ocean-depths",
          "brandHex": "#1A6B6B",
          "mode": "light",
          "bestFor": "Finance, consulting, trust-building metric cards",
          "label": "teal editorial"
        }
      ],
      "assetStrategy": "avatar plus CSS/SVG rules; no hero illustration",
      "risks": ["long currency strings"]
    },
    {
      "id": "terminal-scorecard",
      "name": "Terminal scorecard",
      "rationale": "Give an indie-hacker technical voice",
      "philosophyExpression": "Same ledger philosophy expressed as a compact prompt header and centered status metric",
      "visualMotif": "terminal prompt and status light",
      "layout": "compact author header, centered metric, tabular footer",
      "hierarchy": "revenue > growth > author",
      "typography": "large grotesk metric with monospace metadata",
      "colorStrategy": "near-black canvas and one electric accent",
      "paletteCandidates": [
        { "brandHex": "#0D9488", "mode": "dark", "label": "teal terminal" }
      ],
      "assetStrategy": "avatar and CSS grid",
      "risks": ["neon contrast can become harsh"]
    }
  ],
  "selectedConceptId": "editorial-ledger",
  "selectionReason": "Best matches a trustworthy monthly report",
  "themePreview": {
    "name": "Ocean Depths",
    "presetId": "ocean-depths",
    "brandHex": "#1A6B6B",
    "activeMode": "light",
    "contrastPass": true,
    "bestFor": "Finance, consulting, trust-building metric cards",
    "themeTokensPath": "theme-tokens.json",
    "userConfirmed": true
  },
  "surfacePreview": {
    "kind": "gradient",
    "userConfirmed": true,
    "recipeId": "grad_001_warm-flame",
    "name": "Warm Flame",
    "provider": "webgradients",
    "textSafeZone": "light_end",
    "contrastAnchor": "#FAD0C4",
    "placement": "full_bleed"
  },
  "assetPlan": [
    {
      "role": "avatar",
      "source": "user_upload",
      "required": true,
      "description": "X profile avatar",
      "treatment": "circular crop; retain face focal point"
    },
    {
      "role": "background",
      "source": "gradient_catalog",
      "required": false,
      "description": "Warm Flame wash under metric"
    },
    {
      "role": "decorative",
      "source": "css_svg",
      "required": false,
      "description": "ledger rules and small folio marks"
    }
  ]
}
```

Rules:

- `text_brief` requires 2–3 concepts; `image_reference` permits one.
- `text_brief` requires root `philosophy` with non-empty `movementName`, `space`, `color`, `rhythm`, `composition`, `typographyAccent`, and `craftBar`.
- `image_reference` requires the same `philosophy` fields (short reverse-engineer from the reference).
- **`image_reference` also requires `referenceSpec` + `referenceImageInventory`** (see below). `validate-design-v2.mjs` enforces these.
- Optional philosophy fields: `subtleReference`, `templateConstraints` (recommended).
- Concepts must have unique IDs and all listed art-direction fields.
- Every concept requires `philosophyExpression` (how this layout expresses the shared philosophy in space).
- Concept `layout` / `hierarchy` / `typography` must be traceable to philosophy fields (documented rule; not NLP-checked).
- Concepts are spatial expressions of **one** shared philosophy — not unrelated slogans. Changing only colors is not a different concept.
- `selectedConceptId` must reference a concept.
- `selectionReason` is required.
- `assetPlan` may be empty when the concept intentionally uses typography only.
- Allowed asset roles: `background`, `hero`, `decorative`, `avatar`, `logo`, `icon`.
- Allowed sources: `user_upload`, `brand_kit`, `css_svg`, `gradient_catalog`, `asset_library`, `template_icon_catalog` (legacy alias `better_icons`), `external_photo`, `generated`, `none`.
- Optional per concept: `paletteCandidates` — array of `{ brandHex, mode, name?, presetId?, bestFor?, notFor?, label? }` where `mode` is `light` or `dark`. Prefer `name` + `bestFor` when presenting choices.
- Optional root: `themePreview` — `{ brandHex, activeMode, contrastPass, themeTokensPath, name?, presetId?, bestFor?, userConfirmed? }` after palette lock. Set `userConfirmed: true` only after explicit user choice (or waived).
- Optional root: `surfacePreview` — `{ kind: flat|gradient|image, userConfirmed, … }`. When `kind` is `gradient` or `image`, require `userConfirmed: true` before authoring those nodes; `gradient` needs `recipeId`; `image` needs `imageId` (or documented pending import) and `imageMode` (`fixed` default for surface background).

### `referenceSpec` + `referenceImageInventory` (`image_reference` only)

Required when `sourceKind` is `image_reference`. Rebuild to this measured spec; do not mood-board a different layout.

```json
{
  "referenceSpec": {
    "stackOrder": ["title", "soft-card", "soft-card-2", "tip", "cta"],
    "margins": "~48px outer",
    "gaps": "~24px between cards",
    "radii": "cards 16px; figure wells 12px",
    "typeScale": "title ~42/bold; body ~22; tip ~18"
  },
  "referenceImageInventory": [
    {
      "label": "Left soft-card person illustration",
      "slotKey": "image_0",
      "imageRole": "hero",
      "boxApprox": "left mid ~280×320"
    }
  ],
  "assetPlan": [
    {
      "role": "hero",
      "source": "user_upload",
      "required": true,
      "slotKey": "image_0",
      "description": "Left soft-card person illustration — empty image-slot frame",
      "treatment": "Match reference box; placeholder until account imageId fill"
    }
  ]
}
```

Rules:

- `referenceSpec.stackOrder`: non-empty string array (region labels top→bottom or primary reading order).
- `referenceSpec.margins` / `gaps` / `radii` / `typeScale`: non-empty strings (measured or tightly estimated).
- `referenceImageInventory`: array required (empty only when the reference has **no** pictorial regions). Each item: `label`, `slotKey` (`image_N`), `imageRole` (`hero|screenshot|avatar|product`), `boxApprox`.
- Every inventory `slotKey` must appear on an `assetPlan` entry with the same `slotKey` and source in `user_upload|brand_kit|external_photo|generated` — never `css_svg` stand-ins for pictures.
- Procedure for filling these fields: `workflows/AUTHORING_FROM_IMAGE.md`.
## Companion `design-philosophy.md`

Human-readable twin of `design-plan.json` → `philosophy`. Recommended structure:

```markdown
# Design Philosophy — <movementName>

## Space
...

## Color
...

## Rhythm
...

## Composition
...

## Typography as accent
...

## Craft bar
...

## Template constraints
- Required brief slots stay bindable
- Flat absolute siblings only
- Theme owns color; never flatten copy into a generated poster
```

## `theme-tokens.json`

```json
{
  "schemaVersion": "theme_tokens_v2",
  "brandHex": "#0D9488",
  "scale": {
    "50": "#F2FCFC",
    "500": "#14E1D0",
    "600": "#10BCAD",
    "950": "#042F2B"
  },
  "semantic": {
    "light": {
      "canvas": "#FFFFFF",
      "text": "#042F2B",
      "accent": "#10BCAD",
      "muted": "#10BCAD",
      "primary": "#10BCAD",
      "border": "#C6F5F1"
    },
    "dark": {
      "canvas": "#042F2B",
      "text": "#F2FCFC",
      "accent": "#14E1D0",
      "muted": "#51ECDF",
      "primary": "#14E1D0",
      "border": "#0B7F75"
    }
  },
  "activeMode": "light",
  "themeTokens": {
    "colors": {
      "canvas": "#FFFFFF",
      "text": "#042F2B",
      "accent": "#10BCAD",
      "muted": "#10BCAD",
      "primary": "#10BCAD",
      "border": "#C6F5F1"
    },
    "fonts": { "heading": "Inter", "body": "Inter" },
    "surfaces": { "radius": "12px", "shadow": "0 8px 24px rgba(0,0,0,.12)" },
    "palette": {}
  },
  "themeTokensLight": {},
  "themeTokensDark": {},
  "contrast": [
    {
      "pair": "text/canvas",
      "mode": "light",
      "foreground": "#042F2B",
      "background": "#FFFFFF",
      "ratio": 16.2,
      "wcagAA": true,
      "wcagAAA": true
    }
  ],
  "contrastPass": true
}
```

Rules:

- `scale` must include shades `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950`.
- `brandHex` must be `#` + 6 hex digits.
- `activeMode` is `light` or `dark`; `themeTokens` must match the active semantic palette.
- `themeTokens.colors` requires `canvas`, `text`, `accent`, `muted` (hex strings). Prefer also `primary` and `border` when co-creating v2.
- `themeTokens.fonts` requires `heading` and `body`.
- `themeTokens.surfaces` requires `radius` and `shadow`.
- `contrast` entries require `pair`, `mode`, `foreground`, `background`, `ratio`, `wcagAA`, `wcagAAA`.
- `contrastPass` must be `true` before authoring when co-creating a new theme.

## `visual-qa.json`

```json
{
  "schemaVersion": "visual_qa_v2_1",
  "draftId": "draft_123",
  "iteration": 1,
  "sourceKind": "image_reference",
  "screenshotEvidence": "/absolute/path/to/studio-render.png",
  "referenceCompare": {
    "performed": true,
    "geometryMatch": true,
    "imageSlotsMatchInventory": true,
    "notes": "Card stack and image_0/image_1 frames match referenceSpec"
  },
  "hardFailures": [],
  "scores": {
    "hierarchy": 18,
    "composition": 13,
    "spacingAlignment": 13,
    "typography": 13,
    "colorContrast": 9,
    "assetRelevance": 8,
    "contentResilience": 8,
    "editability": 5
  },
  "total": 87,
  "verdict": "pass",
  "issues": [],
  "changesMade": ["Increased metric size", "Reduced footer density"]
}
```

Score maxima total 100. `pass` requires:

- inspectable `screenshotEvidence`
- `iteration` from 0 to 2
- no `hardFailures`
- each score within its maximum
- declared `total` equal to the calculated sum and at least 80
- when `sourceKind` is `image_reference`: `referenceCompare` with `performed`, `geometryMatch`, and `imageSlotsMatchInventory` all `true`

Use `verdict: "revise"` below threshold while iterating. Do not hand off a `revise` result as a reviewed template unless the user explicitly accepts it.

Craft Pass (behavior, not new score fields): when `iteration >= 1`, prefer tightening existing nodes over adding decoration; score against `philosophy.craftBar` and `philosophyExpression` of the selected concept. Set `sourceKind` on `visual-qa.json` to match the design plan when authoring from a reference.
