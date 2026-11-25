# Race HUD (GTA 6 component #47)

A racing overlay in the style of Rockstar's own GTA 6 race HUD: sparse white condensed numerals with the official thin dark edge, ink-navy chips, one Leonida-pink accent. The race stack sits in the bottom-right corner of the safe zone, where the game puts it. The speedometer sits low and just left of centre, so that on the sample chase its ring clears the game's own aim reticle (you can move it, see `layout` below).

**When to use it in a GTA 6 short:**
- Over race, chase or driving clips to make edited footage read as "in-game".
- For "street race in Vice City" moments, overtake clips, top-speed runs and car reviews.
- As a transparent overlay (`bg: "none"`) on your own gameplay or live-action clips, for the "real-life GTA" format.

## Variants
| `variant` | Name | What it shows |
|---|---|---|
| `"0"` | Race stack | `LAP 1/2` in a raked chip, which flips to `2/2` (the final lap) with a pink flash at 4.2 s. Under it, the position box with a faint 3-row chequered-flag texture and a pink keyline: `5/8 → 4/8 → 3/8`. On each overtake the number rolls and a solid pink fill wipes in, holds, then wipes out into the keyline. Then a ticking `00:46.20` race timer, at the same 128 px as the position. |
| `"1"` | Speedometer | The same kit as a gauge, as a top-speed run. A thin 8 px arc with flat ends over a faint full 270° track and 8 ticks, filled with a pink → orange → amber sunset. Inside the ring, two kit rows like the race stack's: `MPH 122` (a 66 px label left of the 180 px numeral, three fixed digit cells, with a ghosted leading zero under 100) and `GEAR [5]` under it. The speed rolls from 24 to 138 mph, which nearly pins the 140 dial, with a dip at each gear change. The `GEAR` chip rolls 2 → 6 and flashes pink for about 0.25 s on each shift. The final shift into sixth, at 5.6 s, holds a frame longer. |

`bg`: `"plate"` shows sample GTA 6 footage underneath; `"none"` renders on a transparent background.

## CONFIG fields (top of the `<script>` in `index.html`)
- `variants["0"]` (Race stack)
  - `lap.label`, `lap.total`: the LAP row (`LAP 1/2`).
  - `lap.steps`: the laps shown in order, e.g. `[1, 2]`. `lap.at`: the time (s) of each lap change, one fewer entry than `steps` (default `[4.2]`). Use `steps: [1]` and `at: []` for no lap change.
  - `position.total`: field size (`/8`).
  - `position.steps`: the positions shown in order, e.g. `[5, 4, 3]`.
  - `position.at`: the time (s) of each overtake; one fewer entry than `steps`.
  - `timer.startSec`: what the timer reads when it appears (46.20 → `00:46.20`); it then ticks in real time.
  - `timer.from`: the second the timer starts ticking.
- `variants["1"]` (Speedometer)
  - `layout`: this variant's own position, which overrides the shared `layout` (default `{ right: 366, bottom: 450 }`: gauge centre x 460, y 1216, so the ring clears the sample chase's aim reticle). On your own clip, `{ right: 144, bottom: 480 }` puts it in the bottom-right corner like the race stack.
  - `unit`: `"MPH"` (or `"KM/H"`), `max`: the top of the dial (140), `tickEvery`: tick spacing (20, which gives 8 ticks).
  - `speed`: `[time, speed]` keyframes (default 24 → 138 mph). Each short dip is a gear change. Eased per segment. The unit label and the numeral are centred in the ring as one row. The numeral always uses 3 digit cells, and a leading zero is ghosted, so the row never shifts when the speed passes 100. The arc's colour runs pink → orange → amber up to the highest speed in this list, so the tip always ends warm. Match the numbers to your footage: a crawl shouldn't read 140.
  - `gears`: `[time, gear]` pairs (default 2 → 6, shifts at 1.25 / 2.5 / 3.95 / 5.6 s). At each time the chip rolls and flashes pink. Put each shift inside a speed dip.
  - `gearLabel`: `"GEAR"`.
- `variants[...].plates`: ids of the sample-footage clips shown under that variant.
- `accent`: the single accent colour (Leonida pink `#F84FA4`). It's used for the keyline, the overtake / lap / gear-shift flash and the start of the speed arc.
- `flashHold`, `finalHold`: how many frames the pink event fill holds before it wipes out (2), and the hold for the last event of the run (3: the final-lap flip or the last gear shift).
- `flash`: wipe-in and wipe-out time (s) of the overtake and lap flash (0.16 / 0.16). `gearFlash`: the quicker gear-shift flash (0.07 / 0.09, about 0.25 s of pink in all).
- `layout.right`, `layout.bottom`: distance of the HUD from the right and bottom edges (default 144 / 480, so the race stack's corner sits at x 936, y 1440). `layout.scale`: scales the whole HUD. A variant's own `layout` (the speedometer has one) overrides these.
- `scrim`: strength of the soft dark corner shade behind the HUD over the sample footage (0.45; 0 turns it off). `scrimNone`: the shade in the transparent export (0 by default, because the dark type edge already holds the HUD on bright footage; raise it to about 0.3 if your clip is very bright).
- `timing.in`, `timing.out`, `timing.outDur`, `timing.end`: entrance start (0.08 s, so the full HUD reads by about 0.45 s), exit start, exit length, total length (6.5 s).

## Render
```bash
cd gta6/47-race-hud
# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o race-stack.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o speedometer.webm
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o race-stack.mp4
```

## Use your own clip
- Easiest: render with `bg: "none"` as WebM and lay it over your clip in your editor.
- Or swap the footage in the file. The sample clips are the `<video class="clip plate">` elements: `plA0`, `plA1` for Race stack (the p07 convertible for 0–1.2 s, then one p10 run for 1.2–6.5 s at `data-playback-rate="0.7"`: green sports car, police car drifting, dirt-bike jump and landing), and `plB0`, `plB1` for Speedometer (the p04 in-car pull-away for 0–2.5 s, then the p09 getaway chase for 2.5–6.5 s at `0.72`). The p09 plate carries the game's own aim reticle at about x 705, y 950, which is why the speedometer sits left of centre; with your own clip you can move it back to the corner with `variants["1"].layout`.
  - Change a `src` to your file in `assets/`.
  - Set `data-media-start` to where your clip should start, and `data-start` / `data-duration` to where it sits in the 6.5 s timeline.
  - Remove `data-playback-rate` if your clip should play at normal speed.
  - To use one clip, keep a single video with `data-start="0" data-duration="6.5"` and put its id alone in that variant's `plates` list.

## Keywords
GTA 6 race HUD, lap counter, final lap, race position, overtake, race timer, stopwatch, speedometer, MPH gauge, top speed, getaway, police chase, dirt bike, bike jump, drift, gear indicator, gear shift, chequered flag, street race, Vice City race, Leonida, Rockstar HUD style, racing overlay, transparent overlay, game HUD kit
