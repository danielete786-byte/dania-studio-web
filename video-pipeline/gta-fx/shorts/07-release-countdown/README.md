# 07 · Release countdown

A countdown to GTA 6's release on **November 19, 2026**, in two variants. Each is 1080×1920, 30 fps and 7 s, rendered from one HyperFrames project. Use it over the included graded 4K trailer shots, or export it as a transparent overlay.

| Variant | Name | What it shows |
|---|---|---|
| `0` | **Rolling digits** | **A full-bleed countdown where the digits own the frame and every clock tick is a cut.**<br>• Vertical shots run from day to sunset to night to midnight: a skydive over Vice City, a biplane trailing pink smoke over the beach, a sunset pier, a Vice City night drive under the skyline, then the sequin dancer under blue flares at midnight.<br>• The countdown fills the top half. A 460 px sunset **30** in Archivo Expanded 900 stands alone, centred (cap y 300–631). Under it is **DAYS LEFT** (Archivo Expanded 800, 64 px, tracked), then the live clock **00:00:03** in Inter 800 at 128 px (cap top y 820). Every digit is an odometer reel that drops in from above with vertical motion blur.<br>• "GTA 6 · November 19, 2026" in Rockstar's date style and the platforms sit low in the frame at 26 px.<br>• **Every roll lands on its cut:** each tick's reel starts 0.12 s early (expo.out), so the new digit has settled by the cut frame.<br>• **Payoff (4.2 s):** at midnight the day rolls 30 → **29** on the hard cut to the club, with a scale punch, and the clock cascades to **23:59:59**. A warm additive flash (screen blend, `#FFE2B8`, peak 0.28), a shake and an RGB split land with it. The numeral's bloom spikes in the warm light and settles into the club's blue, then a sheen crosses the new day count.<br>• The club shot holds to the end as one speed ramp: slow motion through the hair whip, the sequins and the flare, then back to real time as the type exits and the dancer turns into the neon. |
| `1` | **One day left** | **A launch-eve poster title over full-bleed golden-hour footage.**<br>• The title block is left-aligned in the lower half, so faces stay clear above it. A big sunset numeral sits beside **DAYS / LEFT**, stacked to the numeral's cap height.<br>• The numeral counts **3 → 2 → 1** on the cuts: the sunset dock, the couple on the balcony, then Lucia at the gate.<br>• **Payoff (2.9 s):** the "1" slams in on the cut to Lucia and the "S" of DAYS drops out. A flash, shake, warm light leak across the top of the frame and RGB split land with it. The "1" blooms golden, DAY / LEFT catch the light, and a sheen crosses the "1".<br>• A big live clock, **23:59:01 TO GO**, drops in under the lockup at the words' size, with the platforms underneath. It ticks every second, and the minutes roll over to 23:58:59 at 5.8 s.<br>• Lucia holds to the end with a slow push. The clip is pre-slowed with motion interpolation, so it is smooth, with no repeated frames. |

**Exits are designed:**
- **v0:** from 6.2 s, on the ramp back to real time, the reels roll their last values away, the letters of DAYS LEFT fall and fade out of their line, the footer blurs out and the scrims lift. The first frame and the final frames (from about 6.75 s) are clean footage with no type.
- **v1:** the "1" and the clock reels roll away, the words' letters fall and fade out of their lines, and the small lines blur out.

**When to use it in a GTA 6 short**
- **Variant 0:** the opener or closer of a "days until GTA 6" post, a hype compilation or a news recap. Set `from` to the moment you post; the days, hours, minutes and seconds follow.
- **Variant 1:** launch-eve posts ("GTA 6 is out tomorrow"), reaction videos and "who's calling in sick" clips. Use it as the first 3 s over your best clip.

**Safe zone.** All type stays inside the 9:16 safe zone (x 72–936, y 230–1480), clear of the like/comment rail and the caption area.
- **v0:** numeral cap y 300–631 (ink about x 180–900, at most 792 px wide, centred). DAYS LEFT y 677–723, the clock y 820–913. Date and platforms y 1336–1405.
- **v1:** block y 927–1405, x 84–913.

## CONFIG (top of the `<script>` in index.html)
| Field | Meaning |
|---|---|
| `release.at` | The countdown target, `YYYY-MM-DDTHH:MM:SS`. Default `2026-11-19T00:00:00`, local midnight on release day. |
| `release.date` | The date line, set in Rockstar's style ("November 19, 2026"). |
| `release.platforms` | The platforms line, joined with "·" (`["PS5", "Xbox Series X|S"]`). |
| `sunset` | The one accent gradient. It fills the day numerals (v0) and the hero numeral (v1). |
| `rockstar` | The colour of the date's hairline offset (`#EE08F2`). |
| `variants["0"].dateLine` | The footer line in Rockstar's date style ("GTA 6 · November 19, 2026"). The platforms sit under it. |
| `variants["0"].words` | `[["Day", "Days"], "Left"]`: the one line under the day numeral ("DAYS LEFT"). Singular or plural is chosen from the starting day count. |
| `variants["0"].from` | The "now" the clock starts from. Remaining time = `release.at − from`. The demo `2026-10-19T23:59:57` gives 30 DAYS 00:00:03, which rolls over to 29 DAYS 23:59:59 on the 4th tick. |
| `variants["0"].firstTick` / `tick` | When the one-second ticks start (1.2 s) and how far apart they are (1.0 s). The tick that changes the most reels becomes the payoff automatically: warm flash, shake, RGB split, bloom, then a sheen. Keep the footage cuts on the ticks (see "Swap in your own clip"). |
| `variants["0"].lead` | How far ahead of each tick its roll starts (0.12 s, expo.out over 0.35 s), so the new digit has settled on the cut frame. |
| `variants["0"].width` / `maxNum` | The day numeral is solved so its ink is at most `width` wide (792 px, centred on x 540, so x 144–936), and capped at `maxNum` (460 px). Two digits land at 460 px; 3-digit counts get smaller automatically. |
| `variants["0"].capTop` | The numeral's cap top (300 px). |
| `variants["0"].unit` | DAYS LEFT: `size` 64, `weight` 800, `track` 0.12 em, and `gap` 46 px from the numeral's baseline to its cap top. |
| `variants["0"].clock` | The clock: Inter `weight` 800 at `size` 128 px, `track` −0.02 em, `capTop` 820 px. Pure white digits in fixed tabular slots, case-height colons. |
| `variants["0"].label` | The footer size (26 px, Archivo 600, tracked 0.3 em). |
| `variants["0"].footTop` | The date line's cap top (1336 px); the platforms sit under it. |
| `variants["0"].lights` | The light on the type at the payoff: `[{at: 4.2, color: "#FFD3A0"}, {at: 4.45, color: "#8E8CFF"}]`. The numeral's bloom spikes to 0.7 in the first (the flash's warm light) and settles to 0.35 in the second (the club's blue) over 0.5 s. Match the second colour to your hold shot. |
| `variants["0"].flash` | The payoff light: `color` `#FFE2B8`, `peak` 0.28. It is a screen-blended radial wash between the footage and the type, 2 frames up and 4 frames down, so it lights the shot rather than greying it. |
| `variants["0"].out` | When v0's exit starts (6.2 s; it overrides `timing.out`). |
| `variants["1"].kicker` | The line above the lockup, in Rockstar's date style ("GTA 6 · November 19, 2026"). |
| `variants["1"].count` | The numeral's countdown (`[3, 2, 1]`); the last value is the hero. Use `[1]` to show only "1 DAY LEFT". |
| `variants["1"].cuts` | When the numeral steps, in seconds (`[1.6, 2.9]`). These are the footage cuts; the last one is the payoff. |
| `variants["1"].words` | `[["Day", "Days"], "Left"]`. The "S" drops out when the count reaches 1. |
| `variants["1"].clockLabel` / `from` / `clockIn` / `firstTick` / `tick` | The live clock under the lockup, at the words' size, with a small label on its baseline ("To go"). The demo `from` is `2026-11-18T00:00:58`, which gives 23:59:02 TO GO (in agreement with "1 DAY LEFT"). It drops in at 3.05 s and ticks from 3.8 s. |
| `variants["1"].light` | The light the "1", DAY / LEFT and the clock catch at the payoff (`#FEB747`, golden hour). |
| `variants["1"].x` / `capTop` / `numSize` / `label` | The block's left ink edge (84 px), the numeral's cap top (990 px), the numeral size (320 px) and the small-line size (26 px). The words and clock are solved from the numeral's cap height. "3 DAYS", the widest state, spans x 84–852, and "23:59:01 TO GO" spans x 84–913. |
| `timing.out` / `timing.end` | When the exit starts (6.45 s; v0 uses its own `out`) and the clip length (7.0 s). |

## Render
```bash
cd gta6/07-release-countdown
# with the sample footage, finished with grain and vignette
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o countdown-rolling.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o countdown-one-day.mp4
# transparent overlay for CapCut / Premiere (no footage, grain, flash or leak; the soft scrims stay)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o countdown-rolling.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o countdown-one-day.webm
```

## Swap in your own clip
- **Easiest:** render with `bg:"none"` and lay the WebM over your footage.
- **Variant 0, inside the project:**
  - Replace the `src` of the five `<video>` elements in `#full0` with your own **vertical** clips (1080×1920).
  - Keep each `data-start` / `data-duration` so the cuts stay on the clock ticks: 0, 1.2, 2.2, 3.2 and **4.2 (payoff)**. The last shot holds from 4.2 to 7.0 (2.8 s).
  - The type fills y 300–913, so pick shots with sky or dark space there and no faces in that band. Put your biggest moment at the 4.2 s cut.
  - Three shots sit in wrappers that scale them from their top edge (`#lift100` 1.18×, `#lift026` 1.36×, `#lift123` 1.2×), so the subject drops under the clock. The hold sits in `#lift039` (1.15× from the right edge) to move a clubber's face off the numeral. Change or remove each wrapper's `transform` to suit your clip.
  - **Slow motion:** don't use `data-playback-rate` below 1 (it repeats frames, which reads as judder). Pre-slow with motion interpolation, and keep fast-moving faces at native speed: interpolation ghosts them into double faces. The hold `assets/clips/s039-dancer-ramp-v.mp4` is a two-part ramp (frames 34–56 slowed to 0.34×, then frames 57–79 at native speed):
    `ffmpeg -i s039-blue-club-v.mp4 -filter_complex "[0:v]split[a][b];[a]select='between(n\,34\,56)',setpts=(N/30)/0.338/TB,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,trim=end_frame=62,setpts=N/30/TB[A];[b]select='between(n\,57\,79)',setpts=N/30/TB[B];[A][B]concat=n=2:v=1[o]" -map "[o]" -r 30 -c:v libx264 -crf 14 -g 30 -pix_fmt yuv420p -an assets/clips/my-ramp.mp4`
  - Don't let a clip run past its own length, or past a hard cut inside the source.
  - Gameplay clips with a burned-in reticle can be cleaned with ffmpeg `delogo`, as `assets/clips/s123-night-drive-clean-v.mp4` was:
    `ffmpeg -i in.mp4 -vf "delogo=x=666:y=952:w=88:h=52" -an -c:v libx264 -crf 14 -g 30 assets/clips/my-clean.mp4`
  - Set `variants["0"].lights` to the light in your payoff shot.
- **Variant 1, inside the project:**
  - Replace the three vertical `<video>` elements in `#full1`. The third holds from 2.9 to 7.0 s (4.1 s). Use a long clip, or pre-slow a short one with `minterpolate` (`s018-lucia-slow-v.mp4` is s018 from frame 16 at 0.565×: `ffmpeg -i in.mp4 -vf "trim=start_frame=16,setpts=(PTS-STARTPTS)/0.565,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -an -c:v libx264 -crf 14 -g 30 assets/clips/my-slow.mp4`).
  - Avoid fast motion in the held shot: the trailer's own motion blur reads as a double exposure when slowed.
  - Keep the cut at **2.9 s** (the payoff) in step with `variants["1"].cuts`.
  - Choose shots whose faces sit in the upper half and that have dark space below y 920, because the title block lives there.

## Keywords
gta 6 countdown, days left, launch countdown, hours minutes seconds, gta vi release date, november 19 2026, days until gta 6, one day left, out tomorrow, launch eve, release timer, odometer, rolling digits, midnight rollover, vice city night, night drive, nightclub, sequin dancer, speed ramp, slow motion, warm flash, live clock, time to go, full bleed, cinematic title, wide type, sunset gradient, ps5, xbox series x|s, hype overlay, transparent overlay, shorts, tiktok, reels
