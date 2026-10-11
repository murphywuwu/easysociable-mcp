# MCP-first

Use the single unified EasySociable MCP server for Slideshow Run operations.
Fallback commands use the same Gateway client:

```bash
easysociable slideshows create --file ./pack.json --json
easysociable slideshows get --id run_xxx --json
```

Neither path may call a private service, Local API, Directus, R2 or a separate
Slideshow MCP process.
