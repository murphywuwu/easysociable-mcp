---
name: easysociable-tweet-image
description: >
  Turn one or many X (Twitter) posts into clean PNG images with the `easysociable tweets render`
  CLI. Use when the user pastes x.com / twitter.com status links (or tweet ids) and wants
  images, screenshots or "cards" of them — e.g. "tweet to image", "turn these tweets into
  pictures", "推文转图片", "把这几条推特做成图". One link → one PNG; never a carousel.
  Do not use for writing new tweets, multi-slide carousels (use easysociable-slideshow), or
  scraping profiles/timelines.
---

# EasySociable Tweet Image

Renders each X post as its own PNG: avatar, display name, verified badge, @handle, text,
up to 4 media thumbnails, timestamp and reply/like counts on a gradient background.
Tweets are fetched through the EasySociable gateway (login required, free quota) and
rendered locally on this machine.

## Run

```bash
easysociable tweets render <link-or-id> [more links…] --json
easysociable tweets render --file links.txt --json      # one link per line
```

| Flag | Default | Values |
|---|---|---|
| `--size` | `auto` | `auto` (card height fits the tweet) · `4:5` · `3:4` · `9:16` · `1:1` |
| `--theme` | `light` | `light` · `dark` |
| `--background` | `plum-plate` | `none` · `#hex` · `plum-plate` `sunset` `oceanic` `hyper` `cotton-candy` `gotham-dark` `neon` `emerald` `night-fade` `midnight` |
| `--hide-metrics` | off | hide reply/like counts |
| `--out` | `./tweets` | output folder; files are `tweet-<handle>-<id>.png` |

If the command says `EASYSOCIABLE_API_KEY is required`, ask the user to run
`easysociable auth login` (opens the browser), then retry.

## Rules

1. **Never rewrite, translate, summarize or "fix" tweet text.** The image must show the post exactly as published. Same for author name, @handle and avatar — do not swap or hide them.
2. **One link → one image.** Do not merge tweets, build threads or carousels. Duplicates are rendered once.
3. **Do not ask about size, theme or background up front.** Use the defaults unless the user already said what they want (e.g. "for Instagram" → `--size 4:5`, "for Stories/TikTok" → `--size 9:16`, "dark mode" → `--theme dark`, "no background"/"transparent" → `--background none`).
4. **Failures are final, not something to work around.** `TWEET_NOT_FOUND` (deleted), `TWEET_UNAVAILABLE` (protected, age-restricted, suspended) and `INVALID_TWEET_URL` must be reported as failed. Never reconstruct a tweet from memory, search results or another site.
5. `RATE_LIMITED` is retried automatically; if it still fails, tell the user to rerun just the failed links in a minute. `UPSTREAM_UNAVAILABLE` → suggest retrying later.
6. Pass every link the user gave in one command (batch); don't loop one call per link.

## Report

Exit code 1 means at least one item failed; the others still rendered. Reply with a short
per-link table from the `--json` items:

| Link | Result |
|---|---|
| x.com/jack/status/20 | `./tweets/tweet-jack-20.png` |
| x.com/foo/status/123 | failed — deleted (`TWEET_NOT_FOUND`) |

Mention `warnings` only if present (e.g. avatar or media could not be downloaded, so a
placeholder was used). Repost and view counts are not available from X and are never shown.
