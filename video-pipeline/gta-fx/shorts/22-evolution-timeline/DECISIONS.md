# Decisions: 22 Evolution timeline

## Round 1
**Reference:** `research/gta6/refs/timeline-year-column-cards` (BHmJ2JGCmpw, 3.24M views). It uses one repeated template per game, a huge year, empty future slots shown as "–", and advances one column at a time. The analysis gap lists "no item counter or progress bar in the 12–15-item evolution videos", so both variants add a counter, and the ticker adds a to-scale progress ruler. Colour and type follow `gta6/DESIGN.md`: Leonida sunset as the single accent, ink-navy for the official-style card, Barlow Condensed for years, Inter for names and labels, and JetBrains Mono for counters and axis years.

**Content:** the years and names come straight from FACTS.md ("Earlier GTA games"). The secondary detail is the computed gap since the previous game ("+13 YRS"). It is factual and it is the payoff of the format, which is why we show it instead of settings that FACTS leaves blank.

**V0 Year rail**
- Cards on a vertical rail, rather than columns panning sideways. The cyan-column format is 16:9; on 9:16 a stacked rail keeps every entry readable at once inside the safe zone.
- One accent per frame: only the ACTIVE year uses the sunset gradient. The rail fill is white.
- GTA VI payoff: an inverted white "+13 YRS" chip that lands with a 3-frame, ≤6 px impact.
- The header label and counter sit on smoked pills, so they hold on bright sky (the plate cuts to daylight at ~6 s).
- Plate: **p06-lucia-gate**, not the suggested p02. The re-cut p02 shows the official GTA VI logo from 2–6 s, behind the cards, which breaks the no-trademarks rule.

**V1 Year ticker**
- A solid ink-navy card in the upper third, so the centre of the footage stays clear. It contrasts with v0's glass.
- The year is a true odometer: one continuous value drives every digit column, and carries happen only on 9 → 0. It counts through the years in between and never shows an impossible year (an earlier build showed "2029" mid-roll).
- The odometer, ruler fill, marker and "+N YRS" bubble share one tween duration and ease. The year counts while the marker travels a to-scale ruler, so the 13-year gap reads as distance.
- Plate: p01-keys-sign (suggested). It has no logos.

**Motion:** entrances 0.3–0.5 s (expo/power3 out), one step every 0.9 s (0.40 → 5.00), the payoff held to 7.55, and a clean fade by 7.9 s so the loop works. Everything uses fromTo with immediateRender:false, or a seek-safe accessor proxy (the odometer), on one paused timeline.

## Round 2 (critic: v0 6/10, v1 7/10; both blind picks ours)
Biggest gap: v0 behaved like a web list (five skeleton rows over the footage, a stack covering y 340–1424 including the caption band); v1's roll left hard half-glyph slabs and 2026 had no landing beat.

**Defects fixed**
- **v1 digit slabs.** The critic asked for a 22%/78% fade. Applied literally to the 270 px column, it would have faded the top and bottom 40 px of every *resting* digit, because the glyph is 230 px tall with only 20 px of air. The fix keeps the 270 px layout slot but gives each column a taller **360 px visible window** (`.win`, 45 px past each edge of the slot). Its **18%/82% fade (65 px)** spans exactly the space between the glyph (measured y 360–589) and the window edge. The digit pitch is now 310 px, so a neighbour digit is never inside the window at rest. A resting digit is fully opaque; a rolling one fades to zero before it reaches the window edge, so nothing is cut hard. Only the columns that actually change in a step get a `blur(0→3px→0)` (5 px for the 13-cell GTA VI spin), timed to the roll's speed.
- **v1 blank pill.** The pill and its first label now appear in the same tween. Later labels roll through a soft-masked label window inside the pill. I also tried an overlapped crossfade, but it doubled the text ("+4 YRS" over "+5 YRS"), so I went back to a masked roll. The counter roll got the same soft mask (it also showed half-glyphs mid-roll).
- **v1 bubble padding.** The ruler is now inset 33 px at each end (24 px pill radius + 9 px pointer), and the bubble is clamped to the card's content box (x 120–888). At 2026 the pill's right edge sits exactly on the 48 px padding, and the pointer stays over the marker without touching the pill's radius. The axis years are now centred under the end ticks and still land flush with the padding.
- **v0 baseline.** Year and name sit in one `align-items: baseline` row. The reveal masks moved from `overflow:hidden` to `clip-path`, so the flex baseline still comes from the text. Measured in the hero: the year and name bottoms are within 1 px in every row (r01 was about 10 px off). The row is nudged 4 px up to the optical centre of the card.

**Biggest gap, v0**
- Deleted the `.slot/.skel` placeholder rows. Future years are previewed only as hollow 20 px rail rings (2 px, rgba(255,255,255,.35)), so the stack grows card by card over clean footage.
- The stack is out of the caption band: 112 px cards, 18 px gaps, 80 px years, 38 px names, top 340. **Six entries end at y 1102.** With more entries, the cards compress (and the type scales with them) instead of growing past 1102.
- The past/active material is now explicit rather than dimmed by opacity. Past rows use neutral glass (fill .76, `saturate(1)`, so plate colour no longer tints the 2002/2013 rows) with the year at rgba(255,255,255,.55), the name at .72 and the chip at .62. The active row is the only full-material card: #1F202B at .94 with a 1 px rgba(255,255,255,.22) inset top highlight. The header pills also moved to `saturate(1)`, to match.
- **2026 beat:** a 2 px sunset hairline sweeps around the GTA VI card (clip-path, 0.5 s expo.out), together with the existing chip impact.

**Biggest gap, v1**
- **2026 beat:** on landing, a ring halo pings out from the marker (24 → 56 px; scale expo.out, opacity power2.in over 0.4 s), the marker pops 1.25 → 1 and the bubble pops 1.18 → 1.
- Short steps now use `expo.out` over 0.45 s, instead of `power3.out` over 0.55 s. Digits lock about 0.2 s after each step, rather than drifting through a long tail. The new name enters at +0.10 s. The decision that the odometer, fill, marker and bubble share one duration and ease is kept. The GTA VI spin keeps 0.9 s `power3.inOut`, so the long gap still reads as distance.

**Kept on purpose (no defect named):** the true odometer (no impossible years), plate p06 for v0 (p02 still shows the logo), the inverted "+13 YRS" chip and its impact, Barlow/Inter/JetBrains Mono, and the ink-navy ticker card.

Hero time: **6.4 s** (all six entries in, GTA VI active, the sunset hairline drawn on v0, and v1 settled after its landing beat).

## Round 3 (critic: v0 7/10, v1 7/10; both blind picks ours)
Biggest gap: the GTA VI payoff landed no harder than earlier steps, so the 13-year jump never became a climax. Following the rare-animatednumbers reference: every rolling digit stays inside its own band, one element leads, and there is one accent.

**Defects fixed**
- **v1 digits out of their slot.** The 360 px window with a 45 px overhang is gone. Each digit column is now a **300 px slot, and the window is the slot** (`.win` top 0, height 300). Rolling digits can't reach the header row or the name line. The critic's 12%/88% on the old 270 px slot would have faded the top and bottom 12 px of every resting glyph (the 230 px glyph only had 20 px of air). So the slot grew to 300 px: the glyph rests with 35 px of air, and the 35 px fades (`#000 35px … 265px`) sit exactly in that air. Resting digits stay fully opaque. The year's top margin went from 18 to 8 px and the name line from 0 to −13 px, so the header → year → name rhythm is unchanged.
- **v1 wrong year/name pairs.** The old name now leaves at `t − 0.14 s` (0.14 s, power2.in), so it's gone before the year moves. The new name arrives at `t + dur − 0.12 s`, when the digits have settled. While the year is in transit, the name line is empty. The lit major tick for GTA VI now lights at `t + dur − 0.05 s` (it used to light before the marker arrived).
- **v0 two gradients on the last frame.** The 2026 numeral is white (`.yr-w.hi`) and has no gradient layer, so the sunset hairline is the only accent.

**Biggest gap, v0 (the payoff)**
- **2026 climbs.** The GTA VI card enters with the name hidden. Its year counts 2014 → 2026 in 0.6 s (power1.in, accelerating into the hit), through a seek-safe accessor proxy (no onUpdate). The rail fill travels to the node over the same 0.6 s with the same ease. The 13-year jump is the only step with a duration of its own.
- **Landing (all on one frame):** the row scales 1 → 1.04 (0.35 s expo.out, from its left edge), the 3-frame 6 px impact plays, the inverted "+13 YRS" chip slams in, the name rises, the node pops and the sunset hairline sweeps round the card. Rows are now 756 px wide, so the enlarged GTA VI row ends at x 934, inside the safe zone.
- **Muddy outgoing year.** The 0.3 s opacity crossfade is replaced by complementary clip-path wipes on one box (`.yr-g` inset left 0 → 100%, `.yr-w` inset right 100% → 0, 0.22 s power2.in). Every pixel is either sunset or muted grey, never a mix. `.yr-g` now spans the same box as `.yr-w` (`left:0; right:0`), so the two edges meet.
- **Blank glass slab.** The year and name masks rise at `t`, together with the card, and the card fade is now 0.25 s.
- **One left edge.** The header pills now span x 148–904, the same as the cards. The rail (x 100) is the only element outside that edge.

**Biggest gap, v1 (the payoff)**
- **The accent moves to the year.** When 2026 settles, the year punches 1.06 → 1 over 3 frames and the card shakes 6 px (3 frames). The marker, bubble and halo pop as before. At the same time, a sunset twin of the numeral (`.yg`) sweeps across 2026 from left to right, while the white odometer is clipped behind the same edge. A white layer sweeps over the ruler fill in sync, so every frame still carries exactly one gradient: the ruler during steps 1–5, the year at the climax. The twin uses the odometer's measured column widths and the resting cell's line box (top = `K.off`), and `.year` is `width:max-content`, so the two clip boxes are identical. No fringe or seam is visible in the sweep frames. This only happens when the highlighted entry is the last one.
- Pops are now written as an instant 1 → peak tween plus a settle tween. Seeking backward restores scale 1 and halo opacity 0, instead of leaving the from-values applied.
- **Legibility at 360×640:** minor ticks raised to rgba(255,255,255,.28), major ticks to .46, axis labels to .7.

**Kept on purpose:** the true odometer, the 0.9 s power3.inOut GTA VI spin, p06 for v0 (p02 still shows the logo, and every plate has a face in the upper half), the active-year sunset on v0's steps 1–5, Barlow/Inter/JetBrains Mono.

Hero time: **6.5 s** (v0 has landed at 5.6 and its hairline is drawn; v1 has landed at 5.9 and its sunset sweep is complete).
