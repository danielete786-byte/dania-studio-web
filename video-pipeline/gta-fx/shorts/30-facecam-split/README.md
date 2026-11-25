# #30 Facecam split (Framing, craft v2)

A reaction layout for GTA 6 shorts. Your facecam and the footage you're reacting to share the frame, joined by a seam of light and labelled with a title lockup that says who is reacting and to what. It is edited like a top reaction short: the game cuts on rhythm, your face is the held second camera, and on the big moment the face **punches in** while the footage takes an exposure hit. Use it for trailer reactions, first-look breakdowns, and any compilation where your face and voice carry the clip.

- **Variant 0, Top/bottom.**
  - GTA 6 footage on top (1080×980), cut on rhythm from 16:9 shots, and your facecam below (1080×940), framed big and slightly right of centre.
  - The seam at y 980 is a 2 px line of warm light with bloom, sitting in a valley of shadow. It draws in with a glint, flares on the payoff, and glints again on every cut.
  - The lockup hugs the seam from above: `@EVERESTCHRIS6 REACTS` (Archivo wide, tracked) over a 207 px wide **GTA 6**, with the "6" in the Leonida sunset and a sheen on the hit.
  - The payoff is at 1.3 s, on the cut to the explosion.
- **Variant 1, Corner bubble.**
  - Full-bleed vertical GTA 6 shots, cut on rhythm.
  - Your facecam is a 380 px circle docked in the top-left corner. Its 3 px white rim draws on, its warm rim light breathes while you talk, and it has a contact shadow.
  - Beside it sits the lockup `@EVERESTCHRIS6` over **Vice / City** (Inter display, 190 px, "City" in sunset), in the sky band of the shots.
  - The payoff is at 1.35 s, on the cut to the skydive: an exposure hit, the face punches in inside the bubble, the bubble pulses and the rim flares.
  - The lockup blurs out at 4.55 s, and the bubble stays docked to the end.

1080×1920, 30 fps, 6 s. All type sits inside the safe zone (x 72–936, y 230–1480). The finishing layer (grain, vignette, exposure hit) comes from `assets/kit/look`.

## CONFIG fields (top of the script in `index.html`)
| Field | What it does |
|---|---|
| `duration` | Length in seconds (also set `data-duration` on `#root` and the facecam `<video>`s). |
| `handle` | Reference only: the handle shown on screen lives in each variant's `kicker`. |
| `sunset` | The accent gradient used on the hero's second word. |
| `facecam.clip` | Your facecam clip (sample: `assets/cam/facecam-sample.mp4`, re-encoded with a keyframe every second). |
| `facecam.srcW / srcH` | Pixel size of the facecam source (16:9 webcam: 1920 × 1080). |
| `facecam.eyes.{x,y}` | Where your eyes sit in the source (0–1). This anchors the framing and the punch-in. |
| `voice.rate / seed` | v1's rim light "speaking" envelope: updates per second (syllable rate) and its deterministic seed. |
| `variants[n].shots[]` | The footage cut list: `{src, at, dur, in, pos}` = clip, start on the timeline, duration, in-point in the clip, and `object-position` (v0 crops 16:9 shots into the top panel, so pick the subject with `pos`). **Mirror any change on the matching static `<video>` tag** (`a0`–`a4` for v0, `b0`–`b3` for v1). Never let `in + dur` run past a clip's end. |
| `variants[n].kicker` | The small tracked line above the hero. |
| `variants[n].hero` | `[first, second]`: the hero words. The second carries the sunset fill. |
| `variants[n].hit` | The payoff time (put it on a cut): exposure hit, shake, face punch-in, seam or rim flare, sheen. |
| `variants[n].punchOut` | The cut where the face jumps back out of the punch-in. |
| `variants[n].punch` | Punch-in scale (v0 1.2, v1 1.18). |
| `variants[n].expose` | Exposure peak of the hit (v0 1.85; v1 1.5, because bright skies blow out). |
| `variants[n].face` | `{scale, bx, by}`: facecam scale of the source, and where the eyes land in the panel or bubble (0–1). It always covers its box. |
| `variants[n].camIn` | Facecam in-point (s). |
| `variants[n].out` | When the lockup blurs out. |
| `variants["0"].seamY` | Seam height in px (default 980): gameplay above, facecam below. |
| `variants["0"].heroWidth` | Ink width the hero is fitted to (default 720 px; never below 180 px type). |
| `variants["1"].bubble` | `{size, left, top}` of the facecam circle (default `{380, 72, 256}`). |
| `variants["1"].gap` | Space between the bubble and the lockup (px). |

## Render
From this folder:
```bash
# top/bottom split with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o facecam-split.mp4
# corner bubble over the sample footage
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o facecam-bubble.mp4
# corner bubble ONLY (facecam circle + lockup + soft top scrim on transparent), to drop over your own clip
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o facecam-bubble.webm
```
Variant 0 always renders both halves, because the split is the frame itself. With `bg: "none"` it only drops the grain, vignette and exposure hit.

## Swap in your own clips
1. Copy your clips into `assets/` (for example `assets/my-cam.mp4` and `assets/my-clip-1.mp4`). Don't use `assets/plates/` or `assets/shots/`, because they are re-synced from the shared library.
   For smooth seeking, export the facecam with a keyframe every second: `ffmpeg -i cam.mov -c:v libx264 -crf 17 -g 30 -keyint_min 30 -sc_threshold 0 -an assets/my-cam.mp4`.
2. Set `CONFIG.facecam.clip`, and the `src` of `cam0` / `cam1`, to your facecam.
3. Edit `variants[n].shots` and the matching `<video>` tags: one entry per cut. Cut every 0.8–2 s and play at 1.0×. Put the punch-in `hit` on your biggest moment, ideally a cut.
4. Set `facecam.eyes` to where your eyes are in your webcam frame, then tune `face.scale` until your head and shoulders sit well. In v0, keep the mouth above y 1480 (the platform caption UI starts there).
5. Change `kicker` and `hero` to your handle and topic, for example `["Trailer", "3"]` or `["Leonida", "Keys"]`. In v1, keep each hero word under about 440 px wide (it sits beside the bubble).

## Keywords
facecam, reaction, reaction punch-in, zoom on face, split screen, top bottom split, stacked split, webcam bubble, circle cam, picture in picture, PiP, streamer cam, creator label, handle, seam of light, exposure hit, GTA 6 reaction, trailer reaction, Vice City, vertical, 9:16, shorts, TikTok, reels
