# Decisions: 28 · Clip carousel

## Round 1

**Format the refs prove.** The multi-panel reference (`multi-panel-split/LBw5xmgDFCM-135`, 437K views) shows several clips at once with no labels, no hierarchy and no chosen state. This component keeps the "many clips at once" read but gives it a hierarchy: one card is chosen and plays at full colour, and the others are dimmed (34% brightness, 35% saturation) so the eye goes to one thing at a time. It is also the missing "numbered clip / countdown scaffolding" named in `analysis-2.md` and `analysis-3.md`.

**Three.js, because depth is the point.** It is a real 3D ring and deck with a perspective camera. Card state, the camera and the backdrop are pure functions of the timeline time, built with `gsap.parseEase` curves rather than tweens. The scene renders from a timeline proxy and from `hf-seek`, so random seeks and the 2-worker render give identical frames.

**Footage on the cards.** Each card is a WebGL texture of a framework-owned `<video>` in a hidden `#bank`. At render time HyperFrames injects each frame as an `<img class="__render_frame__">` after its video and then fires `hf-seek` again. The scene draws that image (or the live video in preview) into a fixed 1280×720 canvas and uploads it. The fixed size avoids the texture-storage size-change errors that the first check showed.

**Card craft.**
- Rounded-rect SDF mask with a 26 px radius at the front position.
- 1 px inner hairline and a faint top sheen.
- A sharp contact shadow plus a large soft one, rendered as a shadow quad behind each card.
- A smoked-glass rank chip, top left.
- A 6 px play bar over a bottom scrim, shown only on the playing card.
- Back faces are ink-navy with the rank numeral, so the far side of the ring reads "1 · 2". The numeral sits in the upper half, the part visible above the front card.

**Type and colour (DESIGN.md).** Three sizes are used:
- 200 px Barlow 900 for the rank numeral, the only sunset-gradient element in the frame;
- 88 px Barlow 800 caps for the title and the item name;
- 28 px Inter 600 caps tracked 0.3–0.34em for the kicker and sub line.

The title sits in the upper third (y 252–440). The label sits at y 1286–1450 under the front card, centred and inside x 72–936.

**Motion.**
- Ring: spins in through four steps with `expo.out` (1.65 s), then the chosen card pushes 4 units forward with `power3.out`. The turn to the next card is a 72° step with `power3.inOut` over 0.85 s.
- Stack: cards rise in staggered back to front. The flip arcs the front card up over the deck while the deck advances one slot.
- Both variants end with a 0.68 s camera push into the chosen card, so the clip fills the frame. That is the clean clear: graphics leave and the footage takes over.

**Backdrop.** With `bg: "plate"` there is a full-frame, mip-blurred, darkened, cover-fit copy of the playing clip, crossfaded during the turn. It is opaque from frame 0. An earlier draft faded it in from transparent, and the MP4 encoder showed that as a white first frame.

**Plate choice (no trademarks).** The `-h` plates are multi-shot trailer cuts, so each card's `from` (`data-media-start`) is picked by cut times:
- p02 is dropped: its blue-club shot cuts to the official GTA VI logo at 2 s.
- p09 is kept only before 7.5 s, which is where a console-accessory ad begins.
- Ring: #5 Leonida Keys (p01, the sign shot runs to 4.2 s) and #4 Jason & Lucia (p06 from 0.95 s, the golden-hour shelter shot).
- Stack: #5 The drive-by (p04, the mural shot runs to 4.4 s) and #4 Jason Duval behind the wheel (p03 from 0.6 s, the driving shot).

Names and places come from FACTS.md.

## Round 2

The critic's line was that the 3D object fought the footage. Every change below either removes something that competed with the clip or fixes a named defect. The round-1 decisions that the critique did not name as defects stay: the Three.js ring and deck, pure f(t) state, footage as live WebGL textures, the type system (one sunset numeral, Barlow title, tracked Inter kicker), the radii and hairlines, and the plate cut choices.

**Defect: v1 flip sliced through #4 (3.83–3.95 s).** The old path rotated the card about its centre while it rose, so its bottom edge swung forward into the advancing #4. The new path (`FLIP` in the script) has three properties:
- the card lifts up and toward the camera (`lift` 5.5, `toward` 4.5 world units on a sine arc) while it tips back;
- its rotation leads its position (`rotLead` 0.7), so it is fully turned over before it slides back above the deck and drops into the last slot;
- the deck only advances at 30% of the flip (`advAt`), once the card is clear.

I checked the path numerically (a 2D y/z test of the flipping card's edge segment against each deck card's plane at 800 steps). Clearance is at least 1 world unit (~47 px) at every frame. The card's top edge stays at or below y 420 px, so it never crosses the title. Once it passes 90° its `renderOrder` drops below the deck, and its contact shadow fades out for the flight because a card in the air casts no contact shadow. The r01 path failed the same test at 3.85 s, which matches the critic's frames.

**Defect: payoff was a blind 3.2x centre crop, soft, with no face.** The plates' `-v` versions are centre crops of the `-h` files. I checked p06 and p03 side by side, so crossfading to them would not have brought the faces back. Instead:
- each item has a `focusX`, and the push-in ends centred there, clamped so the frame never leaves the card. p06 uses 0.70 and Jason's head and shirt are in frame. p03 uses 0.72 and Jason's face is centred with look-room to the left. I measured both from frames in the payoff window, not from the critic's estimate (0.80 put p03's face at the left third);
- `items[1]`, the only clip that goes full frame, is now staged at 1920×1080 instead of 1280×720. The end frame is therefore the same 1.78x upscale as the sample `-v` plates, not a 2.7x one.

**v0 back faces.** The ~120 px grey "1"/"2" numerals are gone from both variants. A card's back face now shows its own clip, read the right way round, at 0.55 saturation × `look.back` 0.24 over ink-navy `#1F202B`, with the shared 1 px hairline. The far side of the ring reads as more clips, and the only big numeral on screen is the sunset one in the label. `look.dim` went from 0.34 to 0.55, unfocused saturation from 0.35 to 0.6, and side-card chips to 55% opacity, so the side cards read as clips and not as black slabs.

**Backdrop.** The brown and red smudge came from a small blur at 0.40 gain. The blur is now a 24-tap disc of radius 0.09 on mip 4.5, with no blotches. Saturation is 1.4 at `look.backdrop` 0.24 under a radial vignette into ink `#0B0B0E`, centred behind the cards. The colour sits behind the cards and the title band stays clean. I chose this over the soft sunset wash because the sunset gradient is already the frame's one accent (the rank numeral), and a light wash would cost the white title its contrast.

**v0 timing.** The ring now spins in over two steps (144°) with `power3.out` in 0.9 s, which also removes the 37°/frame whip of the old `expo.out` start. It lands at 0.95 s and the label enters at 1.05 s, so "5 · LEONIDA KEYS" reads by about 1.3 s. The recede before the turn is 0.2 s (out0 3.30, turn at 3.42). The second card lands at 4.10, the push-in runs from 6.12 to 6.84, and the clip holds full frame to 7.0. v1 moves out0 and the flip about 0.07 s earlier, and the payoff keeps the same window.

**Alignment.** The camera uses `setViewOffset` to shift the 3D view 36 px left (`AXIS_SHIFT`), so the front card is centred on x = 504, the axis of the title and labels. The shift eases back to 0 during the push-in so the final clip is centred on the full frame. The field of view went to 31° (Ring) and 32° (Stack), so the front card is ~760 px wide (x ≈ 124–884), inside the 936 rail.

**Verified in the r02 render (hero 5.4 s).** In the v1 frames at 3.7–4.1 s the flipping card passes above #4 and is seen edge-on, with no slice. Both end frames keep the subject's head in frame: v0 ends on Jason's head and shirt, v1 on Jason's face in profile. The front card spans x ≈ 120–890 in both heroes. The first rank reads by about 1.25 s in v0.

## Round 3

The critic's biggest gap was that the playing clip was a ~760×430 postage stamp in about 60% near-black murk. Every change below makes the footage own the frame or fixes a named defect. These round-1 and round-2 decisions stay: the Three.js ring and deck, pure f(t) state, live WebGL footage textures, the type system (one sunset numeral, Barlow title, tracked Inter kicker), the focusX push-in payoff, and the plate cut choices.

**Defect: v0 entrance ghosting.** Card meshes no longer fade with their own alpha (`uAlpha` stays 1). The carousel now enters as one layer:
- it fades over 0.25 s, scales 0.86 → 1 on a parent `rig` group, and spins 108° (v0) or rises (v1);
- while anything is below full opacity, a depth pre-pass writes only the nearest card surface (`colorWrite` off, `uPre` discards the anti-aliased rim), so a fading card shows the backdrop behind it and never another card. This also covers the side cards fading out during the push-in.

I did this inside GL rather than with CSS opacity on `#gl`, because `#gl` also carries the backdrop. Fading it would make frame 0 transparent, which is the white-first-frame bug from round 1. Timing is tighter: `enterDur` is 0.55 (v0) and 0.50 (v1), and `lab0` is 0.70, so "5 · Leonida Keys" reads by 0.75 s in both variants (checked in the r03 entrance strip).

**Defect: v1 payoff crop.** `items[1].focusX` went from 0.72 to 0.80. I re-measured p03 at 6.7–7.6 s into the file: the head runs from the nose at x 0.66 to the back of the cap at about 0.95–0.99, and the end window is 0.30 of the clip wide. At 0.80 the cap and the back of the head stay in frame. The nose is about 50 px from the left edge, and the top of the cap is cut by the source frame itself. My round-2 choice of 0.72 kept look-room but cut the head, which is the worse defect.

**Footage owns the frame.**
- FOV goes from 31/32 to 26.8 (Ring) and 27.2 (Stack), so the front card is 900 px wide (83% of the frame, x ≈ 54–954). The camera look target moves (Ring −2.6 → −3.2, Stack 0.6 → 0.45) so the card stays centred near y 1000. The label moves 12 px down to y 1298–1462. `CARD_PX` is 900×506, the radius is 28 px (DESIGN radii), and the play bar has a 32 px inset, 30 px up from the bottom.
- The backdrop runs at 0.42 gain, with a lighter blur (radius 0.07, mip 4.0) and saturation 1.3. The vignette now only starts at r 0.6 and only darkens the corners (at most 85%), so the middle of the frame is clip colour rather than ink.
- The backdrop is exposure-matched. Its mean level (sampled from the top mip) is pulled toward 0.21, clamped 0.85–1.8×. I measured plate means: p01 0.24, p06 0.21, p03 0.16 and p04 0.085. The dark v1 clips (a night mural, a car interior) were still navy mud at a fixed 0.42 gain, while v0 was already right.

**De-murked the off cards.** `dim` goes from 0.55 to 0.75, unfocused saturation to 0.65, `back` from 0.24 to 0.45, and the back-face navy mix from 0.45 to 0.15 (now over 0.7 saturation). Every card, front and back face, gets a 1 px rgba(255,255,255,.18) rim. The v1 deck slots are now `y = 1.25s + 0.055s²`, so each strip above the one in front shows 71–76 px of real image (measured by projection), up from about 50 px of sky.

**Rank chips removed.** The "#N" chips are gone from every card. On the playing card they repeated the 200 px numeral. On the back cards they were about 9 px at phone size, and a chip large enough to read (34 px or more) would have filled most of a 72 px peek strip. The sunset numeral is now the only rank on screen.

**v1 flip: from over-the-top to under-the-deck (a reversal, with the reason).** At the new card size and peek, no over-the-top path both avoids slicing the deck and stays below the title. I searched about 5,000 parameter sets with the same y/z segment-clearance test as round 2. A slice-free path needs about 7 world units of lift, which puts the card's top edge at about y 240 px, across the title.

That test also showed that round 2's path itself came within 0.01 units of the third card near the end of the flip. It was hidden behind the deck, but it was not the "≥ 1 unit" claimed.

The flip now runs like this:
1. The front card tips forward (top edge toward the camera) and drops into the label band, which is empty during the flip.
2. It turns over in the open, in front of a deck that has not moved yet. It goes edge-on at y ≈ 1350 px, 2.4 units in front of the next card.
3. The deck then advances (`advAt` 0.40), and the card slides back under the deck and rises into the back slot.

Measured: clearance is at least 1.5 world units at every frame, the top edge stays at or below y 455 px, and the lowest point is y ≈ 1595 px for about 0.1 s. Per the critique, the departing card stays at full brightness through the first 60% of the flip; its back face is lit the same way (`backLit`), so the turn reads as footage, not as a dark smear. `nextDur` is 0.60 with `power3.inOut`. In the r03 render you can follow drop → edge-on → back face → under at 3.65–3.90 s.

**Verified in the r03 render (hero 5.4 s).**
- The check passes: 12/12 contrast and 0 layout issues.
- The front card is 900 px wide in both heroes, and the frame is clip colour edge to edge.
- There is no see-through in the v0 entrance frames, and the first rank reads by 0.75 s.
- The v1 end frame keeps the cap and the back of the head.

## Polish round 4

The r03 critic scored Ring 7 and Stack flip 6. This round fixes the four listed defects and closes Stack flip's biggest gap (messy 70 px lips and a flip that folds into a sliver). It also takes three cheap listed fixes: the v0 backdrop grade, the ring edges, and the rank-block divider. These decisions stay: the Three.js ring and deck, pure f(t) state, live WebGL footage textures, the type system, the focusX push-in payoff, the v1 plate choices, and the timeline (apart from v1's `next`, moved by 0.011 s).

**Defect: hero card outside the safe zone (both).** FOV is now 28.0 (Ring) and 28.4 (Stack), up from 26.8 and 27.2. In the r04 hero the front card's widest (top) edge runs from x ≈ 77 to 932 (v0 ≈ 80–930), inside 72–936 and centred on x 504. `CARD_PX` is 864×486, so the 28 px radius and the play-bar inset still read the same on screen.

**Defect: rank numeral below the name's baseline (both).** The label is now bottom-aligned (`align-items: flex-end`, top 1266, height 175). The numeral box and the name's line box both put their baseline about 6 px above their bottoms, so the baselines now meet:
- The "4" ends at y 1435 and the name's baseline is at 1435 (measured in r04; it was 1461 vs 1434 in r03). The "5" goes 2 px lower, which is normal round-glyph overshoot.
- The numeral's top moves to 1297.
- The divider is 112 px tall and runs from the small-caps cap-top (1323) to the baseline (1435).

**Defect: v0 #5 cut under its label.** I measured the cuts in p01: the sign shot runs 0–2.27 s and the marina aerial follows. Round 1's "runs to 4.2 s" was wrong. No in-point gives p01 one shot for the whole label window (0.7–3.5 s), and the polisher shot would run past the 8 s plate end and freeze on a side card. So items[0] and items[3] swap:
- #5 is now "Palm shirt / The truck yard" (p05). Its single shot runs 0–5.03 s, so the label never sits over a cut.
- "Leonida Keys / The roadside sign" (p01) moves to #2, which plays only as a side card and never gets a label.

I checked every chosen window the same way. v1 #5 (p04, mural shot to 4.43 s) is clean. v0 #4 (p06) cuts once, from Lucia at the gate to the shelter, at 4.55 s while its label is up. Both shots are golden-hour Jason and Lucia, so the label stays true, and the 2.5 s shelter shot can't hold the 2.9 s window on its own. I left it as is.

**Defect + biggest gap: v1 flip and lips.**
- *Lips.* The slots are `y = 0.45s + 0.02s²`, so each back card shows a lip of about 24 px instead of 70 px; the first lip is about 30 px while the front card is pushed forward. Their brightness steps through `look.deck` (0.55, 0.40, 0.30, 0.22) at 60% saturation, so the deck reads as one object with one clip on top.
  - This reverses round 3's 72 px peek. That peek was there to show real image, but the critic named it as the main gap: four mismatched strips.
- *Flip.* This is the critic's top-edge flip, and it replaces round 3's under-the-deck path:
  - the card hinges on its top edge and rotates rotationX 0 to -180° with power3.inOut over 0.6 s, uncovering the next card from the bottom up;
  - while its face is toward the camera it draws over the deck. Once its back shows, it draws under the whole deck (no depth test or write);
  - so it is seen going over the deck's top edge, its back face (the right way up) arcing above the stack, then settling into the back slot at 0.22.
  - The hinge recedes to z -10.4 and scale 0.82 on separate eases. The incoming card moves up a slot with expo.out over 0.40 s, from scale 0.955 to 1.
  - Drawing it under the deck is what lets it go over the top without crossing the title. Round 3 found that a physically slice-free path needs about 7 units of lift. In the render the card's top peaks at y ≈ 490, and the one-line title ends at about 375.
- *No sliver.* A card with no thickness is invisible edge-on. Within about 4–12° of edge-on the flipping card's alpha fades to 0, and `next` is 3.561 so that moment lands on frame 116. The frames either side see it about 27° from edge-on.
  - Checked frame by frame (113–119): fold-up, nothing at 116, back face above the deck at 117, settled by 120.
- The entrance stagger went from 0.05 to 0.035 s per card and the tip-back from 0.55 to 0.35 rad, so the deck lands with fewer mixed tilts.

**v0 background (listed fix).** The backdrop is now:
- at saturate 0.8 instead of 1.3;
- under the critic's vertical ink grade, rgba(11,11,14) at .55 top, .25 at 45% and .75 bottom;
- exposure-matched from both sides (clamp 0.5–1.8 instead of 0.85–1.8), so a bright daylight clip is pulled down and doesn't turn beige;
- with the corner vignette reduced to 0.6, because the grade now does most of that work.

The title band reads as dark ink and the clip colour stays behind the cards. Both variants share the shader, so v1 gets the same grade; its dark field was already right.

**v0 ring edges (listed fix).**
- The radius is 11.2, about 7% smaller than 12. 12% would push the pentagon's half-side (R·tan 36°) below the card's half-width, and neighbouring cards would interpenetrate during the turn.
- Every unchosen ring card fades to transparent between x 124 and 16 on the left and between 940 and 1064 on the right. Nothing is cut by the frame edge or sits hard under the like/share column. The playing card is exempt.
- The depth pre-pass from round 3 now runs on every Ring frame, so a faded card shows the backdrop and never the card behind it.

**Not changed.** v1 #5 stays on the drive-by (p04). Its rear-view-mirror shadow is part of the POV shot, the critique raised it only as a side note, and changing the clip would mean a new #5.

**Verified in the r04 render (hero 5.4 s).**
- The check passes: 12/12 contrast and 0 layout issues.
- Front card x ≈ 77–932.
- The numeral's baseline matches the name's.
- The #5 label holds one shot.
- The flip shows no sliver frame.
- The v0 title band (y 0–230) at 5.4 s averages #3A3730, down from #6F634F in r03; v1's averages #0A0D0A.
- The ring dissolves at the frame edges.

## Polish round 5

The r04 critic scored Ring 7 and Stack flip 6. The shared gap was the ground: v0 sat on grey smog and v1's deck lips were too dark to read as five clips. This round fixes the one listed defect, closes Stack flip's gap and takes the cheap listed fixes for the v0 ground, the v0 far row and the content. These decisions stay: the Three.js ring and deck, pure f(t) state, live WebGL footage textures, the type system, the top-edge flip, the focusX push-in payoff, and the timeline (only v1's `enterDur` changed, 0.50 to 0.55).

**Defect: v1 ghosting at the flip (3.77–3.83 s) and the entrance (0.23–0.30 s).** No card is ever translucent over another card now.
- *Entrance.* The Stack variant no longer fades its cards in (`layer` is 1 for Stack). Each card rises from 40 units below, which is below the frame bottom at the start, on `power3.out`, back card first with a 0.035 s stagger. The tip-back went from 0.35 to 0.2 rad. At 0.2 rad a card's edges move at most 0.9 units in z, under half the 2.6-unit slot gap, so two cards with different tilts can never cut through each other. Ring keeps its one-layer fade, with the depth pre-pass that the r03 critic already passed.
- *Flip.* While the flipping card is clearly face-on (cosV > 0.21, more than ~12° from edge-on), it draws over the deck at alpha 1. Near edge-on and once its back shows, it draws under the whole deck. Only there may it fade (the anti-sliver fade from r04), so a fade can only reveal the backdrop.
- I checked the r04 frames. At frame 115 the card was already at alpha 1 (cosV ≈ 0.47). The "two steering wheels" came from #5 (p04) panning onto the driver and his wheel at 3.6–4.4 s, right above #4 (p03), which is also a driver at a wheel. The content swap below removes that look. The draw-order rule removes the possibility of real see-through.
- Verified in r05, frame by frame:
  - 0–15: the cards rise in opaque, with no clip showing through another;
  - 114–115: the chase face folds up over the deck, opaque;
  - 116: edge-on, nothing drawn;
  - 117–122: the back face arcs above the deck and settles.

**Stack flip gap: a visible deck (listed fix).**
- The slots are `y = 0.8s + 0.02s²` (were 0.45s), so the lips measure 40, 40, 41 px and 49 px for the first one while the front card is pushed forward. Measured on the r05 hero at x 300, the edges are at y 498 / 538 / 578 / 619 / 668.
- `look.deck` is [0.78, 0.62, 0.48, 0.36], up from [0.55, 0.40, 0.30, 0.22].
- The 1 px rgba(255,255,255,.18) rim now scales with `fwidth`, so it stays a full screen pixel on the smaller back cards. Each lip gets a visible top hairline; I kept .18 rather than the suggested .14 so all cards keep one rim.
- The Stack look target moves from y 0.45 to −1.25, so the whole deck reads 90 px higher. The front card is at y 667–1143 and the deck top at 498, which closes the dead band under the title (it ends at ~385).
- The Stack label moves up with the deck (`#root.v-stack .lab`, top 1176), so the numeral and name stay tied to the card. The baseline is now y ≈ 1345.
- The flip arc had to change for the taller, higher deck. With the r04 path the card would have peaked at y ≈ 386, across the title's bottom edge. The hinge now starts down earlier (`y0` 0.35 to 0.20) and the card shrinks earlier (`s0` 0.25 to 0.15). I modelled the path with the same projection used for the slot spacing: the top edge peaks at y ≈ 437, and edge-on still lands on frame 116 (cosV −0.01, against +0.47 and −0.46 on the frames either side).

**v0 ground (listed fix).** `look.backdrop` goes from 0.42 to 0.18. A radial ink field, the critic's `radial-gradient(120% 70% at 50% 48%, transparent 0%, #0B0B0E 78%)`, is laid over the existing vertical grade in the backdrop shader. The title band (y 0–230) at 5.4 s now averages #0D0C0F, against #393530 in r04, and y 390–640 averages #181818.
- This partly reverses round 3, which raised the gain to 0.42 so the frame would be "clip colour rather than ink". That was a fix for a 760 px card in murk. The card is now 864 px wide and carries the colour on its own. The critic names the grey field as the main gap, and Rockstar's own graphics put one lit hero on one clean ground.
- Both variants share the shader, so v1 gets the same field; its title band is #0A0A0C.

**v0 far row (listed fix).**
- `look.back` goes from 0.45 to 0.28.
- The Ring camera moves from (0, 19, 86) looking at y −3.2 to (0, 12, 87.5) looking at y −1.58. That lowers the elevation while the playing card stays where it was: y ≈ 765–1231, x ≈ 80–928, inside 72–936.
- The far row now shows 103–114 px above the playing card (top edge measured at y 662 at x 300 and modelled at y 651 at the centre, hero top 765; it was 545–760 in r04), and its backs are quieter, so the two far slabs no longer compete with the playing card. The mid-turn frames (3.5–3.95 s) still show the ring's depth.
- The gap between the title and the ring (y ≈ 385–650) is now clean ink. I left it rather than moving the ring and label, since the critic asked for a clean ground and not for a new layout.

**Content (listed fix).**
- v0 #5 is now "Leonida's finest / Florida Man energy", a name a creator would write, in place of the shot description "Palm shirt / The truck yard". It names no character, because FACTS.md does not map this clip to anyone.
- v1 #5 is now "The chase / Police on the tail" (p09). Its single shot runs 0–4.1 s, so it covers the whole label window. #3 becomes "The drive-by" (p04). The flip now goes from a daylight street chase to a car interior, so the land on #4 reads as a change.
- I measured p09's cuts with scene detection: chase 0–4.1 s, gym 4.1–6.73 s, then a console-accessory ad from 6.73 s. Round 1 had noted 7.5 s for that ad, which was wrong. Every card except `items[1]` has faded out by 6.42 s, so the ad never shows in either variant.

**Not changed: the full-frame handoff.** The critic offered two options for the soft end and the loop: stop the push-in at a 1080-wide card, or fade to #0B0B0E over 6.70–7.00 s. I did neither. The push into the clip is the component's deliberate handoff (round 1, refined with focusX in rounds 2 and 3): in an edit, the next shot is that clip at full frame. A dip to black or a card that stops short would break that cut. The 1.78x softness is what any 9:16 crop of a 1080p 16:9 source looks like. The hard cut on loop only happens in a looping gallery preview, not in a short.

**Verified in the r05 render (hero 5.4 s).**
- The check passes: 12/12 contrast and 0 layout issues.
- Both heroes sit on clean ink.
- The v1 lips measure 40 px and read as five clips.
- The v0 far row is ~110 px.
- Frames 0–15 and 111–122 of v1 show no card through another.
- The push-in endings are unchanged.

## Round 6 (lead fix, after polish round 5)
- **Defect (r05 critic):** in v0 the #4 "Jason & Lucia" card hard-cut from the Lucia-at-gate shot to the bus-stop shot at 4.55 s, 0.33 s after its label landed. p06 has cuts at source 2.4 s and 5.5 s.
- **Fix:** the `clipLucia` bank video and `items[1].from` now start at 3.36 with `data-playback-rate` 0.65. The cut now falls at 3.29 s, while #4 is still a side card and before the ring turns (next = 3.42). From the land (4.10) through the push-in (end 7.0, source 7.91) the card holds the single bus-stop shot that matches its label, and focusX 0.70 still frames it.
- **Verified:** frames at 4.2, 4.5, 4.6 and 5.0 s all show the same shot under the label.
