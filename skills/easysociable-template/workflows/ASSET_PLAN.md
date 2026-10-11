# Asset plan (V2.1)

Run after concept selection and before authoring. Give every non-text visual a clear semantic role and source.

When atmosphere, photography, or icons are involved, run `workflows/SURFACE_REVIEW.md` (and read `references/EXTERNAL_RESOURCES.md`) in the same pass.

## Source priority

Choose the first adequate option:

1. `user_upload` — user avatar, logo, product screenshot, supplied photo
2. `brand_kit` — approved reusable brand asset
3. `template_icon_catalog` — **required for any icon/glyph** (arrow, chevron, check, social mark, next-page cue, …). Confirmed Gateway `search_icons` → user confirm → `get_icon` (`iconAssetId` + `canonicalSvg`). **Not optional when catalog works.**
4. `gradient_catalog` — confirmed recipe from Gateway `gradients.*` (inline CSS decoration)
5. `css_svg` — local CSS/SVG **geometry only** (hairlines, rails, anonymous discs/masks). **Do not** use this source for symbol icons when `template_icon_catalog` is available.
6. `asset_library` — vetted texture, frame, or decorative primitive (non-icon)
7. `external_photo` — confirmed host Unsplash/Pexels/Pinterest pick (Gateway import → CDN/`imageId`)
8. `generated` — topic-specific hero, illustration, object, or complex background
9. `none` — omit visuals that do not improve communication

## Rules

- Record `role`, `source`, `required`, `description`, and treatment for every asset.
- Roles: `background | hero | decorative | avatar | logo | icon`.
- For `external_photo` / `template_icon_catalog` / `gradient_catalog`: discovery → bounded showcase → **user confirm** → materialize. Unselected → no EasySociable write.
- **`role: icon` ⇒ `source` MUST be `template_icon_catalog`** (unless catalog failed and user approved degrade). Never invent path SVG for icons “to go faster”.
- **Reference-image path:** every `referenceImageInventory` entry MUST have a matching `assetPlan` row with the same `slotKey`, source `user_upload|brand_kit|external_photo|generated`, and role suited to the picture — not `css_svg` fake people/illustrations. Geometric chrome only for non-pictorial panels/lines/anonymous washes.
- Never put third-party temporary image URLs into `authoringSource`.
- Use generated imagery only when it supports the selected concept. Prefer transparent, text-free, crop-safe elements for independent decorations.
- Never ask image generation to render the final poster, headline, metric, avatar name, or other replaceable content.
- Keep generated prompts and returned asset IDs/paths as provenance when available.
- Define focal point/crop behavior for image slots. Ensure foreground text retains contrast over backgrounds (`surfacePreview.contrastAnchor` / scrim when needed).
- When no asset service/library exists, degrade per `EXTERNAL_RESOURCES.md`; do not invent asset IDs or scrape providers at runtime.

Write the result into `design-plan.json` (`assetPlan` + `surfacePreview` when applicable) and validate before creating `authoringSource`.
