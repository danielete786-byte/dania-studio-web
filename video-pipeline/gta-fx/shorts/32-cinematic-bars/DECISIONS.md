# DECISIONS: 32 · Cinematic bars

## v2 concept (craft-v2 redesign, round 4)
- **The one idea:** the bars are the edit. A vertical clip plays full-bleed, the gate closes, and on the beat the picture **opens up to a real widescreen shot inside the band** (an `-h` 4K shot, cut in on the hit). The type lives in the black, where it has room and never touches a face. v0 is a film gate: slow, warm and lit. v1 is a security monitor: it snaps shut, runs a 4:3 feed and switches cameras on the beat.
- **Shots and cuts.** v0 is all golden hour, so the time is true to the light: `s036-v` (0–0.9, the bars close over it), then the **hit at 0.9** into `s026-h` (pier, the establishing shot), `s108-h` at 2.4, `s105-h` at 3.7, and `s047-v` full-bleed at 4.4 as the bars open. v1 is all daylight: `s004-v` (0–0.5), then the snap to the feed `s004-h` REAR LOT at 0.5, `s016-h` COUNTER at 1.7, the **hit at 2.9** into `s096-h` STREET (the police car), `s004-h` REAR LOT at 4.1, and `s004-v` full-bleed at 4.9. Every shot plays at 1.0x, and every in-point and length is inside the shot.
- **Where the type sits.** It goes in the letterbox black. v0's 16:9 band (y 656–1264) leaves 426 px of safe black above the picture and 216 px below it. v1's 4:3 band (y 555–1365) leaves 325 px above. Nothing sits on the picture, so legibility comes from placement, with no scrim and no card.
- **Hero size and face.**
  - v0: `VICE CITY` in Archivo wide 800, about 120 px, centred, sitting about 66 px above the picture with a warm bloom. Below the picture is `NOVEMBER 19 · 5:24 PM` in Rockstar's date style: white wide-tracked Archivo caps with a magenta kiss.
  - v1: Rockstar's own two-line CCTV OSD (`FRONT DOOR / 09:58:47` in Trailer 2), scaled to poster size: the camera name over a ticking clock in JetBrains Mono 600 at about 128 px, flush left. The camera name changes on every camera switch. A small `CAM 06 · THU 11-19-2026` line sits under the feed.
- **Payoff hit.**
  - v0 at 0.9 s: the bars have landed and `VICE CITY` is complete. The cut to the wide pier shot carries `Look.impact` (flash 0, punch zoom) and `Look.expose`, and the title's bloom swells with the same light.
  - v1 at 2.9 s: the camera switches to STREET as the police car turns in. `Look.expose` (the camera's auto-iris blowing out) plus a punch zoom and a 4 px chroma tick on the OSD, then a slow PTZ push.

## v2 round 4 (the rebuild)
Hero time **3.4 s**: v0 is on the balcony with its full type lockup, and v1 is on STREET with the police car filling the feed just after the payoff.

### What was thrown away from v1
- The 1:1 window and the 64 px stamp, which was timid type.
- The single soft `p04` plate stretched to 0.88x, which was slowed and soft footage.
- v1's 1 px lens blur and the drained grade, which made the footage muddy.
- The top-left OSD burned into the picture.

### What was kept
- The job: a place/time stamp, and a CCTV stamp.
- Rockstar's two-line `NAME / HH:MM:SS` OSD format.
- The ticking clock.
- The rule that the stamp must match the light. The v0 shots are all golden hour for 5:24 PM, and the v1 shots are all daylight for 14:07.

### Key decisions
- **The band holds real `-h` 4K shots.** The opening and closing shots are the `-v` versions playing full-bleed, so the bars visibly close over a vertical clip and open onto one. The cut into the band is the payoff. Every shot plays at 1.0x, inside its own length.
- **Pure black bars.** `Look.install`'s wrapper has a z-index, so its grain "overlays" a transparent backdrop and lifted the bars to YAVG 32 (about #121212), which read as a grey veil. The composition sets that wrapper's z-index to `auto` and removes `#ov`'s z-index. The wrapper is still the last child, so it paints on top, and the grain now blends with the real frame: texture on the picture, none on the black. This is a local fix; the shared kit is untouched.
- **v0 title bloom** is a `filter: drop-shadow` chain on the wrapper, not a text-shadow, so the per-character reveal masks can't clip the glow. On the hit it swells from .55 to 1.3 and back with the same attack, hold and decay as `Look.expose`.
- **v1 alignment.** The OSD lines are aligned on their ink: canvas `actualBoundingBoxLeft` per line, because the mono "1" has a large left bearing. `STREET`, `14:07:34` and `CAM 09` all start at x ≈ 70 in the hero PNG.
- **v1 casting.** The first build used `s016` COUNTER. Under the CCTV grade and lens falloff it went murky (lesson 4), so it is replaced by the bright, static `s012` beach gym. `s096` in-point is 0.75 s, so the police car turns in on the payoff cut.
- **Payoff light is `Look.expose` only**, with `impact` `flash: 0`. The hit frames were checked at 0.84–1.3 s (v0) and 2.84–3.2 s (v1): the highlights blow warm, the blacks stay black, and the peak holds for 2 frames.

### Fixes made inside this round, after checking frames
- **v0 exit:** the type was still masking out across the cut and the gate opening (4.4–4.6 s). It now starts at 3.92 with a tighter stagger and is gone by 4.36, before the cut.
- **v1 exit:** the bars used `power3.in`, so they sat closed over the full-bleed clip for about 0.15 s. They now snap open with `expo.out`.
- **v1 camera-switch dip:** it lasted 2 frames, and a strip sample caught the OSD grey. It is now exactly the cut frame.
- **v1 meta line:** the double spaces around the `·` are now single.
- **v1 camera name lagging one frame:** on the 1.7 s cut frame, the dimmed OSD still read REAR LOT over the beach shot. The renderer's seek time for that frame lands a hair before the cut. The camera lookup now uses a half-frame tolerance, and all three switches (1.7, 2.9, 3.9) now show the new name on the cut frame (checked frame by frame).

### Checks
- `hyperframes check`: 0 errors.
- Warnings are the known `#ov` sub-composition lint, mask-overflow notes while the reveals run, and contrast samples taken mid-reveal at 0.31 s.
- StaticGuard reports "archivo without @font-face", but the font is declared in `fonts.css` with a stretch range. The render shows Archivo wide (verified on the hero PNG).

## v1 history (rounds 1–3, rejected by the owner as "basic")

### Round 1 (initial build)

#### Variant 0, Letterbox + time
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

#### Variant 1, CCTV stamp
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

#### Craft checks this round
- **Hero time:** 2.0 s.
- **Place line:** after the first capture, it was enlarged from 42 to 48 px (fit width 780→790), because it read small at strip scale.
- **REC blink:** the phase was shifted, because the dot was in its "off" state at the hero frame.
- **Checks:** `hyperframes check` passes with 0 errors and 0 warnings, and 42/42 text contrast checks pass.

### Round 2 (fix round, from the r01 blind critique: v0 7/10, v1 6/10)

#### Defects fixed
- **v1 bottom labels illegible over bright footage ("VICE CITY" at 6.3 s):** the bottom row is no longer part of the default stamp (see biggest gap below). When `chrome: true` brings it back, it is `#fff` at 34 px with a stronger shadow (`0 0 2px rgba(0,0,0,.85), 0 2px 10px rgba(0,0,0,.65)`).
- **v1 corner frame off-centre (72 px left, 144 px right):** the brackets are now behind `chrome` (off by default). When on, they are symmetric: `#ccCorners` runs from x 72 to 1008 (width 936). The text's right edge stays at 902.
- **v1 42% white flash at the cut-in (t 0.28–0.40 s):** the peak is now .12, so it reads as an exposure blip when the feed switches on, not a grey-out. The exit blip drops from .28 to .06.
- **v1 grade snapping back in 2 frames:** the plate keeps playing on the way out, so the grade and the fx layer now ease back over 0.25 s (`power2.inOut`) from 6.55 s. Everything is clear by 6.8 s.
- **v0 stamp not readable until about 1.6 s:**
  - The place now starts at `T.in + 0.22` (0.37 s): 0.38 s `expo.out`, blur 8→0 px, tracking .46→.28em. It blooms in while the bar is still travelling.
  - The time types on at 16 ms per character (about 2 characters a frame), starting 0.12 s after the place.
  - The full stamp is legible by 0.75 s (checked on `v0-entrance.jpg`). The typed reveal stays, because it was a deliberate round-1 choice. Only its speed was the defect.

#### Biggest gap
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

#### Checks this round
- **Hero time:** 2.0 s for both variants.
- **`hyperframes check`:** 0 errors and 0 warnings; 42/42 contrast checks pass.
- **v0:** the strip and entrance were checked; the stamp is fully legible by 0.75 s.
- **v1:** the stamp was checked at 6.3 s over the bright plate (legible), on the 0.2–1.0 s entrance (no wash) and on the 6.4–7.0 s exit (the grade eases).

### Round 3 (fix round, from the r02 blind critique: v0 7/10, v1 7/10)

#### Defects fixed
- **Stamps contradicted the footage** (v0 "11:47 PM" over p04's daylight razor-wire shot; v1 "FRONT DOOR 23:47" over p08's selfie close-up and sunlit Ocean Drive).
  - Both variants now sit on **one shot only**: p04's dusk mural/police stop (source 0–4.43 s). That shot is 4.43 s long, so the plate plays at `data-playback-rate="0.88"` and the composition is now **5.0 s** (inside the 5–8 s spec). Source time reaches 4.40 s at the last frame, so the razor-wire cut never appears. Checked on both strips.
  - Why 5 s at 0.88x, not 7 s: no plate has a single shot longer than ~5 s, and stretching 4.4 s over 7 s needs 0.63x, which reads as slow motion. 0.88x is not noticeable.
  - v0 time is now `5:24 PM · Nov 19` (critic's suggestion; Nov 19 sunset in Miami is about 5:30 PM, which matches the dusk mural).
  - v1 clock is now `17:24:08`, matching the same light.
- **v1 camera name.** The critic suggested p04 as a "near-static" shot. In the 9:16 frame it is an in-car POV: steering wheel, the driver's hand, the A-pillar and wing mirror. A "FRONT DOOR" label over that would just be a new contradiction, so the camera name is now `DASH CAM`. That keeps Rockstar's two-line OSD format (name / clock) and follows the bodycam reference (`refs/bodycam-hud-overlay`, "BODY 3 …"). It is a CONFIG field, so a creator sets "Front Door", "Rear Lot" and so on for a fixed-camera clip.

#### Biggest gap: v1 OSD now looks burned in, like Rockstar's 09:58:47 stamp
- `#ccTL` blur .5 → .9 px. A red/cyan chroma bleed (`-1.5px 0 rgba(255,60,90,.35), 1.5px 0 rgba(60,200,255,.35)`) sits under the existing white bloom. Leading 1.1 → 1.0.
- In plate mode the footage now softens to a low-res lens: `blur(1px)` plus `scale(1.04)` on the plate wrapper, applied with the grade at the cut. The vignette is a touch stronger (clear to 58%, .6 at the corners), so it reads as a barrel lens. This is `CONFIG.variants["1"].lens` (`null` keeps the plate sharp). Grade, blur and scale all ease back together over 0.25 s on the cut-away.
- Kept from earlier rounds (deliberate, not named as defects): the top-left two-line OSD at 56 px, the clock tick, power-on flicker, scanlines, roll bar, lens shade and the grade values.

#### v0 polish (named fixes)
- **Title glow:** the hard `2px` magenta offset is now `1px 0 0 rgba(238,8,242,.55), 0 0 18px rgba(238,8,242,.38)`: crisp white with a soft magenta bloom, like Rockstar's date card.
- **Type scale:** the place line is 64 px (the title floor) at .20em tracking. "VICE CITY, LEONIDA" spans about x 165–920, inside the safe zone. The bloom-in settles tracking .34 → .20em, and the exit goes .20 → .32em.
- **Second line** is in the card's own family, like "PRE-ORDER NOW": Inter 600 30 px, .34em tracking, `#E6E1EE`. It replaces the grey JetBrains Mono line. The fast type-on stays (round-1 decision).
- **Bars start at 0.05 s** (they were visibly still until ~0.32 s). The ease changed from `power4.inOut` to `power3.out` 0.5 s, because the slow in-ramp was the cause of the late start. The bars now move from the first frames and settle like a gate. The stamp reads fully by ~0.65 s (checked on `v0-entrance.jpg`).

#### Timing (5 s loop)
- v0: bars 0.05–0.55; stamp out at 4.25; bars open 4.49–4.91.
- v1: cut to camera at 0.15; camera cuts away at 4.68; grade and fx are clear by 4.93. This leaves ~0.07 s of plain footage at the end, not 0.55 s. The loop seam is 0.22 s of clean footage across the wrap. (The critic's "T.out 6.55" was for the 7 s p08 version; the same intent is applied to the 5 s timeline.)
- Timing now lives per variant (`in` / `out`), with `timing.end` global.

#### Checks this round
- Hero 2.0 s for both: the officer at the mural, a police car on the right, a figure lunging.
- `hyperframes check`: 0 errors, 40/40 contrast checks pass. The lint warning (`nested_structure_needs_subcomposition` on `#ov`) is the same one as in earlier rounds, from the template structure.
- Both renders are 5.000 s. The strips show only the mural shot. v1 entrance (0–0.5 s) and exit (4.55–5.0 s) were checked frame by frame: clean cut-in blip, HUD flicker, eased grade-back.
