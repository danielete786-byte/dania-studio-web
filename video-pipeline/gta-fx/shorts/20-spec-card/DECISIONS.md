# Decisions: 20 · Spec card

## v2 concept (craft v2 redesign, round 9)
- **One idea:** the card is gone. The spec *frames the subject*: a big cinematic name (or year) across the top of the shot, the three stats as a numeral-led spec strip across the bottom, and the vehicle or era in the clear middle. The Leonida sunset is the payoff: it ignites on the hit (Vehicle: the bars; Era: the year rolling 2013 → 2026).
- **Vehicle shots:** `assets/clips/s014-follow-v.mp4` (the library's s014 drive-by, cut again from the 4K master at 1.0x with the crop following the Vice City Police cruiser, 0–3.633 s), then `s096-police-street-v` from media 0.38 (pole wipe → the cruiser drifts in, 3.633–5.0). Payoff at **4.07 s**, when the cruiser drifts into frame in daylight.
- **Era shots:** `g39-gta5-vinewood` (GTA V, 2013, 0–1.067) → hard cut to `s011-vice-highway` ("Port VC" signs, 1.067–4.40) → `s135-skydive-city` (4.40–5.0). Payoff at **1.067 s**: the year has rolled 2013 → 2026 in sunset on the cut from Los Santos to Vice City.
- **Type placement:** top block y 248–~670 over sky / the POV roof line (top scrim), stats y ~1120–1460 over the dark dashboard (s014) or road (bottom scrim). The middle third, where the cruiser and the highway signs are, stays clean.
- **Hero size and face:** Vehicle name Archivo wide 900 at ~150 px in two lines ("POLICE / CRUISER"), numerals Inter display 800 at 104 px, labels 24 px. Era year Inter display 800 at 300 px (sunset), game name Archivo wide at 84 px, values 84 px, labels 24 px. 3 sizes, 2 families per frame.
- **Payoff hit:** `Look.impact` (flash 0) + `Look.expose` on the beat, plus the sunset ignite (bars sweep with a glint / year lands in gradient). No white flash, no chroma above 4 px.

## v1 history (rounds 1–8, rejected look; kept for content and seek-safety lessons)

### Round 1

**Format follows the references:**
- The `spec-label-block-with-game-logo` frames (XJs, 324K) prove the format: one fixed spec block per item, the same template repeated for every item, and one colour-coded value.
- `hud-character-switcher-stat-bars` (VrX, 2.2M) proves the bars: label above, a thin bar below, one neon-pink accent.

We keep that structure but replace the loose floating text and logo badge with one well-made card. Per DESIGN.md, there is no game logo.

**Variant 0, Vehicle:** smoked-glass HUD card at the top.
- The glass is Rockstar-HUD restraint: white type on smoke, a hairline, and the 1 px inner highlight.
- Bars are segmented into 10 blocks, like the in-game tuning stats. The sunset pink→amber gradient on the bar fills is the one accent in the frame. The gradient is mapped to the full track width, so higher scores reach amber.
- The card is placed at the top, so the vehicle in the clip stays visible below it. On the sample plate, the Vice City Police car passes under the card at the hero time (1.3 s).
- **Content:** "Police Cruiser / Vice City Police Dept.", read off the livery in the official trailer plate (p10). Top-speed, acceleration and braking numbers aren't known for GTA 6, so the scores are presented as the creator's opinion, under an "Our rating" label, instead of as fake specs.

**Variant 1, Era:** paper card at the bottom.
- The light card is a deliberate contrast to the glass card. The hero is a 220 px Barlow Condensed year in the sunset gradient (the one accent), which rolls from 2013 (GTA V) to 2026 to tell the "evolution" story. Bars are ink-navy.
- **Content:** all real facts from FACTS.md: GTA 6, 2026, Leonida · Vice City, "Era 08 / 08" (the eighth mainline entry in the FACTS table), and official trailer views as of Nov 18, 2026 (305.4M, 189.6M and 82.0M). Bars are proportional to the largest value.

**Type:** three sizes per card.
- Vehicle: 28 px labels, 40 px sub and values, 120 px name.
- Era: 28 / 40 / 220 px.
- Inter 600 tracked caps for labels, Barlow Condensed for the name, numerals and values (tabular).

**Motion:**
- The card lands at 0.12 s (expo.out, 0.42 s, from the side it is anchored to). The name wipes up through a mask, the rule draws, then the three bars fill with a 0.08 s stagger while the numbers count in sync. Everything is settled by about 1.3 s, and the card reads by 0.5 s.
- The card exits over 6.55–6.91 s for a clean loop.
- Counters use a getter/setter property rather than onUpdate, so suppressed seeks still update the text.

**Robustness:**
- Names, subs and stat labels auto-shrink to fit their box, so long vehicle names don't clip.
- With `bg: "none"`, the glass gets a denser smoke fill (.76) because there is no backdrop to blur.

**Plates:**
- p10 (police car) for Vehicle, as the manifest suggests.
- p07 (convertible) for Era. The g01 GTA V plate was considered for a GTA V era card but rejected: it has a burned-in trailer credit ("A ROCKSTAR NORTH…") mid-clip.

**Changes after the first look this round:**
- The hero time moved from 3.0 s to 1.3 s, and the bars were sped up (barsAt 0.46, barDur 0.66), so the payoff frame has the police car under the card. At 3.0 s the plate had already cut to a BMX in the sky.
- Text auto-fit was added.

### Round 2

Critic, round 1: v0 8/10, v1 7/10, both won the blind pick, no hard defects. Biggest gap: the Era card wasn't really an era spec. Its trailer-view stats exist only for GTA 6, so the card couldn't run down eras 01–07, and the linear 2013→2026 count showed non-GTA years (2017, 2020, 2023) during the read window. Everything below answers a named fix. Nothing from round 1 was reversed: the glass/paper split, the placements, the 3 type sizes, the one sunset accent and the motion system all stay.

**v1 Era: stats every era card can carry (the biggest gap).**
- The trailer views are gone. The stats are now a **series timeline**, all derived from the release years in FACTS.md: *Since GTA V* 13 yrs (2013→2026), *Since GTA Vice City* 24 yrs (2002→2026, the return to Vice City), *Since the first GTA* 29 yrs (1997→2026). Every era card has the same three rows: since the last game, since the last time in this city, since the first GTA. The README lists the numbers for every era, so "Era 08 / 08" now sits on a card a creator can repeat for eras 01–07.
- `max` is 29, the full 1997–2026 span, shown on the right of the stats header as "1997 – 2026". With the same max on every era card, bar lengths compare across the whole compilation (GTA V's "since the first GTA" bar is 16/29).
- This follows DESIGN.md craft rule 5: the creator can fill the rows in, and the demo uses facts that are known. Values carry their unit ("13 YRS"), as the spec-label ref does with "210 km/h".
- `statsHead`, `stats[].label` and `max` are called out as creator-fill fields in CONFIG comments and the README.

**v1 Era: odometer year instead of a linear count.**
- The year is built from the two CONFIG years. Shared digits ("20") are static glyphs. Each digit that changes ("1"→"2", "3"→"6") is a two-cell strip in a 0.82em mask that rolls 0.55 s expo.out at cardIn + 0.32.
- Each strip holds only the from and to digits, and both columns move in lockstep, so 2013 and 2026 are the only readable years. The critic's fix allowed intermediate digits on the strips; I didn't use them, because working out the expo curve frame by frame showed near-readable "2014" and "2025" states at 30 fps.
- A 0.16em blank gap separates the two cells. Without it, the long expo tail left a sliver of the old "13" peeking above "26" for about 4 frames. With it, the tail shows paper.
- Background-clip text doesn't paint transformed children, so the sunset gradient is applied per glyph, offset by each column's position. "2026" still reads as one continuous pink→amber sweep (the angle went from 100° to 90° so the vertical roll can't shift it).

**v1 entrance: no blank slab.** The meta and mask reveals now start with the card (`timing.textIn` 0, was +0.12/+0.20 s), so the type rises with the card from its first frame. The rule draws at +0.26.

**v0 Vehicle fixes:**
- **Eyebrow tracking:** one tracking, 0.3em, for both spans ("GTA 6 · 2026" and "OUR RATING"). The 0.16em override was removed.
- **Segmented bars:** the fill snaps to whole blocks (8.6→9, 7.9→8, 6.8→7 of 10) and the number carries the decimal, like the in-game tuning bars. No bar ends in a part-filled block. Segments come from `CONFIG.segments`, and the mask is built in JS so the block count and the snapping always match.
- **Compact card for letterboxed 16:9 clips:** title 120→104 px, padding 36/40/38, rule margin 24/22, stats gap 22. The card is now about 566 px tall and ends near y 828 instead of 897. The type sizes are 28/40/104, still 3.
- The gradient width and text-fit width are now measured from the card's padding instead of hardcoded (784 px inner on the vehicle card).

**Hero time:** still 1.3 s. The police car is under the vehicle card, and the era card shows its settled "2026" with all three bars full.

### Round 3

Critic, round 2: v0 7/10, v1 6/10, both won the blind pick. Biggest gap: a Comparisons card whose numbers weren't trustworthy (whole-block bars, "2013" next to "GTA 6") inside a heavy white slab. Both named defects are fixed. Kept from earlier rounds: the glass/paper split, the placements, the sunset gradient as the one accent, 10-block HUD bars, the series-timeline stats, and the odometer year.

**Defect, v0: bars now match their numbers.**
- The round-2 whole-block snapping (my round-2 decision) is reversed because the critic named a concrete defect: 8.6 drew as 9/10.
- The fill is now exact. On a segmented bar, the boundary block fills by the fraction of its *visible* width, so 8.6/10 is 8 full blocks plus 60% of the 9th. 7.9 is 7 blocks plus 90%, and 6.8 is 6 blocks plus 80%.
- The width is computed in px from the measured bar width, with `k·bw + f·(bw − 4 px gap)`. A plain `value/max %` would have lost a little of each block to the gap.
- Without segments, the fill is simply value/max.

**Defect, v1: no wrong year beside the name.**
- The roll stays: "13" rolling to "26" is the evolution beat, and the critic offered keeping it as an option.
- The roll is now 0.32 s (was 0.55) and starts at cardIn + 0.04.
- The game name, the meta row and the rule are held back until the roll is home: at 70% of its run, expo.out is more than 99% settled, which is about 0.38 s.
- The setting now sits in the meta row, so the meta is held back too. Otherwise "Leonida · Vice City" would have sat beside "2013".
- During 0.12–0.38 s the card shows only the rolling year, which is the hero, so it isn't a blank slab. "2026 · GTA 6" is readable by about 0.6 s, and the bars follow at 0.44 s.

**v1: shorter, lighter card (the biggest gap).**
- The "SERIES TIMELINE / 1997 – 2026" header row is gone: it repeated the labels.
- The year drops from 220 to 168 px.
- The setting ("Leonida · Vice City") moves into the meta row's right side, mirroring the vehicle card's "GTA 6 · 2026 / OUR RATING". A long setting shrinks the meta row together, down to 24 px.
- The bars are 8 px (was 12), with a 4 px radius.
- The card measures about 517 px (was about 700), y 933–1450, about 27% of the frame height (was 36%).
- The paper stays: the light/glass contrast between the variants is deliberate.

**v1: hierarchy.**
- "GTA 6" is now Barlow Condensed 800 at 72 px (was Inter 40 px, far right).
- It sits 24 px right of the numerals, on the year's baseline. The baseline is measured at runtime with zero-size inline-block probes, so the alignment holds for any year or name, and long names shrink to fit the remaining width.
- To stay at 3 type sizes (DESIGN.md), the stat values are now Inter 700 at 28 px, the label size, and the bars carry the magnitude. That is closer to the thin, sparse HUD-stat reference. Era sizes: 28 / 72 / 168.

**Both: no skeleton tracks.**
- Each stat row (label, value and track) is now one unit that fades in at `barsAt + i·stagger − 0.04` s. Unlabelled grey tracks never show.
- Vehicle `barsAt` is 0.42 (was 0.46) so the rows follow the name block without a gap.

**Both: hold beat.**
- A 0.5 s sheen of 60% white crosses the leading (highest) bar's fill at 2.4 s and again at 4.8 s (`timing.beats`). It is clipped to the fill, and on the vehicle card also to the segment mask.
- Two beats instead of the critic's one, so the second half of the hold isn't still either. Both are 0.5 s and low-contrast.
- Only the leading bar has a sheen element. Its fill is marked `data-layout-allow-overflow` because the sheen waits clipped off the fill's left edge.

**Hero time:** 1.4 s (was 1.3). The police car is under the vehicle card, and every era bar has fully landed.

### Polish round 4

Critic, round 3: v0 7/10, v1 6/10, both won the blind pick. Biggest gap: the motion didn't land. Both cards arrived as a full-height empty slab before any stats, and v1's 2013→2026 roll played while the card was still a milky haze. This round fixes the named defect and that gap. It doesn't change the concept, layout or materials. Kept: the glass/paper split, the placements, the one sunset accent, the 10-block exact-fill vehicle bars, the series-timeline stats, the odometer year, the hold-beat sheen and the 3-size type rule.

**Defect, v1: the year roll is now readable.**
- `yearRollAt` 0.04 → 0.34, `yearDur` 0.32 → 0.48, and the ease is now `expo.inOut` (was expo.out).
- The year has finished rising and the card is solid before the roll starts at 0.46 s. "2013" holds still and readable from about 0.27 to 0.62 s, and expo.inOut holds it there before the roll speeds up. "2026" is home by about 0.85 s.
- The name and meta wait until the roll is home. With expo.inOut that means 85% of the run (it was 70% with expo.out), which is 0.87 s, so "GTA 6" never sits beside "2013".
- Checked in the r04 MP4 at 0.3, 0.5, 0.6, 0.67, 0.73, 0.8, 0.9 and 0.97 s.

**No more milky entrance (both variants).** The card tween is split. Opacity now goes 0 → 1 in 0.12 s (power1.out), while y and scale keep the 0.42 s expo.out settle. The paper card is about 89% opaque by 0.2 s, instead of a 40–60% haze up to 0.25 s.

**No empty slab (both variants, the biggest gap).**
- The card now opens with its rows. It lands at the height of its head block (meta + name + sub, or meta + year, plus the bottom padding). It then grows to full height over `growDur` 0.5 s (expo.out), starting at `barsAt − 0.06`.
- `.card` has `overflow: hidden`, so rows are clipped until the card reaches them. The outer shadow and the backdrop blur aren't affected.
- Height is used rather than a clip-path, because a clip-path would clip the card's drop shadow.
- The card is re-anchored by its top at runtime, so a bottom card grows downward and none of its type shifts. Its bottom edge stays at y 1450, and its top moves to about y 927 because the 10 px bars add 6 px.
- The rule now draws across the opening, at the same moment in both variants.
- Vehicle: `barsAt` 0.42 → 0.24 and `barStagger` 0.08 → 0.06 (the critic's numbers). Rows arrive at 0.20, 0.26 and 0.32 s, while the name is still wiping up. The card is never taller than its content.
- Era: `barsAt` 0.44 → 0.70, the critic's number to match the later roll. The card is a compact year card while "2013" holds. It opens as the roll starts, so "Since GTA V" counts 0 → 13 while 2013 rolls to 2026, and all three bars have landed by 1.4 s.

**v1 hierarchy (3 sizes kept).**
- "GTA 6" goes from 72 to 96 px, the critic's number. It still sits on the year's baseline, and the empty paper to its right drops from about 240 to about 190 px.
- The critic also asked for 44 px Barlow values. That would make a 4th type size (28/44/96/168), which DESIGN.md rule 4 and the round-3 decision rule out.
- Instead the values stay at the label size (28 px) and the data gets weight and colour contrast. Values are Inter 800 in ink, and labels drop from 82% to 62% ink. Era sizes: 28 / 96 / 168.
- The bars are 10 px (was 8), with a 2 px radius (was 4) and a 1 px rgba(0,0,0,.06) inset track edge, the critic's first option. They read as a crafted gauge rather than a default progress bar.
- I didn't segment the era bars: the same critique calls the vehicle card's stacked segments heavier than Rockstar's thin, solid HUD bars.

**v0 payload (3 sizes kept).**
- "OUR RATING" goes from 50% to 64% white, so it's no longer the weakest text on the card.
- The values go from Barlow 700 to 800 and stay at 40 px. The critic's 52 px would have been a 4th size, next to the 40 px sub.

**Hero time:** 1.4 s, the same as round 3. The police car's livery is sharp under the vehicle card, and the era card has settled ("GTA 6" has landed and the bars read 13/24/29). At 1.5 s the car is motion-blurred.

### Polish round 5

Critic, round 4: v0 7/10, v1 6/10, both won the blind pick. Biggest gap: the cards didn't line up with the footage. v0 labelled a lime supercar, dirt bikes and fireworks "Police Cruiser" for about 85% of its run, and v1 opened on a bare "2013" with no label. All three listed defects are fixed, and the v1 gap is closed. Kept: the glass/paper split, the placements, the one sunset accent, the series-timeline stats, the odometer year, the 3-size type rule and the vehicle card's open-with-rows entrance.

**Defect, v0: the card only sits over the cruiser.**
- The official footage has no 4 s cruiser shot. The p10 drift is on screen for 1.33 s (rz1B4B2yBZY 46.90–48.23), and seeking the plate would have left about 1 s of card.
- v0 now uses its own 5 s sample clip, `assets/clips/vcpd-cruiser-v.mp4`, built only from the two official-trailer shots of the Vice City police cruiser:
  - **A** (0–1.93 s): the drift, rz1B4B2yBZY 47.233–48.200, same crop as p10, at 0.5x. Every frame is a real frame held twice. I tested motion interpolation (ffmpeg minterpolate mci) first and rejected it: it smeared the car on the entrance frames and ghosted the pole and pedestrians.
  - **B** (1.93–5.0 s): the drive-by past the parked cruiser with its lights on, VQRLujxTm3c 45.30–48.37 (the p04 shot), real time. The crop eases left (smoothstep, 47.35→48.25) to follow the car, so it ends on the cruiser's "POLICE" rear quarter.
- The recipe is `assets/clips/make-vcpd-cruiser.sh`. It lives in `assets/clips/`, which `sync_shared.sh` doesn't overwrite. The p10 plate is no longer used.
- Checked in the r05 MP4 at 0.2, 0.5, 0.75, 2.0, 2.6, 3.3, 4.0 and 4.6 s: the cruiser is in every frame. The lime car, the dirt bikes and the fireworks are gone.

**Defect, v1: opens complete, no grey flash, no label-less year.**
- The era card no longer fades in (that ramp was the translucent grey panel at 0.13–0.20 s), and it no longer opens shut. At 0.18 s it appears fully opaque and full height, then settles over 0.42 s (y and scale, expo.out). r05 frame 6 (0.20 s) is the whole white card.
- The old-era beat is kept, as the critic allowed, and it now carries its label. The card opens on **"2013 / GTA V"** with that year's numbers and bars, holds 0.16 s (5 frames), then rolls.
- `nameFrom` is a new field. The game name is a two-line strip, like the year digits, and rolls "GTA V"→"GTA 6" in lockstep with "13"→"26". So "2013" never sits beside "GTA 6", and the year is never shown without a name.
- The roll is now `expo.out` over 0.35 s, the critic's numbers (it was a 0.48 s `expo.inOut` after a 0.35 s bare hold). "2026 / GTA 6" and the stats are readable from 0.43 s, and everything is home by 0.55 s. The meta row (era count and setting) fades in from 0.46 s, because it belongs to the new era.

**Defect, v1: the numbers are locked to the rolling year.**
- Stats take a `from` value: the number while the old year is up. That is value − (year − yearFrom), so 0 / 11 / 16 in 2013.
- Counters and bar fills tween from→value on the roll's own tween (same start, 0.35 s, expo.out). All three count in step to 13 / 24 / 29: r05 shows 0/11/16 → 5/16/21 → 9/20/25 → 11/22/27 → 12/23/28 → 13/24/29 on consecutive frames.

**Both: shorter hold, one deliberate beat.**
- The composition is now **5 s** (was 7). Cards run from 0.12/0.18 s to 4.58 s, then a 0.36 s exit, and are gone by 4.94 s.
- One beat at 3.0 s, the critic's time:
  - v0: the sheen now crosses all three bars, 0.06 s apart. One bar alone hadn't read as a beat.
  - v1: the lead bar's sheen, plus a 1 → 1.04 → 1 swell on "2026", anchored at its left baseline and applied to the year's mask so it isn't clipped.

**v0: one continuous bar.**
- The segmented bar is reversed. Whole-block snapping (round 2) was named a defect because 8.6 drew as 9/10. Exact partial blocks (rounds 3–4) are now named a defect because the 60% ninth block reads as a rendering glitch. The round-3 critique also called the stacked segments heavier than Rockstar's thin solid HUD bars.
- A continuous 12 px sunset bar is exact and has no odd block. It is the critic's second option, not a return to snapping.
- `segments` stays in CONFIG (0 = continuous; 10 brings the blocks back).

**v0: exit.**
- The exit is 0.36 s from 4.58 s. Opacity now uses `power1.in`, so the fade is visible across the whole exit (with power2.in only the last ~0.15 s read). It drifts 12 px (up for the top card).
- Checked at 4.5–4.97 s: the fade runs over about 0.33 s, and the frame at 4.97 is empty.

**Not taken:** the ink-navy era card. It was offered as a "consider", and the light paper card against the vehicle card's glass is a deliberate decision from round 1, not a defect.

**Hero time:** 1.0 s (was 1.4). It is a clean real frame of the drift with the "Vice City Police Dept." door seal sharp under the vehicle card. The era card is settled on "2026 / GTA 6 · 13 / 24 / 29". At 1.07 and 1.2 s a pedestrian and a motion-blurred passer-by cross the car.

### Polish round 6

Critic, round 5: v0 7/10, v1 7/10, both won the blind pick. One defect (the v1 one-frame opacity pop) is fixed. Neither variant scored 6 or below, so the rest are the critic's cheap fixes that fit the earlier decisions. Kept: the glass/paper split, the placements, the one sunset accent, the continuous vehicle bars, the series-timeline stats, the odometer roll, the 3-size type rule, the 5 s length and the 3.0 s hold beat.

**Defect, v1: no white flash on entry.**
- The era card's opacity was a 0.001 s tween at 0.18 s, so the full white card cut in over the dark plate in one frame.
- It is now a 0.10 s `power1.out` ramp (`timing.cardFade`, the critic's numbers). The y and scale settle is unchanged (0.42 s, expo.out).
- The vehicle card uses the same `cardFade` (it was 0.12 s, so the change is negligible), so one field drives both.
- Checked in the r06 MP4, frame by frame: 0.167 s empty, 0.20 s about 36%, 0.233 s about 78%, 0.267 s solid.

**v1: the old era registers before it rolls.**
- `yearRollAt` 0.16 → 0.45 and `yearDur` 0.35 → 0.45, the critic's numbers. "2013 / GTA V" now holds still and complete from 0.20 to 0.63 s (about 13 frames, was 5). The roll then runs for 0.45 s (expo.out) and reads "2026 / GTA 6 · 13 / 24 / 29" by about 0.83 s.
- This only lengthens the round-5 hold. The round-5 decision (the old year always carries its own name and numbers) is unchanged.
- **The meta row rolls with the era.** New fields `metaFrom` / `metaRightFrom` hold the previous era's meta: "Era 07 / 08" and "Los Santos" (GTA V's setting in FACTS.md). It rolls to "Era 08 / 08" and "Leonida · Vice City" on the same tween as the year.
  - Same-length lines roll only the characters that differ, like the year digits: only "7"→"8" moves in "Era 07 / 08".
  - Different-length lines roll as a whole line, with the setting kept flush right.
  - Each rolling cell is a two-line strip in a 1.25em mask with the 0.16em blank gap, so the expo tail never shows a sliver of the old text.
  - The 2013 state no longer opens with a blank band at the top of the card. Without `metaFrom`/`metaRightFrom`, the old behaviour stays: the meta fades in as the roll lands.
- Checked in the r06 MP4 at 0.5 s (complete 2013 state), 0.70 s (mid-roll), and every frame from 0.6 to 1.1 s.

**v1: the head fills its row.**
- Year 168 → 196 px and name 96 → 112 px, the critic's numbers. Type sizes are now 28 / 112 / 196, still 3.
- The head now spans about 87% of the inner width (it was about 75%, with about 190 px of empty paper right of "GTA 6").
- The card is bottom-anchored at y 1450, so it grows upward: it is now about 545 px tall (y ~905–1450), still inside the safe zone. Round 3 dropped the year from 220 px to shrink a heavy slab; 196 px only adds about 23 px of height, so that decision holds.

**v0: the scores read as ratings.**
- Each value now carries its scale: "8.6" plus "/10" at 28 px (the label size, so still 3 sizes), Barlow 700 at 50% white. This is a new `unit` field ("" for none).
- **Not taken:** renaming the eyebrow "Our rating" to "Rating / 10". "Our rating" is the round-1 honesty label that says the numbers are the creator's opinion, and the "/10" now carries the scale.
- **Not taken:** fact rows instead of bars (for example "Agency: VCPD"). That would change the component's concept (a name plus 3 stats with bars); the README already tells creators to swap in their own scores or in-game stats.

**v0: thicker smoke.**
- The glass goes from rgba(14,14,20,.62) with a 20 px blur to rgba(18,18,28,.80) with a 32 px blur, the critic's numbers. The transparent (`bg: "none"`) fill goes .76 → .86, so it stays denser than the plate version.
- The yellow wall, blue sky and purple billboard no longer show through behind the sub and labels. Checked at 0.25 s and in the 1.0 s hero.

**v0: a faster entrance.**
- `barDur` 0.66 → 0.50 and `growDur` 0.5 → 0.4, the critic's numbers. The last row starts at 0.36 s and has settled by 0.86 s (it was about 1.1 s). The r06 entrance strip reads 8.6 / 7.9 / 6.8 at 0.875 s.

**Hero time:** 1.0 s, the same as round 5. The cruiser's door seal is sharp under the vehicle card, and the era card has settled on "2026 / GTA 6 · Era 08 / 08 · Leonida · Vice City · 13 / 24 / 29".

### Round 7 (lead fix, after the r06 critic)
- **Defect (r06):** the right-aligned tracked meta labels ended about 8 px short of the content edge, because the 0.3em letter-spacing trails the last glyph.
- **Fix:** `.meta > span:last-child { margin-right: -0.3em }`. "OUR RATING" and "LEONIDA · VICE CITY" now end flush with the stat bars in both variants (checked on the r07 heroes).

### Round 8 (lead fix, after the r07 critic)
- **Defect (r07):** during v0's wipe-up (0.23–0.33 s) the subtitle mask shaved the descenders ("Citv", "Dept" without its p tail), and then they popped in.
- **Fix:** `.v-vehicle .mask` keeps 0.25em of room below the line box (padding-bottom plus a matching negative margin, so layout doesn't change). The wipe starts at yPercent 130 instead of 105, so each line is still fully hidden inside the taller mask at frame 0. The card's shut height subtracts that padding, so the opening card is the same size as before.
- **Verified:** frames at 0.27 and 0.33 s show complete descenders, and the hero is identical to r07.
