# #35 Sunset wipe

A full-frame transition between two clips. Diagonal bands (or a single iris ring) in the Leonida sunset sweep across the frame and leave the next clip behind them.

Each band is a printed panel, not a flat gradient:
- solid sunset gradient on its leading 40%, then ink-navy halftone dots that grow toward its trailing edge (the comic-print tonal ramp);
- a 4 px ink keyline on both edges;
- a 1 px highlight on the leading edge;
- on the bands, solid ink gutters between neighbouring bands, so the group reads as one keylined object with no footage slivers between the bands.

The cut from clip A to clip B is hidden under the widest band, so you never see a hard edge. The incoming clip lands on a beat: a 2-frame scale punch plus a short shake on the first frame where the cut has cleared.

1080×1920, 30 fps, 5.0 s. The timeline (bands; the iris is within a few frames):
- 0–0.1 s: the end of the return wipe (B → A) leaves the frame. The loop seam sits inside this wipe.
- To 1.57 s: clip A plays.
- 1.57–2.07 s: the A → B wipe runs. Clip B lands at 1.9 s (frame 57, both variants).
- To 4.73 s: clip B plays clean.
- 4.73 s to the end: the same wipe runs in reverse and is mid-frame on the last frame, then carries on from frame 0.

The demo loops with no visible seam. Both clips run continuously through it, and the seam is covered by a moving wipe.

## When to use it in a GTA 6 short
- Between clips in a compilation ("10 details you missed", "every trailer location"), where a hard cut feels abrupt.
- Going from a talking-head or facecam segment into gameplay.
- **Variant 0, Diagonal bands:** the default between-clip wipe. It has:
  - a solid amber lead line;
  - two printed panels;
  - a blue trailing line with a halftone dot fringe;
  - ink gutters between all of them.

  It runs through the full sunset sweep (amber → orange → pink → violet → blue) and reads top-left to bottom-right, like the next item in a list.
- **Variant 1, Iris:** a punchier reveal. A sunset sun disc swells from a point you choose (by default near the face in the sample clip) and opens into one printed ring that carries the whole sweep round it: blue at the top left, amber at the bottom right. The next clip's subject appears inside it. The radius grows at a constant zoom rate, so the complete ring stays on screen for about 5 frames before it whooshes out. Use it for the payoff clip or the "number 1" reveal.

## CONFIG fields (top of the `<script>` in `index.html`)
| Field | What it does |
|---|---|
| `variants[*].palette` | The sunset colours. Bands: from the leading edge (meets the outgoing clip) to the trailing edge (reveals the incoming clip). Iris: from the amber side to the blue side of the ring. |
| `variants[*].clipA / clipB` | The outgoing and incoming clips. They must match the `src` of that variant's `<video>` tags: `v0a` and `v0r` (A), and `v0b` and `v0w` (B). For the iris, use `v1a`, `v1r`, `v1b` and `v1w`. |
| `variants["0"].angle` | Band tilt from vertical, in degrees. 30 sweeps from top-left to bottom-right. |
| `variants["0"].bands` | The bands as `[from, to]` px, measured back from the leading edge. Default: lead line `[0,36]`, panels `[46,340]` and `[350,600]`, trailing line `[610,634]`, each 10 px apart. |
| `variants["0"].gutter` | The colour that fills the gaps between bands (default `#0B0B0E`). `null` lets the footage show through the gaps. |
| `variants["1"].rings` | The iris ring as `[from, to]` px back from the leading (outer) edge. Default: `[[0,96]]`, one 96 px ring. It stays a solid sun disc until its hole is 24 px wide, and clip B only shows once the hole has opened. |
| `variants["1"].sweep` | The direction of the colour sweep round the ring, as a CSS gradient angle pointing from amber toward blue. The default, 300, puts blue at the top left and amber at the bottom right, the same axis as the bands. |
| `variants[*].cut` | Where the A/B cut sits, in px back from the leading edge. Keep it inside the widest band. |
| `variants[*].ink` | `{ width, color }`: the keyline on both edges of every band. `null` switches it off. |
| `variants[*].highlight` | `{ width, color }`: the thin line just inside each band's leading keyline. `null` switches it off. |
| `variants[*].print` | The halftone inside each band: `{ pitch, clear, max, alpha, color, minBand }`. There are no dots on the leading `clear` share of each band (0.4, clean gradient). The ink coverage then grows to `max` (0.32) at its trailing edge. `pitch` is the dot spacing (22 px), and `alpha` and `color` style the dots (0.6, `#1F202B`). Bands narrower than `minBand` px stay solid (on the bands that is the lead and trailing lines). Add `footage: { light, dark, blur }` to scale the dots by the incoming clip's smoothed tones instead of `max`. `null` gives flat gradient bands. |
| `variants[*].halftone` | `{ size, maxR, depth }`: the dot fringe trailing the last band (dot pitch, largest dot radius, how far it trails). `null` switches it off (the iris default). |
| `variants["1"].fade` | `[opening, closing]`: the iris fades while its outer radius is under this many px (default `[50, 120]`). The sun disc is solid from its second frame, and the close never ends on a lone dot. |
| `variants["0"].pushA / pushB / scaleA / scaleB` | How far the outgoing clip is shoved along the sweep (and its zoom), and how far the incoming clip travels in (and the scale it starts from). Whenever a shift (or the impact shake) would uncover the frame edge, the scale is raised automatically, so the clip underneath never shows through. |
| `variants["1"].center` | Where the iris opens, in px. Default `[620, 700]`, which keeps the ring whole inside the frame up to a 460 px radius while the face in p05 still lands inside the hole. Point it near the next clip's subject and keep it inside x 72–936, y 230–1480. |
| `variants["1"].scaleA / scaleB` | The outgoing clip pushes in to `scaleA`. The incoming clip lands from `scaleB`. |
| `variants[*].timing` | `{ wipeIn, wipeOut, wipeDur, lag, ease }`. `wipeIn` and `wipeOut` are when the A → B wipe and the return B → A wipe start. `wipeDur` is how long each wipe runs. `lag` is how long after a wipe starts the incoming clip starts travelling in. `ease` is `"power3.inOut"` for the bands. For the iris it is `"expo"`: a constant zoom rate from `r0` px on the open, down to `r1` px on the close. |
| `impact` | `{ scale, shake, frames }`: the landing on the first frame after the cut clears. The default is a 1.035 → 1 punch over 2 frames plus a 6 px decaying shake along the sweep (vertical for the iris). |
| `timing` | `{ end, fps, loop }`: the composition length and frame rate (the impact frame is snapped to the frame grid). With `loop: true`, the return wipe runs on past `end` and wraps to frame 0, so the loop seam is hidden inside it. With `false`, frame 0 starts on clean clip A. |

## Render
Footage always shows (this is a full-frame component). `bg` is kept only for parity with the rest of the library.

```bash
# bands, high quality
npx hyperframes render . --variables '{"variant":"0"}' -q high -o sunset-wipe-bands.mp4
# iris
npx hyperframes render . --variables '{"variant":"1"}' -q high -o sunset-wipe-iris.mp4
```

## Swap in your own clips
1. Put your clips in `assets/` (vertical 1080×1920 works best; anything else is cover-cropped).
2. In `index.html`, change the `src` of your variant's four `<video>` tags: `v0a` and `v0r` (A) plus `v0b` and `v0w` (B), or `v1a`, `v1r`, `v1b` and `v1w`.
3. Set the same paths in `CONFIG.variants[...].clipA` and `clipB`. A video whose `src` doesn't match CONFIG is hidden.
4. Choose which second of each clip plays with `data-media-start`:
   - **Clip A (`v*a`, starts at 0 s):** media start `M`. It is seen from about 4.83–4.9 s (in the return wipe), through the seam, until about 1.87 s, so it needs one continuous shot from `M - 0.2` to `M + 1.9`.
   - **The return of A (`v*r`, starts at 4.8 s):** set its `data-media-start` to `M - 0.2`, so it runs straight into `v*a` at the loop seam.
   - **Clip B (`v*b`):** media start `N`. It starts at 1.5 s (bands) or 1.3 s (iris), is first seen at about 1.73 s / 1.6 s, and plays to the end. It needs about 3.4 s (bands) or 3.6 s (iris) of one shot after it is first seen.
   - **B's wrap (`v*w`, starts at 0 s):** set its `data-media-start` to `N + 3.5` (bands) or `N + 3.7` (iris), i.e. `N` plus 5.0 minus `v*b`'s `data-start`. It carries B through the seam for the first few frames.
5. For the iris, move `center` near the subject of clip B.

To use the wipe in an edit, set `timing.loop` to `false`, render it and drop it in where the cut should go. Trim it at about 4.6 s, before the return wipe. With the loop on, trim from about 0.4 s instead.

## Keywords
gta 6 transition, sunset wipe, diagonal wipe, slash wipe, band wipe, comic halftone wipe, halftone ramp, comic panel gutter, ink keyline, iris wipe, circle reveal, iris in iris out, sunset ring, impact frame, leonida gradient, vice city, compilation transition, shorts transition, tiktok transition, reels transition, seamless loop
