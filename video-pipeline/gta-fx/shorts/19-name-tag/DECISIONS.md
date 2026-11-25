# Decisions: 19 · Name tag

## v2 concept (craft v2 redesign; updated round 10)
- **The one idea:** the name is set like a film credit and lit by the scene it labels. v0 is *wired to the person*: a tracked lock-on pin on Lucia's collar, an elbow callout (a steep diagonal, then a horizontal leg that ends at the name's left edge), and the name hung under the leg. v1 is *born in the blast, landed on the cut*: a broadcast lower third whose surname rises in the fireball behind Jason, and whose last glyph seats on the cut to a sharp held shot of him, where the hit lands.
- **Shots and cuts (5.0 s):** v0 holds `s018-lucia-gate` (Lucia at golden hour) from source frame 6, pre-slowed 1.85x with motion-compensated interpolation into `assets/clips/s018-lucia-gate-slow.mp4`, with a 1.00 to 1.06 push. v1 has two shots and one cut: `s098` source frames 2–22 at 0.5x (`assets/clips/s098-jason-fireworks-050.mp4`, the blast: it erupts at 0.27 s and is full by 0.55 s), cut at 1.033 s (frame 31) to `s008-jason-driving` at 1.0x from its first frame, held to 5.0 s with a 1.00→1.05 push. He starts to smile in the last second.
- **Where the type sits and why:** v0 hangs the name on her dark shirt, well below her collar and face (the leg at about y 1150, the lockup at y 1180–1458, left at x 80). The callout runs from the collar down-left on her shirt, so it never crosses her face. v1 sits low-left (ink left x 80, surname baseline y 1392, block y 1207–1432): on s098 that's his black jacket at night (luma 0–4); on s008 it's a graded bottom burn that drops the lower frame to near-black from the cut on, while his lit profile fills the upper two-thirds. No face is covered.
- **Hero size and face:** Archivo wide throughout. v0: 124 px 800, LUCIA in white and CAMINOS in sunset (about 770 px, 89% of the safe width), with PROTAGONIST at 28 px in pure white. v1: JASON at 64 px wide 600 tracked .22em over DUVAL in wide 800 (fit to 88% of the safe width: about 745 px, cap height 117 px), then a 2 px sunset hairline under DUVAL leads into PROTAGONIST at 26 px, flush with the surname's right ink edge. The hairline is the one accent. v1's type composites above the grain, so it is pure #FFFFFF.
- **Payoff hit (light, not a grey flash):** v0 at 0.98 s, when the last CAMINOS glyph seats: a one-frame warm additive exposure flash centred on the sun at 15% 18%, one warm gold-to-pink leak from the sun side (under the tag), a 1.05 kick, a 0.4 s light pulse and ring snap on the pin, a sheen across the sunset and a warm bloom on CAMINOS. v1 at 1.033 s, on the cut, as the last DUVAL glyph seats: `Look.expose` on the incoming shot (1.7 peak, 2 frames at peak, 0.38 s decay; blacks stay black), an 8 px shake with a 1.04 punch, a 6 px RGB split on the lockup for 0.12 s, and a light sweep that crosses the surname (0.6 s). The fire's measured light glows on the name through the blast and hands over to a quiet daylight glow after the cut.

## v2 round 5 (build)

### Why v1 was thrown away
The owner called rounds 1–4 "basic, not professional or clean". They were a smoked-glass rounded card on a leader line, and a white slab lower third with a sunset tab: small UI cards floating on soft 1080p plates. In v2 both cards are gone. No variant has a container, so legibility comes from placement (a dark shirt, letterbox black), light and a soft lift shadow.

### Kept from v1
- The job and the real content: JASON DUVAL and LUCIA CAMINOS, "Protagonist" (FACTS.md). Lucia now carries the leader tag and Jason the lower third, because the shots dictated it. s018 is the only long, steady character close-up with a big calm dark area. Jason has the richest set of 16:9 shots for a montage.
- Pre-slowing instead of `data-playback-rate`: motion-interpolated `minterpolate` (mci/aobmc/bidir), starting after the trailer's head-lift frame 10. It renders 182 real frames with no judder.
- Seek-safety: every moving part of the leader (the tracked pin, plumb line, rule and junction) is computed from absolute time in one `Look.drive`, and nothing reads another tween's state. Fonts are loaded explicitly (`document.fonts.load('800 expanded …Archivo')`) before anything is measured or split.

### v0 Leader tag (Lucia)
- **Tracking:** the pin follows a template-tracked point on her neckline (a 132×60 px template matched on every third frame, smoothed over 7 taps, keyed every 0.2 s, Catmull-Rom between keys). I verified it against plumb-guides on six frames: it stays on the chin/neck centre line. It's mapped through the push (origin 540,614) so it stays glued as the shot pushes in. The tag lives inside `#shake`, so the payoff kick moves footage and tag together.
- **Geometry:** a vertical plumb line from the ring to a hairline rule at y 1060. The rule spans exactly the name's measure (x 80 to the end of CAMINOS). The junction gets a 10 px node. The line only ever moves vertically, so it can never cross her face, and the rule is always below her collar.
- **Why the label is under the name:** the pin's x runs from 374 to 528 px. A label above the rule would collide with the plumb line in the first 0.5 s.
- **Motion:** the pin locks on (ring 2.4x → 1x with expo, core back.out), the line drops (0.3 s), the rule grows out of the junction both ways (0.6 s expo), the names rise through masks char by char (35 ms stagger), and the role blurs in. It reads by 0.85 s. Exit: role blur-out, names rise out through their masks, then the rule folds into the junction, the line retracts into the pin and the pin lets go. Clean by 5.9 s.
- **Light:** LUCIA gets a warm bloom matched to the golden-hour key. The one accent is the sunset fill on CAMINOS. The sheen is the payoff's single light moment, with a 0.12 flash.

### v1 Lower third (Jason)
- **Letterbox:** DESIGN.md names it a top-edit look. A lower third that persists across cuts suits a band, because it doesn't point at anyone, unlike v0. The bars are real `#000` divs above the grain layer, so they stay true black (with only the root background, grain lifted them to #141414). Grain and vignette apply to the picture only.
- **Type:** Rockstar's date style from the Launch Trailer end card (white wide caps, a hard magenta offset and soft bloom). The offset and glow are `filter: drop-shadow` on each line, so the masked char reveal never clips the glow. The lockup breathes forward from 1.00 to 1.035 through the hold, like a trailer title.
- **Role:** the glyphs converge from a 12 px-per-char spread while blurring in. This is the classic tracking-in title move, done on x transforms because the lint (correctly) rejects animating `letter-spacing`.
- **Payoff:** the cut to s098 at 2.7 s. The flash is hosted in the band, so the bars never grey. Then an 8 px shake with a 1.035 punch, a 14 px RGB split on the name, and a 0.9 s bloom swell (magenta 26 → 66 px plus a warm 255,170,90 flare) that settles back. That's the one light moment; there's no leak.
- **Shot hygiene:** `s098-h` hard-cuts to another shot at frame 34 (1.13 s), which I found by per-frame luma. Its in-point plus duration stops at 1.11. The in-points sit about 1/3 frame past a source frame boundary (0.81 / 0.61 / 0.11 / 0.54, and 0.01 on v0), as a precaution against repeat/skip frames. I checked the renders with grain-suppressed per-frame diffs: there are no duplicate frames in either variant. The alternating diff pattern in the raw diffs is the grain, not the footage.

### Checks
- **Capture r05, hero 3.25 s.** In v1 that frame is the explosion shot with the bloom still settling and Jason sharp; at 3.0 he's motion-blurred. In v0 it's the clean hold, with the second pin pulse just starting. I inspected both hero PNGs, both strips and the entrance sheet, plus extra frames:
  - **v0:** 0.38 / 0.43 (entrance), 0.6, 0.97 (payoff split), 1.3 / 1.6 (sheen), 3.25 (hold pulse), 5.15 / 5.4 / 5.65 / 5.95 (exit).
  - **v1:** 0.45, 0.75, 2.7 / 2.77 (hit), 3.1, 3.25, 3.75, 5.3 / 5.5 / 5.95.
  - **Results:** no clipped glyphs, nothing outside x 72–936 / y 230–1480, no type on a face, Archivo everywhere, and both variants clean on the last frame.
- `hyperframes check` passes. I fixed two things to get there:
  - `gsap_non_transform_motion`: letter-spacing → per-glyph x.
  - `text_occluded`: the per-glyph gradient leaves of CAMINOS overlap a neighbour's box by a hair through kerning. The split chars get `data-layout-allow-occlusion` at runtime, because the audit reads the flag on the text element itself, not on an ancestor.
- `bg: "none"` (verified by snapshot over a test colour): no footage, bars, grain, vignette, flash or shake. Each variant shows a soft `lk-scrim-spot` behind its type as part of the graphic.

## v2 round 6 (critic r05: v0 7, v1 6 with a hard cap)

### Hard cap and defect fixed: v1 hero was 72 px, not 154 px
- **Cause:** the fit loop measured `offsetWidth` on `#block1 .nm`, which is `display:block`, so every line reported the full 1080 px container (> 856) and the loop stepped down to its 72 px floor. JASON DUVAL rendered 339 px wide (39% of the safe width).
- **Fix:** the loop now measures the glyph run with a Range (`range.selectNodeContents(line).getBoundingClientRect().width`). At the configured 154 px the lines are about 730 px (84% of the safe width), the hero-to-label ratio is 5.9:1, and the lockup sits at y 1111–1462 under the band, as the r05 layout intended. Verified on the r06 hero frame.

### Defect fixed: v0 repeated frames (root cause is the grain, not the clip)
- **What I measured:** the clip `assets/clips/s018-lucia-gate-slow.mp4` has no repeated frames (tblend minimum 0.46), and it was already encoded at 30 fps with `-g 15`. The r05 render repeated on frames 2, 4, 6 and 8 of every 9, identically on a re-render, so it was deterministic, not render load. A region diff showed the footage still moving on those frames; only the grain stood still (on still footage near the end, that made whole-frame repeats).
- **Cause:** the kit's grain driver in `Look.install` picks its frame with `floor(p*D*FPS + 1e-6)`, but GSAP rounds every tweened value to 6 decimals. At D = 6, `p = n/180`, and every n/180 whose 6th decimal rounds down (n ≡ 2, 4, 6, 8 mod 9) floors to the previous frame. That is exactly the observed pattern. It affects every 6 s component that uses the kit, but I may not touch `gta6/_shared`.
- **Fix (local):** right after `Look.install`, a second `Look.drive` rewrites the grain position each frame with the same hash, but with `Math.round(p*D*FPS)`. It's added after the kit's driver, so it renders last and wins.
- **Verified:** a tblend difference on the grain crop (x300 y1600 400×200 for v0, x300 y500 for v1) is ≥ 5.5 on all 179 frame pairs in both r06 renders (r05 v0 went as low as 0.00), and `framemd5` finds no repeated frames.
- I did not re-encode the clip as the critic suggested: it already has a keyframe every 0.5 s, and HyperFrames pre-extracts its frames, so it was never the cause.

### v0 payoff: light instead of a stock RGB split
- The 12 px, 0.42 s RGB split is gone. The landing now has only a 4 px, 0.2 s edge.
- **Leak:** at hit−0.06 s, 1.0 s, `#FEB747 → #FE8E4E`, centred at y 0.2 and sweeping from x −0.45 to 0.8 of the frame, at 0.7 opacity. It comes in from the bright sky at upper left (the scene's sun side) and washes across her hair and face like a flare, then clears by about 1.9 s. It stays above the rule, so it never fights the name.
- **Bloom:** CAMINOS gets a two-layer warm swell (`#FEB747` tight, `#FE8E4E` wide, peak about 0.8) on top of its pink bloom, decaying over 1.3 s. It settles a touch brighter than before (pink bloom .28 → .38), so the surname stays lit after the hit. It's a filter on `#n0b`, because `Look.bloom` uses `text-shadow`, which the gradient leaves cancel.
- **Impact:** flash .12 → .22, zoom 1.02 → 1.03. The sheen and the pin pulse stay.
- **What I kept:** the pin, plumb and rule structure is the deliberate v2 concept (wired to the person, never crossing her face). The critic's note was about the payoff grammar, not a defect, so the structure stays and the hit becomes light.

### v1 footage and timing
- **Blast on the cut:** `s098` now enters at 0.31 s (source frame 9.3, fireball at full spread) instead of 0.11, for 0.8 s (ends at 1.11, inside the 1.13 s hard cut). The flash, punch, split and glow swell now land with the explosion, not 6 frames before it.
- **End on a portrait:** the hazy `s076` hull-polishing shot is replaced by `s007-jason-door` (3.5–6.0, in-point 0.01). It opens on the trailer's frontal, sunglasses-and-smirk Jason in hard sunlight, then he turns to the door, so the hold has life and the montage resolves on the strongest image. I chose the 0.01 in-point over the critic's 0.4: the frontal look only lasts the first 0.3 s of the shot, and 0.4 starts on his back. `s007` runs to 2.51 of 3.93 s, and its luma curve shows no internal cut.
- **Rockstar date offset:** 4 px → 3 px, bloom 26 px/.42 → 30 px/.4. The payoff swell is rebased on the same values.

### Checks
- **Capture r06, hero 3.0 s.** v1: the explosion shot with the bloom settling, and the 154 px lockup. v0: the clean hold.
- I inspected both hero PNGs, both strips and the entrance sheet, plus extra frames:
  - **v0:** 0.5, 0.92 (flash), 1.05 / 1.15 / 1.2 / 1.4 (bloom and leak), 1.75, 2.6, 3.0, 5.15–5.95 (exit).
  - **v1:** 0.3, 0.6, 2.69–2.8 (hit), 3.5 / 3.6 (s007 portrait), 4.5, 5.4–5.93 (exit).
  - **Results:** no clipped glyphs, nothing outside x 72–936 / y 230–1480 (the lockup ends at about y 1462), no type on a face, Archivo throughout, and both variants clean on the last frame.
- I spot-checked the v1 `bg: "none"` render: the lockup at 154 px over its scrim spot, with no footage, bars, grain or flash. `hyperframes check` passes with 0 layout issues and 18/18 contrast.

## v2 round 7 (critic r06: v0 7, v1 7; one defect, no hard caps)

### Defect fixed: v1 hat crown clipped by the letterbox band
- The band and `s007` are gone (see the v1 rebuild below), so nothing can clip the frame edge any more. Every v1 shot is full-frame 1080×1920. The last 3.1 s is `s008` driving, where his head sits well inside the frame (sunglasses at about y 300, chin at about y 1000), and the push origin is on his face.

### v1 Lower third: rebuilt as a real full-bleed lower third
- **Why I reversed the r05/r06 letterbox:** the critic named it the converged look DESIGN.md flags (bars, wide caps, s098) and said it wasn't a lower third, and the letterbox band caused the r06 defect. The library's variety rule also reserves letterbox for cinematic-framing jobs, and a lower third isn't one. So this isn't flip-flopping on taste: a defect and a DESIGN.md rule both point the same way.
- **Footage:** vertical masters, full-bleed, cut on rhythm: `s008-v` 0–0.9 (in 0.41), `s078-v` 0.9–2.1 (in 0.81, after the hand-to-ear blur), `s098-v` 2.1–2.9 (in 0.31; it hard-cuts at 1.13, so it stops at 1.11), and `s008-v` 2.9–6.0 (in 1.71, out at 4.81 of 4.83). It opens and closes on the driving shot, so the montage resolves on his face: talking, then the smile. I used the critic's `s008` tail, but started it 0.7 s earlier and moved every cut 0.2 s earlier. That way the name lands at 2.1 rather than 2.7, and it holds for 3.1 s rather than 2.5. The strip also shows the phone shot twice instead of the driving shot six times.
- **Per-shot push:** one `Look.drive` sets `#push` scale and origin per shot from absolute time (`s008` 1.0→1.035 and 1.0→1.07, `s078` 1.02→1.055, `s098` 1.0→1.03), so every shot moves and the cut resets the move, like per-clip keyframes. The `s008` shots get a CSS lift (`brightness(1.12) contrast(1.05)`), because his face sits in the car's shade and the scrim and vignette were sinking it. v1's vignette is .38 instead of .5, because the bottom scrim already darkens the frame edge.
- **Lockup:** left-aligned at x 80, with DUVAL's baseline at y 1400. I measure the baseline with a zero-size inline-block marker before the split, so a shrunk name stays planted on the same baseline and builds upward. From the top: a 160×3 sunset rule (the frame's one sunset accent, with a soft pink/amber glow), then PROTAGONIST at 26 px as the kicker, then JASON / DUVAL at 148 px. The critic suggested 128 px, but that scales to about 580 px (67% of the safe width), under DESIGN's 70% hero floor. 148 px is about 670 px, or 78%, measured on the render.
- **Rockstar date style back to spec:** a 2 px offset (was 3) and an 18 px / .26 magenta bloom (was 30 px / .40), plus a soft dark lift shadow for footage.
- **Legibility:** `.lk-scrim-bottom` from y 760 to the bottom at .92, plus a soft radial spot sized to the lockup at .9. Both are part of the graphic, so they stay in `bg:none`. They fade in at 0.12 s and lift during the exit, and by 5.95 s the frame is clear.
- **Sequence:** the scrim fades in, then the sunset rule wipes in L→R (0.3 s, 0.5 s expo.out, through a seek-safe clip-path driver that never cuts the glow at a resting end), then the kicker converges leftward onto its set while blurring in (0.42 s). The name is off until the hit.

### v1 payoff: the reveal IS the hit
- At 2.10 s, the cut to the explosion, JASON rises as masked chars (stagger .03, 0.55 s expo.out) and DUVAL follows 0.06 s later. They come out of a .45 exposure flash, with an 8 px shake and a 1.035 punch on the footage (the lockup sits outside `#shake` and stays planted). The lockup takes an 8 px RGB split (was 14) for 0.45 s, and a 0.9 s bloom swell (magenta 18→44 px plus a warm 255,170,90 flare) that settles back to spec. It's seated by about 2.55 s and holds to 5.25 s.
- **Exit:** the kicker blurs out, the names rise out through their masks, the rule retracts L→R, and the scrim lifts. The last frame is clean footage.

### v0 Leader tag: the line owns the name
- **Angled callout:** one 2.5 px path, drawn from the ring's edge (24 px out from the pin, along the line) diagonally down-left to the rule's left end (x 80, y 1150). It turns there (round join) and runs right across the name measure (to about x 822). The leader draws in 0.35 s expo.out (0.22 s). The rule follows from the elbow (0.5 s, 0.5 s expo.out). On exit it folds back in reverse: rule → elbow → pin. The centre T-junction and `#jdot` are gone. Because the pin is tracked, the line's angle follows her as she moves. It always runs from collar to elbow below her neckline, never across her face.
- **Lower lockup:** the rule moved from y 1060 to 1150. The lockup now sits at y 1176–1460 (PROTAGONIST's baseline is about 1447, inside the 1480 limit), so it captions the portrait from below instead of sitting on her chest. The leader is longer (about 460 px), and the collar and face have room.
- **Payoff on the landing:** the hit is now computed as `last + (chars−1)·stagger + 0.45·dur` = 1.10 s, the moment the final S seats (about 96% of its rise). A different surname keeps the hit on its own landing. On the hit: flash .22→.32, kick 1.03, ring snap 1.6→1 (0.22 s expo.out), a core pop 1.35→1, the pulse, a 0.7 s sheen (was 1.0), the leak at .85 (was .7), and the warm bloom swell. The role now blurs in just after the hit (1.22 s), so the hit lands on a finished name and not mid-reveal.
- **What I kept:** 118 px (CAMINOS at 750 px is already 87% of the safe width; 122 px would pass the 88% ceiling). I also kept the tracked pin, the sunset surname and the masked char reveal.

### Checks
- **Capture r07, hero 2.55 s:** for v1, the s098 explosion with the name seated and his face sharp (s098 media 0.76 s; about 0.15 s later in the shot he's motion-blurred); for v0, the clean hold. `hyperframes check` passes: 0 errors, 0 layout issues, 18/18 contrast. The only warning is the usual file-length suggestion.
- I inspected both hero PNGs, both strips and the entrance sheet, plus extra MP4 frames:
  - **v0:** 0.3 / 0.45 / 0.7 (leader, then rule, then names), 1.1 / 1.17 (flash, then ring snap and bloom), 1.4 (leak), 3.3 (hold), 5.3 / 5.6 / 5.95 (exit).
  - **v1:** 0.45 / 0.85 (kicker in), 1.5 (s078), 2.1 / 2.2 / 2.4 (flash, rise and split, seated), 2.9 (cut to s008), 4.2 (hold), 5.5 / 5.95 (exit, clean).
  - **Results:** no clipped glyphs, every type element inside x 72–936 and y 230–1480, no type on a face, Archivo throughout, and a clean last frame in both.
- **Repeated frames:** face-region diffs after blurring away the grain (min 0.59 in v0, identical to r06's verified-clean render; min 0.79 in v1). There are no frozen frames, and every shot stops inside its length.
- **`bg:none`** (snapshots over a test colour): no footage, grain, vignette, flash, shake or leak. v0 keeps its scrim spot; v1 keeps its bottom scrim and spot, which fade smoothly with no hard edge (alpha checked down a column).

## v2 round 8 (critic r07: v0 7, v1 6; two defects, no hard caps)

This round was paused by a usage limit after a first capture. I re-checked that attempt frame by frame, kept what held up, made three more fixes (the v1 hit centre, a grade on the s078 hold, the leader leg ending on the ink edge) and re-captured r08 cleanly.

### Defect fixed: v1 showed no name until 2.1 s
- **Rebuilt v1, not polished** (it scored 6). The name now lands on the fireball at **0.60 s** and is readable by about 0.9 s. The kicker PROTAGONIST arrives at hit−0.12 (0.48 s), blurring in while its glyphs converge, so no label floats alone.
- **Footage:** the critic's plan, tightened. It opens directly on `s098` instead of `s008`, because the shot's own pre-blast beat (dark, Jason walking, 0–0.3 s) is a better setup than a 0.6 s cut-in, and the explosion itself becomes the hit. `s098` source frames 2–33 (it hard-cuts at 34) are pre-slowed to 0.4x with `minterpolate` mci/aobmc/bidir into `assets/clips/s098-jason-fireworks-slow.mp4` (2.53 s, 0–2.5 s here). Per-frame luma of the fire region: the blast starts at 0.3 s and peaks at 0.85 s, so the hit at 0.6 rides the bloom. His face is sharpest at 1.4–2.4 s (Laplacian variance 150–230), which is why the hero frame is 1.8 s.
- **The hold:** `s008` is gone. After the fire, one cut at 2.5 s goes to `s078` (the critic's alternative: sharp and lit), pre-slowed to 0.54x from source frame 23 (after the hand-to-ear blur) into `assets/clips/s078-jason-phone-slow.mp4`, with a 1.00→1.06 push on his face. That makes two shots and two looks, not three different-looking men, and the dim shadowed driving profile under the black roof is no longer on screen.
- **Duration 6 → 5 s (both variants).** Both footage plans need it: `s098` has only 1.11 s of usable source, and the critic asked to cap v0's slow. The name holds about 3.2 s (v1) and 2.9 s (v0), above the 1.2 s read rule, and each variant is clean by 4.9 s.

### Defect fixed: v0 slow-mo ghosting
- I re-made `assets/clips/s018-lucia-gate-slow.mp4` with `minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, from source frame 6 at **1.85x** (was 2.36x), giving exactly 150 frames (5.0 s). Fewer synthesised frames, motion-compensated rather than blended. I checked full-resolution face crops on interpolated frames (around 3.4 s): the hair strands are single, with no double exposure.
- **Re-tracked the pin on the new clip:** template matching on a 220×170 chin/neck/collar patch, searched ±60 px, with the template refreshed every 6 frames, run forward and back from 1.03 s, then a 7-tap smooth and keys every 0.2 s. I verified 12 frames with plumb lines: the point stays on the collar band on her chin line. `pinDy` 30 → 12, because the new key point already sits on the collar.

### Both: a warm additive exposure hit instead of the grey veil
- `#xhit`: a radial `#FFE7C2` with `mix-blend-mode: screen`, at full peak (.6) on the hit frame, then decaying over 0.25 s power3.out (it starts half a frame later, so the next frame is already falling). It sits inside `#shake`, over the footage and under the type, so it lights the image instead of greying the frame or the lockup. `Look.impact` now runs with `flash: 0` (shake and punch only).
  - **v0:** centred on the sun (15% 18%), radius 1050. Mean luma goes 60 → 67 on the hit frame, and the sunlit upper left 104 → 132; her face lifts like a flare.
  - **v1:** centred on the fireball at **85% 30%**, radius 950. The critic named 70% 30%, which was the fire's centre at r07's unslowed in-point. On the slowed clip at 0.6 s the fireball is still to the right: its measured brightness centroid (luma > 170) is 86% 31% on frames 16–20. At 70% the hit sat between his head and the fire and read as a halo on his head. At 85% it punches the fireball and rakes warm light across the fire side of his face. A first pass at radius 1250 lifted his dark jacket into a brown haze at full resolution, so I kept 950.
- The v0 light leak is gone (the critic said it washed her face). The one light moment is the exposure hit, plus the pin flare and the surname sheen.

### v0: an elbow leader instead of the coat-hanger
- **Geometry:** the path now runs from the ring's edge down-left at 58° to an elbow on the leg's y, then horizontally LEFT to the name's left edge (x 80). The leg points into the name instead of running away from the pin. A literal 80 px diagonal can't reach a lockup that has to stay below her collar (the pin sits at y 880–930 and the leg at about y 1122), so I kept the critic's shape (pin → diagonal → elbow → leg ending at the name's left edge) with a steeper, longer diagonal. The elbow follows the tracked pin, so the leg breathes with her (about 190–340 px), and `minLeg` 90 keeps a leg if the pin drifts left.
- **The leg ends on the ink, not the box.** Wide caps carry a side bearing (about 8 px on the L at 134 px), so a leg ending at x 80 overhung LUCIA's stem. The leg's end is now `block.left` plus the smaller first-glyph bearing of the two name lines, measured per name with canvas `actualBoundingBoxLeft` (Archivo 800, expanded). Verified at full res: the leg's end sits flush over the L's stem and the C's bowl.
- **Draw:** 0.28 s expo.out from the pin outward, as one path parameterised by length. A 6 px directional motion blur on the drawing head comes from an SVG `feGaussianBlur` whose stdDeviation follows the head's direction (diagonal, then x) and fades as the line settles. The filter region is in user space, so a horizontal (zero-height) path still renders. On exit, the line retracts from the name back into the pin, with the same blur, then the pin lets go. The stroke is 2.5 → 3 px.
- **Pin:** on the hit, a 0.4 s light pulse (a warm screen-blended flare blooming 0.55 → 1.35 and fading), the ring snap (1.6 → 1) and a 0.4 s pulse ring. The quiet hold pulse moved to 2.7 s.
- **Type:** the hero is 118 → 134 px (letter-spacing .01 → .005em), and CAMINOS measures about x 88–918, inside 936. The role is 26 → 28 px at 100% white. The lockup is now anchored by the role's baseline (1458) and builds upward. This round I followed the critic over DESIGN's 88% hero-width ceiling: the critic named 118 px as timid, and the line still fits the safe zone with margin.

### v1: light instead of the stock rule
- The 160 px sunset anchor rule is gone; it was the "stock lockup" part and only existed to set the slot early. The lockup is now kicker + name in one Rockstar date style family: the kicker is 28 px white with a 1 px magenta offset, and the name keeps the 148 px wide caps with a 2 px offset that the critic liked.
- **Fire-lit name:** `CONFIG.fire.luma` is the measured mean luma of the fire region of the slowed clip, one value per frame. Each frame, a warm `rgba(255,166,86)` glow on the name follows it (alpha .55·L, radius 14 + 16·L), so the name flickers and breathes with the blast. On the cut to daylight it goes out with the fire. The hit swell (magenta 18 → 32 px, plus a warm flare) is smaller than r07's, because at full strength on top of the fire light it read as glow soup. With `bg: "none"` the fire light is off.

### v1: the daylight hold, de-veiled
- `s078` takes a CSS grade, `contrast(1.12) saturate(1.1) brightness(0.98)`. Under the bottom scrim, the lockup spot and the grain, the daylight close-up read flat and hazy at full res next to the clip itself. The grade restores the clip's own contrast so the hold reads as sharp and lit, as the critic intended. s098 keeps its `brightness(1.06) contrast(1.04)` lift.

### Checks
- **Capture r08, hero 1.8 s:** v1 is the fire shot with his face sharp and the name seated; v0 is the clean hold with the elbow leader. `hyperframes check` passes: 0 errors, 0 layout issues across 9 samples, 18/18 contrast. The only warning is the usual file-length suggestion.
- I inspected both hero PNGs, both strips and the entrance sheet, plus extra MP4 frames:
  - **v0:** 0.27 / 0.33 / 0.5 (leader, then names), frames 6–11 at full res (directional blur on the draw), 0.97 / 1.0 / 1.03 / 1.07 / 1.2 (hit), 3.0 (hold), 3.95 / 4.2 / 4.45 / 4.65 / 4.95 (exit, with frames 126–136 cropped for the retract).
  - **v1:** 0.45 / 0.57 / 0.6 / 0.63 / 0.7 / 0.9 (kicker, hit, rise), 1.3 (fire light), 2.45 / 2.5 (the cut), 3.5 (hold, full res against the clip), 4.15 / 4.35 / 4.6 / 4.95 (exit).
  - **Footage:** full-res face crops across the whole s018 slow (every 7th frame) and the s098 slow (frames 10, 13, 31, 47). They show single hair strands and no double edges. The softness on s098 frames 31–47 is the source's own motion blur as he turns.
  - **Results:** no clipped glyphs; every type element inside x 72–936 and y 230–1480; no type on a face; Archivo throughout; a clean last frame in both.
- **No frozen frames:** grain-suppressed face-region diffs give a minimum of 1.34 (v0) and 2.13 (v1), with no pair under 0.3. Every clip stops inside its length: s018 slow is 5.00 s (used 0.01–5.0), s098 slow 2.53 s (0.01–2.51), s078 slow 2.50 s (0.01–2.50).
- **`bg: "none"`** (a v0 render after the ink-edge change, plus earlier snapshots): no footage, grain, vignette, exposure hit, shake or fire light. v0 keeps its scrim spot; v1 keeps its bottom scrim and spot.

## v2 round 9 (critic r08: v0 8 pass, v1 7; no defects, no hard caps)

### v1: one shot on fire, no mid-hold cut
- **The gap:** r08 cut at 2.5 s, with no beat, to `s078`, which was soft and milky with lifted blacks. Half the runtime sat on the weakest footage, and the lockup went flat on his grey tank top.
- **What I chose:** the critic's first option, keep v1 on fire. I tried the second (`s008` on a hit) first and measured it. Its lockup region (x 80–860, y 1150–1460) averages luma 65–105, about the same as `s078` (78–109), because his white tank top fills it. White type there would go flat again. On `s098` the same region measures 0–4, his black jacket at night.
- **The footage:** `s098` only has 32 usable source frames (it hard-cuts at frame 34). So `assets/clips/s098-jason-fireworks-ramp.mp4` is a speed ramp built in one `setpts` expression on the source frame index: frames 2–9 at 0.4x (0–0.58 s, the dark pre-blast walk, the same timing r08's opening was praised for), then frames 9–33 at about 0.17x (to 5.1 s). It uses `minterpolate` mci/aobmc/bidir, 153 frames. The step into ultra-slow lands with the hit at 0.6 s, so time slows as the name is born. The ramp is an editor's move, not a stretched clip.
- **Checks on the ramp:** whole-frame consecutive diffs have a minimum of 1.26, with no repeated frames. A face-detail measure (frame minus a 2 px blur) shows no alternating sharp/soft pulse on the interpolated frames. It climbs from the source's own motion blur during the head turn (about 1.0–2.9 s) to its sharpest at 3.1–5.0 s, where he looks into the lens. Full-res crops show single edges on his face and hands. Fire detail morphs cleanly.
- **The cleanup:** `s078` is gone, and `assets/clips/s078-jason-phone-slow.mp4` and `s098-jason-fireworks-slow.mp4` are no longer referenced. `fire.luma` is re-measured on the ramped clip (151 values, normalised; it peaks at 1.0–1.4 s and is still .6–.4 through the exit), and `fire.end` is 5, so the name is fire-lit for the whole hold.

### v1: a lower-third structure of its own
- **The gap:** the r08 layout was v0 without the leader: x 80, a two-line stack at one size and the same face.
- **The new structure:** the critic's spec, which is broadcast grammar.
  - JASON is the small line: 64 px, wide 600, tracked .22em.
  - DUVAL is the hero, wide 800. It starts at 190 px and is fit to `maxWidth` 760. The critic's literal 190 px would be about 860 px, past the safe edge, so it lands at about 745 px ink (86%, cap height 117 px).
  - A 2 px sunset hairline sits 32 px under DUVAL's baseline (y 1424). It runs from the ink left edge to 24 px before PROTAGONIST (26 px). PROTAGONIST's right ink edge is flush with DUVAL's (measured on the render: 824 against 825).
  - The block reads as one justified unit. The hairline is the one accent, drawn 0 → about 388 px (x 80–467, measured on the render) over 0.45 s expo.out. The magenta offset and bloom are gone (the critic asked for the hairline "instead of the magenta edge"), and the name is pure white with the fire glow and a dark lift.
- **Alignment is measured, not guessed:** canvas ink bearings set the shared left edge (J, D and the hairline all start at x 80–81). The right edges are measured on the split DOM. The first capture showed the role 7 px short: split glyphs are inline-blocks, so DUVAL loses its VA kerning and sets wider than the canvas measure. I now measure the last glyph's box after splitting, minus its right side bearing (and, for the role, its trailing tracking).
- **Sequence:**
  - JASON tracks in at hit−0.12 (glyphs converge 10 px/char while blurring in).
  - DUVAL rises as masked chars in the hit at 0.6, with the 6 px split, shake and punch.
  - The hairline draws at hit+0.3, and PROTAGONIST converges in at hit+0.62. The full block is set by about 1.5 s.

### Defect fixed (v1): lone glyph sliver on the exit
- The per-char mask exit left a lone L-foot sliver for one frame. Both lines now leave as **whole masked lines**: JASON's own mask wrapper (`#m1a`, generous padding so the tracking-in never clips), and DUVAL's word inner (`.lk-in`). They are 0.06 s apart, with power3.in over 0.42 s, a blur ramp to 6 px in the line's filter driver and an opacity fade over the second half. Frames at 4.10–4.70 show no sliver at any point; the last partial frame (4.55) is the soft blurred lower half of DUVAL. Before that, the role blurs out (4.1) and the hairline retracts right to left (4.18–4.5). The scrim lifts after, and the frame is clean by 4.7 s.

### v0: the payoff lands
- **Flash:** the exposure hit's one-frame peak went from .6 to **.9** (decay .25 → .28). On the hit frame (frame 30, 1.0 s) the upper-left quadrant goes from luma 104 to 156 (r08: 139), and the whole frame from 50 to 64.
- **Leak:** one `Look.leak` at hit−0.03 for 0.6 s, #FEB747 → #F84FA4, opacity .6, from the sun side (y .14, from −0.55 to 0.25 of the width, 1300 px).
  - It's hosted in `#leakhost`, inside `#shake` over the footage and under the tag, so it lights the scene and never the name.
  - A first pass that travelled to 0.6 of the width put the pink lobe across her face at 1.25–1.4 s (r07's complaint). The shorter travel keeps the leak on the sky and fence, and only a faint warm edge reaches her hair.
- **Kick:** zoom 1.03 → 1.05, amp 3 → 4.

### v0: type and exit
- **CAMINOS 134 → 124 px.** It measures x 88–855 on the render: about 767 px, 89% of the safe width, with about 80 px of air before the safe edge.
- **The pin no longer lingers:**
  - The exit starts at 3.95 (was 3.9). The callout retracts at out+0.25 over 0.3 s (4.2–4.5).
  - The pin collapses right behind it, at out+0.5, with the ring over 0.2 s and the core over 0.17 s. It is done by 4.65 s, so the pin is alone for about 0.15 s (was 0.45), and the last 0.35 s is clean footage.
- **Hidden sliver fixed:** the extra frames showed v0's staggered per-char exit leaving two lone glyph feet at 4.47 s, the same fault the critic flagged on v1. Each glyph now fades over the second half of its rise (0.22 s power2.in, same stagger). Frames at 4.33–4.65 are clean.
- **`bg:none`:** the scrim spot behind the tag used to stay on after the exit. It now fades in with the pin and out with the exit, so the transparent overlay ends empty (verified by a bg:none render, frames 0.05 / 0.4 / 2.0 / 4.6 / 4.95).

### What I kept
- v0's structure (the tracked pin, the elbow callout, the sunset surname, the masked char rise, the retract into the pin). The critic passed it and called it designed motion.
- v1's hit at 0.6 on the fireball, the fire-driven glow, the scrim and spot, and the `#shake` / lockup split.

### Checks
- **Capture r09, hero 3.5 s.** v1 is the fire shot with his face sharp and the full lockup set. v0 is the clean hold. `hyperframes check` passes: 0 errors, 0 layout issues across 9 samples, 18/18 contrast. The only warning is the usual file-length suggestion.
- I inspected both hero PNGs, both strips and the entrance sheet, plus extra MP4 frames:
  - **v0:** 0.94–1.45 (flash, leak, kick; 8 frames), 1.0–1.5 after the leak fix, 3.5 (hold), 4.0–4.75 (exit, cropped to the tag; 9 frames, twice).
  - **v1:** 0.45–1.4 (8 frames: tracking-in, hit, rise, hairline, role), 0.567–0.8 (hit), 2.2 / 3.0 (hold), 4.1–4.7 (exit, cropped; 9 frames), plus a full-res lockup crop with measured ink extents.
  - **Results:** no clipped glyphs; every type element inside x 72–936 and y 230–1480 (v1's block is y 1207–1432, v0's role baseline is 1458); no type on a face; Archivo throughout; a clean last frame in both.
- **No frozen frames:** 8x area-downscaled face-region diffs give a minimum of 1.56 (v0) and 1.82 (v1), with no outliers below the 5th percentile. Every clip stops inside its length: s018 slow is 5.00 s (used 0.01–5.0) and the s098 ramp is 5.10 s (used 0.01–5.01).
- **`bg:none`** (renders of both variants): no footage, grain, vignette, exposure hit, leak, shake or fire light. Both end on an empty frame.

## v2 round 10 (critic r09: v0 8 LOCKED, v1 7; one v1 defect, no hard caps)

### Defect fixed (v1): the 0.17x hold smeared Jason's face
- **The defect:** the 1.4 s `s098` was ramped to 5 s, with 0.17x from 0.6 s on. During the head turn (about 2.4–3.2 s) his face was motion-blurred mush, right through the read.
- **What I did:** the critic's edit. `s098` now plays only through the blast, and the hold is a different, sharp shot at real speed.
  - **Shot 1, the blast (0–1.033 s):** `assets/clips/s098-jason-fireworks-050.mp4`, source frames 2–22 at a constant 0.5x with motion-compensated interpolation (mci/aobmc/bidir, 39 frames, 1.3 s). 0.5x is DESIGN's floor for slowed footage. The explosion erupts at source frame 6 (0.27 s) and is full by frame 10 (0.53 s). The cut lands at source frame ~17.5, before his head turn (source frames 20–22), so the blurred turn never shows. I checked every frame of the clip on a face crop: no warping or double edges; the fire morphs cleanly.
  - **Shot 2, the hold (1.033–5.0 s):** `s008-jason-driving` at **1.0x** from 0.01 s (the critic suggested 0.6–0.8x; DESIGN says hold at 1.0x and the shot is long enough: 3.97 s of its 4.83 s), with a 1.00→1.05 push on his face (56% 30%). His profile is sharp in every frame (face Laplacian 1.33–1.70, no soft stretch), and he starts to smile in the last second, so the piece ends on its brightest frame.
  - The old ramp and the r08 clips stay in `assets/clips/` but are no longer referenced.
- **Making s008 work under a lower third:** r09 rejected `s008` because the lockup region (his tank top and the street) measures luma 65–105, so white type went flat. Three fixes, all v1-only:
  - **A bottom burn** (`#burn1`, CONFIG `burn`): from the cut on, a graded fade from y 800 that is .6 at the first name, .8–.88 under the surname and .95 at the bottom. It's not a box: the frame falls to black under the lockup the way a trailer title card does, and his profile stays lit above it. It switches on at the cut (the cut hides the step), lifts with the scrim on the exit, and is off for `bg: "none"`.
  - **The grain no longer lifts the blacks.** I measured the car roof: luma 0.6 in the source, 18.6 in the render. The kit gives its finishing overlay a z-index, which makes it a stacking context, so the grain's `mix-blend-mode: overlay` blends only with the vignette and then lands on the picture as plain grey. For v1 the wrapper's z-index is dropped (`fin.el.style.zIndex = "auto"`; it is still the last child of `#root`, so it paints over the footage), so the grain really overlays: the roof measures 0.0–1.1 now and the grain still shows in the mids. That's what made r09's and r08's frames read as murky.
  - **A tone lift on s008** (SVG `feComponentTransfer` table, built in the v1 branch only, + saturate 1.1): his face is a backlit profile (mean luma 19 in the source). The curve opens the shadows and low mids and keeps black at 0. The face region measures 27 (was 14 with true blacks and the vignette).
- **The type sits above the grain** (`#block1` z 95; the scrims and burn stay under it). The critic flagged greyed type under the grain for v0; on v1 the name is now pure #FFFFFF.

### The hit lands on the seat, on the cut
- The critic: "the hit fires at 0.6 s, when DUVAL only begins rising, so nothing slams". The surname's rise is now timed **backwards from the cut**: `rise = cut − (chars−1)·stagger − seat·dur` (seat .45), so it starts at about 0.67 s in the full fireball and its last glyph is 96% seated on the cut frame, landing into the hit over the next two frames. JASON tracks in 0.12 s ahead.
- **On the cut (frame 31):** `Look.expose` on `#shake` (peak 1.7, 2-frame hold, 0.38 s power2.out decay; starts one frame early so its attack ends on the cut frame), `Look.impact` with `flash: 0`, amp 8, zoom 1.04, `Look.chroma` 6 px for 0.12 s. All of them are on the cut frame and none on the frame before. Measured on the window region: 102 → 139 on the two peak frames, back to ~95 by 1.3 s. The old warm screen flash on the fireball at 0.6 s is gone, so there's one hit.
- **Light sweep:** the critic asked for `Look.sheen` across DUVAL, but a white band over pure white type is invisible. Instead an identical, identically split copy of the surname sits on top (`#n1bs`), carrying a tight white-to-warm glow (2 / 7 / 16 px). Its wrapper (`#sw1`, padded so the glow is never cut at the word's ends) is masked by a 105° band that travels left to right over 0.6 s from the cut, so each glyph flares as the light passes. The first try (12 / 30 px glows) filled the D and A counters with an orange smudge; the tighter glow doesn't.
- The hairline draws out of the hit (cut + 0.04 s, 0.45 s), and PROTAGONIST converges in at cut + 0.3 s. The block is complete by about 1.8 s and holds to 4.1 s.
- **Fire light:** the name glows with the measured fire luma of the new clip (re-measured, same normalisation as r09) through the blast, then hands over to a quiet daylight glow (.12) over 0.35 s after the cut.

### Exit (v1)
- Once the burn lifts, the old late fade left DUVAL's glyph feet in the mask as a row of dashes for one frame (4.6 s) over the bright tank top. The fade now runs from 45% to 85% of the masked rise (power2.in), so by the frame where only feet would remain the name is gone. Frames 4.1–4.7 are clean; the scene comes back bright at 4.7–5.0 with him smiling.

### v0 (locked): no change
- Nothing that v0 renders was touched: every change is in the v1 branch, in v1-only elements (`#c2`, `#burn1`, `#sw1`), or gated on `V.style === "lower"`. The kit sync added `Look.expose` to `look.js`, with no change to the existing helpers.
- **VS-PREV warns anyway (v0 0.979 < 0.985), and it is renderer noise, not a change.** I rendered v0 from the exact r09 `index.html` today: it scores 0.979 against r09's own v0.mp4 as well, and 0.979 against r10's. With the grain blurred out (gblur σ 6), r10 v0 against r09 v0 scores a mean SSIM of 0.9963 (min 0.9957 over 150 frames), the same as the r09 code re-rendered (0.9963). The grain sits at the same position in both (high-pass cross-correlation peaks at zero shift); the residual is run-to-run compositing and encoding noise on v0's grain. So the picture is identical, and only the grain noise differs between any two renders.
- I did not act on the critic's optional v0 notes (weight the line and ring, a 2-frame flash, type above the grain), because v0 is locked and none of them is a listed defect.

### Checks
- **Capture r10, hero 2.9 s.** v1 is the clean hold: a sharp profile with the fence and plants in the window and the full lockup on the burn (3.0–3.4 s has a green lens flare from the trailer across his neck, so I avoided it). v0 at 2.9 s is its clean hold. `hyperframes check` passes: 0 errors, 0 layout issues across 9 samples, 18/18 contrast.
- I inspected both heroes, both strips and the entrance sheet, plus extra v1 frames: entrance 0.43–1.0 s (every other frame), the cut and hit (frames 30–36, full res and crops), the hold (2.5, 2.9, 3.0, 3.5, 3.9), and the exit (frames 123–149, cropped to the lockup, twice). No clipped glyphs, no type outside x 72–936 / y 230–1480, no type on a face, Archivo throughout, no frozen frames (both clips stop inside their length: the blast clip uses 0.01–1.04 of 1.3 s, s008 uses 0.01–3.98 of 4.83 s), and a clean last frame.
- **`bg: "none"`** (v1, rendered): no footage, burn, grain, vignette, exposure, shake or fire light. The scrim and spot fade in at 0.2 s, the light sweep and RGB split play on the graphic, and the last frames are empty.

---

# v1 history (rounds 1–4, rejected look; kept for the facts and fixes)

## Round 1

### References and the gap
- **name-label-lower-third/_sO4z_omuu0-1** (1.9M views): white "Lucia" with green "Voice Actress" in a chunky rounded font beside the subject, plus a red 3D arrow and the official logo. The format works (name first, role second, placed beside the person). The styling doesn't: off-palette green, novelty type, no backing for legibility, and a trademark logo.
- **spec-label-block-with-game-logo/XJsXbPucprM**: bare white Montserrat-like lines with coloured "Model:"/"Prototype:" keys. It reads on calm footage but has no structure and fails on bright plates.
- **Rockstar official type**: sparse white caps, wide tracking, sunset gradient used sparingly, ink-navy cards. That gives the type system: a condensed caps name, a tracked Inter caps role, and one sunset accent.

### Variant 0, Leader tag (p03, Jason in the car)
- **Structure:** ring pin, then a 45°-ish diagonal leader, then a short shelf into a smoked-glass card. A leader tag is the "documentary callout" form. It shows *which* person, which a floating label can't in a busy frame.
- **Pin:** a 16 px white core inside a 48 px 2.5 px ring, with soft shadows only (no glow), plus one pulse on landing and one quiet re-pulse at 3.1 s so the hold isn't dead.
- **Placement:** the pin sits on the jaw/beard and the card sits left of the neck, below the chin. The card never covers the face, and the line never crosses the eyes or mouth. The card is right-anchored to the shelf end and clamped to x ≥ 72.
- **Card:** smoked glass (`rgba(14,14,20,.62)`, blur 20, saturate 1.4), 1 px inner highlight and hairline, radius 20, sharp contact shadow plus a large soft one. It stays legible over the bright street seen through the car window.
- **Type:** name in Barlow Condensed 800 at 104 px. Role in Inter 600 at 26 px, caps, tracked 0.32em, 80% white. Two sizes only.
- **Accent:** a single 6 px vertical sunset bar (pink→amber) on the card's left edge.
- **Role line:** "PROTAGONIST" only, with no "GTA 6". This keeps the card driven by the name's width; the `tag` field stays available.
- **Tracking:** Jason drifts about 45 px over the shot, so `track` keys move the whole tag and the pin stays on the jaw. The keys are measured from the plate.
- **Motion:** the pin pops (back.out 1.6, 0.26 s), the leader draws out of the ring (0.34 s power3.out), and the card opens from the attach edge (clip-path wipe, 0.42 s expo.out). Then the name slides 28 px, the accent grows and the role rises. One thing leads at a time, and the card is readable by about 1.0 s. The exit reverses the order and is clean by 5.95 s.

### Variant 1, Lower third (p06, Lucia at the gate)
- **Style:** the light-card counterpart to v0's smoked glass. The bar is paper white with an ink-navy (#1F202B) name; the role tab hangs under its flush bottom-left corner. Over Lucia's dark shirt and the warm, dim plate, a white bar is the most legible and premium choice; an ink bar would sink into the shirt.
- **Accent:** the role tab is the frame's one sunset element (pink→amber, ink text). Its gradient slides slowly through the hold for a little life without movement.
- **Type:** name in Barlow Condensed 800 at 110 px (top of the title range, so the bar reaches about 70% of frame width). Role in Inter 700 at 26 px, tracked 0.32em.
- **Placement:** bottom-left at x 72, with the tab bottom at y 1446. That keeps it inside the safe zone and clear of the platform caption UI, the classic lower-third spot.
- **Motion:** the bar wipes in from the left (0.45 s expo.out) with the name trailing 36 px. Then the tab drops out from under the bar (0.32 s power3.out) and its text fades in. On exit the tab tucks back, then the bar wipes out with the name riding under the wipe.

### Plates
- p03 and p06 both cut away from the character partway: Jason's car shot starts at 3.93 s, and Lucia's shot runs 2.4–5.5 s. To keep the named person on screen for the whole 6 s, each plate is trimmed with `data-media-start` and slowed with `data-playback-rate` (0.66 for Jason, 0.47 for Lucia). These are still moving shots, not frozen frames. Both trims are mirrored in CONFIG.

### Fixes made during round 1
- **Fonts measured too early:** the name was measured before Barlow Condensed loaded, because `fonts.ready` resolves before a face is first requested. The fallback font made auto-fit shrink the name to the 56 px minimum and left a gap between the leader and the card. Fixed by calling `document.fonts.load()` for the exact faces before measuring, and by right-anchoring the card to the shelf end.
- **Tag moved lower:** the leader tag moved from beside the chin to below it, so the card doesn't crowd the face.
- **Lower-third exit:** the name used to fade to grey on the white bar before the wipe, which looked clumsy. It now rides out under the bar's clip wipe.

## Round 2 (critic r01: v0 8, v1 7; biggest gap: v1 is a stock white slab in the caption band, v0 takes ~0.75 s to read)

### Defects fixed
- **v1 plate ghosting and judder:** the old trim (2.55 s at 0.47x) started inside the trailer's cross-dissolve and repeated 78 of 180 frames. The plate is now a pre-rendered clip, `assets/clips/p06-lucia-gate-slow.mp4`: p06 2.85–5.47 s (after the dissolve, before the 5.5 s cut), slowed 2.35x with `minterpolate` (mci, aobmc, bidir). It plays at rate 1 from 0. The render has 180 of 180 unique frames, with no double exposure on frame 0.
- **v0 plate (same fix, not flagged):** the Jason shot used 0.66x, which repeated a third of its frames. It's now `assets/clips/p03-jason-door-slow.mp4` (p03 3.95–7.97 s, 1.53x interpolated), with 180 of 180 unique frames. The time mapping is unchanged, so the `track` keys still hold. Clips live in `assets/clips/` because `sync_shared.sh` rsyncs `assets/plates/` with `--delete`.

### v0 Leader tag: the name is readable by ~0.5 s
- `timing.in` changed from 0.15 to 0.10. The leader now overlaps the pin's settle (t0+0.12, 0.24 s), and the card opens as the line arrives (tc = t0+0.28, 0.36 s clip wipe). The name starts at tc+0.02, the accent at tc+0.08 and the role at tc+0.14. The entrance strip shows the name fully readable at 0.5 s.
- The name now starts at `x: -dir*28` (+28 px with the card on the left), so it travels right-to-left with the wipe instead of against it.
- The order of events is unchanged: pin, line, card. They overlap now instead of queueing.

### v1 Lower third: smaller, quieter, out of the caption band
- **Smaller:** the bar went from 160 to 136 px high, the name from 110 to 96 px, and the padding from 56 to 48 px. The name and role still share one left edge (48 px). The bar is now about 650×192 px instead of 750×220.
- **Quieter:** the bar shadow dropped from `0 30px 80px -24px rgba(0,0,0,.7)` to `0 18px 48px -18px rgba(0,0,0,.5)`, so it no longer floats like a slab. The paper-white bar stays: it's the deliberate light counterpart to v0's smoked glass, and the critique asked for a smaller bar, not a different material.
- **Placement:** the tab bottom moved from y 1446 to y 1084. DESIGN.md puts captions at y 1100–1400, so the old spot would collide with a creator's burnt-in captions (a concrete conflict the critique named). It now sits on Lucia's dark shirt, just above the caption band, and well clear of her face.
- **Tab:** the gradient no longer pans, which had turned it flat orange by 4 s. The sunset stays pink→amber for the whole hold. For life, one soft white sheen crosses the tab once after it lands (t0+0.78, 0.7 s). The tab also gets a tuck shadow (`inset 0 8px 8px -8px rgba(0,0,0,.28)`), so it reads as sliding out from under the bar, plus its own small drop shadow.

### Both variants: role legibility
- The role line went from 26 to 30 px, and its tracking from .32em to .24em. v0's role colour went from 80% to 92% white.

## Round 3 (critic r02: v0 8, v1 7; biggest gap: optical finish. Type sat 5–6 px low in both cards, v0's name read "ON DUVAL" first, and v1 popped a 147 px white block in on one frame)

### Defect fixed: v1 entrance pop
- **Cause:** the bar's clip wipe used `expo.out`, which covers about 23% of its width in the first frame. On frame 5 that was a 147 px opaque white block appearing from nothing.
- **Fix:** I added a soft-start ease, `cubic-bezier(.4,0,.1,1)`, as a small deterministic bezier function at the top of the script (`SOFT_OUT`). The bar now grows from a zero-width left edge over 0.42 s, starting on a frame boundary (frame 5 = 0 px). Measured widths on frames 6–11 are 8, 52, 168, 332, 447 and 519 px, so it ramps in and then lands like expo.
- **Why not the critic's exact fix:** I didn't use 0.32 s `expo.out` as suggested. I computed it, and its first frame is still about 30% of the width, so it would pop the same way.
- **Exit:** the exit had the same problem in reverse. `power3.in` left about 190 px of white on the last frame and then cut. It now uses the mirrored curve (`SOFT_IN`, 0.36 s), measured at 390, 214, 60, 7 and then 0 px.

### v1 Lower third: optical centring and tab air
- **Name centring:** in a line-height-1 box, Barlow's caps sit 0.05em low (cap top at 0.2em, baseline at 0.9em). `padding-top: 4px` became `padding-bottom: .08em`, which scales if the name auto-shrinks. Measured caps now sit 34/33 px from the bar's top and bottom (they were 40/28).
- **Tab text:** `margin-right: -.24em` on the role cancels the trailing tracking, and the tab padding is now 0 48px. Measured air is 50/49 px left/right and 17/17 px top/bottom (it was 50/37).
- **Tag:** I dropped "· GTA 6" (`tag: ""`). The tab reads PROTAGONIST, matching v0. The `tag` field still exists for real information, such as "Vice City".
- **What stayed:** the paper-white bar, the tucked sunset tab and its inner shadow are the round-1/2 decisions and weren't named as defects. The "CapCut template" note is answered by the finish fixes: no pop, centred caps and symmetric air.

### v0 Leader tag: centring, accent, reveal direction, role
- **Optical centring:** the vertical padding is now computed in JS from font metrics (Barlow asc 1.0 / desc .2 / cap .7; Inter asc .969 / desc .242). The name's cap top and the role's baseline each sit exactly 36 px inside the card (`AIR`), which still holds when `fit()` shrinks a long name. Measured: 35/36 px (it was 41/31).
- **Accent:** the bar sits at `top: 36px; bottom: 36px`, so it spans exactly from the name's cap height to the role's baseline. Measured: 1012–1131 against caps at 1011–1131.
- **Reveal direction:** the card still opens from the leader side (the r01/r02 decision, kept). The name no longer rides that wipe. It has its own left-to-right clip reveal (0.3 s `expo.out`, plus a 10 px settle to the right). The reveal starts at tc+0.14, when the card is about 93% open, so the card's edge has already passed the name's left edge. Frames read J, JASO, JASON DU, JASON DUVAL, and never "ON DUVAL". The card now opens at t0+0.24 instead of t0+0.28, so the name is still readable by about 0.55 s.
- **Exit:** reversed to match. The type erases right to left and the accent retracts downward. Then the card folds back into the leader on `SOFT_IN`, followed by the line, ring and core. `timing.out` moved from 5.38 to 5.3, and everything is clear by about 5.85 s.
- **Role:** 34 px, tracked .2em, 96% white, with `margin-right: -.2em`. It was the weakest element at phone size; now its cap height is about 25 px at 1080 wide.

Capture r03, hero 2.5 s. Check passed (the one lint warning is the template's sub-composition suggestion, the same as r02). 180 frames per variant.

## Polish round 4 (critic r03: v0 8, v1 7; biggest gap: motion seams on the leader tag, and a lower third that was only 60% of the frame width)

### Defect fixed: square corners on the collapsing edge (v0 exit, and v1 exit too)
- **Cause:** both cards animated a `clip-path: inset(... round 20px)` string. At the start of the exit, GSAP read the computed value back from Chrome in its shortened form (`inset(0% round 20px)`). That string has fewer numbers than the target, so GSAP paired them up wrongly and the radius rode in from 0. The moving edge was cut square for most of the exit. The other edge stayed round only because the element has its own `border-radius`. The r03 v1 exit had the same fault (square right corners from about 5.6 to 5.7 s), although the critic didn't flag it.
- **Fix:** each clip now holds a complete `inset()` string with its radii on every frame. The only thing that moves is a single CSS length: `--off` on the v0 card and `--cr` on the v1 bar. GSAP tweens that one number, so it can't mis-pair anything.
- **Verified in the r04 MP4s:** the v0 exit frames at 5.40–5.63 s and the v1 exit frames at 5.62–5.79 s keep a 20 px radius on both ends of every frame.

### v0 Leader tag: the card is never empty
- **What I changed:** the same `--off` length now also translates the card's contents (`#cardFace`), so the type rides the card's opening edge. On entry, the card slides out of the leader carrying the name in reading order: JASO, JASON DU, JASON DUVA, then JASON DUVAL from 0.37 s, readable by about 0.47 s. On exit, the role drops and the accent retracts (as in r03). The card then slides back into the leader from 5.36 s (0.3 s `SOFT_IN`), reading JASON DUVA, JASON DU, JASON, J. Only the final 8 px sliver closes onto the shelf, and the leader, ring and core follow as before. Everything is clear by about 5.85 s.
- **Why not the critic's fix:** I didn't just move the name wipe to card+0.06 s. I computed it, and it still leaves two empty frames (the card is 40% and 69% open before any type shows), plus two frames where the "J" is clipped. The direction conflict (the card opens right to left, but the name reads left to right) only goes away if the type travels with the opening edge.
- **What stays the same:** the card still opens from the leader side (r01–r03), the name still reveals in reading order (r03), and it still never shows "ON DUVAL". A card on the right-hand side (positive `leader.dx`) already reveals left to right, so its contents don't translate.
- **What I removed:** the name's own clip reveal and its 10 px settle from r03. The card's movement now does that job.

### v0: denser smoke and a safe-zone clamp that accounts for tracking
- The card fill went from `rgba(14,14,20,.62)` to `.74`. Over the bright white car (about 4–5 s) it no longer goes milky, and r04 shows it keeping the same value over every background.
- `room` (used to fit the name) now subtracts the leftmost `track` offset. The r03 card's left edge reached about x 70 at around 0.5 s, because the clamp ignored the −44 px start of the track. To keep the name at 104 px without shrinking it, I moved the anchor to (864, 868) and set `leader.dx` to −102 (the same jaw spot, 14 px right). The card's left edge now measures about x 80 at 0.6 s, its leftmost tracked point.
- **What I didn't change:** I didn't move the pin up to the cheekbone at (790, 640). That point sits about 10 px from the corner of his mouth on this plate (measured on the t = 3.0 s frame), so the leader would graze his lips, which breaks the r01 rule that the line never crosses the eyes or mouth. Placing the pin on any skin above the beard would need a leader of 450 px or more across the whole lower face. The pin stays at the jaw. This is a deliberate r01 decision, and the critic raised a reading preference, not a defect.

### v1 Lower third: up to the 70% hero rule, with more detail on the bar
- The name went from 96 to 112 px, the bar height from 136 to 156 px, and the horizontal padding from 48 to 56 px. The tab went from 56 to 62 px and its padding from 48 to 56 px. The role went from 30 to 32 px. The bar now measures x 73–832, which is 760 px or 70.4% of the frame width (it was 652 px, about 60%). That meets DESIGN.md's craft rule 2: the hero object spans 70–88% of the width.
- The name and role still share one left edge (56 px). The tab bottom stays at y 1084, above the caption band, so the bar grows upward to start at y 866. That is still well below Lucia's chin (about y 760) on every frame of the strip.
- The bar's inner hairline went from `rgba(0,0,0,.06)` to `.08`, the DESIGN.md light hairline. The tab's bottom-right radius was already 20 px, matching the bar.
- **Optical centring at the new size:** the name's bottom padding went from `.08em` to `.11em`. Measured on the r04 hero, the "L" cap sits 39/39 px from the bar's top and bottom (it was 40.5/37 at `.08em`). The tab's role is centred at 19/19 px.

Capture r04, hero 2.5 s. Check passed (lint shows the template's sub-composition suggestion and StaticGuard's usual note about the `fonts.css` font-face; both are unchanged from r03, and the render uses Barlow). 180 frames per variant. I confirmed the fixes in the MP4 frames at 0.34–0.53 s and 5.37–5.66 s (v0) and 5.40–5.80 s (v1).
