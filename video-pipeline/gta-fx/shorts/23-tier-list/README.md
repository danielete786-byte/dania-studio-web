# 23 · Tier list

An S/A/B/C tier list for GTA 6 shorts. Items land in their tiers one at a time, then the board grows a "Comment yours" footer row to pull comments. The look borrows the GTA in-game menu: a dark board, hairline rows, and one solid white "selected" bar on the item that just landed. Empty slots show a quiet "?", and the final pick gets a punch and a lock-in ring. Use it in ranking shorts ("every GTA ranked", "GTA 6 cast ranked", "best trailer moments"), as the payoff of a compilation, or as the closing beat that turns a list into a comment fight.

1080×1920, 30 fps, 7.6 s. Overlay: it works over the sample plate or as a transparent overlay (`bg: "none"`).

## Variants
| `variant` | Name | What it does |
|---|---|---|
| `0` | Tier rows | One smoked-glass menu board with hairline rows and "?" ghost slots. Each item drops straight into its row, and the row flashes as it lands. The newest item carries the white menu "selected" bar, and the bar jumps to each new drop. The final pick punches, rings and keeps its row lit, then the board grows its "Comment yours" footer. The demo is every main GTA game from 1997 to 2013. |
| `1` | Tier reveal | One ink-navy menu board. Each name lands big on a "stage" under the board, wearing the white selected bar. Its tier row lights up, then the card rises to that row and slides into its slot. Same payoff and footer as Tier rows. The demo is the GTA 6 cast from the trailers. |

## CONFIG fields (top of the `<script>` in `index.html`)
- `tiers`: the row letters, top first, default `["S","A","B","C"]`. The first row's letter carries the sunset gradient. 4 rows fit comfortably. With more rows, or tiers that wrap, the rows shrink (to at most 70 %) so the board stays above y 1480.
- `dim`: how much the list darkens the clip behind it, from 0 to 1. This also applies to the transparent overlay.
- `cta`: the closing prompt. It appears as the board's footer row (Barlow caps), so keep it short.
- `variants["0"|"1"]`:
  - `plate`: the sample footage (preview only).
  - `kicker`: the small wide-tracked label.
  - `title`: the headline. It shrinks to fit automatically.
  - `items`: in reveal order, `{ name, sub, tier }`. `sub` is the small tracked second line (a year or a surname), and `tier` is one of the `tiers` letters. Any number per tier: the column count follows the fullest tier (2–4 columns), and a tier with more than 4 items wraps onto another line. Empty slots show a "?" ghost. The **last item gets the payoff** (punch, ring, row stays lit), so end on an S-tier pick. Names shrink to fit (down to 30 px, then wrap to 2 lines). Sublines tighten their tracking, then ellipsize.
  - `timing`:
    - `in`: entrance start.
    - `first`: when the first item lands.
    - `step`: seconds between items.
    - `cta`: when the prompt appears.
    - `out`: exit start.
    - `end`: end time.

  If you add items, move `cta` to 0.45 s after the last item lands: Tier rows `first + (count − 1) × step + 0.63`, Tier reveal `first + (count − 1) × step + 1.25`. With many items, lower `step` (Tier rows works down to about 0.36, Tier reveal to about 0.6) so everything lands before about 5.5 s.

## Render
```bash
# transparent overlay to drop on your own clip (CapCut / Premiere)
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o tier-list.webm
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o tier-list.mp4
```

## Use your own clip
Either render with `bg: "none"` and lay the webm over your footage, or put your file in `assets/` and point the variant's `plate` (and the matching `<video>` `src`) at it. Keep it at least 7.6 s long.

## Keywords
tier list, S tier, game menu, selected bar, ranking, ranked, GTA games ranked, GTA 6 characters, cast ranked, comparison, comment yours, engagement prompt, tier maker, top list, empty slots, footer CTA, overlay
