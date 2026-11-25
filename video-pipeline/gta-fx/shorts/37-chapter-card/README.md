# Chapter card (GTA 6 component #37, Transitions)

A full-frame interstitial between two segments of a compilation short: the outgoing clip plays, then the chapter (`DETAIL 04` + a title + a sub line + a "4 of 10" progress row), then the incoming clip. Use it in "10 details you missed", "every new feature" or ranked-list GTA 6 shorts, wherever you cut from one detail to the next. 1080x1920, 30 fps, 5.2 s.

## Variants
- **0 "Sunset card"**: a full-frame Leonida-sky card (dusk violet to sunset amber, cirrus wisps up top, drifting cloud streaks low, fine grain) pushes the outgoing clip up. It carries the chapter in bold geometric caps (the PS5 feature-card look), with the incoming clip floating under it in a rounded window as the hero object. Then the window grows to full frame and becomes the next segment. Sample: Jason at the door (Trailer 1) → "DETAIL 04 / TWO PROTAGONISTS / JASON DUVAL · LUCIA CAMINOS" → Lucia at the gate (Trailer 2).
- **1 "Blurred footage"**: the outgoing clip pushes in and defocuses into a soft night blur, where the lights and figures still read and move. The chapter resolves on it through a bloom: a Rockstar date-style kicker (wide caps, magenta offset) over a Barlow Condensed location title. After the chapter leaves, the incoming clip crossfades in under the same blur and pulls into focus. Sample: the blue nightclub (Trailer 2) → "DETAIL 05 / LEONIDA KEYS / STATE OF LEONIDA" → the "Welcome to The Keys" sign.

## CONFIG fields (top of the `<script>`)
- `variants["0" | "1"]`
  - `style`: `"card"` (sunset card) or `"blur"` (blurred footage).
  - `kicker`, `num`, `of`: the label and number (`"Detail"`, `4` gives `DETAIL 04`) and the length of the progress row (`of: 0` hides the row).
  - `title`: the chapter title. `\n` forces a line break; lines auto-fit to `layout.titleMaxWidth`.
  - `sub`: the sub line (`""` hides it).
  - `clipOut` / `clipIn`: `{ src, from }` for the segment that ends and the one that starts. `from` is the source second the clip starts at. v0's `clipIn` also has `rate` (playback rate; the sample uses 0.62 to stay inside p06's clean window, so use 1 for a long clip).
  - `window` (v0 only): the hero window, `{ w, h, top, radius, focusY }` (sample: 750×422 at top 1006, r28, x 165–915 to match the title). `focusY` sets which part of the 9:16 clip shows in the window: `0` = the top (keeps a face in frame), `1` = the bottom. The window is a clip-path over the full-frame clip, which is scaled down into it and grows back to 1:1 on exit, so the video never has to be resized.
  - `hold` (v1 only): `{ src, from, rate, at }`, the clip that plays under the full blur, crossfaded in at `at` seconds. The sample p02 is clean only for 0–1.35 s, so the hold is that window reversed (`assets/custom/p02-blue-club-rev-v.mp4`, from 0.15 = source 1.15 s, at 0.4×). It continues from where `v1out` is, as a slow push. With a long clean clip, use `{ src: clipOut.src, from: clipOut.from + at, rate: 1, at }`, or `null` to drop the hold layer and let `v1out` run on.
- `layout`: `centerY` (lockup centre per style), `titleMaxWidth` (740, which keeps glyphs inside the safe zone), `titleSize` (min/max px per style; v1 is Barlow Condensed 800, up to 150 px), `blurTracking` (v1 title tracking in em, 0.06).
- `blur`: the v1 defocus at full strength: `px` (scaled by the push, so 9 at zoom 1.38 is ≈ 12 px on screen), `brightness` (.74), `saturate`, `dip` (brightness at the clip swap; .72 is only a slight dip, so the crossfade never turns muddy), `zoom` and `origin` (centre of the push; aim it at the brightest part of your clip).
- `timing`: `card` (`in`, `move`, `out` = when the window starts to grow; the lockup leaves 0.15 s before it, `grow`), `blur` (`in`, `ramp`, `textOut`, `swap`, `dipDur`, `focusDur`; the focus pull starts at `swap + dipDur`) and `end`. If you change `end`, also change `data-duration` on `#root` and `#ov`.

## Render
```bash
# with footage (both variants always show footage with bg "plate")
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o chapter-sunset.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o chapter-blur.mp4
# Sunset card over transparency until it lands (drop it at the end of your own clip in CapCut / Premiere).
# The hero window and the landing play CONFIG clipIn, so set that to your next clip.
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o chapter-sunset.webm
```
Variant 1 always renders footage, because the blur is made from the clip's own pixels.

## Swap in your own clips
1. Put your clips in `assets/` (9:16, 1080x1920 or larger; they are `object-fit: cover`).
2. In CONFIG, set `clipOut.src` / `clipIn.src` (and `from` for the source start second).
3. In the HTML, set the matching `<video>`: `v0out` / `v0in` for variant 0, `v1out` / `v1hold` / `v1in` for variant 1. Copy the same `src` and set `data-media-start` to the `from` value. Keep `data-start` / `data-duration` unless you change `timing`:
   - `v0out` must run until the card has landed (`card.in + card.move`).
   - `v0in` plays in the hero window: it starts at ~1.45 s (when the window appears) and runs to `end`. Set its `data-playback-rate` to `clipIn.rate`, and keep `from + duration × rate` inside the clip's clean window.
   - `v1out` must run past `hold.at + 0.2`.
   - `v1hold` (src = `hold.src`) starts at `hold.at` and runs past `blur.swap + 0.3`. Set its `data-playback-rate` to `hold.rate`, and keep `from + duration × rate` inside the clip's clean window. If you set `hold: null`, instead let `v1out` run past `blur.swap + 0.3`.
   - To build a reversed hold from a short clip: `ffmpeg -i clip.mp4 -an -vf "trim=start=0:end=<clean end>,setpts=PTS-STARTPTS,reverse" -c:v libx264 -crf 14 -pix_fmt yuv420p -g 6 assets/custom/clip-rev.mp4` (trim **before** reverse).
   - `v1in` starts at `blur.swap`.
   - The incoming clips run to `end`.
4. Avoid hard cuts inside a clip's window: a cut under the v1 blur reads as a colour jump. Night clips with coloured light make the best v1 blur. Point `blur.origin` at the lit part, so the push keeps dark floors out of frame.

## Keywords
chapter card, interstitial, hero window, window expand, zoom through, night blur, section title, detail number, part card, segment divider, transition, sunset card, blurred background, defocus transition, focus pull, title card, countdown progress, "10 details", GTA 6, GTA VI, Leonida, Vice City, Rockstar date style, PS5 feature card
