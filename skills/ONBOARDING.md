# EasySociable agent-first onboarding

V1 expects an Agent (Grok Bot, Codex, Claude Code, …) to drive setup. The website is not the primary workspace.

## User steps

1. **Install CLI**

   ```bash
   curl -fsSL https://easysociable.com/install.sh | bash
   # or: npm i -g @easysociable/cli
   ```

2. **Install Skills + MCP** (Slideshow by default; for Codex / Claude Code). The curl installer already does this; run it yourself after an npm install.

   ```bash
   easysociable install --yes
   ```

   Default skills:

   - `easysociable-slideshow` — turns a topic into carousel pages you edit and download in Studio

   Optional Content Engine skill (install via CLI only — not in the public
   content-engine git repo; operations still follow that engine’s `CLAUDE.md`):

   ```bash
   easysociable install --skills content,slideshow --yes
   ```

   Get a Content Engine core (preferred):

   ```bash
   git clone https://github.com/murphywuwu/content-engine.git
   cd content-engine
   python3 workbench/build.py
   python3 workbench/serve.py --no-open
   ```

   See [LAYOUT.md](https://github.com/murphywuwu/content-engine/blob/main/LAYOUT.md).
   Optional CLI clone into `Content Engine/`:

   ```bash
   easysociable engine init --root /workspace --yes
   easysociable engine serve --engine /workspace/Content Engine --no-open
   ```

3. **Ask the Agent to create graphics** — account creation is deferred until a hosted operation requires authentication. If you installed the content skill: interview and write the profile first, then capture audience quotes into `needs/` (at least 3, aim for 5); do not create a slideshow yet.

## Lazy auth (Agent script)

When a Gateway call returns `AUTH_REQUIRED`, `API_KEY_INVALID`, or the CLI says
`Run easysociable auth login`, run `easysociable auth login` yourself (it waits
up to 5 minutes for the browser approval) and tell the user:

```text
EasySociable needs to connect to your account. I'm running `easysociable auth login` —
a browser tab will open: sign in (Google works, free) and click "Authorize Agent".
I'll continue as soon as you approve.
```

After `auth login` succeeds, retry the failed operation with the same
idempotency key when applicable.

## What works without auth

- `easysociable install` / `update`
- `easysociable engine init` / `serve` / `build` / `validate` (optional; core may be copied from git)
- Local `python3 workbench/build.py` / `serve.py` without CLI
- Reading installed Skill instructions
- Public template catalog in the browser (`/templates`)

## What requires auth

- Brands, Themes, images, drafts, Slideshow Runs
- Studio preview and Studio Download (Free: 3 Downloads/month)
