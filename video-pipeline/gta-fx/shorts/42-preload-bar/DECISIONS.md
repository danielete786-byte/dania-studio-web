# Decisions: 42 · Pre-load progress

## Round 1
**References**
- `research/gta6/refs/download-progress-bar/o4szgbreAzs-1.5` and `-3` (2.1M views): a Steam-like "PATCHING / INSTALLING 98–99% Complete" bar with a push-in. We keep that format: a status label, a big percent, a thin bar, and a slow push-in while it ticks.
- We drop the store chrome: no PAUSE button, no store tabs and no cloud icon.
- Rockstar's own graphics (`official-type/`) set the colour: the Leonida pink→amber sunset is the one accent, on the progress fill or ring.

**Key decisions**
- **Neutral, unbranded launcher UI.** No console or store look-alike and no GTA VI logo. The game appears as "Grand Theft Auto VI" in Inter 700, and the tile says "GTA 6" in Barlow Condensed 800 on a plum→ink square.
- **One accent per frame.** The sunset gradient appears only on the bar fill or the ring arc. The "done" check is drawn in white rather than Vice teal, to keep a single accent.
- **Three type sizes per variant.**
  - Bar: 28 (labels, mono meta, sub), 44 (title, %, Play), 150 (numeral).
  - Ring: 28, 44 and 220.
- **Real facts only.**
  - "Unlocks Nov 19, 2026" and "Launches November 19, 2026" come from FACTS.md.
  - The install size isn't known, so no GB figure is shown. The meta row shows only a speed and an ETA countdown, both editable in CONFIG.
- **Percent odometer.** Each new value rolls up from below (0.42 s expo.out). The entrance rolls 0→98 while the fill sweeps, so the card reads within 0.6 s.
- **The payoff differs by variant.**
  - Bar: the finished bar physically grows into a sunset Play button with ink text.
  - Ring: the gap closes, then a soft bloom and a 2.5% breath.
  - Both swap the status to "✓ Ready to play" with a drawn check.
- **The variants also differ in style.** Bar is a smoked-glass card in the upper third (hook zone). Ring is a solid ink-navy card, centred.
- **Determinism.** The fill, ring offset, numbers, speed and ETA are a pure function of timeline time, run through one `KitMotion.drive` over the whole timeline. The speed jitter is a sum of sines, with no randomness.
- **Plates.** Bar uses p01 (the Keys sign, then the marina, then the jet ski). Ring uses p06 (Lucia at the gate, golden hour). We avoided p02 even though the manifest suggests it, because it shows the official GTA VI logo and the PS5 legal card for about 4 s.
- **Push-in.** The whole card scales 1→1.035 over the hold, echoing the reference's push-in.

**Fixes made after looking at our own frames**
- In the Ring variant the check SVG had picked up the 540 px ring rule, so the rule is now scoped to `.rwrap > svg`.
- The "%" collided with "100", so the "%" now lives inside each odometer line and the line is centred as a unit.
- The Bar percent column was widened so "100%" never clips.

## Round 2
The critic scored Bar 7 and Ring 6. Biggest gap: the hook was late and diluted. Both variants entered at 0% and raced past 98 before the eye landed, sat almost still for about 3 s, and only reached "Ready to play" at 4.3 s. In Ring the payoff was just a 28 px label swap.

**Defect fixed**
- **Safe zone.** Both cards ran to x 948. The cause was the 792 px card times the 1.035 push-in. Both cards are now 766 px plus the 1 px edge (768, x 156–924), and the push-in is 1.025. At full push the card spans x 146–934, which I checked on the 6.5 s frame of both renders.

**Hook choreography (both variants)**
- **Opens on the tension number.** `progress` is now `[97, 98, 99, 100]`, and the 0→98 rush (`fillA`/`fillB`) is gone. The card blurs in already at 97%, with the bar or ring nearly full, and rolls 97→98 at 0.42 s.
- **Pulled-forward payoff.** `ticks` is `[0.42, 1.5, 2.3]`, `step` is 0.42 and `done` is 2.55. "Ready to play" lands 0.25 s after the 100 tick, and the Play state is complete by about 3.0 s. That holds for about 3.6 s, until `out` at 6.6.
- **ETA logic.** The ETA now counts 0:03 → 0:00 in real time from the entrance to the 100 tick (`etaStart: 3`). It no longer freezes while the percent moves.
- **No dead hold.** Two slow white sheens cross the ready Play pill at done+1.1 and done+2.7. The push-in keeps running underneath them.

**Ring: a real state change and a smaller slab**
- **Layout.** The ring is r 198 with a 24 px stroke (420 px box). The numerals drop from 220 to 150 px, matching Bar's 150, so both variants share one 28 / 44 / 150 scale. Card padding is 44. The card top is pinned at y 230 (transform-origin top, so the push never lifts it above 230), and it ends at about y 1072.
- **Clearance.** The status label left the ring, so only "97%" to "100%" sits inside it. The nearest glyph corner (the % top-right) measures about 43 px from the inner edge of the stroke, up from about 30.
- **Numeral size.** I used 150 rather than the critic's 176. At 176 the "100%" unit could not keep 44 px of clearance inside a r 196 ring, because its corner would sit about 17 px from the stroke.
- **The payoff stack, under the ring.**
  - A status slot: "DOWNLOADING" (28 px label) becomes "✓ Ready to play" (44 px Inter 700, white) with a drawn check.
  - The title "Grand Theft Auto VI" (44) and "Launches November 19, 2026" (28).
  - A 96 px Play pill. While downloading it sits **disabled**: a ghosted glass pill with the play glyph at 32% white. At `done` a sunset fill wipes across it left to right (0.45 s expo.out), the ink "▶ Play" rises in, and the pill pops 0.97→1 (back.out).
  - The ring itself pops 1→1.04→1 at `done` (0.1 s up, 0.3 s power3.out down) and keeps a 0.22 glow.
- **Arc maths.** The round caps add one stroke width, so the arc's drawn length is (C − stroke) × pct. That makes the visible gap shrink honestly (37 px at 97, 12 px at 99) and close exactly at 100. Once the fill passes 99.9 the dash is removed, so the closed ring has no notch where the two caps meet.
- **Plate: p06 → p01.** A card pinned at y 230 on p06 would cover Lucia's face, which sits at y 200–720 from 2 to 5 s. That is the exact problem the critic flagged. p01 (the Keys sign, then the marina, then the jet ski) is the manifest's suggested plate and has no faces in the top half. p02 is still avoided because it shows the official logo and the PS5 legal card. Both variants now share one `<video id="plateA">`.

**Bar polish**
- **Label baseline.** The "INSTALLING / ✓ READY TO PLAY" label now sits on the numeral baseline. I measured both at y 727 in the hero frame; before, the label sat about 12 px high. The absolute odometer stack can't use `align-items: last baseline`, so the offset is a measured `margin-bottom` (`--st-drop`).
- **Label tracking.** Tracked labels are now .14em (they were .26em). The "e-" pair in the kicker keeps .02em, so "PRE-LOAD" no longer reads "P R E - L O A D".
- **Tile radius.** The 136 px tile uses the 28 px system radius (it was 24).
- **Percent column.** The % column is 290 px, so "100%" and "✓ READY TO PLAY" both fit the 670 px content width.

**Kept from round 1 (deliberate):** the neutral unbranded UI, one sunset accent, Bar's bar-grows-into-Play payoff, the odometer roll, the smoked-glass Bar card versus the ink-navy Ring card, the white check and the deterministic progress model.

## Round 3
The critic scored Bar 7 and Ring 6, and picked ours in both blind pairs. Biggest gap: it read as a generic app-store widget on dimmed footage, not a believable "it's actually installing" moment. The payoff landed at 2.6 s and the same card then idled for about 4 s with only a sheen.

**Defects fixed**
- **Odometer stubs.** The digits now roll inside a soft-masked slot: `mask-image: linear-gradient(transparent 0, #000 13%, #000 87%, transparent)`. The line pitch is taller than the glyphs: 216 px for the 190 px Bar numeral and 206 px for the 180 px Ring numeral. I measured the glyph box (Barlow 800 at 190 px: cap top 49 px and baseline 184 px inside the 216 line), so the static numeral sits fully inside the opaque band.
  - I used 13% / 216 rather than the critic's 16% / 170. At 170 px the 190 px digits' tops would sit inside the fade and look washed out at rest.
  - The outgoing value also fades out in 0.05 s and the incoming one fades in over 0.12 s. The roll is 0.36 s expo.out. By the second frame after a tick, nothing of the old value is left.
- **% sign.** The % is out of the rolling stack: it is a static 44 px glyph whose top is aligned to the digits' cap top (measured offset, 40 px). The slot's width tweens with the value, so when 100 needs a third digit, the % slides over instead of duplicating.
- **Status double exposure.** The ready label now starts at `done + 0.16`, after the 0.15 s fade of "Installing" / "Downloading" has finished. The check draws from `done + 0.22`. In the Bar, the meta row fades out before the bar starts to grow, so the button never overlaps the speed and ETA text.

**Biggest gap: a second beat and a screen-recording feel (both variants)**
- **A cursor.** A plain generic arrow (our own SVG, white with a 1.5 px ink edge and a soft shadow) is on screen from the entrance. The reference sells the hook with a live cursor parked next to the bar, and this does the same: the arrow idles with a few px of deterministic hand drift (a sum of sines) while the download finishes.
- **The click.** After 100% the cursor glides on a shallow arc onto Play (2.85 → 3.4 s, power3.inOut), and the button takes a hover state. At `T.click` = 3.65 s (done + 1.2, as the critic suggested) the button presses 1 → 0.96 → 1 over 0.18 s with power2, and the cursor dips with it. The label then becomes a spinner plus "Launching…".
- **Shorter piece.** The piece is now 5.2 s instead of 7.0, with `out` at 4.8 s, so nothing idles. The sheens are gone, because the click is the second beat.
- **Ticks.** The ticks tightened a little, to 0.42 / 1.4 / 2.2 s, with done at 2.45 s.

**Bar**
- **Glass.** The smoke is now `rgba(14,14,20,.86)` with `saturate(1.1)` (was .74 / 1.4). It no longer goes milky on the daylight Keys shot or blotchy on the boatyard, and the `bg:none` export is a deep see-through tint.
- **Bigger.**
  - The bar is now 24 px (was 16), and a bright white leading edge rides the end of the fill, so each tick visibly moves it.
  - The numeral is 190 px (was 150), inside DESIGN's 180–360 hero range.
  - The type scale is now 28 / 44 / 190.
- **Tile.** The flat plum tile is now the DESIGN "soft sunset card backdrop" (`#9C7AA8 → #D689A1 → #FAA08D → #FCB680 → #FFC88F`), with "GTA 6" in ink-navy `#1F202B` Barlow 800. That gradient is a pale backdrop, not the pink→amber accent, so the bar or button is still the frame's one accent.
- **Status label.** It is absolutely positioned so its cap baseline sits on the numeral baseline (top 157 px = baseline 184 − 27).

**Ring**
- **One accent.** `#ringGlow` is removed. The ring arc is the only sunset element.
- **Play pill.** The pill no longer wipes left to right with sunset, which read as a second download. It now lights up as a **solid paper-white** pill with ink "▶ Play": a 0.22 s opacity crossfade plus a 0.97 → 1 settle.
  - I chose white over the critic's sunset crossfade, so the ring stays the only gradient in the frame (critique: "the ring, glow and pill all carry the gradient at once").
  - It also extends the round-1 decision that "done" is white (the white check).
  - Hover is a 5% ink tint on the white.
- **Less like a fitness app.** The four centred text lines are gone. The title and date moved into a left-aligned launcher header with the same soft-sunset "GTA 6" tile as the Bar (a 136 px tile, then title 44 and date 28). Only the status line under the ring is centred.
- **Ring and numeral.** The ring is now r 210 with a 24 px stroke (444 px box), and the numeral is 180 px (was 150). The digits are optically centred (−9 px) and nudged 12 px right to balance the %. The corner of "100%" clears the stroke's inner edge by about 40 px.
- **Card size.** The card is 925 px tall, from y 230 to 1155, and about 1178 at the end of the push-in.

**Kept (deliberate):**
- the neutral unbranded UI, one sunset accent and the white check;
- Bar's bar-grows-into-Play payoff;
- the smoked-glass Bar card versus the ink-navy Ring card;
- the plate p01 (no faces in the top half; p02 still avoided because of its official logo and the PS5 legal card);
- the 1.025 push-in, the deterministic progress model, and the ETA counting down to the 100 tick;
- the 766 px cards inside the safe zone. The cursor's furthest point is x 837, inside the 936 edge.

**Checked on the round-3 renders:**
- The hero frame at 3.5 s shows both variants at 100%, "Ready to play", and the cursor on Play.
- In the roll frames at 2.2–2.33 s there are no hard-clipped stubs, and the second frame after the tick is clean.
- There is no label double exposure at 2.45–2.6 s.
- The `bg:none` card renders on alpha.
- The type is Inter / Barlow Condensed / JetBrains Mono, with no fallback.

## Polish round 4
The critic scored Bar 7 and Ring 6, listed no defects, and picked ours in both blind pairs. Biggest gap: the payoff was underplayed and then left dead. In Bar, "Ready to play" was the smallest text on the card. In both variants, the last 1.15 s was a static "Launching…" spinner.

**Dead tail cut (both)**
- The timing now follows the critic's suggestion: `ticks [0.42, 1.3, 2.5]`, `done 2.75`, `move [3.2, 3.75]`, `click 3.95`, `out 4.6`, `end 5.0`.
- 99 is now held longest (1.3 → 2.5 s), so the time goes into the 99→100 tension instead of the idle spinner.
- After the click there is a 0.65 s "Launching…" hold before the 0.36 s fade.
- The piece is now 5.0 s. `data-duration` on `#root`, `#plateA` and `#ov` is updated.

**Bar: the payoff is the loudest line**
- "Ready to play" is now Inter 700, 44 px, sentence case, with a 40 px drawn check. It replaces the 28 px tracked caps.
- It sits left-aligned in the empty block left of the numeral, with its baseline on the numeral baseline. The offset is measured: `#barSt1 top -15px` = 184 − 157 − 42.
- In the render there is about 33 px between "play" and the "1".
- "INSTALLING" stays as the 28 px tracked label while it installs, so the swap reads as a step up in size.

**Date line no longer contradicts Play (both)**
- New `subDone` CONFIG field: at `done` the date line ("Unlocks Nov 19, 2026" / "Launches November 19, 2026") crossfades to "Available now". It uses the same 0.15 s out and done+0.16 in as the status label, so there is no double exposure.

**% tighter (both)**
- The `%` margin went from 8 to 2 px (`--pc-ml`). The visible gap to the last digit is now about 12 px, down from about 18, and its top still sits on the digits' cap top.

**Ring (scored 6): material, readable state, a little less slab**
- **Glass.**
  - The panel is now `rgba(31,32,43,.86)` with `backdrop-filter: blur(20px) saturate(1.4)` and an inset `0 1px 0 rgba(255,255,255,.14)` highlight.
  - It is still ink-navy, so it stays distinct from Bar's near-black smoke.
  - With `bg:none` the card exports at 86% alpha on a transparent background. I checked this on a frame: the corners have alpha 0 and the card has alpha 219.
- **Readable state.**
  - "DOWNLOADING" (28 px tracked caps) is now "Downloading · 0:03 left": Inter 500, 44 px, white at 66%, with the time in JetBrains Mono. The ETA counts down to 0:00 as the last tick lands (`etaStart: 3`).
  - It sits in the same 44 px slot as "Ready to play", so the swap is a clean like-for-like.
  - I used 44 rather than the critic's 34. 34 would make a fourth type size in the frame (28 / 44 / 180 is the scale), and DESIGN allows three.
- **Size.**
  - The ring went from r 210 / 24 stroke to r 202 / 22 (a 426 px box). The padding went from 44 to 40, the rule margins from 32/30 to 28/24, and the status and pill margins from 20/24 to 16/20.
  - The card is now 883 px tall (y 230–1113, about 1135 at full push), down from 925 (about 1178).
  - I did not go to the critic's r 170. The 180 px numeral is DESIGN's hero-numeral floor (180–360), and "100%" would no longer clear a 160 px inner radius. Getting there would mean a numeral of about 145 px, which reverses round 3.
- **Numeral nudge.** The "100%" unit is now centred with a 6 px optical nudge (was 12, because the tighter % made the unit narrower). In the render, the "1" and the "%" each clear the stroke by roughly 30–45 px.
- **Cursor.** The rest and click points are updated for the new layout: `rest [640, 560]`, `click [576, 800]`.

**Not taken (deliberate)**
- **Tile kept on the soft-sunset backdrop.** The critic asked for a navy tile with white "GTA 6" in Bar. Round 3 chose the soft-sunset backdrop on purpose: it is DESIGN's pale "card backdrop" gradient, not the pink→amber accent. On the near-black smoke, a #1F202B tile would read as an empty placeholder square. The bar/button (Bar) and the arc (Ring) are still the only pink→amber objects.

**Housekeeping**
- `#barCta` and `#barCta2` carry `data-layout-allow-overflow`. Their 8 px rise inside the clipped button is intentional, and the check's layout section is now clean (0 infos).

**Checked on the round-4 renders**
- **Hero (3.85 s).** Both variants show 100%, "Ready to play", "Available now" and the cursor hovering Play.
- **Ready swap.** At 2.85 and 2.95 s, "Installing" / "Downloading" is fading out and the 44 px ready line is coming in. There is no overlap, and the check draws from 2.97 s.
- **Ring status.** At 0.25 and 1.9 s, "Downloading · 0:03 / 0:01 left" is readable.
- **Tail.** "Launching…" shows at 4.05 and 4.4 s. The card is clear at 4.94 s, so the loop is clean.
- **Plate and fonts.** The plate moves in every strip frame. The fonts are Inter, Barlow Condensed and JetBrains Mono, with no fallback. The check still prints the Barlow "no @font-face" warning, which is a known false positive: fonts.css declares Barlow.

## Polish round 5
The critic scored Bar 7 and Ring 6, listed no defects, and picked ours in both blind pairs. Biggest gap: the card was clean but frozen and generic. The fill and ring sat still through the 98/99 holds, the jump to 100 had no impact, and a mouse cursor put a console-only game on a PC launcher.

**The cursor is gone (a facts problem, so the round-3 decision is reversed)**
- FACTS.md says GTA 6 launches on PS5 and Xbox Series X|S only. A mouse arrow clicking Play implies PC, so the cursor now defaults to `cursor.show: false` in both variants. The code stays as an opt-in for a future PC edit. The Ring rest point moved to [650, 850], inside the card, so it can never float in the empty space beside the ring again.
- The click is now a controller-style press at `T.click` 4.36 s:
  - Play scales 1 → 0.96 → 1 over 140 ms (0.06 s power2.in, then 0.08 s power2.out).
  - An inner highlight flashes with it: in Bar, a white 14% fill with a 2 px white inset edge; in Ring, an 8% ink tint with a 2 px ink inset edge.
  - I used 2 px rather than the critic's 1 px, because at 1080 a 1 px edge is a third of a pixel on a phone.
- The hover state is removed, since nothing hovers on a console. `#barHover` and `#pillHover` are deleted.

**Live holds (both)**
- **Bar.**
  - `#barShine`, a 140 px band (rgba white 0 → .35 → 0), crosses the filled part of the bar every 0.9 s (`timing.live`) with power1.inOut. It is clipped by the fill, so it never runs onto the empty track.
  - The leading-edge glow (`#barTip`) breathes between .6 and 1 opacity at 1.2 Hz.
- **Ring.** `#ringComet`, a 24° conic band masked to the stroke annulus (r 187–213), runs from 12 o'clock to the arc's end on the same 0.9 s cycle.
- **Shared rules.**
  - Both are pure functions of time inside `render()`. Each pass fades in and out over 14% of its cycle, and the whole effect fades out by the 100 tick plus 0.16 s.
  - Checked on the round-5 frames at 1.45–2.25 s: the band and the comet are in a different place on every sampled frame.

**The 100% beat (both)**
- **Numeral slam.** At `T.done` the numeral slams 1.12 → 1 over 0.1 s (3 frames) with power3.out. In Bar it is `#barPct`; in Ring it is the new `#ringInner`, which slams inside the existing 1.04 ring pop.
  - On the first capture the slam was invisible, because 2.75 s falls between two 30 fps frames, so the peak was never rendered.
  - The slam now starts on a frame boundary (`Math.round(done × 30) / 30 − 0.001`). Frame 83 shows the enlarged "100" in both renders.
- **Light sweep (0.35 s).**
  - Bar: `#barSweep`, a 240 px warm-white band (.62), crosses the bar just as it starts to thicken into Play.
  - Ring: `#ringSweep`, a 120° warm-white conic band, laps the closed ring once.
- **Check.** It now draws in 0.25 s (was 0.35).
- **Kicker (Bar).** It now swaps from PRE-LOAD to **INSTALLED** on the same beat as "Available now". This uses the new `kickerDone` CONFIG field and the same 0.15 s out / done+0.16 in as the date line, so there is no double exposure. The two kickers stack in one grid cell.

**Ending (both)**
- **Launching… removed.** The "Launching…" face, its spinner and the `launching` CONFIG field are gone.
- **Ready hold.** It runs from 2.75 to 4.36 s. At 3.45 s (`timing.glint`) it gets one sheen across the Play button (Bar, 0.7 s) or one glint lap of the ring (Ring, 0.9 s), so it is never static.
- **Exit.** Play is pressed at 4.36 s, then at 4.55 s the card drops away: scale 1 → 0.97 and opacity to 0 over 0.35 s with expo.in, as the critic specified. In the render, the card holds until about 4.8 s and is gone by about 4.9 s. The plate runs on to 5.0 s.

**Ring (scored 6): its own parts, not stock widget parts**
- **Disabled pill removed.** The greyed-out Play pill with its 32% label is gone. During the download the slot is only a faint empty track (`#pillTrack`: white at 3.5% with a 1 px hairline at 8%, no label and no icon).
- **Pill lights up faster.** At done the paper pill now lights in 0.07 s (was 0.22). In the first round-5 capture, four frames of half-faded white read as a grey disabled button. Now only one transitional frame remains (frame 85). The ink "▶ Play" label follows at done+0.13.
- **Thicker ring.** The stroke is now 26 px (was 22), at r 200 (was 202), so the 426 px box and the card size are unchanged. The 1–3% gap at 12 o'clock is now a clear notch at 99% at phone size. The inner edge of the stroke moved from r 191 to r 187. "100%" still clears it at rest, and at the 1.12 slam peak.

**Not taken (deliberate)**
- **Tile.** It stays on the soft-sunset backdrop with ink "GTA 6". The round-2 critic asked for this backdrop, because the flat tile read as a placeholder. The round-3 and round-4 critics asked for navy, and round 4 declined. DESIGN lists the soft sunset as its own pale "card backdrop" palette, separate from the pink→amber accent. Reversing it again would be a third flip.
- **Teal check.** The check stays white, as decided in round 1 to keep the frame at one accent. A teal check next to the sunset tile and the sunset bar or ring would be a third colour. The slam and the light sweep now carry the impact the critic wanted from it.

**Housekeeping**
- `#barShine` and `#barSweep` carry `data-layout-allow-overflow`, because they travel outside their clipped containers on purpose. The layout check is clean (0 issues).
- Header comment and README updated. The keywords drop "mouse cursor click" and "screen recording".

**Checked on the round-5 renders**
- **Hero (3.35 s).** Both variants show "100%", "Ready to play", "Available now" and Play with no cursor. Bar shows INSTALLED.
- **99 hold (1.45–2.25 s).** The highlight and comet move on every sampled frame.
- **100 beat (frames 81–88).** Slam on frame 83, the sweep on frames 83–88, no label double exposure, and one transitional pill frame in Ring.
- **Press (4.40–4.43 s).** The button is visibly smaller with the flash.
- **Exit.** The card is gone by about 4.87–4.9 s.
- **Transparent export.** With `bg:none`, the Ring frame at 1.8 s has alpha 0 at the corners, the card at alpha 222 and the ring at 255.
- **Fonts.** Inter, Barlow Condensed and JetBrains Mono, with no fallback.
