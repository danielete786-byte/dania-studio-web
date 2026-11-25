# #36 Punch zoom transition

A full-frame transition for GTA 6 compilation shorts (TikTok, Shorts, Reels). Clip A plays, then the camera either **punches in** with a radial zoom blur or **whips sideways** with a horizontal motion blur, and clip B lands. Near the end the same transition runs back into clip A, so the demo loops with no jump cut.

There's no text, so it fits between any two clips in a "top 10" or "details you missed" compilation without clashing with your captions.

1080×1920, 30 fps, 6.0 s. One HyperFrames project, two variants:

| Variant | Name | Sample clips | Use it for |
|---|---|---|---|
| `0` | Punch zoom | police SUV charging (p09) → man at the truck (p05) → back to the SUV | Hard-hitting beats: the next rank, a reveal, a drop on the music. Clip A accelerates into your subject (`focusA`) over about 7 frames, keeping its contrast. On the cut frame the exposure burns: highlights clip while B's silhouette shows through. B then arrives still streaked from 1.25× and settles in 0.3 s. |
| `1` | Whip pan | Lucia at the gate (p06) → drive-by past the mural (p04) → back to Lucia | Moving between locations or characters. A whips out to the left with a full-frame horizontal smear, and the switch to B happens at peak blur, inside the shutter, so there's never an A/B edge on screen. B whips in and decelerates. A soft amber lift marks the peak. |

**Hero frame:** t = 1.66 s (frame 50). Both effects are clearly underway and the subject is still readable: the SUV punching in (v0) and Lucia starting to whip out (v1).

## How it looks good
- **Real motion blur.** Each variant draws the footage through one WebGL2 shader. It takes 96 samples per pixel, jittered and averaged in linear light, across the zoom or slide the camera covered while the shutter was open.
  - The shutter is tapered, so streaks fade at both ends instead of ending in a hard edge.
  - Every tap reads a mip level that grows with the streak length. That pre-filters fine detail such as LED bars and chain-link fence, so it smears into light instead of breaking into barcode copies or striation.
- **The whip has no seam.** Each clip is smeared across the full frame (its edges mirrored, which only shows under heavy blur). The cut is a moment in time: the taps before it see A and the taps after it see B. The one frame that straddles the cut is a soft mix of two ~500 px smears.
- **The flash is an exposure burn, not a white card.** Light is multiplied in linear light plus a warm lift on the cut frame only, so highlights clip, the image stays visible, and the blacks come back within 3–4 frames.

## CONFIG fields (top of the `<script>` in `index.html`)

Shared:
- `duration`: total seconds. Keep it equal to `#root data-duration`.

Punch zoom (`variants["0"]`):
- `clipA.src` / `clipA.in`: the outgoing clip and its media in-point in seconds. `clipB.src` / `clipB.in`: the same for the incoming clip.
- `cut`: the flash frame where A becomes B.
- `returnCut`: where B punches back into A for the loop. Set it to `null` to end on B.
- `focusA` / `focusB`: the punch centres as `[x, y]` fractions of the frame. Put each one on its clip's subject.
- `punchIn`: seconds of accelerating zoom before the cut. `land`: seconds for the incoming clip to settle.
- `zoomA`: scale at the cut (2.3). `zoomB`: the scale the incoming clip lands from, down to 1.0.
- `landStreak`: the radial streak the incoming clip arrives with, as a fraction of `maxSpread`. It decays to 0 over `land`.
- `shutter`: blur length = zoom speed × shutter. `maxSpread`: the cap on streak length. `prefilter`: source pre-blur per pixel of streak.
- `vignette`: edge darkening while blurred. `drift`: the slow push on each held clip.
- `flash`: cut-frame flash strength (0.75 is a burn; 1 is near-white). `preFlash`: the exposure lift on the 2 frames before the cut. `flashDecay`: how fast it falls back. `exposure`: the multiplicative burn. `lift`: the additive shadow lift, scaled by flash².

Whip pan (`variants["1"]`):
- `clipA`, `clipB`: as above.
- `start`: when the whip begins. The switch is at `start + whip/2`. `returnStart`: when it whips back into A, or `null` to end on B. `whip`: how long each whip lasts (power4 in-out).
- `travel`: how far each clip slides, as a fraction of frame width. `direction`: `"left"` (picture travels left, B enters from the right) or `"right"`.
- `shutter`: blur length = speed × shutter (centred, tapered). `maxBlur`: the cap in px. `prefilter`: source pre-blur per pixel of streak.
- `camPunch`: camera scale bump at mid-whip. `drift`: the slow push.
- `leak` / `leakWidth`: strength and half-width of the soft #FE8E4E glow at the switch (`0` turns it off). `flash`: the amber exposure lift at peak speed.

## Render

```bash
cd gta6/36-zoom-transition
npx hyperframes render . --variables '{"variant":"0"}' -q high -o punch-zoom.mp4
npx hyperframes render . --variables '{"variant":"1"}' -q high -o whip-pan.mp4
```

This is a full-frame component, so footage always shows. The `bg` variable is kept for library parity and has no effect: a transparent render isn't meaningful for a transition. The blur needs WebGL2 for the mip pre-filter, and falls back to WebGL1 without it.

## Use your own clips

1. Copy your two clips into `assets/` (vertical 1080×1920 is best; other sizes are cover-fitted).
2. In CONFIG, set `clipA.src` / `clipB.src` and their `in` points. Also set the `src` on that variant's three `<video>` tags: `za`, `zb`, `za2` for the punch, or `wa`, `wb`, `wa2` for the whip. The `*a2` tag is clip A again, for the return.
   - The script applies CONFIG timing at load, but static paths keep the renderer's media pre-scan in step.
3. Each clip must be **one continuous shot** for as long as it's on screen. A hidden cut inside a clip reads as a second, untreated transition.
   - Punch: A needs `cut` seconds plus `duration − returnCut` seconds of pre-roll before `clipA.in`. B needs `returnCut − cut` seconds.
   - Whip: A needs about 1.85 s after its in-point plus about 0.3 s before it. B needs about 4.2 s.
4. Aim `focusA` / `focusB` at your subjects.

## Keywords
GTA 6 transition, punch zoom, zoom blur, radial blur, punch-in, flash cut, exposure flash, whip pan, swish pan, motion blur, light leak, WebGL2, seamless loop, compilation transition, short-form, TikTok, Reels, Shorts, Leonida, Vice City
