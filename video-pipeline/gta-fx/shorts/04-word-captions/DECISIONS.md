# Decisions: 04 Word captions

## v2 concept
- **The idea:** captions that are cut, lit and graded with the edit rather than a widget sitting on top of it. Every caption card (v0) or lyric line (v1) gets its own 4K shot, and the cut lands on that card's first word. The type is title-scale, and the one number or date that matters gets a payoff hit.
- **v0 Word pop.** Full-frame vertical shots, cut on each card:
  - s083 Lucia in the convertible, 0–1.25
  - s135 skydive over Vice City, 1.25–2.50 (r09; was s108)
  - s084 swamp silhouettes, 2.50–3.70
  - s098 Jason and the fireworks, 3.70–4.35, opening on the explosion's brightest frame (media 0.40)
  - s018 Lucia at the gate, held with a 1.0 → 1.075 push, 4.35–7.0
- **v1 Karaoke line** (full-bleed since r09). Full-frame vertical shots under a soft bottom shade, cut on each line:
  - s078 Jason on the phone, s083 duo convertible, s092 duo car, s014 drive-by past the Little Haiti mural, s135 skydive over the city, s027 sunset dock
  - then s105 Lucia on a rooftop under the pink sunset (pre-slowed to 0.37×) on the payoff word, 5.25–7.0.
- **Where the type sits and why.**
  - v0: centred stack, centre y 1250 (block ≈ 1025–1470, x 158–923). In every shot that's chest, arms, silhouette or city, and no face.
  - v1: lower third, left edge x 72: one line at a time (cap-top y 1040), and the payoff numeral under it (baseline y ≈ 1468). Every shot puts faces above y 960, so the line sits on chest, road, city or water, with a bottom shade (.42 behind the line, .60 at the safe floor) and a lift shadow for legibility.
- **Hero size and face.**
  - v0: Inter 900 caps sized per card, up to 170 px (card 1 is 170, "24 HOURS." steps down to ~142), and numbers as 340 px Inter 800 display numerals. "TODAY?" is a ~208 px Inter 800 display word (the largest that fits 780 px).
  - v1: Inter 800 sentence case at 160 px, one line at a time ("Meet Jason" is 827 px, 96 % of the safe width), and the payoff "19." as a 360 px Inter 800 sunset numeral (2.25 : 1).
- **The payoff hit.**
  - v0 at 4.35 s: "305" slams in on the cut to Lucia (scale 1.75 → 1, blur 26 → 0) with a warm exposure kick, shake and punch-zoom, a 16 px RGB split, a sheen and a warm bloom. The card then floats up 14 px over the hold.
  - v1 at 5.25 s: "19." slams in fully sunset on the cut to Lucia at sunset (scale 1.6 → 1, blur 24 → 0), with a full-frame warm exposure kick (flash .12), shake, a 14 px RGB split, a bloom kick, a sheen and the component's one light leak (#FE8E4E → #F84FA4, 0.6 s). The block floats up 14 px over the hold.
  - Hero frame 6.0 s.

## v2 round 9 (hero 6.0 s): v1 full-bleed, v0 connecting beats
The r08 critic scored v0 8 (pass, just) and v1 7, with no defects or hard caps. The biggest gap: v1 spent 5 s as one line in a black field under a 608 px band, so the caption never met the image, and v0's connecting beats (the soft s108 shot, the lone 140 px "TODAY?") were template-grade.

### v1 Karaoke line: full-bleed (reverses the r08 letterbox, on purpose)
- **Why it's reversed.** The letterbox was a deliberate r08 decision, but DESIGN.md reserves letterbox for components where cinematic framing is the job, and a caption isn't one. The critic named it as the cause of the failing score, so this isn't a taste flip.
- **The frame.** There's no `#root.lb`, no bars and no slit. `b1`–`b7` are the `-v` vertical shots, full-frame. A new `#kscrim` bottom shade sits under the lines: clear above y 740, .24 at 900, .42 at 1060 (behind the line), .54 at 1260, .60 at 1500 and .66 at the bottom. The critic's spec (0 at 900 to .55 at 1500) is only about .13–.24 behind the line itself. Even the first r09 capture, at .36 there, left white "Their" weak over Jason's light-grey tee, so the shade is front-loaded.
- **Line placement kept at cap-top 1040, not the critic's 1120.** At 1120, the 360 px numeral's baseline would land at about 1548, 68 px under the 1480 safe floor (caption-UI zone). At 1040 the baseline is about 1468. Measured on the render: "November" spans x 81–843, y 1030–1145.
- **Opening.** The slit open went with the band. The footage now opens with a focus pull on `#frame` (blur 16 → 0, brightness .72 → 1, 0.5 s expo.out) while the first line rises.
- **Unsung words.** These are now crisp #fff at 38 % (`kara.dim`), with the 1.5 px blur removed, as the critic asked. Lift shadows now apply on footage too, not only for `bg:"none"`. The sunset glow layer also carries a dark lift `drop-shadow`, including during the payoff bloom.
- **Payoff light.** A `Look.leak` (0.6 s, #FE8E4E → #F84FA4, opacity .5, y .36) runs across the full frame on the hit, and the warm flash for v1 drops to .12 (`flashPeak`). The impact, exposure kick and flash now act on `#root`, not the band. The leak is the component's only one: v0 has none.
- **Drift.** The last line and the numeral float up 14 px (linear, 5.25 → 6.45) on `.lyr-in`, clear of the exit on `.lyr` and the chroma filter.

### v1 shot changes (needed once the shots went full-bleed)
- **`b4` "plays out in": s011 → s014** (drive-by past the Little Haiti mural, police lights ahead, media 0–0.85). In vertical, s011 tilts up across 1.3–2.15 so that its green signs and white clouds slide into the line zone. Line-zone luma was 112–160 and the white text failed. s014's road and dashboard sit at luma ~40.
- **`b5` "Vice City,": in-point 0.05 → 0.55.** She's airborne over the city now, which differs from v0's card 2. v0 uses the same shot standing at the edge.
- **`b7` payoff: s018 → s105**, Lucia on a rooftop under the pink sunset. Full-bleed s018 made v1's hero the *same frame* as v0's (both s018 at media 1.90 at 6.0 s, number on her tee). s105 keeps "Lucia for the date", which the critic praised. Its sky is the Leonida sunset, and the numeral sits on her dark top (line-zone luma ~31).
  - s105 is only 0.73 s long, so it's pre-slowed to 0.37× with motion-compensated interpolation into `assets/clips/s105-lucia-rooftop-slow-v.mp4` (55 frames, 1.83 s, GOP 10). `mi_mode=blend` ghosted her face; `mci` is clean.
  - It's also graded in the same pass (unsharp .7, contrast 1.10, saturation 1.08, gamma .96). The raw shot read soft and milky under grain.
  - Used for 0.05–1.80.
- **`b2` (s083) is scaled 1.12 from the bottom edge**, like v0's `a1`, so Lucia's chin rides about 110 px above "and Lucia.".

### v0 Word pop fixes (it passed; the listed fixes only)
- **`a2`: s108 → s135** (skydive over Vice City, media 0.05–1.30). The cut on "90" stays at 1.25. I measured luma in the caption zone first: s135 is 42–61 and s011-v at 1.3 is 122–168 (bright sky and signs behind the text), so I picked s135. She stands at the edge as "90" lands and jumps on "MILLION".
- **"TODAY?" is a beat.** It's flagged `"em"`, with the card's `emSize: 240`. It's fitted to 780 px, so it lands at about 208 px Inter 800 (x 161–923). At 240 px it would be about 880 px wide, past the safe edge. It gets the numeral punch (blur 26, 0.38 s expo.out).
  - The punch's start scale is capped at `1080 / word width` (1.43 here), so the out-of-focus word never crops at the frame edges. "305" and "90" keep their 1.75.
  - `a4` opens on the explosion's brightest frame. A per-frame luma scan of s098 peaks at frames 12–14 (54.5), so the in-point is media 0.40, used to 1.05. The shot cuts to green at about 1.12.
- **Per-card size.** `pop.maxSize` is 170, with `minSize` 96 and `maxLine` 780. Each card's plain lines get the largest size at which that card's widest line fits.
  - Measured: card 1 is 170 px (cap 125 px), the "MILLION" cards are 170, and "VIEWS IN / 24 HOURS." steps down to about 142.
  - `maxLine` stays 780, not the critic's 800: 800 centred reaches x 940, past the 936 safe edge.
  - Card 1's 3 lines at 170 run to about y 1470 (TRAILER's baseline). That's in the safe zone, and Lucia's chin is still about 90 px clear.
- **Drift.** The final "305 MILLION." card floats up 14 px (linear, 4.9 → 6.5 s) on `.card-in`. Measured: y 1033 at 6.0 and 1029 at 6.45.

### Checked
- `hyperframes check`: passed, 0 errors. The render's sparse-keyframe warnings are for the library shots, and `freezedetect` (0.15 s) finds no frozen span in either render.
- **Frames pulled:**
  - v0: 0.3, 1.0, 1.3, 1.6, 2.2, 2.9, 3.40, 3.70–4.25 (TODAY? entrance, 6 frames), 4.37, 4.5, 4.9, 5.0, 6.0, 6.45, 6.6, 6.95.
  - v1: 0.03, 0.15, 0.4, 0.5, 1.0, 1.2, 2.1, 2.3, 2.6, 2.85, 2.95, 3.3, 3.5, 3.9, 4.2, 4.4, 4.6, 4.9, 5.25–5.7 (payoff, 6 frames), 6.0, 6.5, 6.95.
- **Results:**
  - No face is covered, and no text leaves x 72–936 / y 230–1480. Inter renders, with no fallback.
  - One sunset word per frame.
  - The last frames are clean footage after the blur exits.
- **`bg:"none"` v1:** lines and numeral only. There's no shade, focus pull, leak or flash.

### Open
- The v1 "Vice City," line crosses the skydiver's legs (not a face) for 0.9 s. The city under her is dark enough to read cleanly.

## v2 round 8 (hero 6.0 s): v1 redesigned, v0 payoff light
The r07 critic scored v0 8 (pass) and v1 6 with a hard cap (126 px under the 140 px display floor), plus two v1 defects. A score of 6 means v1's concept read as generic ("an Apple Music lyric view"), so v1 was redesigned rather than polished. v0 keeps everything and gets the two fixes the critic listed.

### v1 Karaoke line: redesign
- **Hard cap: size.** Lines are Inter 800 at 160 px (`kara.maxSize`), up from 126. Measured: "Meet Jason" 517 / 1000 em → 827 px, "plays out in" 792, "Their story" 768, so the existing VO breaks already fit 864 px at 160 and the copy didn't need re-breaking. "November" now stands alone and "19." becomes its own line.
  - I measured Archivo wide caps too (the critic's alternative): "MEET JASON" is 8.66 em, so 112 px would need one word per row. That turns karaoke into v0's word stack, so I kept Inter.
- **No more lyric scroll.** One line at a time, no dim "next" line, no rolling stack. A line rises in whole through per-word masks (50 ms stagger, 0.5 s expo.out) 0.13 s before its first word, and the old line lifts 30 px and blurs out 0.24 → 0.10 s before. Every frame from 0.1 s to the exit shows exactly one line, and the cut lands on its first word.
- **A hero.** The payoff "19." is a 360 px Inter 800 sunset numeral on its own line under "November". It slams in on the cut to s018 (opacity in 0.04 s, scale 1.6 → 1 and blur 24 → 0 over 0.38 s, expo.out, origin 0 % 30 % so it grows away from "November").
- **Layout.** The band moved up to y 358–966 so the picture and the caption block read as one unit (black above 358 is the status-bar zone; black below 1480 is the caption-UI zone). The line's cap-top sits at y 1040 and the numeral's baseline at about 1468, both computed from real font metrics (`canvas.measureText`), so they hold at any `kara` size. Measured on the render: text spans x 81–921 and y 1026–1469.
- **Unsung words** are 55 % white with a 1.5 px blur (critic's suggestion; was 40 % sharp), so they read as "out of focus, coming" rather than grey. Once a word is fully swept, its soft layer is retired so no blur fringe sits under the lit word.

### v1 defects
1. **The hit now lands on a lit word.** The payoff word has no sweep: its `--sw` is set to full width at build, and it appears fully sunset on its own frame. "November" hands off to white on that same frame (an instant hand-off when the next word is `"em"`; other hand-offs keep 0.08 s). The sheen now starts at w.t + 0.12. Checked at 5.27 / 5.30 / 5.34 s: "19." is sunset, blurred and RGB-split on the hit frame, and "November" is white.
2. **No glow rectangle.** The glow moved off the masked `.k-sun` onto a new unmasked wrapper, `.k-glow` (`drop-shadow` pink .42 / orange .20). The sweep mask clips only the letters, and the filter on the parent lights whatever the mask reveals, so there's no box edge to clip. The word masks for the rise are padded (.26 em / .22 em / .30 em, with negative margins) so they can't clip the glow either. Checked at 2.38 s ("story" mid-sweep) and on the hero: the glow is soft on pure black.
   - On the payoff the glow kicks to 2.2× and settles to 1× over 0.8 s, with an extra 120 px amber layer: the bloom comes from the unmasked layer, as the critic asked.
   - The first capture showed that big glow tinting the lower half of the white "November" dusky for about 6 frames. The numeral line now sits under the word line (`z-index` 1 vs 2), so "November" stays pure white.

### v0 fixes (it passed; only the listed fixes)
- **Payoff light.** The flat white 0.5 flash is gone (`Look.impact` now runs with `flash: 0`). It's replaced by `warmHit()`: an exposure kick on `#push` (brightness 1 → 1.8 → 1, saturate 1.12; 0.06 s in, 0.34 s expo.out) plus a warm #FFE2B8 radial screen flash peaking at .16. Brightness multiplies, so Lucia's dark shirt stays dark while the golden light flares. A first pass at .30 screen still lifted the shirt to olive, so I lowered the flash and raised the exposure.
- **Bloom on the 305.** The white face carries `Look.bloom` (#FEB747, strength .6, inside DESIGN's .3–.7) with a lighter lift shadow under it. The sunset face's glow kicks to 2× on the hit and settles to 1× over 0.7 s, in warm orange and amber.
- **Card 1 off Lucia's chin.** The critic's "drop the zone 90 px" would push TRAILER's descender line past y 1480 (out of the safe zone). Instead, `#a1` is scaled 1.12 from its bottom edge, so her face rides about 110 px higher: her chin now sits about 125 px above GTA 6’S, and the stack sits on her forearms. Nothing else in v0 moved.

### Not changed (deliberate)
- v0's layout, copy, cuts and accent hand-offs; v1's copy, shots and cut points.
- `hyperframes check` now prints a `composition_file_too_large` lint warning (two variants in one file grew past its line budget). It's advisory: the check passes, with 0 errors. I didn't split the file, because the library ships one `index.html` per component.

### Checked
- Frames pulled:
  - v1: 0.05, 0.2, 0.5, 0.88–1.10 (line change; all distinct frames by hash), 2.38, 2.80–2.90, 3.55–3.80, 4.12, 5.20–5.40, 6.0, 6.5–6.95.
  - v0: 0.3, 0.9, 4.30, 4.37, 4.42, 4.6, 5.0, 6.0, 6.6–6.95.
- Results:
  - No face is covered, and no text leaves x 72–936 / y 230–1480. Inter renders, with no fallback.
  - One sunset word per frame in both variants.
  - v1's last frame is clean footage after the blur exit (exit at 6.45 / 6.50, done by 6.9).
- `bg:"none"` v1 was rendered to WebM and composited over s004: the lines and numeral float cleanly, with no bars, grain or flash.

---

## v2 round 7 (hero 5.6 s): full rebuild
The owner rejected r01–r06 as "basic, not professional or clean-looking". Small (89–106 px) captions on soft 1080p plates, plus a smoked-glass bar in v1, read as a UI widget on top of a video. Everything visual was rebuilt. The job, the accent rule and the facts stay.

### Kept from v1 (deliberate, hard-won)
- **Accent rule.** Exactly one sunset word per frame, always the word being spoken. It hands off on the frame the next word starts (r06 defect fixes 1–2). The emphasis numerals follow the same rule: "305" turns white when MILLION. lands. There's no "key word" hold (r05 decision 3 was reversed in r06 for breaking the brief).
- **Layout per card.** Each card is laid out at its final size from its first frame, and unspoken words hold their slot at opacity 0. A word never moves once it has landed (r05 defect 1: no re-centring).
- **Centring.** v0 is centred on the frame axis (x 540, max line 780 px), not the safe-zone centre (r02 defect 5).
- **No stacked lines.** No frame shows two cards (v0), and no line is ever cut off by the picture edge (v1, see the fix below).
- **Seek safety.** Every tween is `fromTo` with `immediateRender:false`, with initial states set at build time.
  - The RGB split and the exit blur live on different elements (`.card-in` / `.lyr-in` vs `.card` / `.lyr`), so `Look.chroma`'s filter reset can't fight an exit blur on a backward seek.
  - The word punch-in blur is on `.w`, and the glow is a `drop-shadow` on the child `.w-sun`.
- **Facts.**
  - v0: Trailer 1 drew 90M+ views in 24 hours and has 305.4M today. I dropped "record" to avoid the non-music overclaim fixed in r02.
  - v1: Jason and Lucia, Vice City, November 19.

### New in v2
1. **Footage.** All `assets/plates` are gone. Shots come from `assets/shots` (4K, graded), one per card or line and cut on its first word, with a fresh 1.0 → 1.04–1.05 push on every shot. Each in-point is checked against the shot's length, so nothing freezes:
   - s098 cuts to a green shot at about 1.2 s, so it is used for 0.30–0.95 only.
   - s018 is used up to 2.90 of its 2.97 s.
2. **v0 type at title scale.**
   - Inter 900 caps at 140 px, stacked one word per line (or two short words: "VIEWS IN", "24 HOURS.").
   - At 140 px, "FIRST TRAILER" would be about 980 px wide, so it stacks deliberately.
   - Numbers flagged `"em"` become 340 px Inter 800 display numerals (−0.055 em tracking, 0.80 leading).
3. **v0 motion.**
   - Each word punches in: opacity in over 0.05 s, plus scale 1.24 → 1 and blur 11 → 0 over 0.26 s (expo.out). Numerals go 1.75 → 1 and blur 26 → 0 over 0.38 s. It reads like a focus pull, not a bounce.
   - Cards leave with a designed exit that finishes on the next card's first word: lift 28 px plus blur 10 over 0.12 s.
   - The last card blurs out at 6.50–6.90.
4. **v0 legibility without a box.**
   - An edgeless ellipse behind the caption block (centre α .46) plus a low gradient (.40 at the bottom).
   - The white face carries the soft lift shadow. The sunset face carries a pink glow `drop-shadow` and a lift shadow.
   - The sunset uses the full Leonida core gradient via `Look.fill` on each word's accent layer.
5. **v1 is a letterboxed lyric scroll, not a glass bar.**
   - The 16:9 band opens from a slit (inset 36 % → 0, 0.7 s expo.out).
   - Lyrics are Inter 800 at 126 px in sentence case, left-aligned at x 72, in the black below the picture.
   - The current line is bright: sung words are white, unsung ones 40 %. The next line waits underneath at 55 % (≈ 22 % effective).
   - On each line change, the track rolls up one row (0.55 s expo.out). The old line blurs out and the next one rises in from blur.
   - The spoken word fills with a feathered (18 px) sunset sweep with a pink glow. It hands off to white in 0.08 s when the next word starts.
6. **v1 bars above the grain.** In letterbox mode the black bars are drawn in `#ov` at z 95, above `Look.install`'s grain and vignette stack (z 90). So the grain sits on the picture, and the matte stays pure #000.
   - The first render had the bars lifted to about #141414 by the overlay grain: it lives in its own stacking context, so it composites rather than blends over black.
   - The lyrics also sit above the grain, as the subtitle layer would in a real edit.
7. **One payoff per variant** (see the concept). In v0, "90" gets the numeral size and its own cut but no flash, so "305" is the only hit. The flash is the one light moment, and there's no leak.

### Fixes made during the round (same round number, re-captured)
- **v1 clipped line.** In the first capture, the outgoing line was still about 80 % opaque as the roll carried it under the picture's bottom edge (frames 0.95–1.10 showed half-cut "Meet Jason").
  - The outgoing fade is now 0.16 s (power1.out) and starts 0.04 s before the roll, with blur to 8 px. The window's top fade is 30 → 44 px.
  - Re-checked at 0.93 / 0.97 / 1.01 / 1.05 s: the old line is a blur ghost in place, then gone, and no letters are cut.
- **v0 card 3 on a bright city.** "VIEWS IN" in white over the pale skydive city (s135) measured low contrast. Card 3 now cuts to s084 (swamp silhouettes at sunset, media 0.1–1.3). The white words sit on the dark silhouette and the sunset words on the darker sky.

### Checked
- `hyperframes check`: 0 errors and 0 warnings. One layout *info* at 5.056 s: MILLION. is still finishing its scale-in, 3 px wider than its line box.
- **Frames pulled:**
  - v0: 0.55, 1.0, 1.27, 1.32, 1.45, 2.40, 2.47, 2.55, 2.9, 3.3, 3.65, 4.37, 4.42, 4.55, 6.62, 6.85 and the last frame.
  - v1: 0.03, 0.12, 0.30, 0.93–1.10, 2.95, 4.60, 5.27, 5.32, 5.70, 6.70 and the last frame.
- **Results:**
  - No face is covered, and no text leaves x 72–936 / y 230–1480.
  - Inter renders (no fallback).
  - The last frames are clean footage after the blur exits.
- **`bg:"none"`** (rendered both): captions only. v0 keeps its soft ellipse; there's no footage, grain or bars.

### Open
- At 140 px, v0 cards stack 2–3 lines, so a creator's transcript needs short chunks (≤ ~9 caps per line). The size steps down automatically (to 96 px minimum) if a line passes 780 px.
- v1's top black band (y 0–576) is empty on purpose. The platform's status bar and search sit in the top 200 px anyway.

---

# v1 history (r01–r06, rejected look; kept for the hard-won fixes)


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
