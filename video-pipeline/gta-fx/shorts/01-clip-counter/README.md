# 01 · Clip counter (Compilation scaffolding) · craft v2

The tracker for a numbered GTA 6 compilation ("10 details you missed", "wildest trailer moments", top-10 lists). It shows which clip you're on and how many are left, so viewers keep watching to the end.

It works in two beats on every cut:
- **Slam.** The clip number lands as a 400–430 px wide-type numeral. Only the digit that changes rolls, with motion blur, and it's clipped to the numeral's own line box. The counting numbers are a pearl fill lit from above, with a soft white bloom that flares on the cut and a quick sheen. This is the chapter beat.
- **Dock.** After a hold (0.65 s in variant 0, 1.0 s in variant 1) the numeral gets out of the way so the clip plays clean under a small persistent top tracker. In variant 0 it retracts into the fixed bar as a 150 px lockup (only the numeral moves; the title and bar never relocate). In variant 1 it flies into its own numbered station in the top tracker and becomes that station's label.

The cut to the last clip is the payoff:
- the "10" rolls in already lit in the Leonida sunset gradient;
- one crisp 0.35 flash frame and a short exposure push hit the footage (under the type), with a short shake and punch;
- it slams with a 6 px RGB hit; its sunset bloom peaks, settles, then swells again as one specular sheen crosses it;
- the title becomes "FINAL CLIP" (variant 0 also grades the sky to dusk).

It holds for 1.2 s and then docks like every other clip. Then comes the **completion beat**: as the tenth slot finishes filling (6.8 s), all ten segments or stations turn sunset left to right with a 40 ms stagger and a glint runs along them, and the tracker blurs out.

Run it for the full length of any numbered compilation. With real 6–10 s clips the docked state fills most of each clip, and the slam marks each new entry.

## Variants
| `variant` | Name | Look |
|---|---|---|
| `0` | **Segmented bar** | Full-bleed footage with a fixed lockup at the top left (x 72–936, from y 246): the title in 28 px wide-tracked caps, ten 14 px segments 18 px under it across the full 864 px safe width, and the numeral hanging 26 px under the bar (430 px on the slam, 150 px docked) with "/10" on its baseline (72 px, 48 px docked, 86% white). The title and bar never move; the numeral scales about its cap-left corner. Its first glyph is optically aligned to x 72 (the "1" and the "0" have different side bearings). Docked, the lockup spans about y 246–434. Finished segments are white and upcoming ones are 30% white. The current one fills in sunset with bloom and a lit playhead tip; on a cut, the finished segment lands with a flash. A plum-tinted top grad, not a box, keeps the type legible and shrinks when the numeral docks. |
| `1` | **Numbered dots** | Full-bleed footage with a centred top tracker: the title in 30 px caps (cap line y 240) and ten 16 px stations at y 306 across x 180–900, **every one numbered** in 30 px Archivo wide (past 86% white, upcoming 40%, the current one in the sunset gradient under a 30 px sunset disc whose ring times the clip). The numeral (400 px) slams centred under the tracker (cap line y 404). After 1.0 s it flies into its own station and becomes the sunset label; its label slot stays empty while the numeral is up. On a cut, the old station turns white and the next ignites with a ping. Only a soft top grad and a spot behind the slam numeral; nothing sits in the caption zone. |

`bg`: `"plate"` shows the sample edit (graded 4K trailer shots with grain, vignette, a flash and exposure push on each cut, and a slow push per clip). `"none"` renders a transparent overlay with no finishing layer and no footage. The grads are off on `"none"` by default; set `scrim: true` to keep a lighter one.

Sample edits: variant 0 is s011 highway → s012 muscle beach → s100 biplane → s027 sunset dock (0.6×). Variant 1 is s096 police street (native) → s026 sunset pier (0.47×) → s055 night truck (0.41×); both slow-mos are motion-compensated (`minterpolate mi_mode=mci`), so there's no blend ghosting.

## CONFIG fields (top of the `<script>` in `index.html`)
Per variant (`CONFIG.variants["0"|"1"]`):
- `style`: `"bar"` or `"dots"`.
- `title`: the compilation title (wide-tracked caps: 28 px in the bar variant, 30 px in the dots variant).
- `finalTitle`: replaces the title on the cut to the last clip. Use `""` to keep the title.
- `total`: the number of clips. It sets the segment or station count (and v0's "/10"). Numbers are zero-padded to two digits ("07").
- `startClip`: the clip on screen when the overlay starts. Use `1` for a full-length overlay.
- `startFill`: how far into that first clip you already are (0–1).
- `cuts`: the time in seconds of each cut in your edit; the counter steps and slams on each one. Put each one half a millisecond before the cut frame's time: at 30 fps, frame 39 is 1.3 s, so write `1.2995`. Use the same value as the next shot's `data-start`. If the cuts reach the last clip, that cut plays the payoff.
- `numSize`: the slam size in px (430 in the bar variant, 400 in the dots variant).
- `hold`: the slam hold after a cut before the numeral docks (0.65 s bar, 1.0 s dots).
- `entranceDock`: when the first clip docks, counted from `timing.in` (0.9 s bar, 1.2 s dots).
- `dockSize` (bar only): the docked size in px (150).
- `totSize` (bar only): the "/10" size at slam size (72 px). It sits on the numeral's baseline, 16 px right of the ink.
- `totDock` (bar only): the "/10" size when docked (48 px).
- `barGap`, `numGap` (bar only): px from the title's box to the bar (18) and from the bar to the numeral's cap line (26).
- `labelSize` (dots only): the station numbers' size (30 px). The numeral docks into the current one at this size.
- `titleY`, `railY`, `railW`, `capY` (dots only): the title's cap line (240), the stations' centre line (306), the station row's width (720, centred; keep the end labels inside x 936) and the slam numeral's cap line (404).
- `scrim`: `"plate"` (default) shows the grads only over footage, `true` always shows them, and `false` never does.
- `sampleShots`: a note on which sample shots are used.

Global settings:
- `sunset`: the gradient on the current segment or station number and on the final numeral.
- `bloom`: the payoff bloom on the numeral (`color` #FE8E4E, `peak` 1 on the slam, `settle` 0.5, `sheen` 0.95 while the sheen crosses).
- `sheen`: the payoff sheen across the "10" (`delay` 0.25 s after the cut, `dur` 0.5 s, power2.inOut).
- `pearl`: the fill of the counting numerals (white, lit from above).
- `flash`: the hits on the footage, plate renders only (`peak` 0.35 on the payoff with `decay` 0.2 s expo.out, `cut` 0.18 on regular cuts, `expose` 1.5 for the payoff exposure push).
- `dock.dur`: the dock move (0.5 s, expo.inOut).
- `dock.finalHold`: the hold on the payoff before it docks (1.2 s).
  - A clip too short to finish its dock 0.05 s before the next cut simply stays big until that cut.
- `sweep.stagger`: the completion beat's per-slot delay (0.04 s).
- `timing.in`: the entrance start.
- `timing.complete`: when the last slot finishes filling and the completion beat starts (6.8 s). It's skipped if it doesn't fit between the last cut + 0.6 s and `timing.out` − 0.3 s.
- `timing.out`: when the exit starts (a 0.35 s staggered blur-out, fully gone about 0.45 s later).
- `timing.end`: the composition end.

## Render
```bash
cd gta6/01-clip-counter
# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o clip-counter-bar.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o clip-counter-dots.webm
# with the sample edit
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o out.mp4
```

## Use it on your own compilation
1. List the time of every cut in your edit and put them in `cuts`, half a millisecond before each cut frame. Set `total` and `startClip: 1`.
2. Set `data-duration` on `#root` and `#ov`, `timing.end` to your video length, `timing.out` to about 0.55 s before the end and `timing.complete` about 0.65 s before `timing.out`.
3. **Transparent:** render with `bg: "none"` as WebM and lay it over the full timeline.
4. **Preview over your own clips:** replace the `<video>` tags (`a1…a4` for variant 0, `b1…b3` for variant 1).
   - Give each one a `data-start` that matches its cut, a `data-duration` that runs exactly to the next cut, and a `data-media-start` for its in-point.
   - Make sure no clip runs past the end of its source file.
   - Make sure no source file has a cut of its own inside the range you use. Check with `ffmpeg -i clip.mp4 -vf "select='gt(scene,0.1)',showinfo" -f null -` (no `-v error`: that hides `showinfo`), and look at the frames: a cut between two dark shots can score as low as 0.2. A cut the counter doesn't step on reads as a mistake.
   - To slow a clip down, use motion-compensated interpolation, not blend (blend double-exposes anything that moves): `ffmpeg -i in.mp4 -vf "setpts=PTS/0.5,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -an out.mp4`. It drops 2–3 frames at the end, so check the frame count.
   - Cast clips whose top third is free of faces, signs and big moving objects while the numeral is big (to y ~640), and whose top ~440 px stays clear once it docks.

## Keywords
clip counter, compilation tracker, progress bar, completion beat, segmented bar, story bar, numbered dots, numbered stations, chapter markers, top tracker, slam and dock, chapter number, odometer, rolling digits, wide type, cinematic counter, top 10, countdown list, clips left, retention, final clip payoff, Leonida sunset, GTA 6, GTA VI, Vice City, overlay, short-form, TikTok, YouTube Shorts, Reels
