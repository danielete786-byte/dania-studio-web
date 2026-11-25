# Rank badge: decisions

## v2 concept (current, as of round 9)
- **The one idea:** the rank is a title moment cut into the edit. A giant sunset numeral slams in on a cut, lit by the scene, then flies into the top-left corner and lives on as a type-only rank badge while the clip plays. There is no card anywhere. Both variants are full-bleed 9:16 and do the manifest's "land, then dock" job, with a real style difference:
  - **v0 "Hero numeral → dock"**: Archivo wide 900, a night montage, set like a film poster under Jason's face.
  - **v1 "Corner badge"**: tight Inter display 800 (tracking −0.045em), a police-chase edit, a slot-reel numeral that docks into a full corner badge (numeral, hairline, series label, title, progress ticks).
- **Shots and cuts:**
  - **v0:** `s055` night truck 0–0.33 (media 1.0) → **cut 0.33 (slam)** to `s098` Jason as the fireworks blast erupts, a pre-rendered speed ramp (`assets/clips/s098-ramp.mp4`, entered at its frame 2, media 0.07), 0.33–2.02 → **cut 2.02** (mid-dock) to the `s039` club crowd, 2.02–3.06 (media 0–1.04) → **cut 3.06** to `s014` at the mural police stop, 3.06–5.2 (media 0.06–2.2) → **cut 5.2** to the `s027` sunset dock with string lights, 5.2–7.0 (media 0.04–1.84).
  - **v1:** `s096` police street, 0–0.72 (media 0.46–1.18 = source frames 13–34: the green car whips past, then the cruiser drifts in) → **cut 0.72 (the slam)** to `s119` gameplay shootout (media 0.35–1.89, the SUV charging under fire) → **cut 2.26, a punch-in on the same take** (media continuous from 1.89, framed 1.13× tighter, mid-dock) → the SUV's real rollover at 2.8 → **cut 4.43 (flash)** to the `s011` Vice City highway (media 0–2.57).
- **Where the type sits:**
  - **v0 hero:** a poster stack under Jason's face (face y ≈ 300–760): kicker cap ≈ 838, numeral ink ≈ 896–1310, title baseline 1408, all on the dark of his jacket with a soft lower scrim (peak .40). The face is never covered.
  - **v1 hero:** centred by ink on the safe axis (x 504) in the upper third: numeral ink y 250–765 in the building band, the item title "SUV ROLLOVER" 42 px under the ink (cap ≈ 815, baseline ≈ 873) on the numeral's measure, under a graduated top shade (1260 px: .6 → .55 at 20 % → .32 at 60 % → .07 at 86 %). No hero kicker: at ink top 250 there is no safe room above, and the series label reads in the badge. The charging SUV sits under it.
  - **Both docked:** numeral ink top-left at (72, 266) in v0 and (72, 250) in v1, in a soft top-left corner shade. The label's cap top sits on the numeral's ink top, the progress rule on its baseline, the title centred between.
- **Hero size and face:**
  - v0: Archivo wide 900, numeral 580 px (ink ≈ 418 px tall, ≈ 76 % of the safe width), docks to 168 px. Title Archivo wide 800 72 px (hero), 46 px (bug). Kicker 26 px Rockstar date style.
  - v1: Inter 800 display, numeral 700 px (ink ≈ 515 px tall, ≈ 607 px wide = 70 % of the safe width), docks to 150 px. Hero title Inter 800 ≈ 80 px (−0.012em), sized so its ink spans the numeral's; badge title Inter 800 50 px, label Inter 600 22 px tracked .3em.
  - One family per variant. The Leonida core gradient is on the numeral only (diagonal in v0, vertical in v1 so the reel reads lit from above).
- **The payoff hit:**
  - **v0 at 0.33 s, on the cut to the blast:** scale 1.42 → 1 and blur 26 → 0 stamp, the blast's light (a warm radial burst from the explosion at the upper right, peak .6, over a thin even #FFBB95 lift at .08), `Look.impact` 12 px shake and 1.045 punch, 16 px RGB split, one leak in the blast's pink and amber, and a pink bloom that flares and settles. The dock landing (2.29 s) gets a second, smaller light moment: a sheen and a bloom flare.
  - **v1 at 2.8 s, the SUV's real rollover:** in-picture impact (flash .26, 8 px shake), 10 px RGB split, a 1.09 → 1 numeral punch, a sheen, an orange bloom flare and a tick pop on the current segment. The reel's slam on the 0.72 s cut is the entrance hit (flash .45, shake, chroma, the leak).

## v2 round 9 (fix round; hero 0.9 s; v1 only)

The r08 critic scored v0 8/10 (won the blind pick) and v1 7/10. No defects, no hard caps. Biggest gap: v1's hero was undersized (~54 % of the safe width), sat on s119's soft opening pan, and its title was fully readable for only ~0.6 s; a lone "#" floated over an empty slot for ~0.3 s and the slam landed 0.17 s before the cut. Hero time stays **0.9 s**: v0's frame is Jason's sharp face before his head turn at 0.93 s, and v1's is the landed "#2" and title over the charging SUV (source frame 15, a sharp one).

**v0 is locked, so it is untouched.** `sticky_status.py` has v0 LOCKED (8 in r08, render unchanged), and the r08 verdict lists no v0 defect. I built the two v0 fixes (one measure: numeral 680 px with the title and kicker fitted to its ink width; a night tail, `s055` as a bookend instead of the `s027` sunset), and the capture warned that v0's render had changed (SSIM 0.755). I reverted all of it. The final r09 v0 render matches r08 (SSIM 0.9945). Notes for when v0 is next opened:
- the measure fix is easy now: `inkFit()` / `inkShift()` (added for v1) fit any line's ink to a width and centre it by ink;
- the critic's `s055` media 2.2 suggestion is the wrong shot: `s055` has a hidden cut at 2.1 s (frame 63) into a blue bedroom close-up of Jason and Lucia, and Jason's forehead would sit right under the corner badge. A night tail that works is `s055` media 0–1.74 (the truck under the lamp, the dumpster smash, the pickup drifting back), with the pre-roll moved to that take's frames 52–61 so no frame repeats. `s123` is out: its gameplay reticle is on screen from frame 0.

**v1 hero: scaled, on one measure, held 1.2 s+.**
- Numeral 530 → **700 px** (ink ≈ 607 × 515 px, 70 % of the safe width).
- The hero title is no longer a fixed size. It is fitted so its ink spans the numeral's ink width (≈ 80 px; the critic's 88 px would overhang the "#2" by ~60 px, the same "two measures" nitpick v0 got). It is centred by ink, not by its line box.
- The top shade runs to 1260 px so it still carries the title (cap ≈ 815).
- The title rises **on the slam** (0.72 s), not before it. A pre-slam rise (tried at 0.4 s) put the white title over the white cruiser's roof in `s096` for 0.3 s.
- It is legible ≈ 0.83–2.1 s (the drop starts at 2.02 s; `power3.in` keeps it readable for ~0.1 s more): about 1.25 s, against the DESIGN 1.2 s hold rule.

**v1 slam on the cut, no lone "#".**
- The reel locks on "2" exactly on the 0.72 s cut, with the `Look.impact` flash .45 on that frame.
- "#" and the reel enter together on frame 0, through one wrapper (`#v1In`, blur-in 14 px → 0, scale 1.1 → 1, 0.5 s). The reel starts with its "5" already in the slot.
- I rebuilt the reel as a **ticking counter**, not one accelerating spin. The continuous version, stretched to 0.72 s, kept showing half-glyphs at medium speed: a bare pink stroke of the "4" creeping in at 0.27–0.4 s, and with row gaps, an orange arc beside an almost empty slot. Now:
  - "#5" holds while it blurs in (sharp ≈ 0.13–0.29 s);
  - a 0.11 s roll shows "#4" (≈ 0.37–0.47 s), and a 0.09 s roll shows "#3" (≈ 0.53–0.63 s);
  - a `power2.in` roll from 0.62 s slams onto "2" at 0.72 s.
  - Rolls use `power3.inOut`. One `Look.drive` sets the position, a vertical blur that follows the roll speed (0 at rest, 30 px at full speed), and the reel-drum shade (0 at rest). Rows sit 1.12 window heights apart.
  - The rank climbs the chart, 5 → 4 → 3 → 2, and every frame shows either a sharp figure or a blurred roll.
- The slam's RGB split is 0.36 → 0.24 s, so the 0.9 s hero frame is clean.

**v1 footage: the sharp frames.**
- I measured s119's edge energy frame by frame (Sobel mean over the top 1000 px). Frames 0–6 and 12–14 are the soft pan, 7–11 and 15–25 are sharp.
- `s119` enters at **media 0.35**, as the critic suggested. The slam frame is source frame 10 and the 0.9 s hero frame is frame 15, both sharp. (0.30 put the hero on frame 14, soft.)
- Holding the hero over `s096` instead isn't possible: its usable run is frames 13–34 (0.72 s) between two foreground poles, and every slow-motion interpolator smears the cruiser (r07).

**v1 dock on a cut.**
- Dock 1.48 → **2.08 s**, bug 2.48, landing 2.53.
- With the new in-point, a continuous take already puts the flip at 2.8 s, so the old 0.37 s jump cut would have moved the flip into the dock. The dock cut is now a **punch-in on the same take** at 2.26 s (mid-flight, as in v0): media continuous at 1.89, and the second half framed 1.13× tighter around the SUV (`#punch` wrapper). The flip lands at **2.8 s** (source frame 72/73), 0.27 s after the landing.
- The ticks now draw from `bug − 0.04`, so the current tick is drawn for the flip's tick pop. It was undrawn at the beat in the first r09 cut.

**v1 tail: the airliner.**
- `s011` enters at media 0 (was 0.7), so the plane only appears at the top right at ≈ 6.1 s.
- The badge exits at **6.15 s** (was 6.3; the current tick fills to 6.1), so the type is gone before the plane descends through the badge band (≈ 6.35 s on).
- A `.lk-scrim-top` at .35 (720 px) comes in on the 4.43 s cut, under its flash, so the badge reads over the bright highway sky and clouds. It leaves with the badge.

**Checked this round.**
- `hyperframes check`: 0 errors, 32/32 contrast. VS-PREV: v0 0.9945 (unchanged, lock kept), v1 changed.
- I opened both hero PNGs, both strips and the entrance sheet, and stepped v1 frame by frame:
  - 0–0.93 (every frame: blur-in, ticks, slam, title rise);
  - 1.0–2.1 (hold);
  - 2.1–2.65 (title drop, dock, punch-in cut, badge build);
  - 2.77–3.1 (flip);
  - 4.4–4.55 (cut);
  - 5.3–6.97 (tail, plane, exit).
- No repeated frames in v1 (smallest frame-to-frame difference 3.7). Inter only, no clipped glyphs, all text inside x 72–936 / y 230–1480, and no face under type.
- `bg: "none"` v1 rendered as webm and composited over green: transparent, with only the shades. The reel, slam, dock and badge are intact.
- Open: the punched-in rollover (1.13×) is slightly softer than the unscaled take.

## v2 round 8 (fix round; hero 0.9 s)

The r07 critic scored v0 8/10 (won the blind pick) and v1 7/10. One defect: v1's frame 0 (also the thumbnail) was a full-frame concrete pole. Biggest gap: v1's hero numeral sat low on busy daylight footage with no item title, and v0 lost its first 0.5 s to a murky pre-roll and a flat grey flash frame. Hero time is now **0.9 s**: v0's poster with the title fully up and Jason's face sharp (his head turns from 0.93 s, which motion-blurs the face in the source), and v1's "#2" plus "SUV ROLLOVER" over the charging SUV.

**Defect (v1 frame 0): fixed at the frame level, not just the in-point.**
- I stepped `s096` frame by frame. The renderer shows source frame floor(media × 30), so media 0.42 showed frame 12 (0.40), the foreground pole. The second pole is frame 35 (1.167), not 1.23 as r07's notes said.
- The critic's fix as written (media 0.46 with the cut still at 0.76) would have put frame 35, the second pole, on the last frame before the cut. So `s096` now plays media 0.46–1.18 (frames 13–34) and cuts at **0.72 s**. Frame 0 is the sunlit street with the green car.
- `s119` starts at 0.72 (media 0–0.98). The jump cut moved to 1.7 s with its media in-point at 1.35, so the jump is still 0.37 s and the rollover still lands at 2.78 s.

**v1 hero (biggest gap): the critic's layout, checked against the shot.**
- Numeral ink top 330 → **250**, in the building band. The top shade's 24 % stop is .40 → **.55**, and the shade now runs to 1100 px, so it carries the title too.
- **The item title is in the hero:** "SUV ROLLOVER", Inter 800, 68 px, −0.012em, 40 px under the ink, `Look.reveal` by words at slam + 0.08 (0.63 s). It drops into its masks at the dock (1.42 s), just as v0's does.
- The dock moved from 1.38 to **1.48 s** to give the added title a longer read (fully legible about 0.85–1.42 s). The numeral holds 0.55–1.48 s.
- I measured the SUV in `s119`: its roof rises from y ≈ 650 (media 0) to ≈ 430 (media 0.8) as it charges. At 0.9 s the roof is under the title. Later in the hold the dark SUV body sits behind the title and the bottom of the "2", which reads as dark ground under bright type, not as busy daylight.
- **The hero kicker is gone.** At ink top 250 there is no safe room above it (its cap would sit at y ≈ 185). Under the title it would be a 26 px label on busy daylight, which is the "near-invisible kicker" the critic flagged in v0. The series label still reads in the badge from 1.9 s.
- **Bloom:** I didn't add the critic's `Look.bloom` call. It is a text-shadow, and `Look.fill` strips text-shadows from gradient type. Instead the existing per-frame drop-shadow bloom (`glowDrive`) is raised to match v0: base .5 → .72, peak 1.4 → 1.5.

**v1 reel: no bare glyph fragments.**
- The reel starts two rows below the window (was one). Note: GSAP's `power2.in` is cubic, not quadratic, which explains why r07's first glyph crept in so slowly.
- The vertical speed blur now has a floor from the first frame. I used 24 px rather than the suggested 18, because 18 still showed the '5' top stroke as a soft bar.
- While it spins, the window is shaded like a reel drum: a 24 % fade at the top and a deeper 46 % fade at the bottom, steepest at the edge. Each figure fades up from below instead of arriving as a stroke. The shade opens to 0 as the figure stops, as before.
- Measured: the first glyph appears at 0.37 s as a faint pink haze, and 0.4–0.53 s reads 5 → 4 → 3, all blurred. It lands at 0.55 s.

**v0 pre-roll.** `s055` is trimmed from 0.5 to **0.33 s**. The slam, title and cut all moved to 0.33 s. The kicker enters at 0.03 s (blur-in 0.45 s) and the poster scrim fades in 0.4 s, so both are up by the slam. The rest of the edit moved 0.17–0.24 s earlier: dock 1.84, cut to the club 2.02, bug 2.23, cut to `s014` 3.06, cut to `s027` 5.2. The title still reads about 1.25 s.

**v0 flash: the explosion's light, in two parts.**
- I lowered the flash to .3 and warmed it as the critic asked (#FFBB95 = white with 60 % #FE8E4E). It still washed the cut frame lavender-grey. The cause was the frame itself: ramp frames 0–1 are a dark Jason **before** the blast erupts, so a uniform screen flash can only lift the frame flat.
1. The ramp now enters at **its frame 2** (media 0.07), the frame where the blast bursts in at the right edge. That costs 0.07 s of the hold, which the dock retime absorbs.
2. The uniform flash is now just a thin even lift (.08, #FFBB95). On top of it is a **directional burst**: a radial screen-light from the explosion's side (96 % 26 %), amber → orange → a faint pink tail, peaking at .6 and decaying over 0.26 s.
- The cut frame now shows warm light falling across Jason from the blast, with the fire visible.

**v0 hero placement.** The stack is lifted 60 px: title baseline 1468 → **1408** (72 px clear of the 1480 floor) and numeral ink top ≈ 896. The poster scrim moved up with it (top 820 → 760) and its peak dropped from .46 to **.40**. Jason's hands still cross the '#' at some points in the hold, because they move in the source.

**Checked this round.**
- `hyperframes check`: 0 errors, 32/32 contrast.
- I opened both hero PNGs, both strips and the entrance sheet, and stepped frames at:
  - v0: 0.27–0.4 (cut, burst, slam), 0.73–1.1 (face sharpness, which set the hero time), 1.73–2.5 (title out, dock across the cut, bug build), 3.03/3.07, 5.17/5.2, 6.4–6.97 (exit);
  - v1: 0–0.8 (frame 0, the reel, the stop, the title rise, the 0.72 cut), 0.8–1.97 (hero hold over the SUV, dock across the jump cut), 2.77/2.83 (rollover), 4.43, 6.4–6.97.
- No repeated consecutive frames in either render (all frame-to-frame differences > 0.6).
- No clipped glyphs, no font fallback, and all text inside x 72–936 / y 230–1480.
- Open: in v1's late hold (1.2–1.48 s) the SUV's light bar passes behind "SUV ROLLOVER". The title stays legible (white 800 on the dark body, with a drop shadow).

## v2 round 7 (fix round; hero 1.0 s)

The r06 critic scored v0 7/10 and v1 6/10 (hard cap: "reads as a stock template", the CapCut-style letterbox top-N layout). Defects: v0's hero shot judders (0.72× playback rate), and v1 never shows a corner badge. Biggest gap: v0's read is rushed and its dock goes dead; v1 doesn't do its job. Hero time is now **1.0 s** for both: v0 is the poster over the blast with the title fully up, v1 is the centred "#2" over the charging SUV, sparks and muzzle flash. (The run was paused mid-round; this round was rebuilt and re-verified from the r06 critique, keeping only the parts of the paused attempt that held up frame by frame.)

**Defect 1 (v0 judder): s098 is pre-rendered, not rate-slowed.**
- `assets/clips/s098-ramp.mp4` (1.77 s, 53 frames): source frames 3–33 (before the hidden cut at 1.13 s). The blast erupts at 1.0× (source 0.10–0.57, which carries the blast's camera-shake blur), then ramps to 0.39× for the hold (source 0.57–1.10), built with motion-compensated interpolation. `data-playback-rate` is gone.
- Measured on the render: from 0.5 to 2.3 s, the smallest frame-to-frame difference is 2.5 (r06 had 0.4 every 3rd–4th frame). No frame in either render repeats its neighbour (all diffs > 0.5).
- I checked the hold frames at full size: Jason's face and the fire interpolate cleanly.
- Found while checking: the last frame `s039` showed before the cut (media 1.04, next to its hidden cut at 1.07) was a repeat. `s039` now ends on 3.3 s and `s014` starts there.

**Defect 2 and the hard cap (v1): redesigned as a full-bleed corner badge.**
- This reverses the v2 "v1 is letterboxed on purpose" decision. The reason is a concrete defect (the variant never delivered a corner badge) and a hard cap (stock CapCut layout), and DESIGN reserves letterbox for jobs that ask for it.
- Kept from r06, as the critic asked: the slot reel 5 → 4 → 3 → 2 with its speed blur, feathered window, 2-frame recoil and chroma, and the in-picture hit on the SUV's rollover.
- New: full-bleed `-v` footage, all type in Inter (display 800 for the numeral, tracking −0.045em), and the hero docks into a real top-left badge: the numeral, a 2 px hairline, the series label, the title and 5 progress ticks. It holds to 6.3 s.
- The bottom dead band is gone with the letterbox.

**v1 footage (no soft or junk frames).**
- `s096` is a messy shot: a foreground pole at media 0.40, a pedestrian at 0.33 and 1.47, a second pole at 1.23. It now plays only media 0.42–1.18 (the paused attempt played 0.08–1.50, so the reel spun over the first pole and the second pole flashed through the hero).
- I tried a slow-motion cruiser drift to hold the hero longer on `s096` and rejected it: mci/aobmc, obmc/bilateral and blend all smear or block up the cruiser's nose as it drifts across the frame.
- Instead the hero holds across the 0.76 s cut onto `s119` (the SUV charging under fire, the strongest hero frame in either variant), and the dock flies across a 1.6 s punch-in jump cut inside the same take (media 0.84 → 1.25). That keeps the "dock on a cut" hand-off the critic praised in v0 and asked for in v1.
- Hero read: the figure stops at 0.55 s and holds until 1.38 s; the kicker reads from 0.04 to 1.3 s; the badge then holds from 1.83 s.
- The rollover lands at 2.78 s (s119 media 2.43, the frame the SUV heaves up; it is on its side by 2.9 s). `s119` ends at media 4.08 (length 4.10).
- The hero shade is lighter (peak .58 → .5, 1120 → 1000 px tall), so the daylight shots don't go milky.

**v0: the hero read is longer.**
- The title rises on the slam (0.5 s, 0.45 s reveal) and is fully legible from about 0.7 s. It drops at 2.02 s, so it reads for about 1.3 s (r06: 0.85 s).
- The dock moved from 1.83 s to 2.08 s, and the cut to the club from 1.83 s to 2.26 s, still mid-flight (expo.inOut 0.45 s with the speed-following motion blur).
- The kicker and title now clear in 0.2–0.22 s, so they are fully gone by the cut. The paused attempt left "NIGHTS" over the club shot for 3 frames.

**Both: the dock has a light moment and never freezes.**
- v0: on landing (2.53 s) a 0.5 s power2.inOut sheen crosses the numeral and the pink bloom flares (to 1.25, decay .3).
- v1: the rollover carries the sheen and bloom flare; the 4.43 s cut gets a flash and a smaller flare.
- Both badges drift 1 → .97 (linear, from the top-left corner) from the landing to the exit. Grain is .14 (was .11).

**v0 tail re-cut.** `s014` stops at media 2.2, before the A-pillar wedge (≈ 2.33), and cuts at 5.3 s to the `s027` sunset dock. I didn't take the critic's `s096` suggestion: it's a daylight shot with pedestrians and poles, and this list item is "Vice City nights"; the string-lit dusk dock keeps the evening mood. The push runs across the whole piece (1.0 → 1.08).

**Checked this round.**
- `hyperframes check`: 0 errors, 32/32 contrast.
- I opened both hero PNGs, both strips and the entrance sheet, and stepped frames at:
  - v0: 0.5–0.7 (slam, title rise), 2.0–2.47 (dock across the cut), 3.27–3.33 (cut), 5.33, 6.4–6.97 (exit);
  - v1: 0.1–0.6 (spin and stop), 0.8–1.6 (hero across the cut, dock across the jump cut), 1.73–2.33 (badge build), 2.7–3.07 (rollover), 4.4–4.47 (cut), 5.3–6.97 (plane pass and exit).
- No clipped glyphs, Archivo (v0) and Inter (v1) render with no fallback, all text inside x 72–936 / y 230–1480, and Jason's face is never under type.
- `bg: "none"` rendered as webm for both variants and composited over green: transparent, only the soft scrims and corner shade, and all type and motion intact.
- Open: in v1's tail, the `s011` airliner passes behind the badge at 5.9–6.5 s. The type keeps its drop shadow and the corner shade, and stays legible.

## v2 round 6 (fix round; hero 1.2 s)

The r05 critic scored v0 6/10 (lost its blind pick, hard cap for soft footage) and v1 7/10 (won). Biggest gap: "the image lets the type down": milky footage, v0's out-of-focus shots, no light in the numerals, and v1 frozen for 5.4 s. Hero time is now **1.2 s** for both: v0 is the poster over the blast, v1 is the centred "#2" over the SUV.

**Defect 1: lifted blacks. Root cause found and fixed, not just countered.**
- `Look.install` puts the grain inside its own wrapper with a z-index. That wrapper is an isolated stacking context, so the grain's `mix-blend-mode: overlay` had nothing to blend with and composited as a flat 16 % grey layer. That one cause predicts every number the critic measured: black 16 → 32 luma, whites 69 → 77, saturation down about 20 %, and v1's #000 bars at Y ≈ 33.
- Fix (in this component only; `_shared` is not touched): after `Look.install`, the grain element is re-parented straight into `#root` (z 91), where its overlay blends with the real footage. The grain texture's mean is 127.5/255, so true overlay is zero-mean: black stays black and contrast is untouched. Grain is now .11, because real overlay grain reads more strongly on type than the grey veil did.
- I did not add the critic's `contrast(1.14) saturate(1.18)` counter-grade, because it would grade the already-graded shots instead of removing the cause.
- Measured on the r06 render against the source frame at the same media time:

  | Where | Source | r05 | r06 |
  |---|---|---|---|
  | v0 `s014`, black (YLOW) | 16 | 31 | 16 |
  | v0 `s014`, YAVG | 39.8 | 54.2 | 41.9 |
  | v1 band, YLOW / YHIGH (matched crop) | 28 / 173 | 47 / 166 (critic) | 30 / 174 |
  | v1 band, saturation (matched crop) | 7.8 | about 25 % lower (critic) | 8.0 |
  | v1 bars | #000 = Y 16 | Y ≈ 33 | Y 16 top and bottom, no grain |

**Defects 2 and 3 and the hard cap: v0's footage is redesigned around the image.**
- The variant still does "hero numeral → dock", but the hero shot is now `s098`: Jason, sharp and lit, in front of the fireworks blast. The out-of-focus `s123` dashboard, the red-cap head and its gameplay reticle are gone, and so is the headless `s039` sequin torso. `s039` now plays only its first shot (the sharp purple club crowd, media 0–1.05).
- I didn't take the critic's "keep `s123`, origin 50 % 18 %, push 1.18 → 1.26" fix. I simulated that crop: at 1.26× the red-cap head still fills the bottom-left (screen y ≈ 1145–1548), because the head sits too high in the source to push out.
- The critic suggested `s098` with 1.4 s from media 0. Scene detection puts a hidden cut at 1.13 s, and media 0 is motion-blurred. So it plays media 0.15–1.11 at 0.72× (1.33 s), which also gives the blast a slight slow-motion feel.
- **The layout follows the image.** `s098` has no sky room above Jason's face, so the hero is set like a film poster: the face is above, and the numeral and title sit on the dark of his jacket, stacked up from a title baseline at y 1468. This reverses r05's "type in the sky" placement, because that sky belonged to the shot the hard cap rejected.
- The hero title is pure #FFF. The reticle defect is gone with `s123`.
- The cuts moved with it: slam 0.5, the dock cut 1.83 (mid-flight again), and the `s014` cut 2.88. The dock still starts 0.23 s before its cut and the bug type 0.44 s after the dock, as in r05.

**Light at the payoff (both).**
- Bloom is driven per frame on the numeral's wrapper (`glowDrive`): three stacked drop-shadows, never a text-shadow on the gradient type. It flares to its peak in two frames on each hit and decays to a steady base: v0 pink #FE78A6 (peak 1.5, base .62), v1 orange #FE8E4E (peak 1.4, base .5, with smaller flares on the rollover and the 4.8 s cut).
- One `Look.leak` per variant at the slam (#F84FA4 → #FEB747). v1's leak is hosted in `#stage`, so the bars stay black.

**v1: second beat and the cut (biggest gap: "freezes for 5.4 s").**
- **3.23 s, the real rollover** (`s119` media 2.48, the frame the SUV goes onto its side). I frame-stepped it: the critic's 3.35 s is 4 frames after the tip. The beat adds an in-band impact (flash .25, 7 px shake, 1.025 punch), a 10 px RGB split, a 1.045 → 1 numeral punch from the picture edge, a glow flare, and a current-segment tick (120 ms white flash with a 1.8× height pop).
- **4.8 s cut:** an in-band exposure flash (.32), a second sheen across the figure and a glow flare.
- The lockup also breathes: it grows 2.5 % from the picture edge, linear, from 1.1 s to the exit.

**v1 composition (empty right half of the top band).**
- I chose the critic's first option: the numeral goes from 450 to 560 px and is centred on x 504 (ink 71 % of the safe width, so it now meets DESIGN's 70–88 % rule). The baseline gap goes from 36 to 22 px, so the ink top stays at y 242.
- At that size there is no safe room above it for the kicker, so the label moves under the picture. The bottom band now stacks, all centred: label (cap y 1310), title (cap ≈ 1361) and the progress rule (≈ 1453).
- I didn't take the "/5" option. It would add a fourth type size to the frame (DESIGN allows 3).
- The reel window now ends exactly at the picture's top edge. At 560 px its line box reached 26 px into the picture, and the spinning rows painted over it, which I caught at 0.4 s on the first r06 capture.

**v1 footage defects.**
- **Minimap:** `s119` is cropped 1.26× from the top-left corner. The minimap sits in the bottom-left (band y ≥ 489), so it leaves the frame, while the SUV (top-left) and the rollover stay. The critic's top-right origin would have cut the SUV off on the left during the roll. The -h source is 1920 wide, so the crop is still downsampled and sharp.
- **Roofline:** `object-position` can't help, because a 16:9 shot in a 16:9 band has nothing to crop. `s014` is scaled 1.28× from the bottom, so the black car roof leaves the band's top edge. The windscreen pillar and the mural stay.

**Checked this round.**
- `hyperframes check` passes with 0 errors.
- I opened both hero PNGs, both strips and the entrance sheet, and pulled frames at:
  - v0: 0.5–0.6 (slam), 1.62–2.2 (dock across the cut), 2.88–2.95, 4.5, and 6.3–6.95 (exit);
  - v1: 0.4–0.8 (spin), 3.1–3.45 (rollover beat), 4.7–4.9 (cut flash), 5.6, and 6.3–6.95.
- Jason's face is never under type. All text is inside x 72–936 and y 230–1480. No glyphs are clipped, and Archivo renders throughout (no fallback).
- `bg: "none"` was rendered as webm and composited over green for both variants: transparent, with only the v0 scrims and the v1 bars, and the glow kept.

## v2 round 5 (craft-v2 redesign, built from scratch)

The owner rejected v1 (rounds 1–4) as "basic, not professional or clean-looking", even though critics scored it 7. v1 was a Barlow numeral and Inter caps over soft 1080p plates, with a smoked-glass card (v0) and a paper card (v1). The v2 build keeps the job, the content and the seek-safety lessons, and replaces the whole look. Hero time is **1.6 s** for both variants.

**What was kept from v1, and why.**
- The job: a big "this is #N" moment, then a persistent marker while the clip plays.
- The content: "Top 5 · Trailer moments", #3 "Vice City nights" (v0), and "Top 5 · Police chases" (v1).
- The story-style N → 1 segment bar. Finished ranks are filled, the current rank fills across the clip, and the rest stay as tracks.
- The hanging hash, which is now top-aligned to the figure's ink.
- The odometer roll, which critics liked in v1 r02–r03.
- Seek-safety habits:
  - every tween is a `fromTo` with `immediateRender: false`, and start states are set at build time;
  - zero-length opacity steps instead of crossfades;
  - per-frame effects only through `Look.drive`;
  - layout is measured before any tween renders.

**What was thrown away.**
- Every card: the smoked-glass plate, the paper card and the tile.
- Barlow Condensed and Inter.
- The old `assets/plates`.
- The glass-plate FLIP morph. Critics called its middle messy in r03 and r04.
- The single slowed plate. v2 cuts on beats instead.

**Key v2 decisions.**
- **Footage.** 4K `assets/shots`, graded, cut on the graphic's beats, with a continuous `Look.push` (to 1.08 in v0, 1.07 in v1), grain at .16 and vignette at .5.
  - Scene detection showed that three "single" shots have hidden cuts: `s039` at 1.07 and 2.67 s, `s055` at 2.1 s, and `s098` at 1.13 s. Every in-point and out-point avoids them, and no `<video>` runs past its source.
  - v0 and v1 shots sit on separate tracks (0 and 2), so the two variants never overlap on one track.
- **v1 is letterboxed on purpose.** Several top edits use a 16:9 band on black with type in the black. Here the rank stands 36 px above the picture's top edge.
  - The bars are part of the graphic, so they stay with `bg: "none"`. That matches what CapCut does when a 16:9 clip goes on a 9:16 canvas.
- **One family, three sizes per frame.** Archivo wide only: numeral, title and label.
  - Kickers use the DESIGN "Rockstar date style": a 2 px `#EE08F2` offset and a soft magenta bloom.
  - The gradient numeral is the only colour accent. Its bloom is a pink drop-shadow on its wrapper, never a text-shadow on gradient type.
- **Ink-true layout.** A canvas `measureText` pass (Archivo, `fontStretch: "expanded"`) gives each glyph's real ink top, baseline and left bearing. The layout uses these numbers:
  - the hash is top-aligned to the figure's ink;
  - the kicker sits a fixed gap above the numeral's ink;
  - the title sits a fixed gap below it;
  - in the bug, the label's cap top sits on the numeral's ink top, the segment bar sits on its baseline, and the title is centred between them.
- **Numeral line boxes hug the ink.** Line-height is 0.84, because `hyperframes check` treated the full 1.0 line box of a 580 px glyph as covering the kicker and the title (`text_occluded`).
- **Masks hide type that is not on screen.** The bug's type is held at opacity 0 until the dock, and the hero title is set to opacity 0 after its mask-out. Masked type translated under the numeral otherwise counts as occluded text.
- **v0 dock is one flight, not a morph.** The same numeral element flies to the corner (translate plus scale to 168/580, 0.56 s expo.inOut) with a directional SVG blur that follows the ease's speed: peak 22 px at the fastest frame and 0 at both ends.
  - The kicker blurs out, and the title words drop into their masks 0.08 s before the flight.
  - The fast part of the flight straddles the 2.4 s cut, so the cut hides the hand-off.
  - The bug's label and title rise in their masks at 2.6 s, as the numeral lands at 2.72 s.
  - The hero scrim hands over to a top scrim.
- **v1 reel.**
  - The speed blur sits on the reel inside the window, so the window clips it. On the window itself the blur bled past the window as a pink slab.
  - The window's top and bottom feather by 18 % while the reel spins. The feather is driven per frame with `Look.drive`; a GSAP-tweened CSS variable inside `mask-image` did not take effect in the render.
  - The feather opens to 0 within 0.14 s of the stop, so the resting glyph is never faded.
  - On exit, the reel spins up and out of the window.
- **Exits are designed.**
  - v0: the bug's type rises out of its masks, and the numeral blurs out.
  - v1: the figure spins away, and the title drops into its masks.
  - Both are clear by about 6.7 s, so the last 0.3 s is clean footage and the loop is clean.

**Checked this round.**
- `hyperframes check` passes: 0 errors, 32/32 contrast. Two structural lint warnings are inherited from the template.
- I opened both hero PNGs, both strips and the entrance sheet, and pulled frames at 0.05, 0.62–0.64 (payoff), 1.6 (hold), 2.4–2.75 (dock), 3.2, 4.5 and 6.5–6.97 (exit) for v0, and at 0.05, 0.3–1.0 (spin and stop), 1.6, 3.1, 6.4–6.95 for v1.
- No clipped glyphs. No faces under type: the convertible passenger's red cap stays below the v0 title, and the dancer's face stays clear of the bug. All text is inside x 72–936 and y 230–1480.
- `bg: "none"` was snapshotted over green for both variants: transparent, with only the scrims (v0) or the bars (v1).

**Fixed during the round.**
- The first cut of v0 opened on a dumpster crossing frame. The `s055` in-point moved to 1.0 s, so it opens on the truck's tail lights.
- The dock started 0.14 s too late: the hero still sat over the club shot after the cut. The dock now starts at 2.16 s.
- The v0 hero scrim was too heavy and crushed the skyline (peak .52 → .38).
- The v0 numeral was below 70 % of the safe width, so it went from 500 to 580 px.
- The v1 numeral went from 380 to 450 px, and the kicker gap from 52 to 44 px, so the kicker stays at y ≥ 233.

**Open questions for the critic.**
- The top band to the right of v1's "#2" is left as deliberate negative space.
- `s119` carries the game's real HUD: the minimap and wanted stars inside the picture band.

---

# v1 history (rounds 1–4, rejected look; kept for its lessons)


## Polish round 6 (hero 4.55 s)
**Hero 4.55 s:**
- v0 shows "90 MILLION VIEWS" over Lucia's dark shirt, with VIEWS (the word being spoken) in sunset.
- v1 shows "IN VICE CITY," on the fixed glass bar: IN spoken (white), VICE fully swept (sunset), CITY, upcoming (grey).

The r05 critic scored v0 7/10 and v1 8/10, and both won the blind pick. This round fixes both defects, takes the cheap fixes that fit DESIGN.md, and leaves out one fix that would reverse r05 decision 1. Layout, type, plates and v0 copy are unchanged.

### Defects
1. **v0: the accent always sits on the spoken word.** The `{ key: true }` option and its code are gone, so "90" and "305" no longer keep the sunset while MILLION and VIEWS land white.
   - **This reverses r05 decision 3.** The reason is a concrete defect: the brief says "the active word in the sunset accent", and the key hold broke that rule for the last two cards.
   - Measured on the r06 render (sunset pixels in the caption band, per frame):
     - "90" is sunset for frames 103–109, MILLION from frame 110 and VIEWS from frame 121.
     - On the last card, NOW is sunset for frames 145–150, 305 from 151 and MILLION. from 162.
2. **v0: no accent gap at the hand-off.** `CONFIG.handLead` is removed. The outgoing word turns white on the exact frame the next word lands in sunset, so every frame has exactly one accent and it's always on the spoken word.
   - Measured: SET stays sunset for frames 40–44 (1.33–1.47 s). On frame 45, YOUTUBE’S lands in sunset and SET turns white on the same frame.
   - Across the whole render, every frame from the first word (frame 4) to the final fade shows exactly one sunset word. The only extra orange hits are 13–17 px sparks in the footage at 1.80 s.
   - This is r04's same-frame hand-off. r05's 2-frame lead was the critic-suggested middle step, and it created this gap.

### Fixes taken
3. **v0 on bright concrete (1.0–3.4 s):**
   - **Gradient:** Word pop's sunset now runs only from #F84FA4 to #FE8E4E (`.pop { --sunset }`), so the amber #FEB747 tail no longer fades into the beige road at the ends of TRAILER, YOUTUBE’S and RECORD. It is still the Leonida gradient, just its pink → orange half. Karaoke keeps the full pink → amber on the dark glass.
   - **Edge:** `.w-edge` is now a 6 px stroke at rgba(11,11,14,.70) (3 px visible), up from 5 px at .62 (2.5 px). That is the top of DESIGN's 2–3 px allowance.
     - The critic suggested putting the stroke on the white and sunset faces. I didn't do that: on the `background-clip:text` sunset layer, the inner half of the stroke would eat into the glyph. The edge layer under the faces gives the same 3 px outline.
   - **Scrim:** the centre of `#scrim` is now .38 (was .30; the critic's figure was what r05 already had).
   - Checked at 1.0, 1.6, 2.2, 2.8 and 3.2 s: every word now has a crisp dark outline, and the word ends read coral on the road.
4. **v1: locked bar geometry.** The glass is now one width for the whole caption: the widest line ("NOVEMBER 19TH.") plus 56 px a side, about 786 px (73 % of the frame), with `minBar` 720 as a floor.
   - The per-line width tween is deleted, so nothing jumps at 4.97 s or anywhere else. Shorter lines sit centred inside the bar.
   - Measured: the bar spans x ≈ 147–933 on all six lines.
   - Of the critic's two options, this one meets DESIGN's 70–88 % width rule. A bar that hugged each line would be 56–60 % wide and would resize on every line change. It also continues r04's minBar direction rather than reversing it.
5. **v1: voiceover pace.** Words now come about every 0.3 s, and each line's last word holds about 0.65 s (it was 1.2–1.6 s).
   - Nine words at that pace would leave about 2 s of empty footage, so the sentence is longer: "Meet Jason and Lucia. Their story plays out in Vice City, November 19th." It is still FACTS-true: the leads are Jason and Lucia, the game is set in Vice City, Leonida, and it releases on November 19, 2026.
   - The six 2–3-word lines and their timings:

     | Line | Word times (s) |
     |---|---|
     | MEET JASON | 0.10 / 0.40 |
     | AND LUCIA. | 1.05 / 1.30 |
     | THEIR STORY | 2.00 / 2.26 |
     | PLAYS OUT | 2.95 / 3.28 |
     | IN VICE CITY, | 3.93 / 4.12 / 4.62 |
     | NOVEMBER 19TH. | 5.10 / 5.58 |

   - The type stays 106 px, because every new line is narrower than "NOVEMBER 19TH."
   - "IN VICE CITY," lands on the plate's real cut to the car interior (3.93 s; r05's note said about 3.4 s, but scene detection puts it at 3.933).
   - Checked frame by frame at 3.70–4.03 s: PLAYS OUT lifts out and the new line rises in one frame before the cut, with no stacked lines.
6. **Both variants start at 0.10 s.** v0's GTA 6’S lands on frame 4, and v1's bar and first line fade in from frame 1.
   - The karaoke entrance (`c.start − 0.14`) is now clamped to 0, so the bar never gets a negative timeline position.

### Not taken (deliberate)
- **v0 re-centring of lone first words.** This would ease the line back to centre as each word lands. It is r03's per-word re-centre, and r05 decision 1 deleted it for a concrete defect: the r04 critic measured FIRST jumping 106 px in one frame. Any re-centring moves a word after it has landed, so I kept placed words still.
  - The trade-off is unchanged: "90" (0.26 s) and FIRST (0.22 s) sit left of centre until their card fills.
  - The critic listed this as a fix, not a defect.

---

## Polish round 5 (hero 4.3 s)
**Hero 4.3 s:** v0 shows "90 MILLION VIEWS" over Lucia's dark shirt, with **90** in sunset (the key word). v1 shows "IN VICE CITY" on the 720 px glass bar: IN spoken (white), VICE swept (sunset), CITY upcoming (now 48 % white).

The r04 critic scored v0 7/10 and v1 8/10, and both won the blind pick. This round fixes the one defect and takes the cheap fixes that fit DESIGN.md and the earlier decisions. Layout, type, plates and v0 copy are unchanged.

### Defect
1. **v0: placed words no longer move.** The per-word re-centre tween (`tl.fromTo(c.line, {x: shift[wi-1]}, {x: shift[wi]})`), the `gsap.set(c.line, {x: shift[0]})` start offset and the `c.shift` measuring are deleted.
   - Each card is now laid out at its final centred width from its first frame. Unspoken words hold their slot at opacity 0 (inline-block keeps the width), so a word never moves once it has landed.
   - Measured on the r05 render (leftmost text column in the caption band, per frame): FIRST's left edge holds at x 242 from frame 23 (when its own pop settles) to the card's end at frame 39, including t = 1.0 s. "90" holds at x 156 for every frame from 104 to 144, and NOW at 156 from frame 148 (once its own pop settles) to 185. The only motion left is each new word's own 0.18 s pop.
   - **This reverses r03 decision 6** and the r04 "not taken" note. The reason is a concrete defect: the r04 critic measured FIRST jumping 106 px in a single frame. The cost is r02's complaint that a lone first word (FIRST, SET, 90, NOW) sits left of centre for 0.18–0.4 s until its card fills. That is how the references and CapCut-style word captions behave, and it is a taste issue, not a broken render.

### Fixes taken
2. **v0: staggered accent hand-off, still one accent per frame.** The outgoing word now turns white `CONFIG.handLead` (0.06 s, 2 frames) *before* the next word pops in sunset, not on the same frame. One change leads the eye at a time.
   - The critic suggested the other order (pop first, then the old word turns white 0.06 s later). I didn't use it: that shows two sunset words for 2 frames, which DESIGN.md forbids ("At most one accent per frame"). The r03 critic also flagged it ("for 2 frames at each handoff, two words show the accent at once"), and r04 decision 4 removed it.
   - Measured: frames 26–27 show FIRST white on its own, and frame 28 shows TRAILER land in sunset. NOW → 305 is the same: frames 149–150 have no accent, then 305 lands on frame 151.
3. **v0: key words.** A word can carry a third item, `["305", 5.00, { key: true }]`. Once spoken, it keeps the sunset for the rest of its card, and later words land white.
   - The demo flags "90" and "305", so the payoff cards hold the accent on the number: "**90** MILLION VIEWS" and "NOW **305** MILLION." (1.1 s hold).
   - This also removes 3 of the 7 hand-offs, so the payoff cards are calmer.
   - Measured: the sunset span stays on 90 (x ≈ 156–257) for all of frames 103–144, and on 305 (x ≈ 388–541) for frames 151–185.
4. **v1: shorter sunset → white hand-off.** The fade is now 0.08 s (was 0.15 s): one pastel frame and one near-white frame, down from 3–4 washed frames (checked at MEET → JASON 0.62 s and VICE → CITY 4.42 s).
5. **v1: copy reads as one spoken sentence.** The lines are now "MEET JASON / AND LUCIA / IN VICE CITY / NOVEMBER 19TH." ("Meet Jason and Lucia in Vice City, November 19th."), not bare names.
   - I didn't use the critic's exact lines. "MEET JASON DUVAL", "AND LUCIA CAMINOS" and "OUT NOVEMBER 19TH." measure 801 / 815 / 863 px at 106 px against the bar's 680 px, so the shared type size would drop to about 83 px. That breaks r02 decision 7, which kept the karaoke type at caption scale. With the surnames dropped, the connecting words still make it read as voiceover. The widest line is still "NOVEMBER 19TH.", so the type stays 106 px.
   - Every line but the last now fits the 720 px minimum bar, so the bar changes width only once, growing into the last line.
   - Retimed: MEET 0.30, JASON 0.62 (end 1.80); AND 1.80, LUCIA 2.06 (end 3.40). IN VICE CITY and NOVEMBER 19TH. keep their times, so the hero frame and the plate cut at about 3.4 s are unchanged.

### Partly taken
6. **v1 unsung words: .64 → .48, not .40.** The critic asked for .40, so karaoke progress shows at phone size. r04 decision 5 had raised the value .52 → .64 because the r03 critic called a fresh all-dim line muddy, so going to .40 would undo that. .48 is a middle step:
   - Sung white is now about twice as bright as unsung (L ≈ 1.0 against ≈ 0.31), up from about 1.0 against 0.47.
   - Upcoming words still measure about 4:1 over skin seen through the glass, which r04 raised to 70 % smoke.
   - In the r05 hero, CITY reads clearly grey next to white IN and still reads at 360 px.

---

## Polish round 4 (hero 4.3 s)
**Hero 4.3 s:** v0 shows "90 MILLION VIEWS" over Lucia's dark shirt, with VIEWS in sunset. v1 shows "IN VICE CITY" on a 720 px glass bar: IN spoken (white), VICE swept (sunset), CITY upcoming (64 % white).

The r03 critic scored v0 7/10 and v1 8/10, and both won the blind pick. This round fixes the one defect and takes the cheap fixes that fit the earlier decisions. Concept, copy, timings and layout are unchanged.

### Defect
1. **v0 plate: the gym shot is gone.** The re-cut p09 plate cuts at 4.1 s to the trailer-2 gym shot, and its barbell and in-game L2 prompt ran through "90 MILLION" and "NOW".
   - p09 now plays 0–3.433 s (`#plateA`). On the frame "90" lands, there is a hard cut to p06 Lucia (`#plateA2`, `data-media-start` 2.4, the plate's own 2.4–5.5 s shot).
   - Lucia's dark t-shirt sits behind the caption band, so the last two cards ("90 MILLION VIEWS", "NOW 305 MILLION.") get the best contrast in the piece. The warm golden-hour close-up also gives the payoff cards a calmer, more cinematic bed than the gunfire before them.
   - Measured on the render: frames 101–102 show p09 with "24-HOUR RECORD", and frame 103 shows p06 with "90". The plate and the caption cut on the same frame. The last frame (194) is still inside the Lucia shot (p06 5.43 s, and the shot ends at 5.5), so nothing flashes at the loop point.
   - I first set the cut at 3.400 s. A word whose time falls exactly on a frame lands one frame later, because the 0.001 s step tween is still at progress 0 on that frame, so the footage cut a frame before the caption. I moved the plate cut to 3.433 s.
   - Rejected alternatives:
     - p10 for the last cards: its police-car shot is only about 1.8 s of whip-cut fragments, followed by a motorbike against bright sky.
     - p04: a white police car crosses the caption band about 2 s into its shot.
     - p02: the GTA VI logo card (trademark).
   - CONFIG: `plate` is now `plates` (a list), because v0 uses two clips.

### Fixes taken
2. **Active word on bright asphalt (v0).**
   - A soft radial scrim sits behind the caption band: `#scrim`, `radial-gradient(ellipse 560px 170px, rgba(0,0,0,.30) → transparent 72%)`. It has no edge or box. It fades in 0.14 s before the first word and leaves with the last card, so it never sits alone on screen.
   - `.w-edge` is now 5 px at .62 (2.5 px visible), up from 4 px at .42. This partly reverses r03 decision 8. The reason is a concrete legibility defect: amber/pink measured at about 1.2:1 on the grey road. 2.5 px is inside DESIGN's 2–3 px allowance.
   - With the scrim behind it, the edge reads as definition, not a grey sticker outline. Checked at 2.2 s (NON-MUSIC) and 2.8 s (24-HOUR) on the brightest road frames.
3. **Hyphens (v0).** `.pop .line` adds `font-feature-settings: "case" 1`, so the hyphen rises to cap centre.
   - Inter 900's hyphen also has wide sidebearings, which made "NON - MUSIC" look loose. Each hyphen is now its own `.hy` span with `margin: 0 -0.045em`. The same markup goes in all three layers, so the layers stay aligned.
   - Inside the sunset layer, the hyphen is painted by the word's `background-clip:text` gradient. The layout audit can't see that on a child span, so that one span carries `data-layout-ignore`.
4. **Single-frame accent hand-off (v0).** The outgoing word's sunset fade is now 0.001 s (was 0.066 s), on the same frame its white face appears. This enforces the deliberate "one sunset word per frame" rule.
   - Measured: frame 27 shows only FIRST in sunset, and frame 28 shows FIRST white with TRAILER in sunset. Frames 44/45 are the same for SET → YOUTUBE’S.
5. **v1 legibility and width.**
   - `.k-dim` is .52 → .64, so upcoming words read over skin and door frame at 360 px.
   - The glass fill is .62 → .70.
   - `minBar` is 0 → 720 (67 % of the frame). The bars are now JASON DUVAL 720, LUCIA CAMINOS 734, IN VICE CITY 720 and NOVEMBER 19TH. 790, so the width only really changes once, growing into the last line.
   - This is a middle ground with r03 decision 3, not a reversal. r02's complaint was 128 px side padding at 760. At 720 the shortest line gets 106 px against the hug's 56, and the bar moves closer to DESIGN's 70 % width rule.

### Not taken (deliberate)
- **v0 line re-centring stays (r03 decision 6).** The r03 critic asked to lay each card out at final width and pop words in place, so already-read words don't slide. That is r01's layout, which the r02 critic rejected because lone first words ("SET", "FIRST", "NOW") sat left of centre and looked unbalanced. The two critics' tastes conflict and neither names a broken render, so I kept the r03 decision rather than flip back.

---

## Round 3 (hero 4.3 s)
**Hero 4.3 s:** v0 shows "90 MILLION VIEWS" centred, with VIEWS in sunset. v1 shows "IN VICE CITY" in a bar that hugs the line: IN is spoken (white), VICE is swept (sunset) and CITY is upcoming (dim).

The r02 critic scored both variants 7/10, and both won the blind pick. The biggest gap: the type was at the bar but the motion was not. Fixes, in order:

### Defect
1. **v1 line change is now sequential, with no stacked lines.** The outgoing line lifts y 0 → −24 px and fades 1 → 0 over 0.12 s (power2.in), starting 0.16 s before the next line's first word. The incoming line then rises y +24 → 0 px and fades in over 0.22 s (expo.out), starting on the frame the outgoing one finishes.
   - Measured at 30 fps: the last frame of "JASON DUVAL" is at 21 % opacity, and the next frame shows "LUCIA CAMINOS" at 46 %. No frame holds both lines.
   - With 24 px of travel, the caps never reach the bar edge, so nothing is cut off. `overflow:hidden` stays only as a guard.
   - This replaces r02's locked 96 px roll, which the critic showed overlapped for about 4 frames.

### Biggest gap, v1
2. **Feathered sweep.** `.k-sun` no longer uses a hard `clip-path`. A mask (`linear-gradient(90deg, #000 calc(--sw − 16px), transparent --sw)`) has a 16 px soft leading edge (`CONFIG.feather`). GSAP tweens `--sw` from 0 to word width + 18 px, so letters blend from sunset to dim instead of splitting at a bright seam (NOVEM|BER).
3. **Bar hugs each line.**
   - `minBar` is now 760 → 0 and `kara.pad` 40 → 56, so side padding (56 px) matches the vertical air.
   - Bar widths: JASON DUVAL 662, LUCIA CAMINOS 734, IN VICE CITY 620, NOVEMBER 19TH. 790.
   - The radius is now 30 → 28 (system radii 20/28/36).
   - The width tween is 0.26 s power3.inOut. When the next line is wider, the bar grows as the old line leaves, so the new one never clips. When it is narrower, the bar shrinks 0.06 s later, once the wider old line is nearly gone.
   - With pad 56, the widest line ("NOVEMBER 19TH.") fits 680 px, so the shared karaoke size settles at 106 px (was 108).
   - **Trade-off:** short-line bars are now 57–68 % of the frame width, below the 70 % rule. The critic named the 128 px vs 40 px padding imbalance as the concrete problem, so the hug wins.
4. **Optical centring.** Barlow caps sat about 11 px low in the line box (47 px of air above, 36 px below). The line now sits 6 px higher (`top:-6px`): measured 40 px above and 42 px below.

### Biggest gap, v0
5. **A pop you can see.** Each word lands fully opaque at scale 0.80, y +16, then settles with back.out(1.5) over 0.18 s. The frames read 0.80 → 0.93 → 0.99 → 1.015 → 1.0. r02's 0.26 s expo.out was already at 0.92 on its second frame, so it read as "appear".
6. **Visible words stay centred.** For each card, the script measures where the line must sit so that words 0..k are centred on x 540 (`c.shift`, measured untransformed with `getBoundingClientRect`). The line starts at shift[0], so a lone "SET" or "90" lands dead centre. On each new word it slides to the next shift over 0.18 s (power3.out); the last word's shift is 0. A card that wraps to two lines (below `minSize`) doesn't slide.
   - I first measured with `offsetLeft`. Because of a temporary `will-change` on the line, that measured against the wrong offset parent and pushed every card right. I caught this in the first r03 capture and fixed it before the final one.
7. **Two-frame accent hand-off.** When the next word lands, the previous word's white face appears instantly and the sunset face fades out over 0.066 s (linear). That leaves one blended frame, not r02's 4-frame washed-out pink.
8. **Lighter edge.** `.w-edge` is now a 4 px stroke at rgba(10,9,16,.42) (2 px visible outside the glyph, was 5 px at .62), and `--shadow-type` is kept. The gradient words no longer look outlined.
9. **`pop.maxSize` is now 96, but the one-size rule stays (r02 decision 6, deliberate, no defect named).** Every card shares the largest size at which the widest card fits. With this demo copy that card is "90 MILLION VIEWS" (844 px at 96 against 784 available), so the demo still renders at 89 px. A transcript whose widest card fits gets the full 96. I didn't vary size per card, because cards stepping between sizes mid-sentence reads as jitter. Instead, lone words now get weight from the visible pop and dead-centre landing.

### Kept (deliberate)
- Copy, timings, plates (p09 / p03) and the 6.5 s length.
- The hard cut between v0 cards on the next card's first word.
- One sunset word per frame.
- The three-layer word build.
- v1's 0.15 s sunset → white hand-off on spoken words (not flagged).

---


## Round 2 (hero 4.3 s)
**Hero 4.3 s:** v0 shows "90 MILLION VIEWS" with VIEWS in sunset. v1 shows "IN VICE CITY" with all three karaoke states (IN spoken = white, VICE swept sunset, CITY upcoming = dim).

The r01 critic scored v0 7/10 and v1 6/10. Both won the blind pick. The biggest gap: the captions blinked at every line change. Fixes, in order:

### Defects
1. **v0 blank frames → true hard cut.** Each card now leaves on the exact frame the next card's first word lands, through a 0.001 s opacity step on both. The incoming word is fully opaque on its first frame, and the pop is carried by scale 0.8 → 1 and lift 16 → 0 (expo, 0.26 s). Every frame shows exactly one card: never empty, never two stacked. This is the "hard cut + 1–2 frame pop" from `phrase-caption-yellow-condensed`, and was already r01's stated intent. I first tried an overlapping 0.08 s crossfade, which ghosted two cards on top of each other for a frame, so I dropped it.
2. **v1 empty glass → clipped line roll.** The karaoke lines now live inside the glass bar (`overflow:hidden`). At each change, the outgoing line rolls up 96 px and fades while the next rises from 96 px below, starting 0.16 s before its first word (0.24 s, power3.inOut). Both use the same ease, so they stay 96 px apart (more than the 76 px cap height) and never overlap. The bar is never empty. I tried the critic's suggested crossfade first: it stacked "JASON DUVAL" over "LUCIA CAMINOS" for 3 frames and looked muddy, so the lines roll instead.
   - The bar and the first line arrive together.
   - On the last line, text and glass leave together, so no empty glass is left behind.
   - The width tween runs while text is on the bar: a wider next line grows the bar before it lands, and a narrower one shrinks it after the wider line leaves.
3. **Copy overclaim fixed.** v0 now reads "GTA 6’s / first trailer / set YouTube’s / non-music / 24-hour record / 90 million views / now 305 million." "NON-MUSIC" gets its own sunset card, so the qualifier is impossible to miss. The new kicker card ("now 305 million.") is FACTS.md's 305.4M Trailer 1 views as of 2026-11-18. It also replaces the 2 s static hold r01 had on the last card.
4. **Handover rule in code, not just data.** `handover()` swaps a card on the next card's first word. A blank is allowed only if `end` is more than 0.25 s before the next word, which marks a real pause in the voice. During a pause, v1's glass leaves with the text and returns with the next line, so even pauses never show an empty bar.

### Layout and polish
5. **Centred on the frame axis.** `#zone` is now x 144–936 (540 ± 396), still inside the 72–936 safe width. This reverses r01 decision 6 because the critic named a concrete defect: every line sat 36 px left of centre. Measured: "90 MILLION VIEWS" spans x 152–932, and the glass bar spans 160–920.
6. **One type size per variant.** `fitAll()` finds the largest size at which the widest card sits on one line. Word pop: max 92, settles at 89 px for "90 MILLION VIEWS" in 784 px. Karaoke: 108 px, with the bar's 40 px side padding. No card changes size relative to the others.
7. **v1 presence.**
   - Karaoke type is now 96 → 108 px, with the bar 140 → 156 px tall and radius 30.
   - `minBar` is now 640 → 760 px (70% of the frame).
   - Upcoming words are 36% → 52% white, so they read as "coming", not "disabled".
   - To fit 108 px inside the 792 px bar limit, the lines are now names and places: "Jason Duval / Lucia Caminos / in Vice City / November 19th." "MEET JASON DUVAL" and "AND LUCIA CAMINOS" would have needed about 94 px.
8. **Fixed sunset span.** Each sunset layer's gradient is `max(440 px, word width)` wide and anchored left. Short words (IN, 90) read as one pink-to-coral wash instead of a hard two-tone split, and long words (NON-MUSIC, NOVEMBER) get the full pink → amber.
9. **Typographic apostrophes** (U+2019) in GTA 6’s and YouTube’s.

### Kept from r01 (deliberate)
- Naked Inter 900 caps with a soft shadow and a thin ink edge (v0), and Barlow Condensed 800 on smoked glass (v1).
- One sunset word per frame.
- The three-layer word build.
- The plates (p09 / p03) and the 6.5 s length.

---

## Round 1 (original decisions; see Round 2 for what changed)
**Hero time 4.4 s:** v0 shows "90 MILLION VIEWS" with VIEWS in sunset. v1 shows "IN VICE CITY" with all three karaoke states (IN spoken = white, VICE active = sunset, CITY upcoming = dim).

### What the references prove, and what we do better
- `phrase-caption-yellow-condensed` (J-7x): 2–5 words, condensed heavy, centred low, hard cut + 1–2 frame pop. **Kept:** short phrase cards, hard cuts between cards, a pop on entry. **Dropped:** flat #FFE600 yellow and the 2 px black outline. We use white plus one sunset word.
- `bold-stroke-caption` (_sO4z, 1.9M): black-weight white with a ~6 px black stroke, 2–5 words, y 64–81%. **Kept:** heavy white type, few words. **Dropped:** the thick stroke, which looks cheap. It becomes a 2.5 px semi-transparent ink edge plus the DESIGN soft shadow.
- `cinematic-subtitle` (o4sz): condensed, small, cut per line. This is the karaoke variant's lineage (condensed caps, a whole line visible), raised to caption size and set on smoked glass, as in DESIGN's legibility options.
- `analysis-1.md`: "none is word-by-word with an active-word highlight". That gap is what this component fills.
- Official type: the sunset gradient (#F84FA4 → #FE8E4E → #FEB747) is the only accent, applied to exactly one word per frame.

### Design decisions
1. **Two clearly different systems.**
   - v0 is naked type (Inter 900 caps) that builds word by word.
   - v1 is a whole line on a glass bar (Barlow Condensed 800 caps) that fills karaoke-style.
   - Both use the same accent rule: the spoken word, and only that word, is sunset.
2. **The layout is fixed per card (v0).** Words occupy their final positions from the start and just pop visible, so nothing re-flows or jitters. Chunk 1 was split ("GTA 6's" | "first trailer") so no card wraps and no lone first word sits off-centre on a 2-line layout.
3. **Each word is three stacked copies:**
   - v0 has an edge, a white face and a sunset face;
   - v1 has a dim face, a white face and a sunset face.

   This is because `background-clip:text` gradients can't carry a `text-shadow` cleanly. The edge layer carries the shadow under everything, and the accent hand-off is a 0.12–0.15 s crossfade.
4. **Karaoke sweep.** `clip-path` inset from 100% to 0% over the word's spoken span (×0.85, capped at 0.42 s), so the fill tracks the voice.
5. **Glass bar.**
   - It resizes between lines (0.3 s power3.inOut) while the text swaps.
   - Its minimum width is 640 px, so short lines ("IN VICE CITY") still read as one solid object near the 70% width rule.
6. **Centring.** Text is centred inside the safe width (x 72–936, centre 504), not the frame (540), so long cards never reach the like/comment rail.
7. **Plates and length.** v0 uses p09 police chase and v1 uses p03 Jason at the door. The composition is 6.5 s because p09 cuts to a headphone ad at ~6.67 s. The last card fades out over 6.14–6.46 s so the clip loops cleanly.
8. **Content is factual** (FACTS.md):
   - Trailer 1 set YouTube's 24-hour non-music record with 90M+ views. The VO says "broke YouTube's 24-hour record, 90 million views in one day."
   - Jason Duval and Lucia Caminos, Vice City, November 19 (2026).

### Check fixes this round
- The layered word spans tripped the `content_overlap` and `text_occluded` layout errors. Every word layer, chunk and the zone are now marked `data-layout-allow-overlap` / `data-layout-allow-occlusion`, because the overlap is intentional.
- Barlow Condensed 800 is also declared inline with `@font-face`, so the static font guard sees it. The renders confirmed real Barlow, not a fallback.
- The remaining contrast warnings refer to the dark edge layer and the deliberately dim karaoke words. Both are intentional, and they are warnings, not errors.
