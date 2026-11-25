# 25 · Trailer views race (stat-bars)

Category: Comparisons · Kind: overlay (works over the sample plate or as a transparent overlay)

## What it's for
A data beat for GTA 6 shorts. Real YouTube view counts race to their totals: Trailer 1 305.4M, Trailer 2 189.6M, Launch Trailer 82.0M (Rockstar Games channel, as of Nov 18, 2026). Every counter runs on one shared clock (same start, same ease, same landing), so each value is the same fraction of its total on every frame. The ranking and the bar ratios are therefore true from the first frame: Trailer 1 leads the whole way, and a glance at any moment reads the right winner.

Use it for:
- "how big is the GTA 6 hype" moments;
- "which trailer won" segments;
- any ranked number comparison in a compilation.

Drop it over trailer or gameplay footage while the voiceover says the numbers.

Every numeral is a per-digit odometer. Each digit is a masked wheel that rolls vertically with a vertical motion blur while it moves, and settles sharp when it lands. A leading zero never shows. In v0 (right-aligned values) a new leading slot opens while it is still blank, just before its digit rolls in. In v1 (centred numerals) every slot is reserved from the start, so the numeral never moves sideways.

- **Variant 0 "Bars"**: a deep smoked-glass card with three labelled 36 px bars. Each bar is always value / max, so the bars grow in their true ratio. The leader's value is a 128 px numeral with its label stacked over its date. At the payoff:
  - the leader settles with a pop;
  - one sunset sheen crosses its bar;
  - the other rows step back to a ranked grey (white fills at .38, labels and values at .80);
  - a "+115.8M AHEAD OF TRAILER 2" pill (Barlow caps) pops in the footer row, opposite "AS OF NOV 18, 2026" (Inter caps, the date voice).
- **Variant 1 "Big number vs"**: a 248 px leader numeral over a 196 px runner-up, with a glass VS chip between them. Each numeral sits in fixed, centred slots, so it never drifts as it gains digits.
  - Both numbers roll on the shared clock and land together at 1.8 s.
  - The sunset gradient sweeps across the winner, and a "▲ +115.8M VIEWS AHEAD" chip pops at 2.1 s.
  - At 3.0 s one slow sunset sheen (1.2 s) crosses 305.4M, so the hold is never static.

Timing: 5.0 s at 30 fps.
- Entrance at 0.10 s.
- All counts run 0.30 → 1.80 s on one `power3.out` clock.
- Payoff at 1.8 s (pop, sheen or gradient sweep).
- Pill at about 1.96 s (v0) or chip at 2.10 s (v1).
- Hold: the v0 card drifts a few px; v1 pushes in slowly and gets one sheen at 3.0–4.2 s.
- Clean fade from 4.60 to 4.95 s, so it loops.

## CONFIG fields (top of the script in `index.html`)
| Field | Meaning |
|---|---|
| `eyebrow` | `[bright, dim]` header parts, joined by " · " ("GTA 6 trailers", "YouTube views"). Shown in caps in both variants. |
| `source` | v0 footer, left side ("as of Nov 18, 2026") |
| `unit`, `decimals` | Number suffix ("M") and decimal places (1). The odometer builds one wheel per digit from these. |
| `items[]` | `{ label, date, value }` for each entry. v0 sorts them by value; the top one gets the gradient bar, the 128 px numeral and the margin pill. |
| `variants["0"].plate` | Sample plate under variant 0 |
| `variants["0"].gapWord` | Words in the margin pill ("ahead of" gives "+115.8M AHEAD OF TRAILER 2"; shown in caps) |
| `variants["1"].plate` | Sample plate under variant 1 |
| `variants["1"].a / .b` | Indexes into `items` for the head-to-head (default 0 vs 1). `a` must be the larger value: it takes the sunset. |
| `variants["1"].leadSuffix` | Text after the computed margin ("views ahead") |
| `timing.in` | Entrance time |
| `timing.count` | When every counter starts |
| `timing.land` | When every counter lands (all together). This is the payoff: pop, sheen or gradient sweep, then the pill or chip. |
| `timing.ease` | The one shared count ease (`power3.out`). Every value is `total × ease((t − count) / (land − count))`, so the ranking is true on every frame. |
| `timing.sheen` | v1 only: `[start, duration]` of the slow sunset sheen across the winning numeral during the hold (`[3.0, 1.2]`) |
| `timing.out` | Exit start (0.35 s fade) |
| `timing.end` | Composition end. If you change it, also change `data-duration` on `#root`, the videos and `#ov`. |
| `maxBlur` | Maximum vertical motion blur in px on a fast-rolling digit (6). It is scaled down for small numerals. |

Bar widths are true to the data (value / max × track width). Both margins are computed: v0 from the top two items, v1 as |a − b|. If you change the numbers, the odometer slots and the leading-digit openings recompute. Because every counter shares one clock, the ranking stays true on every frame for any data.

## Render
```bash
# with sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o bars.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o vs.mp4
# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o bars.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o vs.webm
```
With `bg: "none"`, v1 uses a lighter, tighter scrim (.36 centre, 1000 × 900) so bright daylight clips don't get a grey smudge. The type's soft shadows carry legibility.

## Swap in your own clip
The overlay works on any footage with `bg: "none"`. To preview over your own clip:
1. Put it in `assets/` (for example `assets/myclip.mp4`, 1080×1920).
2. Change the `src` of `#plateA` (variant 0) or `#plateB` (variant 1) in `index.html`, and the matching `CONFIG.variants[n].plate`.
3. Set `data-media-start` to where your shot begins. Remove `data-playback-rate`, or set it to 1, for normal speed.

The samples are chosen so that no cut lands under the graphic:
- v0 plays p05 at 1.0× from 0 s (its first cut is at 5.03 s);
- v1 plays p04 at 0.88× from 0 s (its first cut is at 4.43 s).

To compare other numbers (subscribers, likes, prices, map sizes), edit `items`, `unit` and `decimals`.

## Keywords
gta 6, gta vi, trailer views, youtube views, bar chart race, race, stat bars, versus, big number, counter, count up, odometer, rolling digits, motion blur, comparison, data, stats overlay, leonida sunset, smoked glass, transparent overlay
