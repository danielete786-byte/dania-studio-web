# 24 · Versus card

A head-to-head title for a GTA 6 short (craft v2). Use it to open a comparison segment: "LUCIA vs JASON" (who's the better protagonist), "GTA V vs GTA VI" (graphics or map comparison), car vs car, city vs city. It runs 6 s, and its first 2–3 s also work as a cold open.

1080×1920, 30 fps, 6 s. Full-frame: footage shows on every frame, and the Look finishing stack (film grain, vignette, flashes, one light leak) is always on.

## Variants
| `variant` | Name | What it does |
|---|---|---|
| `0` | Split | A fight-night face-off. Contender A gets a full-frame close-up with their name in wide type (0–1.1 s), then contender B (1.1–2.6 s). Then the two portraits slide in from opposite edges with motion blur (2.3–2.6 s), a 4 px blade of sunset light draws across a steep 19° diagonal, and the VS crashes onto the blade between the two faces on the hit (2.6 s: flash, shake, RGB split, and a light leak running down the blade). The poster holds: A's face on top with its name flush left above the seam, the 210 px sunset VS on the seam, B's face below with its name flush right at the foot of the portrait. The face-off names (168 px) are bigger than the intro names (146 px), so the payoff outgrows the setup. The type blurs out from 5.3 s and the blade retracts last. Demo: LUCIA CAMINOS vs JASON DUVAL, both in slow motion. |
| `1` | Centre | A matched-pair edit on a full-bleed 50/50 split. A fills the top half (1080×960) and B the bottom half, on a hard seam at y 960 with a 4 px white blade. Each 16:9 shot is cover-scaled and framed per shot, and the two halves cut together on the beat through four matched pairs. The title is one centred fight-card lockup on the seam: label A, name A sitting on the VS, a 200 px pure-white VS with a soft warm bloom, name B hanging under it, and label B, all over a soft dark lip on each side of the seam. Each picture is framed outward, above and below it. Name B carries the sunset fill (the frame's only accent). The panes wipe open from the seam (0–0.5 s), the VS slams onto the seam on the first matched cut (1.0 s) with a seam flash, shake and RGB split, and the panes shut back onto the seam at the end. Demo: GTA V (2013 · Los Santos) vs GTA VI (2026 · Leonida), with matched pairs: the skyline / welcome sign (Los Santos at golden hour vs the Keys sign), the view from the top (hikers on the summit vs a skydive over Vice City), the city (Michael over the Los Santos skyline vs driving into Vice City under the towers) and the beach (the lifeguard tower at sunset vs a biplane over a packed Vice City beach). |

`bg` is accepted for library parity. This is a full-frame component, so footage always shows.

## Render
```bash
npx hyperframes render . --variables '{"variant":"0"}' -o split.mp4
npx hyperframes render . --variables '{"variant":"1"}' -o centre.mp4
```
There is no transparent version: the component is the footage plus the type.

## CONFIG (top of the `<script>`)
- **`duration`**: the length in seconds (6). The root `data-duration` and the overlay's `data-duration` must match it.
- **`variants["0"]` (Split)**
  - `vs`: the emblem text.
  - `a` / `b`: the contenders. `a` is the top pane and the first intro; `b` is the bottom pane and the second intro.
    - `name`, `label`: the big name and the small surname kicker above it.
    - `intro.clip`, `intro.start`: the full-frame close-up for that contender's intro beat (a `-v` 1080×1920 shot works best) and its in-point. Intro A needs 1.1 s, intro B 1.5 s.
    - `pane.clip`, `pane.start`: the clip for that contender's half of the split and its in-point. The pane starts sliding in at 2.3 s, so it needs **3.7 s** from `start`.
    - `pane.box`: `{ x, y, w, h }` in canvas px, the box the clip is laid into (object-fit: cover). It must cover its half of the frame: pane A from y 0 down to the seam, pane B from the seam's high end (`seam.yRight`) to y 1920 and the full width.
    - `pane.origin`, `pane.push`: the transform origin and end scale of the slow push during the hold.
    - `b.pane.filter`: an optional CSS filter on pane B's clip.
    - `b.pane.track`, `eyeY`, `yMax`: vertical face tracking for a shot whose subject lifts or drops his head. `track` lists `[seconds into the clip, eye y in clip px]`; the box moves so the eye sits at canvas `eyeY`, clamped between `box.y` (the box's foot on the canvas floor) and `yMax` (its top on the seam's high end). Remove `track` for a locked-off shot.
  - `seam`: `{ yLeft, yRight }`, where the diagonal seam meets the left and right edges.
  - `introSize` / `introMaxW` / `introBaseline`: the intro name size, the width it is fitted to, and its baseline y.
  - `nameSize` / `nameMaxW`: the face-off names' size and fit width (both names share the smaller fitted size).
  - `vsSize`, `vsX`: the VS size and the x where its ink is centred on the seam.
  - `nameBBaseline`: name B's baseline (at the foot of B's portrait, inside the safe zone).
  - `gapVS`: name A's baseline above the VS ink. `seamClear`: name A's last letter stays this far above the seam. `gapLabel`: a kicker label's baseline above its name's cap top.
  - `bladeGap`: how far the blade stays clear of the VS.
  - `blade`: `{ width, fill, bloom, strength }`, the light edge along the seam. `vsBloom`: the VS's bloom colour and strength. `leak`: the light leak on the hit (`colors`, `opacity`, `dur`, `size`).
- **`variants["1"]` (Centre)**
  - `vs`, `a.name`, `a.label`, `b.name`, `b.label`: the lockup text.
  - `cuts`: the matched pairs, each `{ at, dur, a: { clip, start, fit }, b: { clip, start, fit } }`. Clips are 16:9 (`-h`) shots, cover-scaled into their 1080×960 pane (1707×960, so about 63% of the width shows). `fit` frames each shot: `x` / `y` are the object-position (0–1; `x: 0.72` shows the right side), and `s` is an extra zoom about that point (`1.125` is the `-h` file's native pixels, so it costs no sharpness). Each clip needs `dur` seconds from `start`.
  - `seamY`: where the seam runs (960 = a 50/50 split).
  - `nameSize` / `nameMaxW` / `vsSize`: the type sizes and the fit width.
  - `gapVS`: the gap between each name's ink and the VS ink. `gapLabel`: the gap between a label and its name (labels sit outside the lockup).
  - `bladeGap`: the blade's clearance around the VS. `blade`: `{ width, color, bloom, strength }`. `vsBloom`: the VS's bloom colour and strength.
  - `scrimH`, `scrim`: the soft dark lip on each side of the seam, under the lockup (its height, and its darkness at the seam and at 28 / 56 / 80% of `scrimH`).
  - `sunset`: the gradient on name B.
- **`vsFill`**: the Split VS gradient (Leonida sunset).
- **`inkEdge`**: `{ left: 96, right: 900 }`. Every flush-left and flush-right line is aligned on its glyph ink (measured), inset from the 72–936 safe limits.
- **`timing.split`**: `cutB` (intro B starts), `slide` (the portraits start sliding in), `cutSplit` (the payoff hit; the VS starts falling `vsFall` s earlier and the blade draws in the last 0.16 s), `nameA` / `nameB` / `labels` (the type lands), `sheen` (the light pass over the VS), `out` (the exit starts).
- **`timing.centre`**: `open` / `openDur` (the wipe out from the seam), `nameA` / `nameB` / `labels`, `slam` (the payoff, on the first matched cut), `vsFall`, `sheen` (the light pass over name B), `out` (the type exits), `close` / `closeDur` (the panes shut onto the seam).

## Swap in your own clips
1. Put your clips in `assets/`, for example `assets/mine/a.mp4`.
2. Set the paths and in-points in CONFIG. The script re-applies them, but also update the matching `<video>`'s `src` and `data-media-start` in the HTML so Studio and the renderer stay in step: `#v0ia` / `#v0ib` (Split intros), `#v0pa` / `#v0pb` (Split panes), `#v1a0`–`#v1a3` / `#v1b0`–`#v1b3` (Centre panes; also keep `data-start` / `data-duration` equal to each cut's `at` / `dur`).
3. Every clip must run at least as long as its slot from its in-point, or the last frame freezes. Never use a playback rate below 1 to stretch a clip: retime the file with motion interpolation instead, and pick the in-point frame by frame so the slowed part has no blink or fast head move. `make-clips.sh` rebuilds the demo's slowed clips (Lucia's intro 0.56×, Lucia's pane 0.68×, Jason's 4K face-tracked re-cut 0.56×, and the GTA VI skydive 0.66×); `bash make-clips.sh jason` rebuilds only Jason's pane:
   ```bash
   ffmpeg -ss 0.40 -i in.mp4 -vf "setpts=(PTS-STARTPTS)/0.68,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -an out.mp4
   ```
4. In Split, a close-up has almost no headroom, so the bottom subject's face ends up just under the seam: keep name B at the foot of the portrait (under the chin, with the box high enough that the chin clears the name) and name A above the seam under A's chin. The bottom subject should face left, toward A. In Centre, the lockup covers the band from about y 680 to y 1240, which is the foot of A's shot and the top of B's. Pick pairs that genuinely match (the same place, view or time of day), with dark ground, a back or a jacket at the foot of A's shot and sky at the top of B's, and the faces outward: above y 680 in A, below y 1240 in B. Use `fit` to move a subject out of the lockup.

The older clips still in `assets/clips/` (the v1 clips `jason-drive`, `lucia-gate`, `gta5-skyline`, `gta6-sunset`, `gta6-highway`; `s018-lucia-gate-086-v`, `s018-lucia-gate-078-v`, `s078-jason-phone-045-h`, `s083-duo-convertible-076-v`, `s083-duo-convertible-078-h`, `s083-duo-convertible-050-h`) are no longer used. The demo footage is cut from Rockstar's official trailers for local preview only.

## Keywords
versus, vs, head to head, face-off, fight card, fight poster, comparison title, GTA 5 vs GTA 6, then vs now, Lucia vs Jason, split screen, diagonal split, 50/50 split, full bleed, blade of light, slow motion, matched cut, fight-card lockup, slam, title card, GTA 6 shorts
