# Decisions: 21 Before/after slider

## Round 1

**Naming the variants.** I followed the standard web before/after slider convention (TwentyTwenty, Juxtapose): a "vertical" slider's handle travels vertically, so the halves are stacked top and bottom; a "horizontal" slider's handle travels left and right. A 9:16 frame suits the stacked layout well, so the vertical slider is variant 0.

**Footage.**
- Both layers are full frame (`object-fit: cover`, no transform). Only the GTA 6 layer is clipped (`clip-path: inset`). The GTA V layer is never clipped; GTA 6 covers it past the seam.
- Plates follow the manifest:
  - v0: g01 GTA V street with the red convertible, against p10's Vice City police-car street;
  - v1: g02 GTA V beach at sunset, against p01's "The Keys" sign.
- Tails (`loopAt`) skip bad stretches of the plates:
  - g01 cuts to a "Rockstar North" credit shot at 4.47 s;
  - p10 goes to a murky close-up at about 4.3 s;
  - p01 cuts to close-ups at about 4.2 s.
  The tails replay each opening shot, so the loop also lands on the same shot.
- p10 starts at 0.6 s so the police-car street sits under the hero frame at 1.1 s. g02 starts at 0.1 s to skip a possible rating-card frame (the #05 critic flagged one on the -h plate).

**Labels.** References: GAMEV's "GAME | REAL LIFE" (labels centred in each half) and Fx29's off-white "GTA V · ONLINE" tag. Both are upgraded to real chips sized for the feed.
- **v0:** solid cards pinned to the safe zone, a paper card at top-left (GTA V) and an ink-navy card at bottom-left (GTA 6). Each card reads name / rule / year / tracked place. The sweep range (seam y 520 to 1230) never crosses either card.
- **v1:** smoked-glass chips with the name at 104 px over the year tracked 0.42em. Each chip stays centred in the visible part of its half, clamped to x 72–936. When the seam squeezes a half narrower than its chip, that chip fades out ("yields") instead of being cut in half, and it comes back as the room returns.
- The sunset gradient appears on one thing per frame: the "GTA 6" name. That is the "after" accent.

**Handle.** A 112 px white knob with ink chevrons and a contact shadow plus a soft shadow, on a 4 px white seam with a layered dark shadow so it reads on bright skies. Before the drag the knob "grabs" (scale 0.88), and it releases with a small `back.out` as it settles.

**Motion.**
1. 0.08–0.64 s: the seam wipes GTA 6 in from off-frame (`expo.out`).
2. The labels land at 0.12 s and 0.40 s, so the component reads in under 0.6 s.
3. The seam holds, then drags to "more GTA V" (1.55–2.55 s), then to "more GTA 6" (to 3.75 s), then settles home (to 4.55 s).
4. The labels leave at 5.36 s, and the seam retracts the way it came (5.46–5.88 s).

Frame 0 and the last frame are both full-frame GTA V with no UI, so the loop is clean.

**Determinism.** All seam, knob and chip state is a pure function of time `t`, built from keyframe tracks evaluated with GSAP's parsed eases. A single linear clock tween calls `render(t)`. Chip widths are measured once, after the fonts load and before the timeline is built.

**Fixes made during round 1 (self-review).**
- v1's GTA 6 chip was half-cut at the sweep extreme. It now uses the fit/yield fade described above.
- The tracked text's negative trailing margin overflowed its box (a check warning). It is replaced with padding.
- The knob peeked in at the frame edge on frame 0. The off positions moved fully off-frame.

## Round 2

The critic (v0 6, v1 7) said the slider never sold a comparison: each half hard-cut on its own (about 9 cuts in 6 s in v0), the seam only wandered between 30% and 70%, and v1's GTA 6 chip vanished during the main sweep. Changes:

**Defect fixed (v1 GTA 6 chip hidden for 1.2 s).** The opacity "yield" is gone. Each glass chip now uses an edge-anchored scale fit: `scale = clamp((room - 14 - 12) / w, 0.74, 1)`. The chip stays centred in its half while there is room. When its half narrows, it scales down and docks against the outer safe-zone edge (x 72 for GTA V, x 936 for GTA 6), always at least 14 px clear of the seam. Opacity only drops if even 74% can't fit, which never happens in the sample motion. Both chips are fully visible in every frame between their landing and the exit. The minimum is 0.74 rather than the critic's 0.8 so the GTA V chip also stays solid at the payoff.

**One held shot per side (biggest gap).** The plates are fast-cut montages. p10's side-on police car lasts only about 0.7 s, so no `start`/`loopAt` choice could hold one shot. I baked four single-shot clips into `assets/clips/`, cut from the shared plates and slowed with ffmpeg motion interpolation (`minterpolate`, mci/aobmc). They play smoothly at 30 fps with no doubled frames, and each lasts exactly 5.0 s, so neither side cuts at all:
- v0 GTA V: g01 0.00–2.50 s, the Los Santos street with the white SUV at the kerb, slowed 2.04×.
- v0 GTA 6: p09 0.10–4.07 s, a Vice City street with a police pickup charging the camera and flipping, slowed 1.29×. It rhymes with the GTA V side as a city street with an SUV and replaces p10, which has no shot long enough.
- v1 GTA V: g02 0.07–2.70 s, the sunset lifeguard tower, slowed 1.96×.
- v1 GTA 6: p01 0.50–2.23 s, the "The Keys" sign push-in, slowed 2.97×. It starts after the jet-ski trailer has cleared the frame.

Each bake also crops 4 px off the sides and 7 px off the top (a 0.7% zoom) to remove a 1–3 px light line at the top edge of the source plates. The `<video>` elements themselves stay at `object-fit: cover`, except for the deliberate v0 shift below. The loop-tail mechanism (`loopAt`) is gone because it is no longer needed.

**One payoff in the motion.** This replaces the more → less → home wander and drops the "more GTA V" sweep, since GTA V already fills the frame at t = 0. Timeline (5.0 s; it was 6.0):
1. 0.08–0.64 s: GTA 6 wipes in to the middle.
2. Hold until 1.5 s. The knob presses in at 1.34 s.
3. 1.5–2.1 s: a `power3.inOut` sweep to the payoff.
   - v0 seam y = 450, so GTA 6 fills 77% of the frame. The critic suggested 420; 450 keeps the 96 px knob 40 px clear of the GTA V card.
   - v1 seam x = 310, so GTA 6 fills 71%. The critic suggested 240; that would squeeze the GTA V chip below a legible size inside the x ≥ 72 safe zone.
4. Hold the reveal for 0.9 s, then settle home by 3.6 s. The knob releases with `back.out`.
5. Labels leave at 4.36 s and the seam retracts from 4.46 to 4.88 s. The first and last frames are both full-frame GTA V.

Hero time is 2.5 s, the middle of the reveal hold.

**v0 framing.** The GTA 6 footage is slid down 360 px (`afterShift`, applied as `translateY`, with `data-layout-allow-overflow` on that video), so its subject centres in the lower half instead of showing smeared road. The seam never rises above y 450, so the shifted video's top edge (y 360) never shows.

**v1 material.** The glass is now `rgba(14,14,20,.80)` with `blur(22px) saturate(1.0)`, so both chips read as the same neutral smoke on the sunset and on the sky. The chip name is 92 px (was 104) and the year 28 px, so the GTA V chip fits the payoff band.

**Knob (both variants).** The stock white disc is replaced with a 96 px ink-navy (#1F202B) puck:
- white chevrons;
- `inset 0 0 0 1px rgba(255,255,255,.14)` hairline, plus a 3 px white outer ring that ties it to the white seam;
- the same contact shadow plus soft shadow as the cards.

**v0 cards.** Both cards now get the wider card's width (about 525 px) and centre their content. The right padding is 22 px, which is 30 px minus the place line's trailing 0.3em tracking. Each card is optically balanced (left and right insets equal), and the pair matches in width. The critic's literal `margin-right: -0.3em` is not used because that negative margin caused a check overflow warning in round 1; the padding offset gives the same optical result.

**Kept from round 1 (deliberate):** stacked layout for the vertical slider, paper and ink-navy cards pinned to the safe-zone corners, glass chips riding the seam in v1, the sunset gradient only on "6", the expo wipe-in and the retract-to-GTA V loop. The critic praised the wipe-in and the loop.

## Round 3

The critic (v0 7, v1 6; both won the blind pick) said the payoff hid the GTA V subject, so the slider never compared like with like: v0 showed arches above the seam and v1 showed a strip of empty cream sky. It also named two defects. Changes:

**Defect fixed: v1 glass chips drew at unequal sizes.** The shrink-to-fit (`glassFit`, scale floor 0.74) is gone. Both chips stay at scale 1 (the 0.96 to 1 settle belongs to the entrance only) and are docked to the outer safe-zone edges: GTA V's left edge at x 72, GTA 6's right edge at x 936, both tops at y 250. The two chips are the same width (about 268 px), the year stays at 28 px, and at the payoff (seam x 400) the GTA V chip clears the seam by about 60 px. This replaces round 1's "chips ride the seam", because the critic named a concrete defect in that behaviour.

**Defect fixed: v0 knob crowded the GTA V card at the peak.** `seam.peak` moved from 450 to 560 and `seam.knob` from 540 to 800. At the peak the knob (764–836 × 524–596) now sits 162 px below the card and outside its x range (72–597). `home` moved from 880 to 760 to keep the sweep length about the same.

**Biggest gap: matched footage.** All four sample clips are new single shots cut from the official trailers in `research/gta6/plates/` (not the shared plates). Each is cropped to 9:16 straight from the 1920×1080 source, just inside the letterbox, and slowed with motion interpolation to exactly 150 frames:
- **v1 is now the freeway crane-up on both sides.** The GTA V trailer (QkkoHAzjnUs 31.40–32.70 s) rises from traffic to the green "5 · Los Puerta Fwy" overhead sign. GTA 6 Trailer 2 (VQRLujxTm3c 35.20–38.33 s) makes the same move to the "35 North · VCI Airport", "97 to 397 Downtown" signs. This is the GAMEV reference's trick, the same kind of spot from the same angle. The crops put the two green signs at the same height either side of the seam (the GTA V "5" shield and the GTA 6 "35" shield are about 400 px apart at the payoff), with blue sky under both chips. I chose this over the critic's suggested p06 golden-hour gate because it matches subject, angle and camera move, not just the light. The GTA 6 side is slowed only 1.65× (it has a long source shot), so it still moves. A wider motion search (`search_param=64`) keeps the plane that crosses at the top right from breaking up.
- **v0 is now red convertible against red convertible.** GTA V: g01's Los Santos street shot (QkkoHAzjnUs 22.85–25.30 s, crop x 742), with the driver in the red convertible. GTA 6: Lucia leaning on the door of a red convertible with Jason at the wheel (launch trailer rz1B4B2yBZY 25.75–27.13 s, crop x 380). The critic suggested p07, but p07's "convertible" shot is a dancer in which the car is barely visible, so this shot is a closer match.
- **Why the GTA V footage drifts in v0 (`beforeShift`).** In a stacked split, GTA V is only ever seen in the top 560–760 px, but every 9:16 crop of trailer footage puts its subject low (the convertible sits at y 900–1800). So the GTA V video now drifts up 600 px while GTA 6 wipes in. The drift is proportional to the seam's travel from off-frame to home, which reads as parallax: GTA 6 slides in and nudges GTA V up. It is clamped so the GTA V frame always covers everything above the seam. It holds still through the sweep, the hold and the settle, so the comparison itself is a pure wipe. It drifts back as the seam retracts, so the first and last frames are still the unshifted full-frame GTA V and the loop stays clean. At the payoff the top half shows the driver, his arm on the red door and the windshield. The bottom half shows Lucia's face, her arms on the door and the red door edge (`afterShift` 300).
- `seam.peak` for v1 is 400 (was 310), as the critic asked. GTA 6 takes 63% of the frame and the GTA V sign stays readable. v0's peak shows 71% GTA 6.

**v0 card material.** Both cards are ink-navy #1F202B with the same rule (white 22%) and place line (white 70%). The GTA V name is rgba(255,255,255,.92), and "GTA 6" keeps the sunset gradient as the frame's only accent. The paper card is gone.

**Handle.** The handle is now a 72 px smoked-glass puck: rgba(14,14,20,.62), blur 20px, a 1 px inset rgba(255,255,255,.18) highlight, 2 px white chevrons, no white ring, and a small contact shadow plus a soft shadow. The seam's shadow is now `0 0 0 1px rgba(0,0,0,.25), 0 2px 8px rgba(0,0,0,.30)`, so it reads as a hairline instead of a glowing bar. The v1 knob moved from y 900 to y 640, into clear sky, so it no longer sits on the signs.

**v1 chip tone.** The glass is now rgba(20,21,30,.88) with blur 22px. Both chips read as the same navy smoke over the bright GTA V sky and the cloudier GTA 6 sky.

**Hero time 2.45 s** (frame 74, mid reveal hold). Frame 74 of the GTA 6 freeway clip is a real source frame, not an interpolated one, so the sign text is at its sharpest.

**Kept (deliberate):** stacked layout with GTA V on top for the vertical slider, cards pinned to the safe-zone corners, the sunset gradient only on "6", the expo wipe-in, one held shot per side, the 5.0 s timeline (sweep 1.5–2.1 s, hold to 3.0 s, settle to 3.6 s, exit 4.36–4.88 s) and the retract-to-full-frame-GTA V loop.

**Unresolved:** in v1 the GTA 6 plane passes behind the GTA 6 chip at about 3.0–3.6 s. In v0 Lucia's slow-motion blink keeps her eyes half-closed for about 0.6 s during the first hold (0.7–1.3 s); it is natural motion in the source.

## Polish round 4

The round 3 critic (v0 6, v1 7; both won the blind pick) said the slider barely slides: the payoff moved only 200 px (v0) and 140 px (v1) because fixed chip positions boxed the seam in. It also named two defects. This round fixes both defects, closes that gap and keeps the concept, layout, materials and loop.

**Defect fixed: v1 GTA V freeway warping.** Two separate causes:
- The "ghosted overpass" at y 1550–1700 around t 0.5 is in the source itself: hazy buildings behind the overpass in the 2013 trailer, which read as ghosting once upscaled. The underside of the I-5 sign is a see-through catwalk grate that reads as a smeared band. Round 3's bake also had real warping: the source repeats a frame (31.87 s) and whips fast at the end of the shot, and interpolating across both broke the sign apart near t 4.77.
- The new `g-freeway.mp4` uses only source frames from 31.83 s (after the overpass and traffic have left the crop) to 32.27 s (before the grate band shows), with the repeated frame dropped. It plays forward and then back on an eased (cosine) curve, densely interpolated, so the loop is seamless: frame 149 runs straight into frame 0. Checked in the r04 render at t 0.5 (clean sky and a small sign at the bottom) and t 4.6–4.75 (thin gantry, no band, no doubling).

**Defect fixed: v0 pair was not a like-for-like shot.** Lucia's face close-up is replaced by `t1-redcar.mp4`, a parked red sports car from the GTA 6 launch trailer (39.77–40.87 s, the Jason and Lucia shot, cropped right of them at x 1238). At the 50/50 home the top half shows the red GTA V convertible door and driver, and the bottom half shows the red GTA 6 door, window and mirror, at the same scale. The clip ends before Lucia leans into frame, so only her hand touches the window. The critic suggested p07 or p10, but neither has a car shot longer than about 0.7 s: p07's convertible is a dancer, and p10's police car drifts past in 0.7 s and would smear at a 7× slowdown.
- The GTA 6 footage now sits in its own box from y 400 to the bottom (`afterTop`, baked at 1080×1520), replacing round 3's `afterShift` translate. Its subject stays in the bottom half at a lower upscale (1.58× rather than 2.24×), and no part of the clip is cropped away.
- `beforeShift` is 500 (was 600) so the GTA V frame still covers the seam at its lowest point (y 1400). It now holds the full drift for the whole drag and only moves during the wipe-in and the retract, so the comparison is a pure wipe.
- `seam.home` is 960, as the critic asked, for a true 50/50.

**Biggest gap: a real drag.** The labels now ride the seam instead of sitting at fixed positions, so the seam can travel almost the whole frame:
- v1 chips sit 40 px either side of the seam. v0 cards sit 40 px above and below it.
- A label whose side is getting too narrow to hold it inside the safe zone fades out ahead of time: the 0.15 s fade ends exactly when the label would reach the safe-zone edge, so a visible label never leaves the safe zone and the seam never crosses it. It fades back in over the 0.15 s after it has room again. I chose this over the critic's clamp-then-fade because a clamped label would be crossed by the seam mid-fade. The fade is precomputed from the pure seam track on a 1/600 s grid, so `render(t)` stays seek-safe. This replaces round 3's docking. That change was made to fix unequal chip sizes, and both chips stay at scale 1 here, so that defect does not come back.
- The drag has three legs with 0.5 s holds: home, then GTA 5 fills the frame (1.10–1.65 s), then one long drag so GTA 6 fills it (2.15–2.95 s), then home (3.45–4.00 s). v0 travels y 1400 to 420 (GTA 5 73%, GTA 6 78%); v1 travels x 900 to 180 (83% each).
- I reversed the critic's order (GTA 6 first) on purpose. Before-then-after reads as a reveal, and it puts the GTA 6 freeway clip's best stretch (the signs and the jet) in the GTA 6 hold and the closing 50/50.
- The long leg uses `power2.inOut` over 0.8 s rather than `power3.inOut` over 0.55 s, so the riding labels don't strobe at peak speed (about 80 px per frame rather than 120).

**`t2-freeway.mp4` re-cut.** The jet's far-wing engines broke up in the old 1.65× interpolation. The new bake uses the whole shot (34.63–38.33 s). It slows only the slow driver-POV opening (about 2.2×), then eases into real time from about 2.6 s, so the crane-up and the jet pass play at 1× from real frames only. The hero (4.2 s, frame 126) is real source frame 91. The jet's far-wing engines hang below the wing in the source, so their look there is real, not an artifact.

**Handle.** The knob is now 104 px (was 72), with face rgba(14,14,20,.80), a 1.5 px rgba(255,255,255,.22) inner ring, and 3 px chevrons spanning 36 px. The seam is now 6 px (was 4). At 360×640 the chevrons still read.

**Naming.** "GTA V" is now "GTA 5", matching "GTA 6", the DESIGN rule and the search phrase.

**v0 cards.** Content is now left-aligned. Both names share one column, set at build to the wider name (176 px for "GTA 5"/"GTA 6"), so the rules and the year/place column line up at the same x (rule at about x 306) in both cards. I measured the column instead of using the critic's fixed 210 px, which would leave a 34 px dead gap before the rule. The card width stays at the wider card.

**Hero 4.2 s** (the 50/50 home after the drag, with both labels on). It shows the red car against the red car, and the "5 · Los Puerta" sign against the "35 North · VCI Airport" signs at the same height, with the jet over them.

**Kept (deliberate):** stacked layout with GTA 5 on top for the vertical slider, ink-navy cards and smoked-glass chips, the sunset gradient only on "6", the expo wipe-in, one held shot per side, the 5.0 s length and the retract-to-full-frame-GTA 5 loop.

**Unresolved:** at the turn of the GTA 5 freeway ping-pong (about 2.5 s) and at the loop point, the GTA 5 sign is nearly still for about 0.3 s, because the eased reversal slows to zero there.

## Polish round 5

The round 4 critic scored v0 7 and v1 8 (both won the blind pick) and named one defect. This round fixes it, adds the cheap fixes that fit the earlier decisions, and keeps the concept, layout and loop.

**Defect fixed: the v1 knob went into the action rail.** `seam.showBefore` is now 870 (was 900). At the GTA 5 hold the pressed knob spans x 823–917, and 870 + 52 = 922 at full size, both inside the 936 safe edge. Checked in the r05 render at t 1.87 s: the seam is at x 868–872 and the knob's right edge is at about x 916. At this hold, GTA 5 fills 81% of the frame.

**v1 glass is now see-through.** The chips use `rgba(14,14,20,.70)`, `blur(20px) saturate(1.4)`, the same inset hairline and top highlight, and a short light shadow (`0 10px 28px -10px rgba(0,0,0,.28)`) instead of the large card shadow, so the sky under them stays clean. Over blue sky they read blue-tinted (about rgb 40,58,87) and are clearly a different material from v0's opaque #1F202B card.
- I used .70, not the critic's .56. At .56, the pink end of the "GTA 6" gradient fell to 2.2:1 over the white clouds behind the GTA 6 chip during the first hold (0.6–1.1 s), measured in a test render.
- At .70 it measures 3.2–3.3:1 over the clouds and 4.4–4.6:1 over blue sky.
- This deliberately loosens round 3's "both chips the same navy smoke". That rule was made for the old sunset and cream skies; both v1 plates are now blue sky, and a glass chip that matches the card was the critic's named gap.

**Sub-lines are bigger for phones.** The v0 place line is now 28px with 0.24em tracking at rgba(255,255,255,.90) (was 26px, 0.3em, .70). The v1 year is now 32px/700 (was 28px/600). The v0 card's right padding is 23px, which is 30px minus the new trailing tracking.

**v0 footage push is smoother.** `beforeShift` no longer follows the seam's fast `expo.out` start. It has its own ramps:
- in: `timing.shiftIn` 0.08 s over 0.90 s, `power2.out`;
- out: `shiftOut` 4.25 s over 0.55 s, `sine.inOut`, finishing before the seam leaves the frame.

Measured in the renders, the GTA 5 footage moved at most 131 px per frame on entry and 168 px on exit in r04. In r05 it moves at most 51 and 47 px. It still holds the full 500 px drift for the whole drag (a pure wipe), and the first and last frames are still unshifted. The hero (4.2 s) comes before the shift-out starts.

**v1 GTA 5 clip no longer ping-pongs inside the frame.** I re-baked `g-freeway.mp4` from the same 13 clean source frames (31.83–32.27 s, repeat dropped), so round 4's warping fix still holds. They are interpolated to 10 steps per source frame. The clip drifts forward exactly one step per frame for 4.0 s, then slides back during the long drag (frames 61–91, 2.03–3.03 s, `power2.inOut`).
- During that slide the GTA 5 sign moves left with the seam, at about 12 px per frame against the seam's 60. It reads as GTA 6 pushing GTA 5 out of frame, the same parallax idea as v0.
- It never reverses while GTA 5 holds the frame. The loop stays seamless (last frame is step 58, first frame is step 59).
- Tracked in the r05 render: the "5" shield moves right steadily from 0 to 2.1 s, slides left from 2.15 to 3.0 s, then moves right again.
- I chose this over the critic's literal "forward-only 5 s segment". The only clean forward stretch is 0.44 s long, so a forward-only clip would jump about 150 px at the full-frame loop point, and round 4 kept that loop seamless on purpose. The slide is baked to the default drag timing; README says to re-bake the clip if that leg is retimed.

**Not changed (deliberate):**
- *v0 cards stay riding the seam.* Pinning them top and bottom is a layout change. Round 4 made the labels ride the seam on purpose, to fix round 3's "slider barely slides". The critic's other option ("ride both cards on the knob's side, left 72, gap 40") is the current behaviour.
- *The handle stays the 104 px smoked puck.* The critic asked for a white 88 px disc, which is round 1's handle; round 1's critic called that "the stock web compare widget". Every handle since has been called a stock widget (white disc, navy puck with ring, glass puck, dark puck), so changing it again would only swap one look for another.
- *v0 cards keep a shared width.* Round 2 made the two cards match in width after round 1 flagged a 533 vs 490 px mismatch. They stack edge to edge, so "VICE CITY" ends short of "LOS SANTOS" by design. The right inset after the longer line is still an optical 30 px.

**Hero 4.2 s**, unchanged: the 50/50 home after the drag, with both labels on.

**Unresolved:** v0's GTA 5 clip (`g01-convertible`) is one forward shot, so its loop point is a content cut: both ends are unshifted full-frame GTA 5, but the shot itself has moved on. This is unchanged from r04 (mean frame difference 45 at the loop in both renders). v1 now loops seamlessly (1.6).
