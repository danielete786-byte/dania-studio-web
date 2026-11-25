# Rank badge (GTA 6 component #2, craft v2)

A Top-N ranking moment for GTA 6 countdown shorts, such as "Top 5 trailer moments" or "Top 5 police chases". A giant sunset-gradient rank ("#3") slams in on a cut, holds as a poster title over the action, then flies into the top-left corner and lives on as a clean, type-only rank badge while the clip plays. A 5-segment progress rule fills across the clip. There are no cards and no boxes.

Use one render per ranked clip, laid over the start of that clip. The rank lands in the first 0.75 s and stays until about 6.3 s (v0) or 6.15 s (v1). It clears by about 6.7 s, so the next item can cut in clean.

## Variants
Both are full-bleed 9:16 footage.

- **0, "Hero numeral → dock"** (Archivo wide, set like a film poster):
  - A Rockstar-style date kicker blurs in over a one-beat (0.33 s) night shot.
  - At 0.33 s the "#3" slams in on the cut to Jason as the fireworks blast erupts beside him: a scale and blur stamp, the blast's light (a warm directional burst from the explosion over a thin even lift, not a flat white flash), a footage shake with a punch-in, an RGB split, one light leak and a pink bloom that flares and settles. The blast then eases into a pre-rendered slow motion.
  - The face stays clear above. The numeral (ink top ≈ y 900) and the title "VICE CITY NIGHTS" (baseline y 1408) sit on the dark of his jacket; the title rises word by word out of masks and reads for about 1.25 s. The numeral breathes in slowly and a specular sheen crosses it.
  - At about 1.8–2.3 s the kicker and title leave, and the numeral flies into the top-left corner with directional motion blur, across the 2.02 s cut to the club. It lands with a sheen and a bloom flare. Beside it, the series label, the title and the progress rule rise in.
  - The edit then cuts to the police stop at the mural (3.06 s) and the string-lit sunset dock (5.2 s).
- **1, "Corner badge"** (tight Inter display, a police-chase edit):
  - "#5" blurs in on frame 0 with its figure already in the slot, then the rank ticks up like a counter: quick blurred rolls show "#4" and "#3" for a few frames each, shaded like a reel drum, and an accelerating roll slams onto "2" exactly on the 0.72 s cut to the gameplay shootout (the SUV charging under fire): a flash, a shake, an RGB split, a light leak and an orange bloom.
  - The hero "#2" is 700 px Inter 800 (ink y 250–760, about 70 % of the safe width), centred in the shaded building band. The item title "SUV ROLLOVER" rises out of masks on the slam, 42 px under it, set on the numeral's measure (its ink spans the same width as the "#2"). It reads from about 0.83 s to 2.1 s.
  - At 2.08 s the title drops away and the numeral docks into a real top-left badge, flying across a 2.26 s punch-in cut on the same take: the numeral, a hairline, the series label, the title and the progress ticks.
  - **Payoff, 2.8 s:** the SUV's real rollover. An in-picture hit, an RGB split, a numeral punch, a sheen, a bloom flare and a tick pop.
  - The 4.43 s cut to the Vice City highway gets a flash and a light sky shade behind the badge. The badge exits at 6.15 s, just before the airliner flies through the top of the frame.

Both variants:
- are 1080×1920 at 30 fps and 7.0 s long;
- keep all text inside the safe zone (x 72–936, y 230–1480);
- use one type family each: Archivo wide (v0) or Inter (v1);
- use the Leonida sunset gradient on the numeral only, with a bloom in the scene's colour;
- drift the docked badge 1 → .97 across the hold, so it never sits frozen;
- get film grain (a true zero-mean overlay, so blacks stay black) and a vignette on plate renders.

## CONFIG (top of the script in `index.html`)

| Field | Meaning |
|---|---|
| `variants[…].list` | Series label, e.g. `"Top 5 · Trailer moments"`. Shown in the kicker and the badge label |
| `variants[…].rank` / `.total` | The rank shown and the list length. `total` sets the number of progress segments. The v1 reel spins from `min(total, rank + 3)` down to `rank` |
| `variants[…].title` | Item title. It auto-shrinks to fit: the v0 hero up to 840 px, the badge titles up to the safe edge |
| `variants[…].shots` | The sample clips, for reference. They must match the `<video data-v="…">` tags |
| `variants[…].timing` | Beat times in seconds. `slam` is the numeral's landing (put it on a cut or on the action). `title` is when the hero title rises. `dock` / `dockDur` is the corner flight (put a cut near its middle), and `bug` is when the badge type reveals. v0: `kicker`, `sheen`. v1: `spin` (the "#5" enters), `beat` (the payoff: put it on the clip's big moment) and `cut2` (a flash and the sky shade on the next cut). `clipEnd` is when the current segment finishes filling, `out` is when the exit starts, and `end` is the composition length (keep it equal to `data-duration`) |
| `variants[…].glow` | The numeral's bloom: `rgb` (match the scene's light), `base` (steady strength), `peak` (the flare on each hit) and, in v0, `land` (the flare on the dock landing) |
| `gradient` / `gradientV` | The numeral fills: Leonida core, diagonal (v0) or vertical (v1) |
| `heroNumeralPx` / `dockNumeralPx` | v0 numeral size in the hero (580) and in the corner (168). The docked numeral is the same element, scaled. Two-digit ranks shrink the hero to fit 820 px |
| `badgeHeroPx` / `badgeHeroInkTop` / `badgeTitleGap` | v1 hero numeral size (700, Inter 800), its ink top (y 250) and the gap from its ink to the hero title's cap top (42 px). The hero title is Inter 800, sized so its ink spans the numeral's ink width (about 80 px for "SUV ROLLOVER"; clamped 56–100 px) and centred by ink on x 504 |
| `reelPitch` / `reelTicks` | v1 slot reel: the row pitch in window heights (1.12, a small gap between figures) and the ticks: each roll's start (`at`, from `timing.spin`), length (`dur`) and ease. The last roll runs to `timing.slam` |
| `badgeDockPx` / `badgeTop` | v1 docked numeral size (150) and the badge's top edge (y 250, numeral ink top-left at x 72) |
| `settle` | How far the docked badge drifts across the hold (1 → .97) |
| `shakePx` / `flash` / `flashColor` / `flashEven` / `flash1` | Impact strength, footage renders only. v0: `flash` is the peak of the directional blast-light burst (×2 at its core), `flashEven` the thin even lift in `flashColor` (#FFBB95, white with 60 % #FE8E4E). v1: `flash1` is the white exposure flash on the reel stop |
| `grain` | Film grain strength on plate renders (.14) |

## Render
From this folder:

```bash
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -o rank-badge.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -o rank-badge-corner.mp4

# transparent overlay to drop on your own clip (CapCut / Premiere)
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o rank-badge.webm
```

With `bg: "none"` there is no footage, grain, vignette, flash, shake or leak. The slam, the RGB split, the reel, the dock and all the type still animate. The soft legibility scrims (v0's poster scrim, both variants' top-left corner shade, v1's top shade) stay, because they are part of the graphic.

## Use your own clip
- Replace the `<video data-v="0">` (v0) or `<video data-v="1">` (v1) sources with your 9:16 clips, or one clip. Keep each video's unique `id`, `class="clip shot"`, `muted`, `playsinline`, `data-start`, `data-duration` and `data-track-index` (0 for v0, 2 for v1).
  - Use `data-media-start` to choose in-points.
  - Never let `data-media-start + data-duration` run past the clip's length. A frozen last frame is a defect.
  - To slow a shot, pre-render it rather than using `data-playback-rate`, which repeats frames:
    `ffmpeg -i in.mp4 -vf "setpts=PTS/0.5,minterpolate=fps=30:mi_mode=mci" -an assets/clips/my-slow.mp4`
- Keep the cuts on the beats: a cut on `slam`, and a cut near the middle of the dock flight (v0 2.02 s, v1 2.26 s). v1's dock cut is a punch-in on the same take (`#punch` frames the second half 1.13× tighter); remove the wrapper's scale if you cut to a different shot there.
- Check your in-points frame by frame: the renderer shows source frame floor(media time × 30), so a stray frame one step before your in-point (a pole, a flash, a hidden cut) can become frame 0, which is also the thumbnail.
- **v0:** the hero type sits low (y ≈ 820–1408), so pick a hero clip whose subject sits high, or with a dark lower half.
- **v1:** the hero numeral and title sit high (y ≈ 250–870), so pick a clip with sky, buildings or a dark subject up there, and don't put the title over a white car or sky in the first second. Move `timing.beat` onto your clip's big moment.
- The badge sits top-left (x 72–700, y 250–370), so keep faces out of that corner.
- Update `CONFIG.variants[…].shots` to match.
- **Or skip the footage:** render with `bg: "none"` and stack the webm above your clip in your editor.

## Keywords
gta 6, gta vi, rank badge, top 5, top 10, countdown, number slam, ranking, corner badge, corner bug, dock animation, motion blur, slot reel, odometer, rank counter, punch-in, jump cut, speed ramp, inter display, archivo wide, leonida sunset gradient, rockstar date style, rgb split, impact flash, bloom, light leak, sheen, film poster, film grain, police chase, compilation, shorts overlay, tiktok overlay, transparent webm
