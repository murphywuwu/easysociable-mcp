# Content input modes

The Content Skill is an adapter, not a required Formula or knowledge-base
workflow. Choose the least transformative path that can produce the requested
output.

## Routing

```text
page-by-page copy  -> validate and pass through
long-form copy     -> compile into page-by-page copy
outline            -> expand into page-by-page copy
topic only         -> generate page-by-page copy
```

Writing authority follows this order:

1. copy the user explicitly approved;
2. follow the user's Writing Skill, voice instructions and supplied examples;
3. use supplied knowledge or sources;
4. use the EasySociable Content Skill as the fallback writer.

Do not apply an EasySociable Formula to approved long-form copy. The source
already contains its own argument and rhythm. The long-form compiler may split,
compress and title content for pages, but must preserve meaning, order and
voice. It must not invent facts or add a mandatory hook/problem/solution arc.

## Internal page-copy shape

This is an intermediate contract, not a user-facing template selector:

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
  "voice": { "source": "user-writing-skill" }
}
```

`role` is a weak production hint. It does not prescribe a narrative formula.
The Slideshow Skill may choose a different visual treatment without changing
the copy's order or meaning.

## Topic-only fallback

When there is no user Writing Skill or supplied copy, the EasySociable Content
Skill may choose a suitable structure internally. Do not ask the user to select
a Formula. Treat the old Formula catalog as internal reference and evaluation
material only.

## Evidence

Knowledge is optional at the entry point. If facts matter, use supplied
materials or research and retain source URLs. If a claim cannot be verified,
label it as opinion, example or a question instead of making it sound factual.
