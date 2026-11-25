# End card (GTA 6 component #50, Calls to action)

The closing card of a GTA 6 short, in Rockstar's end-tile language. Your last shot stays full-width, and nothing is boxed. One solid tile slides over it, and every line of type sits on that clean tile. The release date tracks in as wide-tracked caps, and your channel name rises in, paired with a small fan-edit line like the legal line on Rockstar's own end tiles. Each frame has one accent. In v0 it is Rockstar's crisp right-side magenta offset on the two-line date. In v1 it is the sunset sky itself.

**When to use it in a GTA 6 short:** as the last 2–4 seconds of any GTA 6 short (a trailer breakdown, a "things you missed", a countdown, a compilation). It turns your final clip into a branded sign-off with the date viewers care about.
- Use variant 0 for night, moody or neon edits, or any time you want the closest match to Rockstar's own ink end tile.
- Use variant 1 for warm, golden-hour or "hype" edits.

Type starts at 0.38 s in v0 and at 0.32 s in v1, so the first line arrives as the tile lands, and the channel name has landed by about 1.2 s. At 6.3 s the type clears and the tile slides away, so the last frame is your clip at full frame and the card loops cleanly.

- 1080x1920, 30 fps, 7 s. Footage always shows, because this is a full-frame component.
- Variables:
  - `variant`: `"0"` Ink tile + date, `"1"` Sunset card.
  - `bg`: kept for library consistency. This component always shows its CONFIG clip.

| Variant | Tile | Type (3 sizes per frame) |
|---|---|---|
| 0 Ink tile + date | A flat ink-navy `#1F202B` tile rises from the bottom. The footage is clear above y 860, and a 120 px seam makes the ink solid by y 980 | Two tight pairs, centred in the ink between y 980 and 1480. First, Rockstar's two-line date card: the date is Inter 700, 58 px caps tracked 0.21em, with a crisp 3px/2px `#EE08F2` magenta offset and a faint bloom, so it is the heaviest thing on screen. Under it, "SEE YOU IN LEONIDA" is Inter 600, 40 px, tracked 0.24em, with the same offset. Then the sign-off: the channel name (Inter 600, 40 px) over the 28 px fine print |
| 1 Sunset card | The tile is the sunset: plum `#2C1446` to `#6B2A6E` to rose `#C9566F` to peach `#F08A62`, falling from the top. It ends in a hard horizon at y 760: a 2 px peach hairline on its last rows, with clear footage straight below | Two groups. First, "SEE YOU IN" (28 px tracked) over "VICE CITY" (Inter 700, 136 px, tracked 0.10em, about 73% of the frame width, with a soft plum shadow and no magenta) over the tracked date (28 px). Then, after about 100 px of air, the channel name (40 px) and the fine print (28 px, 82% white so it holds on the rose part of the sky) |

## CONFIG fields (top of the `<script>` in `index.html`)
| Field | What it does |
|---|---|
| `channel` | Channel name that signs off the card (both variants), e.g. `@everestchris6` |
| `finePrint` | Small legal-style line. `""` hides it |
| `variants["N"].style` | `"ink"` (navy tile) or `"sunset"` (the sunset-sky tile) |
| `variants["N"].clip` | Path of the clip the card plays over |
| `variants["0"].date`, `.line2` | Date line and the second line under it (typed in normal case; both shown as tracked caps with the magenta offset) |
| `variants["1"].eyebrow`, `.title`, `.date` | Small tracked line, big title, and tracked date line |
| `variants["N"].veil.from` | `"bottom"` (tile rises, footage on top) or `"top"` (tile falls, footage below) |
| `variants["N"].veil.edge`, `.fade` | `edge`: the y (px) where clear footage starts. `fade`: how long the soft seam into the tile is. v0 uses a 120 px seam. v1 uses `0`, a hard edge, which is its horizon. In v1 the 2 px horizon hairline is drawn automatically on the tile's last two solid rows (`edge - fade - 2`). Keep the type off any seam |
| `variants["N"].shot.focus` | `[x, y]` point of your clip (0–1), e.g. a face, that should sit in the clear footage |
| `variants["N"].shot.to` | The y (px) where that point settles once the tile is in. The move is clamped so the clip's edge always stays under the tile. Keep it a little below the clamp (v1 uses 1110, which leaves a 72 px margin) so the clip's top rows stay hidden |
| `variants["N"].shot.push` | Slow push-in while the card holds (`0.05` = 5%) |
| `variants["N"].layout` | Top (px) of each text line. Keep text between y 230 and 1480, and on solid tile (above `edge - fade` in v1, below `edge + fade` in v0) |
| `variants["N"].timing` | Optional per-variant overrides of any `timing` field. v1 sets `{ type: 0.32 }`, so its title rises while the tile lands |
| `timing.tile`, `.tileDur` | When the tile starts sliding over the footage, and how long it takes |
| `timing.shot`, `.shotDur` | When the footage starts settling, and how long it takes. Keep it starting after `tile` |
| `timing.type`, `.step` | When the first text line lands (0.38 s), and the gap between lines (one line leads at a time) |
| `timing.out`, `.reopen`, `.end` | When the type clears, when the tile slides away again, and the total length |

Colours are CSS tokens at the top of the `<style>` block: `--ink-navy`, `--magenta`, `--sunset-sky` (the v1 tile gradient) and `--sunset-horizon` (the v1 horizon hairline). Type sizes, the magenta offset shadows (v0 date and line 2) and the v1 title's soft shadow are in the CSS rules below them. If you change the v0 date's shadow, also change `BLOOM_ON` in the script, which is the value it ramps to. The v1 title is at the largest size that keeps its ink inside the x 936 safe edge, so if you type a longer title, lower its `font-size`.

## Swap in your own clip
1. Copy your vertical clip (1080x1920, or anything 9:16) into `assets/plates/`, for example `assets/plates/my-last-shot.mp4`.
2. In `index.html`, set the active variant's `clip` in CONFIG to that path.
3. Change the `src` of the matching `<video>` to the same path: `#clip0` for variant 0, `#clip1` for variant 1. The script hides every video whose `src` doesn't match CONFIG.
4. Set `shot.focus` to your subject's position in the clip, for example `[0.5, 0.3]` for a face in the upper third. Variant 0 shows the top of the frame, so aim `to` at about 500. Variant 1 shows the bottom, so aim `to` at about 1100–1200.
5. For a longer card, raise `data-duration` on the root, both videos and `#ov` (7 by default), and move `timing.out`, `.reopen` and `.end` to match.

## Render
```bash
cd gta6/50-end-card
# variant 0, Ink tile + date
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o end-card-ink.mp4
# variant 1, Sunset card
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o end-card-sunset.mp4
```
This component frames footage, so render it to MP4 with the clip in place. It is not a transparent overlay. Put it at the end of your edit, with your last shot as its clip.

## Keywords
end card, end tile, end screen, outro, closing card, sign-off, channel name, follow, release date, November 19 2026, date line, wide-tracked caps, tracking-in, magenta offset, ink navy, fade to ink, full-bleed footage, sunset card, sunset sky, dusk to peach gradient, Leonida sunset, see you in Vice City, see you in Leonida, horizon line, hard horizon, two-line date card, Rockstar style, GTA 6, GTA VI, call to action
