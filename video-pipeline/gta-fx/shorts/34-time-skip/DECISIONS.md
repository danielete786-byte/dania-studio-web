# DECISIONS · 34 Time skip card

## v2 concept
- **The one idea.** The time skip *is* the edit.
  - **V0 "Time skip"** (full-bleed 9:16): the hours pass through the light. It cuts afternoon → golden hour → sunset → night, one hour per cut. A big numeral in a "3 HOURS LATER" lockup counts 1 → 2 → 3 on those cuts and lands in sunset on the night cut.
  - **V1 "Date card"** (letterbox): a calendar page split across the black bands. On the cut from a Wednesday night to a Thursday morning, the day rolls 18 → 19 (GTA 6 release day).
- **Shots and cuts. Everything plays at 1.0×, and no window crosses a shot's internal cut.**
  - V0:
    - `s011-v` afternoon highway, 0–0.6 s
    - `s026-v` golden pier, 0.6–1.33
    - `s036-v` sunset beach bar, 1.33–2.1
    - `s098-v` night with fireworks exploding behind Jason, 2.1–3.2 (**payoff**)
    - `s039-v` club dancer, 3.2–4.75
    - `s039-v` purple club crowd, 4.75–5.8
  - V1, in a 1080×608 band (y 656–1264):
    - `s039-h` club, 0–2.0 (it has its own cut at 1.07)
    - `s011-h` Vice City morning, with a plane over the "VCI Airport / Downtown" signs, 2.0–4.2 (**payoff**)
    - `s135-h` skydiver over Vice City, 4.2–5.8
- **Where the type sits.**
  - V0: the lockup sits low (y 1043–1370), on the dark lower half of every shot (dock water, the bar counter, Jason's jacket, the club floor), over a soft floor of shadow. Faces stay clear (they're all above y 800). It is centred on its ink: x 168–913, 86% of the safe width.
  - V1: all the type is in the black. The giant day sits in the top band (cap y 289–619, ending 37 px above the footage), the weekday and month in the bottom band (y 1325–1441).
- **Hero sizes and faces.**
  - V0:
    - The numeral is Inter display 800 at 440 px (cap 320 px).
    - "HOURS / LATER" is Archivo wide 800 at 100 px, stacked so LATER's baseline sits on the numeral's baseline.
    - The label "VICE CITY · 19:40" is Inter 600 caps at 26 px, tracked .34em, hung above the words. Its clock steps one hour per cut.
  - V1:
    - "19" is Archivo wide 800 at 465 px (ink 635 px, 74% of the safe width).
    - "THURSDAY" is in Rockstar date style: Archivo wide 700 at 64 px, tracked .28em, with a soft magenta offset and bloom.
    - "NOVEMBER · 2026" is a 26 px wide label.
- **Payoff hit.** In both variants the hit is the cut into the "after" scene, built from `Look.expose` (the light), `Look.impact` with `flash:0` (punch and shake on the footage only), `Look.chroma` at 5 px for 0.16 s on the numeral, and then a sheen across the sunset numeral.
  - V0 hits at 2.1 s: the "3" lands in sunset as the shot goes to night. Expose peaks at 2.0 because the night shot is dark, and the real fireball blooms 0.2 s later.
  - V1 hits at 2.0 s: 18 → 19 and WEDNESDAY → THURSDAY roll into the morning. Expose peaks at 1.55 because the day shot is already bright.
- Hero time: **3.1 s**. V0 shows Jason, sharp, with the fire behind him under the finished lockup. V1 shows the plane over the Downtown signs under the sunset "19".

## v2 round 4 (first craft-v2 round; r01–r03 were the rejected v1 design)
**What was thrown away from v1, and why.**
- v1 blurred and smoked the footage under the card (V0), or covered it with a 70% plum tint (V1). That's the "dark card on soft footage" look the owner rejected.
- It also used old `assets/plates/`, a JetBrains clock with a ticked rail (a stock "slider" idiom), and small type (V1's stack was 14% of the frame height).

v2 keeps the footage sharp and graded and lets the cuts tell the time. There are no cards, rails or tints.

**What was kept from v1.**
- The jobs: "3 HOURS LATER", and a date card that rolls to Thursday, November 19, 2026 (FACTS.md).
- One sunset accent, on the numeral that lands.
- Odometer rolls where only the changed digit rolls and an unchanged digit cross-fades into sunset.
- The r02 lesson: every rolling slot is clipped to its cap band ±10 px, so no sliver of an outgoing or incoming glyph shows above or below the line.

**Key build decisions.**
- **Cut rhythm.**
  - V0's hour cuts sit on frames 18 / 40 / 63 (0.6 / 1.333 / 2.1 s). 1.35 s fell between frames and rendered at frame 41, two frames after the numeral step, so the times were frame-aligned.
  - Each step starts 2–3 frames before its cut, so the new digit is about 80% in on the cut frame and about 90% in on the first lit frame of the hit.
  - The two hour cuts get a small exposure breath (1.2 and 1.24). The night cut gets the real hit.
- **Plural.** "HOUR" becomes "HOURS": the S rises in its own mask on the second step. The words column is left-aligned, so nothing reflows.
- **Glow outside the clip.**
  - V0: the numeral's glow and lift shadow live on `#numGlow`, outside the clip-path window on `#numBox`.
  - V1: the day layers carry their own drop-shadow, and the weekday's magenta bloom lives on `#wkWrap`, outside the `#wk` window.

  So no glow is ever cut by an odometer window.
- **Band edge.** V1's slot windows end at y 626 and the weekday window starts at y 1319, so nothing rolls into the footage band. (The first build's slots ran to y 693, and the incoming "9" showed over the band; fixed before the final capture.)
- **Footage grade.** The dark dancer section of `s039-v` gets a light lift: brightness 1.16, saturate 1.12 (the crowd shot gets 1.08). The hold reads as a colourful club, not mud.
  - The internal cuts were found by frame diff: `s039` at 1.067 and 2.667; `s098` at 1.133, a green laser shot. All windows avoid them.
- **Exits.**
  - V0: the numeral leaves upward through its window (continuing the count), the words drop into their masks with a 16 ms stagger, the label blurs, and the shadow floor fades across the 4.75 cut.
  - V1: the digits drop and the weekday rises, both toward the footage band. The month blurs. Moving type never crosses other type.
- **The hold keeps moving.**
  - V0: the lockup drifts up 14 px over the hold, and there are two cuts under it.
  - V1: the day grows 1.00 → 1.025, and there is a cut at 4.2.
  - Each shot gets its own push (1.0 → 1.045, or 1.07 on the payoff shot; V1's band 1.04 → 1.09).
- **Optical alignment, measured in the hero PNGs.**
  - V0: the label's ink starts at x 449 and HOURS at x 451. The lockup was shifted 6 px left so its ink centres on x 540.
  - V1: Archivo's "1" has a wider left bearing than the "9", so the day is nudged 6 px left (`CONFIG nudge`). The ink centre is 541.5, THURSDAY's is 539.5, and the month's is 540.
- **Lint.**
  - The odometers and the lk-masks overflow on purpose, so they carry `data-layout-allow-overflow`.
  - The "·" separator went from .55 to .74 white after a 2.74:1 contrast warning.
  - The check passes with only the usual `nested_structure_needs_subcomposition` warning.

**Self-review.** I checked the hero PNGs, both strips, the entrance sheet, and frame-by-frame pulls at the entrance, payoff (1.9–2.3), hold and exit (4.4–5.5).
- There are no frozen frames (frame diff never falls below 0.3) and no frames from the wrong side of an internal cut.
- The type is Inter and Archivo throughout, with no fallback.
- All text sits inside x 72–936, y 230–1480.

Known trade-offs:
- In V0 the lockup reads at about 0.7 s (words from 0.2 s, the "1" lands on the 0.6 s cut). The first 0.15 s is clean scene A on purpose.
- V1 ends on about 0.3 s of empty bands over the skydive shot after the type exits.

## v1 history (rejected design, r01–r03)
### What the references show
- `research/gta6/refs/time-skip-date-card/g1Z4s2m8qGk-73.3`: a solid red full-frame card with a centred white date ("07 . 02 . 2026"). Clean but generic.
- `.../nG460QiZvBA-41`: the SpongeBob "the next day" meme card, with novelty font and black outlines. The format works (a full-screen beat between scenes), but the styling breaks DESIGN.md.
- `refs/official-type/QdBZY2fkU-0-85.5` ("COMING 2025") and `8L0CzL2V72c-47.3` ("PLAY HAS NO LIMITS" on a sunset sky): Rockstar's own date type and sunset backdrop. analysis-3 notes "nobody uses Rockstar's own type language", so that look is unclaimed.

### Key decisions (round 1)
1. **The component is a scene bridge, not just a card.** It holds two clips (A before, B after) from CONFIG, and the swap happens under the card, so the cut is always hidden. This makes it a full-frame component that genuinely transforms footage.
2. **The two variants differ in style and content.**
   - **V0 "Time skip"** keeps the footage visible: smoked, blurred, pushed in. It reads as "time passing" rather than a hard cut to colour.
   - **V1 "Date card"** is a Rockstar-style date card: a tint rises over the blurred live clip, the date blooms in, and the card dissolves to the next scene. (Round 2: the tint went to 80% over moving footage. Round 3: the tint is now an ink-navy → deep-plum night card at 70%, not a sunset sky. See below.)
3. **One accent per frame.**
   - V0: the sunset-core gradient is only on the numeral. The unit, clock and rail are white.
   - V1: since round 3 the ground is ink-navy → deep plum, and the only warm thing on screen is the "after" day ("19") in the sunset core gradient. The 2 px magenta (#EE08F2) offset on the date line is part of Rockstar's date style, not a second accent.
4. **Type and sizes.**
   - V0: Barlow Condensed 900 numeral (470 px), Inter 600 caps tracked 0.32em for "HOURS LATER" (64 px), and JetBrains Mono for the clock (32 px). That is 3 sizes.
   - V1: Inter 600 caps throughout, tracked 0.3–0.45em, in 3 sizes: 72 / 46 / 30 px. The year line is about 60% of the date line, following analysis-3.
5. **The motion carries the meaning.**
   - V0: the clock rolls through the actual hours (21:40 → 00:40), and the rail ticks light up hour by hour, so the card says how much time passed and shows it passing.
   - V1: the day digit and weekday roll over (Wed 18 → Thu 19), so the date card itself performs the skip.
   - Tracking-in is a per-glyph x spread (transforms only, seek-smooth). Animating letter-spacing was rejected by `hyperframes check`.
6. **Real facts.** The demo date is the GTA 6 release, Thursday, November 19, 2026 (FACTS.md). Nov 19 2026 is a Thursday. No logos and no official wording.
7. **Plates.**
   - V0: p03 Jason at the door → p05 truck yard. The skip happens between two different characters' scenes.
   - V1: p05 truck yard → p06 Lucia at the gate, starting 2.0 s into the file so she is on screen. Its golden hour matches the sunset card.
   - Every clip's playing window avoids the shot cuts inside the plates (p05 cut at 5.03 s, p06 at 5.5 s), except p03's cut at 3.93 s, which falls under the blur.
8. **Safe zone.** Everything is centred on x = 540. The widest line (V1's "NOVEMBER 19") spans x 172–912. The stacks sit at y ≈ 560–1080.

### Round 1 changes after self-review
- V0's footage was nearly black under the smoke (brightness 0.62 plus a 30% wash). I raised it to brightness 0.8 with a 16% wash so the blurred scene still reads as footage.
- V0's type was scaled up (numeral 420 → 470, unit 58 → 64, clock 30 → 32, rail 300 → 360) so the stack spans about 60% of the width instead of 50%.
- V1's date line was 76 px and ended at x ≈ 935, on the edge of the safe zone. It is now 72 px and ends at x ≈ 912. The sky's mid stops are slightly deeper so the white type has more contrast.

### Round 2 changes (critic r01: v0 7/10, v1 5/10)
Defects fixed first:
- **V1 hid the footage behind a frozen, opaque gradient** (0.9–4.1 s, PSNR 54 dB). The live clip now stays under the card at `blur(28px) brightness(.72)`, the sky sits over it at opacity .80, and the backdrop drifts (footage 1.08→1.02, sky 1.06→1.00, clouds slide). Measured PSNR on the top of the frame across the hold is now 30.5 dB (was 51.9 dB). The card is fully in at 0.9 s and gone by about 3.45 s (was 4.1 s). Scene B crossfades in under the blurred sky at 2.45–2.95 s.
- **V1's light-pink contrast (about 2.5:1).** Three changes:
  - The sky is now a dusk version of the sunset palette: deep plum-violet at the top (#3A1B50 → #7E3F86 behind the text), still warming to #EE8C8A → #FFC88F at the bottom. The critic named a concrete contrast defect, so this reverses the round-1 "soft sunset card" choice. It also matches Rockstar's own date card, which sits on a dark plate.
  - A plum scrim sits behind the cluster: `radial-gradient(ellipse 900px 460px, rgba(22,1,35,.38), transparent 70%)`.
  - Every line has the DESIGN.md dark shadow. The magenta offset is cut to 2px 0, on the date line only (none on the weekday or year).
  `hyperframes check` now passes contrast 24/24.
- **V1's weekday was illegible at phone size.** It goes from 30 to 36 px with tracking cut from .45 to .32em, and no magenta offset.
- **V0's clock start label failed contrast (2.84:1).** It is now rgba(255,255,255,.82) with a stronger two-layer shadow. The clock type goes from 32 to 36 px, and the rail and ticks from 2 to 3 px (ticks 19 px tall).

Biggest gap per variant:
- **V1's payoff.** Every day digit rolls in its own clip-path slot, and so does the weekday. The "before" and "after" glyphs travel in lockstep as one reel (0.4 s, expo.out, 40 ms stagger per digit), so they never overlap mid-roll. The new "19" lands in the sunset core gradient (`.sun`: background-clip text with a drop-shadow filter, because text-shadow would paint over a clipped gradient). This is the frame's one accent. The date line punches 1→1.04→1 as it lands. The roll runs at 1.95 s, so "Wednesday, November 18" reads for about 1.1 s first.
- **V1's scale.** The date line goes from 72 to 88 px at .17em. The critic suggested 96 px at .22em, but at that size Inter 600 with tabular figures measures about 860 px of ink, which would cross the right safe edge (x 936). 88 px at .17em measures x 153–929 in the hero. The year goes from 46 to 56 px. The cluster is now about 260 px tall and 74% of the frame width, centred at y ≈ 860.
- **V0's size and dead time.**
  - The numeral goes from 470 to 540 px, and "HOURS LATER" from 64 to 80 px at .28em (ink x 160–921, 70% of the width). The rail goes from 360 to 420 px.
  - The clock now rolls over 1.1–2.5 s, then a landing beat follows: the numeral punches 1→1.03→1 and the end tick flashes (scaleY 1.7 with a glow for about 2 frames).
  - The exit starts at 3.6 s (was 4.45 s), so the card holds about 1.1 s after the payoff instead of 1.5 s or more.
- The composition is 6.0 s (was 6.5 s). Clip windows were retimed: v0a 0–3.35, v0b 2.65–6.0; v1a 0–3.0, v1b 2.4–6.0 from media 1.8 s (ends at media 5.4 s, before p06's cut at 5.5 s). No clip window now crosses a shot cut.

### Round 3 changes (critic r02: v0 8/10, v1 7/10, both won the blind pick)
Defect fixed first:
- **V1's day roll left glyph slivers outside the line** (the outgoing 8's bowl above "19", a THURSDAY ghost under WEDNESDAY, and the unchanged tens "1" rolling for no reason).
  - Each rolling slot is now an odometer window clipped to its cap-height band plus about 4 px: `.dig.roll` is `inset(0.09em …)` and `#wk` is `inset(0 …)`. Inter caps sit at 0.136–0.863em of a 1em line box, so this is tighter than the critic's `-4px` suggestion. Their suggestion still left about 18 px of room above the cap line, which was where the 8's bowl showed. I checked frame by frame in the render (2.0–2.3 s): nothing shows outside the line.
  - The waiting glyph sits one line plus 24 px away, so the clip hides it until it rolls in. The opacity cross-fades on rolling glyphs are gone, because the clip does that job now.
  - Only digits that change roll. An unchanged digit (the tens "1") stays still, and its sunset version fades in over the white one in 0.2 s. The roll ease is now `power4.out` over 0.5 s (it was `expo.out` over 0.4 s, which was effectively a 3-frame snap), so the odometer actually reads.

Biggest gap per variant:
- **V1's backdrop read like a phone wallpaper.** The purple-to-peach sunset sky and its warm clouds are gone. The tint is now ink-navy `#1F202B` into deep plum `#160123` with a soft edge vignette, at opacity .70 (was .80). The footage underneath is at `blur(26px) brightness(.8) saturate(1.1)`, so the truck yard and then Lucia's golden-hour gate ghost through and keep moving. This follows Rockstar's own cards ("COMING 2025" in white wide-tracked caps on black, in `refs/official-type/QdBZY2fkU-0-85.5`) and DESIGN.md's navy and plum card colours. The sunset "19" is now the only warm thing on screen, so it pops. The type shadows are lighter (`0 4px 16px` instead of `0 6px 24px`) because the ground is already dark.
- **V1's scale and hierarchy.** The date line goes from 88 to 96 px, tracking .17 → .12em, with proportional figures, so "19" no longer has the wide tabular gap. The weekday goes from 36 to 32 px and the year from 56 to 44 px, so the date line dominates.
  - I did not use the critic's 108 px at .12em: it measures about 900 px of ink. Centred on x = 540, the widest allowed line is 792 px (right edge at 936), so it would cross the safe zone.
  - 96 px measures x 153–921 in the hero, and about 927 at the peak of the 1.03 landing punch.
- **V0's smoke turned the plate into a black slate.** The vignette is lighter (.30/.62 → .18/.42), the base wash went from .16 to .06, and the footage sits at `blur(22px) brightness(.86) saturate(1.06)` (was blur 24, brightness .8, saturate .9). A soft local pool (`ellipse 640×520, rgba(8,8,12,.26)`) sits right behind the type stack, so white type still holds on bright footage while the rest of the frame keeps its colour. `hyperframes check` contrast passes 36/36.
- **V0's sizing.** The numeral goes from 540 to 470 px, with a cap of about 330 px, inside the 180–360 hero range; its box is 384 px. "HOURS LATER" goes from 80 to 88 px. Tracking drops from .28 to .19em to stay inside the safe zone: ink measures x 154–930. The clock type goes from 36 to 40 px. The rail goes from 3 to 4 px and the ticks from 19×3 to 24×4 px, so the rail stays readable at 360×640. The stack moved down 40 px (top 540) so it centres on the safe zone.
- **Dead tail (both variants).** The composition is now 5.5 s (was 6.0 s), and the card holds longer:
  - V0: the clock rolls 1.05–2.65 s and lands at 2.65. Scene B crossfades under the light smoke at 2.9–3.6, so the hold keeps moving. The card exits at 4.05 and is gone by about 4.37; the footage is clear at 4.75.
  - V1: the roll is at 2.1, so "Wednesday, November 18" reads for about 1 s first. Scene B crossfades at 2.7–3.3, the text exits at 3.9, and the tint is gone by about 4.35.
  - In both, about 1.1 s of clean scene B follows the card (was 2.3 s), and the opening beat of scene A is 0.4 s.
  - The clip windows were retimed: v0a 0–3.6 (before p03's cut at 3.93); v0b 2.85–5.5, media 0–2.65; v1a 0–3.3; v1b 2.65–5.5, media 1.8–4.65 (before p06's cut at 5.5). No clip window crosses a shot cut now.

Kept on purpose: V0's look (the sunset numeral as the only accent, Inter 600 tracked caps, the mono clock with one tick per hour, the landing punch), V1's per-glyph tracking bloom, the scene bridge under the card, and the real release date (Thursday, November 19, 2026).

### Hero time
3.4 s.
- In V0, the clock has landed on 00:40, and scene B (the truck yard) shows through the light smoke, so the frame proves the footage is transformed rather than blacked out.
- In V1, the date has rolled to Thursday, November 19, with "19" as the only warm element, and Lucia's scene ghosts under the night tint.
