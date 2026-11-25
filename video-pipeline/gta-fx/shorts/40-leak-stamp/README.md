# Rumor stamp (#40 · News & social)

This component marks a claim as a **rumor/leak (UNCONFIRMED)** or as **official (CONFIRMED)**. The claim sits on a card with a source chip and a dateline, and a verdict stamp slams onto the card at 0.4 s. It is 1080×1920, 30 fps and 7 s long, and it works over footage or as a transparent overlay.

## When to use it in a GTA 6 short
- **Leak and rumor roundups.** Stamp each claim before you talk about it, so viewers (and the comments) know you aren't presenting a leak as fact.
- **"Rumor vs reality" beats.** Show the rumor stamped UNCONFIRMED, then cut to the CONFIRMED version once Rockstar has said it.
- **Release-date and news recaps.** A confirmed seal on the facts you're sure of.

## Variants
| `variant` | Name | Look |
|---|---|---|
| `"0"` | Unconfirmed | Smoked-glass card in the hook band, mono dateline; a hollow stamp in Leonida sunset ink (pink → amber) hangs off its bottom edge |
| `"1"` | Confirmed | Ink-navy card above the caption zone, Rockstar-style dateline; a solid teal seal on its top edge, with a check that draws in |

`bg`: `"plate"` shows sample GTA VI footage, which shakes on the stamp impact. `"none"` gives a transparent overlay: the smoked card gets denser to make up for the missing backdrop blur, and the card still takes the impact nudge.

## CONFIG (top of the `<script>` in `index.html`)
Each of `CONFIG.variants["0"]` and `["1"]` has these fields:

| Field | What it does |
|---|---|
| `plate` | Sample footage path (preview only). |
| `theme` | `"smoke"` (smoked glass, white type), `"navy"` (ink-navy `#1F202B`, white type) or `"paper"` (white card, ink type). |
| `placement` | `"top"`: card in the hook band, stamp under it. `"bottom"`: card above the captions, stamp on top. |
| `source.label` / `source.name` | Chip text, e.g. "Source" + "Unverified X post" or "Rockstar Games". Name a real outlet or account only if it actually said it. |
| `source.icon` | `"question"` or `"check"`. |
| `date.text` | The dateline under the chip, e.g. "Posted · Nov 18, 2026" (when the claim surfaced) or "Verified · Nov 18, 2026" (when you checked it). Leave it empty to hide the line. |
| `date.style` | `"mono"` (JetBrains Mono, a data/terminal line) or `"rockstar"` (white caps tracked 0.35em with a magenta offset, the official date style; use it on dark cards only). |
| `claim` | The claim you're covering (creator fill). Two lines at 80 px; it auto-shrinks to stay at 3 lines or fewer. |
| `stamp.kicker` | Small tracked line inside the stamp ("Rumor / leak", "Official"). |
| `stamp.word` | The verdict ("Unconfirmed", "Confirmed", or e.g. "Debunked", "Leaked"). It auto-shrinks to fit the card width. |
| `stamp.style` | `"outline"` (hollow stamp) or `"solid"` (filled seal). |
| `stamp.color` | Anchor colour: the seal fill (solid), the outline ink when there's no gradient, and the chip icon disc. Amber `#FEB747` for rumor, teal `#2EC4B6` for confirmed; use `#FF3B3B` only for "debunked/fake". |
| `stamp.gradient` | Outline stamps only: the colour stops for the rule and word ink. The default is the Leonida sunset `["#F84FA4", "#FE8E4E", "#FEB747"]`. Remove it for a flat `color` outline. |
| `stamp.rotate` | Stamp tilt in degrees. |
| `stamp.check` | Draws a check mark in the stamp. |

Shared settings:
- `timing`: `cardIn` (card entrance start, 0.2), `cardDur` (entrance length, 0.32), `stamp` (the impact second, 0.40), `out` (exit start) and `end`, all in seconds.
- `impact`: `scaleFrom` (1.15), `settleFrames` (3) and `shake` (px, keep it ≤ 8). The stamp appears at full opacity on the impact frame.

## Render
```bash
# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o rumor-unconfirmed.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o rumor-confirmed.webm

# with footage
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o out.mp4
```

## Swap in your own clip
- Put your vertical clip in `assets/` and set `CONFIG.variants[v].plate` to its path.
- Also set the `src` of the matching `<video>` (`#plateA` for v0, `#plateB` for v1) to the same path. The script shows only the video whose `src` equals `plate`.
- Keep the clip at least 7 s long, or change `data-duration` to match.
- Or render with `bg:"none"` and lay the webm over your clip in the editor.

## Keywords
rumor, leak, unconfirmed, confirmed, official, verified, fact check, stamp, seal, source, dateline, claim card, news, GTA 6 leaks, release date, rumor vs reality, debunked, Leonida sunset, overlay
