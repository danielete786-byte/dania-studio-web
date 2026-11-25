# Decisions: 07 Release countdown

## v2 concept
- **The idea.** v0 *Rolling digits*: the clock is the edit, and the digits own the frame. Every tick is a cut, and the footage runs from day to sunset to night to midnight at the club, so midnight lands on screen: the 460 px day numeral rolls 30 → 29 and the clock cascades 00:00:00 → 23:59:59 on the hard cut to the sequin dancer under blue flares, which then holds as one speed ramp to the end. v1 *One day left*: a launch-eve title that counts down 3 → 2 → 1 on the cuts and lands the "1" on the cut to Lucia; then a big live clock, "23:59:01 TO GO", drops in and ticks while she holds the lens.
- **Shots and cuts.**
  - **v0 (since r09)** is full bleed with `-v` shots. Every cut is a clock tick: 1.2, 2.2, 3.2 and 4.2 (payoff). The type fills y 300–913, so each shot is framed to keep its subject under the clock.
    - s135 skydive over Vice City, in-point 0.2 (0–1.2)
    - s100 biplane trailing pink smoke over the beach, in-point 0.5 (1.2–2.2), scaled 1.18× from its top edge (`#lift100`) so the plane sits under the clock
    - s026 sunset pier, in-point 0.3 (2.2–3.2), scaled 1.36× from its top edge (`#lift026`) so the woman's face sits under the clock, not behind DAYS LEFT
    - s123 night drive under the skyline, in-point 0.2 (3.2–4.2): `assets/clips/s123-night-drive-clean-v.mp4` (aim reticle removed by `delogo`, keyframe every 30 frames), scaled 1.2× from its top edge (`#lift123`)
    - s039 sequin dancer under blue flares (4.2–7.0, the payoff and the hold): `assets/clips/s039-dancer-ramp-v.mp4`, a two-part speed ramp. Frames 34–56 (the hair whip, the sequins, the flare) are slowed to 0.34× with `minterpolate` mci (2.07 s). Frames 57–79 play at native speed (0.77 s: the dancer turns into the neon tubes). It ends before the source's own cut at 2.667 s. It is reframed 1.15× from its right edge (`#lift039`) and lifted (brightness 1.32).
  - **v1** is full bleed with `-v` shots:
    - s027 sunset dock, in-point 0.2 (0–1.6, "3")
    - s108 couple on a balcony at sunset, native (1.6–2.9, "2")
    - s018 Lucia at the gate (2.9–7.0, "1"): `assets/clips/s018-lucia-slow-v.mp4`, source from frame 16 pre-slowed to 0.565× with `minterpolate` mci, held with a push to 1.10
- **Where the type sits.**
  - **v0:** the countdown owns the top half, centred on x 540: the numeral (cap y 300–631, ink about x 180–900), DAYS LEFT (cap y 677–723), the clock (cap y 820–913), over a soft top scrim that eases back to 55% on the payoff (the club is dark already). The Rockstar date line, now "GTA 6 · November 19, 2026", and the platforms sit low (y 1336–1405) over a floor scrim and a very soft spot. There is no top kicker: the numeral starts the frame.
  - **v1:** the title block is left-aligned in the lower half (y 927–1405, x 84–913), on the dark shirts below the faces, with a soft bottom scrim.
- **Hero size and face.**
  - **v0:** a sunset "29" in Archivo Expanded 900 at 460 px (about 331 px cap), alone and centred. DAYS LEFT is one Archivo Expanded 800 line at 64 px, tracked 0.12 em. The clock is Inter 800 at 128 px, tracking −0.02 em, pure white digits in fixed tabular slots, case-height colons at 86%. The footer is Archivo 600 at 26 px, tracked 0.3 em.
  - **v1:** a 320 px sunset "1" with DAY / LEFT (about 138 px) stacked to its cap height. The live clock "23:59:01" is Inter 800 at the words' size, left-aligned on the block's ink edge under LEFT, with a 26 px "TO GO" on its baseline. Kicker (Rockstar date style), label and platforms are 26 px Archivo 600.
- **The payoff hit.**
  - **v0 at 4.2 s:** every reel starts 0.12 s before the cut (expo.out, 0.35 s), so "29" and the 23:59:59 cascade have settled on the cut frame. The numeral punches 1 → 1.05 → 1. A warm additive flash (screen blend, `#FFE2B8`, peak 0.28, radial around the numeral, between the footage and the type, 2 frames up and 4 down), a shake, a punch zoom and an RGB split land with it. The numeral's bloom spikes to 0.7 in the warm light and settles to 0.35 in the club's blue (`#8E8CFF`) over 0.5 s (expo.out). A sheen crosses "29" at +0.3 s.
  - **v1 at 2.9 s:** the "1" slams in on the cut to Lucia and the "S" of DAYS drops out. There is a flash, shake, a warm light leak across the top of the frame and an RGB split. The "1" blooms golden (`#FEB747`, 1.1 → 0.6), DAY / LEFT flush and bloom, a sheen crosses the "1" at +0.3 s, then the clock drops in reel by reel from 3.05 s.

## v2 round 9 (r08 critic: v0 7/10, v1 8/10, both won the blind pick)

**v1 is unchanged (locked at 8).** The critic listed polish for v1 (a warm flash, rolls on the cut, drop "TO GO", maybe re-cast s018) but no defects. `tools/gta/sticky_status.py` locks a variant once it scores 8 and its render doesn't change, and the capture warned when my first pass changed it (SSIM 0.966). So I reverted every v1 change and kept the work on v0. The final r09 v1 render is SSIM 0.9925 against r08 (unchanged).
- `build1` and the v1 CONFIG are byte-identical to r08.
- The shared `sceneLight` gained `decay`, `typePeak` and `tintK` parameters. Their defaults (0.6, 1.5, 0.5) reproduce r08 exactly, so v1 runs on the defaults.
- **Not done for v1, so it stays locked:** the warm flash, the 0.12 s roll lead, dropping "TO GO" (I'd fold "FINAL DAY" into the platforms line: "FINAL DAY · PS5 · XBOX SERIES X|S" fits at x 84–820), and the s008 re-cast. For s008 I looked at the shot: Jason's bright white tank top fills the lower half where the block lives, and it's daylight, which breaks the golden-hour concept. I'd keep Lucia even if v1 is reopened.

**v0 biggest gap: the digits are now the hero (critic's layout).**
- `maxNum` 300 → 460. The numeral stands alone, centred, cap top y 300 (331 px cap). I solve its width against 792 px, not the critic's 864: 864 centred on x 540 would end at x 972, past the safe zone's right edge (936). At 460 px, "29" is about 720 px of ink, so the cap binds first anyway.
- DAYS LEFT is one Archivo Expanded 800 line at 64 px, tracked 0.12 em, 46 px under the numeral. Each glyph is kerned in its own mask, and it drops in from above.
- The clock is Inter 800 at 128 px, cap top y 820. The type now fills y 300–913, where r08 had a dead band from 650 to 1330.
- The top kicker is gone (it would sit 20 px above a 460 px numeral). "GTA 6" moved into the footer date line: "GTA 6 · November 19, 2026".
- **Sizes:** 460 / 128 / 64 / 26. That is four sizes, one more than DESIGN's "at most 3". DAYS LEFT reads as the numeral's unit, so I followed the critic's spec rather than shrink it to the footer size or drop the footer.
- **Framing for the bigger lockup.** s100 is scaled 1.18× from its top edge so the plane sits under the clock. s026 is scaled 1.36× from its top edge: at 1.0× the woman's face sat right under DAYS LEFT.

**v0 payoff re-cast: s039 from 1.13 s, the sequin dancer under blue flares.**
- The purple-crowd half (in-point 0.04) is gone. The payoff cut lands on the lit half of s039.
- **The fog hold (s055) is gone too.** The club shot holds 4.2–7.0 as one shot, so the payoff isn't followed by mud. The 5.2 tick no longer cuts.
- **Why a ramp, not the critic's 0.72× from 1.15 to 2.6.** That window is 1.5 s of source, and the hold needs 2.8 s. My first try was a uniform 0.52× (frames 34–79). Frame checks showed `minterpolate` ghosting a man's face into a double face at 6.4–6.6 s (source frames 66–71 are sharp; the interpolated frames are not). So the clip is now a two-part ramp: frames 34–56 at 0.34× (whip, sequins, flare: abstract texture, where interpolation smear reads as motion blur), then frames 57–79 at native speed (the faces in the crowd stay sharp). The ramp back to real time lands on the 6.2 s exit.
- **Faces.** In the flare section, a defocused clubber's face sat behind the "2" (r09 hero test at 5.5 s). The hold is reframed 1.15× from its right edge (`#lift039`), which moves him to the frame's left edge, clear of the numeral. The men's faces in the native-speed tail only rise once the type is leaving.
- **The exit moved to 6.2 s** (`variants["0"].out`, which overrides `timing.out` for v0 only). The 29 DAYS read holds 4.2–6.2, the 5.2 tick rolls the clock to 23:59:58, and the final frames are the dancer turning into the neon tubes, with no type.
- **Grade:** the club hold is lifted (brightness 1.32, contrast 1.08, saturation 1.18), and the top scrim eases from 100% to 55% just after the payoff. The shot is dark already, and the scrim had been flattening it.

**v0: the warm flash replaces the grey veil.** r08's `Look.impact` flash was 0.5 white, which lifted the frame from 52 to 134 average luma: a grey dip. Now `Look.impact` runs with `flash: 0` (shake and zoom only), and `warmFlash()` adds a radial `#FFE2B8` wash in screen blend, peaking at 0.28. It sits at z 5, between the footage and the type, so it lights the shot, not the glyphs. It runs 2 frames up and 4 down. Average luma now goes 52 → 62 → 67 → 62. The numeral's bloom spikes to 0.7 in the warm light and settles to 0.35 in the club blue over 0.5 s (critic's values; r08's 1.1 / 0.6 were above them). DAYS LEFT and the clock flare to 1.0 (was 1.5), and their fill flushes 35% toward the light (was 50%).

**v0: every roll lands on its cut.** Each tick's reels start `lead` = 0.12 s early, with expo.out over 0.35 s. At the cut frame a reel is about 90% landed and fully settled within 2–3 frames. On the payoff, the day reels go first and the clock cascades 15 ms apart behind them. I checked frames 125–128: "29" and 23:59:59 are landed on the cut frame (126).

**Check:** 0 errors, 42/42 contrast. There are 8 info items: DAYS LEFT's letters pass under the numeral's reel window while they drop in at 0.39 s; the line is masked to its cap band, so this is intended. The 2 lint warnings are the same as r08 (file size and the nested `<svg>`). A `bg:"none"` render of v0 is clean: type and scrims only, no flash, no footage.

**Hero time: 5.5 s.** The payoff cascade has landed and the 5.2 tick has settled.
- v0: 29 DAYS LEFT 23:59:58 over the lit sequins and a blue flare.
- v1: 1 DAY LEFT 23:59:00 TO GO, with Lucia looking into the lens.

**Open:**
- The slowed half of the club shot (4.2–5.0 s) is the hair whip: the trailer's own motion blur plus interpolation smear. It reads as slow-motion blur in playback, but a still from that stretch is soft. That's why the hero is 5.5 s.
- v0 has four type sizes (see above).

## v2 round 8 (r07 critic: v0 7/10, v1 7/10, both won the blind pick)

**Defect fixed: v1 judder on the Lucia hold.** `data-playback-rate` 0.605 repeated a source frame every 2–3 output frames.
- The hold is now `assets/clips/s018-lucia-slow-v.mp4`: s018 from frame 16 (the clean part, after the trailer's own head-lift motion blur that caused the r06 double face), pre-slowed to 0.565× with `minterpolate` mci (aobmc, bidir, vsbmc). It is 4.2 s long and plays at rate 1 for 4.1 s.
- Frame-difference check on the clip: no zero-difference frames, so no repeats. Face crops of frames 40–47 and 100–107 show one clean face per frame.
- The rate is 0.565, not the critic's 0.6, because the payoff moved to 2.9 s (below) and the hold needs 4.1 s from 2.43 s of clean source.

**Defect fixed: v0 judder on s055.** The 0.72× native playback is gone. The hold is `assets/clips/s055-night-truck-slow-v.mp4`: source frames 22–62 pre-slowed to 0.72× with mci. I took that over the critic's other option (rate 1.0 from 0.25 s) after rendering it: the first half second at 0.25 is the murky dumpster crash under dark trees, and 1.8 s at rate 1 can't start later without crossing the shot's own cut at 2.1 s. Frames 22–62 are the clean part: tail lights and the street lamp in the fog.

**Defect fixed: the dead dashboard band and red sill at the v0 payoff.** The payoff no longer lands on s123.
- **4.2 s now cuts to s039, the purple club crowd (in-point 0.04), not the blue half the critic named (in-point 1.3).** I checked the blue half against the type zone (y 240–660): at 1.1–1.3 a dancer's face, at 1.5 a pink-lit man's face and at 1.8–1.9 another man's face all pass through it, so the lockup would cover faces. The purple half is the most saturated night image whose heads all stay below the clock.
- **s123 moved to the 3.2 slot (in-point 0.2, before she rises),** scaled 1.2× from its top edge. The critic's `translateY(-220px) scale(1.12)` would have pulled the frame up and left about 90 px of empty frame at the bottom. Scaling from the top edge does what they wanted: the skyline fills the type zone and the hood drops below y 1500, under the vignette.
- The s123 clip was re-encoded with a keyframe every 30 frames (the compiler warned of 2.13 s keyframe gaps, which risk frozen frames on seek).
- The order now reads day → day → sunset → night drive → midnight at the club → fog.

**Defect fixed: six type tiers in v0. Now three sizes:**
- the numeral (about 255 px);
- DAYS / LEFT and the clock (about 92 px);
- 26 px labels: kicker, date and platforms, all Archivo 600 at 0.3 em. The date dropped from 36 px and keeps its `#EE08F2` offset. The platforms moved from Inter to Archivo.
- Two families: Archivo, plus Inter for the clock.
- `V.width` went from 720 to 780, so the numeral solves to about 255 px (ink x 148–930).

**Biggest gap, v0: the clock is now the second voice.** It was Inter 600 at 64 px and 86% white. It is now Inter 800 at the words' size (`fC.s = Fw`), tracking −0.02 em, pure white digits. Colons are case-height at 86%. It is centred on the lockup's ink at its natural width (about 500 px). I didn't justify it across the full 780 px: the gaps would be about 50 px and the clock would read as three separate numbers.

**Biggest gap, v1: the clock, the shots and the light.**
- **The clock is the second voice too.** Inter 800 at the words' size (about 138 px), left-aligned on the block's ink edge under LEFT. The label is now "TO GO", 26 px on the clock's baseline: "23:59:01 TO GO".
  - **Why not the critic's 96 px.** It would make four sizes (320 / 138 / 96 / 26) against DESIGN's three. The words' size keeps three, and gives both variants one grammar: numeral, then words and clock, then labels.
  - **Why the numeral is 320, not 340.** At 340 the clock plus a label ran past x 936. At 320, "23:59:01 TO GO" spans x 84–913 and "3 DAYS" spans x 84–852.
  - The reels drop in left to right from 3.05 s (0.035 s apart, motion-blurred). Each colon fades in with the digit after it and out with the digit before it, so no colon floats.
  - The ticks are unchanged: 3.8, 4.8, and 5.8 s, when the minutes roll over to 23:58:59.
- **No more kitdemo replay.** s084 (swamp) is gone, because the kitdemo opens on it. "2" is now s108, the couple on the balcony at sunset: dark shirt under the type, face above it, native rate.
  - The cuts moved from 1.5 / 3.0 to **1.6 / 2.9**, so s027 runs 1.6 s and s108 1.3 s, both at rate 1.
  - Lucia stays as the hero hold. It's a deliberate r05 decision, the critic praised the frame, and the library has no other long golden-hour portrait.
- **Kicker** 30 → 26 px, tracking 0.3 em, to match the label size.
- **Block position:** the block moved up (`capTop` 1066 → 990) to make room for the bigger clock. It sits on the shirt, below the collar.

**Light on the numerals (critic's fix, both variants).**
- **One per-frame driver per variant (`sceneLight`).**
  - Before the payoff, the numeral keeps its own sunset glow and the white type a faint white bloom.
  - On the flash, the numeral's bloom takes the scene's colour: v0 club purple `#C86BFF`, v1 golden hour `#FEB747`. It uses Look.bloom's three layers as `drop-shadow`s on the reel group, outside the masks.
  - It peaks at 1.1 and decays to 0.6 over 0.6 s `expo.out`.
  - The words and clock flare, and the words' fill flushes 50% toward the light and settles over 1.2 s.
- **Strengths are above the critic's 0.7 / 0.4.** At those values the bloom didn't show on the test frames against the purple club and the grain. Look.bloom's 0.4 is 0.17 / 0.11 / 0.06 alpha.
- **v0 re-lights on the 5.2 s cut:** the colour eases to sodium amber `#FFA048` over 0.35 s, matching the fog and lamp.
- **The payoff sheen now runs at +0.3 s** (0.6 s), after the flash has cleared. This reverses r07's "sheen on the cut": on the cut, the flash washed it out. v1's slow hold sheen moved from 4.9 to 5.1 s.

**Check:** 0 errors, 57/57 contrast, 0 layout issues. The 2 lint warnings are the same as r07 (file size and the nested `<svg>`). No compiler warnings.

**Hero time: 4.7 s.** Nothing is rolling at that moment in either variant: v1's 4.8 s tick hasn't started, and v0's payoff cascade has landed.
- v0: 29 DAYS LEFT 23:59:59 over the purple club crowd; the words still carry a little of the purple flush.
- v1: 1 DAY LEFT, 23:59:01 TO GO, with Lucia looking into the lens.

**Open:**
- s039's purple half is a shallow depth-of-field shot, so the mid-ground crowd is soft at full resolution. I tried a mild unsharp mask; it gained nothing visible, so I dropped it. The blue half is sharper but puts faces under the type.

## v2 round 7 (r06 critic: v0 7/10, v1 7/10, both won the blind pick)

**Defect fixed: the double-exposed face in v1 (3.0–3.8 s). The ghost is in the source shot, not only the interpolation.**
- I dropped `s018-lucia-slow-v.mp4` and first tried what the critic suggested: `assets/shots/s018` at a native 0.7× rate. The double face was still there at 3.2–3.3 s.
- Frames 5–15 of s018 itself (0.17–0.5 s) are the trailer's own motion blur on Lucia's fast head-lift. Played slowly, by any method, they read as a double exposure. From frame 16 the face is clean.
- **Fix:** the shot now starts at frame 16 (`data-media-start` 0.54), when she is already looking into the lens. It is played natively, with no interpolation.
- **Timing.** The clean part is 2.43 s long. To keep the rate at or above the 0.6 judder floor, the cuts moved from 1.4 / 2.8 to **1.5 / 3.0**. The hold is now 3.0–7.0 at 0.605×, ending at 2.96 of 2.97 s. s084 plays at 0.95× to fill its 1.5 s slot; s027 is native.
- Frames 3.0–4.2 s of the r07 MP4 show one face on every frame. Lucia is sharper than in r06 because nothing is interpolated.
- **What's lost:** the head-lift into the lens. The r06 decision to hold on Lucia stands; the critic praised that frame.

**Defect fixed: the ghosted Jason in v0 (s098 slow-mo).** s098 is gone from v0, along with every pre-slowed clip and the glow spill (`assets/clips/` now holds only the de-reticled s123). See below for why.

**Defect fixed: "1 DAY LEFT" vs "OUT IN 13:59:00".** The demo "now" is `2026-11-18T00:00:58`, so the clock reads **OUT IN 23:59:02**, which agrees with "1 DAY LEFT". It ticks to :01 and :00, and at 5.8 s the minutes roll over to 23:58:59, mid-hold.

**Biggest gap, v0: the letterbox and the dead third. v0 is now full bleed.**
- **The letterbox is reversed, for a concrete reason.** DESIGN.md's variety rule reserves letterbox for cinematic-framing components, and a countdown isn't one. The critic also named the dead black from y 1470 to 1920. Both are fixed by going full bleed.
- **Why not "the same five shots as `-v`", as the critic suggested.** I checked every `-v` crop against the type zone (y 240–600):
  - **s098:** Jason's face sits at y 350–800, right under the lockup. Type would cover a face.
  - **s084:** the wading silhouette's head is at y 470–600, under the clock line.
  - **s039 blue dancers (in-point 1.1):** dancers' faces pass through the zone.
- **The recast** (see "Shots and cuts" above): s100 replaces s084, s039 moves to its purple-crowd half (heads below y 600), and s123 replaces s098 as the payoff.
  - **s123** has the open sky and lit towers above the road. A drive-by at midnight, with police lights on the SUV ahead, is a bigger hit than the default fireworks.
  - **Its HUD.** The `-v` crop cuts off the wanted stars, but the aim reticle is burned in at (671–749, 957–1000) on every frame. That is the "cropped HUD fragment" the r05 critic flagged. ffmpeg `delogo` interpolates the region from its borders. On frames 0.6–1.8 s it leaves no reticle and no visible patch on the moving road.
  - The CSS lifts s123 slightly (`brightness 1.14, contrast 1.06, saturate 1.15`), because the gameplay grade is darker than the trailer shots around it.
- **The hold has two beats (critic's fix).** 4.2–5.2 is the night drive (she rises and aims), and the 5.2 tick cuts to s055 tail lights in the fog at a native 0.72×. Every cut is still a tick.
- **The scrims:** `.scrimT` is 0.6 → 0 over y 0–820, under the lockup. The floor scrim runs from y 1036 down, with a very soft wide spot (0.55) behind the date block, so it holds when a bright car seat or plate light passes under it. They fade in at 0 s and out on the exit. On a transparent export they stay, as part of the graphic.
- **Loop:** the first and last frames are clean footage with no type (s135 and s055).

**v0 hierarchy (critic's fix).**
- **The clock is demoted** from the words' size (Archivo 800, about 104 px) to Inter 600 at 64 px with tabular figures. Its colons are case-height (`"case"`), tracking is 0.08 em, and it is 86% white.
- **"64 px cap" was read as 64 px type.** A 64 px cap height would be about 88 px type, nearly the words' 70 px cap, which is the three-equal-tiers problem again.
- The clock is no longer justified to the lockup width. It's a centred line about 330 px wide, so the numeral clearly leads.
- **The lockup's ink width is 720 (was 780), centred.** Its right edge measures x 899 on the MP4 (was 929). The numeral is about 220 px, at the DESIGN floor.

**Light at the payoff (critic's fix, both variants).**
- **The sheen runs on the cut,** 0.55 s `power2.inOut` (v0 4.2 s, v1 3.0 s). It used to start 0.22–0.55 s after.
- **The white words catch the scene's light** through a new `catchLight` helper, which runs per frame through `Look.drive`.
  - On the hit, the words' fill flushes 50% toward the light colour, and a three-layer bloom (`drop-shadow` on the line container, outside the line masks, so it's never clipped into a band) flares to 1.5× strength.
  - Both ease out over 1.2 s, to pure white with a warm bloom at rest: v0 `#FF9A48` at 0.5 (the critic's `#FF8A3D`, nudged toward the sodium street and lamp light of s123 and s055), v1 `#FEB747` at 0.55.
  - **The strengths are above the critic's 0.3 / 0.35.** At those values the drop-shadow bloom wasn't visible on the r07 test frames against the grain.
  - Before the hit, the words carry a faint white bloom (0.3).

**v1 hold (critic's fix).**
- The push on s018 is now 1.0 → 1.10 (was 1.07). `pushShots` takes a per-shot target, and the dock and swamp stay at 1.07.
- The clock arrives 0.15 s after the payoff (3.15 s; it was 0.35 s after). Its reels roll in right to left, so the seconds have landed before the first tick at 3.8 s.
- Ticks fall at 3.8, 4.8 and 5.8 s (the minute rollover). The slow hold sheen across the "1" moved to 4.9 s.

**Check:** 0 errors, 57/57 contrast, 0 layout issues. The 2 lint warnings are the same as r06 (file size and the nested `<svg>`).
- `.plat i` (the separator dot) went from 55% to 72% white. At 2.8:1 it failed on the night drive.
- `#shake0` and `#shake1` are marked `data-layout-allow-overflow`, because the impact shake overflows on purpose.

**Hero time: 4.75 s.** Neither variant's clock is rolling at that moment.
- v0: 29 DAYS LEFT 23:59:59 in the sky over the night drive, as she rises to aim at the police SUV.
- v1: 1 DAY LEFT with Lucia looking into the lens, OUT IN 23:59:01.

## v2 round 6 (r05 critic: v0 7/10, v1 8/10, both won the blind pick)

**Defect fixed: the cropped HUD fragment in v0 (5.2–6.9 s).** The s123 gameplay hold is gone, and so is the 5.2 s cut. The fireworks shot now runs from the payoff to the end.
- **The fireworks clip is shorter than the critic assumed.** s098 is listed at 1.4 s, but it contains a hard cut to a green night-vision shot at frame 34 (1.133 s). Only 0–1.1 s is usable.
- **So it's slowed to 0.35×, not 0.55×.** Source 0.15–1.135 s becomes 2.7 s, which covers 4.2 s until the band has shut (6.89 s).
- **Motion-compensated, not blended.** I tested both. At 0.35×, `mi_mode=blend` double-exposes Jason's face and the sparks. `mi_mode=mci` (aobmc, bidir) is clean on every frame I checked. The burst starts growing 2 frames after the cut, under the flash.
- **The push:** the fireworks shot is the 5th band shot, so `pushShots` pushes it in 1.0 → 1.06 over the hold.

**Biggest gap, v0 (equal-weight block): a giant day numeral and a smaller clock.** I took the critic's second option, v1's lockup, because their "what a top designer would do" asks for a giant numeral.
- **The lockup:** a sunset "29" with DAYS / LEFT stacked to its cap height (first word's caps on the numeral's top, second word's baseline on its baseline), centred on its ink.
- **Size.** The numeral is solved so the lockup's ink is `width` (780 px) wide, capped at `maxNum` (300). That gives about 235 px. The critic's 300 px doesn't fit: a 2-digit numeral plus stacked words at 300 px is about 1,030 px wide.
- **The clock** is set at the words' size (about 104 px, weight 800). It is justified to the same 780 px ink width with even tracking, so the frame reads as one typographic block: hero numeral, then one secondary size, then the small labels.
- **Colons:** white at 86% with the same faint bloom as the white type, not 62% grey squares. (`.colon .cell` is shared, so v1's small clock colons are also 86%.)
- **Spacing:** the clock sits 36 px under the lockup, with 16 px reel pads either side of that gap, so the big numeral's bottom feather and the clock's top feather never overlap. The kicker sits 0.32× the numeral's cap above it (0.26× crowded the kicker during the punch).
- **The kicker** is now "GTA 6 · Launch countdown", because "Out in 29 days left" doesn't read.
- **Variant difference:** v0 and v1 now share the lockup grammar. They still differ in format (letterbox vs full bleed), alignment (centred vs left), the big live clock vs a small label clock, the night palette and the tick-cut edit.

**v0: the day roll lands on the hit.**
- The days reels roll at 4.17 s (`expo.out`, 0.45 s), one frame before the cut. The clock reels follow from 4.20 s, right to left, 0.03 s apart.
- "29" punches 1 → 1.06 (0.12 s) → 1 (0.23 s) around its own centre. Around the baseline, its top rose into the kicker.
- Frames from the MP4: 4.2 s, numeral mid-roll under the flash; 4.27 s, "29" landed with the chroma split; 4.5 s, settled.

**v0: footage and light.**
- **s055 → s039 blue club.** The critic's in-point 0.4 s would cross a hard cut inside s039 at 1.067 s (from the purple crowd to the blue dancers). I used in-point 1.1 s, the blue dancers under the club lights: the most colour and contrast in the clip. The edit now runs day → dusk → club night → midnight.
- **Light spill.** `#glow0` holds low-res (320×180), pre-blurred copies of each band shot with the same timing. They are stretched to 1080×888 behind the band, blurred 10 px, saturated 1.25× and masked to fade out 140 px above and below. They sit at `glow` (0.18) opacity, fade in with the iris and out with the exit. They're hidden on `bg:none`.
- I made per-shot copies, not one baked spill video, so swapping a shot only means re-making its glow copy. `glow: 0` turns the spill off.

**v1 (passed at 8; the nitpicks).**
- **Leak.** It's now `y .30`, colours `['#FEB747', '#FE8E4E']`, opacity .28, as the critic asked. It crosses the warm sky and fence at the top of the frame, not her shirt. No magenta smudge on the fabric at 3.0–4.1 s.
- **Closing shot: Lucia holds to the end. I did not use s036, the critic's pick.** I built s036 and snapshotted it at 5.8 and 6.3 s. The woman's bright gold sequin dress sits exactly under the lockup (x 320–920, y 1000–1750), so "DAY LEFT" sits on the brightest thing in the frame. In its last 0.4 s she spins, and her hair and arms motion-blur: the "soft" note again, plus type across a body.
  - Instead, s018 is pre-slowed to 0.69× (mci) and holds from the payoff to the end (2.8–7.0 s, pushed 1.0 → 1.07). She lifts her head into the lens during the hold, and the type stays on her dark shirt the whole time, which is the frame the critic praised.
  - The minute rollover still happens at 5.7 s, now mid-hold.
- **Exit fragments.** The underscore-like slivers were the top bars of E, F, T and the arms of Y. As the letters dropped below the baseline, those bars sat in the line mask's bottom feather.
  - The masks already have a 0.16-cap feather (about 17 px, more than the 6 px suggested), so a feather alone doesn't remove them.
  - Each dropping letter now also fades out (0.2 s, `power1.in`, staggered with the drop), so it's gone before its top bar reaches the edge. The same fix applies to v0's DAYS / LEFT.
  - Frames 6.6–6.9 s in both MP4s show no bars.

**Check:** 0 errors. The 2 lint warnings are the same as r05 (file size and the nested `<svg>`). Layout is clean.

**Hero time:** 5.6 s.
- v0: 29 DAYS LEFT 23:59:58, with the fireworks fully bloomed and Jason sharper than at 5.0 s.
- v1: 1 DAY LEFT with Lucia looking into the lens, OUT IN 13:59:00.

## v2 round 5: craft-v2 rebuild (the owner rejected r01–r04 as "basic, not professional or clean-looking")

**Thrown away from v1:**
- the smoked-glass card;
- Barlow Condensed;
- the HRS / MIN / SEC labels;
- the four rows of small-caps chrome;
- the old `assets/plates` footage (p01 Keys sign, p06 Lucia gate);
- the static hold.

**Kept from v1, because those were real lessons:**
- **The reel engine's rules:**
  - pitch = window height, so a rolling slot is never empty;
  - the outgoing digit dims as it turns away;
  - vertical-only motion blur that is exactly 0 at rest;
  - the sunset gradient is anchored to the window (`--sy`), not the cell, so no gradient bar travels with a digit.
- the countdown arithmetic from CONFIG strings, with no clock at render time;
- the Rockstar date treatment;
- v1's cap-aligned numeral + stacked-words lockup. The r04 critic scored that grammar 8 and said it "sits at home next to the official cards".

**How the two variants differ:**
- **v0:** letterbox, centred, cut on every second, ends in a rollover.
- **v1:** full bleed, left-aligned poster block, a held portrait, counts in whole days.

The r04 critic's two gaps are answered by design:
- v0 is no longer a widget over the action;
- v1's hold now counts (a live "OUT IN 13:59:02" clock that ticks once a second and rolls the minutes over on the 5.7 s cut).

**Build details:**
- **Type:**
  - Every size is solved from canvas metrics. `fontStretch = "expanded"` makes canvas widths match the DOM exactly (checked: 800.9 px for both).
  - v0's two lines are justified to 780 px: line 2 sets the size, and line 1's word takes the slack as letter gaps of at most 0.1 em.
  - v1's word size is solved so "DAY" caps align with the numeral's top and "LEFT"'s baseline with its baseline.
- **Letters are kerned per glyph.** Each letter sits in its own clip line (`kernSplit`), spaced by its real advance plus the font's kerning pair, so the per-letter reveals don't lose the A–Y kern.
- **Feathers.**
  - v0's "DAYS" falls through the same feathered window as its digits.
  - v1's word lines are each clipped to their own cap band with short feathers. A falling letter (or the dropped "S") can never show over the other line.
- **Light.**
  - The sunset numerals glow (`drop-shadow` on the group, outside the masks, so the glow isn't clipped into boxes).
  - The white type has a faint bloom.
  - One sheen at each payoff, plus one slow sheen across the "1" during v1's hold.
  - v1 has one light leak, at the payoff.
- **Finishing.**
  - `Look.install` runs last (grain .16, vignette .5) on plate renders.
  - Each shot has its own slow push, alternating push-in and ease-back, so every cut starts a fresh move.
  - v0's letterbox opens from a line at 0 s and shuts by 6.89 s, so the first and last frames are black and the clip loops.
- **Transparent export (`bg:none`).**
  - No footage, band, grain, flash or leak.
  - v0 gets soft top and bottom scrims plus a lift shadow (part of the graphic).
  - v1 keeps its bottom scrim.

**Found and fixed on snapshots and on frames pulled from the r05 MP4s:**
- **An arc of the outgoing "2" under the landed "1" at 2.9 s.** Fast-start rolls (`expo.out`) now fade the outgoing digit within the first 16% of the roll. Slow rolls keep the 60% `power3.in` fade.
- **The dropping "S" showed beside LEFT's "T" for two frames.** The word lines are now cap-band clipped, and the "S" fades out in 0.08 s as it drops.
- **The opening marina aerial was hazy and green.** It's now the s135 skydive over Vice City.
- **The fireworks burst landed half a second after the hit.** The in-point is now 0.1 s, so the burst fires one or two frames after the flash.
- **Colons read as grey blocks.** They're now weight 700 at 62% white.
- **v1's clock digits were tighter than their tracked label.** The slots now carry 0.14 em of tracking.
- **The letterbox wasn't fully shut on the last frame.** It now closes by 6.89 s.

**Deliberate:**
- **The Rockstar date offset.** It's a 1.5 px #EE08F2 offset with a soft magenta bloom, on the v0 date (38 px) and the v1 kicker (30 px). DESIGN.md prescribes it for official dates, so it's a style rule, not a second accent. At these sizes it reads as white with a magenta edge.
- **v1's "3" and "2"** are a dramatic count on the cuts, not a claim about today. The real facts (November 19, 2026; PS5 and Xbox Series X|S) are fixed.
- **The demo "now" values.**
  - v0: one month out, three seconds before midnight (`2026-10-19T23:59:57`).
  - v1: launch eve, today (`2026-11-18T10:00:58`).
- **Check:** 0 errors, 37/37 contrast. The 2 lint warnings are file size and the nested `<svg>` in `#ov`. The StaticGuard "archivo" font notice is a false positive: fonts.css declares Archivo, and the renders show Archivo Expanded.

**Open:**
- The countdown target is local midnight on November 19. Rockstar's unlock time isn't in FACTS.md.
- v0 picks "DAY" or "DAYS" from the starting count. A clip that crosses from 2 days to 1 keeps "DAYS".

**Hero time:** 5.0 s.
- v0: 29 DAYS 23:59:59 settled over the fireworks.
- v1: 1 DAY LEFT with Lucia looking into the lens, OUT IN 13:59:00.

---

## v1 history (r01–r04: the rejected look, kept for its seek-safety and timing lessons)

### Polish round 4 (r03 critic: v0 6/10, v1 7/10, both won the blind pick)

The aim was a clean finish, not a redesign. Every listed defect is fixed and checked on frames pulled from the r04 MP4s.

**Defect: the v0 reels flickered empty on every tick.**
- **Cause.** The pitch was cap + pads + 0.6×size, so mid-roll both digits sat outside the window. The seconds slot went blank at about 1.97 s and 2.97 s, and at the 4.0 s rollover five of the six H:M:S slots were empty or slivers.
- **Fix: pitch = window height** (a real odometer drum). Neighbours park just outside the window, and every frame of a roll shows the incoming digit's lower part and the outgoing digit's upper part.
- **Easing.** Every step is now 0.30 s `power3.inOut`. The long expo tail that motivated the wide pitch is gone.
- **H:M:S pads 24/26 → 14/14 px.** The pitch went from 1.85× to 1.47× the cap, so mid-roll shows two readable halves instead of two faint slivers in the feathers. The feather is still at least 0.17× the cap. The margins absorb the change, so the layout doesn't move. The days pads (34/28, pitch 1.33× the cap) are unchanged.
- **Drum shading (new, to stop the r02 underscore coming back).**
  - With pitch = window, the outgoing "5"'s flat top bar sat under the landed "4" for 2 frames (0.27–0.30 s) and read as an amber underscore.
  - Now the outgoing digit dims as it turns away (1 → 0 over the first 60% of the roll, `power3.in`), and the incoming one firms up (0.25 → 1 over the first half). Mid-roll still shows both halves.
  - Frames at 0.30 and 0.33 s show a clean "34" with nothing under it.
- **Checked** on MP4 frames 58–63, 88–93 and 120–132 (ticks at 2, 3 and 4 s). Every slot shows digit material on every frame.

**Defect: v0 entrance frames 1–5 (the "36" pop and the blur bars).**
- **Blur.** The vertical blur was 0.3×size (about 82 px on the days reel). It's now 0.1× the drum's peak travel per frame, capped at 0.08×size: about 7 px on the days reel and 3 px on H:M:S. It follows the inOut speed curve, so it is exactly 0 at rest.
  - The critic's cap alone (22 px) still smeared the "4"'s crossbar into a block at the peak frame. The lower value keeps the glyph shapes readable.
- **`#dwrap` waits for the card.** It fades in from 0.06 s, when the card is about 0.63 opaque, so frame 1 is an empty card.
- **One thing leads** (the critic's stagger, adopted):
  - the days roll one step, 35 → 34, from 0.08 to 0.45 s;
  - DAYS LEFT at 0.16 s;
  - the H:M:S row fades in at 0.24 s and its changed reels cascade left to right from 0.30 s (11:01:04 → 10:00:03, landed by about 0.66 s);
  - the rule at 0.44 s, the date at 0.50 s and the platforms at 0.56 s.
  - The catch-up is one count above everywhere. It was "at most 2" in r02, so this stays within that decision.
- **Rollover pulse.** It now starts 0.1 s after the last reel starts, because the inOut roll arrives later than the old expo roll. The glint is unchanged.

**Other fixes (cheap and consistent with DECISIONS):**
- **v0 date line.**
  - The magenta offset is now 1 px (was 2 px) and the bloom .10 (was .22), on the 26 px card date only. At that size 2 px double-stroked every letter and read as a second accent.
  - DESIGN.md's "~2 px" is written for the larger official type, so this scales it to the size. v1's 34 px date keeps 2 px.
- **v1 rail clearance.**
  - `lockupWidth` is now 732 (was 752) instead of capping the push at 1.03. The r02 decision to push to 1.05 stands, because 1.03 was invisible in r01.
  - Measured on MP4 frame 193 (6.43 s, full push): the ink spans x 156–923, at or under the 925 the critic asked for.
- **v1 exit: no ghosted type.** The 0.4 s opacity fade is now a reverse mask wipe: every line drops out of view (0.28 s `power3.in`, bottom line first).
  - The "1" falls out of its feathered window.
  - DAY / LEFT fall out of their line masks.
  - The rule collapses.
  - The eyebrow, date and platforms drop behind a fixed clip edge 30 px under their own box, with the clip inset growing with the drop. That clears their soft shadows, and the date never crosses the platforms.
  - Frames 203–207 show crisp lines leaving, and frame 207 (6.9 s) is empty. The scrim still fades out, since it isn't type.

**Not done, deliberately:**
- **v1 "roll 2 → 1 (DAYS → DAY)".**
  - It would reverse round 2's fix: the "1" never rolls through another digit, so no frame pairs a wrong count with "DAY".
  - It would also change the concept of a variant scored 7.
  - The hold already moves: the push, the frame breathing apart, and two sheens.
- **The lighter v1 scrim on bg:none (.64 → .42).** Round 1 chose the scrim to keep the lockup legible on any clip. A transparent export is composited over footage nobody has seen yet, so it keeps the same scrim. This is a taste call, not a defect.

**Hero time:** 4.5 s. 09:59:59 has landed (the hours-tens reel is 99.8% through), the "34" is settling from its pulse, and the glint is right of centre on the hairline.

**Check:** 0 errors (the same 2 sub-composition lint warnings as r03), 0 layout issues, 77/77 contrast.

### Round 3 (critic: v0 7/10, v1 8/10, both won the blind pick)

**Defects fixed.**
- **Platforms contrast.** `.plat` is now `rgba(255,255,255,.86)` (was .66) and the separator dot `.6` (was .38). `#v1plat` gets the eyebrow's layered shadow (`0 2px 2px .35, 0 6px 24px .45, 0 0 18px .55`), and the v1 scrim is a little larger (660×840 at y 930) so it reaches the date and platforms. The check now passes 77/77 text checks at WCAG AA (r02 failed at 2.88:1), and the platforms line holds over the cream T-shirt at 1.0 s.
- **Hard-edged reels.** I rebuilt the reel window:
  - **Feathered.** The window now spans cap + a top pad + a bottom pad, with a two-stop mask ramp in each pad (transparent → .5 → opaque). Before, the pad was 12 px with an 11 px fade, which read as a hard line.
  - **Pads sized to the neighbouring text.** Days: 34 px above, 28 px below. H:M:S: 24 px above, 26 px below. A rolling digit never crosses the eyebrow, the H:M:S row or the unit labels. Symmetric 20% windows, as suggested, put digits on top of the eyebrow and the HRS/MIN/SEC labels; I tested it in snapshots.
  - **Pitch** = cap + pads + 0.6×size. Neighbours park well outside the window, so the outgoing digit clears the bottom feather while the drum is still fast. With a tight pitch it lingered there through the expo tail.
- **The pink "underscore" (t≈0.13 s).** It was the flat top bar of the outgoing "5" in the days catch-up roll (36 → 35 → 34). The gradient travelled with each cell, so the top of every digit was pink wherever it sat in the window. Three changes:
  1. **The sunset is anchored to the window**, not the cell. Each cell's background is offset by its position and by `--sy`, which every y tween animates in lock-step with the strip. It is one fixed colour field the digits scroll through, so anything leaving at the bottom is amber like the baseline. At rest it looks the same as r02.
  2. **Directional motion blur.** It is an SVG `feGaussianBlur stdDeviation="0 N"` per reel, so the blur is vertical only. The critic suggested an isotropic `blur(2px)`, but at the drum's speed (about 100 px/frame on the days reel) that is invisible. It also reads as defocus, not motion.
  3. **The blur is driven by a custom ease** that is exactly 0 before the roll starts and after it lands: `2^(-10p)·(1−p)`, peaking at 0.3×size. Reels that haven't started are never blurred, whatever order frames are seeked in. My first try used `immediateRender` and blurred every reel at t=0.
- **Snapshots of r03 at 0.133 s:** only a faint amber smear where the bar used to be.

**Biggest gap, v0: from widget to type.**
- **The card-in-card chip is gone.** The H:M:S row has no background, inset or hairline. It is plain Barlow Condensed 800 84 px type on the card (the same size as DAYS LEFT), with HRS / MIN / SEC under each pair: Inter 600, tracked .3em, `rgba(255,255,255,.62)`.
  - The critic suggested .55. I raised it to .62 so it passes the contrast check, since the .66 platforms line failed at 2.88:1 over bright footage in r02.
- **Three type sizes in the card:** 272 / 84 / 26. The eyebrow, unit labels, date and platforms all moved to 26 px; the eyebrow, date and platforms were 28.
- **The rollover lands.** The script finds the tick where 3 or more reels cascade (demo: 10:00:00 → 09:59:59 at 4.0 s).
  - When the last (left-most) reel starts rolling, the "34" pulses 1 → 1.035 → 1. That is 0.12 s `power2.out` up and 0.2 s `power2.inOut` down, around the numeral's baseline so DAYS LEFT doesn't shift.
  - One light pass runs along the hairline (4.04–4.74 s, `power2.inOut`).
  - **Deliberate deviation:** the glint is white, not sunset. DESIGN.md allows the gradient on one thing per frame, and the "34" already carries it.
- **Side padding.** The hero is now centred on its ink, not its boxes: the first digit's side bearing inside its window vs the last glyph of DAYS LEFT, from canvas metrics. Measured gaps in the r03 hero are 68 / 69 px; r02 was 73 / 63.
- **Spacing:**
  - eyebrow line box → numeral caps: 40 px (was 22, tight);
  - days baseline → H:M:S caps: 54 px;
  - H:M:S baseline → unit caps: 30 px;
  - colons have 12 px side margins (was 6).
- **The card fill** went from .66/.70 to .70/.76, so the small labels clear 3:1 over the bright boat cut. bg:none still uses the .84/.88 `.solid` fill.

**Biggest gap, v1: optical centring, fixed at the cause.**
- The lockup was about 18 px left of the axis. The layout is solved from canvas `measureText`, which never applies OpenType features, but `#root` sets `font-feature-settings: "tnum", "ss01"`. Barlow's tabular "1" has different side bearings and a longer flag than the default "1", so the DOM glyph didn't match the measured one.
- `.cell` and `.wline span` now use `font-feature-settings: normal`, so the DOM matches the metrics. The v0 reels don't lose anything, because their fixed-width windows already make them tabular.
- I did not hard-code the critic's +18 px nudge. It would break for other digits (`days` is configurable).
- The "1" is a little narrower now (the default glyph), so `lockupWidth` went from 740 to 752 to keep r02's presence. At the 1.05 push the ink spans x 145–935, inside the 936 safe edge. The measured centre in the r03 hero is 540 (r02: 522).

**Kept, deliberately (no concrete defect named against them):**
- **v0's single smoked-glass card.** v1 is the free type lockup, and v0 stays the card, so the two variants keep different style options as DESIGN.md asks. The critic's closing note ("no box") is taste. The concrete fixes target the inner chip (removed) and the card's side padding (fixed).
- **v1's lockup, type, entrance order, hold motion and p06 plate.**
- **The reel engine**, still deterministic: plain GSAP y and `--sy` tweens plus attribute tweens on the blur filters.

**Hero time:** 4.45 s. 09:59:59 has just landed, the "34" is finishing its pulse and the glint is on the right half of the hairline.

**Tooling.** Parked strip cells are clipped by their window, but the layout check saw them overlapping the unit labels and the eyebrow. The cells and unit labels carry `data-layout-allow-overlap`, and the eyebrow carries `data-layout-allow-occlusion`, because only the transparent feather zone of the days window covers its box. The check is clean: 0 layout issues, 77/77 contrast.

### Round 2 (critic: v0 6/10, v1 7/10)

**Defects fixed.**
- **v0 read rule.** Every reel now starts at most 2 counts above where it lands and rolls through real countdown values: days 36 → 35 → 34, seconds 05 → 04 → 03. Hours 12 → 11 → 10 and minutes 02 → 01 → 00 do the same, and digits that don't change stay still. The reels last 0.42 s and start at 0.02 s (days) and 0.08 s (H:M:S), 0.025–0.03 s apart. "34 DAYS LEFT 10:00:03" reads by about 0.4 s. The rule comes in at 0.34 s, the date at 0.40 s and the platforms at 0.48 s, so everything has landed by about 0.6 s. Earlier the reels spun through 71/46/15 and settled at about 1.3 s.
- **v1 pink smudge.** The blur on the reel strip is gone. The numeral no longer rolls through any other digit: the window starts empty, and the "1" drops in from above in one 0.45 s `expo.out` step starting at 0.06 s.
- **v1 "3 DAY" / "2 DAY LEFT".** The "1" is the only digit in the strip, and the words don't start wiping up until 0.32 s, when the "1" is about 98% landed. No frame pairs a wrong count with "DAY".

**Biggest gap, v0: from a widget to a hierarchy.**
- I dropped the four equal tiles. Days are now the hero: "34" in Barlow Condensed 900 at 272 px with the sunset gradient, and "DAYS LEFT" in Barlow Condensed 800 at 84 px sitting on the numeral's baseline. It reads as one sentence. The critic suggested Inter 800 at 64 px for the words; I used Barlow 84 instead so the frame keeps DESIGN.md's three sizes (272 / 84 / 28).
- H:M:S is one tabular Barlow 800 84 px row inside a single radius-20 inset, with colons at `rgba(255,255,255,.4)`. It ticks every second from 1.0 s, and each new digit drops in from above. The demo `from` is now 13:59:57 on Launch Trailer day, so the row ticks 03 → 02 → 01 → 00 and then cascades 10:00:00 → 09:59:59 at 4.0 s. The hero time is 4.6 s.
- **One accent:** the pink live dot is gone. The 64 px "GTA 6 is out in" headline is gone too; the eyebrow is now "GTA 6 COUNTDOWN".
- The Rockstar date style keeps its 2 px magenta offset. DESIGN.md prescribes it for official dates, so it's a style rule, not a second accent.
- The card is centred on y = 920 by measuring its height.
- **bg:none:** the card gets `.solid` (fill .84/.88 instead of .66/.70), because a transparent export has no footage for the 22 px backdrop blur to work on.

**Biggest gap, v1: the hold no longer freezes.**
- The lockup pushes 1 → 1.05 from 0.9 s to 6.45 s. In r01 it was 1 → 1.03 and too subtle to see.
- The frame breathes apart: the kicker drifts up 12 px and the rule/date/platforms drift down 12 px over the hold.
- The light crosses the "1" twice: at 1.15 s (0.8 s) and at 3.4 s (0.7 s, `power2.inOut`). Both have finished before the 4.6 s hero frame.
- **Scrim** is now `ellipse 640px 820px at 540px 900px`, so it covers the kicker at y 556. The kicker gets an extra `0 0 18px rgba(0,0,0,.55)` shadow and holds on the bright sky cut at 6.3 s.

**Kept, deliberately:**
- v1's lockup, type and p06 plate. The critic scored it the strongest idea.
- v0's smoked-glass material. It's now one plate, not a tile widget.
- The reel engine: each strip holds exactly the digits it will show, and everything is plain GSAP `y` tweens.

**Tooling.** The reel windows now hug the cap height, so the strips overflow them by design. They carry `data-layout-allow-overflow`, and the cells carry `data-layout-allow-occlusion`, so `hyperframes check` passes.

### Round 1 (first build)

**Format choice.** The creators' references prove two countdown formats. One is the oversized "37 DAYS" type stack (`countdown-days-stack/xYZglLvVlyU-4.5`). The other is the neon "NOVEMBER 19 / TOMORROW! / 1 DAY LEFT!" launch-eve card (`countdown-neon-date-cta/GpgyufHlPXk-11/14`). Both are loud and cheap: heavy outlines, neon glow soup and fireworks. I kept the formats and rebuilt them in Rockstar's own language. The reference for that is `official-type/rz1B4B2yBZY-82.5`: "NOVEMBER 19, 2026 / PRE-ORDER NOW" in white, wide-tracked caps with a magenta offset.

**Variant 0, Rolling digits: a smoked-glass widget.**
- One object: a 792 px glass card (radius 36, 1 px inner highlight, contact shadow plus a large soft shadow). It holds an eyebrow, the headline "GTA 6 is out in", four odometer tiles (radius 20, hairline) with unit labels, a hairline, the date, and the platforms.
- **Type:**
  - Barlow Condensed 800 for the HUD numerals.
  - Inter 800 for the headline, Inter 600 caps for the labels.
  - Three sizes: 124 / 64 / 28.
- **One accent:** the sunset gradient fills only the DAYS digits. The date carries Rockstar's 2 px `#EE08F2` offset, as DESIGN.md specifies for official dates.
- **Motion:**
  - Card in with `expo.out` (0.5 s), then the reels spin in left to right with a light motion blur and land by 1.6 s. Days and hours read by about 0.6 s.
  - The reels then tick once a second, and each new digit drops in from above (countdown direction).
  - The demo `from` time was chosen so that at 4.0 s every reel except days rolls at once (10:00:00 → 09:59:59), right-most first with a 45 ms stagger. That cascade is the payoff, so the hero time is 4.8 s.
- **Reel implementation:** each strip holds exactly the sequence of digits it will show, so every change is exactly one step. Hour tens never spin through 9→3, for example. Everything is plain GSAP `y` tweens: seek-safe and deterministic.
- **Countdown math:** computed from the CONFIG strings with `Date.UTC`, with no clock. Demo `from` = Launch Trailer day (2026-10-15, a FACTS.md date) → 34 days.
- **Cut in round 1:** a flip-clock split line through each tile. It read as a strikethrough on rolling (not flipping) digits.

**Variant 1, One day left: a free type lockup.**
- No card, a deliberate style contrast with v0. A soft radial scrim keeps it legible on any clip.
- **The lockup:** a huge sunset-gradient "1" with "DAY / LEFT" stacked at the numeral's cap height. The word size is solved from font metrics so "DAY" caps align to the numeral's top and "LEFT" to its baseline. The whole lockup is optically centred on its ink, not its boxes.
- Below it: a hairline, the Rockstar-style date and the platforms. The eyebrow is "GTA 6 · OUT TOMORROW", which is true on launch eve (today is 2026-11-18).
- **Type:** three sizes (numeral about 700, words about 300, small text 34).
- **Motion:**
  - The numeral rolls 9→1 and lands by about 0.7 s; the words wipe up.
  - The date blooms in (blur and scale, not letter-spacing, which the lint rejects as non-transform motion).
  - The lockup slowly pushes in (1 → 1.03) and a sheen crosses the numeral at 1.1 s and 3.1 s. The second sheen was moved off the hero frame.
- **Round-1 fix:** the numeral window now hugs the cap height (+10% pad) while the cells keep a taller pitch. Before, the reel mask faded the bottom of the "1", and spinning digits crossed the eyebrow.

**Plates.**
- v0 uses p01 Keys sign, as the manifest suggests.
- v1 uses p06 Lucia at the gate (golden hour, which matches the sunset accent), not p02. **p02 shows the official GTA VI logo full-frame from about 2 s to 5.5 s.** It would sit directly behind the lockup, both clashing and putting key art in the hero frame.

**Safe zone.** Everything is centred on x = 540 and inside x 144–936 and y 556–1300.

**Not done / open (still true in round 2).**
- The countdown target is local midnight on November 19. Rockstar's exact unlock time isn't in FACTS.md, so v1 shows no hours ticker.
- v0 sizes the days numeral to fit: 3-digit counts shrink it so "DAYS LEFT" still fits the card. This hasn't been visually tested. 1-digit counts show without a leading zero ("7 DAYS LEFT", "1 DAY LEFT").
