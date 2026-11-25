# Decisions: 25 · Trailer views race

(Later rounds are further down. Where a later round supersedes an earlier one, the later round wins.)

## Round 1
**References.**
- `map-plate-title-stat-label/57gT-69DeHE-*` (Horizon map-size video): a white bold title with a single coloured stat under it, one number per item, labels riding with their object.
- `stat-callout-arrow/xjJpat61z9o-20`: a giant number as the payoff ("3 MILLION").
- `hud-character-switcher-stat-bars/VrX0-5DdK-s-4`: the GTA-flavoured stat-bar language, with label-above-bar rows and a single neon fill colour.
- `official-type/` (PS5/Rockstar sunset cards): one confident white type line, the sunset gradient on one element, generous air.

We kept the formats those creators prove (labelled bars, giant number), but cleaned them up:
- tabular condensed numerals;
- one accent per frame;
- glass instead of strokes;
- real, sourced numbers with an as-of line.

**Facts.** All numbers come from `research/gta6/FACTS.md` (Rockstar Games YouTube channel, 2026-11-18). The values are Trailer 1 305.4M (Dec 2023), Trailer 2 189.6M (May 2025) and Launch Trailer 82.0M (Oct 2026). The margin 115.8M is computed (305.4 − 189.6). There are no logos, and "GTA 6" is set in Inter.

**Key decisions.**
- **A race, not three separate count-ups.** One shared value drives every row (each clamps at its own total). Both variants therefore read as a race: the smallest locks first, and the leader keeps going. A lock pop (scale 1.1 → 1, 0.32 s) marks each finish. We used `power1.out` so there's no dead "0.0M" hold at the start, and the leader settles into its total.
- **One accent.** The sunset gradient (#F84FA4 → #FE8E4E → #FEB747) sits only on the leader: its bar in v0, its numeral in v1. In v1 the leader stays white during the race and the gradient sweeps across it only when it wins, so the colour means "winner". Losers dim to about 62–66% at the finish so one thing leads the eye.
- **Type.**
  - v0 uses 3 sizes: 28 (eyebrow, dates, footer), 52 (Barlow 800 labels and values), 72 (Inter 800 title).
  - v1 uses 3 sizes: 28, 52 and 248 (Barlow 900 hero numerals).
  - Numerals are tabular. In v1 each numeral sits right-aligned in a fixed box measured from the final values, so the "M" stays put while the digits roll.
- **Material.**
  - v0 is a smoked-glass card: 864 px wide (80% of the frame), radius 36, a 1 px inner highlight and hairline, and a contact plus a soft shadow.
  - v1 has no card: white type with layered drop-shadow filters over a soft radial scrim. The VS chip and the margin pill are small glass objects.
  - The leader's gradient is fixed to the track width, so it reveals pink → amber as the bar grows instead of squashing.
- **Safe zones.**
  - v0 card: x 72–936, y 500–1188.
  - v1 type block: y 330–1200, centred in x 72–936.
- **Plates.** Both suggested plates cut mid-clip. p02 cuts to the GTA VI logo at 1.87 s (a trademark risk), and p04 cuts at 4.43 s. So each variant plays one continuous shot, slowed with `data-playback-rate`:
  - v0: p04 drive-by mural, 0–4.29 s of source at 0.65×. It's dark, has police lights and suits the trailer theme.
  - v1: p06 Lucia at the gate, 2.45–5.42 s of source at 0.45×. It's the opening shot of Trailer 1, which matches the Trailer 1 number.

  Neither plate cuts under the graphic or flashes at the loop point.
- **Loop.** Clean fade by 6.5 s, end 6.6 s.
- **Determinism.** All per-frame updates go through a getter/setter tween (seek-safe). Lock times come from a numeric inverse of the race ease. Nothing is random.

**Self-check this round.** We looked at both heroes at 4.0 s, both strips and the v0 entrance. Text isn't clipped, the fonts are Inter and Barlow Condensed (no fallback), and the plates move without freezing. We changed the race ease from `sine.inOut` (about 0.5 s of static "0.0M") to `power1.out`, starting at 0.45 s.

## Round 2
The blind critic picked ours in both pairs (v0 7/10, v1 6/10). The biggest gap: one shared race clock showed false ties ("34.2M · 34.2M · 34.2M", "76.7M vs 76.7M") until 3.3 s.

**Defect fixed: footage judder.** No plate is slowed below 0.88× any more. I scene-detected every plate (threshold 0.12). Only p05 has a continuous shot long enough for a 5.0 s piece at 1.0× (0–5.03 s).
- v0 now plays p05 truck yard at 1.0×, source 0–4.97 s. That's 149 of 150 frames unique. The smoked card holds contrast on bright daylight, and the check reports 63/63 text pairs passing WCAG AA. Smoke went from .64 to .66 and blur from 20 to 22 for the brighter plate.
- v1 now plays p04 drive-by at 0.88×, source 0–4.37 s (the first cut is at 4.43 s). That's 26.4 fps of footage, above the critic's 0.85 floor. The giant type needs a dark plate, and p04's mural band sits right under it.
- Neither plate cuts under the overlay or at the loop point. Swapping plates was forced by the defect; it isn't a taste change.

**Biggest gap fixed: parallel counts, no tie frames.**
- Both variants: each value tweens 0 → its own total over 1.3 s (`power3.out`), starting at 0.30 s with a 0.08 s stagger per row.
- Bar widths are value / 305.4 the whole time, so by 0.6 s the bars already read about 143 / 64 / 16, in the right order.
- Each value fades in (0.14 s) as its own count starts, so no frame shows "0.0M" ties.
- The payoff lands at 1.66 s instead of 3.3 s.
- The race clamp and inverse-ease lock times are gone, along with the per-row lock pops (a `power3.out` tail makes a lock pop invisible).

**v0 changes.**
- The lead value is now 72 px, the title size, so v0 still has 3 sizes (28 / 52 / 72) and the winner reads as the hero, like the "3 MILLION" reference. It gets a 1.08 → 1 settle pop at the payoff.
- A payoff pill under row 1 reads "▲ +115.8M vs Trailer 2". It's 28 px Inter on a lighter glass pill (a smoke pill would vanish on a smoke card). It pops at 1.80 s with scale .86 → 1, `back.out(1.5)`, 0.3 s. Its space is reserved so nothing shifts, and it's computed from items[0] − items[1].
- Dead time removed: the composition is 5.0 s (was 6.6). The sheen sweeps exactly once (1.62–2.32 s) and is then hidden. During the hold, the card drifts up 8 px (`sine.inOut`), so the frame is never dead.
- `.date` alpha went from .52 to .66 and `.foot` from .55 to .64.

**v1 changes.**
- The loser numeral is no longer grey. 189.6M is white at .92 and 196 px (0.79× the 248 px leader), so the ranking comes from size plus the single sunset gradient on the winner. Side B no longer dims at the finish.
- The margin chip is now the payoff: 88 px tall, padding 0 40 px, radius 44. It pops at 1.86 s with scale .86 → 1, `back.out(1.5)`, 0.3 s.
- Its text is Barlow 800 caps at **52 px**, not the critic's 40 px. 52 is already the label size, so this keeps the frame to 28 / 52 plus the hero numeral pair.
- The numeral pair, 248 and 196, is one deliberate hero tier (a ranked pair). That makes 4 raw sizes, a conscious exception kept to the minimum: the critic asked for the 0.79× ratio.
- The gradient sweep starts at 1.62 s, keeping the round-1 rule "white until it wins". During the hold, the whole block pushes in slowly (scale 1 → 1.018).
- The scrim is slightly stronger (.60 / .36) for the red mural.

**Timing now (both variants).** Entrance 0.10 s → counts 0.30–1.76 s → payoff 1.62–2.16 s → hold → exit 4.60–4.95 s → end 5.0 s.

**Self-check.** I viewed both heroes at 2.4 s, both strips, the v0 entrance, the v1 first second, and the last 0.6 s of both.
- No tie frames anywhere, and nothing clipped.
- Fonts are Inter and Barlow Condensed.
- The plates move with no cut or freeze, and the loop is clean.
- The layout-check warning (sheen overflow after its sweep) was cleared: the sheen is marked as intentional overflow and hidden after it passes.
- The remaining warning is the template's nested-structure note.

## Round 3
The blind critic scored v0 7 and v1 7 and picked ours in both pairs. The biggest gap: every value stopped on the same frame, so the race had no overtake, and v0 read as an iOS-style widget whose 72 px leader was too small to be the payoff.

**Defect fixed: v1 counters were right-anchored.** The old `.num { position:absolute; right:0 }` box made "83.7M" sit about 75 px right of its centred label, then jump left at 100M.
- The numerals are now per-digit odometers inside a flex-centred wrapper, so the visible digits are always centred under the label.
- A new leading digit (crossing 10M and 100M) doesn't jump. Its cell opens from 0 to one tabular slot over 0.18 s, timed by the timeline to the moment the count reaches that place. Its digit rolls in from blank, the number re-centres smoothly, and a leading "0" never shows.
- We checked frames at 0.4, 0.6, 0.85 and 1.05 s: centred in every one.

**Biggest gap fixed: a real race with overtakes.** Every counter starts on the same gun (0.30 s), and each rank lands at its own time (`timing.lands = [1.6, 1.12, 0.95]`).
- The runners-up use `power2.out`: they surge early and land first. Launch Trailer lands at 0.95 s and Trailer 2 at 1.12 s.
- The leader uses `sine.inOut`: it starts slowest, so at 0.6 s it is last (T2 141M, LT 69M, T1 38M). It passes Launch Trailer at about 0.7 s and Trailer 2 at about 1.05 s (the 1.05 s frame shows 189.2M vs 189.5M). It then climbs alone to 305.4M at 1.6 s, where the pop, sheen and gradient wipe fire.
- This is the comeback the critic asked for, rather than literal staggered stops in which T1 leads from the start (which would show no overtake). It applies to both variants.
- Bars stay value / max the whole time, so in v0 the overtake shows as the gradient bar passing the white bars. Rows stay in final order; we didn't re-sort them, to keep one thing leading the eye.

**Odometer roll (both variants), per the craft reference `rare-animatednumbers.png`.**
- Each digit is a masked cell (24% top and bottom fade) holding a 0–9–0 strip that rolls vertically.
- Higher wheels turn only during the last tenth before a carry, like a real odometer.
- Motion blur is vertical only (an SVG `feGaussianBlur stdDeviation="0 k"`). It scales with each wheel's speed and caps at 6 px on the 248 px numerals, less on smaller ones.
- A wheel spinning faster than one digit a frame is held on a whole digit, with the blur carrying the motion. Otherwise random half-digits alias across the bars.
- The ".", the unit and every digit use fixed tabular slots, plus 1.4% tracking, because Barlow Black digits nearly touch at 248 px.
- Every font weight is now loaded explicitly before measuring. `fonts.ready` resolved before Barlow 900 was requested, and the first build measured Inter's wider digits.

**v0 changes.**
- The leader value is now **128 px** Barlow 800 (was 72), the payoff. The row label stacks over its date ("TRAILER 1 / DEC 2023"), with the date baseline on the numeral baseline, so the 128 px number has room. The other rows keep the inline date.
- The Inter 800 sentence-case title "GTA 6 trailers" is cut. The header is one wide-tracked line, "GTA 6 TRAILERS · YOUTUBE VIEWS" (Inter 600, .28em, 30 px), with the first half white and the second at .74. We used .28em rather than .3em: at .3em the line overhung the card's right padding by about 15 px.
- Tracks are now 36 px with an 18 px radius (were 24/12), so they read as racers, not progress meters.
- **Margin pill moved to the footer row** (right side, opposite "as of Nov 18, 2026"). The critic's fix was to animate the gap's height from 0 to 52 px. The HyperFrames gate rejects layout-property tweens (`gsap_non_transform_motion` on height/marginTop), so the check failed. Putting the pill in the existing footer row removes the empty 100 px hole during the race with no reflow, and the card is more compact. It pops at 1.76 s (scale .86 → 1, `back.out(1.5)`, origin right).
- Small type is one size, 30 px: header, dates, pill and footer. The frame now has 3 sizes: 30, 52 and 128. The dates and footer are at .74 alpha. The footer is shortened to "as of Nov 18, 2026"; the source now lives in the header.

**v1 changes.**
- With `bg:none` the scrim gets `.light`: centre .36, 1000 × 900 box. On a bright daylight plate, the type shadows plus the light scrim stay legible without a grey smudge. We checked the transparent render composited over p01. With the plate, it keeps .60, since the mural needs it.
- The eyebrow shows both header parts ("GTA 6 TRAILERS · YOUTUBE VIEWS", 28 px .3em), fitting x 137–866.
- Kept from round 2 (no defect named): 248/196 ranked pair, white-until-it-wins gradient, the 52 px margin chip, and plates p05/p04.

**Gate.** `hyperframes check` passes: 0 lint errors, 0 layout issues, 119/119 contrast. The odometer strips carry `data-layout-allow-overflow` and `data-layout-allow-occlusion`, because the off-digits above and below each masked cell are intentional. The remaining warnings are the template's nested-structure note, file length, and the known Barlow `@font-face` static-guard false positive (the fonts come from `fonts.css`).

**Self-check.** We viewed both heroes at 2.4 s, both strips, the v0 entrance, and 0.4–1.7 s snapshots of both variants.
- Nothing is clipped, and all type sits in x 72–936.
- No fallback fonts.
- The plates move.
- The exit fades are clean.

## Polish round 4
The blind critic scored v0 7 and v1 8 and picked ours in both pairs. The biggest gap: Trailer 2 and the Launch Trailer showed ahead of Trailer 1 until about 1.45 s in both variants, so a 0.6 s glance read the wrong winner. v0's card also went milky grey on daylight footage and read like a stock-ticker widget.

**Defect fixed: the ranking is now true on every frame.** This reverses round 3's comeback race. The critic named a concrete defect: a short-form viewer glancing at 0.4–0.6 s read Trailer 2 as the winner.
- Every counter now runs on one shared clock: `value_i(t) = total_i × power3.out((t − 0.30) / 1.50)`. All three start at 0.30 s and land together at 1.80 s, which is the payoff.
- `timing.lands`, `leadEase` and `restEase` are replaced by `timing.land` (1.8) and `timing.ease` ("power3.out").
- Checked frame by frame in the new MP4s. v0 at 0.43 s reads T1 94.9M, T2 58.9M, LT 25.5M. v1 at 0.53 s reads 150.1M vs 93.2M. Every frame from 0.30 s to 1.80 s keeps the same 305.4 : 189.6 : 82.0 ratio.

**v0: the material and the type.**
- Deeper smoke: `--smoke` went from rgba(14,14,20,.66) to rgba(20,20,28,.76), and the card's backdrop changed from `saturate(1.4)` to `saturate(1.1)`, with blur kept at 22 px. On the p05 daylight plate the card is now a dark glass, not milky grey.
- Loser rows look ranked, not disabled. At the payoff, the white fills go to .38 on a track of .08 (was .42 on .11), and labels and values go to .80 (was .62).
- One type voice: Barlow caps for numbers, Inter caps for metadata.
  - The pill now reads "+115.8M AHEAD OF TRAILER 2" in Barlow Condensed 800 caps (`gapWord` is now "ahead of").
  - The footer now reads "AS OF NOV 18, 2026" in Inter 600 caps with .12em tracking, the same style as the row dates.
- **Deviations from the critic's numbers (deliberate):**
  - The pill is 30 px, not 34 px. At 30 px, Barlow caps share a cap height with the 30 px Inter caps, and the card keeps DESIGN.md's 3 sizes (30, 52, 128). A 34 px pill would add a fourth.
  - The footer is 30 px with .12em, not 28 px with .14em, so it exactly matches v0's `.date` (the critic's stated intent) without a new size.
  - The pill's ▲ was dropped: the critic's wording has none, and "AHEAD OF" already says it. With the ▲, the caps pill and the caps footer collided at 864 px. To make room, the card's side padding went from 48 to 44 px, and the pill now has 20 px padding and 9 px gaps, leaving about 26 px of air between the footer and the pill. The sunset on the leader's bar is now sized from the measured track width in JS, so it still runs pink to amber across the full track.
- **Clean digit arrival.** In round 3 a leading cell started opening 0.06 s before its digit arrived, so for 1–2 frames a clipped sliver of the new digit showed (for example "'14.7M" and "'3.6M"). The cell now opens 0.20 s early and finishes while still blank, and the digit then rolls into a full-width slot. The values are right-aligned, so the blank opening is invisible. Checked frames 8–21: no slivers.

**v1 changes.**
- **No sideways drift.** The numerals reserve every slot from the start (`makeOdo({ reserve: true })`). The centred box is the final number's width, and an unreached leading place is blank, so nothing moves sideways as digits are gained.
  - This replaces round 3's smooth re-centring. That approach answered the round-2 defect, where the slow count left a short number off-centre for about a second.
  - On the new `power3.out` clock, the short phase is brief: T1 passes 100M at 0.49 s and T2 at 0.63 s, both while the wheels are blurred. So the fixed slot is the cleaner option. Checked frames 9–22: the "M" stays at the same x.
- **The hold is no longer static.**
  - The "+115.8M VIEWS AHEAD" chip now pops at 2.10 s (0.35 s, `back.out(1.5)` from .86).
  - One slow 1.2 s sheen crosses 305.4M at 3.0 s. It is a soft white band (peak .62) clipped to the glyphs: a third static copy of the numeral (`#numAs`) with `background-clip: text`. A seek-safe driver moves each glyph's background, so there are no layout-property tweens, and the layer is hidden outside its 3.0–4.2 s window.
- Kept `#numB` at 196 px. The critic marked the 180 px change as optional, and round 2 chose 196 px deliberately for its 0.79× ranked-pair ratio.

**Gate.** `hyperframes check` passes: 0 errors, 0 layout issues across 9 samples, 119/119 contrast. The only warnings are the template's nested-structure and file-length notes.

**Self-check (rounds/r04).** Hero time is 2.6 s, after the payoff has settled and both pills are in.
- Viewed both heroes and both strips.
- Pulled single frames from the new MP4s:
  - v0 frames 8–21 (the race, no slivers, ranking true) and frames 52–75 plus 140 (payoff, ranked dim, pill fits);
  - v1 frames 9–22 (no drift, ranking true) and frames 54–120 (gradient wipe, chip at 2.1 s, sheen visible at 3.4 and 3.7 s).
- Nothing is clipped, all type is inside x 72–936, there is no font fallback, and the plates move.
