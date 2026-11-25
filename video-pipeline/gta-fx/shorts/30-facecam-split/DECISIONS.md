# #30 Facecam split: decisions

## v2 concept (craft v2, round 6)
- **The one idea: "cut the game, punch the face".** The split is edited the way top reaction shorts are cut. The GTA 6 half cuts on rhythm through 4K trailer shots, and the facecam is a held second camera. On the big cut (an explosion in v0, the skydive in v1), the editor's reaction punch-in hits: the face jumps in 1.0 → 1.2 in 3 frames and jumps back out on the next cut. At the same moment the footage takes a `Look.expose` exposure hit with shake and punch-zoom, and the seam (v0) or the bubble rim (v1) flares. There is no white flash.
- **Shots and cuts (all 1.0x).**
  - v0, 16:9 `-h` shots cover-cropped into a 1080×980 panel:
    - s083 duo convertible, 0–1.3;
    - **cut + payoff at 1.3** to s098 Jason, explosion (in-point 0.22, so the fireball is already blooming on the cut; it ends at 2.18, before the shot's hidden cut at 1.13 s);
    - s096 police street, 2.18–3.8;
    - s113 Lucia firing, 3.8–4.63;
    - s065 biker and seaplane, 4.63–6.0 (bright, colourful end).
  - v1, full-bleed vertical `-v` shots:
    - s011 Vice City highway, 0–1.35;
    - **cut + payoff at 1.35** to s135 skydive over Vice City, 1.35–2.95;
    - s012 muscle beach, 2.95–5.1;
    - s064 jetski, 5.1–6.0 (the brightest shot; it stops at 0.9 s, before the riders swing under the bubble).
- **Where the type sits.** v0's lockup hugs the seam from above, inside a 520 px valley of shadow at the bottom of the game panel. The bottom third of every 16:9 shot is road, car door or water, so faces and the action stay clear above it, and the facecam below the seam is never touched. v1's lockup sits beside the bubble, in the sky band of the vertical shots (y ≈ 260–650) under a soft top scrim. Every v1 shot keeps its subject below y ≈ 650 for as long as the lockup is up.
- **Hero size and face.**
  - v0: "GTA 6" in Archivo wide 800, fitted to 720 px of ink (≈ 207 px type, 83% of the safe width). "GTA" is white with a soft lift and bloom; the "6" carries the Leonida sunset fill, the frame's one accent. The kicker "@EVERESTCHRIS6 REACTS" is Archivo wide 26 px, tracked .3em, 88% white. Size ratio ≈ 8:1.
  - v1: "Vice / City" in Inter display 800, 190 px, two lines; "City" carries the sunset. The kicker "@EVERESTCHRIS6" is Archivo wide 26 px.
  - Two families, three sizes at most, in each variant.
- **Payoff:** v0 at 1.3 s and v1 at 1.35 s, both on a cut, with the hero already complete (its reveal ends at 1.16 s).
  - v0: `Look.impact` (flash 0, amp 9, zoom 1.035) and `Look.expose` (peak 1.85, 2-frame hold) on the game panel. The face punch-in and a light shake on the face. A warm bloom on the seam plus a glint that runs its length. A 0.6 s sheen across the sunset "6".
  - v1: the same impact, with `Look.expose` peak 1.5, because the skydive sky is already bright and 1.8 put the white "Vice" on blown sky. The face punch-in inside the bubble, a 1.045 scale pulse of the whole bubble, a rim flare, and the sheen across "City".
  - Hero frame: 2.0 s. Both faces are punched in, the explosion and the spread-eagle diver are at their biggest, and the sheen is done, so both sunset words are in their final colour.

## v2 key decisions
- **v1's look is gone.** The ink-navy handle chip, the 6 px sunset seam rule, the 3-bar speaking meter, the blurred-fill band, the old `assets/plates` footage and the headroom-extension hack are all removed. The owner called that "basic", a dark UI chip on soft footage. What stays from v1: the job (facecam + gameplay + seam + label), `@everestchris6`, the two variant names, the re-encoded facecam in `assets/cam/` (keyframe every 1 s, so seeks never freeze) and the CONFIG-driven slot system.
- **The seam is light, not a rule.**
  - It is a 2 px warm-white line with a three-step bloom.
  - It sits between two shadows: the game panel's bottom valley, and a 110 px shade the seam throws onto the facecam.
  - It draws in from the left with a glint riding its head (0.04–0.9 s).
  - At the payoff it flares, a full-strength glint runs it, and the bloom decays over 0.9 s.
  - Every later cut gets a softer glint in alternating directions, so each cut is a beat.
  - The sunset accent lives on the hero, so the seam doesn't compete with it.
- **The facecam gets no label of its own.** The lockup says who is reacting and to what ("@everestchris6 reacts / GTA 6"). The face panel stays clean. That fixes v1's recurring defect, where the label sat on the hair. With nothing over the face, the face can be big: scale 0.92 of the source, eyes at y ≈ 1215, mouth ≈ 1338, chin ≈ 1422, all above the 1480 caption line. It is framed slightly right of centre (eyes at 53%) to balance the left-aligned lockup.
- **v1 is full-bleed vertical, with the cam docked in a real corner.** The bubble is 380 px at (72, 256). Its 3 px white rim draws from 12 o'clock while a circular mask opens on the face (opacity snaps in over 0.1 s, so no ghosted face shows). It casts a contact and soft shadow onto the footage. The bubble and lockup together span x 72–≈880 (≈ 93% of the safe width), so the frame reads as a broadcast speaker super, not a small floating widget. The rim's warm glow breathes with a deterministic syllable-rate envelope (`CONFIG.voice`), which replaces v1's speaking-meter bars.
- **Optical alignment is measured, not guessed.** `inkLeft()` reads each line's first-glyph side bearing from canvas `measureText` (with `fontStretch: expanded` for Archivo wide) and offsets the line by it. The ink of "G" and "@" (v0), and of "V" and "@" (v1), share the column exactly (checked in the hero PNGs: both at x 72 in v0 and ≈ 490 in v1).
- **Masks open after the reveal.** `Look.reveal` clips each char in an `overflow:hidden` mask, which would also clip the bloom and lift shadows into hard rectangles. A timeline `set` turns the masks to `overflow: visible` the frame the reveal ends.
- **Exits.** v0's lockup blurs out at 4.95 (stagger .06, done by 5.46), and the clean split holds to the end on the bright s065. v1's lockup blurs out at 4.55, before the jetski cut, and the bubble stays docked (it is the persistent element, already at the edge).
- **bg "none".** v0 keeps both halves, because the split is the frame, but drops the grain, vignette and exposure hit. v1 drops the gameplay and finishing and keeps the bubble, lockup and top scrim on alpha. I checked a WebM frame at 2.0 s, with its alpha.
- **Shot hazards found and avoided.**
  - s098 has a hidden cut to a green frame at 1.133 s, so the in-point plus duration stays ≤ 1.10.
  - s064's spray whites out the frame from 1.3 s, and from about 1.0 s the riders swing under the bubble, so it is used for 0–0.9 s only.
  - s098's car headlight flared behind the "G", so its crop is `object-position: 100%`.
  - s096's first 2 frames are dark, so its in-point is 0.1.

## v2 round 6 (this round: first v2 build)
- Built from scratch to the concept above. I checked the composition with `hyperframes snapshot` (v0 directly; v1 through a scratch copy whose default variant is 1), then captured r06 three times with the same round number:
  1. **Hero 1.75.** At 1.36 s the s098 in-point 0.1 showed Jason before the fireball, so the hit landed on a dark frame. The in-point moved to 0.22 and the later shots were re-timed. At the hit the v1 skydive sky blew out under the white "Vice", so expose went 1.8 → 1.5. The punch-in went 1.16 → 1.2 (v0) / 1.18 (v1), so it reads at phone size. The v1 kicker went 24 → 26 px.
  2. **Hero 2.0.**
     - The sheen was still mid-sweep on the "6" at the hero time, so it was shortened 0.85 → 0.6 s and the hero time moved to 2.0.
     - At 5.96 s the jetski riders had swung behind the v1 bubble. s064 now runs 0–0.9 s only, s012 holds 2.95–5.1, and the v1 lockup exits at 4.55.
     - The bubble showed a ghosted face at 0.08 s, so its opacity now snaps in over 0.1 s and the mask does the reveal.
     - The bubble's facecam now starts at 1 s (CONFIG `camIn`).
     - The intentional overflows (mask padding, optical offsets, the seam bloom) are marked `data-layout-allow-overflow`.
  3. **Final.** s098 was cropped at 100%, moving the headlight haze out from behind the "G".
- **Check:** passes with 0 errors, 0 layout warnings and 16/16 WCAG AA. There are 2 lint warnings:
  - `duplicate_media_discovery_risk`: the two variants' facecam `<video>`s share a source; only the active variant's one renders.
  - `composition_file_too_large`: one file, so CONFIG drives both variants.
- **freezedetect** finds no frozen spans in either MP4.
- **Frames checked:**
  - v0 at 0.1, 0.12, 0.4, 0.5, 1.27, 1.33, 1.34, 1.4, 2.0, 2.1, 2.25, 3.2, 3.3, 4.7, 5.05, 5.2, 5.3 and 5.96;
  - v1 at 0.08, 0.12, 0.2, 0.45, 0.5, 1.30, 1.34, 1.37, 1.45, 2.0, 3.2, 3.3, 4.4, 4.7, 5.0, 5.2, 5.5 and 5.96.

  In every one: no clipped glyphs, all type inside x 72–936 / y 230–1480, no type on a face, Archivo and Inter only, and clean last frames.
- **Unresolved (honest notes for the critic round):**
  - The facecam is the soft 1080p stock stand-in from `assets/plates`. It is graded lightly (contrast 1.07, saturate 1.08), and creators replace it with their own.
  - s135 is a naturally hazy, blue-grey aerial. It is the payoff shot because it is the most "Vice City" moment, but it is the coolest-toned frame in v1.

---

# v1 history (rounds 1–5, superseded by craft v2; kept for the facts and seek-safety lessons)


### Round 1

**What the refs show.** Every reaction ref (g-eOAk2VrVk, LBw5xmgDFCM, -jra4QoVNN8) uses a hard-edged rectangle facecam pasted top-right, with no border, no label and no seam treatment. The 9:16 version (xjJpat61z9o, 1.7M) stacks gameplay over face with one word on the seam. The format works; the craft is missing. Nobody labels who is reacting.

**Variant 0, Top/bottom** (follows xjJpat61z9o's stack and analysis-2's "one word on the seam")
- Gameplay above (the 16:9 `-h` plate, `object-fit: cover` in a 1080×1000 panel, so the frame is wide, not a blurry centre crop). The facecam sits below in a 1080×920 panel.
- The seam is at y 1000, in the middle of the safe zone, so the label on it is never under platform UI. The face sits in the upper half of its panel, with the chin at about y 1460, above the 1480 caption line.
- The seam is a 4 px Leonida pink→amber rule. It is the frame's one accent, and it draws outward from the centre.
- The seam label is an ink-navy pill that straddles the rule at x 72: a 3-bar speaking meter, then `@everestchris6` (Inter 700, 34 px), a hairline, then `REACTION` (Inter 600 caps, tracked 0.3em). Because it sits half on each panel, it reads as a pin holding the two halves together.
- A smoked-glass `GTA 6 · GAMEPLAY` tag at the top-left of the gameplay half labels the source, since analysis-1 flags unlabelled splits as a gap.
- A 90 px soft shade under the seam lifts the gameplay panel over the facecam.
- Motion: both halves settle (scale 1.07/1.04→1, expo.out), the seam draws, the label pops (0.86→1, back.out 1.5) and the tag drops in. Everything reads by 0.6 s. In the last 0.4 s the graphics clear and the footage stays, so the loop point is the plain split.

**Variant 1, Corner bubble** (follows the top-right facecam in all three refs, made native to 9:16)
- Full-frame gameplay with a 400 px facecam bubble whose right edge is on the 936 px safe line, at y 248. The top-right is where the refs put the cam and where the viewer already looks for it.
- The bubble has a 6 px sunset ring, a 7 px ink gap, then the face. This is the familiar "story ring" read, and the ring is the frame's one accent. It has a 1 px inner highlight and a contact shadow plus a large soft shadow.
- The face is reframed (CONFIG `faceFrame`) so head and shoulders fill the circle, rather than shrinking a whole 16:9 webcam into it.
- The handle pill overlaps the bottom of the ring, centred, in the same chip style as variant 0.
- Motion: the bubble pops, the ring draws round from 12 o'clock, the face settles and the pill slides up. At the end the pill drops away and the bubble shrinks out.
- With `bg: none`, the gameplay is dropped, leaving only the bubble and label on transparent, ready to lay over your own clip.

**Shared**
- The speaking meter is three white bars driven by a seeded PRNG at 9 updates/s. It keeps the label alive and says "this person is talking" without a red REC dot, because red is reserved for police states.
- Duration is 6.5 s. The p09 sample plate cuts to an unrelated headphone ad at 6.73 s, so the piece ends before it. The 4.1 s cut from the chase to the bench-press gameplay is kept, because compilations cut.
- Type is Inter only, in two sizes (34 / 26). There are no trademarks.
- Hero time is 1.7 s (truck with lights and sparks; v1's 2.3 s frame was motion-blurred).

### Round 2 (critic: v0 7, v1 7, no defects; gap: "clean but generic", v0's seam hidden, v1's bubble not in a corner)

**Variant 0, Top/bottom**
- **The seam is now the hero.** It is 6 px instead of 4 px, with a 1 px `rgba(0,0,0,.45)` hairline above and below so it holds on bright or dark footage. The seam chip is centred on it (a full-width flex row, so GSAP's scale doesn't fight a `translateX(-50%)`), so the pink end shows on the left and the amber end on the right. At 360×640 both ends read.
- **The entrance order is reversed to fit the centred chip.** The chip pins on first (T.in), then the seam runs out from behind it to both edges (+0.12 s, expo.out). On exit, the seam retracts into the chip and then the chip clears. So the label and the seam read as one object.
- **One label.** `gameTag` defaults to `""`. If a creator turns it on, it now uses the same ink .94 material and contact/soft shadow as the seam chip, so there are never two materials in the frame.
- **Gameplay gets the square.** `seamY` moved from 1000 to 1080, so the gameplay is 1080×1080 and the face panel is 840 px.
- **The face is framed tighter, but not as tight as the critic suggested.** `span` went from 0.90 to 0.76 (8% closer) and `cy` to 0.40. The critic proposed `{cy .36, span .72}`, but measured on the render that puts the mouth at y ≈ 1500 and the chin at ≈ 1605, under the platform caption UI (the safe line is 1480), and the hair tangent to the bottom of the chip. At span 0.76 and cy 0.40 the hair starts about 20 px below the chip, the eyes are at about 1330 and the mouth at about 1460 (inside the safe zone), and only the T-shirt sits under the caption UI. I tried cy 0.42 first; the hair touched the chip's lower edge, so I moved it down.

**Variant 1, Corner bubble**
- **It is in a real corner now.** The bubble went from `{size 400, right 936, top 248}` to `{size 340, left 72, top 236}`, so it covers x 72–412, y 236–576, flush to the top-left safe corner. The centre column is clear: Lucia's head (5.8–6.2 s) and the truck cab (1.7 s) are no longer covered. CONFIG accepts `left` (preferred) or `right`.
- The ring SVG's geometry (viewBox, radius, gradient line) is now computed from `bubble.size`, so any size keeps a 6 px stroke on the outer edge.
- The handle pill is measured after the fonts load, centred under the bubble, and clamped to the 72/936 safe lines. At this size it sits at x 72–417.
- **Entrance: mask reveal, not a crossfade.** The face layers (`#bubbleClip`) open with `clip-path: circle(0% → 50%)` over 0.30 s expo.out at full opacity, so there is no ghosted face over the gameplay. The ring sweep starts 0.06 s later, and the bubble scales 0.94→1 with it. The contact and soft shadow is on its own unclipped layer (`#bubbleShadow`) and fades in, so the mask never cuts it off. The pill slides up at +0.30 s.
- **Exit mirrors the entrance.** The pill drops, the ring un-draws (dashoffset 0 → −1, so the tail chases the head), and the mask closes to 0%. Everything is gone by 6.46 s.

**Shared**
- **Seek-safe facecam.** `_shared/plates/facecam-sample.mp4` had keyframes only at 0 and 8.33 s. I can't edit `_shared`, and `sync_shared.sh` would overwrite a re-encode in `assets/plates/`, so I put a re-encoded copy at `assets/cam/facecam-sample.mp4` (`-g 30 -keyint_min 30 -sc_threshold 0`, crf 17, same full-range colour; the mean colour checked identical) and CONFIG points there. The compiler's sparse-keyframe warning is gone, and freezedetect finds no frozen spans in either render. The README tells creators to export their own clip the same way.
- Both facecam `<video>`s carry `data-layout-allow-overflow`, because the crop is meant to overflow its panel. That clears the round-1 layout warning.
- The hero time stays at 1.7 s (truck, lights and sparks; the face is mid-word).

### Round 3 (critic: v0 7, v1 6; defect: the seam showed through the translucent chip; gap: v1's full sunset ring read as an Instagram story avatar)

**Defect fixed, v0 seam vs chip**
- **The chip is solid now.** It went from `rgba(31,32,43,.94)` to solid `#1F202B` (the optional game tag too), with no backdrop blur. Nothing behind it can show through the type.
- **The seam is two segments, not one rule passing behind the label.** `#seamL` and `#seamR` stop 24 px under the chip's round ends. At that depth the 40 px cap still covers the 6 px line completely, so the segments never sit behind the handle or the kicker. Each segment samples the same 1080 px sunset gradient (`background-size: 1080px`, `background-position: -x`), so the left still reads pink and the right amber.
- **The entrance order is kept** (the r02 decision): the chip pins on, then each segment grows outward from its edge (`transformOrigin` 100% for the left segment, 0% for the right).
- **On exit the seam fades in place** (opacity 1→0, 0.18 s at T.out) instead of retracting into the chip. The chip clears at T.out + 0.16, once the seam is gone. I checked frames 5.95–6.45 s in the render: no line runs through the text in any frame.

**v0 framing**
- `seamY` went from 1080 to 1140, as the critic suggested, so the gameplay gets 59% of the frame.
- `cy` 0.36 alone would have pushed the mouth to about y 1510, under the caption UI. At this panel height (780 px) the crop is already clamped to the top of the source, so I widened `span` from 0.76 to 0.88. Measured on the render: hair about 45 px below the chip, eyes about y 1365, mouth about y 1462 (above 1480).

**Speaking meter (both variants)**
- The bars are 6 px wide and animate `height` in px (10–26 px), not `scaleY`, so the rounded ends stay crisp and the bars never collapse to dots.
- At rest they hold an uneven 12/20/14 px "ılı" shape, which reads as a level meter, not an overflow menu or a pause icon.

**Variant 1, Corner bubble: new identity**
- **The sunset ring is gone.** The bubble is now:
  - a 2 px `rgba(255,255,255,.9)` ring on the outer edge;
  - a 6 px ink-navy gap;
  - the face;
  - a 1 px inner highlight;
  - a contact shadow plus a soft shadow.

  The ring is a hairline, not a gradient. That removes the "story avatar" read.
- **The frame's one sunset accent moved into the chip:** the three meter bars sample `#F84FA4 / #FE8E4E / #FEB747`. They also move, so the accent says "this person is talking".
- **The chip is no longer pinned over the bubble's base** (Instagram Live puts its badge there). It runs right from the bubble, tucked 44 px behind its edge and centred on its middle: a speaker lockup, the way a broadcast name bar sits beside an avatar. It slides out from behind the bubble. It spans x 388–782, inside the 936 line.
- **The stage follows the vertical-clip-blurred-fill-facecam ref (-jra4QoVNN8).** The r02 gameplay was a 1.78x upscale of a 16:9 crop and looked soft. Now:
  - The `-h` plate sits at native sharpness in a 1080×608 band (a true 16:9, nothing cropped), centred at y 1000 (y 696–1304), with a contact and soft shadow.
  - Behind it is a blurred fill of the same clip: drawn at quarter size, blur 40 px, brightness .6, saturate 1.15, and oversized so no blur edge shows.
  - The bubble (now 360 px, at x 72, y 280–640) sits in the upper third, over the fill. It no longer covers any gameplay, which is what the facecam-box and blurred-fill refs do.
  - `stage: "full"` brings back the full-frame layout for creators with a native 9:16 clip.
- **Motion follows the critic's spec.** On entry, ring, gap and face pop as ONE wrapper (scale 0.86→1, back.out(1.5), 0.32 s; opacity in over 0.1 s). The white ring then draws round from 12 o'clock (0.5 s expo.out, starting at +0.14 s), and the chip slides out at +0.22 s. On exit, the chip slides back behind the bubble, then the whole bubble scales 1→0.92 and fades over 0.3 s. Nothing shrinks inside a detached ring.
- With `bg: none`, the fill and band drop out, leaving the bubble and chip on transparent (verified with a snapshot).

**Shared**
- `timing.out` moved from 6.08 to 6.0, so the two-step v0 exit (seam fade, then chip) still finishes by 6.42 s, inside the 6.5 s loop.
- The hero time stays at 1.7 s (truck, lights and sparks; the face is mid-word).
- The check warnings are lint only and were already there in r02: duplicate media, because both variants' `<video>` tags share sources and only the active slots render, and the `#ov` sub-composition hint. Runtime, layout, motion and contrast checks are all clean.

### Polish round 4 (critic: v0 7, v1 7; defect: in v0 the seam label's bottom edge sat on the subject's hairline in every frame; gap: neither layout is composed around the face)

**Defect fixed: v0 label vs hair**
- **The critic's numbers can't be reached by moving `cy` alone, so I added headroom.** The sample facecam has only about 35 source px above the hair, and `frame()` clamped the crop to the panel top, so the hair could never sit more than ~35 px below the seam. The critic's target (hair at y≈1188, mouth at y≤1460) needs the clip to start about 80 px below the seam.
- `faceFrame` gains `pad` (default 80): the clip's top edge may now sit that far below the panel top. The band above it is filled by `#faceExt`, a second copy of the facecam (`face0x`) whose top 24 source rows (wall, plant and shelf posts above the head) are stretched up, blurred 12 px and dimmed. The sharp clip's top 22 px feathers into it with a mask. So the room continues up under the seam, with no black bar and no ghost hair. `#faceShade` deepens the top of that band.
- **`seamY` went from 1140 to 1080**, as the critic asked. The gameplay panel is exactly 1080×1080, so the 16:9 plate is at native 1:1 scale and the r03 1.06× upscale softness is gone.
- `faceFrame` is now `{cx .48, cy .40, span 1.02, pad 80}`. Measured on the r04 render at 0.7, 2.5, 4.0 and 5.5 s: the label's bottom edge is at 1120 and the hair top is at 1185–1190 (a 65–70 px gap in every frame), the eyes are at about 1350 and the mouth at about 1455–1460, above the 1480 caption line.
- The label is still centred and still straddles the seam. The r01/r02 decision is kept; only the face moved.

**v0 seam depth**
- The gameplay panel is now the top layer (`z-index 2`, with `#L0` as its own stacking context so the labels stay above it). It casts `0 10px 28px rgba(0,0,0,.40)` down onto the facecam under the sunset rule, so the split reads as two layers rather than two flat videos butted together.

**v1 deeper ground (cheap, no layout change)**
- The fill's brightness went from 0.6 to 0.42. A new `#vig` adds a radial vignette (transparent to 55%, then `rgba(0,0,0,.35)` at the edges).
- The band gets a 1 px `rgba(255,255,255,.14)` hairline on its top and bottom edges, plus a `0 18px 48px rgba(0,0,0,.45)` shadow, so it lifts off the backdrop instead of sitting in grey-brown mud. With `stage: "full"`, the hairlines are hidden (`.bare`).
- **Not taken: the 4:3 band with the bubble overlapping its corner.** It would reverse two deliberate r03 decisions (the band is "a true 16:9, nothing cropped", and the bubble "no longer covers any gameplay"). Both follow the refs: in -jra4QoVNN8 and LBw5xmgDFCM the cam sits in the blurred margin, not on the clip. On this plate, a 4:3 crop would also cut the HUD minimap down to a blue sliver at the left edge. v1 scored 7 and the critic named no defect, so the layout stays.

**Speaking meter (both variants)**
- The facecam sample has no audio track, so there is no real RMS to bake. I also tried deriving levels from mouth motion, but the sample's duplicated frames make that signal as jittery as the PRNG.
- So I took the critic's alternative: `voice.rate` went from 9 to 6 updates/s, and each step is a 0.12 s `power2.inOut` move followed by a hold (`voice.tween`). The bars now pulse at syllable rate instead of jittering.

**Check**
- Same two lint warnings as r03 (duplicate media and the `#ov` sub-composition hint). Runtime, layout, motion and contrast checks are clean.
- The hero time stays at 1.7 s.

### Polish round 5 (critic: v0 7, v1 6; no defects; gap: v1's bubble floats in a near-black blurred void, and v0's only label shrinks to an unreadable ~8 px grey "REACTION" at phone size)

**v1 ground: coloured footage, not a void** (critic's numbers, taken as given)
- `fill` went from `{40, 0.42, 1.15}` to `{40, 0.62, 1.35}`, and the `#vig` edge from `rgba(0,0,0,.35)` to `.22`.
- Measured on the 1.7 s hero, the mean luma under the band (y 1344–1920) went from 48 to 78, and above the bubble (y 0–440) from 22 to 32. The top stays darker because it is the blurred top of the source (trees and shade), not a dim filter. It now reads as warm, coloured blurred road, like -jra4QoVNN8, and not as brown-black mud.
- This partly walks back r04's dimming, which was a response to the r03 "grey-brown mud" note. The value now sits between the two (r03 0.6, r04 0.42, r05 0.62 with more saturation), so the fill stays colourful instead of grey.

**v1 bubble tied to the gameplay** (the scored-6 gap)
- `bubble` went from `{360, 72, 280}` to `{420, 72, 440}`, and `band.centerY` from 1000 to 1040, so the band now runs y 736–1344.
- The critic proposed `top: 500`, but with the band moved that is a 184 px overlap, not the ~120 px they described. I followed the stated intent: at `top: 440` the bubble (y 440–860) bites 124 px into the band's top-left corner.
- The cam and the clip now read as one object: a broadcast picture-in-picture, the way the facecam-box refs paste the cam onto the gameplay. The bubble's contact and soft shadow falls on the band.
- The dead area under the band shrank from 616 px to 576 px, and the band's empty run above the bubble from ~280 px to ~210 px (most of that is the platform's top UI zone).
- **Reverses part of r03/r04 ("the bubble no longer covers any gameplay").** That was justified while v1 scored 7. At 6, with "floating, disconnected bubble" named as the biggest gap, the overlap is the fix. It is held to the band's top 124 px.
- The cost: in some chase frames (around 1.7–2.3 s) the arc covers the upper-left corner of the truck's roof and windshield. The grille, lights and sparks stay clear. The HUD stars (top-right) and the minimap (bottom-left) are untouched.
- The chip still runs right from the bubble at its vertical middle (y 604–696, x 448–~896), above the band and inside the 936 line.

**v1 ring and accent: partly taken**
- `#photo` and `#photoHi` inset went from 8 px to 4 px, so the ink-navy gap is now 2 px, not 6. The 2 px white hairline hugs the face like a tight broadcast cam frame rather than a padded avatar widget.
- **Not taken: the 4 px sunset ring with white meter bars.** That is the r02 look (6 px sunset ring plus ink gap), which the r02 critic called an Instagram story avatar, and r03 removed it on purpose. Bringing it back would flip-flop.
- The sunset stays on the meter bars. They are now bigger (7 px wide, 12–30 px tall, see below), so the accent reads better at phone size.

**v0 label legible at 360×640** (critic's numbers)
- `.handle` went from 34 to 40 px, and `.chip` from 80 to 92 px tall (padding 30/34).
- `.kicker` went from 26 px at 72% white with 0.30em tracking to 28 px at 88% white with 0.24em tracking. The separator is 34 px tall at 26% white.
- The chip is still centred on the seam: `chipH` is read from the CSS, so the chip row sits at `seamY − 46`. The seam segments still stop 24 px under the round ends, which still covers the 6 px line completely at radius 46.
- The chip is now about 650 px wide (x 215–865), inside 72–936. On a 360×640 downscale of the hero, "REACTION" reads as distinct, bright letters.
- v1 uses the same chip class, so its handle grows too.

**v0 face tighter, without bringing back the r03 defect**
- The critic proposed `span 0.88, pad 50`. On this source, `cy` 0.40 would put the clip top at 38 px. Measured, that is hair about 23 px under the new 92 px chip (bottom y 1126) and mouth at about 1463. That is the label-on-hair tangency the r03 critic flagged as a defect.
- So I solved the two constraints together: hair at least ~45 px under the chip, and mouth above the 1480 caption line. `faceFrame` is now `{cx .48, cy .38, span .92, pad 64}`, where pad governs the top.
- The face is about 11% larger (about 270 px across, up from 245). Measured at 0.7, 2.5, 4.0 and 5.5 s:
  - hair top at about 1165–1175, which is 40–50 px under the chip;
  - eyes at about 1360;
  - mouth at about 1470.
- The dark band from the seam to the hair is 85–95 px, down from ~108 px, and the chip covers its middle 650 px.

**Speaking meter (both variants)**
- The bars scale with the larger type. Each is 7 px wide with a 5 px gap, in a 31×30 box. `voice` went from min/max 10/26 to 12/30, and rest from [12,20,14] to [14,23,16]. Rate and tween are unchanged (6/s, 0.12 s).

**Verified in the r05 render**
- The check passed with the same two lint warnings as r03/r04. Layout, runtime, motion and contrast are clean. freezedetect finds no frozen spans in either MP4.
- v0 entrance and exit, at 0.15/0.25/0.4/6.05/6.15/6.3 s: the seam never runs under the type, and the larger chip still pins on before the seam grows.
- v1 entrance and exit, at the same times: the pop, ring draw and chip slide are clean over the band, and the exit leaves no ring fragment behind.
- The hero time stays at 1.7 s.
