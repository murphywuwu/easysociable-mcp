# Slideshow Gateway reference

Slideshow uses the unified EasySociable Gateway client and public routes:

```text
POST /v1/slideshow/runs
GET  /v1/slideshow/runs/{runId}
PATCH /v1/slideshow/runs/{runId}
POST /v1/slideshow/runs/{runId}/render
GET  /v1/slideshow/runs/{runId}/studio
GET  /v1/render-jobs/{jobId}
GET  /v1/render-jobs/{jobId}/manifest
```

There are no V1 publish, unpublish, public-piece or Slideshow-template routes.
All requests use the account's unified credential and owner isolation.

## Identity (ADR-0036)

- Create and GET are **owner-scoped**. Same Workspace API key / Studio session
  workspace that created the Run must open Studio.
- Authenticated GET of another workspace's Run → `403 RUN_WRONG_WORKSPACE`
  (not a silent 404).
- Fixture `workspace_local` create is blocked under Directus persistence unless
  `SLIDESHOW_ALLOW_FIXTURE_STUDIO=1`. See `docs/operations/studio-identity-chain.md`.
