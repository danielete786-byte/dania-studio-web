# 17 · Freeze-frame detail

The "wait, look at that" beat in a GTA 6 detail breakdown. The trailer stops dead on one frame while the camera keeps pushing in. The world drains to a cold, dim mono, and only the detail keeps its colour. A big word names it, and a line explains it. Then the colour floods back and playback resumes from the exact frozen frame.

Use it in "details you missed in the trailer" shorts, Easter-egg and map-location breakdowns, or any time the viewer needs three seconds to notice something small in a busy shot.

- **Variant 0, "Spotlight":** the freeze hits with a shake, an exposure pulse and a camera punch-in. The grey surround closes in from the frame edges to a soft, feathered pool of warm light on the detail, like a practical light, with no ring or pointer. The hero word (Archivo wide 900, 200 px, white, with a warm bloom) and the line sit in the dark lower third.
  - Sample: Trailer 2 0:47, the Haitian coat of arms on the mural behind the police stop.
  - Best for a detail that is a region of the frame: a mural, a logo, a face, a poster.
- **Variant 1, "Scan reveal":** after the freeze, a light blade sweeps the frame top to bottom and drains it to mono as it passes. The detail is cut out along its real outline. As the blade clears it, the detail lifts toward camera with a contact shadow and an exposure pulse. The hero word (sunset gradient with a sheen) and the line sit in the open space next to it. On the exit, a reverse sweep wipes the colour back from the bottom up.
  - Sample: Trailer 2 0:37, the "VCI Airport / Ambrosia" exit sign on I-35 with a jet overhead.
  - Best for a detail with a hard outline: a road sign, a storefront sign, a licence plate, a billboard.

Format: 1080×1920, 30 fps, 5.0 s (freeze at 1.0 s; resume at 4.35 s for v0 and 4.3 s for v1). This is a full-frame component, so it always shows footage. `bg: "none"` only turns the finishing (grain and vignette) off.

## Render
From this folder:
```
npx hyperframes render . --variables '{"variant":"0"}' -o spotlight.mp4
npx hyperframes render . --variables '{"variant":"1"}' -o scan-reveal.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' -o scan-reveal-clean.mp4   # no grain/vignette
```
The variables are `variant` (`"0"` Spotlight, `"1"` Scan reveal) and `bg` (`"plate"` or `"none"`).

## CONFIG (top of the `<script>` in `index.html`)
- `duration`: the composition length (5.0). It must match `data-duration` on `#root` and `#ov`.
- `surround`: the CSS filter for the frozen surround (both variants). The default is cold mono at brightness .44. On bright daylight footage, lower the brightness. On very dark footage, raise it so the shapes still read.

Each `variants["0" | "1"]` entry:

| field | meaning |
|---|---|
| `clip`, `still` | The clip and the still of its frozen frame. They must match the `<video>`/`<img>` tags of `#m0` / `#m1` (the script warns if the video `src` doesn't). |
| `freezeFrame` | The source frame number that is frozen (for reference; the timing lives in the tags, see below). |
| `freezeAt`, `resumeAt` | The composition seconds the picture stops and starts again. They must match the play clip's `data-duration`, and the hold and resume clips' `data-start`. |
| `push` | The camera on the frozen frame. `{origin: [x, y], play, punch, hold}`: the scale about `origin` (frame px) at the end of play, just after the freeze hit, and at the end of the hold. It returns to 1 on resume. Put `origin` on the side you want to stay put: the rest of the frame moves away from it. |
| `spot` | v0. The light pool, in frame px: `{cx, cy, rx, ry}` ellipse, `feather` (0–1, the soft edge) and `lift` (the CSS filter inside the pool). |
| `sign`, `signCentre`, `pop` | v1. `sign` is an SVG path (frame px) tracing the detail's outline on the frozen frame. It is used as a `clip-path`, so keep it about 1 px inside the real edge. `signCentre` is the point it scales about, and `pop` is the lift scale (1.07). |
| `scanDur` | v1. The seconds the blade takes top to bottom (0.85). The lift fires automatically on the frame the blade clears the bottom of `sign`. |
| `block.bottom` | The y of the bottom of the type block (kicker, hero, line). The block grows upward from it. Keep it inside the safe zone (y 230–1480), over empty or dark image. |
| `kicker` | A small, wide-tracked caps line with a pause glyph, e.g. `Trailer 2 · 0:47`. |
| `hero`, `heroSize`, `heroStretch`, `heroShift` | The hero word. Use the size in px (110–200), the width stretch in % (100–125), and an optical left shift in em (so a straight-sided first letter's ink lines up on x 72). If a word runs past 864 px, the script shrinks it, down to a floor of 110 px. |
| `exposePeak`, `resumePeak` | The exposure pulse on the freeze and on the resume. Use about 1.7 / 1.3 on dark footage and about 1.4 / 1.2 on daylight (higher blows out skies). |
| `line` | One sentence explaining the detail (Inter 600, 38 px, wraps balanced). |

## Swap in your own clip
1. Pick the frame N you want to freeze on, in the clip's own frame numbers, 30 fps. Extract it:
   `ffmpeg -i clip.mp4 -vf "select='eq(n\,N)'" -frames:v 1 assets/stills/my-still.png`
2. In `index.html`, for the variant's `#m0` / `#m1` group:
   - **play `<video>`:** `src` = your clip, `data-duration` = `freezeAt`, and `data-media-start` = N/30 + 0.002 − `freezeAt`. The value must be at least 0, so for a short lead-in use a smaller `freezeAt` or a later N.
   - **hold div:** `data-start` = `freezeAt`, and `data-duration` = `resumeAt − freezeAt`. Set every `<img src>` in it to your still (3 in v1, 2 in v0).
   - **resume `<video>`:** `src` = your clip, `data-start` = `resumeAt`, `data-duration` = `duration − resumeAt`, and `data-media-start` = N/30 + 0.002. Make sure the clip is long enough.
   - The renderer shows frame floor(t × 30), so the +0.002 lands exactly on frame N, and playback continues from the frozen frame.
3. In CONFIG, set `clip`, `still`, `freezeFrame`, `freezeAt` and `resumeAt`. Then refit the geometry on your still, in 1080×1920 frame px:
   - v0: `spot` around the detail.
   - v1: `sign` traced on its outline, plus `signCentre`.
   - Both: `push.origin`, and `block.bottom` for the type over empty space.
4. Change `kicker`, `hero` and `line`. Render, then check the freeze, the lift and the resume frame by frame (`ffmpeg -ss 1.0 -i out.mp4 -frames:v 1 f.png`).

Clips should be 1080×1920 vertical. The samples are 4K-derived masters (`assets/shots/s014-driveby-police-v.mp4`, and `assets/clips/s011-vice-highway-signs-v.mp4`, our own re-crop of the 4K trailer). The push goes up to 1.19, so use the sharpest source you have.

## Keywords
freeze frame, freeze-frame, still frame, pause, detail callout, spotlight, iris, colour isolation, color splash, desaturate surround, selective colour, scan line, scan reveal, cut-out, sign lift, easter egg, details you missed, trailer breakdown, GTA 6, Vice City, Trailer 2, Haiti mural, Ambrosia, VCI Airport
