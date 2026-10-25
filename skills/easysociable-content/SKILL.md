---
name: easysociable-content
description: >
  Operate the EasySociable Content Engine: Knowledge (Karpathy LLM Wiki), formula-led
  Topics and Runs, profile, brand, media, workbench.
  Triggers: 采访我, 完善人设, interview me, who am I as a creator, 建立 profile
  — follow workflows/INTERVIEW.md (engine CLAUDE.md § Interview wins if present).
  Triggers: 记一下, 存资料, ingest, 问知识库, what do we know about, lint 知识库, 整理知识
  — follow engine CLAUDE.md § Knowledge (Ingest / Query / Lint).
  Triggers: 生成选题, 做成选题, 用 F-… 生成选题
  — follow engine CLAUDE.md § Topics (Formula → Knowledge).
  Triggers: 开一单, 用 T-… 开一单, 出图
  — follow engine CLAUDE.md § Open a run (content straight from the Topic's Formula).
  If no engine exists, copy/clone the Content Engine core (see Create below;
  `easysociable engine init` is optional offline scaffold). Then follow
  Content Engine/CLAUDE.md. Render handoff: easysociable-template (1 page) or
  easysociable-slideshow (2+, Formula handoff). Never publish or post.
---

# EasySociable Content

Entry card for agents. **Do not invent a parallel workflow.** Instance SoT is that engine’s `Content Engine/CLAUDE.md`. Workflows here fill gaps or win when newer than the matching § in CLAUDE.md.

## Product boundary

- Teach a **Content Engine**: knowledge you own → a formula-led topic → formula-led content → feedback that updates knowledge.
- **EasySociable** supplies the **Formulas catalog** and the **visual production layer** (Studio). It is not the content brain.

## Three loops (do not collapse)

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

1. **No invented facts or quotes** — slot text and Beat plans come from knowledge pages only; gaps go in **Do not claim**.
2. **No formula → no topic.** Never invent `F-` ids; read them from `easysociable formulas recommend` / `formulas get`. The opening line is written from the Formula's `hook` beat (old topics may still carry a `hook_id`: ignore it).
3. **Knowledge is compiled, not re-derived** — ingest updates every touched page, records contradictions instead of overwriting, regenerates `knowledge/index.md`, appends `knowledge/log.md`.
4. **Runs follow the Formula** — same beat count, order and roles; `layoutFamilyId = look.slides[n] ?? look.layouts[role]`.
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

1. Resolve account → profile (engine `CLAUDE.md`).
2. Route by intent (table below). Prefer engine `CLAUDE.md` sections; use `workflows/*` when that file is newer or the § is missing.
3. Always return a short result card in chat.
4. Rebuild workbench after writes.

| Intent | Action |
|--------|--------|
| 采访我 / interview me / 完善人设 / 建立 profile | **workflows/INTERVIEW.md** (not a render) |
| 记一下 / 存资料 / ingest + link or file | Engine **§ Knowledge · Ingest** |
| 问知识库 / what do we know about X | Engine **§ Knowledge · Query** (offer to file back as `synthesis`) |
| lint 知识库 / 整理知识 | Engine **§ Knowledge · Lint** |
| 生成选题 / 用 F-… 生成选题 | Engine **§ Topics** |
| 开一单 / 用 T-… 开一单 | Hard gate → engine **§ Open a run** (ask platform; multi → N runs) |
| 1 page | **easysociable-template** with `Formula: <id>` (after hard gate) |
| 2+ pages (any platform) | **easysociable-slideshow** *Formula handoff* (after hard gate + **ADR-0036 identity chain**: Studio login → API key → `easysociable auth login` → create) |
| X text-only | No render skill — ship copy from `content.md` |

## Render hard gate

**Before any template/slideshow call:** Identity in `profiles/<active>/voice.md` — Role / What I build / Point of view — no `(fill)` and non-empty; `boundaries.md` exists with Not covering and Never claim both non-empty. Public handle MAY stay `(fill)`.

On fail: **stay in this skill**. List missing files. Do not call template or slideshow. User must say **强制继续** / **force continue** to proceed.

```bash
easysociable engine validate --root <engine> --require-knowledge
```

## Out of scope

No social posting, Content MCP, Local API, or SQLite content library.
