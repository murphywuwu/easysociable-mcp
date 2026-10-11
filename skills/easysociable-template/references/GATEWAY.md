# Unified Gateway reference

The public executable is `easysociable`; the public MCP is the unified server.
Template operations use these command families:

```bash
easysociable auth status --json
easysociable templates list --json
easysociable templates get --id <id> --json
easysociable templates create-draft --file ./draft.json --json
easysociable templates update-draft --id <id> --file ./patch.json --json
easysociable templates validate --id <id> --json
easysociable templates publish --id <id> --json
easysociable templates families get --id <familyId> --json
easysociable templates families derive --id <familyId> --presets 4:5,9:16,1:1 --json
easysociable templates families migrate-legacy --json
easysociable icons search --query "arrow" --json
easysociable icons get --id <id> --idempotency-key <key> --json
easysociable renders create --template-id <id> --slots ./slots.json --format png --idempotency-key render_1 --json
easysociable renders wait --id <id> --json
```

Multi-platform create flow (derive + hand-tune): `workflows/MULTI_PLATFORM_FAMILY.md`.

All requests go through Gateway. The client receives public summaries, slot
contracts, stable Image references and render Manifests only. It never receives
AST, Binding Maps, private RenderPlans or provider credentials.

External Pexels/Unsplash/Pinterest MCPs remain optional host capabilities for
discovery. They are not auto-installed and are not EasySociable API paths.
