# DECISIONS: 12 · Location card

## v2 concept
- **The one idea.** The place name arrives the way Rockstar would set it, and then locks onto the world.
  - **v0 Official wide caps:** a trailer title. "VICE CITY" in white wide caps resolves over a Vice City montage. On the cut to the skyline the tracking locks, the frame flashes, and an RGB split decays into Rockstar's #EE08F2 magenta edge and bloom.
  - **v1 Pin pill:** a map pin is dropped into the footage. Its needle plants on a tracked point of a held aerial shot, and the "Leonida Keys" label unfurls from the pin head and rides the shot.
- **Shots and cuts.**
  - **v0** cuts on the graphic's beats. `s011` highway (0–1.45) → `s135` skydive over the skyline (1.45–3.05, the hit) → `s100` biplane over the beach (3.05–4.8) → `s026` sunset pier (4.8–6.0, the exit). Each shot gets its own slow push.
  - **v1** holds one shot. `s075` marina aerial, pre-slowed to 0.29× with ffmpeg `minterpolate` mci (no ghosting on this slow aerial drift), plays for 6 s with a 4% push. The pin is tracked to the roof with ffmpeg `find_rect`.
- **Where the type sits.**
  - **v0:** in the sky band, y 318–620, above the skyline in every shot. A plum-black top scrim (1180 px) gives white type room on bright daylight skies. No card.
  - **v1:** the label floats over the trees and houses above the "N'S MARINA" sign. The needle drops between the "S" and the "M" to the boat-barn roof, so the frame reads as a label standing in the world, not a sticker.
- **Hero size and face.**
  - **v0:** Archivo wide 800 caps, auto-fit to 760 px (88% of the safe width), about 117 px, locked tracking .05em. The labels are Archivo wide 26 px tracked .42em, and the coordinates JetBrains Mono 26 px. That is 2 sizes and 2 families.
  - **v1:** Inter Display 800, about 97 px, -0.04em, with JetBrains Mono 26 px coordinates. The pill is about 770 × 176 px, 89% of the safe width.
- **The payoff.**
  - **v0 at 1.45 s, on the cut to the skyline:** flash .5, shake and 1.045 punch, an 18 px chroma split on the title that decays into the 4 px magenta offset and bloom, a 1.06 → 1 lockup punch, and the region–rule–coordinates foot completing on the hit.
  - **v1 at 0.42 s, when the pin plants:** flash .34, shake, a ground-plane shockwave ring, a squash on the label and a 14 px chroma split. The pill unfurls 60 ms later.

## v2 round 3 (craft-v2 redesign; r01–r02 were the rejected v1 look)
### What was kept from v1
- The job: name, region and small coordinates for a new area of Leonida.
- Real FACTS places (Vice City, Leonida Keys). The coordinates are the real-world analogues: Miami for Vice City, the Florida Keys for Leonida Keys.
- The coordinate roll that locks like a GPS fix, with a locked-width coordinates column so the roll never reflows.
- The clip-path unfurl of the pill from the pin head, with the radius equal to half the height.
- The r02 lessons:
  - only the title carries the hard magenta offset; the 26 px lines stay pure white with a soft shadow;
  - the copy no longer repeats "Leonida" (v0 is VICE CITY / LEONIDA; v1's name already contains it);
  - the disc is the pink→amber core at 160°, not the 5-stop Instagram-like sweep;
  - the ring pulse stays on the ground, away from the type;
  - the pill is ≥ 80% of the safe width.

### What was thrown away
- Soft `assets/plates` footage, replaced by `assets/shots` 4K footage with the Look kit (grain .15, vignette .5).
- v0's three small Inter lines, replaced by a title-scale wide-caps lockup with a justified foot.
- v1's small bottom-left sticker, replaced by a world-anchored map label with a needle, a contact point, ground rings and tracking.

### Key decisions
- **v0 hit on a cut.** The tracking drive runs from .12em to .05em all the way to cut 1, so the word visibly locks on the hit. The magenta offset doesn't exist before the hit: the chroma split decays into it, which ties the RGB-split language to Rockstar's date-card edge.
- **v0 foot enters on the hit, not before.** In the first capture, the "LEONIDA" line sat on top of the green "SW 9th Ave" highway sign in `s011`. Moving the foot to the hit keeps it off that sign and makes the lockup complete on the payoff.
- **v0 font measurement.** `document.fonts.ready` resolved before Archivo had been requested, so the auto-fit measured the fallback face and the title rendered about 920 px wide, outside the safe zone. The script now calls `document.fonts.load()` for every measured face before measuring.
- **v1 tracking.**
  - `find_rect` ran on a 160×120 template of the "MA" of the marina sign over the pre-slowed clip. The track was sampled every 0.2 s, smoothed with 5 taps, and stored in CONFIG as `layout.track`.
  - The anchor offset (-8, +182) puts the tip on the roof, and it scales with the shot's ~9% zoom (`trackZoom`).
  - The world layer sits inside `#push`, so the push and the impact shake move the pin with the footage.
  - On `bg:"none"` the pin stays at the first track point.
- **v1 drop.** The pin starts just above the frame, so the drop reads for about 6 frames: needle first, then the head, with vertical motion blur. On the exit the pin pulls out past the needle length, so no needle is left hanging at the top.
- **v1 grade.** The marina sits in shade, so `#v1a` gets contrast 1.12, saturate 1.14 and brightness 1.03 to keep it from reading muddy.
- **Seek safety.**
  - Ground rings, the hit shockwave and v0's lockup punch and drift are pure functions of time (`Look.drive`).
  - The label squash is two tweens (1 → squash → 1), so frames before the landing never show a from-state.
  - The pin is opacity 0 until the drop.

### Self-check (frames pulled at 0.5, 1.5, 1.6, 3.4, 5.0, 5.6, 5.85 and the v1 entrance at frames 4–15)
- `hyperframes check` passes: 0 errors, 45/45 contrast, 0 layout issues. The 2 warnings are structural sub-composition suggestions.
- **v0:** hero ink spans x ≈ 160–920 and the kicker and foot are inside it. No face is covered: the skydiver and the pier couple sit below y 640. At 2.0 s the coordinates have settled to 25.76° N / 80.19° W. The exit dissolves through blur by 5.9 s, and the scrim lifts by 6.0.
- **v1:** the pill stays within x ≈ 144–914 and y ≥ 235 throughout the track drift. The tip stays on the roof between "'S" and "M" from 0.42 to 5.6 s. The coordinates lock by 1.44 s. The exit masks the name out, rolls the pill into the head and pulls the pin out by 5.8 s.
- **Hero time: 2.0 s for both variants.**
  - v0: the title is locked with the magenta edge over the skyline.
  - v1: the label is fully open, planted, with the coordinates settled.

### Unresolved / for the critic
- v1 is a single held shot by design: a planted, tracked callout needs one steady shot. The rhythm comes from the drop, the hit, the ring pings and the push.
- The v0 scrim makes the daylight skies dusky. That is deliberate: Rockstar's date card sits over a dusk city.

---

# v1 history (r01–r02, rejected by the owner as "basic, not professional")
## Round 1 (initial build)

### Variant 0, Official wide caps
- **Reference:** Rockstar's own date-card type (`refs/official-type/`, analysis-3 "Date text"). It uses white geometric caps tracked wide (~0.35em), a ~2 px `#EE08F2` magenta offset on the right and a soft bloom. analysis-3 notes that "nobody uses Rockstar's own type language", so this is the premium gap.
- **Type:** Inter 700 caps with 0.24em tracking (slightly tighter than 0.35em so a 12-letter name still reads big on a phone). The magenta offset is 3 px at 1080 wide. The title auto-fits to an 800 px box (64–104 px), and `padding-left` equal to the tracking keeps it optically centred. The eyebrow is Inter 600 at 28 px, tracked 0.42em, like "ROCKSTAR GAMES PRESENTS". The meta row has the region in Inter 600 tracked caps and the coordinates in JetBrains Mono, both 28 px. That makes 2 type sizes.
- **Accent:** the only gradient in the frame is the 300 px pink→amber rule. The magenta offset is part of the official title treatment, not a second accent.
- **Placement:** centred in the hook zone (y 276–500). On the Keys plate it sits in the sky above the "Welcome to The Keys" sign, which is the hero moment at 1.6 s.
- **Legibility:** the top of the plate is bright sky and white boat hull, so a soft top scrim (plum-black, 70%→0 over 980 px) sits behind the type. The type also carries the DESIGN.md layered soft shadow. No hard strokes.
- **Motion:**
  - The eyebrow's tracking contracts from 0.62 to 0.42em.
  - The title resolves letter by letter from the centre out, from blur 14 px to sharp (Rockstar's "date fades in through a bloom"), while its tracking settles from 0.40 to 0.24em.
  - The rule draws from the centre, then the meta row rises and the coordinates roll into place like a GPS lock.
  - A slow 3% push runs through the hold. The exit reverses the tracking outward with a blur.

### Variant 1, Pin pill
- **Reference:** the in-game location pill in `refs/location-pill/W9oFRFaMo9U-18`: a dark #35303C pill at ~85%, r≈8, a 1 px light border, bottom-left. Ours keeps the format but makes it premium:
  - smoked glass with `rgba(30,27,38,.78)`, 20 px backdrop blur, a 1 px inner highlight and a hairline ring;
  - a full pill radius;
  - a sharp contact shadow plus a large soft shadow.
- **Structure:** a map-app place chip. A 108 px sunset pin disc (the one accent) holds a white pin glyph. Next to it are the name (Inter 800, 56 px, -0.025em) and the region (Inter 600, 26 px, tracked caps, 62% white). A hairline divider separates the two-line mono coordinates (26 px). The pill is at least 792 px wide (73% of the frame), with the coordinates right-aligned at the end.
- **Placement:** bottom-left in the caption band, x 72–864 and y 1256–1400, which is where the reference puts it and clear of the right-side buttons.
- **Motion:**
  - The pin pops in (back.out), the glyph drops in and the disc does a 2-frame squash on landing.
  - The pill then unrolls from the disc through a clip-path inset.
  - The name and region rise out of line masks, the divider draws and the coordinates roll.
  - A sonar ring pulses every 1.6 s through the hold.
  - On exit, the pill rolls back into the pin and lifts away.
- **Content:** Vice City, Leonida, from FACTS.md. The coordinates are those of the real place it is modelled on (Miami). The Keys coordinates are the Florida Keys. The coordinates are flavour that the creator edits.

### Craft checks this round
- **Hero time:** 1.6 s (both cards fully resolved; variant 0 over the Keys sign).
- **Coordinate roll:** shortened to 0.55 s with a small amplitude, so it has settled by the hero frame. In an early pass, the hero frame showed a value that had not finished rolling.
- **Title width:** the title box was tightened from 820 to 800 so the glyphs stay inside x ≈ 160–920.
- **Meta row:** its tracking was cut from 0.30 to 0.24em so it reads as secondary to the title.
- **Lockup position and scrim:** the lockup moved up 24 px and the scrim was deepened mid-way. Before that, the meta row sat on the sign's "WELCOME TO" lettering at the hero frame.
- **Pin disc:** its pink outer glow was removed (it smeared into the pill edge) and replaced with a neutral contact shadow.

## Round 2 (fixes from the round-1 critique)

### Defect fixed: v1 read time
- Round 1 left the disc alone on screen from 0.25 s to 0.75 s, and "Vice City" only read at about 0.93 s, which broke DESIGN's 0.6 s rule.
- Now the pin, glyph and pill arrive together:
  - the disc pops, and the glyph fades in with it at T.in (a short 14 px settle instead of a 46 px drop);
  - the pill unrolls at T.in+0.08 (0.32 s, expo.out);
  - the name mask-rises at +0.20, the region at +0.28, the divider at +0.30 and the coords at +0.34.
- The name reads by about 0.5 s, roughly 0.3 s after the first pixel.
- The landing squash was cut because the pill is already opening by then.

### v0, Official wide caps: one signature, Rockstar's date card
- **One tracking, one weight, one face:** the eyebrow, title and meta line are all Inter 600 caps at .34em, with padding-left .34em for optical centring. This follows Rockstar's "NOVEMBER 19, 2026 / PRE-ORDER NOW" card (`refs/official-type/rz1B4B2yBZY-82.5`), where both lines share one tracking and one weight. Round 1 used .42/.24/.24em and a 700 title.
- **One accent:** the pink→amber sunset rule is deleted, so the magenta offset is the only colour. As on Rockstar's card, every line carries it:
  - the title uses `3px 0 0 #EE08F2, 0 0 18px rgba(238,8,242,.35), 0 6px 24px rgba(0,0,0,.45)` (3 layers, down from 4);
  - the two 28 px lines use the same idea scaled down (2 px offset).
- **Meta line:** it is now a single typeface. The coords are Inter 600 with tabular nums at the same .34em tracking, instead of JetBrains Mono on the same baseline. The line auto-fits to a 780 px box (24–28 px), so its glyphs stay inside x ~155–930. The separator is a single-spaced middle dot.
- **Title:** it auto-fits to an 830 px box at the final tracking (glyphs ~160–925). Wider tracking makes "LEONIDA KEYS" land at ~72 px, which is still inside the 64–110 title range. The entrance tracking now settles .42→.34em; round 1 used .40→.24em. The start is capped at .42 so the blurred first frames stay near the safe zone.
- **Timing:** the title starts resolving at T.in+0.08 (it was +0.18) and reads by ~0.55 s. The meta and coordinate roll start at +0.42.
- **bg:none scrim:** it is capped at peak .45 and 620 px tall (`layout.scrimOverlay`), so a transparent render no longer darkens half of the creator's clip. Plate renders keep 980 px at .70, because the Keys plate's bright sky and boat hulls need it.

### v1, Pin pill: hugs its content, readable on a phone, Leonida colour
- **Hug:** `pillMinWidth` is now 0, so the pill fits its content. The ~150 px of empty plum between the name and the divider is gone. The demo pill spans x 72–788, and the divider sits 40 px after the name.
- **Phone legibility:**
  - the name is 68 px / 800, up from 56 px, which also puts it inside DESIGN's title range;
  - the region is 28 px at .74 white, up from 26 px at .62;
  - the coords are 28 px mono, up from 26 px.
  - That leaves 2 type sizes in the frame.
- **Identity:** the generic pink→amber dot is replaced by the full Leonida sweep (`#365ECE → #A341C0 → #F84FA4 → #FE8E4E → #FEB747`), run top to bottom like the colour field of the GTA VI logo. It is used on the disc only, without copying the logo. The sonar ring now uses the sweep's pink. It remains the frame's one accent.
- **Kept on purpose (no defect named):** the smoked-glass material, the bottom-left caption-band placement, the locked coords column, the sonar pulse and the roll-back exit.

### Hero time
1.6 s for both. v0 sits over the Keys sign, fully resolved, with the coords settled at 1.22 s. v1 is fully open, with the coords settled at 1.09 s.
