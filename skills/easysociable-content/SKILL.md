---
name: easysociable-content
description: >
  Generate or compile EasySociable carousel content: respect a user's Writing Skill,
  turn long-form copy into page-by-page copy, or write from a topic when no user
  writing system is supplied. Also operate the optional Content Engine knowledge,
  profile, topic and run workflows.
  Triggers: 采访我, 完善人设, interview me, who am I as a creator, 建立 profile
  — follow workflows/INTERVIEW.md (engine CLAUDE.md § Interview wins if present).
  Triggers: 记一下, 存资料, ingest, 问知识库, what do we know about, lint 知识库, 整理知识
  — follow engine CLAUDE.md § Knowledge (Ingest / Query / Lint).
  Triggers: 生成选题, 做成选题, 用 F-… 生成选题
  — follow engine CLAUDE.md § Topics (Formula → Knowledge).
  Triggers: 开一单, 用 T-… 开一单, 出图
  — follow engine CLAUDE.md § Open a run for that explicit engine mode.
  If no engine exists, copy/clone the Content Engine core (see Create below;
  `easysociable engine init` is optional offline scaffold). Then follow
  Content Engine/CLAUDE.md. Render handoff: easysociable-template (1 page) or
  easysociable-slideshow (2+). Never publish or post.
---

# EasySociable Content

Entry card for agents. **Do not invent a parallel workflow.** Instance SoT is
that engine's `Content Engine/CLAUDE.md` for explicit Content Engine commands.
For ordinary carousel creation, read
[references/CONTENT_INPUTS.md](references/CONTENT_INPUTS.md) and route by the
user's input. For topic-only fallback writing or long-form compilation, also
read [references/DISTILLED_CONTENT_SYSTEM.md](references/DISTILLED_CONTENT_SYSTEM.md).
Workflows here fill gaps or win when newer than the matching § in CLAUDE.md.

## Product boundary

- The Content Engine is an optional source-backed workflow for users who want
  durable knowledge, profiles and feedback.
- The default carousel workflow is user-first: a user's Writing Skill and
  approved copy outrank EasySociable's fallback writer.
- Formula records are internal reference/evaluation material. They are not a
  required user choice for topic-only generation and never override approved
  long-form copy.
- EasySociable supplies the content fallback and the visual production layer;
  it must not overwrite a user's voice or argument.

## Optional Content Engine loops (do not collapse)

```text
Knowledge   raw/ (immutable) → knowledge/pages (agent-maintained wiki) → index.md + log.md
Topics      Formula (F-…) → angle from knowledge pages → T-… (page 1 = the Formula's hook beat)
Runs        Topic's Formula beats → content.md + content-pack.v1 → Studio → feedback
```

| Stage | Owns | Does not |
|-------|------|----------|
| `raw/` | Verbatim sources + URL | Ever get edited after save |
| `knowledge/pages` | `source` / `concept` / `entity` / `synthesis` pages with `[[links]]` | Viral-post teardowns; facts no raw source supports |
| Topic `T-` | `formula_id` + `knowledge_ids` + Beat plan | Exist without a formula |
| Run | One platform; one page per formula beat | Re-pick the formula; idea → brief → packet → draft → editor → rubric chain |
| Workbench | Read-only observatory (Knowledge graph, Topics, Runs) | Source of truth (markdown is) |

## Hard rules

1. **No invented facts or quotes** — when running the source-backed Content
   Engine, slot text and Beat plans come from knowledge pages only; gaps go in
   **Do not claim**.
2. **Formula is optional outside explicit engine Topics.** Never invent `F-`
   ids. For user-provided long-form or page-copy input, do not call Formula
   recommendation or impose Formula beats. For an explicit `F-…` Topic request,
   follow the engine's Formula rules.
3. **Knowledge is compiled, not re-derived** — ingest updates every touched page, records contradictions instead of overwriting, regenerates `knowledge/index.md`, appends `knowledge/log.md`.
4. **Explicit engine Runs follow their Topic** — same beat count, order and
   roles; `layoutFamilyId = look.slides[n] ?? look.layouts[role]`. Ordinary
   user-first carousel runs use the generated page-copy and layout contracts,
   not a Formula binding.
5. **Rebuild workbench** after markdown writes in the engine vault (`python3 workbench/build.py`); after knowledge writes also `python3 scripts/lint-knowledge.py --engine .`.
6. Formula link for the user: `https://easysociable.com/formulas/<formula_id>` (redirects to its page).

## Create / serve / build

**This skill** is installed only via EasySociable CLI (`easysociable install --skills content…`). It is **not** shipped inside the public Content Engine git repo.

**Primary (public core — preferred):** clone the Content Engine repo, then run
workbench from that folder. See `LAYOUT.md` (core vs vault; optional
`engine.json` `vault_root`).

```bash
git clone https://github.com/murphywuwu/content-engine.git
cd content-engine
python3 workbench/build.py
python3 workbench/serve.py --no-open
```

**Optional:** `easysociable engine init --root <parent> --yes` clones the same
repo into `<parent>/Content Engine` (never overwrites an existing engine).

```bash
easysociable engine serve --engine <parent>/Content Engine --no-open
easysociable engine build --engine <parent>/Content Engine
```

`python3` is required for the workbench. Observatory: `http://127.0.0.1:8765/workbench/` — tabs **Knowledge** (graph) / Topics / Runs. If `serve.py` is already up, do not start a second server; rebuild only.

## Operate

1. Resolve account → profile when the user explicitly asks for Content Engine
   persistence (engine `CLAUDE.md`).
2. For carousel creation, read `references/CONTENT_INPUTS.md` and route by
   input type before touching the optional engine. Prefer engine `CLAUDE.md`
   sections for explicit engine commands; use `workflows/*` when that file is
   newer or the § is missing.
3. Always return a short result card in chat.
4. Rebuild workbench after writes.

| Intent | Action |
|--------|--------|
| User supplies page-by-page copy | Preserve it; hand off directly to **easysociable-slideshow** |
| User supplies long-form copy | Compile it into page-by-page copy without Formula; hand off to **easysociable-slideshow** |
| User supplies a Writing Skill + topic | Run that skill first; compile its output if needed; hand off to **easysociable-slideshow** |
| Topic only | Use the built-in fallback writer; choose structure internally; hand off to **easysociable-slideshow** |
| 采访我 / interview me / 完善人设 / 建立 profile | **workflows/INTERVIEW.md** (not a render) |
| 记一下 / 存资料 / ingest + link or file | Engine **§ Knowledge · Ingest** |
| 问知识库 / what do we know about X | Engine **§ Knowledge · Query** (offer to file back as `synthesis`) |
| lint 知识库 / 整理知识 | Engine **§ Knowledge · Lint** |
| 生成选题 / 用 F-… 生成选题 | Engine **§ Topics** |
| 开一单 / 用 T-… 开一单 | Hard gate → engine **§ Open a run** (ask platform; multi → N runs) |
| 1 page | No Formula or Template selection; use the visual production path. Invoke **easysociable-template** only when explicitly authoring a reusable reference design. |
| 2+ pages (any platform) | **easysociable-slideshow** (after the relevant identity check; Formula handoff only for an explicit legacy Topic) |
| X text-only | No render skill — ship copy from `content.md` |
| X with images (2–20 pages) | **easysociable-slideshow**; default canvas is Instagram-compatible 4:5 / 1080×1350 |

## Render hard gate

**Before any template/slideshow call:** Identity in `profiles/<active>/voice.md` — Role / What I build / Point of view — no `(fill)` and non-empty; `boundaries.md` exists with Not covering and Never claim both non-empty. Public handle MAY stay `(fill)`.

On fail: **stay in this skill**. List missing files. Do not call template or slideshow. User must say **强制继续** / **force continue** to proceed.

```bash
easysociable engine validate --root <engine> --require-knowledge
```

## Out of scope

No social posting, Content MCP, Local API, or SQLite content library.
