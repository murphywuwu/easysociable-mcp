# Bind references to a Formula Look

A Formula is the structure distilled from a real viral post; its **Look** says
which reference design each slide uses. The slideshow skill reads it
(`look.slides["<n>"]`, else `look.layouts[<role>]`) whenever that Formula is used.

## When

After publishing the references for a post's pages (one reference per distinct
page layout, via `AUTHORING_FROM_IMAGE.md`).

## Steps

1. `easysociable formulas get --id <F-…> --json` — note its `beats` (slide order
   and roles) and existing `looks`.
2. Map each beat to a published design's `familyId`
   (`easysociable templates list --canvas 9:16 --json` shows `familyId`):
   - `layouts`: one design per role (`hook`, `point`, `cta`, …);
   - `slides`: only for a slide whose design differs from its role's default
     (1-based slide number → `familyId`).
3. Write the Look:

   ```json
   { "id": "L-<short-name>",
     "ref": { "platform": "tiktok", "platform_post_id": "<the post's id>" },
     "layouts": { "hook": "fam_…", "point": "fam_…", "cta": "fam_…" },
     "slides": { "2": "fam_…" } }
   ```

4. There is no public write API for Formulas: hand the JSON to the maintainer
   to append to that Formula's `looks` in the Directus admin (a new Look goes
   last, so the Formula's default Look — the first — does not change unless
   they choose to reorder).
5. Check: `easysociable formulas get --id <F-…> --json` shows the Look, and
   every `familyId` in it resolves with
   `easysociable templates source --family <familyId> --json`.

Never bind an agent-authored design that was not made from a real post: the
reference library only holds proven designs.
