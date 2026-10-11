# Platform image specs (single-page template canvases)

Use agent-reach / industry guides (2026). Platforms change crop behavior; prefer the **Recommended** row for new templates. Always store exact `canvas.width/height` plus `canvasPreset`.

`platforms` is a **multi-select** array. Include every platform this page is intended for; add `generic` only when the board is intentionally cross-postable without a primary home.

## Platform enum (catalog)

```text
xiaohongshu | tiktok | instagram | threads | x | linkedin | wechat_cover | generic
```

Legacy alias: treat former Twitter as **`x`**.

---

## Per-platform boards (for PageTemplate authoring)

### Xiaohongshu（小红书）— `xiaohongshu`

| Use | Preset | Pixels | Notes |
|---|---|---|---|
| **图文笔记（推荐）** | `3:4` | **1080×1440** | Largest feed footprint; keep cover + inner pages same ratio |
| Square note | `1:1` | 1080×1080 | OK, less feed height than 3:4 |
| Landscape | `custom` / avoid for cover | 1440×1080 (4:3) etc. | Weak in feed; not a default template target |
| Max images / note | — | up to ~18 | Product convention; not a canvas rule |

**Default for new XHS templates:** `3:4` @ 1080×1440.

### TikTok — `tiktok`

| Use | Preset | Pixels | Notes |
|---|---|---|---|
| **Photo Mode / slideshow（推荐）** | `9:16` | **1080×1920** | Full-screen; matches native video |
| Portrait alt | `4:5` | 1080×1350 | Supported; letterboxing vs 9:16 |
| Square | `1:1` | 1080×1080 | Supported; bars in vertical feed |
| Typical carousel count | — | ~4–35 photos | Design for 9:16; keep all slides same size |

**Default for TikTok page templates:** `9:16` @ 1080×1920. Keep UI/text out of bottom/side safe zones used by TikTok chrome.

### Instagram — `instagram`

Meta help: feed width up to **1080px**; aspect between ~**1.91:1** and **4:5** (taller may crop). Practical authoring:

| Use | Preset | Pixels | Notes |
|---|---|---|---|
| **Feed single / carousel（推荐竖版）** | `4:5` | **1080×1350** | Max common feed height |
| Square feed / safe carousel | `1:1` | 1080×1080 | Safest cross-placement |
| Tall grid-oriented | `3:4` | 1080×1440 | Within Meta’s upper portrait band; confirm crop |
| Stories / Reels still | `9:16` | 1080×1920 | Full-bleed stories; not default “feed card” |
| Landscape | ~`21:9` family | 1080×566 (1.91:1) | Link-style / wide; poor mobile height |

**Carousel rule:** all slides **same aspect** as slide 1 or later slides get center-cropped.  
**Default for IG feed templates:** `4:5` @ 1080×1350 (or `1:1` if user wants max compatibility).

### Threads — `threads`

Aligned with Meta/IG feed conventions:

| Use | Preset | Pixels | Notes |
|---|---|---|---|
| **Feed（推荐）** | `4:5` | **1080×1350** | Best vertical presence |
| Square | `1:1` | 1080×1080 | Safe |
| Full-bleed vertical | `9:16` | 1080×1920 | OK for immersive; may crop in some feed contexts |
| Landscape | custom | ~1080×566 | Least feed height |

**Carousel:** keep one aspect for all slides (first slide wins). Cap commonly cited ~10–20 images — not a canvas constraint.  
**Default:** `4:5` @ 1080×1350 (often shared with Instagram assets).

### X (Twitter) — `x`

| Use | Preset | Pixels | Notes |
|---|---|---|---|
| **Single in-stream（推荐）** | ~`16:9` → use `custom` or map to wide | **1200×675** | Timeline-friendly; less aggressive crop |
| Square | `1:1` | 1200×1200 or 1080×1080 | Good for multi-image / quotes |
| Tall | `4:5` | 1080×1350 | Often cropped toward landscape in timeline |
| Link / card style | custom | 1200×628 (~1.91:1) | Summary large image cards |
| Multi-image | often `1:1` or `16:9` | keep set consistent | Up to 4 images per post |

**Default for X single-card templates:** **1200×675** (`canvasPreset: custom` with note `x_instream_16x9`, or document as wide). Prefer landscape text layouts; center critical content.

### LinkedIn — `linkedin`

| Use | Preset | Pixels | Notes |
|---|---|---|---|
| **单图帖（推荐方）** | `1:1` | **1080×1080** | Broad desktop + mobile |
| 单图竖版 | `4:5` | 1080×1350 | Stronger mobile height |
| 单图横版 / link-ish | custom | 1200×627 (~1.91:1) | Link preview family |
| **Document carousel PDF 页** | `1:1` or `4:5` | **1080×1080** or **1080×1350** | Organic “carousel” is usually multi-page **PDF**; all pages same size |
| Landscape deck page | ~`16:9` | 1920×1080 | Data-heavy slides; weaker mobile |

**Default for LinkedIn page templates:** `1:1` @ 1080×1080, or `4:5` @ 1080×1350 when user wants mobile-first document carousels.  
Note in `shortDescription` if the page is meant for **PDF document posts** vs single image posts.

### WeChat Official Account covers — `wechat_cover`

| Use | Preset | Pixels | Notes |
|---|---|---|---|
| **主封面 21:9** | `21:9` | **2100×900** (or 1125×481-class) | Wide hero |
| **分享 1:1** | `1:1` | **1080×1080** | Square share card |

Often authored as a **pair** of single-page templates (wide + square), not one carousel pack. Defaults match existing Guizang-style boards when users ask for 公众号封面对.

### Generic — `generic`

No platform chrome assumptions. Still pick a concrete preset (`1:1`, `4:5`, `3:4`, `9:16`, …). Use when the page is a reusable brick across networks **and** the chosen ratio is listed as Recommended or Supported for each target in `platforms`.

---

## Preset → default pixel map (authoring shortcut)

| `canvasPreset` | Default pixels | Primary platforms |
|---|---|---|
| `3:4` | 1080×1440 | xiaohongshu, (instagram tall) |
| `4:5` | 1080×1350 | instagram, threads, linkedin portrait |
| `1:1` | 1080×1080 | linkedin, instagram/threads safe, x multi |
| `9:16` | 1080×1920 | tiktok, IG/Threads stories-style |
| `21:9` | 2100×900 | wechat_cover wide |
| `custom` | explicit only | **x** 1200×675, link cards 1200×628, etc. |

---

## Layout Family (multi-platform create)

Creating a template **defaults** to a Layout Family with one master page + derived presets — see `workflows/MULTI_PLATFORM_FAMILY.md`.

Same-preset platforms share one variant tree (**Instagram + Threads → `4:5`**). Do not invent a second 4:5 page for Threads.

Typical vertical bucket when master is `3:4` (Xiaohongshu): also derive `4:5`, `9:16`, `1:1`. Absolute layout cannot share one AST across those presets — hand-tune each variant after derive.

## Selection rules for Agents

1. If user names one platform only → set master `platforms: [that]` + that platform’s **Recommended** row; skip family derive unless they later ask for more.  
2. If user names several **or** does not limit platforms → pick a master Recommended canvas, then derive the default vertical targets (`MULTI_PLATFORM_FAMILY.md`).  
3. Never mix presets across slides of one deck without an explicit user choice (IG/Threads/TikTok crop to first slide).  
4. Each family variant’s P0 `selectionMetadata` must list only platforms that match that page’s `canvasPreset`.  
5. Specs above are **practical authoring targets** (2026 guides + Meta help for IG). Re-verify if a platform announces breaking crop changes.

## Sources (research snapshot)

- Meta Instagram help: feed width ≤1080px; aspect ~1.91:1–4:5  
- Industry 2026 guides: X 1200×675; LinkedIn 1080×1080 / 1080×1350 (+ PDF carousels); Threads ≈ IG 4:5; TikTok Photo Mode 1080×1920; 小红书 1080×1440 3:4  
