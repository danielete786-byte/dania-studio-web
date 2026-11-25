# DECISIONS: #27 Top 3 podium

## Polish round 5 (fixes from the round-4 critique: v0 7, v1 6)

**Defect fixed: v1's loop flash.**
- **Cause:** `#dim` opacity was multiplied by outK. The house lights lifted from 0.42 to 0 in the last 0.4 s (YAVG 74 → 113), then snapped back to 0.42 at frame 0.
- **Fix:** opacity is now `0.42 + 0.14 * spotK * outK`. Only the beam's extra 0.14 fades out, so the first and last frames share the same house light.
- **Checked in the r05 MP4:** v1's last frame is YAVG 103.0 and frame 0 is 103.6, with no overshoot. The rise over frames 170–179 is the planned exit: the steps sink and the backdrop shows. v0 is unchanged (72.7 → 76.1, from the backdrop clip's own motion).

**Biggest gap (both variants): the mud backdrop. Rockstar's sky is now the material.**
- **Haze:** `#haze` uses `mix-blend-mode: color` at 0.85 (still `#9C7AA8 → #D689A1 → #FAA08D → #FFC88F`). The blurred clip now contributes only light and shade, and the sky supplies the colour.
- **Backdrop clip filter:** changed to `contrast(.7) brightness(1.2)` (was `saturate(1.2) brightness(.9)`). This is a deviation from the critic's numbers. With the critic's values alone, v0's dark Lucia clip turned the colour blend into a dark wine red. Flattening the clip's luminance lands it on a dusky lilac → rose → peach sky, closer to the feature card (8L0CzL2V72c-6.5).
- **Shade:** the `#shade` bottom stop is cut from 0.62 to 0.30.
- **Glow:** `#glow` is raised to `rgba(250,160,141,.5)` at 47% 74%, a sunset floor glow under the podium.
- **v1 layer order:** `#dim` now sits *under* the haze. With dim on top, v1's low house lights greyed the sky into beige. Under the colour blend, they read as a darker dusk and keep the sunset hue.

**Numerals: "2"/"3" are a near-matched pair that reads as extruded.**
- **Sizes:** `NUMH` changes from 2: 0.53 / 3: 0.38 to 2: 0.66 / 3: 0.60, about 185 / 170 px on screen (was 148 / 105). `NUMD` is 0.09 for both.
- **Why not 0.62 for the "3":** the critic's 0.62 left the "3" about 6 px from its step's top bevel. 0.60, centred on the face, leaves about 11 px above and below.
- **Size cap:** a numeral can now reach 80% of its visible step (was 75%), so the "3" reaches full size. Numerals still ride their steps on the rise and the sink, and I checked every rise frame.
- **Faces:** the white faces get a small emissive lift (0.1), so they read white, not flat grey.
- **Top-edge highlight:** the walls stay the step's ink-navy, but top-facing walls and bevels get a soft white highlight (a shader term on the view-space normal, 0.55 before tone mapping). That is the 3D version of the critic's "1 px rgba(255,255,255,.35) top bevel": each numeral now shows a lit top edge, like an extrusion.
- **Restraint kept:** the gradient "1" is still the only accent, and the step material is unchanged.

**v1: the spotlight lands on #1.**
- **Cone:** it fades in by screen row (`BEAM_FROM` 540 → `BEAM_FULL` 610 px, using `gl_FragCoord`). It never washes "MOST-VIEWED" and shows as a light column above and beside card #1.
- **Strength:** cone uOpacity 0.13 → 0.22, pool 0.4 → 0.6, and the card's `.kiss` 0.42 → 0.6.

**v1: the runners-up drop into shadow.**
- **Dimmer:** capped at 0.35 (0.25 when the beam fires, 0.35 at `dimMore`; was 0.42 → 0.65).
- **Grade:** their videos also ease to `saturate(.65) brightness(.8)` with the beam. They now read as shadow, not a milky veil. Names and counts stay, as in round 3.
- **Keys card crop:** `pos: "50% 85%"`. This deviates from the critic's "50% 18%", which moves the crop window *up* the source and pushes the sign's lettering *down* into the label. 85% puts "The Keys" in the card's upper half (card y about 14–40%), clear of the scrim and of "LAUNCH TRAILER", for the whole window (I checked frames from 0.67 to 5.5 s).

**Cards.**
- **Jason card:** it now uses the horizontal plate `p03-jason-door-h.mp4` at `pos: "30% 50%"`.
  - Why not the vertical plate: its centre crop loses Jason off the left edge as he turns to the door, and `object-position` x can't fix that, because a 9:16 clip has no horizontal overflow in this card.
  - Why 30% and not the critic's 20%: I measured Jason's position across the card's window (source 0–2.8 s), and 30% keeps him whole at every sampled time. 20% clips his right shoulder at 0.5 s and 2.4 s.
- **Contact shadow:** every card adds `0 6px 10px rgba(0,0,0,.55)` to its box-shadow, so it sits on its step top. The #1 sunset rim is still visible below it.

**Not changed:**
- The camera framing. The critic's "doesn't favour #1" note was not in the fixes list, and round 4's safe-zone limits still apply.
- Concept, layout, timings and hero time (4.2 s).

## Polish round 4 (fixes from the round-3 critique: v0 6, v1 7)

**Defect fixed: see-through 3D on the rise and the exit.**
- Every 3D material is opaque now: blocks, the "2"/"3" numerals, and the "1"'s face and sides. No material opacity is ever animated.
- **Rise:** each step grows straight up out of the floor, from height 0 to full on power3.out over 0.45 s (0.5 s for #1). Its origin is at the bottom centre, so it never goes below the floor and nothing is clipped. That keeps round 3's fix for round 2's "invisible clip plane" defect, so I did not bring back the clip plane the critic suggested.
- **Numerals:** each one rides its step at true proportions (counter-scaled against the step's height) and is never taller than about 75% of the visible step.
- **Exit:** canvas opacity is no longer faded at all. From 5.6 s the cards fold back onto their steps and fade (0.18 s). Then the steps sink into the floor on power3.in: #3, #2, then #1 last, all gone by 5.94 s. The last frame shows only the backdrop, so it still loops.
- **Checked in the render:** frames at 0.3–1.1 s and 5.6–5.97 s in both MP4s show solid blocks at every frame.

**Defect fixed: unverified Trailer 2 timestamps.**
- v0's `meta` lines (0:23 / 0:45 / 1:03) are gone, because they aren't in FACTS.md.
- `meta` is still an optional CONFIG field for the creator's own note. When it is empty it is hidden, so the name sits on the card's bottom inset. The v0 cards now carry one line of type each, which is also less busy.

**v0 biggest gap: a camera payoff on the winner.**
- **Build:** it now plays on a slightly wider three-quarter view. The podium is about 68% of the frame width, still inside the 70–88% "hero" band within a couple of points.
- **Push:** on the slam, the camera pushes in about 1.17x on expo.out over 1.2 s and swings square onto #1. The #1 card grows from about 252 to 295 px wide, then keeps settling slightly through the hold.
- **Why not tighter:** the critic's exact camera (z 11.4) puts the #2 card at x −3 and the #3 card at x 997, and the base at y 1614. Round 2's critic flagged side cards at x 35 / 968 as a safe-zone defect, and DESIGN.md requires key objects inside x 72–936, y 230–1480. So the push stops where everything still fits: cards at x 83–925, base at y 1474, #1 card top at y 642 (title ends at about 515). I checked this with a projection script and in the render.
- **The winner gets its own light:** a thin emissive sunset rim on #1's front-top bevel (#F84FA4 → #FE8E4E → #FEB747), like the glow edge of Rockstar's VI. It ignites on the slam, sits right under the winner's card, and goes out as the step sinks.

**v0 biggest gap: material.**
- **Blocks:** the plum came from the sunset environment and the pink/amber rims, not from the base colour. The steps were already #1F202B physical; they now use clearcoat 0.6, clearcoatRoughness 0.2 and envMapIntensity 1.0.
- **Environment:** a neutral ink-navy studio (slate sky, a white softbox, two cool-white strips).
- **Rim lights:** cool-neutral and lower (y 1.1, intensity 2.2), so they edge the side walls without tinting the step tops.
- **Gloss plane:** neutral, not plum.
- **Result:** the tops of #2/#3 read neutral navy-grey, and the warm accents are only the "1" and its rim.
- **Numerals "2"/"3":** clean white faces (#EBEBEE), side walls in the step's own ink-navy, extrusion halved (0.12 → 0.06), and 0.8x height (0.53 / 0.38 units). The gradient "1" is unchanged and is clearly the one hero.

**Cards seated.**
- **Contact shadow:** each card has a soft contact shadow decal on its step top: black at 0.55, blurred, 90% of the card width, centred on the card's base.
- **Box shadow:** the DOM box-shadow is now a tight 1 px contact plus a soft ambient halo. The 36 px downward spill used to smear over the front of the step.
- **Tilt:** cards lean back 0.105 rad (~6°), up from 0.05, to match the camera's pitch.

**Defect fixed: the drive-by card's black bar.**
- **Cause:** the diagonal bar was the car's A-pillar, which enters p04 at about 2.0 s. The critic's suggested in-point (2.0 s) would have shown it for longer.
- **New in-point:** the card now plays source 0–1.9 s at 0.35×, which is the mural and the police only.
- **Crop:** a new optional `clip.pos` (CSS object-position, here "50% 88%") drops the crop below the sun visor.

**v1 (cheap and consistent).**
- **Runners-up:** they dim from 0.42 to 0.65 at 2.4 s, as the chip lands. Their names and view counts stay, which keeps round 3's v1 fix.
- **The beam lands:** a 0.3 s bloom on the "1" face at 1.9–2.2 s.
- **Camera kept:** v1 keeps round 3's wider camera. The critic's push to a 500 px #1 card would crop the runners-up's names off the frame, which was round 2's v1 defect.
- **Variants are now distinct:** v0's payoff is the camera push; v1's is light: house lights low, beam, bloom and hard dim.

**Hero time:** 4.2 s. Both variants are settled: v0 has been pushed in for 1.5 s, and v1 has the beam on, the count landed, the chip in and the runners-up fully dimmed.

## Round 3 (fixes from the round-2 critique)

**Biggest gap: it was three equal dice, not a podium. It is now one stepped podium.**
- Step heights are 1.00 / 0.70 / 0.50 (1.6, 1.12 and 0.8 units). The winner's step is 1.15x wider (1.15 vs 1.0, about 300 vs 260 px on screen).
- The three steps are joined into one object, with only a 0.012 seam, so the bevels form a groove between them. The hierarchy now reads from the silhouette alone, without the numerals.
- Numerals are about 60% of each step's height (0.96 / 0.66 / 0.48).
- The material, sunset environment, rim lights, gloss planes and extruded numerals from round 2 are unchanged. The critic praised them, so I didn't touch them.

**Defect fixed: invisible clip plane.**
- The floor clip plane is gone, from every material and from the renderer.
- Each step now fade-rises in place. It stands on the ground the whole time and grows from its bottom centre: 0.88 → 1 in width and depth, 0.80 → 1 in height, on expo.out over 0.45 s (0.5 s for #1). It fades in over 0.22 s.
- Nothing ever passes below the floor, so nothing can be sliced. The contact shadow (opacity 0.6) scales with the step, so each step stays grounded.
- This is the critic's second option. I chose it over drawing a visible floor edge because a hard horizon line would add a second graphic element to the frame.

**Cards: no collisions.**
- Each card is sized to its step, inset 0.03 on each side. #1 is about 287×385 px on screen and #2/#3 about 250×325 px.
- Neighbouring cards keep an 18–20 px gutter and never overlap. The overlap insets (`OVER`) from round 2 are gone.
- Label baselines step with the podium: #1 highest, then #2, then #3. They now step deliberately and sit at the same distance above each card's bottom edge, instead of round 2's zigzag of overlap insets.
- I did not force #2 and #3 onto one baseline. That would mean making the #3 card taller than #2, which breaks the hierarchy the critic asked for.

**Dead build fixed: hero framing from frame 1.**
- The camera starts at a slight three-quarter from the right with the podium already at about 73% of the frame width. There is no wide-then-dolly move any more.
- The build is compressed: rises start at 0.25 / 0.6 / 0.95 s, the "1" slams at 1.45 s, and all three cards have landed by about 1.65 s.
- v0 ("camera settles on the winner"): at the slam the camera swings square onto #1 with expo.out over 0.9 s, then arcs slowly through the hold.
- Settled framing:
  - steps x 88–923, cards x 93–916 (safe zone 72–936);
  - base y ≈ 1450 (limit 1480);
  - #1 card top y ≈ 640, clear of the title, which ends at about y 515.
- I checked this numerically with a projection script before rendering, then in the renders.
- The component is now 6.0 s (was 6.4), because the build finishes 1.5 s earlier. Out starts at 5.6 s.

**v1 defects fixed.**
- **Runners-up keep their names.** The value tags (`tag`) are removed. Under the spotlight, #2 and #3 keep their full labels ("TRAILER 2 · 189.6M views", "LAUNCH TRAILER · 82.0M views"). Only their footage dims, through the 0.42 dimmer, and their labels drop to 88% opacity.
- **Safe zone.** v1 uses the same hero framing, pulled back about 2.5% (camera z 14.15 vs 13.8) to make room for the beam. Its cards sit at about x 105–905.
- **The spotlight lands on #1.**
  - The cone now runs from above the frame (y 7.4) down to the top of #1's step. It is about 1.44 units (≈380 px) wide at the base and fades only over its last 7%, so it stays visible behind the title and in the gap above #1's card.
  - Its peak is about 0.22 additive: 0.13 per face, front and back.
  - The SpotLight sits directly above the step, so its top face and front edge catch the light, and a pool lands on the floor in front of it.
  - A screen-blended "kiss" gradient on the top of #1's card carries the beam onto the footage.
- **No mid-clip grade change.** The house lights are low from frame 1 (dim 0.42, rising only to 0.56 when the beam fires), and the key and rim lights drop gently.
- **Steady backdrop.** The blurred backdrop now holds on the beach-and-skyline part of the Trailer 1 aerial (from 2.2 s at 0.17×), so it no longer drifts from green sea to sand mid-clip. This is the same continuous shot as before.
- **Chip fits.** It was clipped at "90M+ in 24 hou…" once the card got narrower. It now reads "90M+ in 24h", is centred on the card, and has a fit loop that never drops below 26 px.

**Clip windows re-checked for the new timings.**
- Lucia: p06 from 2.7 s at 0.54×, ending at 5.43 s, before the cut at 5.5 s.
- Drive-by: p04 at 0.78×, ending at 4.21 s, before the cut at 4.43 s.
- Jason: p03 at 0.5×.
- Trailer 1 card: from 1.1 s at 0.43×, ending at 3.27 s of the 3.3 s clip.
- Trailer 2: p06 at 0.5×, ending at 5.4 s.
- Keys: p01 at 0.32×, ending at 1.84 s, before the whip at about 2.1 s.

**Hero time:** 4.2 s. Both variants are settled: v0 is mid-arc with all three places in the safe zone; v1 has the beam on, the count landed and the chip in.

## Round 2 (fixes from the round-1 critique)

**Biggest gap: the podium read as matte Keynote clay. It now has a real material, a ground and light.**
- Blocks: `MeshPhysicalMaterial`, ink-navy `#1F202B`, roughness 0.35, clearcoat 0.6. They are lit by a sunset studio environment: a PMREM made from a canvas equirect with a `#9C7AA8 → #D689A1 → #FAA08D → #FFC88F` sky (Rockstar's feature-card sky), a white softbox and dark navy ground. The top faces catch the sunset at grazing angles.
- Rim light: `#F84FA4` from back-left and `#FEB747` from back-right. They sit low and to the side so they land on the bevels; the bevel radius grew from 0.035 to 0.06 to give them room.
- Each front face gets an additive gloss plane: a top-lit gradient plus one diagonal streak, like a softbox reflection on glossy plastic. It moves with the block and is clipped by the ground.
- Ground: a `ShadowMaterial` floor at opacity 0.35, receiving real shadows from a high back light so they fall toward the camera, plus a soft contact shadow and a dark stage gradient. The blocks rise out of this ground. This replaced round 1's white satin blocks. That reversal is deliberate: the critic named a concrete defect (no floor, no specular, it read as stock clay). White moves to the numerals, which keep the glossy white object from the reference.
- Numerals are now real extruded geometry, 0.12 deep with a small bevel: Barlow Condensed Black outlines (extracted once with opentype.js and inlined as path data, so no runtime fetch). "2" and "3" are glossy white clearcoat. The "1" face is a shader that carries the Leonida sweep (`#365ECE → #A341C0 → #F84FA4 → #FE8E4E`), the frame's only accent, with magenta clearcoat sides.

**Defect: entrance pop.** Each block now starts fully under the ground, with its top flush, and rises through the ground clip plane on power3.out (not expo, which jumped to half height in 2 frames). Its opacity fades 0→1 over 4 frames. The numeral is part of the block from the first frame, so #1 never rises blank.

**v0 payoff ("camera settles on the winner").**
- At 2.25 s the "1" slams from scale 1.15 to 1 over 3 frames, with a 4-frame camera kick of about 6 px.
- One sunset light sweep crosses its face over 0.5 s.
- At 2.3 s the camera dollies in about 18% and tilts up to #1 over 0.8 s (expo.out).
- The hold (3.1–5.95 s) is filled by a slow camera arc and the cards' footage, then a sheen crosses #1's card. The whole piece is now 6.4 s, down from 7.0 s.

**Defect: v0 scale and type.**
- Cards are about 300×395 px on screen (#2, #3) and about 350×465 px (#1), up from 240×300.
- Three type sizes per frame, all measured on screen: title 108, card names 52 (never below 44), and one small size of 32 for the kicker, meta, chip and tags. Card type is sized from the settled camera's projection (`layoutCards()`), so the on-screen sizes hold whatever the camera does.
- JetBrains Mono is gone; the meta is Inter 600 with tabular numerals.
- The podium base moved down to y ≈ 1480. Card #3's right edge is at about x 932, inside the 936 line.

**Composition.** #1's card is wider and stands in front, overlapping the inner edges of #2 and #3 by 0.16 units. Their labels are inset by that overlap, so no text is ever covered.

**Defect: clips and labels.** Each card's `<video>` has `data-media-start` and `data-playback-rate`, mirrored in CONFIG `clip.in` / `clip.rate`, so every card stays on the one shot its label names for its whole time on screen:
- Jason at the door: p03 from 0 s at 0.5×.
- The drive-by: p04 from 0 s at 0.8×, ending before the cut to the prison fence at 4.43 s.
- Lucia at the gate: p06 from 2.7 s at 0.57×, after the pan off the man in the tee and before the cut at 5.5 s.
- Launch Trailer: p01 from 0 s at 0.32×, on the Keys sign only and before the whip to the marina at about 2.1 s.

**Timecodes verified, not placeholders.** I checked them frame by frame against Rockstar's Trailer 2 upload (research file `VQRLujxTm3c.mp4`, titled "Grand Theft Auto VI Trailer 2", 166.8 s). Jason at the door is 0:23, the drive-by is 0:45, and Lucia at the gate is **1:03** (round 1's 1:00 was the start of the plate, before Lucia is in shot). Because they are now verified, they stay as the demo. The README tells creators to fill in their own.

**v1: the winner card no longer hard-cuts.**
- New clip `assets/clips/t1-beach-v.mp4`: one continuous Trailer 1 aerial (boat, Vice beach, skyline) at source 10.97–14.27 s, cut before the "presents" credit fades in.
- The card plays from 1.2 s at 0.44×. The backdrop is the same clip, blurred, at 0.36×.

**v1 composition.**
- The push-in stops with #1's card under the title (top at about y 572) and the block base at about y 1465, above the 1480 line.
- Runners-up stay at about 55% brightness through a dark overlay (no CSS filter, so their tags stay crisp) and are not cropped by the frame edges.
- Under the spotlight their name labels fade, and a small smoked-glass tag ("2 · 189.6M", "3 · 82.0M") appears on each card's inner side, inside the safe zone. The block numerals stay readable.

**Backdrop.** Same blurred winner clip as round 1, now with a soft-light sunset grade (`#9C7AA8 → #FFC88F`) and a warm screen glow behind the podium, so the dark blocks separate from it.

**Hero time:** 4.8 s. Both variants are settled: v0 has all three in the safe zone mid-arc, and v1 has the spotlight on, the count landed and the chip and tags in.

## Round 1

**One object: a 3D podium carrying clip cards.** Rounded extruded blocks, with the clips standing on top as cards.
- Round 2 replaced the white satin blocks with ink-navy, as above.

**Accent: one per frame.** Only the #1 numeral carries the Leonida sweep, with the lightest gold stop dropped for contrast.

**Type (official-type refs).**
- Kicker: Inter 600 caps tracked 0.34em, like the "ROCKSTAR GAMES PRESENTS" card and the "FEEL THE TENSION / WITH ADAPTIVE TRIGGERS" feature-title card.
- Title: Inter 800 caps at 108 px, balanced over at most two lines.
- Card names: Barlow Condensed 800 caps.

**Hybrid 3D.** WebGL draws the geometry and light. Clip cards are DOM pinned to the projected 3D quads with a homography `matrix3d`, so the type stays sharp and the `<video>` elements stay framework-owned. Cards hinge up from the top face.

**Order.** Third, second, then first rise through a clipping plane at the floor. One thing leads at a time.

**Spotlight (v1).** The house lights drop. A narrow spotlight fires, with an additive volumetric cone and a pool of light. The additive blending adds RGB and leaves alpha untouched, so `bg: "none"` stays transparent.

**Backdrop.** The winner's own clip, blurred: the manifest's blurred-bg idea. I deviated from the suggested p02-blue-club plate because seconds 2–6 of it are Rockstar's logo card (no trademarks).

**Content.** v1 uses the real view counts and the 24-hour record from FACTS.md.

## Round 6 (lead fix, after polish round 5)
- **Defect (r05 critic):** v1's blurred backdrop stepped at about 5 fps. `bg1` played `t1-beach-v.mp4` at `data-playback-rate` 0.17, so each source frame was held for about 6 output frames. The clip is only 3.3 s long, so a faster live rate can't cover 6 s.
- **Fix:** `assets/clips/t1-beach-v-bg.mp4` is the source's 0.6–3.3 s, pre-slowed to 0.43x with ffmpeg `minterpolate` frame blending (30 fps, 6.1 s). It plays at rate 1 from 0, and `CONFIG.variants[1].backdrop` points at it.
- **Measured:** consecutive identical backdrop frames went from 85/120 to 0/120 (t = 1–5 s).

## Round 7 (lead fix, after the r06 critic)
- **Defect (r06 critic):** the card footage juddered at 10–16 fps. The cards played live at `playbackRate` 0.32–0.54, so each source frame was held 2–3 output frames.
- **Fix:** every card clip and the v0 backdrop are now pre-slowed with ffmpeg `minterpolate` frame blending (`assets/clips/card-*.mp4`, `bg-p06-v-043.mp4`). They play at rate 1 from 0, and CONFIG `clip`/`backdrop` entries point at them (`in: 0, rate: 1`). The in-points and speeds are unchanged, so each card still holds the one shot its label names.
- No `<video>` in the piece has a playback rate below 1 any more.
- **Measured:** static consecutive pairs on the v0 #1 card (t 2.5–5 s) went from 45/75 to 11/75; the remaining ones are footage that is genuinely still.
- To swap a clip, render a pre-slowed copy the same way (see README) or point CONFIG at a clip that plays at normal speed.

## Round 8 (lead fix, after the r07 critic)
- **Defect (r07):** on v1's exit (5.6–5.8 s), the spotlight cone outlived the cards. It faded on `outK` (power2.in), which starts slowly, while the cards were gone within 0.18 s, so the cone showed alone as a frosted column.
- **Fix:** the cone and its floor pool now fade on their own `beamK`, from 5.45 to 5.65 s (power2.out). The beam is gone before the cards begin their exit at `T.out`.
