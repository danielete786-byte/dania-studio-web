# Wanted level: decisions

## v2 concept
- **The one idea: every cut adds a star.** A police escalation edit. Each star lands on a beat, and the fifth lands on the hit inside the shot: the frame the police SUV's nose lifts off the road (`s119` frame 68). The whole flip then plays at full speed under the maxed row, on a 1.08 push. The HUD is the edit's metronome, not a widget floating on top of it.
- **Shots and cuts (stars at 0.40 / 1.30 / 2.35 / 3.20 / 4.50 s, 6.1 s total).** Both variants are full-bleed vertical (`-v`), and every frame is a real, unique 30 fps source frame (no slow-mo, no hit-stop).
  - v0: `s014` police lights through the windshield (0–1.30) → `s096` patrol car (1.30–2.35) → `s113` Lucia firing (2.35–3.20) → `s119` at 1× from frame 29 (the gunman firing on the charging SUV) to the end, 3.20–6.10 (source frames 29–116).
  - v1: `s096` (media 0.47) → `s014` → `s119` at 1× from frame 4, unbroken from 2.35 to the end. SHOTS FIRED lands as he opens fire, star 4 on the muzzle flash.
  - In both, the hit (4.50) is source frame 68. The roll plays 4.5–5.2, the upside-down apex lands about 5.37 s (frame 94), and the SUV tumbles out of the top of frame about 5.7 s, as the HUD exits.
- **Where the graphics sit, and why.**
  - v0 is diegetic: the GTA VI HUD sits top right at phone scale (row x 242–930, top y 252), lit from the right like the game. The badges sit under it (y 384–448), on a soft corner scrim.
  - v1 is one lockup up top, over a `.lk-scrim-top`:
    - the label at y 262;
    - the white title at y 306–554;
    - the star row 56 px under it (y 610–722);
    - the badges under that (y 746–818).
  - In the hold, the flipping SUV passes behind the lockup (a dark mass, so the white type reads harder), and the shooter stays below it. No face sits under the lockup in any shot.
- **Hero size and face.**
  - v1: Archivo 800 caps at 132 px, `font-stretch` 112%. "SUSPECT" and "SPOTTED" measure about 740 px (86% of the safe width). The label is 26 px wide Archivo, a 5:1 ratio. One family.
  - Stars are our own drawing: inner radius .40, a 2 px dark keyline, faint facets, a cool shade toward the bottom, a lit top edge and a white bloom. v0 is 104 px on a 42 px gap; v1 is 112 px on a 44 px gap (736 px, 85%).
  - Badges are flat oxblood `#8E1620` discs with a 2 px `#3A0A0E` rim, as in the real HUD, with our own 2.5 px stroke glyphs: v0 64 px, v1 72 px (scaled with v1's bigger star row).
  - v0 has no type: the game HUD has none.
- **Payoff at 4.50, on the lift.** Star 5 ignites bigger than the others (v0 1.6 → 1, v1 1.75 → 1, `expo.out`), and one lens streak crosses the whole row. The frame gets a 2-frame hot-white exposure, shake, punch zoom and an RGB split. Then hard red/blue police light runs 4.5–5.5 in 4-frame steps.
  - The star fills stay `#FFFFFF`. The police colour is carried only in light: the top-corner washes and the stars' bloom, which takes the step's colour (`#FF3B3B` / `#3B82FF`, strength .6).
  - v1: MOST WANTED starts rising 0.16 s before the hit, so it is up on the flash frame with star 5. WANTED takes a 2-frame red or blue offset ghost on each step.
  - v0 exit: the stars un-fill right to left (40 ms apart), each badge drops with its star, then the empty row blurs up and out.

## v2 round 9 (current)
**Critic r08:** 7 / 7 (v0 lost the blind pick to a real HUD frame; v1 won), one defect, no hard caps.
- Biggest gap: the payoff was a stuttering, frame-duplicated slow-mo of flat grey asphalt.
- The star and badge system was a HUD copy, not an authored title moment.

**Defect: the stutter is gone, because the slow-mo is gone.**
- **The problem.** Every slow-mo route has now failed on this source. `s119` is 30 fps at the master, so:
  - blend interpolation ghosts (r07);
  - repeated real frames step at 15–20 fps (r08);
  - `mci` optical flow smears the tumbling SUV into a blob (tested in r08).
- **The fix.** The payoff now plays at 1×. The hit moved from the apex (frame 94) to the lift (frame 68): the SUV's nose comes off the road in a burst of smoke, under the flash.
  - The whole flip, from roll to apex to tumble out of frame, then plays at full speed under the maxed row from 4.5 to about 5.7 s. That answers the critic's "SUV still mid-flip during 4.6–5.4".
  - `s119` is now one unbroken 1× shot in both variants: v0 from frame 29 at 3.20, v1 from frame 4 at 2.35. Both reach frame 68 at 4.50.
- **Deleted:** `assets/clips/s119-apex-ramp-v.mp4`, `build-apex-ramp.py` and the `#e0` element, plus v1's 1.16 punch-in on it.
- **Checked:** a frame-difference scan of both MP4s finds no near-zero consecutive pair (none under 1.0 mean grey difference at 270×480). Frames 135 and 136 (the hit) differ.

**Hold**
- `Look.push`-style continuous push from the hit: 1.025 (v0) or 1.03 (v1) → 1.08 over 1.6 s, origin `42% 34%` toward the flip. It continues the shot's own push with no scale jump.
- 4.5–5.7 is the SUV rolling, upside down and tumbling. Only the exit (5.7–6.1) is road, debris and distant police cars.

**Strobe: white fills, coloured light (critic fix)**
- The solid red and blue "gel" fills are gone, in both variants. Fills stay `#FFFFFF`.
- One `police(time)` function (pure, per frame) drives both:
  - the top-corner washes;
  - the colour of the stars' bloom (the Look.bloom recipe as drop-shadows: a white 1.5 px core, then 12 px and 36 px halos in `#FF3B3B` / `#3B82FF` at strength .6 × the hit spike × the step shape).
- Steps are 4 frames (≈0.13 s; the critic asked for 0.12, but 4 frames keeps the steps even), with shape `[1, .94, .78, .48]`, red first, on the hit.
- The corner washes now alternate in sync with the star light, so the stars read as lit by the police lights. Before, the washes ran on a separate 0.4 s cycle.

**Badges (critic fix):** flat `#8E1620` with a 2 px `#3A0A0E` rim. The radial gradient, inset highlights and drop shadow are gone. v0 stays at 64 px; v1 stays at 72 px to sit under its 112 px stars.

**v1: the title lands on the hit (critic fix)**
- MOST WANTED starts its masked char roll at `tH − 0.16` (14 ms → 12 ms stagger, 0.32 s `expo.out`, lines 0.02 s apart). It is about 90% up on frame 134 and whole on the flash frame (135), together with star 5's slam and the RGB split.
- SHOTS FIRED rises out 0.13 s before each new title starts, overlapping it by a frame, so there's never an empty slot.

**v0: designed exit and empty stars (critic fix)**
- From 5.50, the stars un-fill right to left, 40 ms apart (each fades over 0.1 s inside the per-frame `lit()`), and each badge drops (scale .72, 0.14 s) with its star.
- At 5.68 the empty row blurs up and out (6 px, y −12, 0.3 s, `power3.in`, 12 ms stagger). The scrim goes with it. Everything is gone by 6.03, and the last frame (6.067) is clean footage.
- Empty v0 stars now have a .25 white body under a .5 dark rim with a fine white edge, which is the game's dim slot. Checked on the bright yellow `s096` plate (1.6 and 2.0 s): they read.

**Hero time 5.36 s** (frame 161, source frame 94):
- v0: five white stars with a red police bloom, flat oxblood badges, the red corner wash, and the SUV upside down with its blue light bar and the police line behind.
- v1: MOST WANTED, white stars with a red bloom, the badges, and the upside-down SUV behind the lockup.

**Checked:** frames 0, 48, 60, 69–72 (v1 title roll), 95/96 (v0 cut to `s119`), 110, 130–183 every 2 frames (hit, flip, un-fill, exit), 133–138 (the hit) at full size, 150–162 (hero candidates) and 182 (the last frame, clean in both). `hyperframes check`: 0 errors, 2 structural warnings (as before).

**Unresolved.** `s119` carries in-game motion blur on the fast roll (4.6–5.0). The flipping SUV passes behind v1's lockup, which reads as intended but makes the hold busier than the clear-road layout of earlier rounds.

## v2 round 8
**Critic r07:** 7 / 7, two defects, no hard caps.
- Biggest gap: the stars and badges are the hero object, but they were a flat glyph star and Material-style maroon discs.
- The payoff hold played on a ghosted blend slow-mo.
- v1's title and stars sat 550 px apart.

**Defects**
- **Ghosted slow-mo (both variants): fixed by using real frames only.**
  - I tested the critic's `mi_mode=mci` recipe (`mc_mode=aobmc`, `vsbmc=1`, and a bigger motion search). Every interpolated frame smeared the tumbling SUV into a dark blob and broke up the gunman's arm. The source is 30 fps (the 4K master too), so nothing to interpolate from.
  - The new `assets/clips/s119-apex-ramp-v.mp4` (built by `assets/clips/build-apex-ramp.py`) uses no interpolated frames. It is a 3-frame hit-stop on frame 94, the SUV upside down, wheels up, police line behind. Then a speed ramp of duplicated real frames runs from 0.45× to about 0.8× through frame 122.
  - The impact lands on a freeze, the hang reads as slow motion, and every frame is sharp. The continuous push keeps even the held frames moving.
  - `s119-apex-slow-v.mp4` is deleted.
  - The critic's other route (hold `s119` at 1× from media 2.9 for 1.9 s) would run past the 4.1 s shot. So the piece is now 6.1 s, not 6.4, and the post-apex source fits a 1.6 s ramp.
- **v1 frame 0 grey pole: fixed.** `s096` now starts at media 0.47 (frame 14: the street with the green sports car). Checked frame 0.

**Biggest gap, both variants: the star and badge are now drawn objects**
- **Star:**
  - inner radius .40, optically centred;
  - a 2 px `rgba(10,10,16,.55)` keyline outside the fill, as in the HUD evidence ref;
  - a 1 px lit top edge (white .6, clipped inside the star, fading out by 60% of the height);
  - a cool shade toward the bottom (.13);
  - faint facets: the clockwise half of each point is shaded at .045, so it reads as a bevelled object and stays white;
  - lit stars carry Look.bloom #FFFFFF at strength .5 (as SVG drop-shadows), spiking on the hit.
  - An earlier pass used facets at .075 and shade at .2; they read as silver clip-art, so I halved them.
- **Unlit stars:** a thin 2 px white outline at 45% on a hairline dark edge, with almost no fill. "Sparse and thin", and still readable on the black car roof and on sky.
- **Gap:** 0.4× the star width.
- **Badges are objects:**
  - a radial `#A3121E → #6E0B14` disc;
  - an inset 1 px `rgba(255,255,255,.22)` lit top edge and a soft inner bottom shade;
  - a 2 px dark keyline ring (as in the evidence ref);
  - a `0 8px 18px rgba(0,0,0,.45)` contact shadow.
- **Glyphs:** all five redrawn as 2.5 px round-cap strokes on a 32-unit (8 px) grid:
  - eye with pupil;
  - handset with two call waves;
  - crosshair;
  - police car front with a light bar;
  - helicopter.
- **Badge size:** v0 64 px (32 px glyph), v1 72 px (36 px glyph), so the stars lead.

**v0 payoff light (the critic's fix)**
- **Star strobe:** on the hit, the whole lit row strobes `#FF3B3B` / `#3B82FF` in 2-frame (≈70 ms) steps, three pairs, with a coloured bloom at .6. Then it settles from blue to white over 0.3 s `expo.out`. Star 5 no longer double-blinks (the strobe replaces it); stars 1–4 keep the game's blink.
- **Row streak:** one 1500 px lens streak (cool left, warm right) crosses the full row at 4.5, plus star 5's flare.

**v1 lockup**
- Label (262), title (306–554), star row 56 px under WANTED (610–722), badges (746–818): one unit.
- The bottom scrim is gone, so the action below stays bright. The top scrim is 1200 px tall at .66.
- Stars are 112 px on a 44 px gap: x 172–908 (124 px would have broken the safe width at a 0.4× gap). Title size is kept at 132 px.
- **Faces under the lockup.** `s113` cannot work under a top lockup. Lucia's eyes travel from y 710 to 480 and from x 216 to 970 across the shot, so clearing y 818 needs a 1.8× upscale. So v1 now runs `s119` unbroken from 2.35, from the gunman firing on the charging SUV ("SHOTS FIRED" lands on the muzzle flash and sparks). That is a better match than Lucia anyway. Star 4 lands on the sparks burst at the grille (3.20) instead of a cut.
- `s096` and `s014` are scaled from the top (1.18, 1.26), so the patrol driver and the cops at the mural sit below y 830. Checked at 0.5, 1.5 and 2.0.
- The final title reveals a touch faster (0.45 s, 14 ms stagger), so MOST WANTED is whole by 4.73.

**Timing**
- 6.1 s.
- The strobe runs 4.50–5.50, then fades over 0.3 s.
- Exits run from 5.58 over 0.42 s, so everything is gone by about 6.05. The last frame (6.067) is clean footage in both variants.
- The five-star row holds from 4.5 to 5.58, then blurs out.

**Hero time 4.733 s** (frame 142, 7 frames after the hit, on source frame 96):
- v0: blue stars mid-strobe with the keyline and bloom, the badges, a blue strobe top right, and the SUV upside down with its light bar and the police line behind.
- v1: MOST WANTED whole with its red ghost, red stars, the badges, and the SUV upside down under the lockup.

**Checked:** frames 0, 0.5, 2.4, 2.7 (v0 Lucia: eyes under the badges), 2.8, 3.2, 3.6, 4.2, the hit sequence (frames 132–150), 4.9, 5.2, 5.5, 5.9 and 6.067. The lint warnings left are structural (`#ov` nesting, file length). The strobe ellipses now carry `data-layout-allow-overflow`.

**Unresolved.** `s119` carries in-game motion blur on the tumbling car, and the hold is a duplicated-frame ramp, so the slow part steps at about 15–20 fps by design. v1 no longer uses Lucia.

## v2 round 7
**Critic r06:** 7 / 7, no defects, no hard caps. v0 lost the blind pick to a real game frame. Biggest gap: v0's money frame was a motion-smeared, push-softened `s119` side roll with a barely visible strobe. v1 was the library's stock look (letterbox, wide Archivo, sunset word, `s098`), with a centred five-star row that read as a review rating.

**v0, HUD corner**
- **Recast payoff: the flip apex, sharp, in slow motion.** Frame-by-frame, the critic's suggested range (media 2.2–3.0) is the side roll: close, dark and smeared in every frame. The readable "SUV upside down in mid-air" image is at media 3.03–3.25. So the 1× `s119` now runs media 1.733 → 3.033 over 3.20–4.50 (charge, lift and roll at full speed), and star 5 lands on the apex, where the shot hard-ramps into a pre-slowed 0.5× clip (`assets/clips/s119-apex-slow-v.mp4`, `minterpolate` blend). Even frames are real source frames. The hero, frame 143 (4.767 s), is one of them: the SUV upside down, wheels up, over a Vice City street with police cars behind it and the masked shooter in the foreground.
  - Tried first and dropped: a 0.5× ramp from media 2.40 (the side roll). The hero showed "083" on the car's flank filling the frame, with ghosting on the blended frames. `mci` interpolation warped the lettering, so blend stays.
- **Push** on `s119` is one continuous 1.03 across the ramp (was 1.07).
- **Strobe is now visible.** Hard red/blue alternation from the top corners. Each colour fires every 0.4 s, half a period apart, with an 8-frame attack/hold/decay shape. Peaks .95/.95, from 4.50 to 5.90, then a 0.3 s fade. Red fires on the hit frame. In the hero, blue is at full behind the HUD.
- **Payoff star.** Star 5 ignites at 1.6 → 1 (stars 1–4 at 1.2 → 1), with a 2.4× flare and a 1400 px streak. The lit cores carry a white bloom (the Look.bloom stack as SVG drop-shadows, strength .45) that spikes 2.6× on the hit and settles over 0.9 s.
- **Game proportions.** Badges are 92 px with 50 px glyphs (was 66/38), centred under each star (right 160, gap 36, top 380). Ghost slots are a dim filled grey `rgba(255,255,255,.22)` with no outline, as in the official HUD. They read on the black car roof in the opening and on the mural through the scrim.

**v1, Centre hero: rebuilt full-bleed**
- **No letterbox.** The bars and the `-h` shots are gone. v1 is full-bleed `s096 → s014 → s113 → s119` charge, then the same apex ramp, holding the payoff shot to the end (no recut to a used shot). `s098` and `s055` are no longer used.
- **One accent: police.** The sunset fill, the orange bloom and the sheen are gone. The title is pure white with a soft dark lift (drop-shadows on each line, so the char masks don't clip them). The stars carry the colour, cycling white / blue / red in 0.1 s steps. WANTED takes a 3 px red ghost (left) or blue ghost (right) on the first 2 frames of each coloured step. Red/blue corner strobes (.8) light the title from behind.
- **HUD identity, not a rating.** The stars go from 104 to 124 px, with the reason badges (100 px) under them, filling left to right. The title goes from 120 to 132 px, at width 112% so the longest line stays near 740 px. A fit check steps the size down if a custom line exceeds `titleMax` 780.
- **Layout and faces.**
  - The title sits at y 306–554 over sky and buildings. In `s113`, `.v1 #c0` is `translateY(260px) scale(1.28)`, so only Lucia's cap is under the title. Her eyes sit well below it (checked at 2.6 and 2.93 s).
  - The star row moved up 30 px (to 1120) and `.v1 #e0` punches in 1.16 from the top right on the hit. Together these keep the masked shooter's face below the badge row through the hold (checked at 5.0, 5.3, 5.53 and 5.93 s): the first badge sits on his cap, never his eyes.
- **Opening.** `s096` now starts at media 0.42: a street with a police car, not a foreground trash can. The green sports car passing as SUSPECT SPOTTED lands reads as the suspect.

**Both**
- **Lint.** `c0`/`c1` were the same source, start and duration (`duplicate_media_discovery_risk`), so it's now one element shared across variants. The remaining warnings are structural (`#ov` nesting, file length) or intentional (the strobe ellipses sit off-canvas at the corners).
- **Hero time 4.76 s** (frame 143). `ffmpeg -ss 4.967` landed on frame 150, a blended frame, so the hero time is chosen just under an even slow-clip frame. v0: the full HUD, blue strobe behind it, star 5's streak tail, and the SUV upside down. v1: MOST WANTED in white, red stars mid-flash, blue strobe top right, the SUV upside down with police cars behind.
- **Checked frames:** entrance (0–1.5), 2.6 (Lucia, both), 3.6 and 4.2 (1× roll), 4.50/4.53 (hit), 4.6, 5.3, 5.53, 5.7, 6.1, 6.2, and the last frame (6.367), which is clean footage in both.

**Unresolved.** `s119` carries in-game motion blur, and its reticle sits right of centre. Blended (odd) slow-mo frames show light ghosting on the tumbling car. In v1, the 1.16 punch-in softens the hold slightly.

## v2 round 6
**Critic r05:** 7 / 7, no defects, no hard caps. Biggest gap: both were clean versions of the obvious idea with no image or light moment; v0 ended on flat grey s119 with a milky flash; v1's five white stars read as a product rating and its titles flipped before they could be read.

**v1, Centre hero**
- **Three titles, not five.** SUSPECT SPOTTED (0.40–2.18), SHOTS FIRED (2.35–4.33), MOST WANTED (4.50–5.88). Each holds 1.4 s or more (rule: 1.2 s). Stars still light on every cut; `titleAt` maps titles to stars. AIR UNIT INBOUND is gone (it landed on a shot with no aircraft).
- **Shots.** `s083` (Lucia and Jason lounging) is replaced by `s055` night truck ramming a dumpster with sparks (3.20–4.30), and the closer is `s055` again as the truck drives off (5.75–6.40). The edit now intercuts the getaway with the explosion, all at night, and the closing shot carries the title and stars until the exit, so there's no empty band.
- **Wanted stars, not a rating.** Stars 104 px on a 40 px gap. On the hit the lit row cycles white / red #FF3B3B / blue #3B82FF in 0.1 s steps for 0.6 s (ignition white first, so the hit frame reads as light; ends on blue, then holds solid white). A red/blue strobe wash (the v0 `#strobe`, 0.5 peak) pulses at the bottom band's left and right edges, 4.52–6.3.
- **One light moment.** `Look.leak` removed (it decayed into a brown smudge on the bar). WANTED gets a `#FE8E4E` bloom, written as drop-shadows because the type is gradient-clipped (a text-shadow under `background-clip:text` muddies the fill). It spikes to 2.6× on the hit and settles to strength 0.7 by 5.7. Strength 0.45 measured as almost invisible on the black bar (background 20 → 25), so it was raised to 0.7. The sheen at 5.0 stays. The streak on star 5 is back to normal width, so the payoff isn't a stack.
- **Flash.** The band now uses the same 2-frame hot exposure as v0 (exposure 2.0 on `s098`), not the old 0.42 grey flash.

**v0, HUD corner**
- **Grade and hit.** `#d0` (s119) gets `contrast(1.14) saturate(1.12) brightness(.95)`. The 0.3 grey flash became a frame-exact hot exposure: a white layer with `mix-blend-mode: overlay` (highlights blow out, blacks stay black) at 0.6 on the hit frame and 0.3 on the next, plus a brightness kick on the shot (2.2× → 1.6 → 1.24 → 1.07). Checked frames 134–137: frame 135 is hot, 137 is back to the grade.
- **Frame-exact payoff.** Effects that started exactly on t5 (chroma, the old flash) first showed one frame late (the renderer lands just under 4.5). The hit, chroma and shake now start half a frame early (`tH = t5 − 1/60`), and the hit is stepped per frame, so they all land on the ignition frame.
- **Slots visible from frame 1.** The slot stroke is `rgba(255,255,255,.65)` at 2 px. `s014` starts at media 1.1, and `#a0` is scaled 1.1 from the top, so the empty row sits fully on the black car roof for the first ~0.6 s and then reads on the mural.
- **Crisp, bigger HUD.** 112 px stars, 16 px gap, `right: 150px` (row x 306–930). Core glow cut to `0 0 5px rgba(255,255,255,.3)`, `stroke-linejoin: miter` for sharp points (both variants). Badges are flat `#82262B` discs, 66 px with 38 px glyphs, re-centred under the stars (right 173, gap 62, top 386). The scrim is re-centred on the wider row. Lucia check at 2.75: the badges sit on her cap, and her eyes are well below them.
- **Strobe** runs 4.52–6.3 with a slower decay, so the police light is still in the frame through the hold.

**Both**
- **Exits end on the last frame.** `out` 5.88, `outDur` 0.42 with a tight stagger: everything is gone by 6.36 and the last frame (6.367) is clean footage, with no empty tail.
- **Hero time 5.0 s.** v0: the police SUV mid-roll ("083" and its blue light bar) under the full HUD with a blue wash top right. v1: MOST WANTED with the bloom, blue stars mid-flash, the helicopter explosion, and a blue wash at the band edge. At 5.6 v1's stars are back to solid white, which is the rating look the critic flagged.

**Unresolved.** The `nested_structure_needs_subcomposition` lint warning on `#ov` is structural and harmless. `s119` mid-roll frames carry in-game motion blur.

## v2 round 5
**Why a rebuild.** The owner rejected the v1 look ("basic, not professional or clean"). Rounds 1–4 were a tidy star widget over soft `assets/plates` footage, with no finishing layer, no edit and no light. Kept from v1: the component's job, the five-star blink logic as a pure function of time, the game's right-to-left fill and double blink in the corner, the dark-red reason badges, the frame-exact `onFrame` timing, and clean last frames for looping.

**What was built**
- **Footage.** 4K `assets/shots` only, cut on every star with a per-shot push (1.03–1.07). `Look.install` (grain .16, vignette .5) runs on plate renders.
- **Star.** Our own slim 5-point star (inner ratio .41).
  - Ghost slots: dark fill with a fine white edge in v0, a 2 px white-50% outline in v1, so the five-slot meter always reads.
  - Lit stars are solid white with a soft bloom.
  - Ignite: the core scales from 1.3–1.5 to 1 (`expo.out`), with a screen-blended flare and a thin anamorphic streak that grows and fades over 0.55 s. Star 5's streak is 1300–1500 px wide.
- **v0, HUD corner.**
  - Badges are 62 px with 36 px glyphs. The witness glyph is now an eye: the r04 critic said the dim second bust read as mush.
  - Glyph order follows the footage: witness, 911 call, shots, vehicle, helicopter.
  - Badges enter with blur and scale. On exit, the whole HUD blurs out right to left.
- **v1, Centre hero.**
  - Level titles change on each star through a mask roll: the old title rises out over the 0.17 s before the star, and the new one rises in by character (18 ms stagger) on the star's frame.
  - Titles: SUSPECT SPOTTED → HOT PURSUIT → SHOTS FIRED → AIR UNIT INBOUND (just before the helicopter appears) → MOST WANTED.
  - The letterbox bars stay in `bg:none`. They suit a 16:9 clip centred in a vertical canvas, the most common GTA gameplay upload format.

**Fixed during this round's re-captures**
- **v1 star row invisible.** The letterbox bars were painted after the HUD in `#ov`. The bars now come first.
- **Titles overlapping at the payoff.** At 4.6 s, "AIR UNIT INBOUND" was still in the mask (`power3.in` is slow to leave) under the chroma split. The old title now leaves at star − 0.17 s over 0.15 s (`power2.in`).
- **Exits crammed into the last 3 frames.** `power3.in` over 0.3 s left the HUD at 80% at 6.1 s. Exits now start at 5.82 over 0.4 s (`power2.in`) and finish by 6.31. Frames 6.30 and 6.37 are clean footage in both variants.
- **Badges crowding Lucia's face** (v0, 2.35–3.2). `#c0` gets `translateY(170px) scale(1.2)`, so her eyes sit below the badge row. Checked at 2.75 s.
- **Payoff flash.** It washed out the daylight flip in v0, so v0 now uses 0.3 and v1 0.42 (`payoff.flash`). In v1 the flash is confined to the band (`host: #stage`), so the black bars never go grey.
- **Corner scrim in `bg:none`.** It showed as a visible dark oval. The gradient now has five softer stops and runs at 50% on a transparent overlay.
- **Explosion too short to hold the payoff.** `s098` now plays at 0.75× (`data-playback-rate`), so the burst still lands at about 4.52 and the explosion holds until 5.75.

**Hero time: 5.6 s.** v0 shows the SUV airborne over a sharp street, with police cars and debris and the full HUD with five badges. v1 shows "MOST / WANTED" over the helicopter explosion, with the warm leak fading. Mid-flip frames (4.7–5.3) are heavy in-game motion blur, so the hero avoids them.

**Checked:**
- 360×640 legibility: badge glyphs read, and v1 reads instantly.
- Title roll bursts at 1.1–1.37 and 4.27–4.63.
- Fit: every title is ≤ 753 px, centred at 540, so the right edges stay ≤ 916 (inside 936).
- `bg:none` headless previews for both variants.

**Unresolved / for the critic.** v0 deliberately has no type: it is the game HUD. Its hero is the star row plus the edit. The one lint warning (`nested_structure_needs_subcomposition` on `#ov`) is structural; it was there in v1 and doesn't affect the render.

## v1 history (rejected look, rounds 1–4): lessons kept
- **Seek safety.** Star light, blinks and level-name state are pure functions of time inside one `Look.drive` / `KitMotion.drive`. Kicks start on the first frame on or after a star time (`onFrame`), so a start scale is never skipped when a time falls mid-frame (2.35 s → frame 71).
- **Game language.**
  - Lit stars sit right-aligned with the ghosts on the left, and the newest badge is furthest left.
  - A new star blinks on/off/on/off/on in 3-frame steps.
  - A long, slow row flash means "the cops lost you", so the maxed row must hold solid, never end on a flicker.
- **Legibility.** Pale white ghost slots vanish on bright sky. Dark ghosts with a fine white edge hold on sky, smoke and road.
- **Crosshair.** Gameplay shots draw a reticle near frame centre (`s119` included). Keep type off the centre.
- **Loop.** The overlay must be fully gone at least one frame before the end.
- **v1 scores:** r01 7/6, r02 7/6, r03 8/6, r04 7/7. All rejected by the owner as the basic card look.
