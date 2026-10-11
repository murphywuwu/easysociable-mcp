# Obsidian export

Final PNGs are written at the **engine root exports directory**:

```text
Content Engine/exports/<slug>/<platform>/     (en)
内容引擎/导出/<slug>/<platform>/               (zh)
    ├── 01.png
    ├── 02.png
    └── manifest.json
```

Semantic work and Packs stay under `runs/<slug>/` or `成稿/<slug>/`. Do not
write PNGs inside the run folder.

Read `locale.json` in the engine root. Pack JSON keys stay English.

The CLI verifies checksums and atomically replaces the export directory only
after a complete atomic Hosted Render succeeds. No ZIP is created. Cloud
artifacts may expire after 24 hours; local PNGs remain the user's files.
