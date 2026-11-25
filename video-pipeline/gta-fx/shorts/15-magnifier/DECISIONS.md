# Decisions · 15 Magnifier zoom

## v2 concept
- **One idea: the detail lifts off the footage.** The inset (a loupe in v0, a framed plate in v1) grows out of the tracked spot as an exact 1:1 copy of the footage under the mark, flies to its seat while the magnification climbs to 2.5×, and lands on a hit. Around it the world racks out of focus, so the sharp 4K detail is the only thing in focus. At the end it flies home and the world refocuses.
- **Shot: `s004-palm-shirt-truck` held for the full 5.0 s with a slow push (1.00 → 1.05), no cuts.** A magnifier needs one steady subject; s004 is the 4K-graded version of the v1 shot, so the real content (the tiny beach printed on his shirt) and the tracking work carry over. The zoom reads a new native-pixel master cut from the same 2160p Trailer 2 frames.
- **Placement: the inset sits upper-left over the dark truck windshield** (clear of his face, which lives at x ≥ ~690 from 0.8 s); **the mark sits on the chest print; the type sits in the bottom band** (y ~1316–1474) over the defocused, scrimmed lower frame. Nothing covers the face.
- **Hero type: v0 Archivo wide 800 caps, 112 px, one line "TINY BEACH"** (BEACH in the sunset fill), kicker "HIS SHIRT · 2.5×" in tracked wide label. **v1 Inter display 800, 140 px, "A whole beach"** (beach in sunset), kicker in JetBrains Mono "TRAILER 2 · 0:14 · 2.5×".
- **Payoff hit at 1.00 s (the landing):** exposure flash 0.26 + shake on the footage, RGB split on the inset and the hero, a specular sheen across the glass, the hero rising behind its mask on the same frame; the gradient word gets its sheen at 1.85 s.

## v2 round 9 (craft-v2 rebuild, replaces the v1 look)
**What was thrown away:** the plates footage (p05), the smoked-glass pill with the sunset chip, the navy title card, Barlow labels, the dim-only treatment and the 60–76 px label type. The owner called v1 "basic"; it read as UI cards floating on soft footage.

**Kept from v1:** the job (2.5× zoom of one tracked spot, joined by a leader), the content (the beach scene on the shirt print, "Trailer 2 · 0:14"), the native-pixel zoom master idea, one driver that places everything from timeline time (seek-safe), the opacity snap on a frame boundary, the soft hold, and the "fly home and land as a 1:1 copy" exit.

**Footage and zoom master.**
- `assets/shots/s004-palm-shirt-truck-v.mp4` (4K-sourced, graded) under `#shake > #push`, `Look.push` 1.00 → 1.05 linear over 5 s.
- New master `assets/zoom/s004-shirt-zoom.mp4`: the same Trailer 2 2160p frames (13.737 s in, crop 972×1728 at 1318,216, exactly as `build_shots.py` cut the shot), frame region x 240–880, y 800–1400, upscaled once to 1600×1500 (1:1 at 2.5×) with the shot library's grade (eq + bloom) rebuilt at that scale. Verified frame-for-frame against the shot: mean abs diff ≈ 2 at frames 0/40/75/120/150 (±1 frame gives 4–15), colour within 2 levels. `tools/make-zoom-master.sh` now reproduces it.
- The old `p05-truck-yard-zoom.mp4` is deleted.

**Track.** Re-baked on s004 with `tools/track.py` (OpenCV template matching, updated template, 7-frame smoothing, 15 pts/s) on the palm + two umbrellas. In this crop the motif stays at x 398–700, so the v1 right-rail problem is gone. The push is applied to the track in code (`toScreen`), so the mark stays on the print while the camera pushes. A soft hold keeps the mark's lowest point above `typeTop` 1296 so it never runs into the kicker; it only engages after ~3.8 s and slides the zoom up the print by a few dozen px (palm crown + umbrellas stay in view).

**The defocus.** `#defocus` is a full-frame `backdrop-filter` layer inside `#shake` with a `clip-path: path(evenodd, …)` hole at the mark, so the footage under the mark stays sharp. It ramps 0.32–0.94 s to blur 8 px, brightness 0.60, contrast 1.10, saturate 1.06, and back 4.18–4.64 s. The first pass (brightness 0.50, saturate 0.86) read as a grey wash; adding contrast and keeping saturation fixed the muddiness.

**v0 Round lens.** 560 px loupe seated at (378, 556) over the windshield. 3 px white rim with bloom and an ink keyline; edge falloff and a soft specular inside; a faint magenta/cyan fringe at the glass edge; a fine tick ring (every 6°, longer every 30°) that rotates −24° → 0 as it lands. The mark is a 3 px ring drawn as an arc from 12 o'clock with N/E/S/W ticks growing out. External tangent lines and a faint light cone join them. The zoom inside gets contrast 1.12 / saturate 1.14 so it does not read milky.

**v1 Inset card.** No card body. A 580×518 framed plate seated at x 86, y 272: square corners, 2 px white frame with an ink keyline and bloom, viewfinder brackets 14 px outside the corners (they land on the x 72 safe line). The mark is a focus box: corner brackets that close in from 1.5× plus a 1.5 px hairline. Projection lines run from the box's top corners to the plate's bottom corners with a faint light fill, so the light rises into the plate.

**Motion.** Mark draws 0.15 s (expo.out). Lift 0.50 → 1.00 s on power3.inOut, scale overshoots to 103.5% then settles by 1.30 s (power2.out). Motion blur along the flight (SVG blur, peaks mid-flight, both ways). Hero rises behind its mask (chars 30 ms in v0, words 70 ms in v1), kicker blur-in. The type drops back behind its mask at 3.90 s, the inset flies home 4.10–4.42 s (power3.in) and lands as an exact copy of the footage, the mark unwinds by 4.66 s, and the last 0.34 s are clean shot (a handle for the next cut).

**Finishing.** `Look.install` grain 0.12, vignette 0.46 (plate renders only). Bottom scrim fades in for the type and out with it.

**Checked frames** (rounds/r09): entrance burst 0.5–1.03 s (seamless lift, motion blur, no ghosting), the hit at 0.97–1.07 s, hold at 2.0 / 3.0 / 3.85 s (mark clear of the kicker), exit at 4.3 / 4.55 s, clean end at 4.9 s. Type is Archivo / Inter / JetBrains Mono as designed, inside x 72–936. `hyperframes check` passes.

**Hero time 2.0 s.**

**Unresolved / watch:** the zoom is native 4K magnified 2.78× per source pixel, so it is as sharp as the source allows but not crisp-edged; the fabric print itself is soft in the trailer. The lens's tick ring sits within 10 px of the man's cheek around 1.0–1.6 s.

---

# v1 history (rounds 1–8, rejected look; kept for the facts and fixes)

## Round 1
**Plate: p05 truck yard for both variants.** It is the only sample plate with a single unbroken shot of 5 s (cut at 5.03 s); p01's shots are 1.9 s (sign, fast dolly), 1.7 s (marina) and 3.0 s (jet-ski hand), too short for a lens that has to stay on one spot. Composition length is 5.0 s to fit that shot. The two variants magnify different spots of the same shirt print (the beach umbrellas; the palm + umbrellas "beach scene") and say different things.

**The detail is real and visible.** The shirt print really has tiny beach umbrellas, palms and sea strokes; the zoom shows them. No invented names or facts (the character on screen is not named in FACTS.md, so the label talks about the shirt, not the man).

**Tracked, not static.** The camera pushes in and the man moves ~320 px, so a fixed lens target would drift off the detail. The spot track was baked with OpenCV template matching (updated template, 15 points/s, 7-frame smoothing) into `CONFIG.variants[v].track`. One time-driver tween (getter/setter proxy, no onUpdate) places the zoom copy, spot ring, beam and dim holes from the timeline time, so it is seek-safe.

**Zoom = a second copy of the clip** (`#zoom0` / `#zoom1`) in a clipped window, translated and scaled about the spot. It is frame-locked to the plate because both are framework-owned videos with the same timing. The zoom eases 1×→2.5× as the lens opens ("pull" reads in 0.6 s).

**Variant 0 Round lens** follows the circle callout + leader in `refs/circle-callout` and `refs/arrow-callout`, but replaces the hand-drawn red ellipse and chunky 3D arrows with a clean optical language: white 6 px lens ring with a glass sheen and inner edge shadow, a 3.5 px spot ring, and two external tangent lines with a faint light-cone fill (like a product-page zoom callout). Label is a smoked-glass pill above the lens (the sky behind it is bright, so plain shadowed type would not hold), Barlow Condensed 800 caps.

**Variant 1 Inset card** follows the framed-inset language (`refs/framed-inset-blur-bg`, the Netflix/official ink-navy cards in `official-type`): #1F202B card, radius 28/18, hairline, Inter 600 wide-tracked eyebrow + Inter 800 title, the zoom window below the header so the beam meets the window's edge. Source box is a rounded rect with the same beam to the card's bottom corners.

**One accent:** the sunset gradient lives only on the "2.5×" chip. Lines and rings are white; police/teal colours are not used.

**Dim 30 %** outside the spot (SVG mask with a hole that follows the track) so the eye goes to the spot and the white ring holds on the white shirt.

**Motion:** dim + spot ring draw at 0.20 s, beam grows from the spot at 0.42 s, lens pops (0.72→1, expo.out) / card rises at 0.52 s while zooming in, label at 0.78 s, chip pops (back.out 1.5). Everything clears 4.55–4.95 s.

**Known compromise (fixed in round 2):** the man drifts right during 1.7–3.3 s, so the spot ring / source box briefly reached x ≈ 1020–1066, inside the right 150 px platform-button margin.

Polish pass after viewing the r01 heroes: beam lines 2.5→3 px and the cone a little brighter for phone legibility, dim 0.34→0.30 (footage looked grey), card track nudged 16 px down so the umbrellas sit fully inside the card window.

## Round 2 (critique r01: v0 7/10, v1 6/10; gap = soft zoom + spot under the action rail)
**[defect] Safe zone: re-tracked a motif further left, plus a soft guard.** Round 1's umbrella pair peaks at x 954 (t ≈ 2.3 s), under the like/share rail. I tracked six other print motifs with OpenCV (sleeve palm, lower-front palm, its umbrella, shoulder palm, the beige "9" print and the small palm bush). The bush with its palm trunk, sand strip and umbrellas was the only one that holds through all 5 s: the sleeve palm is lost when the arm drops at 3.3 s, the lower-front motifs fall below y 1480, and the "9" hides in a fold for the first second. It peaks at x 856, about 100 px left of round 1's spot. The track is now one shared `CONFIG.track` (smoothed over 7 frames, 15 pts/s), and each variant has its own `nudge`: v0 [16, −40] centres the ring between the bush and the umbrella, and v1 [0, −20] frames the bush, the trunk and both umbrellas. On top of that, `spotAt()` passes the spot through a **soft clamp** (`CONFIG.safe.right` 932, `bottom` 1440). It is exponential, so the spot eases into the limit rather than snapping. The ring / box right edge now never passes x 932 (v0 centre ≤ 830, v1 centre ≤ 774), and the guard protects any track a creator pastes in too. During the 1.6–2.7 s peak the shirt slides about 40 px inside the ring instead of the ring sliding under the buttons.

**Sharper zoom.** `.zsh`, a wrapper 16 px larger than the window that the window clips, carries `filter: url(#sharp) contrast(1.06) saturate(1.1)`. `#sharp` is an SVG unsharp mask applied at output size: a Gaussian with σ 1.6 px, then arithmetic k2 = 2.15, k3 = −1.15. That suits content upscaled 2.5×. The 3×3 kernel the critic suggested only touches 1-px edges, and those edges are already about 2.5 px wide. The 16 px overhang keeps the blur's edge halo outside the visible window. I also removed `will-change: transform` from `.zin`/`#lens`/`#card` and set `gsap.config({force3D:false})`, so Chrome rasterises the zoom at its final scale rather than reusing a 1× layer. **I tried feeding the zoom from p05-truck-yard-h.mp4 and rejected it.** The h plate is cut from a lower-resolution master than the v plate. I mapped it exactly (ECC fit: h = 0.5625·v + 462.5 px), but it measured less detail (Laplacian variance 9.8 vs 15.4) and rendered softer. The mechanism stays as `CONFIG.zoomClip {src, x, y, w, h}` for a creator who owns a real 4K master; it defaults to the plate.

**Exit collapses into the spot (no ghosting).** From `T.out` (now 4.45 s), the label leaves (0.2 s) and the beams retract into the spot (0.2 s, power2.in, computed in `apply()`). The inset then flies to the spot centre and scales to 1/zoom (0.4) over 0.34 s power3.in. The zoom inside keeps 2.5×, so the on-screen magnification falls from 2.5× to 1×, and the inset lands as an exact copy of the footage under the ring. Only then do the ring, the dim and the landed inset fade, for 0.2 s, and everything is clear by 4.99 s. Wrappers `#lensMove` / `#cardMove` carry the collapse transform, which `apply()` sets from timeline time. `#lens` / `#card` keep the GSAP entrance, so the two transforms never fight. In v1 the header fades first, and the navy body (`.cbg`) melts away while the card shrinks about its window. The source box now has the window's shape at 1/zoom (radius 16 → 6.4 px), so the window lands on it exactly.

**Faster read.** T.beam 0.42 → 0.30, T.open 0.52 → 0.38, T.label 0.78 → 0.56. The spot draw is 0.32 s, the lens pop 0.42 s, the label 0.36 s and the chip pop at +0.08 s. The label lands about 0.6 s after the first mark.

**White marks hold on the cream shirt.** Every leader and the spot ring/box now has a dark underlay drawn first in the same path: 7 px (7.5 px on the ring) `rgba(7,8,12,.45)`, set through the same `setB()` and tweened in the same calls. The old double drop-shadow is reduced to one soft shadow.

**v1 hierarchy.** The title is 58 px (Inter 800, −0.035em) and fills the card: 735 px of the 762 px inner width. Eyebrow tracking is .24em, and the window radius is 16 px, concentric with the 28 px card and 12 px padding. The card is 4 px higher (y 236) so its taller header keeps the window clear of the shirt.

**Labels follow the new spot.** v0 now reads "A tiny beach scene", because the ring shows a palm, a bush, sand and an umbrella, not mainly umbrellas. v1 keeps "A whole beach on one shirt".

**Hero time 1.3 s**: both inset umbrellas are in view and the arm is still, so there is no motion blur.

Kept from round 1 (the critique named no defect): plate p05, the 5.0 s length, the lens/pill placement, the dim of 0.30, the sunset only on the chip, the Barlow pill and the zoom ramp tied to the lens opening.

## Round 3 (critique r02: v0 7/10, v1 6/10; gap = the zoom reads as mush)
**Biggest gap: the zoom now comes from native 2160p pixels.** I checked the critic's premise before applying the fix. `research/gta6/plates/recut.txt` shows that both the v and h plates were cut from the same 1080p YouTube copy of Trailer 2 (VQRLujxTm3c). That copy's picture area is 1920×864: the v plate is a 486×864 crop scaled ×2.22, and the h plate is the full width scaled ×1.25. So the h plate holds no pixel the v plate lacks, which matches what I measured in round 2. Pointing `zoomClip` at it (the suggested fix) would only swap one upscale for another. The real fix is a better source. Rockstar's own Trailer 2 is published at 2160p, so I downloaded only 0:11–0:22 of the official upload (VP9, 3840×2160) and matched it to the plate:
- **Time:** plate frame 0 = 2160p frame 84, found by template matching. The mean abs diff is 2.5 at frame 0, 2.2 at frame 60 and 2.4 at frame 120.
- **Space:** v = (X − 1124, Y − 216) × 1920/1728. ECC puts the residual under 0.1 px.

The new `assets/zoom/p05-truck-yard-zoom.mp4` is built by `tools/make-zoom-master.sh`. It is the region of the frame the zoom can show (x 240–1080, y 720–1480; source crop 756×684 at 1340, 864). That region is upscaled once with lanczos to 2100×1900, which is exactly its on-screen size at 2.5×, then unsharp-masked at that size (7×7, 0.75) and encoded as H.264 CRF 15 (12 MB). Chrome shows the master 1:1 at full zoom, so no browser bilinear upscale is involved. The magnification on the original pixels is now 2.78× instead of 5.55×, and the zoom shows the umbrella ribs, the segmented palm trunk and the frond tips. `CONFIG.zoomClip` = `{src, x:240, y:720, w:840, h:760}`, and the static `src` of `#zoom0` / `#zoom1` matches it. `sharpen` dropped to radius 1.0 / amount 0.3, because the master is already sharpened. `.zwin` now has a navy fallback background, so a creator's master that is too small can never show transparent holes. Coverage check: the region covers the inset at every visible frame, including z ≈ 1.3 on the first frame of the inset.

**[defect] Entrance double exposure.** The opacity of the lens/card now goes 0 → 1 between `T.open` and the next frame boundary (`snap`, 0.02 s at 30 fps). The 0.42 s expo.out keeps only the scale 0.72 → 1 (and the card's y 44 → 0 / scale .96 → 1). The first frame with the inset (frame 12) shows it fully opaque, at 80 % size. Rendered frames 10–14 show no ghosting. The critic's 0.08 s linear tween still left two part-transparent frames (25 % and 67 %), so I tightened it.

**[defect] v1 exit shell.** v1 no longer collapses. `#card` leaves as one unit at `T.out`: y +24 and scale .94 over 0.22 s power2.in, with opacity fading over 0.14 s power2.in starting 0.06 s in. The card stays opaque for the first frames of the move, and at most one frame is part-transparent. The leaders retract into the box over the same 0.2 s. The box fades 4.70–4.85 s, about 0.1 s after the card is gone. v0 keeps its collapse into the spot (the critique named no defect there), shortened to 0.30 s.

**[defect] Loop seam.** `T.out` is now 4.40. The spot ring/box, the lens and the beam reach 0 on a 0.15 s power1.in fade that ends at 4.85 (`clearAt`), and the dim fades 4.55–4.85. Frames 146–149 are clean in both variants.

**v1 leaders: geometry changed, spot not moved left.** I tested the suggestion to move the box left until its centre is within 80 px of the card centre, and rejected it. Every candidate 120–200 px left of the bush sits on the sleeve hem and the forearm (checked on contact sheets at t 0.4–4.4). The box's lean to the right is real: the man stands right of centre, and the safe clamp holds the box's right edge at about 932. A card whose right edge is at most 936 then always leaves one corner-to-corner leader vertical, whatever its width. I therefore changed the leader geometry instead, since the critique names that concrete defect. The two leaders now **converge** from the box's top corners onto a 112 px segment of the card's bottom edge, centred over the box (`funnel: 56`, held inside the card's straight edge). They are mirror images wherever the box goes: no vertical hairline, and no diagonal slash across the arm. The shape is a pointer from the card to the subject, the same idea as the arrow refs (`arrow-callout`, `stat-callout-arrow`), drawn as a clean light funnel. **The arm band is fixed** with the v1 nudge [0, −20] → [60, −20], which keeps the forearm out of the window after 3.2 s and frames the bush, the palm trunk, both umbrellas and the sand strip. During the 1.2–2.6 s safe-clamp peak, the left third of the window shows the sleeve print (white, with a palm), not the arm.

**v0 label docked to the lens.** The pill is centred on the lens x, with its bottom 24 px over the ring top (`pillOverlap`), measured after fonts load. The lens moved from x 345 to 395 so that the 645 px pill can centre on it and stay inside x ≥ 72. The pill now rises 18 px at `T.label` instead of sliding in from the left. v0 nudge [16, −40] → [40, −60]: with real detail, the ring now holds the palm trunk and fronds, the umbrellas, the bush and the sand.

**v1 eyebrow** is 28 px at 0.75 alpha (was 26 px at 0.62), tracking .22em.

**Hero time 4.0 s.** The window is on clean print, both umbrellas and the trunk are sharp, and the hold is steady.

Kept: plate p05 and the 5.0 s length, the dim of 0.30, the sunset only on the chips, the Barlow 60 px pill, the navy card and the 58 px title, the tracked spot with its soft safe clamp, and the v0 tangent cone and collapse.

## Polish round 4 (critique r03: v0 8/10, v1 7/10; gap = v1's leaders narrowed into a speech-bubble tail, plus an empty header)
This is a polish pass. The concept, plate, timing and both layouts stay the same. All changes were checked frame by frame in `rounds/r04/v*.mp4`.

**[defect] v1 empty header (0.40–0.50 s): fixed.** The eyebrow, title and chip used to start at `T.label` (0.50/0.56/0.64 s). Now they start at `T.open − 0.06`, `T.open − 0.02` and `T.open + 0.02`, a 0.04 s stagger. The first two begin while the card is still at opacity 0, so the card's first frame (frame 12) already shows the eyebrow at about 80 % and the title at about 55 %. The chip arrives on frame 13, and the header is complete by frame 14. No frame shows a bare navy slab (checked on r04 frames 12–15).

**[defect] v0 pill clipping the lens rim: fixed.** `pillOverlap: 24` is replaced by `pillGap: 16`: pill bottom = lens top − 6 px ring − 16 px. The pill no longer touches the ring, and the whole white arc stays visible (checked at 0.7, 1.5, 2.5 and 4.0 s). The entrance rise is now 14 px, less than the gap. On the critic's T-bar point: the pill is now capped at the lens's outer width (522 px). `measure()` steps the label type down from 60 px to a 52 px floor if a title is too wide. The critic's suggested 52 px would not have been enough on its own: "A TINY BEACH SCENE" at 52 px plus the chip is about 580 px. So I shortened the sample title to **"A tiny beach"**. The pill is now 482 px at the full 60 px size and sits inside the lens width. It still reads as the lens's label, not a separate title. The lens size and position are unchanged.

**v1 biggest gap: the beam now widens toward the inset.** The two leaders now run from the box's top corners out to the zoom window's bottom corners (`card.x + 12` and `card.x + w − 12`, at `cardBottom − 12`, hidden under the card rim). This is the projection geometry the critic described (Apple and Figma zoom insets, scientific insets). Two guards keep round 2's defect (a flat diagonal slash across the arm) from coming back:
- **`maxLean: 50`.** When the box is close under the card (about 135 px at 0.4 s), each leader leans at most 50° from vertical. It then meets the card's bottom edge short of the corner, so it never becomes a flat line across the frame. At the hero time there is room, and both leaders reach the true window corners.
- **The card moved 24 px right (x 96 → 120)**, so its right edge sits on the x 936 safe line. The box's right edge is held at ≤ 932 by the safe clamp, so the right-hand window corner (924) is never left of the box's right leader point. That means neither leader ever leans inward. Before the move, the right leader would have leaned in during most of the hold. The move also centres the card better in the frame (120/144 px margins instead of 96/168).

The result: the left leader leans out and the right leader runs near vertical while the box is held at the safe line, and both lean out once it drifts left (from 4 s). The cone always opens toward the card. Round 3's converging funnel (`funnel`) is gone. It was a deliberate fix for round 2's lopsided leaders, but two critics have now named the two failure modes, and this geometry avoids both.

**v1 title is now 64 px (DESIGN title floor), with wrapping allowed.** The `.ttl` is 64 px, uses `white-space: normal` and `text-wrap: balance`, and has no nowrap. A longer creator title wraps to two balanced lines and the card grows instead of clipping. The sample title is now **"A whole beach on a shirt"** (683 px of the 762 px line). The old title measured 755 px at 64 px, which would have sat 7 px from wrapping. Keeping the sample on one line also keeps the card bottom where the leader geometry was tuned. I did not add line-clamp: it needs `overflow: hidden`, and at line-height 1.06 that clips Inter descenders.

**v1 exit: the card collapses into the box.** The critic named a concrete problem: the box hung alone for 4.60–4.73 s. `apply()` now drives `#cardMove` from timeline time, the same way as v0's lens. The whole card (header, rim and window as one opaque piece) flies to the box and scales to 1/zoom about the window centre over 0.30 s power3.in, landing at 4.72 s. The window then sits exactly on the box as a 1:1 copy of the footage under it. The card and box fade together from 4.70 to 4.85 s. This does not bring back round 2's defect (the header fading early, leaving an empty navy shell, while the window detached). Nothing fades or detaches during the flight. The round 3 one-piece drop-out tweens are removed.

**Track: v0 nudge [40, −60] → [60, −60]. v1 nudge left at [60, −20].** I simulated the critic's nudges against the soft safe clamp first. v1's box is held at the clamp from about 0.6 to 3.4 s, sliding 34–137 px behind the motif. v0's ring is held from about 1.6 to 2.7 s, sliding up to 81 px. A larger nudge moves either one by 0–3 px in the 1.4–2.6 s window it was meant to fix. v0's +20 still frames both umbrellas a little better from 3.2 s and at the hero, so I kept it. v1's +35 would only change 4.0 s onward, where it pulls the placket button into the box, so I skipped it. **Unresolved:** the sleeve fold still shows in the left third of the zoom from about 1.6 to 2.6 s. The man's shirt moves past the x 932 safe limit, so the only real fixes are a smaller box (a narrower card, which changes the layout) or breaking the safe zone. I did neither.

**Hero time stays 4.0 s.** Loop seam: frames 146 and 149 are pixel-identical between the two variants (max diff 14/255, encode noise), so both are clean plate.

Kept: plate p05 and the 5.0 s length, the dim of 0.30, the sunset only on the chips, the Barlow 60 px pill, the navy card, the native-pixel zoom master, the tracked spot with its soft safe clamp, and v0's tangent cone and collapse.

## Polish round 5 (critique r04: v0 8/10, v1 7/10; gap = the zoom payoff is not the hero yet)
This is a polish pass. The concept, plate, 5.0 s timing and both layouts stay the same. Every change was checked on frames pulled from `rounds/r05/v*.mp4`.

**[defect] v1 exit micro-card: fixed.** Round 4 flew the whole card (header included) into the box, so from about 4.72 to 4.85 s a 130 px navy micro-card with 10 px text sat on the shirt above the box. The card still flies into the box on the same 0.30 s power3.in path, but now:
- the eyebrow, title and chip fade to 0 over the first 0.12 s of the collapse (from `T.out + 0.02`);
- the navy body (`#cardBg`, which carries the card shadow) fades over the first 0.16 s, on the same power1.out ease.

The text therefore always fades ahead of the navy behind it. It never floats on bare footage, and there is no opaque empty shell: round 2's defect was the header fading first and leaving an opaque shell for 3 frames. Both are gone by 4.58 s, when the card is still at about 90 % size (the text is gone by 4.54 s, at about 96 % size), so the text never shrinks. What remains is the bare zoom window with its hairline rim. It finishes the flight and lands exactly on the box at 4.72 s as a 1:1 copy of the footage under it, then fades with the box by 4.85 s. Frames at 4.73, 4.77, 4.80, 4.83 and 4.87 s show only the fading box outline over the footage. Nothing else is left on the shirt.

**v0 lens: 520 → 620 px, at x 400, y 690 (spans x 90–710).** `lens.r` is 255 → 310, so the spot ring is 248 px (r 124) and the zoom stays 2.5×. Before changing it, I simulated the tracked spot against the lens over the whole hold, including the entrance scale. The closest the ring comes to the lens is about 70 px (at 0.5 s), so the tangent cone never collapses and the lens never covers the spot. The centre moved up 10 px (700 → 690) to buy that margin. The pill top is now y 274, inside the 230 safe line. The zoom master still covers the window at every frame (the spot stays inside x 364–956 and y 844–1356 of the master region), and it still shows 1:1. At the hero, the lens, the leaders and the ring together span x 90–862, about 72 % of the width (it was about 65 %). The ring's soft safe clamp now holds its centre at x ≤ 808, not 830, so the ring's right edge still never passes 932.

**v0 glass.** The `.glass` box-shadow is now `inset 0 0 0 1px rgba(0,0,0,.25), inset 0 -12px 28px rgba(0,0,0,.18)` (the critic's values), plus a broad `inset 0 -40px 90px rgba(0,0,0,.10)`. A new `.glass::before` adds a 2 px specular crescent (`inset 0 2px 0 rgba(255,255,255,.5)`), 7 px inside the rim and masked out by mid-height. It sits inside the rim rather than on it because a highlight on the rim would merge into the 6 px white ring. The existing top-left sheen stays. **The pill radius is 20 → 28.** The critic read it as about 14 px, but it was already 20. 28 is concentric with the 12 px chip plus the 16 px padding, and it is on the 20/28/36 scale, matching the card.

**Leaders hold on the white shirt.** `#fxShadow` (every leader and both source frames) now carries `drop-shadow(0 0 2px rgba(0,0,0,.6))` ahead of the soft lift shadow. The leader stroke is 3 → 3.5 px, the same as the spot marks, with a 7.5 px underlay. At 360×640, v0's right tangent along the lapel and v1's right leader along the placket both stay visible.

**v1 eyebrow is real context.** "Look closer" is replaced by "Trailer 2 · 0:14" in JetBrains Mono 600, 28 px, at .04em tracking (DESIGN: mono for timestamps). The timestamp is real. `recut.txt` cuts p05 from Trailer 2 at 13.8 s, and the 2160p match (frame 84 of a download that starts at 0:11, at 30 fps) gives the same 13.8 s. The shot runs from 0:13.8 to 0:18.8, so 0:14 lands on it.

**v1 re-aim: only the vertical half applied.** The nudge is [60, −20] → [60, −35], which centres the bush, trunk and umbrellas top to bottom in the window. The suggested +45 px to the right during 0.6–2.8 s is blocked by the safe zone, as recorded in round 4. In that window the box is already held at the soft clamp (right edge ≤ 932, centre ≤ 774), while the raw motif runs 30–140 px further right. Any rightward re-aim is absorbed by the clamp unless the box crosses into the action rail, and round 1's critic named that as a defect. **Still unresolved:** the sleeve fold fills the left third of the inset from about 1.6 to 2.6 s in v1, and less so in v0's lens. The only real fixes are a smaller source box (which changes the layout or the 2.5× brief) or breaking the safe zone.

**Hero time stays 4.0 s.** Loop seam: frames 146 and 149 match between the two variants (PSNR 44.9 / 44.4 dB, max diff 20/255, which is encode noise), so both end on clean plate. `hyperframes check` passes.

Kept: plate p05 and the 5.0 s length, the dim of 0.30, the sunset only on the chips, the Barlow 60 px pill and "A tiny beach", the navy card, the 64 px title and "A whole beach on a shirt", the native-pixel zoom master, the tracked spot with its soft safe clamp, v0's tangent cone and collapse, and v1's projection leaders with `maxLean`.

## Polish round 6 (critique r05: v0 8/10, v1 7/10; gap = the payoff sags mid-hold while the sleeve crosses the print, and v1's leaders and exit are less exact than the card)
This is a polish pass. The concept, plate, 5.0 s timing and both layouts stay the same. Every change was checked on frames pulled from `rounds/r06/v*.mp4`.

**[defect] v1 leaders are now a matched pair: fixed.** Both leaders now always run from the box's top corners to the zoom window's bottom corners, (132, 812) and (924, 812). They are true projection lines. In round 5, `maxLean: 50` stopped the left leader short. I measured the lean the sample track needs from `T.beam` to `T.out`: at most 75.8°, at 0.37 s while the beam is still growing, and 51.8° at the hero. So `maxLean` is now 78, which is only a guard for a creator's box tucked right under the card, and the sample never reaches it. On the 4.0 s hero both leaders meet the window's own corners under the 12 px card rim. The left one leaves the card's bottom edge at x 147 and the right at x 923. During the first second the left leader is flatter, at about 71–76°, but it still ends at its corner. It never leans inward, because the card's right edge stays on the x 936 line (round 4).

**v1 exit: the window no longer flies home as a bare photo.** The collapse into the box stays, because it is a deliberate decision from rounds 4 and 5 and the critique named no defect in it. Fading the card in place would bring back round 3's box hanging alone. Flying the whole card with its header would bring back round 4's micro-card. What changed is what flies. As the header (0.12 s) and navy body (0.16 s) dissolve, the zoom window puts on the source box's own chrome over 0.12 s (power3.out):
- a 3.5 px white rim centred on its edge (`box-shadow` outside, plus `--rimW`/`--rimA` on the `::after` inside);
- a 1.75 px ink keyline on both sides;
- a soft lift shadow.

`apply()` divides every width by the collapse scale, so the rim stays 3.5 px on screen at every size. The window therefore reads as the box's framed twin returning home, the way v0's ringed lens returns to its ring. It lands exactly on the box's stroke at 4.72 s, and both fade by 4.85 s. Frames 134–144 show a white-framed tile in flight, with no chromeless rectangle and no navy shell.

**v0 label is legible on a phone.** The title is 60 → 76 px Barlow Condensed 800, inside the 64–110 px title range. The chip text is 28 → 32 px JetBrains Mono, on a 62 px chip. The pill is 110 px tall with a 28 px radius, and its top sits at y 248 (safe line 230). At 76 px, "A TINY BEACH" plus the chip is still narrower than the 632 px lens, so the pill reads as the lens's label. The fit step-down now runs from 76 px to a 64 px floor (`measure()`). The v1 card chip is unchanged (28 px, sized to its 52 px header row).

**Edge contrast on the white shirt.**
- The SVG underlay under every white mark (both leaders, the v0 spot ring and the v1 box) is now `rgba(11,11,14,.62)` at 7 px (was `rgba(7,8,12,.45)` at 7.5 px). That is a crisper 1.75 px ink keyline on each side of the 3.5 px stroke, and the 2 px halo stays.
- The v0 lens ring's outer and inner 1 px keylines are now `rgba(11,11,14,.45)` (were .22 / .18).

**Not applied:**
- **Plate and master in-point +2.4 s.** The p05 shot cuts at 5.0 s (the plate contact sheet shows the next shot, the shirtless man, from frame 150), and the zoom master is 5.1 s long. An offset of 2.4 s would put the cut at 2.6 s of a 5.0 s composition.
- **Re-key to the lower umbrella cluster for 1.6–2.9 s.** I checked full-resolution crops at 1.4–3.0 s. In that window the whole shirt front sits right of x 870, the umbrellas at about x 956 (under the action rail), and the lower front palm at about (810, 1370), which pushes a 248 px ring past the y 1440 safe line. The only print inside the safe zone is the sleeve palm, and it sits next to the forearm. So a mid-hold re-key would trade the fold for the arm and add two glides to a locked hold.
- **The v1 card at x 96–912.** The card's right edge at 936 is what keeps the right leader from leaning inward (round 4). At 912 its window corner (900) would sit left of the box's right leader point (up to 924). It is inside the safe zone, so I kept round 4's placement.

**Still unresolved:** the sleeve fold fills the left part of the inset from about 1.6 to 2.9 s.

**Hero time stays 4.0 s.** `hyperframes check` passes. Loop seam: frames 147 and 149 match between the variants (PSNR 44.7 / 44.4 dB), so both end on clean plate.

Kept: plate p05 and the 5.0 s length, the dim of 0.30, the sunset only on the chips, "A tiny beach" and "A whole beach on a shirt", the navy card, its 64 px title and its Mono eyebrow, the native-pixel zoom master, the tracked spot with its soft safe clamp, v0's 620 px lens, tangent cone and collapse, and v1's collapse into the box.

## Round 7 (lead fix, after the r06 critic)
- **Defect (r06):** on v0's entrance (0.37–0.47 s) the leader ends hung 30–60 px off the growing lens rim, and the leaders appeared one frame before the lens.
- **Cause:** the tangent maths always used the full lens radius, while `#lens` scales 0.72 → 1 (expo.out 0.42 s from `T.open`). The leaders started growing at `T.beam` (0.30), before the lens existed.
- **Fix:** the radius, tangents and dim hole now include the entrance scale (`entS`). The v0 leaders grow from `T.open`, with the lens. v1 is unchanged.
- **Verified:** frames at 0.37 / 0.40 / 0.43 / 0.47 s show the leader ends on the rim.

## Round 8 (lead fix, after the r07 critic)
- **Defect (r07):** from 1.5 to 3.1 s, the safe-zone hold (`safe.right` 932) clamped the source spot about 100 px (v0) and 137 px (v1) left of the tracked umbrella motif, so both zooms showed blank sleeve under a "beach" caption.
- **Fix:** the spot is a marker on the footage, not text, so it now has its own limit, `CONFIG.safe.spotRight: 1064`. Text, lens, pill and card still respect 932. During that stretch the ring may sit partly under the platform's right-rail buttons; keeping the payoff on the subject matters more.
- **Verified:** v0 and v1 frames at 1.6 / 2.2 / 2.8 s show the umbrellas and palm in the zoom.

## Known trade-off (after the r08 critic)
- The r07 critic flagged the zoom leaving its subject because of the 932 clamp. The r08 critic flagged the opposite: the source ring and the v1 box run under the right action rail (peak x ≈ 1037 for v0, 1053 for v1, about 1.3–3.0 s).
- On p05 the shirt motif sits in the right ~15% of the frame during that stretch, so no setting keeps both the zoom on the subject and the source marker inside x 936. A plate pan would need about 1.5× upscale.
- **Kept r08:** the lens, pill and card (the payoff) stay fully inside the safe zone and show the right detail. Only the small source marker reaches under the rail.
- **With your own footage:** pick a detail left of about x 800, or set `safe.spotRight` back to 932.
