# Race HUD: decisions

## Polish round 5 (what changed and why)

The round 4 critique scored v0 7/10 and v1 6/10 and listed one defect: in v1, the p09 plate's own aim reticle sat on the gauge's 12 o'clock and read as a stray knob. I fixed the defect, closed v1's biggest gap with the critic's concrete spec, and made every cheap listed fix. The concept, the kit (raked chips, keyline box, pink event wipe, odometer roll, dark type edge), v0's bottom-right placement, the sunset arc and the "picture matches the numbers" footage rule all stay.

**Defect, v1: the reticle is off the gauge.** The p09 reticle is part of the footage (about x 700-725, y 937-960 through the whole chase), and the plate can't be scaled or cropped. So the gauge moved. `variants["1"].layout` is now `{ right: 366, bottom: 450 }`, which overrides the shared `layout` for this variant only. The gauge's centre is x 460, y 1216 (it spans x 206-714, y 962-1470, still inside the safe zone). The reticle is now about 370 px from the centre, 117 px outside the tick ring and about 100 px from the nearest tick, in the upper right over the truck's sparks. I checked single frames from the r05 MP4 at 2.6, 3.3, 4.0, 4.7, 5.4, 5.85 and 6.1 s and in the hero and blind frames. It never touches the ring or a tick. The scrim re-centres on the gauge automatically.

**v1, biggest gap: the gauge now speaks the race stack's flat-chip grammar** (the critic's spec)
- **A thin, flat ring.** The sunset fill went from 12 px to 8 px (mask r 212-220), laid exactly over an 8 px track. The track shows the full 270 degrees at white .22 (was 6 px at .42). The round end caps are gone, and both the track and the fill have flat (butt) ends, like the raked chips. Nothing round is left except the ring itself.
- **`MPH` is a label, like `LAP` and `GEAR`.** It's 66 px Barlow Condensed 700, the same size and weight as the GEAR label, set left of the numeral. The two cap heights are centred on the ring centre, as LAP is centred on its chip. So the gauge reads as two kit rows: `MPH 122` and `GEAR [5]`. The old 34 px tracked MPH under the numeral is gone, so the gauge uses two sizes (180 and 66 px).
- **Geometry to fit it.** MPH plus a 3-digit numeral doesn't fit inside the old 184 px inner radius. So the ring grew to r 216 (gauge 508 px, ticks 229-251), and the numeral is 180 px (the DESIGN floor) in 0.46em cells. Both stay at least about 20 px clear of the ring.
- **Fixed digit cells and a ghosted leading zero.** The numeral always has three cells, so the MPH label never jumps when the speed passes 100 mph (at about 4.15 s). Below 100, the leading zero is drawn at white .22, the track's "unlit" alpha, so it reads `MPH 024`. That's the same leading-zero logic as the race timer's `00:`.
- **A shorter gear flash.** A gear shift runs the kit's pink wipe faster (CONFIG `gearFlash`: 0.07 s in, 2-3 frame hold, 0.09 s out, about 0.25 s of pink in all, down from about 0.45 s). The chip returns to the kit's ink navy. I checked frames at 5.567-5.90 s: pink from 5.60 s, navy again by 5.867 s. The overtake and lap flashes in v0 keep the 0.16 s in and out (`flash`).

**v0, Race stack**
- **Vehicles in motion the whole time, no talking head.** The p03 close-up of Jason (3.65-6.5 s) is gone. The edit is now the p07 convertible (0-1.2 s, cut on the plate's own 1.23 s change), then one unbroken p10 run (1.2-6.5 s, media 0.45-4.16 s at `data-playback-rate="0.7"`): the green sports car, the police car drifting, then the dirt-bike jump and landing. It starts after the pedestrian (media 0.3-0.4) and ends before the plate's 4.25 s cut to a man on foot. The overtakes land on the drift (1.75 s, 3.05 s). The final-lap flip (4.2 s) lands with the bike in the air, which echoes Rockstar's own dirt-bike race frame. I kept p09 out of v0 on purpose: its reticle would sit about 30 px above the LAP chip. A freezedetect pass on both MP4s found no frozen stretch.
- **The timer matches the position's cap height.** The timer went from 146 px to 128 px with an 18 px top margin. In `uphThaa97ig-14.5`, `11 / 12` and `00:18.62` share a cap height (about 36 px at 1080p), so the boxed position leads. The stack is now about 411 px wide.

**Both: no dead lead-in.** `timing.in` went from 0.2 to 0.08 s. The timer starts ticking at 0.32 s, the speed starts rolling at 0.3 s, and the track draw-on is 0.36 s long. The full HUD reads by about 0.4 s in v0 and 0.46 s in v1 (checked in the entrance frames).

**Hero time: 5.0 s** (was 5.85). v0 shows the dirt bike in the air over LAP 2/2, 3/8 and 00:50.88. v1 shows `MPH 122` in navy GEAR 5 with the arc 87% full, as the police truck charges through sparks, and no pink chip in the frame. At 5.85 s, v0 would sit on the palms between the jump and the landing. The check passes with 0 errors, 75/75 contrast checks, and only the template's `#ov` nesting warning (the file is back under the 300-line lint limit).

## Polish round 4 (what changed and why)

The round 3 critique (v0 8/10, v1 6/10) listed no defects. The biggest gap was v1: a generic dial with no payoff. It opened on "0 MPH", topped out at 47 mph and filled only about 30% of its sweep, and its 136 px numeral was under the 180 px floor. I made every listed v1 fix and the cheap v0 fixes. The concept, placement, scale, kit and grammar all stay as they were.

**Both variants**
- **The event flash wipes out instead of fading.** After the hold, the pink fill now wipes out toward the right edge (`scaleX 1 → 0`, `transform-origin 100% 50%`, 0.16 s power2.in). On the position box it drains into the pink keyline. The old 0.25 s opacity fade went through a muddy plum half-state at about 2.05–2.10 s, and that state is gone. I checked it frame by frame in the r04 MP4s at 1.90–2.20 s (overtake), 4.36–4.66 s (lap) and 5.76–6.06 s (final shift). The dimmed slash snaps to white on the pink as before, then settles back as the wipe edge passes it (0.06 s, 0.1 s into the wipe-out).
- **The last event holds a frame longer.** CONFIG has `flashHold: 2` and `finalHold: 3`. The final event of each variant holds the pink for 3 frames: the LAP 2/2 flip in v0 and the 5 → 6 shift in v1.

**v1, Speedometer: a real top-speed run**
- **Speed curve.** It starts rolling at 24 mph, not 0, and climbs to 138 mph through gears 2 → 6. Shifts land at 1.25, 2.5, 3.95 and 5.6 s, each with a short dip and the pink chip wipe. The 5 → 6 shift at 5.6 s holds 3 frames. The arc passes 75% of the sweep (105 mph) at about 4.6 s, ends at about 99%, and shows the full pink → orange → amber sunset.
- **The footage still matches the numbers.** I kept the round 3 rule that the picture has to match the speed, so 138 mph can't sit over the mural crawl. The p04 in-car POV now covers only the 24–66 mph pull-away (0–2.5 s, 1.0x), and the 3 → 4 shift lands on the cut. Then the p09 getaway chase runs (2.5–6.5 s, media 0.1–2.98 s at 0.72x): the road streaks past while the police truck charges, takes fire and flips just as the car hits sixth. That's the manifest's suggested p09 plate. It stops before the plate's next shot, where the shooter stands on foot. That was the round 2 "76 mph over a man on foot" complaint, so it doesn't come back.
- **Sizes that hold at 360x640.** The numeral went from 136 px to 184 px (DESIGN floor 180). It's re-centred, with cap height at y 150–279 of the gauge and MPH at 296. `138` is 259 px wide, inside the 368 px inner ring. The track is 6 px at white .42, the sunset fill ring is 12 px (mask r 184–196) with 12 px round caps, and the ticks are 22 x 3 px. Unlit ticks are white .72 and lit ticks full white, which keeps the round 2 "a tick lights as the speed passes it" detail.
- **Known, not fixed:** the p09 plate has the game's own aiming reticle, a small ring about 40 px wide, near frame centre (x 695–728, y 925–960). That puts it just above the dial's 12 o'clock. It belongs to the footage. Moving it would mean scaling the plate (against the plate rule) or moving the HUD (against the layout). The 16:9 plate brings the full game HUD with it (minimap, wanted stars). A creator's own clip replaces it.

**v0, Race stack**
- **Chequer.** Alpha went from .045 to .022, so it reads as a faint frost, not JPEG macroblocking. I kept the 56 px squares (3 rows in the box) from round 2, because the official `8 / 16` box shows 3 rows, and 28 px squares are what read as a transparency grid in round 1.
- **Weights.** The position numerals went from 700 to 600, closer to the official medium cut. The timer stays at 600, because that's the lightest Barlow Condensed weight in the shared kit (600 to 900). A 500 would fall back to 600 anyway.
- **Totals.** Zooming into both references shows the LAP chip's `1 / 2` all white, while the position box dims its field size (`12`, `16` are light grey). So the LAP chip total is now `#fff` and the position total stays `--dim`. The critic's "totals are white" holds for the chip but not for the box.

**Hero time: 5.85 s.** v1 reads 132 mph in a pink GEAR 6 chip, during the 3-frame hold, with the arc about 94% amber-tipped and the police truck flipping. v0 has settled on LAP 2/2, 3/8 and 00:51.62 over Jason driving. The check passes with 0 errors and 67/67 contrast. I trimmed the file back under the 300-line lint limit. The only warning left (`#ov` nests the scrim) comes from the template.

## Round 3 (what changed and why)

The round 2 critique (v0 7/10, v1 6/10) named no hard defects. The biggest gap: v0 had no payoff after 3.0 s, and v1 was a cluttered ring-plus-box gauge that broke the sparse official language. Every fix below follows a named critique point. Nothing deliberate was reversed: placement, the 2.6x scale, type, the odometer roll, the pink event wipe, the checker box and the 270 degree arc all stay.

**Both variants**
- **Rockstar's dark type edge.** Zooming into `uphThaa97ig-14.5` (over bright dirt) shows that every HUD glyph has a thin dark outline, and so do the chip and the box. Now type that sits straight on the footage (LAP, the timer, GEAR, the speed numeral, MPH) gets `-webkit-text-stroke: 4px rgba(10,10,16,.55); paint-order: stroke fill`, which shows as a 2 px dark edge outside the letter. MPH uses 3 px. The position box has a 1.5 px `rgba(10,10,16,.55)` outline. The raked chips are now a dark outer polygon with the navy fill inset 1.5 px, so the edge follows the rake. DESIGN.md allows a 2–3 px paint-order edge on big words, and these are 34–146 px HUD words copied from the official HUD.
- **No scrim on the transparent export.** `scrimNone` went from 0.3 to 0, because the dark edges now carry legibility. Over a flat sand colour the stack reads like the official HUD on dirt. The plate render keeps a lighter corner scrim (0.5 to 0.45).
- **Entrance: slide and reveal, not an opacity stagger.** Each row moves x +36 to 0 while `clip-path: inset(... <width>px)` opens right to left (0.30 s expo.out, 70 ms stagger: LAP row, box, timer). The pink keyline still grows with scaleY. Once a row is in, its clip-path is set to `none` again, because a clip-path on an ancestor would cut off the box's backdrop blur.

**v0, Race stack**
- **A lap-change payoff at 4.2 s.** The LAP chip runs the same event as an overtake: a 0.16 s pink wipe, the `1` rolls out and the `2` rolls in (LAP 1/2 to 2/2, the final lap), a 2-frame hold, then a 0.25 s fade back to navy. The dimmed slash and total snap to white while they sit on the pink. The beats are now box (1.75 s), box (3.05 s), chip (4.2 s), so after 3.0 s the eye moves from the box to the chip. CONFIG `lap` changed from `current` to `steps` and `at`, like `position`.
- **Driving footage only.** p10 police car drifting, then the dirt-bike jump (media 0.75–3.2 s), then the p07 convertible (0–1.2 s), then p03 with Jason driving and the street sliding past his window (4.0–6.85 s). The cuts land at 2.45 s and 3.65 s. The on-foot rifle shootout (p09) is gone.

**v1, Speedometer: ring only, the box removed**
- **Box removed.** The `.spd-box`, its `.box-bg` and its pink `.box-bar` are gone. The 136 px Barlow Condensed 700 numeral sits bare at the ring centre (fixed 0.47em digit cells, centred), with MPH under it. What's left is the arc, 8 ticks, one numeral and the GEAR chip, and the sunset arc is the only accent.
- **The arc is a real sunset now.** Before, the gradient was fixed across the dial width, so a 40–50 mph run only ever showed pink. Now the fill is a conic gradient masked to the 9 px ring, with round caps drawn as two dots. It runs from pink at 0 to orange at 55% to amber at the run's top speed, so the tip warms as the car speeds up.
- **Holds on bright plates.** Ticks are 3 px (were 2), the unfilled track is `rgba(255,255,255,.38)` (was a mid-grey .42), and the track, ticks and arc all get a 1 px dark drop-shadow edge.
- **MPH is legible on a phone.** It's Barlow Condensed 700, 34 px, tracked .28em (was Inter 26 px tracked .4em, which shrank to about 9 px at 360x640).
- **The picture matches the numbers.** The p04 in-car POV plays for the whole run at `data-playback-rate="0.67"`, so 6.5 s of timeline uses media 0–4.36 s and never reaches the plate's 4.43 s cut. The speed is an in-town pull-away along the mural: 0 to 46 mph, gears 1 to 4 (shifts at 1.61, 3.06 and 4.36 s), each with the dip and the pink chip wipe. No 76 mph over a man on foot.

**Hero time: 5.0 s.** v0 has settled on LAP 2/2 and 3/8, with the timer at 00:50.76 over Jason driving. v1 reads 42 mph in gear 4, the arc pink to amber, over the in-car POV. The check passes with 0 errors and 67/67 contrast checks. The file stays under the 300-line lint limit. The one lint warning left (`#ov` nests the scrim) comes from the template and was already there in round 2.

## Round 2 (what changed and why)

The round 1 critique (v0 7/10, v1 6/10) named no hard defects. The biggest gap: v0 is faithful but its checker read as a transparency grid; v1 dropped the kit's language for a generic Forza/NFS tick-ring dial. Every fix below follows a named critique point. Nothing deliberate from round 1 was reversed (placement, scale, type, timer, odometer roll, entrance and exit all stay).

**v0, Race stack**
- **Checker: flag texture, not a transparency grid.** The squares went from 28 px to 56 px, so there are exactly 3 rows in the 168 px box, the way Rockstar's `8 / 16` box shows 3 rows. Alpha went from .06 to .045, anchored to the right edge, with `mask-image: linear-gradient(90deg, transparent 0%, #000 45%)`.
- **The box hugs its numerals.** It has no fixed width now: 36 px of air on the left, 36 px plus the 10 px keyline on the right. `3 / 8` makes it about 293 px wide (it was 400). Its left edge lands near the LAP chip's slant, as in `uphThaa97ig-14.5`. The slot sizes to the widest position, so the box never resizes mid-roll.
- **Overtake payoff: a crisp fill wipe, not a soft fog.** A 100% `#F84FA4` fill wipes left to right (0.16 s expo.out), holds for 2 frames, then fades back to the navy in 0.25 s. The odometer roll runs inside it. The dimmed slash and grey total snap to white for the flash, which keeps them legible on the pink (2.0:1 grey on pink failed the contrast check; white is 3.2:1). The bar-kick and sheen were removed because the wipe covers them.
- **Footage.** The p10 cut now starts at media 0.75 s, so it skips the pedestrian who filled the frame at 4.6 s. It plays the police car drifting (4.1–5.2 s), then the dirt-bike jump. The critic flagged the same pedestrian under v1.

**v1, Speedometer: rebuilt in the race stack's grammar**
- **Tick crown removed.** The 41-tick, three-layer ring is gone. What's left: the 9 px sunset arc on a 7 px track, plus only 8 ticks (0, 20 … 140 mph) at 2×18 px, white .5, sitting just outside the arc. A tick lights to .95 once the speed passes it. The white pip is also gone.
- **The speed sits in the position box.** It uses the same `.box` as v0 (ink-navy .52 with blur, 1.5 px hairline, 10 px pink keyline on the right, bar grows in). Its 136 px numerals sit in fixed digit cells, right-aligned. The box is sized once for the most digits the CONFIG speed reaches. That's what makes both variants read as one kit.
- **Same entrance and event grammar as v0.** The box and the GEAR row slide in from the screen edge (x 56, blur 3 → 0, expo.out). The track draws on clockwise and the ticks appear as it passes them. Each gear change fires the same crisp pink wipe as an overtake, inside the GEAR chip.
- **GEAR chip legible on dark plates.** Both chips (LAP and GEAR) have a lighter ink gradient and a 1 px rgba(255,255,255,.14) hairline that follows the raked edge (an even-odd `clip-path` ring). The GEAR → chip gap is about 24 px at mid-height, down from about 80.
- **The track reads on bright plates too.** It's a mid-grey rgba(150,152,168,.42) rather than white .16, so it shows on the dark in-car POV and on the white police car. MPH is now 700, solid white.
- **The speed matches the footage.** It runs 0 → 50 mph over the p04 in-car crawl (0–4.0 s, gears 1 → 3), 50 → 63 over the p10 police car drifting (4.0–5.0 s), then 63 → 75 over the p09 truck charging (from 5.0 s). The 3 → 4 shift lands on the first cut. The dial tops out at 140 mph.
- **Scrim.** `scrimNone: 0.3` is used when `bg` is `"none"`, so the transparent export doesn't bake a heavy dark smudge into the creator's clip. The plate render keeps 0.5.

**Hero time: 3.7 s.** v0 has settled on 3/8 after the second wipe, with the timer at 00:49.46. v1 reads 48 mph in gear 3 over the dark in-car POV, where round 1's chip disappeared. The check passes: 0 errors, and all 67 text samples pass WCAG AA.

## Round 1

**Reference.** Rockstar's own GTA 6 race HUD in `research/gta6/refs/hud-official-gta6-race-position` (`uphThaa97ig-14.5`, `8L0CzL2V72c-27.5`), zoomed to read the details. analysis-2 row "Race lap / position / timer" (7.1M) and analysis-3 ("LAP 1/2 · 8/16 · 00:22.08 in a thin condensed face at bottom-right").

**v0, Race stack: a faithful, phone-scaled copy of the official HUD's structure**
- **Placement.** Bottom-right, as in the game, right edge at x 936 and bottom at y 1440 (the corner of the safe zone). Exposed as `layout.right/bottom/scale` so a creator can lift it above their captions.
- **Structure from the reference, row for row.** "LAP" label + an ink-navy chip with a raked left edge holding `1 / 2`; the position box (square corners, 1.5 px hairline, translucent dark fill with backdrop blur, a faint chequered-flag texture fading to the right, numerals right-aligned, a solid pink bar on the right edge); and the big timer under it. The current position is white, the slash and field size are dimmed, as in the game.
- **Scale.** About 2.6× the reference's 1080p size: chip 100 px, position box 400×168, numerals 128 px, timer 146 px. The stack is ~470 px wide (44%). I kept it below the 70–88% hero-width rule on purpose: DESIGN.md's HUD-kit rule is Rockstar's restraint, and a 750 px race HUD reads as a toy. At 360×640 the timer is ~49 px and the LAP chip ~26 px tall, so it stays legible.
- **Type.** Barlow Condensed 700 for LAP / position, 600 for the timer and chip numerals; 3 sizes (78 / 128 / 146). Digits sit in fixed-width cells (0.47em) so the ticking timer never jitters.
- **Legibility.** No strokes: a tight two-layer shadow (`0 1px 1.5px .5` + `0 3px 14px .38`) and a soft alpha corner scrim behind the HUD (CONFIG `scrim`, also kept in the transparent export).
- **Motion.** Rows slide in from the screen edge one at a time (56 px, blur 3 → 0, 0.38 s expo.out, 0.12 s apart), the pink bar grows in, all readable by 0.8 s. The timer ticks in real time from 00:46.20. Two overtakes (1.75 s, 3.05 s): the old position rolls up and out, the new one rolls in from below (odometer roll inside a clipped slot), a pink sheen sweeps right-to-left through the box, and the bar kicks to 2.4× width and settles. Everything clears at 6.0–6.32 s; the last 5 frames are clean footage for the loop.
- **Accent.** Pink only (the bar and the overtake sheen), matching the official HUD's pink bar.

**v1, Speedometer: the same language applied to a gauge Rockstar doesn't show**
- GTA 6's footage has no speedometer, so this is built from the race HUD's vocabulary: thin white ticks, Barlow Condensed numerals, the same raked ink-navy chip for `GEAR`, and one accent. The single accent is the pink → amber Leonida core on the speed arc, with a white pip at its tip.
- 270° arc open at the bottom, 41 ticks (every 5 mph, major every 20), unlit ticks dim, ticks under the speed light up white. No dial numbers, to stay sparse.
- Speed is keyframed with a short dip at every gear change (0 → 146 mph over 5.4 s, gears 1 → 5); the GEAR chip rolls like the position box. At top speed it flutters ±1 mph (a sine, deterministic).
- MPH, because Leonida is Florida. Inter 600 caps tracked 0.4em for the unit, the "official" wide-tracked label.

**Footage.** No plate is driving for its full 8 s (p09 cuts to a gym at 4.1 s and to a third-party headphone ad at 6.73 s; p10 cuts to a bike at 1.85 s). So each variant is a short edit on the plates' own scene cuts, using `data-media-start`: Race stack = p09 chase (0–4.1 s) + p10 street cars; Speedometer = p04 in-car POV (0–4.4 s) + p10 street cars. The composition is 6.5 s so the ad never appears. Plates stay `object-fit: cover` with no transform.

**Hero time: 3.7 s.** v0 has just settled on 3/8 with the timer ticking; v1 reads 108 mph in gear 4 over the in-car POV.
