# ContentPack v1

A page is **generated**: `layout: { studioJson, canvas }` composed from the
internal visual system. Catalog pages (`layoutFamilyId` / `pageTemplateId`) are
legacy compatibility fields; do not create new Runs with them unless the user
explicitly asks to reuse an existing Run or legacy handoff. `role` is a weak
production hint, not a sequence position or content formula. `slots` are
public values only. Do not add a `deck_template_id`, `bindingMap`, AST,
ContentDocument, or product `arc` / `pageSequence`.

Generated page:

```json
{ "role": "hook", "slots": { "text_0": "Meta's new AI doesn't chat." },
  "layout": { "studioJson": "<div id=\"Graphic\" data-type=\"post\" …>…</div>",
              "canvas": { "width": 1080, "height": 1350 } } }
```

## Example: generated pages (TikTok)

```json
{
  "schemaVersion": "content-pack.v1",
  "platform": "tiktok",
  "title": "Stop briefing a blank canvas",
  "pages": [
    { "role": "hook", "slots": { "text_0": "You finish the copy. Then you start over." }, "layout": { "studioJson": "<div id=\"Graphic\" data-type=\"post\">…</div>", "canvas": { "width": 1080, "height": 1350 } } },
    { "role": "point", "slots": { "text_0": "Roles, Brand, Layouts persist" }, "layout": { "studioJson": "<div id=\"Graphic\" data-type=\"post\">…</div>", "canvas": { "width": 1080, "height": 1350 } } },
    { "role": "steps", "slots": { "text_0": "Use them in that order" }, "layout": { "studioJson": "<div id=\"Graphic\" data-type=\"post\">…</div>", "canvas": { "width": 1080, "height": 1350 } } },
    { "role": "cta", "slots": { "text_0": "Don't brief a blank canvas" }, "layout": { "studioJson": "<div id=\"Graphic\" data-type=\"post\">…</div>", "canvas": { "width": 1080, "height": 1350 } } }
  ]
}
```

The renderer accepts any supported page count within the platform cap. X image
Runs support 2–20 pages and default to the Instagram-compatible `4:5` canvas
(1080×1350); keep every page in the Run on that same canvas. A newly published
Layout Family can be selected in a new Run without creating a carousel asset.
