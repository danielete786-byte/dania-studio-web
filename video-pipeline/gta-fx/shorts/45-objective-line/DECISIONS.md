# Decisions: 45 · Mission objective

## Round 1

### Structure: the in-game objective box, scaled for a phone
- **Reference:** `research/gta6/refs/hud-mission-objective-money-minimap/VrX0-5DdK-s-1.png` and analysis-2 row "Mission objective card": dark translucent box top-left, gold condensed caps mission name, white condensed objective line behind a hollow diamond bullet, fades in.
- **Variant 0** keeps that exact anatomy and position (top-left, x 72, y 296) but at phone scale: the card spans ~80% of the width, the objective line is 70 px. Material follows DESIGN.md: smoked glass `rgba(12–14,…,.54–.74)` with `blur(20px) saturate(1.4)`, a 1 px inner top highlight, a faint hairline and the contact + soft card shadow, radius 20.
- **Variant 1** is the mission *start* beat: a centred title card. It sits in the lower-middle (stack y ~950–1260) because that is where GTA puts mission titles, and on the p03 plate it keeps Jason's face (upper third) clear. It carries the same objective row under the title, so the two variants read as one kit: title card first, then the HUD objective.

### Type
- Objective line: Barlow Condensed 600 in sentence case. The reference objective is a condensed grotesque in sentence case, and condensed is also what lets "Go to the Vice City Marina." fit on one line at a phone-legible size (Inter would wrap). This is a deliberate exception to "Barlow in caps".
- Mission name (v0): Barlow Condensed 700 caps, tracked .14em, white at 74%. The reference makes it gold; here it stays neutral so the keyword is the only accent.
- Distance readout (v0): JetBrains Mono 28 px, tabular.
- Mission label (v1): Inter 600 caps tracked .42em, the Rockstar "PRESENTS" wide-tracked style from `official-type/`.
- Mission title (v1): Barlow Condensed 800 caps, 124 px auto-fit to 792 px (lands ~112 px), soft layered type shadow; no Pricedown.
- Sizes per frame: v0 30/28 + 70; v1 28 / ~112 / 52.

### Colour: one accent per frame
- The keyword ("Vice City Marina") is the only colour: the Leonida sunset core `#F84FA4 → #FE8E4E → #FEB747`. It is GTA's "coloured destination word" convention in the GTA 6 palette. Everything else is white or white-alpha.
- v1 adds a soft radial scrim behind the stack in plate mode only, so white type holds over the bright truck-window part of p03.

### Motion (one thing leads at a time)
- v0: 0.25 card wipes open from its left edge (clip-path, expo-out, slight x) → 0.41 mission name → 0.49 diamond draws → 0.55 the objective line wipes in left to right → 1.03 the sunset sweeps through the keyword (hard-edged gradient sweep, white → colour). The line reads by ~1.0 s.
- The distance readout ticks 1.4 → 0.3 mi through the hold (seek-safe `KitMotion.drive`), so the HUD has a real live state instead of a static box.
- v1: label fades in with a slight scale settle, title letters rise from a baseline mask centre-out (expo-out, 22 ms stagger), hairline draws from the centre, then the objective row wipes in and its keyword sweeps. A 2% push on the stack through the hold.
- Exit at 6.3: v0 card folds back to its left edge; v1 stack lifts and fades; scrim clears. Empty by 6.7, loops at 7.0.
- No letter-spacing tweens (HyperFrames lint: they snap to device pixels); entrances use opacity/transform/clip-path only.

### Content
- "Go to the Vice City Marina." is the manifest's own example. "Road to Vice City" and "Mission 01" are fan-made demo labels using a real place from FACTS.md, not an official mission name; the creator replaces them in CONFIG.

### Plates
- v0 on p05 truck yard (bright sky behind the card shows off the glass; the man by the truck fits "go meet" objectives). v1 on p03 Jason at the door.
- `bg: "none"` hides the plates and the scrim; the card glass and the title shadows still render over true transparency (checked: v1 rendered to VP9 webm with alpha, composited over a green matte at 2.4 s).

### Fixes inside round 1
- First check failed on `gsap_non_transform_motion` (letter-spacing tweens on the label and mission name). Replaced with opacity + x / scale settles.
- Objective line raised from 64 to 70 px so the card reaches ~80% of the width (craft rule 2).
- The card exit was an abrupt power3.in snap; now a 0.4 s power2.inOut fold with an overlapping fade.

## Round 2

Critic (r01): v0 7/10, v1 6/10. Biggest gap: v1 was a stock label/title/rule/subtitle stack on the subject's torso, with a late payoff; v0 read a little like a phone notification. One defect: a 3-frame card sliver with half-cut glyphs on the v0 exit.

### Defect fixed
- **v0 exit:** the clip-path fold is gone. The card now fades 1 → 0 and slides 24 px left over 0.30 s (power2.in) at T.out, with no clip-path on exit, so no glyph is ever cut. Checked frame by frame from 6.25 to 6.7 s: clean, and empty by 6.6 s.

### v0 Objective line: from web card to HUD panel
- **Material:** `backdrop-filter: blur(20px) saturate(1.0)` (was 1.4, which pulled the blue sky and truck into a navy tint). The fill is now a neutral, near-flat smoke `rgba(13–14,13–14,15–16,.58–.70)` with no blue bias. Shadow is the inset highlights plus `0 1px 2px rgba(0,0,0,.25), 0 12px 32px -12px rgba(0,0,0,.45)`, instead of the 80 px float shadow. The panel sits on the screen like the reference's flat frosted slab.
- **One type family:** the distance readout moves from JetBrains Mono to Barlow Condensed 600 30 px, caps, tracked .06em, tabular figures ("1.3 MI"). The whole panel is now Barlow Condensed, like the in-game HUD.
- **Header rank:** the mission name goes from 74% to 92% white. It stays white rather than the reference's gold so the keyword remains the only accent (round-1 decision, kept).
- **Kept (deliberate):** radius 20 (DESIGN.md radii 20/28/36), top-left position, the diamond and line choreography, the ticking distance.

### v1 Mission title: a Rockstar lockup in the upper third
- **Placement:** `#stack` top 950 → 380, so label, title and objective sit at y 380–645, the DESIGN.md hook/title zone. On p03 this clears the door-section torso. The scrim ellipse is recentred to y 516.
- **No divider:** `#rule` is deleted. Rockstar's lockups ("LISTEN CLOSER / WITH INTEGRATED SPEAKER", "PLAY / HAS NO LIMITS") use type and spacing only. The objective's margin goes from 30 to 40 px to carry the gap.
- **GTA VI signature:** the "MISSION 01" label now uses DESIGN.md's Rockstar date style, from the trailers' "NOVEMBER 19, 2026 / PRE-ORDER NOW" and "COMING 2025" cards (`refs/official-type/`). It is white Inter 600 caps tracked .36em, with a magenta `#EE08F2` offset on the right and a faint bloom. At 30 px a 2 px offset turned the whole word pink (seen in the first r02 render), so it is 1 px: white with a magenta fringe, not a second colour block.
- **Faster payoff:** the diamond draws at T.in+0.72, the objective wipes in at T.in+0.80 (was 0.98), and the keyword sweep starts at T.in+1.05 (was 1.42) over 0.45 s. The accent lands at ~1.3 s and is complete by ~1.75 s (was ~2.2 s), so the card reads complete inside the first second and a half.
- **Scrim kept with `bg: "none"`:** the scrim tweens now run in both modes, so the transparent export carries a soft alpha vignette under the type. Checked: rendered VP9 webm with alpha, composited over a pale-blue matte at 2.0 s. The label and objective hold, and the vignette fades to full transparency at its edges.

### Known trade-off (unresolved)
- p03 cuts at ~3.6 s to the in-car profile, where Jason's face fills x 580–1080 from y 215 to 970. Any centred upper-third title crosses his sunglasses for the last ~2.7 s of the hold. The scrim keeps the type legible there. I checked p05, p01, p04, p06 and p07 with the stack bounds drawn in. Each has a face, a raised hand, busy mural colour or the real "MARINA" sign in that band, and p03 is the cleanest across the clip (clear from 0.25 to 1.8 s and 2.5 to 3.6 s). Hero time 1.8 s sits in that clean window.

### Hero time
- 1.8 s: both cards complete, the v1 sweep just finished, and the v0 distance is ticking (1.3 MI).

## Round 3

Critic (r02): v0 7/10, v1 7/10, and both won the blind pick. Biggest gap: both variants peaked at the keyword sweep (~1.5 s) and then held for 4–5 s with no second beat. v0's dark 20 px card also read like an app notification rather than Rockstar's square-cornered, warm-frosted objective box. One defect: a pre-sweep tint leak on the keyword.

### Defect fixed: keyword tint leak (both variants)
- Cause: the white→amber edge of the 200%-wide gradient (47%→53%) sat partly inside the visible half at `background-position: 100%`, so the "V" showed an amber fringe before the sweep.
- Fix: the gradient is now 220% wide (`.kw` `background-size: 220% 100%`). Its stops are `#F84FA4 0%, #FE8E4E 22%, #FEB747 45%, #fff 54.5%, #fff 100%`. At position 100% only the pure-white tail shows (54.5–100%), and at 0% only the sunset shows (0–45.5%), so the soft edge lives entirely between the two end states.
- I didn't use the critic's exact stops (`#FEB747 42%, #fff 50%` at 200%) because, at the end of the sweep, they would have faded the last ~16% of "Marina" back to white.
- Checked frame by frame from 0.4 to 1.9 s (v0) and 0.5 to 1.7 s (v1): the keyword is pure white until the sweep, then a clean pink→amber.
- Found while checking: the new v0 text-shadow was inherited by the keyword. With `background-clip: text`, Chrome paints the text-shadow over the fill, which greyed the white start state and dulled the sunset. `#card .kw` now sets `text-shadow: none` and uses a filter drop-shadow instead, as v1 already did.

### v0 Objective line: closer to the real objective box, plus an arrival beat
- **Panel (ref VrX0):** radius 20 → 8 px. Padding 30/46/36/40 → 24/36/28/32. The smoke is warmer and lighter: `rgba(32,27,29,.60) → rgba(30,26,28,.52)` with `blur(24px) saturate(1.2)`. The objective has a faint `0 1px 2px` shadow so it holds on the lighter frost. This reverses round 2's "keep radius 20 (DESIGN radii)" because the critic named it as the off-reference gap; DESIGN also says the HUD kit follows Rockstar's real HUD. The panel is now 774 px wide (72% of the frame).
- **Second beat: arrival.** The distance now counts 1.4 → 0.0 MI at a steady pace from 1.45 s and hits zero at `timing.arrive` (5.05 s). It rounds toward the start, so "0.0" first shows exactly at arrival. At arrival:
  - the hollow diamond fills white (0.15 s, power2.out) with a small settle (scale 1 → 1.22 → 1);
  - the distance dims to 40%.

  The hold now ends on "arrived" instead of a number frozen at 0.3. I used 5.05 s rather than the critic's 5.4 because the p05 plate cuts to the contact at 5.03 s, so the arrival lands on the cut. It still holds 1.25 s before the exit.
- **Kept:** the white mission label (one accent per frame), the top-left position, the entrance choreography and the slide-out exit.

### v1 Mission title: one accent, faster title, stronger objective, and a handoff beat
- **One accent:** the magenta fringe and bloom on "MISSION 01" are gone. It is now `rgba(255,255,255,.88)` Inter 600 tracked .36em with only `0 2px 10px rgba(0,0,0,.45)`, Rockstar's "PRESENTS" style. This reverses round 2's date-style choice because the critic named a concrete defect: at phone size it read lilac and competed with the keyword.
- **Title readable sooner:** the stagger is `{ each: 0.014, from: "start" }` with duration 0.45 (was 0.022 centre-out, 0.55). The title reads left to right and is whole by ~0.75 s.
- **Objective legibility:** 52 → 60 px, with the diamond 26 → 28 px. The scrim ellipse is 780×400 at y 540 (was 660×340 at 516), with centre alpha .68 (was .58) and mid alpha .40. At 3.0 s "Marina." now holds over the bright interior window.
- **Second beat: title → objective handoff (the game's own order).**
  - At `timing.handoff` (3.62 s) the title lifts 16 px and fades out (0.3 s, power2.in).
  - From 3.82 s the objective row glides up under the label and grows to fit the safe width (0.6 s, power3.inOut; scale = min(1.4, 792 / row width), so 60 → ~84 px).
  - The lockup resolves into "MISSION 01 / ◇ Go to the Vice City Marina.", the same anatomy as the v0 objective box. This makes round 1's "title card first, then the HUD objective" literal.
  - It also lands on the p03 cut to the in-car shot (3.93 s), and after the cut there is less type over Jason's face than the 112 px title gave.
  - Handoff geometry is measured once after fonts load and before any transforms, so it stays deterministic. `handoff: null` keeps the full lockup.
- **Sizes per frame:** before the handoff 30 / ~112 / 60; after it 30 / ~84.

### Hero time
- 1.9 s: the v0 panel is complete and ticking (1.3 MI), and the v1 lockup is complete with the sweep just landed. The second beats are in the strips: v0 arrival at 5.05 s, v1 handoff at 3.6–4.4 s.

## Polish round 4

Critic (r03): v0 7/10, v1 6/10. Both won the blind pick on finish. Biggest gap: v1 was a generic centred white-caps title over a dark radial blob, with its only accent on the smallest line, and neither variant's payoff landed (v0's arrival just dimmed the distance to grey). One defect: an invented mission name.

### Defect fixed: no invented mission name
- "MISSION 01 / ROAD TO VICE CITY" is gone from both variants. The demo content now uses only places in `research/gta6/FACTS.md`:
  - v0: label "Leonida" over "Go to the Vice City Marina." (the manifest's own example).
  - v1: label "Leonida", title "Vice City", then the same objective.
- The creator still replaces all of it in CONFIG.

### v1 Mission title (scored 6): the title carries the accent, then hands it to the keyword
- **Accent on the title.** Each glyph of "VICE CITY" is filled with its own slice of one title-wide sunset gradient, using the keyword's stops at 2.2× the title width with a per-glyph background offset.
  - The sweep runs at 0.8–1.2 s (`KitMotion.drive`, seek-safe).
  - The title's shadow moved from `text-shadow` to a `filter: drop-shadow` on `#title`, for the same reason as the keyword in round 3: a text-shadow paints over a clipped fill.
  - The objective's keyword stays plain white during the card phase, so there is one accent per frame.
- **Handoff payoff.** From `handoff - 0.3` (3.4 s) the title drains back to white (reverse sweep, 0.3 s), then it lifts and fades (3.7–4.0 s).
- **No empty frame.** The objective starts rising at 3.75 s, while the title is still fading, so no frame is empty. Checked at 3.8, 3.9, 4.0 and 4.1 s.
- **Diamond and keyword.** The diamond draws at 3.95 s, and the keyword sweep plays at 4.05–4.55 s as the payoff.
- **Tighter lockup, like Rockstar's "FEEL THE TENSION" card.** `#title` margin-top 22 → 8 px; objective margin-top 40 → 24 px.
- **Title size.** The title's base size goes from 124 to 150 px. At 124 the shorter fact-safe title would be ~443 px wide, narrower than its own 560 px sub-line, which inverts the lockup. At 150 it is ~553 px, matching the objective line under it. It still auto-fits to 792 px.
- **Optically centred line.** In the card phase the diamond is absolutely positioned off the text's left edge and stays undrawn, so the line centres on its text alone; it no longer sits ~23 px right of centre.
- **Handoff geometry.**
  - The row moves right by half the diamond's lead (scaled), so diamond and line end up centred together.
  - It grows to at most `handoffMaxPx` (72 px).
  - The end state spans x ≈ 174–900: the period ends at ~900 px, inside the 936 px limit (it was ~938).
- **Lighter vignette.** The scrim's centre alpha goes from .68 to .45 (mid alpha .40 → .26, ellipse 760×380 at y 520), so `bg: "none"` no longer leaves a dark blob on daylight clips. Checked:
  - over the bright window at 3.0 s on p03, the objective still holds;
  - a VP9 alpha webm composited over a pale-blue matte at 1.9 and 4.7 s shows a soft shade, not a blob.

### v0 Objective line (scored 7): arrival as a payoff
- The count now lands on "0.0 MI" at 4.75 s and holds for 0.3 s. At `timing.arrive` (5.05 s), the readout ducks out and comes back as "ARRIVED" at 100% white (0.28 s, expo-out, from y 8). It no longer dims to 40%. `arrived: ""` keeps the number.
- The diamond fill now pops: scale 1 → 1.3 (0.08 s) → 1 (0.16 s, back.out(1.5)), with the fill in 0.12 s.
- **Hairline sheen.** One sheen runs on the card's inset hairline. `#sheen` is a brighter copy of the hairline (top .35, ring .24, over the base .16/.08), and it pulses 0 → 1 → 0 over 0.3 s from arrive + 0.04.
- Checked frame by frame from 4.7 to 5.6 s.
- `#dist`: 30 px at .72 → 32 px at .90.

### Both: one mission-label style
- v0's `#mission` and v1's `#label` now share `.mlabel`: Inter 600 caps, 30 px, tracked .36em, white .90. This is DESIGN.md's style for wide "official" labels (Rockstar's "PRESENTS" / "COMING 2025" cards).
- I chose this direction rather than moving v1 to Barlow, because the wide-tracked label is the lockup's one Rockstar signature, and Rockstar's real HUD is "tiny, thin, sparse, with lots of air".
- This narrows round 2's "whole panel in Barlow Condensed": the HUD numerals and the objective stay Barlow. The critic named the cross-variant mismatch as reading like "two different products".

### Kept (deliberate)
- v0: the top-left square-cornered frosted panel, the entrance, the slide-out exit, and 5.05 s arrival on the plate cut.
- v1: the upper-third position, the title → objective handoff order, and the 2% push.
- Hero time stays 1.9 s: both cards are complete, v1's title sunset has landed, and v0 is ticking at 1.3 MI.
