# Create Run

Follow the Workflow in `SKILL.md` (login → Brand → facts → hook/structure →
look + pages from references → images → `scripts/check-pages.mjs` → create).

Notes for updates:

- Revise the same Run (SKILL.md step 8): `slideshows get`, then `slideshows
  update` with `baseRevision` and only the changed `pages[]` (`pageIndex`,
  `layout`, `slots`). Page count and order stay fixed; a new Run only for a
  new topic or an alternative the user asked for.
- Save `runId` and `studioUrl`; the user opens `studioUrl` while logged into
  the same account.
- Do not call a Deck API or send a product `pageSequence` / `arc` field.
