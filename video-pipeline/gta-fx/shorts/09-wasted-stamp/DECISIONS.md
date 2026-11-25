# Decisions: 09 Wasted stamp

## v2 concept (as of round 7)
- **The one idea: the death-cam closes in.** Real-speed action, then on THE hit the world drops into slow motion that keeps slowing, drains to hard black-and-white and snaps into a cinematic letterbox band (1080×820, tightening to 1080×680, about 1.6:1). A dark GTA ribbon (a flat .82 core, a short feather) slides across it and the word slams onto it, lit by its own bloom. The top bar carries one line that belongs to the moment. A second beat lands in the hold. Then the type blurs out, the ribbon slides away and the letterbox shuts like an eye; the comp ends as it shuts. In Busted only the police lights keep their colour.
- **Shots and cuts.** Wasted: `s119-gameplay-shootout` 9:16 at real speed (0–1.2 s = source 0.5–1.7, the police SUV charging the gunman, sparks off its bumper, aim reticle painted out), then a **hard cut at 1.2 s** to the same moment on the 16:9 master (reticle painted out), slowed 0.32x easing to 0.20x with motion-adaptive pacing: sparks, the swing, the flip onto its side ("083"), ending at source 2.62 s, before the game's heavy motion blur. Busted: `s014-driveby-police` 9:16 at real speed (0–1.2 s), then a **speed ramp at 1.2 s** (0.30x, cadence-corrected) on the same shot, same framing, while the bars cut in wide and clamp down (the arrest at the mural and the police car).
- **Where the type sits.** Wasted: band centred (y 620–1300 at the hold, bars 620 / 620); the word optically centred (y 960) on the ribbon over the SUV; "TIME OF DEATH · 14:32" in the top bar (y 544). Busted: band at y 540–1220 (centre 880, so its bottom edge lands on the bumper and kerb and the POV dashboard stays behind the bottom bar); the word on the ribbon in the band's lower third (y 1070), so the officers, the light bar and the cruiser's tail lights play above it; the five wanted stars in the top bar (y 464). Stars on top, word below: the arrest is framed like a wanted poster.
- **Hero size and face.** Archivo wide (125%) 900 caps, auto-fit to 760 px (88% of the safe width, about 128 px, cap height about 90 px), with a lit-from-above gradient mapped to the cap height and a three-step bloom in the word's own colour. The kicker is Archivo wide 600 at 26 px (a 4.9:1 ratio). One family on screen.
- **The payoff hit at 1.2 s (frame 36).** On one frame: the cut or ramp, the bars, an exposure flash on the footage only (white for Wasted, police blue for Busted; the bars, the ribbon and the type stay clean), a 12 px decaying shake with a 4.5% punch, and the word slamming in from 1.2x scale, 16 px blur and wide tracking, with a short 8 px RGB split over 0.25 s. The ribbon lands 2–3 frames before, as the anticipation.
- **Second beat.** Wasted: a narrow warm glint sweeps left to right across the word (3.2–4.2 s, crossing the centre at 3.7 s) as the SUV goes over. Busted: the stars empty right to left (3.2–4.0 s) while the light bar and the bloom pulse together at 1.6 Hz.

## v2 round 7
The round-6 critique scored both variants 7 with three defects: ghosted slow motion on Wasted's tumbling SUV and rifle (3.4–4.3 s), clipped and torn whites in Wasted's grade (1.6–2.2 s), and an overshooting light key in Busted (a 200×120 px blue blob around the bar and a smudge on an officer's chest). Its biggest gap: the hit is professional, the hold isn't, the ribbon is too faint to read, and the bars are dead. The concept and the hit are kept; this round fixes the hold.

**Defect: Wasted's double images. Fixed at the source, not the interpolator.** I pulled the source frames at the critic's times. From source 2.70 s on, the game's own motion blur smears the tumbling SUV and the rising rifle into ghosted double edges, and r06's 0.30x bake spent comp 3.4–5.0 stretching exactly those smeared frames (source 2.66–3.14). No interpolator can un-smear a frame; ffmpeg `minterpolate` (the critic's suggestion) was r03/r04's engine and tore worse.
- The slow segment now covers only sharp source: 1.70–2.62 s.
- To keep 0.3x at the hit and still stop before the blur, the hit moves back 0.3 s in the source: the lead is s119 vertical from 0.5 s (re-run through `paintout.py`), and the cut lands on source 1.7 s (the SUV taking fire, sparks off the bumper). The slow part now tells the whole arc: sparks, the swing towards camera, the flip onto its side with "083".
- `slowflow.py` got a **ramp** option (`… 0.2:2`): the rate eases from 0.32x at the hit down to 0.20x, so the death-cam keeps slowing as the SUV goes over.
- I tried 0.30 → 0.09x on the original window first. It stopped before the blur, but 9–11 in-betweens per source frame on a 30° rotation melted the SUV body at the hero time, so it was dropped.
- The 16:9 master's reticle sits on the sparks from 1.6 to 2.0 s, where the old fixed delogo box missed it. `paintout.py` got a `scale` argument (0.62 for the master's smaller ring), and `assets/clips/w0-s119-master-clean.mp4` is the painted master the bake reads.

**Defect: Wasted's torn whites. The grade, plus the bake.**
- The grade is the critic's: contrast 1.3 → 1.15, brightness 1.06 → 1.0, and a shoulder curve `[0,.06,.16,.28,.40,.52,.63,.73,.82,.89,.94]`. Road paint and smoke keep their texture; nothing clips to flat white.
- The torn edges were mostly the bake, though: during the camera whip at source 2.07–2.20 s (up to about 140 px a frame), the per-pixel anti-ghost pick chopped the white crosswalk line into chunks. Three changes to `slowflow.py`:
  - **Motion-adaptive pacing** (`… 2`, the 9th argument): each source pair's share of the output shrinks with its smoothed 90th-percentile ground motion, so the whip plays through fast (a natural speed ramp) and the calmer flip gets the time back. The overall rate is unchanged.
  - **A camera layer:** a RANSAC homography per pair, fitted on the ground rows. Where camera-only warps line the two frames up better than the local flow, it is used instead.
  - **Softer seams** on the anti-ghost pick (blur σ 2.5 → 5).
- Small torn flecks of road paint remain on 2–3 frames around 2.6–2.9 s, at the band's bottom edge; see Unresolved.

**Defect: Busted's light key. Rebuilt.** `lights.py` no longer keys "bright, saturated, blue" over a tracked row band (that took in the capture's own lens flare, a 140×80 px saturated oval while the bar fires, plus the round flare ghosts on the officers).
- Blue now passes only inside per-emitter line boxes. Each frame finds white-hot cores (value ≥ .92) with a saturated blue flare around them (the roof bar, plus the rear-deck light in the back window, which is a real emitter). Each core is clamped to its own line: the row where it is widest ± 14 px, across its columns ± 12 px. The boxes are averaged over 3 frames, so the clamp doesn't jitter.
- Inside a box, each pixel keeps its own hue. The white-hot line stays white and its rim goes police blue: a light bar, not a blob.
- The halo is tight: σ 6, capped at .32 and clamped to within 26 px of the box (was σ 11, capped at .5, unclamped).
- The flare ghosts are never white-hot, so they never pass. The officer's chest is plain mono.
- Red (the tail lights) keeps its key, now with a 40 px minimum blob area, which drops stray specks.
- Checked on a multiply preview of every 8th frame and in the render at 1.5–2.1 s: a crisp blue bar, no oval, no chest smudge.

**Ribbon: it reads.** `#strip` is now a .82 flat core with stops 0 / 4 / 10 / 90 / 96 / 100% (was .68 with a 16% feather), and `stripH` 250 → 210. Both words now sit on a visible dark band edge to edge, like the reference, instead of floating on grey footage.

**Busted plate and word** (the critic's numbers):
- `bandCenter` 930 → 880, so the band is y 540–1220 at the hold.
- `lockupY` 1090 → 1070, so the ribbon (965–1175) ends above the band's bottom edge and the bumper shows under it.
- Bloom `{.5, .1}` → `{.35, .06}`, and the fill's last stop `#6FA0FF` → `#A9C4FF`: the word is white-hot steel, and the blue lives in the lights.
- Re-checked: the roof (source y ≤ 330) and dash (≥ 1350) stay behind the bars at the 880 clamp with the push and the punch (worst case y 210 and 1424).

**The bars earn their place.**
- `bandHold` 760 → 680 (1080×680, about 1.6:1). The band now visibly closes in through the hold (820 → 680), which is the concept, and its aspect reads as cinema, not a box.
- The Wasted kicker is now "TIME OF DEATH · 14:32", a time-coded line that belongs to the moment. It replaces "VICE CITY · LEONIDA", which two critics in a row called filler. It is still the creator's slot: any line works.

**Retimed for the new footage.** The sheen moves 2.3 → 3.2 s (crossing the centre at 3.7 s, gone by 4.1 s) and the stars clear 3.0 → 3.2 s (all empty by 4.0 s). The hero frame at 4.2 s has a clean word, a settled star row and the SUV on its side.

**Kept on purpose:** the concept, the hit, the timing of the hit and the exit, Busted's slow bake (it passed: no doubles, even cadence), the Busted grade, and the light pulse.

**Checked in the render (r07, captured four times).**
- `hyperframes check` passes: 0 errors, 0 warnings, 3 expected infos. Contrast passes 85/85.
- 150 frames each.
- Pulled frames: the hit (1.2 / 1.33), the hold (2.0, every frame 3.6–4.37), the exit (4.45, 4.8) and the entrance sheet.
- No reticle in the lead or the slow part. No HUD in the band. No font fallback. No clipped white: the road holds grey texture.
- Busted's bar is crisp blue, with no blob and no chest smudge.

**Hero time: 4.2 s.**
- Wasted: the SUV on its side with a crisp "083", the shooter bottom-left, WASTED on the ribbon, the kicker above the band.
- Busted: the cruiser with a crisp blue bar and rear-deck light, BUSTED on the ribbon, the five stars emptied.

**Unresolved / watch.**
- **Morphing between source frames.** Between source frames the 3D tumble still morphs slightly: around 3.8–4.1 s the "083" numerals warp on in-betweens. It reads as motion at speed, but a frame-by-frame pull will find it. If it is flagged, set the hero frames on exact source frames, or go back to a faster ramp end (fewer in-betweens).
- **Road-paint flecks.** A few torn flecks of road paint remain at the band's bottom edge for about 3 frames near 2.7–2.9 s (the camera whip). A stronger `adapt` value would push the whip faster still.
- **Busted's hero.** At 4.2 s it shows the end state (stars empty, the officers past). Five full stars and the officers read at 2.0–3.0 s.

## v2 round 6
The round-5 critique passed Wasted (8) and failed Busted (7), with no defects and no hard caps. Its biggest gap: Busted holds a near-static, milky mono dusk shot with stepped slow motion, and both variants waste about 630 px of empty black under the band. The critic called the Busted idea good and the image the problem, so Busted is polished, not redesigned. Wasted keeps everything that passed and takes the critic's three small fixes.

**Busted slow-motion judder: fixed at the cause.** The critic measured every third frame as a near-duplicate. They were not repeats. The `s014` capture advances unevenly: the measured motion per source frame runs about 1.11, 0.70, 1.33, 0.49, 1.11, 1.51, 0.72 … (a rough three-frame pattern). A uniform 0.3x stretch therefore plays some in-betweens of a full step and some of a half step, which reads as judder.
- `slowflow.py` has a new cadence option (`bake-slow.sh … 4.0 "" 0.3:0.68`). It measures each source pair's real time step from its median optical flow in rows .30–.68 of the frame, relative to its smoothed neighbourhood, and samples the output on that corrected timeline. The overall rate stays 0.30x.
- I didn't use the critic's two alternatives. ffmpeg `minterpolate` mci was the r03/r04 engine, and it tore. 0.4x would reach the POV car's A-pillar (source 2.45 s) before the band shuts.
- Measured in the render: the global motion is a steady 1.2 ± 0.1 px per frame (quarter resolution), with a smooth ease where the camera itself slows. There is no three-frame pattern; r05 alternated 0.0–0.7.

**Busted grade: real blacks.** The curve is now `[0,.14,.33,.52,.66,.77,.86,.92,.96,.99,1]` with contrast 1.22. It replaces r05's toe-lift (`[0,.2,.4,…]`, contrast 1.15), which sat the shadows at about .15 grey: the milky look. I tested the critic's exact curve (`[0,.10,.27,…]`, contrast 1.3) first. It sends everything under an input of about .11 to black, and the officers (.07–.11) vanished into the wall. Mine crushes everything under about .07 (the dark wall, the street, the shadows) to true black and keeps the officers as dark-grey figures. The upper mids lift, so the mural and the white cruiser pop.

**Selective colour: only the police lights burn red and blue.**
- `lights.py` bakes a multiply layer from the slow clip (`assets/clips/b1-s014-lights.mp4`): white everywhere except on the emitters. It works like this:
  - It tracks the light bar (the biggest hot-blue blob, smoothed over time) and gates the rows around it.
  - It keys bright (value .68–.88), saturated, red or blue pixels.
  - It drops any blob whose 90th-percentile value is under .8. Lit red mural paint peaked at .63–.75; the light bar and tail lights reach .84–1.0.
  - It colours the emitters in their own hue at full brightness, saturated x1.6.
  - It adds a clean round halo in the emitter's colour (normalised convolution, σ 11, capped at .5). The capture's own lens halo was blotchy and made a blue smudge in the first r06 capture, so it is keyed out.
- `index.html` stacks the layer over the mono slow clip with `mix-blend-mode: multiply`, using the same box, push and shake. Its opacity is drain × (0.85 ± 0.15 at 1.6 Hz), in phase with the bloom pulse, so the bar and the word's light breathe together.
- This replaces the critic's static clip-path. The light bar travels about 150 px vertically, and further across, as the camera passes, so a fixed inset would lose it.

**Both: the band opens.**
- `bandOpen` 680 → 820, `bandHold` 620 → 760 (about 1.42:1) and `bandClamp` 760 → 880. Wasted's bars are 580 / 580 at the hold.
- Busted's band moves to centre 930 (`bandCenter` per variant). At the hit, the push (1.08) times the punch (1.045) puts the dashboard's top edge (source y about 1350) at about y 1400. The clamp's bottom edge is at 1370, which leaves a 30 px margin; the roof stays far above. I checked frames 35–42 at full size: the band edges show only the mural and the street.
- Wasted's 16:9 plate box (`-305, 538, 1560×878`) already covers y 538–1416, so the minimap and the HUD stay outside the visible columns.
- The kicker and stars are now placed relative to the band: `barMetaGap` 76 px above the held top edge (Wasted y 504, Busted y 474). It replaces the fixed `barMetaY`.

**Busted: the word moves to the band's lower third (`lockupY` 1020 → 1090).** In the first r06 capture (1020), the 250 px dark band sat right on the cruiser's trunk. With the crushed grade, the brightest thing in the frame became a grey slab, and the hero read murky. At 1090, the officers, the light bar, the trunk and the red tail lights play above the dark band. The band covers the bumper and the street, which are already black, so the ground costs nothing.

**Busted lead (0–1.2 s): brighter and tighter.** The lead grade is brightness 1.25, contrast 1.05, with a push from 1 to 1.08; the slow push continues from 1.08 to 1.14, so the ramp is seamless. The drain starts from the lead's grade, so the ramp has no exposure jump. I tried the critic's brightness 1.15 / contrast 1.15 first. It measured darker than no grade at all (median luma .122 against .157), because contrast pulls a dark plate's mids down. Now the median is .161 / .169 / .141 at frames 0 / 18 / 34 (r05: .157 / .161 / .133), and the frame is 8% tighter on the mural. I didn't use the critic's other option, `data-media-start` 0.4: it moves the slow segment past the A-pillar.

**Wasted (passed) gets the critic's three small fixes.**
- **Sheen:** the glint is now 9% of the word's width (was 36%), with a 5-stop soft profile, a peak of .45 (was .88) and colour `#FFD2C2`. `sheen` is now an object in CONFIG: `{color, peak, width}`. Checked at 2.6, 2.73, 2.8, 2.87 and 3.0 s: the S and T keep their red ramp and the glint reads as a kiss of light.
- **Strip:** the 1 px hairlines are gone. The feather is 16% (two steps: .4 at 7%, .68 at 16%), and the strip is 250 px tall (was 220), so the flat core stays about 170 px.
- **The aim reticle in the lead is gone.** `paintout.py` bakes `assets/clips/w0-s119-lead.mp4` (s119 vertical from 0.8 s, 1.4 s long). The reticle is not fixed: it drifts about 40 px and grows from a radius of 21 to 33 px as the gun fires. A fixed delogo box would miss it, or smear a 100 px patch. So each frame finds the ring with a band-minus-outline ring filter at radii 16–37, median-filters the track over 3 frames, and inpaints only the ring (Telea). Checked on 21 crops: no ring, only a faint soft seam under the smoke at real speed.

**Kept on purpose:**
- The concept, the shots, the hit, the second beats and the timing.
- The kicker "VICE CITY · LEONIDA". The critic called it filler in a nitpick, not a fix. It's a real place and the creator's slot. Wasted passed with it, and r04's replacement (a rule) was read as a text cursor.

**Checked in the render (r06, captured three times).**
- `hyperframes check` passes. Two long-standing warnings (file size, nested `#ov`) and two expected infos (the masked kicker's char mask, the dark band sliding off-canvas on exit). Contrast passes 80/80.
- 150 frames each.
- Wasted's slow motion was measured in the band: a smooth 0.6–0.9 px per frame, the same as r05.
- No reticle, no HUD, no roof or dash in the band. No font fallback (Archivo renders).
- `bg:none` (Busted webm) composited on a test colour shows the bars, the feathered dark band, the lit word and the stars, with no footage, no light layer and no grade.

**Hero time: 2.8 s.**
- Wasted: the SUV on its side mid-flip, with the glint crossing the S, the shooter at bottom-left and the kicker above the band.
- Busted: five full stars over the band, the officer and the suspect at the mural, the light bar burning blue and the tail lights red above BUSTED.

**Unresolved / watch.**
- Early in Busted's slow motion (1.4–2.0 s), the light bar flares as a strong blue oval. That's deliberate (the capture flares there too). If it reads heavy, lower the halo cap in `lights.py` (`glow … * 0.5`).
- The Wasted `s119` capture is also slightly uneven (a ±10% frame-diff ripple). It doesn't read as judder and the critic passed it, so it isn't re-baked. The cadence option would apply if needed.
- The Busted lead is a POV through a windshield, so the roof and dash stay in the first 1.2 s by the nature of the shot. They are tightened and brightened, not removed.

## v2 round 5 (superseded in part by round 6: band size, ground strip, Busted grade / word position / slow bake / lead, sheen, kicker position)
The round-4 critique scored both variants 7 with two defects: slow-motion ghosting (blobbed hands in Busted, a doubled car body in Wasted) and the POV car roof wedge showing at the top of Busted's band during the bar slam. Its biggest gap: a nearly square 1080×900 band (1.2:1) with 490 px of dead black above and below read like a square clip pasted into a vertical frame, and the feathered strip never read as the brief's dark band. This round fixes both defects, then the band geometry, the ground and the Busted grade. The concept, the shots, the hit and the second beats are kept.

**Defect: slow-motion ghosting. Fixed with a new optical-flow bake.** The critic thought the bake was a blend. It was already ffmpeg `minterpolate` mci (motion-compensated), but its block matching tears and doubles fast motion at a 3.3x stretch, and that read as ghosting. The critic's suggested mci settings were the ones already in use, so I replaced the engine. `slowflow.py` (OpenCV, run by `bake-slow.sh`) works like this:
- It computes dense DIS optical flow, forward and backward, between each pair of source frames, at half size so large game-camera moves resolve.
- It warps both neighbouring frames to the in-between time.
- Where the two warps agree, it blends them by time. Where they disagree (occlusions, the car turning over), the warp from the nearer frame with the more consistent flow wins outright. Nothing is ever drawn twice.

Every output frame is either an untouched source frame or a new in-between. In side-by-side crops at the frames the critic named, the flipping SUV keeps one coherent body (old: a smeared, doubled body) and the officers' hands stay hands. Measured: no repeated frames (minimum frame-to-frame difference 6.6 for Wasted, 1.2 for Busted). The rates stay 0.30x. Busted can't go slower than about 0.33x without reaching the A-pillar at 2.45 s source, and the cleaner bake removes the reason to speed up. `bake-slow.sh` falls back to the old minterpolate path if OpenCV isn't installed.

**Defect: the roof wedge in Busted's bar slam. Fixed.**
- The bars no longer grow from zero over the shot. On the hit frame they cut in at a 760 px band, then clamp to 680 over 0.3 s, expo.out. The clamp keeps the "bars clamp shut" character, and no frame shows the top of the full-height frame.
- The slow file is framed exactly like the lead (y 0, was 180 / 180). The ramp is now seamless, and the POV car's roof (source y ≤ 330) and dashboard (≥ 1350) stay behind the bars at every band height, including the 760 clamp with the impact zoom and shake.
- Checked frames 35–40: the top of the band shows only the mural.

**Biggest gap: the band is now cinematic.**
- `bandOpen` 960 → 680 and `bandHold` 900 → 620: 1080×620 is about 1.75:1, at y 650–1270.
- Wasted's slow plate is re-boxed. The critic suggested `{x:-200, y:560, w:1480, h:833}`, but at that size the game minimap (it ends at source x 332, not 166 as estimated in r04) showed as a grey rounded corner at the band's bottom-left. It is now `{x:-305, y:538, w:1560, h:878}`, which puts the minimap and the weapon/stars HUD just outside the visible columns, even before the push. The flip and the shooter both stay in the band.
- **The bars hold type.** Wasted: a 26 px `.t-label-wide` kicker, "VICE CITY · LEONIDA" (a real place from FACTS.md), tracked .34em at 70% white, centred at y 582 in the top bar. It rises in char by char through a mask (22 ms stagger) at 1.5 s and blurs out with the word. Busted: the five wanted stars take the same slot (40 px, 20 px gap), so its band holds the word alone and the arrest gets the room. This was a design choice. With a 620 px band there is no room for a word + stars lockup and the arrest; in a 220 px dark band the stars would cover the officers.

**The dark band now reads as the GTA band.**
- `#strip` is 220 px tall, with a flat `rgba(0,0,0,.68)` core and an 8% feather (was a 58% core with a 22% feather), plus 1 px `rgba(255,255,255,.10)` hairlines at the top and bottom.
- The 128 × 3 px red rule is dropped (it read as a text cursor). `rule` still exists in CONFIG, set to `null`.

**Busted grade: a tone curve, not the critic's numbers.** The critic suggested gamma .85 / contrast 1.45 / brightness 1.0. I measured the plate first: its median luma is about 0.10, and the people sit at 0.07–0.11. Contrast 1.45 sends everything under 0.155 to black, so the first r05 render lost the whole arrest. The officers, the suspect and the left half of the band went solid black.
- The fix: the `gamma` grade is replaced by `grade.curve`, an 11-point toe-and-lift tone curve (`feComponentTransfer type="table"`, eased in from identity with the drain): 0→0, .1→.2, .2→.4, .3→.55, … 1→1. Contrast 1.15, brightness 1.0 and tint .05 sit on top.
- The result: true black stays 0 (everything under about 0.03 clips), as the critic wanted. The officers' faces and the suspect read, and the light bar and tail lights burn white and bloom. There is no grey mush, because the curve keeps a hard toe where a plain gamma lifts the blacks.
- The BUSTED fill is recast as light, as asked: `#FFFFFF 30% → #CFE0FF 58% → #6FA0FF 82%`, glow `#3B82FF`, bloom base .5 (swing .1 at 1.6 Hz).

**Hit.** `Look.chroma` is down from 18 px / 0.5 s to 8 px / 0.25 s. The flash, the shake and the tracking slam carry the hit.

**Checked in the render (r05, captured twice).**
- `hyperframes check` passes. The two lint warnings are the long-standing file-size and nested-`#ov` notes. The two layout infos are expected: the masked kicker's char mask during its rise, and the dark band sliding off-canvas on exit.
- Contrast passes 80/80.
- 150 frames each.
- No HUD in the band, no reticle in the slow-motion, no font fallback (Archivo renders). The kicker is sharp and unclipped at full size.
- The officer's face, the suspect's head and the light bar sit above Busted's dark band throughout the hold.
- `bg:none` (Busted webm) composited on a test colour shows the bars, the dark band, the lit word and the stars in the top bar.

**Hero time: 2.8 s.** Wasted: the SUV on its side mid-flip, with the glint crossing the word, the shooter at bottom-left and the kicker above the band. Busted: five full stars in the top bar, the officer and the suspect at the mural above the band, and the light bar blooming.

**Unresolved / watch.**
- The flow bake still leaves small warp scraps at a few occlusion edges, for example the SUV's open door at the left edge of the band around 2.6–2.9 s. They are much smaller than the old doubles and read as motion smear under the grain.
- The Wasted lead-in (real speed) still shows the game's aim reticle near the frame centre for 1.2 s. It is cut away at the hit.

## v2 round 4 (superseded in part by round 5: band size, ground strip, rule, Busted grade / framing / bars, chroma, slow-motion engine)
The round-3 critique scored both variants 7. It said the hit is excellent, but the 4.5 s hold was one static composition: a flat-lit, centred word parked on the subject, over smeary slow motion, with about 1160 px of dead black. It also flagged one defect: about 7 frames of pure black at the tail. This round keeps the concept and the hit, and fixes the hold.

**Defect: the black tail.** The hold is cut from 4.5 s to 3.1 s (out 5.7 → 4.3, close 5.95 → 4.5) and `end = close + closeDur` = 5.0 s, so the comp ends while the band is still shutting. The last frame is a 160 px slit of image, never pure black. 150 frames.

**Ground: the dark strip.** A full-bleed feathered strip (`rgba(0,0,0,.58)` flat over the middle 56%, with a feathered top and bottom) is centred on the lockup: 329 px tall for Wasted, 372 px for Busted. It slides in from x −1080 over 0.26 s, expo.out, starting 0.08 s before the hit, with 40 px directional motion blur. It exits to the right (0.34 s, power3.in) just after the type blurs out. It replaces the r03 radial spot. It reads as the GTA band without copying the GTA type.

**Light.**
- **Fill.** The fill is widened to `#FF8A73 → #FF3B2E → #B8160E` (Busted: `#A9CBFF → #4C8DFF → #1E54DC`). The stops are moved to 24 / 52 / 79% of the word box, because the 1.16em line box hid the top and bottom of the ramp: in r03 only the middle of the gradient landed on the caps.
- **Bloom.** The bloom is the `Look.bloom` recipe (1 px white core, 14 / 42 / 110 px in the word colour), rebuilt as `drop-shadow`s on `#glow` so it follows the slam. A `text-shadow` would be cancelled by `Look.fill`, which sets each glyph's shadow to none. Strength .5 for Wasted. For Busted, the pulse base is raised to .32 (±.12 at 1.6 Hz).

**Second beat (Wasted).** A sheen sweeps across WASTED. I first used the kit's `Look.sheen`. Its band is 24% of a 3W layer, so mid-sweep it washed half the word pinkish-white, which read as a fade, not light. It is now our own narrow glint on the fill's sheen layer: 12% of 3W, warm white `rgba(255,238,232,.88)`, swept left to right in reading direction, 1.0 s, power1.inOut. It is on the word for about 0.3 s. The kit is untouched.

**Rule instead of filler.** "VICE CITY · LEONIDA" is dropped. A 3 × 128 px `#FF3B3B` rule with a soft red glow draws on from the centre at 1.62 s (0.4 s, expo.out), 36 px under the caps, inside the strip. `label` still works in CONFIG; it replaces the rule.

**Using the black.** The band opens to 960 px (was 760) and tightens to 900 (was 700). The meta (rule or stars) moves from the lower black bar into the strip under the word, as one lockup.
- **Wasted framing.** The 16:9 master is now 2000×1125 at (−460, 400). The minimap stays left of the visible columns (from 23%) and the top-right HUD stays right of them (to 77%).
- **Busted framing.** The footage is shifted 180 px down. The lockup sits at y 760 over the mural, so the arrest is no longer under the type. `bandCenter` is now per variant: Busted's band sits at 1010 (50 px low), so the POV car's roof edge, which showed as a dark wavy wedge at the band's top-left, stays behind the top bar. The dashboard stays behind the bottom bar.

**Slow motion re-baked.** `bake-slow.sh` already used `mi_mode=mci` in r03; the smear the critic saw was mci's block tears on a 3.3x interpolation of very fast motion. Test bakes on s119 at 0.3x compared three setups:
- default epzs search;
- `me=umh` with `search_param=64`;
- `obmc` with 8 px blocks.

All three tore the same way. What helped was **running the motion search at 2/3 size** and scaling back with lanczos. The camera's moves then fall inside the search range, and the tears drop clearly, for a barely visible loss of fine detail under the mono grade and grain. Other changes:
- `scd=none` stops scene-change fallback frames.
- The game's aim reticle (a ring at the centre of the s119 frame) is painted out with `delogo` before the interpolation. It had sat next to the S of WASTED.
- Busted moves from 0.21x to 0.30x, as the critic asked, and ends at source 2.34 s, before the A-pillar.

Measured: no repeated frames (minimum frame-to-frame luma difference 5.2 for Wasted, 0.9 for Busted).

**Busted grade: a deliberate deviation from the critic's values.** I tried brightness 1.2 / contrast 1.35. With the dark strip, it crushed the dusk plate: the officers and the suspect went fully black and the arrest disappeared. Gamma lifts the mids without lifting the blacks, which a CSS brightness/contrast chain can't do. So the grade is now an SVG `feComponentTransfer` gamma 0.65 (`url(#lift)`, driven through the drain like the other filters), then brightness 1.05 and contrast 1.32. The blacks are deep (no milky grey) and the officer, the suspect and the car read.

**Checked in the render (r04, re-captured 4 times).**
- `hyperframes check` passes (0 layout issues, 0 motion errors).
- 150 frames each.
- No HUD in the band, no reticle, no font fallback.
- The word is 760 px wide (88% of the safe width). All type sits between y 670 and 1030, inside the safe zone.
- The last frame is a closing slit, not black.
- `bg:none` composited on a test plate shows the bars, strip, lit word and rule, with no footage effects.

**Hero time: 2.8 s.** Wasted: the SUV mid-flip, with the glint crossing the middle of the word. Busted: the full five stars over the mural, with the officer, the suspect and the police car below.

**Unresolved / watch.**
- Interpolating a fast flip at 3.3x still leaves a few small tears on the SUV edge and the road line in some frames; they are much fewer than in r03.
- Busted's suspect moves fast at the left edge and still smears in slow motion.

## v2 round 3 (superseded in part by round 4: timing, band, spot, label, grade, rates)
The owner rejected the v1 design (rounds 1–2) as "basic, not professional or clean". v1 was a thin smoked band with Barlow Condensed on soft, old 1080p plates. This round is a rebuild from scratch. It keeps the component's job (the fail sting), its real content (WASTED / BUSTED, the place line, five wanted stars that clear on arrest) and v1's hard-won lessons: pre-baked slow motion (`data-playback-rate` below 0.6x judders), one impact frame rather than two hits, the word landing on a frame boundary, no Pricedown and no GTA logos.

**What is new and why.**
- **Footage.** 4K-sourced `assets/shots` replace the old `assets/plates`. The slow-motion files are rebaked from the shots with `minterpolate` (motion-compensated, no repeated frames) into `assets/clips/`. The v1 1-2-1 frame blend is dropped because it softened the image. Wasted's slow file comes from the **16:9 master** (`s119-…-h.mp4`), shown at 1778×1000 and shifted (x −178, y 560), so the band is a real wide frame. The game HUD (minimap bottom-left, stars and ammo top-right) falls outside the band. Busted's comes from the 9:16 shot (`s014-…-v.mp4`), shifted 160 px down so the car roof and dashboard of the POV fall into the bars and the band frames the mural and the arrest. The A-pillar that crosses at about 2.45 s source is never seen: the band has shut by source 2.33 s.
- **Grade.** The slow file drains over 0.45 s (saturation 1 → 0, then brightness, then contrast).
  - Wasted: hard black-and-white, brightness 1.06, contrast 1.3. The image stays bright and readable; only the spot behind the word darkens it (the r02 critique said the reference keeps a bright B&W image).
  - Busted: the dusk plate is lifted (brightness 1.5, contrast 1.16) with only a 0.08 cold tint, so blue stays the only colour in the frame (the r02 critique said a navy duotone killed the blue word).
- **Letterbox.** Band 760 px tall at the hit (bars 580 px each). It tightens to 700 px through the hold (sine, from 1.8 s to 5.95 s), then shuts with `power3.in` from 5.95 s to 6.45 s and holds black to 6.7 s, so it cuts cleanly to the next clip.
  - Wasted: the bars arrive with the hard cut.
  - Busted (and every `bg:none` render): the bars clamp in over 0.34 s, expo.out.
- **Type motion.** Tracking is animated as a per-glyph x spread (`Look.split` by chars), not `letter-spacing`. `hyperframes check` rejects `letterSpacing` tweens because they snap to whole pixels and stutter. The slam runs 0.22em → 0.045em over 0.6 s, expo.out. Through the hold the word drifts to 0.06em tracking and 1.035x scale, so the long hold stays alive without a second beat.
- **Busted only.** The glow pulses at 1.6 Hz like a light bar (blue, alpha .12–.36; the word itself stays steady). The five stars pop in at 1.62 s (scale + opacity, 60 ms stagger) and empty right to left from 4.0 s, 0.16 s apart. The hollow state keeps a 2.4/24 stroke at 46 px, which stays visible at phone size (the r02 critique said v1's hollow stars disappeared).
- **Exit.** The type blurs out (`Look.exit`, 0.42 s, from 5.7 s), then the band shuts.
- **Finishing.** `Look.install` (grain .15, vignette .45) on plate renders only. In `bg:none` mode there is no footage, grade, flash, shake, grain or vignette. The bars, the spot (at 80%), the word and the label or stars remain.

**Mid-round fixes (same round).**
- The first check failed on the `letterSpacing` tween, so tracking moved to the per-glyph spread.
- The hit moved from 1.5 s to 1.2 s so the slam lands inside the 1.5 s entrance sheet. This dropped the extra lead-in shots (`s113` Lucia firing; `s096` police street): each would have run under 0.8 s, which is faster than the cutting rule.
- The first Busted grade (brightness 1.1, tint .16) was muddy navy, so it was lifted and neutralised.
- The glow was cut from .34 to .24 after the first snapshots looked like neon soup.
- The flashes were lowered (Wasted .5, Busted .45), and the word now shows at 55% opacity on the hit frame itself, so the flash frame is never empty.
- The duration went from 7.0 s to 6.7 s, which leaves only 0.25 s of black at the end.

**Checked in the render (r03).**
- `hyperframes check` passes (3/3 contrast checks). The one remaining warning is the usual nested-`#ov` sub-composition note.
- The word measures x 158–916 and y 912–1002 at 2.7 s: 88% of the safe width, optically centred on the band (957 vs 960).
- Label and stars sit at y about 1386–1432, inside the safe zone.
- No clipped glyphs and no font fallback (Archivo renders).
- No frozen frames: the slow files run 5.9 s against 5.5 s of use.

**Hero time: 2.7 s.** Wasted: the SUV mid-flip in slow motion under the settled word. Busted: the police car and the arrest with all five stars.

**Unresolved / watch.**
- The slow-motion SUV flip is motion-blurred by nature, so the band reads as death-cam blur rather than tack-sharp.
- Busted's arrest figures are dusk silhouettes. The shot is the only arrest in the library.

---

# v1 history (rejected design, kept for its lessons)

## Round 1

**The format comes from the real screen.** The reference frame `research/gta6/refs/wasted-screen/Xfk0zviSStA-118` (2.0M views) is the GTA V sequence: a desaturated frame, a dark translucent full-width band at about 39–58% of the height, and a red word inside it. That band-and-word layout is what makes the sting read instantly, so we keep it. The 9:16 band sits at y 690–1070 (its centre is at about 46% of the height, inside the safe zone). The other refs (a GTA Advance yellow "wasted!" and a creator's "clapped…") show the cheap end: novelty fonts, outlines and logo bugs. We drop all of those.

**Our own type, not Pricedown.** The word is Barlow Condensed 900 caps, tracked .035em, auto-fit to ≤780 px wide (about 72% of the frame). Its fill is a subtle top-to-bottom gradient in one hue, so it looks premium rather than flat. The sub-line is Inter 600 caps tracked .42em at 28 px, like Rockstar's wide-tracked official labels, with two short hairline dashes. Only 2 type sizes are used.

**The band is smoked glass, not a flat black bar.** It is 62–70% ink with `backdrop-filter: blur(14px)`, so the slow-motion footage still moves behind it softly, and it has 1 px hairlines top and bottom. On the slam, the hairlines flare briefly to 55% white: a small impact detail.

**The motion follows DESIGN.md's stamp rule.** At the hit, the footage drops to 0.3× speed (the real slow-mo, cut from the same clip so it is continuous) with a 0.05 s white flash, and the colour drains over 0.7 s. There is a slow 1.03→1.10 push-in with a −1.1° roll (the GTA death-cam drift). The band wipes left→right (0.42 s, expo.out), then the word slams in over 4 frames (scale 1.16→1, blur 12→0), with a 5-step shake of ≤7 px on the footage only, so the text stays readable. The word then drifts to 1.035× while it holds. At 6.5 s everything lifts and wipes out to the right, and the plate dims, so the loop is clean.

**The two variants differ in content and style.**
- **Wasted:** a pure B&W grade, Wasted red (#F2493D→#B8221C) and a "VICE CITY · LEONIDA" place line (a real place from FACTS.md; the creator replaces it with their own clip label).
- **Busted:** a cold blue-tinted mono grade (a `mix-blend-mode: color` layer), police blue (#3B82FF family, the DESIGN.md police colour), and blue-only police-light strobes from the left/right frame edges, alternating at 1.7 Hz. The strobes are blue only to keep one accent. Five wanted stars land under the word, then empty right-to-left from 3.7 s (the wanted level clears on arrest).
- The word colour is the only accent in each frame.

**Plates (deviation from the manifest's suggestion).** The manifest suggests p08 (scuffle) / p10 (police car), but those shots last under 1 s before a cut, so they can't carry a slow-motion hold.
- Wasted uses p09: the gameplay chase is continuous from 0 to 4.1 s, and the police truck flips over the camera at about 2.3 s. The hit is at source 2.3 s, and the slow segment runs 2.3→3.98 s, before the cut.
- Busted uses p04: the POV drives past police cars and officers pinning someone to the mural wall, continuous from 0 to 4.43 s. The hit is at source 2.6 s, and the slow segment runs 2.6→4.28 s, so the arrest plays in slow motion under the word.

**Transparent mode.** With `bg: "none"`, the plate, tint and dim layers are hidden. The band (its backdrop blur works on the creator's own footage only once composited in their editor, so it renders as a tint), word, sub-line or stars, vignette, flash and siren remain. The README tells creators how to match the grade and slow-mo at the 1.4 s mark.

**Mid-round fixes.**
- The first render's word box used line-height .78, which clipped glyph edges under `background-clip: text`. It is now line-height 1 with negative margins.
- The Busted grade was too dark on the dusk plate (brightness .86 plus a full vignette), so it now uses brightness 1.14, contrast 1.1 and a vignette at .7.
- Busted was retimed so the slow segment covers the arrest.
- The stars went from 46 to 54 px for phone legibility.
- The plates were re-synced after the shared set was re-cut without letterbox bars.

## Round 2

The round-1 critique (v0 6/10, v1 5/10) said the still was decent but the motion undercut it: the slow motion stuttered, and the flash fired 0.8 s before the word. This round fixes both defects first, then the gaps per variant.

**Defect 1, stepped slow motion: fixed with a pre-baked slow segment.** `data-playback-rate=0.3` repeated each source frame 3 to 4 times (about 8 fps). The slowed part is now its own file, baked by `bake-slow.sh` (ffmpeg `minterpolate` mci/aobmc motion interpolation at 30 fps, plus a light 1-2-1 `tmix` that reads as the death-cam motion blur in the GTA V reference). It plays at rate 1 and starts on the source frame right after the real-speed lead-in, so the cut at the hit is seamless. Measured: no repeated frames anywhere in either slow file (the smallest frame-to-frame difference is above zero on every frame). `slowRate` stays in CONFIG as metadata for the bake.
- Wasted: `assets/slow/w0-p09-slow.mp4` = p09 from 2.30 s at 0.28x (2.30 to 3.98 s, before the 4.1 s cut).
- Busted: `assets/slow/b1-p04-slow.mp4` = p04 from 1.00 s at 0.15x (1.00 to 1.90 s, before the car's A-pillar enters at about 1.93 s).

**Defect 2, two hits: now one impact frame.** The white flash at the hit is gone. The hit (1.0 s) only changes speed, drains the colour and starts the death-cam push. The word lands at hit + 0.55 s, snapped to a frame boundary so the 1.12x frame is really rendered. On that frame, the word appears at full opacity at 1.12x, the white flash (0.2) and the 6 px footage shake start, and the hairlines flare. The word settles to 1x in 3 frames (expo.out). Checked in the render: frame 47 shows the flash and the 1.12x word together.

**Timing moved earlier: the hit is now at 1.0 s (was 1.4).** The p04 arrest needs the clean source window before the A-pillar (0 to 1.93 s), so a shorter lead-in leaves 0.9 s of source to slow. It also makes the payoff land faster (word at 1.57 s instead of 2.2 s), which suits short-form. Wasted's `mediaIn` moved from 0.9 to 1.3, so its hit is still on the same source moment (p09 at 2.3 s, the truck starting to flip).

**Flat fill, no gloss.** The word is now flat `#D8352B` (Wasted) and flat `#3B82FF` (Busted) at .94 opacity. The three-stop gradients and `background-clip: text` are gone. The word keeps the DESIGN.md soft type shadow only.

**Band: thinner and lighter, with one exception for legibility.** The band is 300 px tall (y 730 to 1030) instead of 380, filled flat `rgba(10,10,14,.40)` with an 8 px blur and no saturation cut, and 1 px hairlines at .12. A flat .40 band fails the HyperFrames 3:1 contrast gate for muted red on bright footage (measured 1.51:1, background rgb(85,85,87)); the gate needs about rgb(43,43,43) or darker behind red. So a feathered dark "core" (black .60, fading out over the outer ~22% at each end) sits inside the band, behind the word only. The band ends stay at .40 so the footage reads through, and the word passes the gate (4/4 checks). This is a deliberate deviation from the critic's flat .40 value, and it is forced by the check.

**The word sits optically centred.** The word box now hugs the cap height (margins -.204em / -.119em), so the caps are centred in the band. In round 1 they sat about 15 px low. The word is 232 px Barlow Condensed 900 (about 700 px wide, 65% of the frame), a little more modest, as in the reference.

**No filler line.** `sub` is `null` for Wasted by default. If a creator sets it, it renders at 24 px, .55 opacity, with no dashes.

**Busted gaps.**
- The siren blobs are deleted.
- The plate now starts at p04 0.0 s, so the slow segment ends before the A-pillar. The pillar no longer appears at any point in the comp.
- The grade was far too dark (frame luma about 28/255). It is now brightness 1.5 and contrast 1.06, so the mural, officers and the man being pushed off the wall read clearly.
- Bug fix: the blue tint layer sat inside `#cam`, so the cam's grayscale filter removed its colour. In round 1, Busted actually rendered as plain grey. The tint now sits outside `#cam`, at .24, so the "cold blue mono" grade exists and the blue word still separates from it.
- The stars are 46 px with a 26 px gap under the caps, so the word and stars group is centred in the slimmer band. They now clear from 4.0 s (was 3.7), so the hero frame shows the full five stars.

**Kept from round 1 (deliberate, not named as defects):** the left-to-right band wipe, Barlow Condensed 900 caps, the B&W versus cold-blue grades, the 1.03 to 1.10 push with a -1.1 degree roll, the draining wanted stars, the 6.5 s clean-out with the plate dimming so it loops, and p09 for Wasted.

**Hero time: 3.3 s.** It shows the settled word over the slowed, blurred aftermath (Wasted: the truck tumbling past the gunman; Busted: the arrest with all five stars).
