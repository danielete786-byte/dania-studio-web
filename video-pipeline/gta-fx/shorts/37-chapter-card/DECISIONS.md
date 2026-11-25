# Chapter card: decisions

## Concept
One object made with care: the chapter lockup (`DETAIL 04` kicker, title, sub line, a 10-tick progress row), carried by a real transition between two clips. Top compilation creators cut between "details" with a flat title card or a plain text slate (refs: `title-card/0L5i5C46M1s-17`, end/title cards in analysis-2). Rockstar's own cards use a soft sunset sky (`feature-title-card/8L0CzL2V72c-6.5`, the PS5 Features Trailer) and wide-tracked caps with a magenta offset (`official-type/QdBZY2fkU-0-85.5`, "COMING 2025"). Analysis-3 notes that nobody uses Rockstar's own type language. Each variant takes one of those two languages and builds a clean transition around it.

## Key decisions
- **Full-frame, two clips.** The component is the transition itself: clip A (the segment that ends), then the chapter, then clip B (the segment that starts). Both clip paths come from CONFIG. Each `<video>` is trimmed with `data-media-start` so only clean shots are used (plates were scanned for cuts and logo frames, see below).
- **v0 + `bg: "none"` drops the outgoing clip** (r03). The frame is transparent until the card lands, so the card can wipe over the creator's own clip. The hero window and the landing still play `clipIn` (set it to your own next clip). Full-frame components always show footage, and since r03 the window *is* the incoming segment. v1 always shows footage, because the blur is made from the clip itself.
- **The progress row** (`of: 10`, current tick lit) tells the viewer where they are in a "10 details" short. Done ticks are at 62 %, future ticks at 28 %, and the current tick is plain white in both variants. In v1 it is no longer a sunset-gradient tick (r02), because the magenta offset is v1's only accent.
- **Three type sizes per frame.**
  - v0: 30 px kicker (Inter 700, 0.42em, no flanking rules), 34 px sub (Inter 600 caps), title auto-fit Inter 800 caps (~100 px here). The title shadow is nearly flat (`0 2px 3px` + `0 4px 14px rgba(84,32,86,.18)`, r03), as on the PS5 card.
  - v1 (r03): 30 px kicker in Rockstar's date style (Inter 600, 0.42em, **2 px magenta offset + soft bloom: the only magenta in the frame**), title in **Barlow Condensed 800 caps, 150 px, tracking 0.06em** (DESIGN: location titles), neutral soft shadow. 30 px sub (Inter 600, 0.42em, neutral shadow).
- **Ticks are 52×8 px, gap 12, r4** (r03, were 36×6), so they still read at 360×640.
- **Centred on x 540, glyphs inside x ~170–910.** It's a full-frame card, so the lockup is centred on the frame. `titleMaxWidth` 740 (r02, was 780) keeps every line at least 24 px clear of the 936 right rail.

## Variants
- **0 "Sunset card"** (p03 Jason at the door → p06 Lucia at the gate, media 2.9 s on, her face):
  - The sky is the design system's soft sunset card, deepened at the top (r04: `#8E76AA → #9C7AA8 → #9C7AA8` over the upper 40 %, then `#D689A1 → #FAA08D → #FCB680 → #FFC88F`; the top radial darkening is .12). The first build used the plain token gradient and failed the contrast check: white kicker 2.72:1, sub 2.58:1. r01–r03 used a heavier `#6C5B97 → #8770A4` top, which the r03 critic sampled as duller than Rockstar's PS5 lavender. The r04 lift still passes (`hyperframes check`: 8/8 AA; white on `#9C7AA8` ≈ 3.6:1 for the 30 px bold kicker and 34 px sub), and the warm sunset stays in the lower half.
  - Cloud streaks come from seeded value noise painted once into a canvas (deterministic). They gather toward the horizon and drift 90 px over the clip.
  - **Cirrus (r02):** a second seeded canvas lays thin, slightly tilted wisps across y 0–1000 at 30 % opacity and drifts 40 px left over the hold. This matches the full-frame painterly sky of `8L0CzL2V72c-6.5`. The wisps thin out (−45 %) in a soft ellipse behind the lockup, so the kicker and sub keep AA contrast (`hyperframes check`: 12/12 pass).
  - **Grain (r02):** a seeded 256 px monochrome tile at 5 % soft-light (about 2 % luminance), stepped to seeded offsets at 12 fps so the flat gradient never reads as a vector fill.
  - A warm sun glow sits at the bottom edge.
  - The lockup sits at y ~560–960, in the violet sky.
  - **Hero window (r03, resized and rebuilt r04).** The PS5 card works because a hero object (the controller) sits under the type, so v0 gets one: a **750×422** r28 window at x 165–915 (the title's measure), y 1006–1428, about 56 px under the ticks, playing `clipIn` (Lucia). It has a contact shadow (`0 2px 4px rgba(0,0,0,.25), 0 24px 60px rgba(60,20,70,.35)`) and a 1 px white inner edge at 20 %. On exit it grows to full frame and *becomes* the next segment (one continuous `<video>`).
  - **How the window is built (r04).** `#segB` stays full-frame. The window is a `clip-path: inset(... round 28px)` on `#winClip`, and `#winMove` places the full-frame clip with a transform (scale 758/1080, top-anchored, 4 px overhang on every side). On exit the clip-path and the transform tween together with the same ease, so the clip covers the growing window on every frame and ends at identity. The `<video>` box itself never changes size. In r03 the window's `left/top/width/height` were tweened, and the renderer's injected video frame (an `<img>` sized from the `<video>` box) kept the previous frame's box on frames where the source frame didn't change (p06 plays at 0.62×), so 3.50 s and 3.60 s showed an empty sunset band inside the window. The shadow and the edge are plain divs whose geometry tweens with the window.
- **1 "Blurred footage"** (p02 blue club → p01 "Welcome to The Keys" sign). r04 ground: **blur 9 px at zoom 1.38 (≈ 12 px on screen, because the filter is scaled by the push), brightness .74, saturate 1.15**, with a scrim only behind the lockup. The uplights, the blue wall and the hanging figures read as footage, not a navy smear. This follows Rockstar's blurred-fill frames in `official-type`, which keep the footage recognisable and darken only where the type sits. The r03 ground (16 px / .66, an even .18 shade) and the r02 ground (42 px / .52) are kept below for history:
  - **Ground (r02):** p02, the manifest's plate. Its blue uplights blur into a deep navy-violet field, close to Rockstar's white-on-night date cards (`rz1B4B2yBZY-82.5`, "NOVEMBER 19, 2026" over the night city). Blur 42 px, brightness 0.52, saturate 1.25, push 1.0 → 1.12 → 1.16.
  - **p02 is clean only for 0–1.35 s** (then it dissolves into the logo and the end slate). r02 (superseded in r03 by the reversed hold): `v1out` plays 0–1.35 s at normal speed, sharp then defocusing. A second `<video>` of the same clean window (`v1hold`, from 0.6 s at rate 0.2, ending at source 1.32 s) crossfades in under the blur at 1.15–1.33 s and carries the hold to the swap. The crossfade is tweened on a wrapper (`#holdWrap`), not on the `<video>`: tweening the clip's own opacity fought the clip lifecycle and flashed 3 grey frames at 1.37 s. The blurred field keeps drifting (the uplights move), so the hold is never frozen.
  - A plum shade (`#160123` family) adds a light radial scrim behind the lockup and top/bottom grading. It is lighter than in r01 (radial .52 → .30), because the ground is now dark on its own.
  - The incoming clip crossfades in under the blur, then pulls into focus on the sign. The reveal confirms the title.
  - **Hold (r03):** `assets/custom/p02-blue-club-rev-v.mp4` is p02's clean window (0–1.33 s) reversed with ffmpeg (`trim=0:1.3334,reverse`; file t = source 1.30 − t). It starts at file 0.15 (= source 1.15 s, exactly where `v1out` is at the 1.15 s crossfade) and plays at 0.4×, ending at source ~0.05 s. The camera that was pulling back now keeps moving as a slow push toward the figures, with no jump at the crossfade and no logo frames. That is 2× the r02 speed (0.2×) and moves visibly. Rate 1 is impossible: the clean window is only 1.33 s.
  - **Shade (r04):** only a radial scrim behind the lockup, `radial-gradient(60% 34% at 50% 44%, rgba(8,6,28,.45), transparent)`. The even .18 layer (r03) is gone. The push (origin y 30 %) moves the club's black floor down to the bottom ~17 %.

## Motion
- **v0** (r03 total 5.2 s, was 6.4):
  - The card rises full-frame from the bottom (0.75–1.35 s, expo.inOut) and casts a soft plum shadow on the clip. It is a square-edged full-frame wipe (r02): the r01 40 px corner morph read as an iOS sheet and was off the 20/28/36 scale.
  - Clip A is pushed up 560 px (30 % parallax) and dims.
  - The lockup starts at 1.05 s (landed − 0.30), so the type rides in with the card and there is no empty-sky beat: the kicker's tracking settles from 0.70em to 0.42em, the title lines rise out of masks (80 ms stagger), then the sub and the ticks appear. The current tick pulses once.
  - The hero window floats up under the ticks at 1.47 s (opacity, +50 px, scale .94 → 1, expo.out 0.8 s), then drifts in 2.5 %.
  - Hold (full cover 1.35–3.2 s, about 1.9 s; was 3.3 s): the clouds drift 220 px (was 90), the cirrus 70 px, the grain steps at 12 fps, and the lockup pushes in 3.5 %.
  - Out: the lockup lifts 60 px and fades first (3.05–3.29 s, power2.in), so it is gone before the window starts to climb. Then the window grows to full frame (3.2–4.0 s, expo.inOut 0.8 s, clip-path radius 28 → 0, the shadow fades) and the sky pushes in 8 % behind it. This replaces the r02 push-off: the transition now goes *through* the hero object into the next segment.
- **v1** (r03 total 5.2 s):
  - Defocus 0.8–1.35 s, with a push 1 → 1.38 centred on the lit wall (origin 50 % 30 %).
  - The chapter resolves through a bloom (Rockstar's date reveal): characters de-blur centre-out (50 ms spread, 0.30 s each, so the whole title lands within 0.5 s of its first glyph, readable by ~1.6 s) while the title's tracking settles 0.38em → 0.24em.
  - Out (r03, retuned r04): the chapter blooms out at 3.3 s. **Only then** (3.45 s) does the incoming clip crossfade in under the same soft blur (0.3 s, soft-to-soft). The brightness dips only slightly (.74 → .72, r04; the r03 dip to .40 read as grey-brown mud from 3.55 to 3.80 s). The focus pull runs from 3.62 s (power2.inOut **0.45 s**, was 0.65) with a pull-back 1.43 → 1, so the Keys sign is sharp by ~3.9 s, about 0.2 s sooner than r03.
- **Timings:** both variants read by ~1.7 s, and the chapter is on screen for about 2.1 s. Both end on about 1 s of clean clip B, so the component cuts straight into the next segment.

## Plate notes
- **p02 (blue club) is not usable past ~1.38 s.** It dissolves into the GTA VI logo, then a pre-order end slate (no-trademarks rule). r01 swapped it for p05. r02 brings it back, using only its clean window: normal speed, then a slowed hold (see above).
- **Clean windows** for the clips used: p03 0–1.5 s, p06 3.0–5.45 s (she walks in at 2.7 with motion blur; hard cut at 5.5), p02 0–1.35 s, p01 0–2.15 s (the sign is framed 0.75–2.0 s).
- **p06 in the window runs at 0.62×** (r03): it has to play from 1.45 s to 5.2 s (3.75 s) inside a 2.45 s clean window. Lucia is nearly still, so the slow-down doesn't read as slow motion.

## Round log
- **r01:** first build. Self-review fixes:
  - Contrast failure on the v0 kicker and sub: deepened the upper sky and moved the lockup up into it (centre 760).
  - Cloud streaks were nearly invisible: raised their density and alpha, kept to the lower sky.
  - v1 blur read charcoal: brightness 0.60 → 0.70, saturate 1.35 → 1.6, global shade lightened. The local scrim keeps the type legible.
  - v0 lockup starts 60 ms earlier, so the card is never empty after it lands.
- **r02** (critic r01: v0 7/10, v1 6/10; biggest gap: v1 read as RGB misregistration on a dull grey blur, and v0's upper sky was flat):
  - v1 ground: p05 daylight → p02 night club. Blur brightness 0.70 → 0.52, saturate 1.6 → 1.25. Added the slowed hold layer so no logo frames are ever used. Lightened the scrim to match.
  - v1 one accent: magenta offset on the title only (4 → 3 px, bloom .34/26 px → .20/18 px). The kicker and sub get the system's neutral soft shadow. The current tick is plain white (the sunset gradient is gone).
  - v1 read time: glyph stagger d·0.14 → d·0.05, duration 0.42 → 0.30.
  - v0 sky: thin cirrus across the upper sky plus 2 % stepped grain.
  - v0 motion: square card edge (no 40 px morph). The lockup starts 0.30 s before the card lands (was 0.18 s).
  - v0 kicker: dropped the two hairline rules (the critic called them a stock template move; the PS5 card has none).
  - Safe zone: `titleMaxWidth` 780 → 740. "PROTAGONISTS" now ends at x ≈ 912.
  - Self-review: tweening the hold `<video>`'s own opacity flashed grey frames at 1.37–1.47 s, so it moved to a wrapper div. Hero 3.0 s.
- **r03** (critic r02: v0 7/10, v1 6/10; biggest gap: nothing for the eye beyond the text. v0 was a lockup on empty sky for 3.3 s, and v1's blur was a near-black navy wash that no longer read as footage). No defects were listed.
  - v0 hero object: a 600×338 r28 window playing `clipIn` under the lockup, with a contact shadow. On exit the window grows to full frame and becomes clip B (this replaces the plain push-off).
  - v0 tempo: `card.out` 4.55 → 3.2, `end` 6.4 → 5.2 (full cover ~1.9 s). Cloud drift 90 → 220 px (the canvas was widened to 1440 px so its edge never shows). Cirrus 40 → 70 px.
  - v0 title shadow flattened (second layer `0 4px 14px rgba(84,32,86,.18)`). Ticks 52×8, gap 12.
  - v1 ground: blur 42 px / .52 / 1.25 → 16 px at zoom 1.38 (≈ 22 px on screen) / .66 / 1.15. The push origin moved to the lit wall. The shade is now an even .18 (no dark bottom gradient). The hold layer is a reversed copy of the clean window at 0.4× (was the forward window at 0.2×), so the field keeps moving with no crossfade jump.
  - v1 type: the title is now Barlow Condensed 800, 150 px, 0.06em, with no magenta. The 2 px magenta offset + bloom moved to the 30 px kicker only.
  - v1 swap: moved after `textOut` (3.3 → swap 3.45). Brightness dips to .40 through the 0.3 s crossfade. The focus pull starts once the dip lands.
  - Self-review: the first reversed hold was cut with an output-side `-t`, so `reverse` flipped the whole 8 s plate and the hold showed end-slate frames. It was re-cut with `trim` before `reverse`. The v0 window crop moved from y 6 % to 0 % so her hairline isn't clipped. The v1 focus pull was shortened 0.8 → 0.65 s to cut the blurred daylight stretch. Hero 2.6 s.
- **Polish round 4** (critic r03: v0 6/10, v1 7/10; biggest gap: v0's payoff glitched, with the footage lagging its growing window). Defects fixed first:
  - **v0 empty band in the growing window (3.50 / 3.60 s).** The window is no longer a tweened box. `#segB` stays full-frame, the window is a tweened `clip-path` on `#winClip`, and the clip is placed by a transform on its wrapper `#winMove`, so the `<video>` (and the renderer's injected frame) never changes size. Verified frame by frame from 3.30 to 3.97 s in `rounds/r04/v0.mp4`: footage fills the window on every frame, and the growth is monotonic.
  - **v0 lockup over the growing window (3.53–3.60 s).** The lockup exit starts at `C.out − 0.15` (3.05 s), lasts 0.24 s, lifts 60 px and uses power2.in. It is fully gone by 3.29 s, before the window starts to climb (the window is still ~1006 px from the top at 3.3 s). Verified at 3.30–3.60 s: no "PROTAGONISTS" or stray "S".
  - v0 biggest gap (thumbnail feel): the window is 750×422 at x 165–915, matching the title measure (was 600×338, 56 % of the width). Its top is 1006 (gap from the ticks ≈ 50–56 px depending on the lockup push). `focusY` is now a number (0 = top of the clip, 1 = bottom), because the crop is a transform, not `object-position`.
  - v0 sky lifted toward the PS5 card lavender: the top stops are `#8E76AA` and `#9C7AA8` (were `#6C5B97` and `#8770A4`), and the `#sun` top radial is .12 (was .30). Contrast still passes 8/8.
  - v1 ground: blur 16 → 9 px, brightness .66 → .74, and the even shade is replaced by a radial scrim behind the lockup only (.45 at the centre). The hanging figures now read as figures and not as Rorschach blobs.
  - v1 swap: dip .40 → .72 and `focusDur` .65 → .45. The 3.55–3.80 s grey-brown mud is gone, and the sign resolves ~0.2 s sooner (checked at 3.55–4.1 s).
  - Unchanged on purpose: the layout, the concept, both variants' type, the timings other than the exits, and the hero time (2.6 s).
