# Create Run

Follow the Workflow in `SKILL.md` (login → Brand → facts → structure/hook →
look + pages from references → images → `scripts/check-pages.mjs` → create).

Approved copy (note 【逐页】, script) is locked: run `scripts/check-copy.mjs
pack.json --note note.md` before create (exit 0 required), and create with
`slideshows create --file pack.json --copy-lock note.md`.

Post dir with video / images (source-video, assets/, screenshots): run
`scripts/check-evidence.mjs pack.json --post-dir posts/<slug>` (exit 0 required;
zero non-avatar uploaded images = FAIL), and add `--require-evidence posts/<slug>`
at create.

Notes for updates:

- Revise the same Run (SKILL.md step 8): `slideshows get`, then `slideshows
  update` with `baseRevision` and only the changed `pages[]` (`pageIndex`,
  `layout`, `slots`). Page count and order stay fixed; a new Run only for a
  new topic or an alternative the user asked for.
- Save `runId` and `studioUrl`; the user opens `studioUrl` while logged into
  the same account.
- Do not call a Deck API or send a product `pageSequence` / `arc` field.
