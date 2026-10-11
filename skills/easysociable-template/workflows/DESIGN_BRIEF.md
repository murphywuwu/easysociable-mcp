# Design brief (required when there is no reference image)

When the user gives **only a text description** (no template/reference image), do **not** jump straight to nodes/slots.

Act as a **professional editorial / social-card strategist**. First produce an intent-and-constraint **Design Brief**. Do not treat this brief as the final visual solution: continue to `DESIGN_PHILOSOPHY.md`, then `DESIGN_CONCEPTS.md`, before materializing nodes.

Skip this workflow when `AUTHORING_FROM_IMAGE.md` applies and a reference image is the primary input (optional short brief still OK).

## When to run

- `source.kind = text_brief`
- User has no uploaded layout reference
- Or user says “按描述做一页模板 / 帮我设计”

## Process

### 1. Gather intent (batch questions; skip known answers)

- **Master** platform + canvas from `references/PLATFORM_SPECS.md`, plus default multi-platform derive targets (`MULTI_PLATFORM_FAMILY.md`) unless the user wants one platform only
- Page roles (1–2) + contentFamily / archetypes / density (`CATALOG_METADATA.md`)
- Content job: what must the viewer understand in one glance?
- Must-have slots: title / metric / image / CTA / fixed N checklist lines…
- Theme/preview direction (swiss / editorial / bold_promo / minimal / dark). Note brand hex or archetype for `DESIGN_INTELLIGENCE.md` palette seeding → Family `preview_tokens`

### 2. Write the Design Brief

Use this structure (Chinese or English to match the user):

```markdown
# Design Brief — <template name>

## 1. Job to be done
- One-sentence purpose of this page
- Master platform + canvas (preset + pixels) — cite PLATFORM_SPECS recommended row
- Multi-platform targets (default vertical bucket unless user limited) — `MULTI_PLATFORM_FAMILY.md`

## 2. Visual constraints
- Desired/forbidden moods or brand rules
- Existing Theme/brand assets to reuse
- Accessibility or locale constraints

## 3. Information hierarchy
- One primary focal message
- Secondary evidence and author/brand attribution
- Content priority when space is constrained
- **Flat frames only:** describe regions as independent absolute boxes on the canvas. If a “card” appears, it is a background panel **plus** separate content boxes — not one parent wrapping children.

## 4. Slot plan
- Table: key | type | required | maxLines/maxCharacters | purpose
- fixedItemCount if checklist/steps
- Optional regions that omit-when-empty (independent blocks only)

## 5. Catalog metadata draft
- platforms, canvasPreset, supportedRoles, contentFamily, archetypes, density, requiresImage…

## 6. Risks / open questions
- e.g. need user photo? checklist line count? LinkedIn PDF vs single image?
```

Design rules to enforce in the brief:

- One primary focal idea per page  
- Strong type hierarchy; avoid SaaS-card clutter  
- Theme owns color/font; page owns structure  
- Match **Recommended** canvas for the primary platform  
- Absolute layout: do not promise packing empty checklist lines  
- No nested absolute groups (avatar/name inside a card wrapper); text-only inline nesting is fine  

### 3. Confirm intent when needed

Ask once:

> 先确认内容目标和约束；OK 后我会先定视觉哲学，再给 2–3 个版式方向，最后生成可编辑模板。

Incorporate edits. If the user already said “直接做” or supplied enough constraints, continue without another blocking question.

### 4. Continue to art direction

Do not create nodes yet. Continue in this order:

1. `DESIGN_PHILOSOPHY.md` — name the movement and lock shared visual philosophy
2. `DESIGN_CONCEPTS.md` — 2–3 spatial expressions of that philosophy; select one
3. `ASSET_PLAN.md` — decide reuse / CSS-SVG / generated assets
4. `PALETTE_REVIEW.md` + `THEME_FROM_BRAND.md` — lock `theme-tokens.json` when co-creating Theme
5. Validate `design-plan.json` and `theme-tokens.json`
6. `AUTHORING_FROM_BRIEF.md`

## Anti-patterns

- Generating HTML/nodes before philosophy and concept selection when there is no reference image
- Vague briefs (“好看一点”) without zones, hierarchy, or slot plan
- Ignoring PLATFORM_SPECS recommended sizes
- Treating one generic “minimal/professional” paragraph as a design concept or philosophy
