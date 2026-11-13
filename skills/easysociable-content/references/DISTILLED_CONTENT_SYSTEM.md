# Distilled Content System

This document is the internal fallback writer's distilled knowledge from the
current Formula catalog snapshot: 29 cards, 2026-11-08. It is not a user-facing
Formula picker and it must not override a user's Writing Skill or approved
copy.

Source: the public Gateway Formula catalog (`/v1/formulas`) and each card's
beats, fit, unfit, needs, recipe and evidence fields. The catalog was read as
data, then grouped by mechanism rather than copied card-by-card.

## Corpus findings

The catalog contains six useful narrative mechanisms:

| Mechanism | Catalog signal | Distilled behavior |
|---|---|---|
| Tip / fact list | 19 cards; mostly `hook → point × N`, sometimes CTA | Open with a promise or tension, then give one concrete or counterintuitive idea per page. Use for unordered lists and wow facts. |
| Steps | 4 cards; `hook → point × N`, often CTA | Open with the result and step count. Each page contains one action and how to tell it worked. Use for ordered procedures, not collections of tips. |
| Mistake + fix | 1 card; `hook → point × 6` | Open with a warning. Each page pairs the behavior, why it backfires and the correction. |
| Wish-before / lesson | 1 card; `hook → point × 5` | Open with what the creator wishes they knew. Each page contrasts the prior belief with the lesson learned. Use for retrospectives and hidden knowledge. |
| Before / after | 1 card; `hook → other → point` | Open with the old and new state. Then explain the change and the resulting shift. Use for transformations and workflow upgrades. |
| Open / evidence / close | 3 `other` cards | Use when the argument is not a list: claim or tension, supporting points, underlying reason, then an optional action. |

Niche is not a writing mechanism. The same mechanism can transfer between
productivity, AI tools, engineering, relationships and general topics.

## Internal selection rules

Choose silently from the content shape:

```text
ordered actions or procedure      -> steps
mistake / correction               -> mistake + fix
explicit transformation            -> before / after
first-person retrospective         -> wish-before / lesson
unordered standalone facts/tips    -> tip / fact list
single claim or argument           -> open / evidence / close
```

Then fit the page count to the supplied material. Do not pad a short argument
to match a catalog card and do not remove pages from approved copy.

## Page-writing rules

- Page 1 earns the next swipe with a specific promise, tension, warning,
  contrast or result. Do not use a generic topic label as the hook.
- A page has one job. A `point` page contains one fact, action, mistake/repair,
  or lesson—not a mini essay.
- A useful point is concrete, observable or testable. Prefer a mechanism,
  example, number with a source, or before/after behavior over a vague benefit.
- Ordered content must make order visible. Unordered content must not pretend
  to be a sequence.
- A CTA is optional. Use one short action only when the source or user goal
  supports it; never append a generic follow request to approved copy.
- The narrative should pay off the opening claim. If the source cannot support
  a hook, weaken the hook rather than inventing evidence.

## Long-form compiler rules

When the input is a user's long-form copy, use this system only as a diagnostic
vocabulary. Do not select a mechanism and rewrite the argument around it.

1. Segment the source at its own paragraph, heading, example and turn points.
2. Label each segment as claim, reason, example, evidence, action, transition,
   conclusion or CTA.
3. Keep the source order unless the user explicitly asks for restructuring.
4. Promote a sentence to a headline only when it remains faithful to the
   surrounding paragraph.
5. Split overloaded segments; merge only fragments that are incomplete alone.
6. Preserve uncertainty, attribution and first-person boundaries.
7. Record source segment IDs on each page so a reviewer can trace the page back
   to the long-form input.

## Output contract

```json
{
  "pages": [
    {
      "index": 1,
      "role": "cover",
      "headline": "…",
      "body": "…",
      "emphasis": "…",
      "source": { "kind": "user-copy", "segments": ["p1"] }
    }
  ],
  "caption": "…",
  "voice": { "source": "user-writing-skill | easysociable-fallback" }
}
```

`role` is a production hint. It is not a Formula ID and must not determine the
user's narrative when source copy already exists.

## Evaluation cases

Every change to the fallback writer should be checked against at least:

- an unordered 5-item tip list;
- a 4-step procedure;
- a mistake/correction explainer;
- a before/after transformation;
- a first-person lesson sequence;
- a long-form essay whose original order must remain unchanged.
