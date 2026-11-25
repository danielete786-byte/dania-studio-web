# 10 · Mission passed

The GTA result sting, built as a trailer title rather than a UI strip (craft v2). A real-speed action shot cuts on the beat into the result, and the grade tells you which result it was. Every shot plays at 1.0x.

- **Passed + payout** (variant `0`). Over the stunt (a biker riding beside a seaplane), **MISSION PASSED** rises in one wide white line in the sky. At 1.1 s the edit cuts to golden hour on the pier, and the payout **$25,000** (216 px, Leonida sunset gradient, the currency set small and raised) rises in with motion blur and counts up. It **lands at 1.55 s**: a 1.07 punch, an exposure pulse on the footage held for 2 frames, a warm anamorphic streak held for 0.2 s, a kick, and a sheen across the figure. The edit keeps cutting under it (the leap over Vice City at 2.6 s, the jetski at 4.2 s). The lockup blurs out at 4.5 s, before the riders rise into it.
- **Mission failed** (variant `1`). A Vice City police car slides through a sunny junction and `MISSION` tracks in. At 1.0 s **FAILED** slams in red on the cut to the drive-by past the police, and the world drains to cold mono: **only bright red survives** (the police lights, the tail lights and the word). An exposure pulse peaks on the hit frame and holds for 3 frames, with a shake and a punch-zoom. The reason, `The cops got there first.`, rises under it. At 2.6 s it cuts to the shootout (the police SUV charges and flips), still drained, and ends on the daylight street.

Use it in a GTA 6 compilation short:
- after a clean escape, a stunt landing or a lucky save (passed, with the payout as the punchline);
- after a crash, a bust or a cringe moment (failed, with the reason as the joke);
- as a sting between clips.

It reads in under a second and holds for about 3 s. Passed blurs out at 4.5 s (gone by about 5.0 s). Failed blurs out at 4.85 s (gone by about 5.35 s). Both are 5.4 s.

| Variant | Name | Look |
|---|---|---|
| `0` | Passed + payout | biker and seaplane, golden pier, leap over Vice City, jetski; one wide white line over a 216 px sunset-gradient payout that lands at 1.55 s with an exposure pulse and a warm streak |
| `1` | Mission failed | daylight police slide, then the drive-by and the shootout in cold mono with only bright red kept; red FAILED slams on the cut with an exposure pulse |

1080×1920, 30 fps. The lockup is set flush left on one optical column (the ink edge of every line sits at x = 96) in the top band, y about 234–494, inside the platform-safe box. There is no rule and no card; legibility comes from a soft top shade and lift shadows.
- Passed: `MISSION PASSED` (Archivo wide 900, about 66 px, sized to the payout's measure) over `$25,000` (Inter 800, 216 px, tabular figures). Both are about 760 px wide.
- Failed: `MISSION` (Archivo wide 700, 30 px, tracked) / `FAILED` (Archivo wide 900, 164 px, fitted to ≤ 780 px) / the reason (Inter 600, 40 px, sentence case).

## CONFIG fields (top of the script in `index.html`)
- `variants["0" | "1"]`
  - `state`: `"passed"` (line + payout) or `"failed"` (kicker + red word + reason, cold mono grade with red kept).
  - `shots`: one entry per `<video>` this variant shows, in order: `{ id, at, dur, from, to, origin }`. `at`/`dur` must match the video's `data-start`/`data-duration`. `from`/`to` is the slow camera push on that shot; `origin` (optional) is its transform origin (`"50% 0%"` pushes from the top, so a head under the type sinks away from it).
  - Passed:
    - `line`: the result line (`"Mission passed"`). It is auto-sized (56–72 px) to the payout's width.
    - `reward`: `{ amount, prefix }`. `amount` is a whole number, comma-grouped, that counts up from 0. `prefix` (`"$"` or `"+$"`) is set at 0.42 of the digit size and raised to the digit tops.
    - `hit`: the cut where the payout rises in (1.1 s). `land`: when the count lands and the light hits (1.55 s).
  - Failed:
    - `kicker`: the small tracked word (`"Mission"`). `word`: the hero (`"Failed"`, fitted to ≤ 780 px).
    - `reason`: the creator line under the word, in sentence case (keep it to about 30 characters).
    - `hit`: the cut, the slam, the exposure pulse and the drain (1.0 s).
  - `out`: when the lockup blurs out (passed 4.5 s, failed 4.85 s).
- `colors`: `sunset` (payout gradient), `warmBloom` (glow on the passed line), `fail` (the red word's gradient, lit from above), `failBloom`.
- `grade`:
  - `pass`: a mild CSS contrast/saturation lift on the passed footage.
  - `fail`: one entry per drained shot, `{ at, lift, offset }` (the mono brightness and black level; the dusk drive-by gets more lift than the daylight shootout). `failCold` is the cold R/G/B cast. The red-keeping mask is `#isoMask` in the SVG filter at the top of `<body>` (`alpha = 6R − 6G − B − 2.4`: bright reds pass; shaded reds, skin, amber and sparks do not).
- `layout`:
  - `x`: the optical column. `ink`: per-line side-bearing offsets (px), measured from a render so each line's visible ink sits on `x`. Re-measure if you change the face or the first letter.
  - `lineTop`, `lineSize`, `cashTop`, `cashSize`, `cashMaxW`, `cashMin`, `curScale`: the passed lockup. The payout shrinks only if it is wider than `cashMaxW`, never below `cashMin` (200 px).
  - `kickTop`, `heroTop`, `heroSize`, `heroMaxW`, `reasonTop`: the failed lockup.
- `timing`: `line` (passed line reveal, 0.18 s), `kicker` (failed kicker, 0.62 s), `reason` (seconds after the hit, 0.3), `end` (5.4 s).

## Render
From this folder:

```bash
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -o mission-passed.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -o mission-failed.mp4

# transparent overlay for CapCut / Premiere (drop it on your own clip)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o mission-passed.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o mission-failed.webm
```

In transparent mode (`bg: "none"`) these are all off: the footage, the grain and vignette, the exposure pulses, shake and streak, and the grades. What's left is the type, its bloom and lift, and a soft shade behind the lockup that belongs to the graphic. If you want the red-only fail grade or the landing light on your own clip, render with your clip as the footage (below) instead.

## Use your own clip
1. Put your 9:16 clips in `assets/` (for example `assets/my-stunt.mp4` and `assets/my-payoff.mp4`).
2. Change the `src` of the videos: passed `#a0`–`#d0`, failed `#a1`–`#c1`. You can delete videos you don't need; then remove their entries from the variant's `shots` and make the remaining `data-start`/`data-duration` values cover 0–5.4 s.
3. Keep the first cut on the beat: the second video's `data-start` is the variant's `hit`. If you move it, change `hit` (and `land` for passed, about 0.45 s later).
4. Play clips at 1.0x and never past their length (set `data-media-start` for the in-point). Keep faces below y ≈ 500 while the lockup is up, or move the lockup with `layout`.

Keywords: GTA 6, mission passed, mission failed, result screen, win sting, fail stamp, payout, cash reward, count-up, busted, wasted, colour isolation, red only, sin city grade, exposure flash, anamorphic streak, title card, overlay, Vice City, Leonida.
