# #35 Sunset wipe: decisions

## v2 concept
- **The one idea:** the sunset IS the cut. Leonida-sunset light sweeps across clip A and leaves clip B behind it, already carrying the next segment's title. The title sits on B's side of the cut, so the sweep itself reveals it. The payoff hit lands on the first frame the sweep has cleared the whole title. It is a transition between segments of a compilation ("Vice City" -> "Leonida Keys"), not a decoration on top of one clip.
- **Shots and cuts.**
  - **v0 Diagonal bands (full-bleed vertical):** `s011` Vice City highway in daylight (signs, plane), held with a push and then pulled into the sweep. Wipe 0.7–1.8 s. Then golden hour, cut on rhythm: `s026` dock (to 2.3) -> `s108-v` balcony (to 3.6) -> `s036` beach bar (to 5.0). This is a day -> golden-hour transformation.
  - **v1 Iris (letterbox, 16:9 band at y 656–1264):** `s047-h` golden hour (0–0.5) -> `s108-h` sunset balcony (0.5–1.82). A sun gathers in the clear sky above the couple (0.5 s) and burns open (0.72 s). Then `s065-h` biker with the seaplane (the hole opens on his face) -> `s135-h` skydive over Vice City (2.4) -> `s012-h` muscle beach (3.9–5.0).
  - All shots play at 1.0x and every in/out point sits inside the shot.
- **Where the type sits.**
  - **v0:** lower-left (x 72, y 1104–1411), over the dark water, dock and bar counter of the golden-hour shots, on a bottom scrim that arrives with B. The faces in all three B shots are in the upper half.
  - **v1:** the title fills the top black bar, stacked and centred. The Rockstar-style label sits in the bottom bar. The letterbox gives the type its own room, so nothing covers the picture.
- **Hero size and face.**
  - **v0:** "LEONIDA / KEYS", Archivo wide 800 at 136 px (about 790 px of ink, 91% of the safe width). The "NEXT STOP" kicker is `.t-label-wide` 27 px (5:1), with a 13 px "/" sunset slash: one band of the wipe, kept.
  - **v1:** "VICE / CITY", Archivo wide 800 at 200 px, tracked .05em (about 640 px, 74%). "STATE OF LEONIDA" is 34 px wide caps, white with a 2 px `#EE08F2` offset (the Rockstar date style).
- **The payoff hit and its time.** `Look.impact` (flash 0, amp 9, zoom 1.035) + `Look.expose` (peak 1.6) on `#shake`, plus a 4 px, 0.16 s chroma on the hero, on the first frame the sweep has cleared the title box. The hit is computed in code from that box: **v0 1.80 s (frame 54), v1 1.67 s (frame 50)**. The kicker / label arrive 0.05–0.1 s later as the second beat. Hero time 2.25 s.

## v2 key decisions
- **Why the v1 look was dropped.** v1 was flat gradient shapes with comic halftone and ink keylines on soft 1080p plates, with no type and no light. Critics called it a "colour flash", "a dot pattern over a gradient" and "an Instagram story ring". Kept from v1: the job (a two-clip sunset transition), the "/" diagonal, the A/B cut hidden inside the widest band, B's landing zoom, the "the iris lands on a face" lesson, and the analytic sub-frame motion blur. Dropped: halftone, keylines, gutters, the seamless loop, `assets/plates`, and the bullseye/donut ring.
- **v0, speed-ramped sweep (the r05 critique: "it crosses in 8 frames and registers as a colour flash").**
  - The leading edge follows `g(p) = m·p + (1-m)·(0.5 + 4(p-0.5)^3)` with `hang` m = 0.12. That gives a whoosh in at about 200 px/frame, then about 10 frames under 30 px/frame with the group across the middle of the frame (A bottom right, sunset slabs, B top left), then a whoosh out.
  - The bands read as solid, designed slabs for a third of a second, and the motion stays fast.
  - Five bands `[[0,26],[62,170],[204,600],[634,740],[776,796]]`, with the cut at 402 inside the 396 px slab.
  - Each band lags the one ahead by 10 ms, so the group spreads while it is fast and bunches while it hangs.
- **v0, band material: light, not paint.**
  - One frame-space sunset runs ALONG the bands (amber low-left -> blue high-right), so every band is a slice of the same sky.
  - Each band has a lit leading edge (a 3 px warm-white line plus a 46 px light falloff) and a little violet depth at its trailing edge.
  - A quarter-res copy of the canvas is blurred and screened over the picture at 0.46, so the slabs light the footage around them.
  - Motion blur is a true 180° shutter: up to 12 sub-frame samples averaged with `lighter` at 1/n.
- **v0, the title is clipped behind the LAST band's trailing edge, not the cut.** The first r06 test showed "L" and "K" glimpses through the gaps during the hang. Now the title only appears as the trailing bands whoosh out across it. It is complete on the hit, with no half-revealed text while the group hangs.
- **v1, a burn-through iris, not a ring.**
  - The first r06 test drew a wide five-stop corona band: the r02 "Instagram story ring" again, and a small hole showing dark hair read as a pupil.
  - The light is now a burning edge: white-hot at the hole's rim, then amber, orange, pink and violet fading to clear. Its width is `64 + 0.2 x radius` (a tight fringe, not a band).
  - The young hole is still white-hot, and clip B clears into it by 170 px radius.
  - Before it opens, the same light is a sun with a 140 px corona that gathers over 0.22 s.
  - The hole grows at a constant zoom rate (14 -> 1500 px over 1.05 s). Normal alpha blending, not screen: screened light washed out to white on the bright sunset sky.
- **v1, the hole lands on a face.**
  - The sun's centre (324, 765) is clear sky in `s108-h`, about 125 px above the woman's head and clear of both faces.
  - B holds a 1.22 zoom about the band point (1080, 514), chosen so the biker's face sits exactly on the centre when the hole opens. It then lands to 1.0 (`power2.inOut`, 0.72 s -> hit + 0.3 s).
  - The biker wears sunglasses, so no blink. `s083` Lucia was tried and rejected because she blinks at media 0.1–0.3 and 1.2.
- **Letterbox is used on purpose (v1 only).** DESIGN lists the sunset wipe as letterbox-eligible. v0 stays full-bleed, so the two variants differ in frame, shape, colour logic (sky slices vs a burning sun) and content.
- **Finishing.** `Look.install` (grain .15, vignette .5 full-bleed / .38 letterbox), and one payoff light from `Look.expose`. There is no white flash and no leak (the sweep is the light moment).
  - **Exits:** the kicker/label blur out at 4.3 s, then the hero lines blur out with a 70 ms stagger. v0's scrim fades with them. The last 0.2–0.3 s is clean footage.
  - **Empty canvases are hidden.** This avoids the `text_occluded` lint once the sweep has gone. The title and canvases carry `data-layout-allow-occlusion`, because the sweep passing over the title is the reveal.
- **bg:none** is a transparent overlay: the videos, `Look.install`, the shake and the exposure are all off. The sweep, the title and the v1 letterbox bars stay. A creator puts it over their own A/B cut, with the cut at the hit frame.

## v2 round 6
- First v2 build (r01–r05 were the rejected v1 design). Everything was rebuilt from scratch: new shots, frame, type, light and timing, as described above.
- **Iterations inside the round (all re-captured as r06):**
  - **v0:** the first test used a 1.0 s `power2.inOut` sweep, and the thin bands smeared into translucent streaks. That was replaced by the speed-ramped hang.
  - **v0:** "LEONIDA" at 158 px ran to x ≈ 1000, past the safe edge. It is now 136 px (ink about 82–870).
  - **v0:** the title was clipped to the last band's trailing edge (no glimpses during the hang). Glow .62 -> .46 (it hazed the gaps).
  - **v1:** the opening sun sat on the couple's faces at (540, 912), and the concentric rings read as a target. That was replaced by the burn-through edge at (324, 765), recast to the biker (face on centre).
  - **v1:** the title was stacked at 200 px, because at 124 px on one line it left about 60% of the frame as dead black.
  - **v1:** the sun now gathers at 0.5 s (was 0.62), so the bars are empty for less time at the open.
- **Checked on the r06 MP4s:**
  - entrance, payoff, hold and exit frames for both variants;
  - the optical left edge on v0: the slash bottom ≈ x 85, the K stem ≈ 85, the L stem ≈ 82;
  - the safe zone: v0 type at x 72–870, y 1104–1411; v1 at y 252–612 and 1316–1350;
  - no face under type (B faces are in the upper half for v0, and v1's type sits in the bars);
  - Archivo wide renders, with no fallback;
  - `freezedetect`: no frozen footage;
  - exits blur out cleanly.
- `hyperframes check` passes. The remaining advisory warnings are the file-size and nested-`#ov` lint notes, plus WCAG contrast notes on the kicker characters while they are masked or blurring.
- **Unresolved / watch:**
  - v1 spends about 0.2 s as a small sun before it opens;
  - v1's bottom bar below the label is empty (the platform caption zone);
  - `s108-v` (v0's middle shot) is a shallow-focus shot and slightly soft at the edges.

## v1 history (rejected design, rounds 1–5)

### Round 1

**The object.** One wipe made with care: a group of bands (or rings) whose colour runs through Rockstar's full logo-style sunset sweep (`#FEB747 → #FE8E4E → #F84FA4 → #A341C0 → #365ECE`) as one continuous gradient across the whole group. The bands are the frame's single accent, so there is no type in this component.

**References.**
- `slash-wipe-transition/6pG997zTsAU-75`: diagonal panels and a fast ~0.4 s cover. Kept the diagonal and the speed. Swapped the flat red for the Leonida sunset.
- `comic-halftone-logo-wipe/xYZglLvVlyU-1.6`: halftone dots on angled panels. Here it is reduced to one restrained detail: a fixed dot screen behind the last band whose dots shrink to nothing, so the band dissolves into clip B instead of ending on a hard edge.
- `official-type/8L0CzL2V72c-30` (sunset sky card) and `analysis-3.md`: the palette.

**How it is built.**
- Bands and rings are drawn on one canvas from timeline time through `KitMotion.drive`, so every frame is seek-safe. There is no `onUpdate` and no randomness.
- The A/B cut is a CSS `clip-path` driven by the same time value: a half-plane on clip A for the bands, a `circle()` on clip B for the iris. It sits inside the widest band, so the cut is never visible. Gaps ahead of the cut show A and gaps behind it show B, which gives the slatted, see-through look.
- The motion blur is analytic. Sub-frame copies are summed with `lighter` on a clear canvas, which gives an exact average. The blur is capped at 26 px (90° shutter) so the thin leading bands stay solid instead of turning into translucent smears.
- Depth comes from a CSS `drop-shadow` on the canvas (1.5 px contact plus 16 px ambient), kept light so the gaps between bands read as footage, not as dark pinstripes (fixed in round 1 after the first capture showed dark lines between the thin bands).
- Travel uses `power2.inOut` over 1.1 s: the first sliver eases in, the middle is fast, and the last band eases out.
- The footage moves with the wipe. In the bands variant, A is shoved along the sweep (90 px, scale 1.06, `power2.in`) and B arrives 130 px behind and settles (`power3.out`). In the iris variant, A zooms into the iris centre and B lands from 1.18×. This is a deliberate plate transform, scoped to the transition.

**Variants.**
- **0, Diagonal bands:** a "/" slant at 30° that sweeps from top-left to bottom-right, the reading direction for the "next clip". Four bands (28, 74, 520 and 34 px wide) separated by 44–56 px gaps wide enough that the footage clearly reads through them. Clips: p01 "The Keys" sign → p03 Jason driving. Both are single shots with no internal cuts.
- **1, Iris:** four rings open from (540, 840), the upper-middle where the next subject usually sits. Clips: p06 Lucia at the gate (golden hour) → p05 the man in the palm shirt. Both are single shots.

**Timing.** 5.0 s in all. A plays for 0.9 s, so the entrance strip already shows the wipe arriving. The frame is fully covered at about 1.45 s (the hero frame), the overlay is gone by 2.0 s, and B plays clean to the end.

**Plates.** p02 was avoided because it contains the official logo. The media start points were chosen with scene detection so neither clip cuts while it is on screen.

### Round 2

Critic (r01): v0 6, v1 5. Biggest gap: soft, dirty edges (26 px motion blur plus a 16 px dark drop-shadow) and a 1.1 s wipe that is twice as slow as a short-form cut. Kept from round 1: the full Leonida sweep as one continuous gradient, the A/B cut hidden inside the widest band, the 30° "/" slant, both clip pairs, the halftone tail on v0 and the plate push.

**Defects fixed.**
- **Dark halos.** The canvas `drop-shadow` is gone (`#fx { filter: none }`). The gaps between bands now show clean footage with no dark gutters. No trailing-edge stroke was needed on v0: the hero reads crisp without one (`rim: null`, still available in CONFIG).
- **Iris bullseye.** The four concentric rings with black gaps are replaced by one solid 560 px gradient annulus (`rings: [[0, 560]]`, `cut: 320`) with a single crisp 3 px `#365ECE` inner rim. It opens as a sunset orb and then becomes a ring around clip B. There are no gaps and no rings to read as a target.

**Biggest gap.**
- **Sharp edges.** Motion blur is `min(6, speed / 400)` instead of `min(26, speed / 120)`, with sub-frame copies 1 px apart, so the edge is a smooth 6 px ramp instead of a stepped double edge. The iris rim is drawn after the blur, so the inner edge stays razor sharp.
- **Speed.** `wipeDur` 1.1 → 0.5 s on a `power3.inOut` curve. The slab crosses the frame in about 7 frames. `settle` 1.3 → 0.6 s, so clip B lands with a snap.
- **One clean leading edge (v0).** The two "speed line" stripes became one 44 px amber line, and the bands are now `[[0,44],[100,640],[688,712]]` (lead line, slab, trailing blue line). The halftone tail is a finer screen (`size 11, maxR 3.5, depth 80`). v1 has no halftone (`halftone: null`), so no dots wash over the face.
- **Softer plates fixed (v1).** `scaleA/scaleB` 1.16/1.18 → 1.06/1.08. v0's `scaleB` 1.10 → 1.08 to match.

**Loop.** A reverse wipe B → A now runs at `wipeOut` 4.2 s. It uses the same bands in the mirrored direction (bottom-right → top-left) and, for the iris, a closing iris. The return uses a second `<video>` of clip A (`v0r` / `v1r`) whose media start is set so its last frame runs straight into frame 0. The 5 s demo loops with no hard cut (verified by matching rendered frames to the plate: v0 frame 149 = media 0.667 s, frame 0 = 0.700 s).
- **Why 4.2 s and not the suggested 3.9 s:** the "The Keys" shot in p01 is only 2.23 s long (scdet finds a cut to "MARINA" at 2.27 s). A seamless loop needs A's pre-cut and post-return frames to sit inside that one shot. With the wipe at 1.0 s and the return at 4.2 s, both fit with a 2-frame margin. B still gets a 3.3 s hold, and A finishes settling at 4.95 s, before the loop point.
- `wipeIn` moved 0.9 → 1.0 s (A holds 1 s before the cut).
- **Plate media starts were re-picked against scdet cuts:** p01 0.72 s, p06 3.2 s (Lucia shot 2.4–5.5 s), p03 3.8 s (B is first seen at 4.07 s, after p03's 3.93 s cut), p05 0.7 s.
- **Plate transforms are computed in `render(t)`,** with no separate GSAP tweens, so both wipe directions stay seek-safe without overlapping-tween ordering problems.

**Hero:** 1.26 s (frame 38). v0 shows Jason revealed under the slab with the trailing line and dot fringe. v1 shows the man in the palm shirt inside the opened iris. The 8-frame overview strip samples at about 0.63 s intervals, so it misses the 0.5 s wipes. `v0-entrance.jpg` shows the wipe arriving.

### Round 3

Critic (r02): v0 7, v1 6 (both won the blind pick). Biggest gap: both wipes were flat CSS-style gradient shapes with no ink, texture or footage inside them, and the v1 five-stop radial annulus read as an Instagram story ring. The comic-halftone reference (`comic-halftone-logo-wipe/xYZglLvVlyU-1.2`, `-1.6`) gets its premium feel from black keylines and halftone-screened footage inside the slashes, so this round turns each band into a **printed panel**.

Kept from earlier rounds: the 30° "/" slant, the 0.5 s `power3.inOut` wipe, the A/B cut hidden inside the widest band, the mirrored return wipe and seamless loop (the media starts are unchanged), both clip pairs, the iris centre at (540, 840), no drop shadow, and the analytic motion blur on the fill.

**Defects fixed (v1).**
- **The lone blue dot at the close (frame 138).** Blue has left the iris palette altogether. Three rules now apply in `each()`:
  - nothing under 12 px radius is drawn;
  - a trailing ring is only drawn once its hole is at least 12 px wide, so it never fills in as a dot;
  - the whole iris fades on a quadratic curve while its outer radius is under 120 px (`fade: 120`).

  The close now runs: ring → setting-sun disc with a thin outer ring (frame 136) → a 35%-alpha ring fading out (137) → clean (138).
- **A pink dot in the hole on the open (frame 35).** I found this on the first r03 capture. The ±2 px motion-blur copies of the fill slipped past the old "lo ≤ 0" test for the thin inner ring. With the 12 px hole rule above, every blur copy makes the same decision. Re-captured, and frame 35 is now a clean orb with an open hole.

**Biggest gap: material.**
- **Ink keylines.** Every band and ring has a 4 px keyline on both edges: `#0B0B0E` on v0, ink-navy `#1F202B` on v1. Each line is centred on the edge, which also covers the motion-blur ramp, so the blur cap went 6 → 4 px (the ink width) and every edge reads as a clean cut.
- **Cut-panel highlight.** A 1 px `rgba(255,255,255,.35)` line sits just inside each band's leading keyline.
- **Footage inside the bands.** The incoming clip is screened as ink halftone dots on the sunset gradient (`print`):
  - The screen is a 16 px hex lattice with rows parallel to the bands. It is fixed in frame space, so the bands reveal it as they pass and the dots don't crawl.
  - Dot area runs from 3% (lightest footage) to 46% (darkest), which keeps the sunset colour dominant.
  - The tones are auto-levelled per frame (4th–96th percentile), so the low-key p03 interior still prints with variation instead of one flat dot size.
  - The print is registered to the live clip: it samples through the incoming clip's current transform, so it lines up with the footage around it.
  - At render time the sample is taken from the frame `<img class="__render_frame__">` that HyperFrames injects after each `<video>`, and the canvas re-renders on `hf-seek` once that image has decoded (the same pattern #28 uses). In preview the `<video>` itself is sampled.
  - I checked this with a debug overlay: the sampled frame is the right p03 frame.

**v0 fixes.**
- **"Bands", plural.** The 540 px slab is split into two panels with footage between them: `bands [[0,36],[90,340],[384,600],[640,664]]`, with `cut` 370 → 215 (the centre of the 250 px panel). Peak colour coverage drops to about 45% of the frame.
- **The fringe survives a phone.** `halftone {size:18, maxR:6.5, depth:150}`. At 360×640 (checked on frame 38) the dots read as dots, not as blue haze.

**v1 fixes.**
- **Not Instagram.** The solid 560 px annulus is replaced by a thin double ring, `rings [[0,150],[190,214]]` with `cut` 75. The palette is now the pink → amber core only (`#FEB747 → #FE8E4E → #F84FA4`, amber on the outer leading edge). The opening still swells as an amber-edged sun disc (frames 33–35), which the critic called the best moment.

**Both: impact on the cut.**
- The incoming clip used to ease from 1.08 over 0.6 s. Now it travels in linearly (bands: 130 px along the sweep; scale 1.08 → 1.035), so it is still moving on the frame where the cut clears.
- On that frame (frame-snapped: v0 frame 40 / 1.333 s, v1 frame 41 / 1.367 s; on the return, frames 136 / 137) it lands. The scale goes 1.035 → 1.012 → 1.0 over 2 frames, and a 6 px shake runs along the sweep (vertical for the iris), decaying as 6, −2.7, 1.2, −0.55, 0 px.
- `CLEAR` is solved analytically from the inverse `power3.inOut` curve. I checked it with a node simulation: A is fully gone on the impact frame and still visible in the corner on the frame before. `timing.settle` is gone, and `CONFIG.impact` controls the landing.
- `palette` moved from the top level into each variant.

**Checked:**
- `hyperframes check` passes with 0 errors and 2 advisory lint warnings:
  - the nested `#ov` canvas, which r02 also had;
  - a new "file has 398 lines" size note. I kept the composition as one file so the canvas, the cut and the plate transforms share one `render(t)`.
- v0 frames 33–44 at phone size.
- v1 open (frames 32–38) and close (frames 133–139): there are no specks.
- p01's "jet ski" frames at the loop point are the same continuous camera move as r02, not a new cut.

**Hero:** 1.26 s (frame 38), the same as r02.
- **v0:** Jason is revealed top-left. The blue fringe runs into a trailing line, then a violet printed panel, a strip of footage, a pink → amber printed panel and the amber lead line, all ink-keylined.
- **v1:** the man in the palm shirt sits inside the opened iris, framed by the amber printed ring and the pink inner ring.

### Polish round 4

Critic (r03): v0 8, v1 7 (both won the blind pick). Biggest gap: the halftone print set every dot from a 135×240 footage-luminance map, so at pitch 16 it showed no recognisable image, only mottled patches (v0) and a hard dot-size seam (v1). The reference (`comic-halftone-logo-wipe`) uses either a recognisable image in big dots or a perfectly even screen, never something in between, so both variants now commit to an **even tonal screen**. Nothing else in the concept, layout, timing, palette or clips changed.

**Defect fixed (v1): dot-size seam and dot-free blotches in the iris ring.** These were caused by sampling footage luminance (seam at hero x≈610 following the shirt edge; holes on the top arc at frame 133). The iris no longer samples footage at all. `print: { pitch: 16, ramp: [0.12, 0.40], alpha: 0.9 }`: ink coverage depends only on the distance behind the leading edge, 0.12 at the leading (outer) edge to 0.40 at the inner edge of the main ring; the inner pink ring sits at 0.40. Checked on the new render: the hero ring and frames 133–137 of the close are an even radial screen with no seam or holes.

**v0: the bands' print is smoothed.** The luminance map is box-blurred (radius 4 cells, 2 passes, about 29 px sigma) before the per-frame auto-levels, and the coverage range is narrowed to `light 0.10 / dark 0.38` (was 0.03 / 0.46). Neighbouring dots now differ by well under 1 px, so each panel reads as one even tone that drifts gently with the footage. The print is still registered to the live clip. I compared frame 38 at x 540–1000, y 1200–1700 side by side with r03: the mottling is gone.

**v1: aimed at the subject, and the ring reads as a lens iris.**
- `center` [540, 840] → [760, 600]. In p05 the man's face sits at the top right (about x 1000, y 420), and the old centre opened on the truck hood with the inner ring cutting his face. At 760, 600 the face is inside the hole on the payoff frame. The centre is still inside the safe area (x 72–936, y 230–1480).
- `rings` [[0,150],[190,214]] → [[0,112],[150,174]] and `cut` 75 → 56: a thinner 112 px main ring, a 38 px footage gap and the same 24 px inner ring, so the pink ring is relatively heavier and the pair reads as an iris rather than a donut. I kept the inner ring at 24 px instead of the critic's 18 px: at 18 px only about 14 px of pink is left inside the keylines, which is too narrow for a 16 px dot screen.
- **New speck, found and fixed on the first r04 capture:** with the new geometry, frame 34 opened a 16 px dark "pupil" in the sun disc. The first ring now stays a solid disc until its hole is at least 24 px (and draws no keyline or highlight around a closed hole), so the opening runs faint disc (33) → solid sun disc (34) → ring plus inner ring (35), as it did in r03. The close is still clean by frame 138.

**Pre-existing edge defect fixed (both).** I found this while checking the r03 MP4s; the critic didn't list it. A plate that was shifted further than its zoom could cover uncovered the frame edge, so the clip underneath (or black) showed through as a strip:
- v0 frames 34–36: about a 7 px strip at the left edge;
- v0 frame 134: 13 px;
- the impact shake once the scale had returned to 1.0: v0 frame 42 left column 10/11/8 against 43/44/41 next to it; v1 frame 43 top row.

The fix has two parts:
- A `fit()` guard raises a plate's scale (about its transform origin) to the smallest value that still covers the frame for its current shift. It applies to the outgoing push, the incoming travel and the shake. The incoming plate now settles 1.21 → 1.035 → punch → 1.0 instead of 1.08 → 1.035, which is monotonic and smooth (checked frame by frame in a node simulation). The outgoing bands push now reaches 1.146 by the time A is fully hidden.
- `k` (frames since the clear) is rounded, which removes a float error (3.99999 at frame 44/45) that left a stray 0.25 px shake.

On the new render, v0 frame 42 left column reads 47/46/43 against 47/47/44 at x = 4.

**Not taken: filling the v0 gap [340,384] with ink.** The "grey smear" in that gap on the hero is Jason's shirt in p03. I compared the crop against the plate: it's sharp plate content, and there is no blur on the footage. Footage between the two panels is a deliberate r03 decision ("bands", plural), so the gap still shows clip B.

**Hero: 1.233 s (frame 37)**, was 1.26 s (frame 38). The off-centre iris travels further (sMax 1523), so frame 37 is now its payoff: the ring wraps the man's face, with Lucia still outside. On v0, frame 37 shows the whole printed band group crossing the frame between "The Keys" sign and the car interior.

**Checked:**
- `hyperframes check` passes with 0 errors and the same 2 advisory warnings as r03;
- v1 frames 32–41 and 130–139;
- v0 frames 34–41 and 129–138;
- the edge columns and rows on the impact frames;
- the loop seam: v0 f148→f149 27.2 dB against f149→f0 27.6 dB, and v1 the same pattern.

### Polish round 5

Critic (r04): v0 7, v1 6 (both won the blind pick). Biggest gap: the wipe read as a dot pattern laid over a gradient rather than one designed object. Raw footage showed in the 44–54 px gaps between bands, and an even near-black screen at 0.9 alpha muddied the sunset. One defect: a jump cut at the loop seam. The concept, the 30° bands, the iris, the palette, the clips and the impact are unchanged.

**Defect: loop seam (both).** On the r04 MP4s the seam was already continuous in media time: frame 149 → 0 was a 1-frame step of p01, at 27.6 dB against 27.2 dB for 148 → 149. But the seam fell in a clean stretch of clip A, so nothing proved it. It now sits inside the moving return wipe, as the critic suggested:
- The return wipe starts before the end and runs on past 5.0 s. `render()` wraps the first frames back into it (`WRAP`, `timing.loop: true`).
- **v0:** the bands are across the frame centre on both frame 149 (lead edge at s = 792) and frame 0 (s = 283).
- **v1:** a complete ring sits inside the frame on both frames (outer radius 505 → 408).
- Both clips run continuously across the seam. A is `v*r` → `v*a`, as before. B gets a new element, `v0w` / `v1w`, that carries its last frames into frames 0–5, with media start = `v*b` start + (5.0 − `v*b` data-start).
- The timeline is rotated, not re-timed:
  - **v0:** wipe in at frame 47, clear at frame 57; return at frame 142, clear at frame 152 ≡ 2.
  - **v1:** wipe in at frame 42, clear at frame 57; return at frame 144, clear at frame 156 ≡ 6.
  - The holds are the same lengths as before.
- The media starts were re-picked so every visible stretch still sits inside one scdet shot:
  - **v0, A (p01):** 0.12–2.09 s, inside the 0–2.23 shot.
  - **v0, B (p03):** 4.13–7.43 s, inside 3.93–8.
  - **v1, A (p06):** 2.58–4.62 s, inside 2.4–5.5.
  - **v1, B (p05):** 0.88–4.45 s, inside 0–5.03.
- **Checked on the render** (crop PSNR, seam step against its neighbours):
  - **v1:** A region 149 → 0 is 36.3 dB against 34.8–42.7. B region is 21.1 against 20.6–24.0, because the plate is pushing in.
  - **v0:** B region is 27.7 against 33.8 for 148 → 149, because B accelerates on the `power2.in` push. The A region's lower values are the fringe dots crossing the crop.
  - No step is a content jump.
- `timing.loop: false` gives a render that starts on clean A, for dropping into an edit.

**Biggest gap: one object, not a pattern.**
- **v0, ink gutters.** `bands [[0,36],[46,340],[350,600],[610,634]]`, and the 10 px gaps are filled with solid `#0B0B0E` (`gutter`). With the keylines, each gutter reads as a 14 px comic-panel gutter. The r04 "Not taken" decision (footage between the panels) is reversed because the critic named a concrete defect: white-sky slivers read as silver stripes at 360×640 on the exit. Exit frames 0–2 and the seam frames are now checked at 360×640, and there are no slivers. The bands stay "plural" through the gutters.
- **Both, tonal ramp instead of an even screen.**
  - `print: { pitch: 22, clear: 0.4, max: 0.32, alpha: 0.6, color: "#1F202B" }`. Each band has no dots on its leading 40%, which stays clean gradient. Coverage then grows linearly to 0.32 at the trailing edge, the ramp the comic reference uses.
  - Each lattice dot belongs to its nearest band. That way a dot just inside the next band's leading edge never inherits the previous band's full size.
  - v0 no longer samples footage (it is now an optional `print.footage`).
  - **Deviation:** the 36 px lead line and the 24 px trailing line stay solid (`minBand: 80`). At pitch 22 their trailing 60% fits only one row of half-dots against the keyline, which looked like specks rather than a ramp.
- **v1, one ring.**
  - `rings [[0,96]]`, `cut 48`, with the full five-colour sweep running round it (`sweep: 300`). The sweep is a linear gradient across the ring's diameter on the bands' axis: amber at the bottom right, blue at the top left (the Leonida logo direction), each half running amber → orange → pink → violet → blue.
  - I used this instead of a one-way conic gradient, which would put a hard blue | amber seam on the ring and turn the sun-disc phase into a colour wheel.
  - Blue is back in the iris palette. The r03 lone-blue-dot rule (nothing under 12 px, fade at the close) still applies.

**v1: the open now registers as a shape.**
- `center` [760,600] → [620,700], as suggested. The ring stays complete inside the frame until its outer radius is 460 (was 320). The face is still inside the hole on the hero: the hole radius is 592 against about 450 px from the centre to the face.
- **Timing: exponential radius instead of `expo.inOut`.** I measured both in a node sim. `expo.inOut` on the linear radius over 0.8 s gives only 4 frames of a complete ring (power3 gave 3), because most of its travel is off-frame. A constant zoom rate (`ease: "expo"`, the radius × 1.3 per frame from `r0` 30) gives:
  - frames 43–47: a solid sun disc;
  - frames 48–52: the complete ring;
  - frames 53–56: the ring leaving the frame;
  - frame 57: the impact.

  That is 12 frames from a solid disc to the ring leaving the frame.
- **The close mirrors it** (× 0.81 per frame, down to `r1` 60).

**Found and fixed on this round's own captures (v1):**
- **A ghost of clip B in the fading disc.** While the ring is a sun disc (hole under 24 px) and partly transparent from the fade, B's clip circle showed through it (close frames 5–7, open frames 44–46). New rule in `cutAt()`: B is hidden while the hole is shut. The close therefore counts as cleared, and A lands, on the frame the hole shuts (frame 6).
- **The close lingered as a dot.** The exponential close slows at small radii, so with `r1` 30 a fading disc sat over Lucia for 4 frames. With `r1` 60 it runs: ring (frame 5) → solid disc (6) → 59% disc (7) → 38% disc (8) → clean (9). That matches r04's ring → disc → 35% → clean.
- **A ghost disc on the open.** The quadratic fade-in now spans 4 frames of the slower open, and the overview strip caught it as a faint pink disc. `fade` is now `[50, 120]` (opening, closing): the sun disc is solid from its second frame, and the close keeps the 120 px fade from r03.

**Hero: 1.8 s (frame 54)**, was 1.233 s. Both variants were re-timed so their payoff lands on the same frame:
- **v0:** the whole keylined band group crosses the frame between "The Keys" sign and Jason, with the lead line solid amber, two ramped panels, ink gutters, and the blue line and dot fringe.
- **v1:** the sunset ring (radius 688) frames the man in the palm shirt.

**Checked:**
- `hyperframes check` passes with 0 errors and the same 2 advisory warnings: the file size (now 513 lines) and the nested `#ov` canvas.
- v0 frames 146–149 and 0–2 at 360×640 (seam and exit).
- v1 open frames 42–57 and close frames 144–149 and 0–9: no specks and no B ghost.
- Edge rows and columns at every impact frame: no uncovered edge. The bright right edge on v1 frames 7–9 is a fence post entering the p06 shot.
- The 360×640 heroes.
