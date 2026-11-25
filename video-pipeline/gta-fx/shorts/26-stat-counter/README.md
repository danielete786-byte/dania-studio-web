# 26 · Stat count-up

A huge real number rolls into place on a slot-style odometer, so a short can land a fact like "305,372,086 views on Trailer 1" or "90M+ views in 24 hours". Each digit is clipped to the number's cap line. Fast columns whir with vertical motion blur, and slow ones tick crisply into place, then the number lands with a punch. 1080×1920, 30 fps, 7 s. It is an overlay: use it over the sample footage, or export it with a transparent background and drop it on your own clip.

## When to use it in a GTA 6 short
- **Count-up (variant 0):** a hype or news beat ("Trailer 1 now has…"), a record-breaking stat, or a number reveal before the punchline. Free-floating type sits in the upper-middle of the frame on a soft left-anchored smoke. "000,000,000" is on screen from frame 2, rolls from 0.12 s and settles on the real value at 1.1 s. Then the sunset rule flashes and the source line appears.
- **Record badge (variant 1):** a solid ink card for a one-line record ("90M+ views in 24 hours"). Use it as a stinger after a hook, or as the payoff of a "biggest launch ever" clip. The card arrives showing "60M+", the leading digit ticks up 70 → 80 → 90, and at 0.8 s "90M+" **stamps**: it slams 1.12 → 1 in 3 frames with a flash and a footage shake.

## CONFIG fields (top of the `<script>` in `index.html`)
`CONFIG.variants["0" | "1"]`:

| Field | Variant | Meaning |
|---|---|---|
| `plate` | both | Sample clip under the overlay when `bg = "plate"` |
| `value` | both | The number as text. Digits roll; commas and dots stay fixed (`"305,372,086"`, `"90"`, `"1.5"`) |
| `from` | both | What the counter shows before it rolls, in the same shape as `value` (`"000,000,000"`, `"60"`) |
| `suffix` | both | Static text after the number (`"M+"`, `"%"`, `""`) |
| `numSize` / `maxWidth` | both | Numeral size in px; it shrinks to fit `maxWidth` automatically |
| `kicker` | 0 | Wide-tracked label above the number |
| `sub` | both | The label under the number ("views on YouTube", "views in 24 hours") |
| `meta` | 0 | The source and date line under the label |
| `scrim` | 0 | `"always"` (default: the smoke ships in the transparent export too, so it holds on bright clips), `"plate"` (only over the sample footage) or `"off"` |
| `chip` | 1 | Wide-tracked caps at the top of the card (Rockstar date style, magenta offset) |
| `footL` / `footR` | 1 | The footer line of the card (centred, with a hairline divider) |
| `gradient` | 1 | Three colours for the numeral fill (Leonida sunset by default), one sweep across the whole word |
| `stamp` | 1 | `{ scale, frames, shake }`: the land slam (1.12 → 1 over 3 frames) and the footage shake in px (6). With `bg: "none"` the card jolts instead |

`CONFIG.roll["0" | "1"]`:
- `start`: when the columns start rolling.
- `firstLand` / `lastLand`: when the first and the last column land.
- `order`: `"ltr"` (the leftmost lands first, a slot-reel settle) or `"rtl"`.
- `ease`: `"expo"` (fast start, long settle: count-ups), `"out3"` (power3.out) or `"in"` (accelerates into the land: stamps).
- `spinsMin` / `spinsMax`: extra full turns for the early-landing and late-landing halves of the columns. Keep the leading half at 0 so the number only counts up.
- `minCells`: the minimum travel per column (0 lets a column that already shows its digit stay put).
- `tickFrac` (optional): the longest tick as a fraction of a digit's time slot (default 0.38; v1 uses 0.7 so every 60 → 90 tick slides).

`CONFIG.odo`: `pitch` (reel cell spacing × digit height, 1.22), `pad` (window bleed past the cap box, 0.035), `fade` (edge mask while moving, 0.3), `tick` (the longest digit tick, 0.1 s = 3 frames) and `blur` (max motion blur × digit height, 0.05).
`CONFIG.timing`: `in` (entrance start per variant), `out` (exit start, 6.42 s), `end` (7.0 s).

**Tips:**
- Ticks are whole frames on the 30 fps grid, so a still never catches a half-and-half digit. Render at 30 fps.
- For a longer number, widen `lastLand − firstLand` so the columns settle one after another.
- For a stamp, use a short `from` → `value` jump with `ease: "in"`.

## Render
```bash
cd gta6/26-stat-counter
# over the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o countup.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o record.mp4
# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o countup.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o record.webm
```

## Swap in your own clip
Put a 1080×1920 clip in `assets/plates/`, then point the variant's `plate` at it **and** change the `src` of the matching `<video class="clip plate">` (`#plateA` is variant 0, `#plateB` is variant 1) to the same path. Or render with `bg: "none"` and layer the WebM over your edit. v0 keeps its smoke, and v1's stamp jolts the card instead of the footage.

## Facts used
Trailer 1 has 305,372,086 views on the Rockstar Games YouTube channel as of 2026-11-18 (305.4M). Trailer 1 set YouTube's 24-hour record for a non-music video with 90M+ views (research/gta6/FACTS.md).

## Keywords
stat counter, count-up, number roll, odometer, slot counter, digit ticker, rolling digits, motion blur digits, view count, record badge, stamp, 24-hour record, big number, stat callout, trailer views, YouTube record, GTA 6, overlay, transparent
