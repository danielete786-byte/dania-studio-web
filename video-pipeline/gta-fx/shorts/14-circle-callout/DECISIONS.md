# Decisions: #14 Circle callout

## v2 concept (craft-v2 redesign, round 5)
- **The one idea:** the callout is drawn *on the footage with light*, not pasted over it. The mark locks onto a real, motion-tracked detail, its closing is the beat (a warm exposure bloom on the detail, a punch-in that pivots on the detail, RGB split on the mark), and the label is title type set in the shot's own dark area, wired to the mark by a fine leader. No pill, no card.
- **Shots (one held shot each, pushed, cut-free because a callout has to stay on its detail):** v0 holds `s008` (Jason driving, profile) pre-slowed 0.94x with motion-compensated interpolation into `assets/clips/s008-jason-driving-slow.mp4` (5.1 s), with a 1.00→1.06 push pivoting on his lens. v1 holds `s004` (palm-print shirt by the pickup, 5.03 s) with a 1.00→1.05 push pivoting on the sleeve. Both payoffs land on the mark's close/lock at about 0.6 s, because there is no cut to land on.
- **Where the type sits and why:** v0's label sits low-left (y 1128–1440), under a scrim weighted to the lower left: the car roof above is black but only 330 px wide beside his face, so the leader uses it instead (it leaves the ring at 9 o'clock, runs left through the black roof and drops down the left edge). His face and the lens stay clear. v1's label sits top-left over the pickup's dark windshield (x 72–712, y 262–515), the one calm dark area in a bright daylight frame, with a soft pool of shadow behind it; the man's head stays right of x 800 and his raised hand is below the lockup once the label is on.
- **Hero size and face:** v0 Inter display 800, tight (−0.045em), fitted so "reflections" spans 740 px (about 159 px, 86% of the safe width), with a 24 px Archivo wide kicker (ratio 6:1). v1 Archivo wide 800 caps at the 110 px floor (PHYSICS about 620 px, x 76–700, 72% of the safe width; it can't grow because his face sits just right of it from about 1.0 to 1.6 s), PHYSICS in the sunset fill with a sheen, kicker 24 px (ratio 4.6:1).
- **Payoff:** v0 at 0.64 s, the ring closing on Jason's lens: warm exposure bloom centred on the lens, a specular glint sweeping across the lens inside the ring, a 1.035 punch and 7 px shake pivoting on the lens, a 9 px RGB split on the ring and 7 px on the type rising in. v1 at 0.60 s, the corners locking on the sleeve: the same warm bloom on the sleeve, the corners flaring white-hot, a 1.03 punch and 6 px shake, RGB split on the corners, then a slight focus dim outside the box and the sheen across PHYSICS at about 1.75 s.

## v2 round 5 (rebuild from scratch)

**What v1 was and why it went.** r01–r04 put a ring or brackets on the soft 1080p `p05` plate and hung the label in a smoked-glass pill (v0) or a white rounded card (v1). Critics gave 7–8, but the owner called the library "basic, not professional or clean": a small UI object floating on ungraded footage. Both label containers are now banned generic cards, so they are gone. **Kept from v1:** the job, the motion tracking (re-done on the new shots), the fixed label with a re-aiming leader, a 5.0 s loopable length, and the r2–r4 lessons: no frame ever shows a half-built or empty label (the type now rises out of masks, with no container at all), and the leader must never line up with a bracket arm (it now leaves from a pin on the middle of the box's top edge, between the arms).

**Casting.** I contact-sheeted every long shot (`s016`, `s004`, `s008`, `s014`, `s119`, `s007`, `s055`, `s011`, `s012`, `s039`, `s123`) and checked the 4K master framing:
- `s008` is the brief's own example made literal: Jason's mirrored lens visibly reflects the street going by. The camera rides with the car, so the lens drifts only about ±55 px. It is 4.83 s, so I pre-slowed it 0.94x with motion-compensated interpolation (`minterpolate mi_mode=mci`) to 5.1 s. Checked frames at 1.0, 2.5 and 4.0 s: no warping on his profile.
- `s004` keeps v1's verified "Cloth physics" truth (the sleeve folds and swings as he gestures), now from the 4K grade. It has a dark pickup windshield top-left for the label.
- Rejected: `s011` (the camera tilts through the whole shot, no held detail), `s012` (the plate travels through the rep and leaves no room for the label), `s016` (the readable bilingual sign is outside the vertical crop), `s055`/`s039` (each contains a cut).

**Tracking.** A small Node SSD template tracker on half-res grey frames (fixed reference template + previous-frame template, ±12–16 px search, 9-frame smoothing, sampled every 0.1 s). I verified both tracks with boxes drawn on 6–8 frames before building. After the first render the lens sat about 16 px right of the ring's centre at every time I checked (0.8–4.2 s), so the v0 target moved from x 478 to 494 and the radius from 128 to 122 to hug the lens.

**Seek-safety.** The marks, leader, lens lift, glint, payoff bloom, focus dim and the push are one pure function of t, driven by a single `Look.drive` proxy. The type uses Look's seekable tweens. The push and `Look.impact`'s punch both pivot on the detail (`transform-origin` = target), and the marks live inside `#shake` with the footage, so the ring never slides off the lens during the hit. The label sits outside `#shake` and stays still.

**Things I tried in this round and changed:**
- **Full-frame flash → light on the detail.** Look.impact's screen flash at 0.34 turned the dark car interior into a flat grey wash at 0.66 s. The flash is now 0 and the hit is a warm radial exposure bloom centred on the detail (screen blend, 0.42 s decay), plus the lens glint (v0) or the corner flare (v1).
- **v1 rack focus → focus dim.** A 2.4–5 px backdrop blur outside the brackets read as soft footage in the stills (an auto-fail), and the 4K detail on the shirt was lost. Now `defocus.blur` is 0 and only a 10% dim remains (the blur is still available in CONFIG for very sharp clips).
- **Scrims made local.** The first v0 scrim darkened the bottom 60% of the frame, and the first v1 scrim greyed the whole sky. v0's is now weighted under the type at the lower left, so his lit shoulder keeps its light. v1's is a soft pool behind the lockup, so the sky and his face stay in daylight.
- **v1 leader pin moved** from under the "P" (x 98, where it touched the raised hand at 2.2 s) to under "PHYSICS" (x 372), so the leader is short, clear of the hand, and never lines up with an arm.
- `s008` lifted slightly (brightness 1.1, contrast 1.06) because the face is in shadow; grain 0.15 → 0.12 so the 4K texture survives the encoder.

**Self-review of the capture** (frames pulled at 0.15–0.95, 1.1, 2.2, 3.6, 4.3–4.94 s for each variant):
- Entrance: the pen head draws the ring from frame 3. The bloom, glint and RGB split land on the ring's close at 0.64 s. The leader runs, and "Real-time / reflections" rises by word, readable by about 1.2 s. In v1 the corners fly in with motion blur and lock at 0.6 s (flare, bloom, punch, split). CLOTH and PHYSICS rise by character from 0.8 s, and the sheen crosses PHYSICS at about 1.75 s.
- The raised hand in v1 is above y 515 only around 0.5–0.75 s, before the label exists (checked at 0.80, 0.87, 0.93 and 1.0 s). His head stays right of x 800 from 0.5 s on.
- Fit: v0 hero about 159 px (widest line 740 px, x 72–812), block y 1128–1440. v1 hero 110 px (PHYSICS x 76–about 700 after tracking went from .01em to 0), block y 262–515. At 1.4 s the last S ends about 25 px short of his cheek: close, but it never covers the face, and by 1.8 s he has moved right. All inside x 72–936 and y 230–1480. No orphans. Inter and Archivo render (no fallback).
- Exit: the type drops back up into its masks from 4.3 s, the kicker blurs out, the leader retracts, the ring un-draws and the brackets open out with blur. Clean footage from about 4.92 s.
- `bg: "none"` checked by snapshot at 0.64 and 2.2 s: transparent, the mark holds at `target`, no grain, vignette, bloom, lens lift or dim. The scrim stays as part of the graphic.

**Unresolved / watch:** `s008` is a low-key shot (black car roof, face in shade), so v0 is moody rather than bright. That's on purpose: the glowing ring and white type carry it. From about 3.5 s Jason turns slightly and the reflection in the lens narrows to a sliver; the ring stays on the lens.

---

# v1 history (rounds 1–4, superseded by the v2 rebuild above)

# DECISIONS: 32 · Cinematic bars

## Round 1 (initial build)

### Variant 0, Letterbox + time
- **Reference:** Rockstar's own type language (`refs/official-type/`, analysis-3 "Date text") for the stamp. Trailer letterboxing (official-type `rz1B4B2yBZY-78.5`) for the bars. The bars are pure black with no hairline, the way film letterbox is.
- **Geometry:** each bar is 420 px, which leaves a 1080×1080 window. Trailer ratios like 2.39:1 would leave a 450 px sliver on a 9:16 phone, so the frame closes to a square instead. The numbers also line up with the safe zones:
  - the top bar runs from y 0 to 420, so the stamp can sit at y ≈ 270–380, inside the 230 line;
  - the bottom bar (y 1500–1920) covers exactly the platform caption/handle zone, so nothing is lost under the UI.
- **Stamp:**
  - The place line is Inter 600 caps at 48 px with .28em tracking. It has a 2 px `#EE08F2` magenta offset and a soft bloom (Rockstar's date style). `padding-left` equal to the tracking keeps it optically centred, and it auto-fits to 790 px (it spans x ≈ 190–900).
  - The time line is JetBrains Mono 500 at 30 px, 74% white.
  - That makes 2 type sizes and no gradient accent: the magenta offset is the only colour, so the frame stays restrained.
- **Content:** "Vice City, Leonida" (FACTS.md). "11:47 PM · Nov 19" is an in-world time on launch day (Nov 19, 2026). The creator replaces it.
- **Motion:**
  - The bars close like a film gate: 0.5 s, `power4.inOut`, from 0.15 s.
  - The place resolves through a bloom: blur 12→0 while the tracking settles .58→.28em, 0.6 s `expo.out`.
  - The time types in at 42 ms per character.
  - On exit, the stamp blooms out, then the bars open with `power3.in`. Everything is clear by 6.91 s.
- **Plate:** p04 drive-by mural. At the hero frame (2.0 s), a Vice City police car and an officer pass the mural inside the window.

### Variant 1, CCTV stamp
- **Reference:** Trailer 2's CCTV shot (`refs/timestamp-overlay/QdBZY2fkU-0-47.9`): white mono caps "FRONT DOOR / 09:58:47", top-left, two lines. Also the bodycam stamp (`refs/bodycam-hud-overlay/u1eoe7fM5cM-49`): mono date/time and ID, a vignette and a soft image. analysis-3 lists the CCTV stamp among the cleanest believable diegetic overlays.
- **Layout:** the trailer's two-line stamp is kept, scaled up for a phone (JetBrains Mono 700 at 50 px). Around it:
  - REC and the camera ID at top-right, and the date and place at the bottom corners, all at 30 px, 80% white;
  - thin 3 px viewfinder corners (60 px arms) exactly on the safe-zone rectangle, so the whole HUD spans the frame (hero-object scale) while staying sparse, like Rockstar's own HUD.
- **Accent:** the only colour is the REC light, in police red `#FF3B3B`. That fits the palette rule, because CCTV is a police/surveillance state. Everything else is white.
- **Look:** the overlay itself carries a radial vignette, 2 px scanlines at 10% every 6 px and a faint roll bar drifting down every 3.4 s, so it works on `bg: "none"`. In plate mode, the plate wrapper is also graded (saturate .42, contrast 1.14, brightness 1.06). The plate itself is not scaled or cropped.
- **Motion:**
  - The cut-in is a hard camera cut: a 2-frame white flash, then the fx and grade snap on.
  - The HUD powers on with one interference flicker, and the corners lock in from 104.5% scale.
  - During the hold, the clock ticks every second, REC blinks at 1 Hz (phased so it is lit at the cut and at the hero frame) and the roll bar drifts.
  - On exit, the HUD flickers off with a softer flash and the grade reverts at 6.55 s, so the loop starts on clean footage.
  - All live updates run through `KitMotion.drive`, so every frame is seek-safe and deterministic.
- **Content:** "Front Door" nods to the trailer stamp. The date is launch day, THU 11-19-2026 (Nov 19, 2026 is a Thursday), and the place is Vice City. The creator edits all of it.
- **Plate:** p08 scuffle. It opens on the scuffle, and the hero frame (2.0 s) is the foggy night street with a pickup, which reads as real surveillance footage.

### Craft checks this round
- **Hero time:** 2.0 s.
- **Place line:** after the first capture, it was enlarged from 42 to 48 px (fit width 780→790), because it read small at strip scale.
- **REC blink:** the phase was shifted, because the dot was in its "off" state at the hero frame.
- **Checks:** `hyperframes check` passes with 0 errors and 0 warnings, and 42/42 text contrast checks pass.

## Round 2 (fix round, from the r01 blind critique: v0 7/10, v1 6/10)

### Defects fixed
- **v1 bottom labels illegible over bright footage ("VICE CITY" at 6.3 s):** the bottom row is no longer part of the default stamp (see biggest gap below). When `chrome: true` brings it back, it is `#fff` at 34 px with a stronger shadow (`0 0 2px rgba(0,0,0,.85), 0 2px 10px rgba(0,0,0,.65)`).
- **v1 corner frame off-centre (72 px left, 144 px right):** the brackets are now behind `chrome` (off by default). When on, they are symmetric: `#ccCorners` runs from x 72 to 1008 (width 936). The text's right edge stays at 902.
- **v1 42% white flash at the cut-in (t 0.28–0.40 s):** the peak is now .12, so it reads as an exposure blip when the feed switches on, not a grey-out. The exit blip drops from .28 to .06.
- **v1 grade snapping back in 2 frames:** the plate keeps playing on the way out, so the grade and the fx layer now ease back over 0.25 s (`power2.inOut`) from 6.55 s. Everything is clear by 6.8 s.
- **v0 stamp not readable until about 1.6 s:**
  - The place now starts at `T.in + 0.22` (0.37 s): 0.38 s `expo.out`, blur 8→0 px, tracking .46→.28em. It blooms in while the bar is still travelling.
  - The time types on at 16 ms per character (about 2 characters a frame), starting 0.12 s after the place.
  - The full stamp is legible by 0.75 s (checked on `v0-entrance.jpg`). The typed reveal stays, because it was a deliberate round-1 choice. Only its speed was the defect.

### Biggest gap
**v1 now reads as Rockstar's CCTV OSD, not the CapCut camcorder template.**
- The default is the trailer's `FRONT DOOR / 09:58:47` treatment and nothing else: one two-line block in the top-left (x 94, y 254).
  - Type: JetBrains Mono 600 at 56 px, .04em tracking.
  - Softened like an OSD: `filter: blur(.5px)` and the bloom shadow `0 0 3px rgba(255,255,255,.55), 0 0 14px rgba(255,255,255,.18), 0 2px 6px rgba(0,0,0,.6)`.
  - There are no brackets, no REC dot and no corner labels. A fixed CCTV camera has no viewfinder.
- **Removed:** the REC light, camera ID, bottom date/place and viewfinder corners. They are behind `CONFIG.variants["1"].chrome` (default `false`) for creators who want the camcorder look.
- **Lens:**
  - The vignette is now a barrel falloff: clear to 60% of the farthest-corner ellipse, .24 at 80% and .55 at the corners, so the frame reads as a fixed lens.
  - A soft radial lens shade (max .34 black, 600×330 px ellipse) sits under the OSD corner. It keeps the stamp readable over the bright Ocean Drive section of p08 at 6.0–6.5 s, which was checked at 6.3 s. It has no edge, so it reads as lens falloff, not a chip.
- **Kept from round 1 (deliberate, not named as defects):** the ticking clock, the power-on flicker, scanlines, the roll bar, the CCTV grade values and p08.

**v0 gives the stamp presence inside the 420 px bar.**
- `.lb-place` targets 56 px with a slightly stronger bloom. `.lb-time` is 34 px at 86% white (it was 30 px at 74%).
- The two-line block is centred in the band y 240 → (barHeight − 20), so about y 265–375 for a 420 bar.
- `placeMaxWidth` is 792, not the 864 the critic suggested. The line is centred on the frame, so 864 would push its right edge to x 972, past the 936 safe line. With 792, "VICE CITY, LEONIDA" auto-fits to about 54 px and spans x ≈ 162–925.
- The bottom bar stays empty on purpose: it covers the platform caption/handle zone (round-1 decision).

### Checks this round
- **Hero time:** 2.0 s for both variants.
- **`hyperframes check`:** 0 errors and 0 warnings; 42/42 contrast checks pass.
- **v0:** the strip and entrance were checked; the stamp is fully legible by 0.75 s.
- **v1:** the stamp was checked at 6.3 s over the bright plate (legible), on the 0.2–1.0 s entrance (no wash) and on the 6.4–7.0 s exit (the grade eases).

## Round 3 (fix round, from the r02 blind critique: v0 7/10, v1 7/10)

### Defects fixed
- **Stamps contradicted the footage** (v0 "11:47 PM" over p04's daylight razor-wire shot; v1 "FRONT DOOR 23:47" over p08's selfie close-up and sunlit Ocean Drive).
  - Both variants now sit on **one shot only**: p04's dusk mural/police stop (source 0–4.43 s). That shot is 4.43 s long, so the plate plays at `data-playback-rate="0.88"` and the composition is now **5.0 s** (inside the 5–8 s spec). Source time reaches 4.40 s at the last frame, so the razor-wire cut never appears. Checked on both strips.
  - Why 5 s at 0.88x, not 7 s: no plate has a single shot longer than ~5 s, and stretching 4.4 s over 7 s needs 0.63x, which reads as slow motion. 0.88x is not noticeable.
  - v0 time is now `5:24 PM · Nov 19` (critic's suggestion; Nov 19 sunset in Miami is about 5:30 PM, which matches the dusk mural).
  - v1 clock is now `17:24:08`, matching the same light.
- **v1 camera name.** The critic suggested p04 as a "near-static" shot. In the 9:16 frame it is an in-car POV: steering wheel, the driver's hand, the A-pillar and wing mirror. A "FRONT DOOR" label over that would just be a new contradiction, so the camera name is now `DASH CAM`. That keeps Rockstar's two-line OSD format (name / clock) and follows the bodycam reference (`refs/bodycam-hud-overlay`, "BODY 3 …"). It is a CONFIG field, so a creator sets "Front Door", "Rear Lot" and so on for a fixed-camera clip.

### Biggest gap: v1 OSD now looks burned in, like Rockstar's 09:58:47 stamp
- `#ccTL` blur .5 → .9 px. A red/cyan chroma bleed (`-1.5px 0 rgba(255,60,90,.35), 1.5px 0 rgba(60,200,255,.35)`) sits under the existing white bloom. Leading 1.1 → 1.0.
- In plate mode the footage now softens to a low-res lens: `blur(1px)` plus `scale(1.04)` on the plate wrapper, applied with the grade at the cut. The vignette is a touch stronger (clear to 58%, .6 at the corners), so it reads as a barrel lens. This is `CONFIG.variants["1"].lens` (`null` keeps the plate sharp). Grade, blur and scale all ease back together over 0.25 s on the cut-away.
- Kept from earlier rounds (deliberate, not named as defects): the top-left two-line OSD at 56 px, the clock tick, power-on flicker, scanlines, roll bar, lens shade and the grade values.

### v0 polish (named fixes)
- **Title glow:** the hard `2px` magenta offset is now `1px 0 0 rgba(238,8,242,.55), 0 0 18px rgba(238,8,242,.38)`: crisp white with a soft magenta bloom, like Rockstar's date card.
- **Type scale:** the place line is 64 px (the title floor) at .20em tracking. "VICE CITY, LEONIDA" spans about x 165–920, inside the safe zone. The bloom-in settles tracking .34 → .20em, and the exit goes .20 → .32em.
- **Second line** is in the card's own family, like "PRE-ORDER NOW": Inter 600 30 px, .34em tracking, `#E6E1EE`. It replaces the grey JetBrains Mono line. The fast type-on stays (round-1 decision).
- **Bars start at 0.05 s** (they were visibly still until ~0.32 s). The ease changed from `power4.inOut` to `power3.out` 0.5 s, because the slow in-ramp was the cause of the late start. The bars now move from the first frames and settle like a gate. The stamp reads fully by ~0.65 s (checked on `v0-entrance.jpg`).

### Timing (5 s loop)
- v0: bars 0.05–0.55; stamp out at 4.25; bars open 4.49–4.91.
- v1: cut to camera at 0.15; camera cuts away at 4.68; grade and fx are clear by 4.93. This leaves ~0.07 s of plain footage at the end, not 0.55 s. The loop seam is 0.22 s of clean footage across the wrap. (The critic's "T.out 6.55" was for the 7 s p08 version; the same intent is applied to the 5 s timeline.)
- Timing now lives per variant (`in` / `out`), with `timing.end` global.

### Checks this round
- Hero 2.0 s for both: the officer at the mural, a police car on the right, a figure lunging.
- `hyperframes check`: 0 errors, 40/40 contrast checks pass. The lint warning (`nested_structure_needs_subcomposition` on `#ov`) is the same one as in earlier rounds, from the template structure.
- Both renders are 5.000 s. The strips show only the mural shot. v1 entrance (0–0.5 s) and exit (4.55–5.0 s) were checked frame by frame: clean cut-in blip, HUD flicker, eased grade-back.
