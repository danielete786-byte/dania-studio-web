# 21 · Before/after slider (Comparisons)

A full-frame before/after slider for GTA 6 shorts. Two clips are stacked full frame, and a white seam with a smoked-glass handle wipes between them. Each side carries an era label: GTA 5 (2013) is the "before" and GTA 6 (2026) is the "after". Each side holds one shot for the whole loop, and the two shots are matched like for like (the same kind of subject, at the same scale and height), so the eye compares the same thing across the seam.

The motion is one real drag:
1. The seam wipes GTA 6 in to a 50/50 split and holds.
2. The handle is grabbed and dragged so GTA 5 nearly fills the frame, then across in one long drag so GTA 6 nearly fills it, then back to 50/50. Each era gets the frame to itself for 0.5 s.
3. The labels ride the seam, 40 px clear of it. When a label's side gets too narrow to hold it inside the safe zone, the label fades out over 0.15 s, and it fades back in as the room returns. The seam never cuts a label.
4. The seam retracts the way it came, so the clip loops cleanly on full-frame GTA 5.

Use it for "GTA 5 vs GTA 6" graphics comparisons, "same spot, 13 years later" beats inside a compilation, or any A/B shot (old trailer vs new trailer, leak vs final).

| Variant | Name | Look |
|---|---|---|
| `0` | Vertical slider | The handle travels up and down. GTA 5 is on top and GTA 6 below, with a horizontal seam. Two ink-navy era cards of matching width ride the seam on the left (GTA 5 above it, GTA 6 below it). Each card shows the name, year and place, left-aligned on a shared name column, and the sunset gradient on "GTA 6" is the only accent. The seam travels from y 1400 (GTA 5 fills 73%) to y 420 (GTA 6 fills 78%). Sample: the red GTA V convertible at the kerb vs a parked red sports car in GTA 6, at the same scale. |
| `1` | Horizontal slider | The handle travels left and right. GTA 5 is on the left and GTA 6 on the right, with a vertical seam. Two see-through tinted-glass chips (name over year) ride the seam near the top. The sky shows through them, blurred, so they read as glass rather than v0's solid card. The seam travels from x 870 (GTA 5 fills 81%, and the handle stays inside the x 936 safe edge) to x 180 (GTA 6 fills 83%). Sample: the green "5 · Los Puerta Fwy" overhead sign vs the GTA 6 "35 North · VCI Airport" signs with a jet passing over, at the same height. |

Duration: 5.0 s, 1080×1920, 30 fps. Timeline:
- 0.08–0.64 s: wipe-in to 50/50;
- 1.10–1.65 s: drag so GTA 5 fills the frame, then hold;
- 2.15–2.95 s: one long drag so GTA 6 fills the frame, then hold;
- 3.45–4.00 s: back to 50/50;
- 4.36 s: labels leave; 4.46–4.88 s: the seam retracts.

Hero frame: 4.2 s.

## CONFIG fields (top of the `<script>` in `index.html`)
- `duration`: the composition length, in seconds. If you change it, also change `data-duration` on `#root` and on the `<video>` tags.
- `variants["0" | "1"]`:
  - `orient`: `"vertical"` (handle moves up and down) or `"horizontal"` (handle moves left and right).
  - `chip`: `"card"` (solid ink-navy card with place) or `"glass"` (see-through tinted-glass chip, name over year: rgba(14,14,20,.70) with blur 20px and saturate 1.4).
  - `before` and `after`:
    - `name`, `year`, `place` (`place` only shows on cards);
    - `clip`: the video `src`. Use one held shot that is at least `duration` long;
    - `start`: the offset into the clip, in seconds.
  - `beforeShift`: how many px the GTA 5 footage drifts up (vertical) while GTA 6 wipes in, so its subject sits in the top half. It drifts in on its own gentle ramp (`timing.shiftIn`), holds the full drift through the whole drag (a pure wipe), and drifts back as the labels leave (`timing.shiftOut`). Keep it at or below `1920 - seam.showBefore`. Use `0` for none.
  - `afterTop` (vertical only): where the GTA 6 footage box starts, in px from the top. The box runs to the bottom of the frame, so bake that clip at 1080 × (1920 − `afterTop`). Keep it at or below `seam.showAfter`. Use `0` for full frame.
  - `seam`: the seam positions in px (y for vertical, x for horizontal):
    - `home`: the 50/50 resting position;
    - `showBefore`: GTA 5 nearly fills the frame;
    - `showAfter`: GTA 6 nearly fills the frame;
    - `off`: the off-frame start and end position;
    - `knob`: the handle's fixed position on the other axis.
  - `gap`: how far each label stays from the seam (40).
  - `safe`: `[lo, hi]`, the safe-zone span the labels must stay inside along the slider axis (`[230, 1480]` vertical, `[72, 936]` horizontal).
  - `chipX` (vertical: the cards' left edge) and `chipTop` (horizontal: the chips' top edge).
- `timing`:
  - `seamIn` and `seamInDur`: the wipe-in;
  - `chipA` and `chipB`: when the labels land;
  - `drag`: the legs of the drag, each `{ at, dur, to, ease }`, where `to` is a `seam` key. The handle presses in just before the first leg and releases as the last one lands;
  - `labelFade`: how long a label takes to fade when it runs out of room (0.15 s);
  - `shiftIn` and `shiftInDur` (0.08 s, 0.90 s, `power2.out`), `shiftOut` and `shiftOutDur` (4.25 s, 0.55 s, `sine.inOut`): when the `beforeShift` drift runs in and back out. The footage moves at most about 50 px per frame. Finish `shiftOut` before the seam leaves the frame;
  - `out`: when the labels leave;
  - `retract` and `retractDur`: the seam leaving.

## Render
```bash
cd gta6/21-before-after
npx hyperframes render . --variables '{"variant":"0"}' -q high -o before-after-vertical.mp4
npx hyperframes render . --variables '{"variant":"1"}' -q high -o before-after-horizontal.mp4
```
This is a full-frame footage component, so the footage always renders. `bg: "none"` does not make it transparent, because the comparison is the footage itself.

## Swap in your own clips
The slider only sells the comparison when the two shots match: the same kind of subject, at a similar scale and height, ideally with the same camera move. A side that cuts on its own breaks the effect.

1. Cut one clean shot per side and crop it straight from the 16:9 source (inside any letterbox).
   - Horizontal slider: crop 9:16 and bake at 1080×1920. Put the subject in the left part (GTA 5) or right part (GTA 6) of the crop.
   - Vertical slider: bake GTA 5 at 1080×1920 and use `beforeShift` to lift its subject into the top half. Bake GTA 6 at 1080 × (1920 − `afterTop`), for example 1080×1520 from a 682×960 crop, so its subject sits in the bottom half.
2. If a shot is shorter than 5 s, slow it smoothly with motion interpolation instead of duplicating frames. Before you interpolate, drop any repeated frames (29.97 fps trailers often have them) and trim off fast whips, because those are what smear. This is how the sample clips were made:
   ```bash
   # frames/ = the clean shot as numbered PNGs (repeats removed); N = frame count; K = 5.17 / ((N - 1) / 30)
   ffmpeg -framerate 30 -i frames/%03d.png \
     -vf "setpts=K*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:search_param=64,scale=1080:1920:flags=lanczos,format=yuv420p" \
     -frames:v 150 -c:v libx264 -crf 15 -g 15 assets/clips/my-shot.mp4
   ```
   Sample sources (all official trailers in `research/gta6/plates/`):
   - `g01-convertible`: GTA V trailer, 22.85–25.30 s, slowed 2×;
   - `t1-redcar`: GTA 6 launch trailer, 39.77–40.87 s, crop 682×960 at x 1238, slowed 4.7× to 1080×1520 (it ends before Lucia leans into frame);
   - `g-freeway`: GTA V trailer, 31.83–32.27 s (13 clean source frames, one repeat dropped), crop 482×856 at x 740, interpolated to 10 steps per source frame. It drifts forward one step per output frame for 4 s. During the long drag (frames 61–91, 2.03–3.03 s) it slides back on a `power2.inOut` curve, moving left with the seam like a push. The loop is seamless, and the footage never reverses while GTA 5 holds the frame. That slide is baked to the default drag timing, so re-bake the clip if you retime `drag[1]`. It never shows the overpass or the sign's underside;
   - `t2-freeway`: GTA 6 Trailer 2, 34.63–38.33 s, crop 482×856 at x 588. The first 1.2 s is slowed about 2.2× and eases into real time, so the jet passing over the signs plays at 1× with no interpolated frames.
3. In CONFIG, set `before.clip` and `after.clip`, and `start` if the shot does not begin at 0.
4. Also update the static `src` and `data-media-start` on the matching `<video data-slot="…">` tag (and its inline `top`/`height` for the vertical GTA 6 box). The script corrects them at load, but the renderer reads the static ones for extraction.
5. Change `name`, `year` and `place` for other eras, for example "GTA 4 · 2008 · Liberty City". Both cards share the wider name's column, so the rules always line up.

## Keywords
before after, slider, wipe, drag, reveal, comparison, GTA 5 vs GTA 6, then vs now, graphics comparison, same shot, like for like, freeway sign, red car, convertible, split, era label, year chip, 2013 vs 2026, Los Santos, Vice City, A/B, handle, parallax, side by side
