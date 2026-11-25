# Decisions: 16 Arrow pointer

## Round 1

**Reference read.**
- `arrow-callout/_sO4z_omuu0-1`: chunky red 3D arrow (2.4M views).
- `arrow-callout/W9oFRFaMo9U-70`: hand-drawn white block arrow.
- `stat-callout-arrow/xjJpat61z9o-20`: red 3D arrow plus heavy italic stat.

The format these prove is "one arrow, at the reveal, pointing at the thing, with 2–5 words". analysis-3 notes that the best-designed video uses exactly one arrow, only at the reveal. I kept that format and replaced the cheap parts (red 3D fills, outline strokes, clip-art arrows) with a drawn stroke and Leonida type and colour.

**Plate and timing.**
- p06 (Lucia at the gate) with `data-media-start="2.4"`, so the composition opens on Lucia. The plate cuts at 3.1 s to Jason and the rusty teal car.
- p07 was rejected: it cuts five times in 8 s, so nothing stays still long enough to point at.
- Composition is 5.5 s with two beats, one per shot. Each beat clears before the cut, and the last clears by 5.45 s so the clip loops.

**Tracking.** Every shot in the plates drifts: Lucia raises her head, and the camera pans with the car. A fixed arrow would end up pointing at nothing. Each beat therefore has a `track` of [t, x, y] keyframes, measured from frames, and the arrow tip or dot follows it with power2.inOut interpolation. A creator can use a single keyframe for a fixed spot.

**Variant 0, Curved arrow.**
- Arc: a 10 px white cubic, built from tail to tracked tip. The bow is perpendicular to the chord (`bend`), so the arc keeps its shape as the tip moves.
- Draw and land: the arc draws on in 0.46 s (power3.inOut). An open chevron head pops on landing (back.out). One thin ring pings at the tip.
- Exit: the arc retracts from the tail into the target.
- Caption: Inter 800, 92 px, -0.035em, with the DESIGN layered soft shadow. The one accent is the key word in the pink→amber sunset gradient (drop-shadow filter, because text-shadow breaks clipped gradient text).
- Content: "Look at her hair", then "Look at the rust". These are fan-voice observations of things that are visibly true in the plate.

**Variant 1, Pointer + dot.**
- Dot and leader: a sunset-gradient dot (the one accent) inside a 4 px white ring with a soft repeating pulse. A 4 px leader runs diagonally to a knee and then horizontally to the card, ending in a small nib.
- Card: smoke `rgba(14,14,20,.62)` with blur(20) and saturate(1.4), 28 px radius, inner 1 px highlight, and contact plus soft shadow. It holds tracked caps "PROTAGONIST" (Inter 600, 26 px, 0.32em) and a two-line name (Inter 800, 72 px).
- Content: Lucia Caminos and Jason Duval, real protagonists from FACTS.md.
- Between beats the dot glides (power3.inOut, 0.42 s) from Lucia's last spot to Jason. That shows the re-target motion, which is the point of this variant.

**Seek safety.** All drawing is a pure function of time, `draw(t)`. One paused GSAP timeline tweens a getter/setter proxy, the same pattern as the kit's `drive()`, so it renders on suppressed seeks too. No onUpdate, no randomness.

**Fixes made this round after looking at my own frames.**
1. The first hair target landed on Lucia's eye, so it read as "look at her eye". I moved the track about 160 px up onto the hair at her temple.
2. The v1 card was too small (60 px name, about 300 px wide) and read as a thumbnail. I raised the name to 72 px, the tag to 26 px and the radius to 28.
3. The v1 card briefly showed as an empty glass box during its reveal. The text now rises with the clip reveal instead of after it.
4. The "rust" caption's first letter sat on a yellow bollard. I moved the caption from x 96 to x 150 and bowed the arrow more, so it hooks down onto the fender.

**Known limits.** The tracks are hand-measured from frames, so the tip can sit ±20–30 px off the exact spot during fast pans. There is a 0.15 s empty gap at the 3.1 s cut between beats in v0, which is deliberate so the arrow never straddles a cut.

## Round 2

The round-1 critic scored v0 7 and v1 6. Both variants won their blind picks. Every listed defect is fixed, and so is the biggest gap for each variant.

**Defects fixed.**
1. *Tips and dots under the platform's top tabs.* Both Lucia tracks were re-measured with a template tracker (OpenCV on the plate, every 0.1 s, locked to her eye at a fixed offset). The v0 tip now sits on the loose strands beside her temple, at y 282–334. The v1 dot sits at her temple, at y 283–340. `trackAt()` also clamps every tip and dot into `CONFIG.safe`, whose top is now 236, so a badly keyed track can't go out of bounds again.
2. *v1's lone dot gliding across the cut.* The glide is gone. Each beat now owns its own dot, leader and card. Beat 1's dot shrinks to nothing over the last 0.18 s (2.87–3.05), the hard cut lands at 3.07, and beat 2's dot pops fresh on its target at 3.2 (back.out(1.5)).
3. *v1 pointing at a sleeve sliver at the frame edge.* Beat 2 now points at the car, which stays in frame for the whole shot. The card reads "LOOK AT / The rust", so the variant now does the detail-pointer job the manifest describes. Beat 1 stays a "PROTAGONIST / Lucia Caminos" tag; that is deliberate, to show the same pointer can answer "who" as well as "what". The dot is tracked on the rusted lip of the front wheel arch (wheel hub + (12, −108)). The tracker followed the hub at a match score of 0.99–1.0 the whole way, so the dot moves with the car's 280 px drift.

**Biggest gap, v1 (drift from the job).** Cards are now fixed in place, and the leader auto-routes to them. Every beat's card has a CONFIG spot `card: {x, y, edge}`. The leader is a 35° diagonal from the dot, then a straight run into the named card edge:
- `left`/`right`: the card sits beside the dot.
- `bottom`: the card sits above the dot, and the leader becomes a vertical stem.

Why fixed: a card that rides a moving subject either slides text around the frame or, as in round 1, hits the safe-zone clamp and ends up pointing at an edge. A fixed card stays readable while the dot tracks and the leader flexes. The beat-2 card sits above the car over the dark tree line (x 230–640, bottom at about y 915), and its stem drops onto the arch.

**Card scale (critic's numbers).** The name went from 72 to 84 px. The tag went from 26 to 30 px, with tracking reduced from 0.32em to 0.26em. Padding went from 26/34/30/34 to 30/40/34/40. The Lucia card is now about 430 px wide (40% of the frame), and the tag renders at about 10 px on a 360-wide phone, up from 9.

**Biggest gap, v0 (safe zone and arrowhead polish).**
- The head went from 40 to 54 px with a 36° half-angle, and the stroke stays at 10.
- The landing ping ring is removed. The head now grows to 1.15 as the line lands, then settles to 1 in 2 frames.
- The rust arrow uses the critic's tail [250,1262] and bend −0.28. It is now one confident 280–380 px arc rising off the caption and landing on the arch lip, replacing the 250 px hook. Its target is tracked on the car the same way as v1's.
- Exits now take 0.37 s: both beats clear over [out − 0.37, out], so the final exit runs 5.08 to 5.45.

**Other fixes found while checking my own frames.**
- v0 left a round-cap dot at the arrow's tail during the retract. The cause was a zero-length leading dash in `stroke-dasharray`. The arc now uses one dash plus a negative `stroke-dashoffset`, and it hides below 0.5 px.
- On the first pass, the v0 hair tip landed on the end of her eyebrow, so it read as "look at her eye". The v0 track is shifted 26 px out and 6 px up, onto the hair. v1 keeps the temple point, because its card needs the horizontal room for the leader.
- Track interpolation changed from per-segment power2.inOut, which stopped and started at every key, to a time-aware cubic Hermite spline. Dense tracker keys now give smooth motion.

**Kept from round 1 (deliberate):**
- p06 from 2.4 s;
- two beats, one per shot, each cleared before the hard cut (now measured at 3.067–3.1 s);
- the v0 caption type and sunset accent;
- the smoked-glass card material;
- the seek-safe `draw(t)` proxy pattern.

**Known limits.**
- The v0 rust caption's first letters cross the yellow bollard from about 4.8 s. It stays legible thanks to the layered shadow.
- At about 3.0 s the frame is empty for roughly 0.1 s, because beat 1 has cleared before the cut.

## Round 3

The round-2 critic scored v0 8 and v1 7. Both variants won their blind picks. The biggest gap was the aim: the tip and dot sat on Lucia's temple and brow, so "her hair" read as "her eyes". There was one defect.

**Defect fixed: `bg: "none"` no longer follows the sample plate.**
- Every beat now has a `still: [x, y]` spot. With `bg: "none"`, `trackOf()` collapses the beat's track to one static key, `[[b.in, ...still]]`, or to the track's middle key if `still` is missing.
- The transparent export's tip and dot therefore never drift over the creator's own clip.
- I verified this with a v1 transparent webm: the dot sits at (440, 430) at both 1.0 s and 2.8 s, and the alpha is intact.

**Biggest gap (aim), both variants.**
- The Lucia track is re-aimed onto the wet strands beside her cheek, at ear level: eye + about (115, 80), down from eye + (95, −48).
- I checked it with cyan markers drawn on plate frames from 0.25 to 2.8 s. The hero tip at 2.0 s is (418, 410), where the critic asked for about (415, 405).
- Both variants now share one track, so the arrow tip and the dot land on the same strands. Tracks live in `CONFIG.tracks` (`hair`, `arch`), and a beat names one with `track: "hair"`. A beat can still carry its own array.
- Beat 1 now starts at 0.25 s, so the track was extended back to 0.25 s while her head is still rising (the eye y goes 668 → 352). I used the pure-python template tracker on the eye and nose, checked the markers frame by frame, and hand-set the 0.25 and 0.30 keys where the tracker hit its search edge.

**v1 card moved below the dot (a layout change forced by the new aim, not a taste reversal).**
- With the dot on the strands, its x reaches 492 at about 1.4 s. The right-side card can't sit further right than x 510, because the safe zone ends at 936 and the card is 426 px wide.
- At 1.4 s the ring would touch the card edge, and the leader would shrink to about 5 px.
- The card now sits below the dot at (320, 700), over her shoulder and the pole. A new `edge: "top"` gives a pure vertical stem from the ring straight down into the card's top edge.
- This mirrors the rust beat, where the card sits above with its stem dropping onto the arch. Both beats now speak the same "dot, stem, card" language, and no elbow lands at an arbitrary height.
- The card wipes open top-down from the stem (`inset(0 0 x% 0)`) and settles down 18 px.

**v1 leader detail (critic's numbers).**
- Leader stroke is now 5 (`variants["1"].leader`), up from 4.
- Nib r is now 7, up from 6.
- Side cards no longer use `drop`, which was the arbitrary y≈383 meeting point. The run now always lands on a fixed card line: `card.anchor` is `"tag"` (the PROTAGONIST centre line, the default), `"center"`, or a px offset from the card top.

**v1 rust copy.** The tag is now "DETAIL" and the name is "Rusted arch", replacing the "LOOK AT / The rust" sentence split. The name is 92 px through the new per-beat `nameSize`. The card is about 590 px wide (55% of the frame, up from 31%) and sits at (110, 650) over the tree line, left of Jason. Its stem drops onto the arch lip. I checked the plate frame: the arch lip and lower body do show rust.

**v0 arrow weight.**
- The line is now a filled, tapered outline: 8 px at the tail to 12 px at the tip, with round caps. It is built from the cubic by arc length in `taper()` and is a pure function of time.
- While drawing, the growing end is a fine point. On exit, the retract eats the thin end first.
- The head is now 64 px arms, up from 54, at 12 px weight, matching the tip. The 36° chevron angle and the 1.15 → 1 landing are kept.

**Timing.** Beat 1 now starts at 0.25 s instead of 0.55 s, so the loop opens with words already rising, not on 16 empty frames. Everything else keeps its timing: arrow draw 0.41–0.87 s, beat 1 cleared by 3.05 s, hard cut at 3.07 s, beat 2 3.2–5.45 s.

**Kept (deliberate):**
- the p06 plate from 2.4 s;
- one beat per shot, cleared before the cut;
- the v0 caption type and sunset word;
- the smoked-glass card;
- the fixed-card / flexing-leader model;
- the seek-safe `draw(t)` proxy.

**Known limits.**
- From 0.25 to 0.4 s, Lucia's head is motion-blurred while it rises. The keys there are within about 20–30 px. Only the v1 dot is visible then; the arrow tip doesn't arrive until 0.87 s.
- The v1 card covers the right edge of her neck. Her face stays clear.

## Polish round 4

The round-3 critic scored v0 8 and v1 7. Both variants won their blind picks. The biggest gap was choreography. This round fixes all four listed defects and two cheap fixes from the list. It is a polish pass, not a redesign: same plate, same two beats per variant, same copy, type and arrow.

**Defect 1 fixed: the v0 caption landed before its arrow.**
- The arrow now starts the beat. It draws at `in` in 0.30 s (power3.out), replacing the old in+0.16 start over 0.46 s with power3.inOut.
- The chevron grows from in+0.17, when the line is about 92% drawn, and settles by in+0.32.
- The caption words rise from in+0.15 (0.28 s, expo.out, 0.055 s stagger).
- On exit the caption lifts out first, over 0.24 s from `out − exit`. The arc then retracts into the tip, ending at `out`.
- Pointer first in, last out: the label is never on screen without its arrow. Checked frame by frame in r04 (0.30–0.75 s and 2.68–3.10 s): the arc is drawing two frames before the first word appears.

**Defect 2 fixed: the v1 leader entered the card at an arbitrary x.**
- Top/bottom cards now ride the dot sideways, so the vertical stem always lands on the type's column. The CONFIG is `card: {y, edge, column}`.
  - Beat 1, `column: "left"`: the stem sits on the PROTAGONIST/Lucia left edge. That is card padding 40 plus a 4 px optical bearing, measured on the P and the L.
  - Beat 2, `column: "right"`: the card sits left of the dot with right-aligned text, and the stem rises into the DETAIL/Rusted/arch right edge (padding 40 + 3).
  - The tag's trailing 0.26em tracking is cancelled with a negative margin, so the last letter of "DETAIL" sits on the column too.
- Beat 2's name is now two lines, "Rusted / arch", still at 92 px. The one-line card was about 590 px wide. Riding a car that drifts 280 px, it could not keep any column over the dot without leaving the safe zone or covering Jason. As two lines it is about 380 px wide and rides from about x 105 to x 290. The copy is unchanged; this layout change is forced by the defect.
- This amends round 2's "fixed card" decision only for top/bottom cards. The card's y stays fixed, so the type never bobs vertically. It only slides sideways with the subject, like a pinned tag. Side cards (`edge: "left"/"right"`) stay fixed and keep their 35° diagonal into `anchor`.
- If the safe zone ever stops the card, the stem leans onto the column as the card opens, never while it is hidden. In the demo it is never stopped.
- I checked 1:1 crops at 0.75 s and 3.8 s: the stem lands on the P/L and on the L/d/h.

**Defect 3 fixed: the v1 exit left ghosted type.**
- New exit order:
  1. The card fades as one layer over 0.20 s (power2.in from `out − exit`) and lifts 8 px, replacing the old 0.03 scale.
  2. Its type fades over 0.15 s inside that, so the text is never more opaque than its glass.
  3. The stem retracts into the dot over 0.10 s.
  4. The dot shrinks to nothing over the last 0.08 s.
- The stem's end follows the card's settle and exit offset, so it never pokes into a moving card edge.
- I checked r04 at 2.20–2.56 s and 4.66–4.90 s: the type goes before the glass, with no bare text over the fence or the sky.

**Defect 4 fixed: the v0 rust caption hit the bollard and downpipe.**
- `label.follow: 0.35`: the caption and the arrow's tail drift with 35% of the arch track's x motion, about 97 px over the beat.
- Measured on the plate, the bollard's right edge reaches x 176 at the old 5.2 s (new 4.7 s). The "L" is now at about 235, so it keeps 60–80 px of clearance through the whole pan.
- The arrow keeps its shape, because tail and caption move together.
- With `bg: "none"` the track is static, so there is no drift.

**Cheap fixes also taken.**
- *Plate dissolve under the first entrance.* `data-media-start` moved from 2.4 to 2.9, and all track keys and beat times shifted by −0.5 s exactly, so no re-measuring was needed.
  - Measured frame by frame, the plate's own dissolve ends at source 3.3 s (comp 0.4). Beat 1 starts at 0.35, when the incoming shot is about 90% in, and its first visible stroke is the arc near the caption, not over her face.
  - The hair track now starts at the first clean key (467, 420). The two keys tracked through the dissolve were dropped.
  - Duration is 5.0 s, because the plate ends at source 8.0. Beat 1 runs 0.35–2.55, the hard cut is at 2.567, and beat 2 runs 2.7–4.95.
  - This keeps round 3's "open on motion, not empty frames" intent instead of starting beat 1 at 0.80, and it still opens on Lucia, the reason for the original 2.4.
  - Hero time is now 1.5 s, the same moment as the old 2.0 s.
- *Smoke density.* The card smoke went from `rgba(14,14,20,.62)` to `.76` over footage, and to `.82` with `bg: "none"`, where backdrop-blur has nothing to blur. This deliberately departs from the kit's .62 token, for legibility over bright sky. The beat-2 card is now over palms and sky, and it reads as dark glass, not muddy grey.

**Kept (deliberate):** p06; one beat per shot, cleared before the cut; the v0 caption type, sunset word and tapered arrow; the dot/stem/card language; the 28 px glass card; the shared `hair` and `arch` tracks; the seek-safe `draw(t)` proxy.

**Verified:**
- r04 renders at 5.0 s and `hyperframes check` passes.
- A v1 transparent webm keeps alpha, and its card and stem hold still at 1.0 s and 2.0 s.

**Known limits.**
- The v1 Lucia card now slides sideways with her head, about ±45 px around its mean between 0.5 and 2.0 s. That is the cost of a stem that always lands on the type.
- 0–0.35 s shows the tail of the plate's dissolve with no graphics (about 10 frames).
