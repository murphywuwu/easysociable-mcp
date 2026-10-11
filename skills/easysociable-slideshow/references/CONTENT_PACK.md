# ContentPack v1

A page is either **generated** (`layout: { studioJson, canvas }` adapted from a
Deck Style family — the default, see `DECK_STYLES.md`) or a **catalog page**
(`layoutFamilyId` / `pageTemplateId`, used as-is; only for Formula Looks the
user asked to copy exactly). `role` is a weak tag from the closed enum, not a
sequence position. `slots` are public values only. Do not add a
`deck_template_id`, `bindingMap`, AST, ContentDocument, or product `arc` /
`pageSequence`.

Generated page:

```json
{ "role": "hook", "slots": { "text_0": "Meta's new AI doesn't chat." },
  "layout": { "studioJson": "<div id=\"Graphic\" data-type=\"post\" …>…</div>",
              "canvas": { "width": 1080, "height": 1350 } } }
```

## Example: cost → mechanism (TikTok)

Opening beat is cost; page 1 is still a hook-class template.

```json
{
  "schemaVersion": "content-pack.v1",
  "platform": "tiktok",
  "title": "Stop briefing a blank canvas",
  "pages": [
    { "role": "hook", "layoutFamilyId": "fam_hook_001", "slots": { "text_0": "You finish the copy. Then you start over.", "text_1": "The design file kept none of the argument." } },
    { "role": "point", "layoutFamilyId": "fam_stack_001", "slots": { "text_0": "Roles, Brand, Layouts persist" } },
    { "role": "steps", "layoutFamilyId": "fam_stair_001", "slots": { "text_0": "Use them in that order" } },
    { "role": "cta", "layoutFamilyId": "fam_close_001", "slots": { "text_0": "Don't brief a blank canvas" } }
  ]
}
```

## Example: hook → value → cta

```json
{
  "schemaVersion": "content-pack.v1",
  "platform": "tiktok",
  "title": "A repeatable story",
  "pages": [
    { "role": "hook", "pageTemplateId": "tpl_hook_001", "slots": { "text_0": "The hook", "text_1": "The point" } },
    { "role": "value", "pageTemplateId": "tpl_value_001", "slots": { "text_0": "One idea" } },
    { "role": "cta", "pageTemplateId": "tpl_cta_001", "slots": { "text_0": "Follow for more" } }
  ]
}
```

The renderer accepts any supported page count within the platform cap. A newly
published Layout Family can be selected in a new Run without creating a
carousel asset.
