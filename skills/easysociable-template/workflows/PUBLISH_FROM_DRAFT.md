# Publish from saved draft (Agent path)

Authoring Studio has **Save only** — no Publish button.  
After the user saves and says 「publish」/「发布该模板」, the Agent analyzes the draft, completes catalog metadata, and publishes via Gateway.

## When to run

- User finished editing in `/authoring/{draftId}` and clicked **Save**
- User explicitly asks to publish (do not auto-publish on create)

## Flow

1. Load the saved draft:

```bash
easysociable templates get --id <draftId> --json
```

2. Analyze public fields only (`authoringSource`, canvas, themeId, existing `selectionMetadata`):
   - Infer `platforms` / `canvasPreset` from canvas + brief
   - Infer `supportedRoles` (1–2) from layout intent / node types
   - Derive `slotSummary` / `requiresImage` / `imageRoles` from fillable slots
   - Fill `contentFamily`, `contentArchetypes`, `density`, `textDensityRange`
   - Prefer P1: `bestFor`, `notFor`, `selectionHints`, `visualStyle`, `locale`

3. Show a short P0/P1 summary to the user. Wait for confirmation unless they already said 「直接发布」.

4. Write metadata, then publish:

```bash
easysociable templates publish --id <draftId> --json
```

Or two steps:

```bash
easysociable templates update-draft --id <draftId> --file ./draft-patch.json --json
easysociable templates publish --id <draftId> --json
```

5. Verify catalog discoverability:

```bash
easysociable templates list --json
```

## Rules

- Never invent private AST / Binding Map from Agent-side.
- Gateway rejects Publish if any P0 field is missing — fix metadata and retry.
- Incomplete published pages must not appear in `list` (enforced server-side).
- Theme co-create drafts may still be published via theme APIs when product requires it; page publish is independent.

## Failure recovery

| Error | Action |
|---|---|
| `VALIDATION_ERROR` missing P0 | Fill missing fields, `update` + `publish` again |
| `NOT_FOUND` | Confirm `draftId`; user may not have saved |
| `VERSION_IMMUTABLE` | Draft already published — create a new template instead |
