# Decisions: 26 Stat count-up

## Round 1
**References.** `stat-callout-arrow/xjJpat61z9o-20` ("3 MILLION": red heavy italic with a white stroke and a 3D arrow; 1.7M views) proves the format: one huge number as the payoff. `feature-title-card/8L0CzL2V72c-6.5` and Rockstar's official type set the cleaner register: white caps, soft shadow, generous air, and the sunset palette. We keep the format, a giant number that reads in under a second, but drop the stroke, italic and arrow for type built on a premium editorial stat.

**Shared mechanism: a real odometer, not a text counter.**
- Each digit is its own column window. Columns roll whole turns plus their digit, with a power4-out ease, and land left → right, so the number settles the way a reel does.
- The window is cap-tight (0.9em) with an 11% mask fade top and bottom. The glyph is centred with canvas font metrics, so no sliver of the neighbouring digit shows at rest. This avoids the "detached glyph fragment" defect that the 01-clip-counter critic flagged.
- Vertical-only SVG motion blur scales with each column's analytic velocity. The fast columns read as a spinning reel and go crisp on landing.
- One getter/setter clock tween drives every column from timeline time, so the counter is seek-safe and needs no onUpdate.

**Variant 0 "Count-up"**
- Free-floating, left-aligned type at x 80, block y ≈ 590–990. Kicker "GTA 6 · TRAILER 1" in Inter 600 tracked 0.35em (Rockstar's wide caps). Numeral 305,372,086 in Barlow Condensed 900, about 200 px, auto-fitted to 850 px.
- The single accent is a sunset rule under the number. It fills as the reels roll, then a white glint passes on landing, with a 1.035 punch.
- Under the number, "views on YouTube" (Inter 800, 68 px) and the source line "Rockstar Games channel · as of Nov 18, 2026" (28 px). That makes three type sizes.
- Plate: p06 (Lucia gate) rather than the suggested p02, because p02 carries the official GTA VI logo and the launch-date card, which would compete with the stat and break the no-trademark rule in frame.
- A soft radial scrim sits behind the block only when `bg = plate`. Exported transparent overlays have no baked-in dark band.

**Variant 1 "Record badge"**
- One solid ink-navy card (#1F202B family, radius 36, contact shadow plus soft shadow, 1 px inner highlight), 760 px wide, centred.
- The card holds a hairline pill "YOUTUBE RECORD" with a stroke-drawn trophy icon, the numeral "90M+" at about 330 px, "views in 24 hours" (64 px), a hairline, and the footer "GTA 6 · Trailer 1 / Non-music video".
- The single accent is the pink→amber sunset gradient across the numeral, painted as one continuous sweep over the digit columns and the suffix.
- Motion is a stamp slam: scale 1.14→1 in 0.26 s with a 3-frame plate shake (≤ 7 px). Then 90 rolls in and lands at 1.5 s with a 1.06 punch.
- Plate: p01 (Keys sign / marina), the daylight footage the manifest suggests. The solid card stays legible on it.

**Timing.** Entrances 0.25–0.7 s. v1 lands at 1.5 s and v0 at 2.35 s. Both exit at 6.42 s (0.34 s), which leaves a clean tail so the loop works. Hero time: 3.4 s.

**Check notes.**
- The odometer cells carry `data-layout-allow-occlusion` / `-overflow`. Their off-window digits are clipped on purpose, and the column width is 4% tighter than the advance for optical tracking.
- The Barlow "no @font-face" StaticGuard line is the known false positive (it comes from fonts.css). Renders use Barlow Condensed.

## Round 2 (critic r01: v0 7, v1 6; the gap was the roll reading as torn, sliced glyphs)

**Odometer rebuilt so every frame shows whole digits (defect fix, both variants).**
- Root cause of the tearing: a cap-tight window (0.9em) with an 11% mask, an SVG vertical blur up to 11% of the cell, and up to 3 spins on power4 put most frames at random mid-cell offsets: two hard-cut half-glyphs per column.
- **Ratchet ticks.** Each column's travel still follows power3.out (critic's ease), but the digit rests crisp in its cell and snaps to the next one in a short eased tick (cubic-out, at most 0.16 s and at most 38% of that cell's time slot, fired at the end of the slot). The final tick of every column lands exactly on its land time, so the slow last ticks read as a deliberate roll into place, as in rare-animatednumbers.
- **Soft mask without fading the resting digit.** Cell pitch and window height = 1.6 × the measured digit height, mask 0 / 18% / 82% / 100%. The fade lies entirely in the empty space between digits. A resting digit is 100% opaque, and a digit in a tick fades at the window edge. This is instead of the critic's literal 24% on the old cap-tight window, which would have faded the top and bottom of every resting numeral. Layout height is unchanged (the window overhangs the row with negative margins).
- **Blur removed** (the critic asked for ≤ 2 px; zero keeps the ticks crisp).
- **Blank first cell.** Every column starts empty and rolls in, so no "00" ever sits on screen ("OOM+" defect). The leading column never shows a leading zero.
- **Count-up semantics.** Only the later-landing half of the columns takes an extra full turn, so the magnitude only ever counts up (10x → 20x → 305 million, never "394 million" on the way). New roll options: `order` ("ltr" / "rtl") and `minCells`.

**v0 Count-up**
- The roll runs 0.26 → firstLand 0.85 → lastLand 1.55. The full stat reads by 1.55 s (was 2.35).
- **Land beat:** number scale 1 → 1.06 → 1 over 0.28 s, the rule snaps from 55% to full sunset with a soft sunset bloom, the glint fires at land + 0.05 and the meta line comes in at land + 0.15.
- `maxWidth` 850 → 800, so the 1.06 punch (origin left) stays inside x ≤ 936.
- **Scrim:** the radial ellipse ("grey smudge") is replaced by a horizontal linear band, y 470–1110 with soft 20% vertical feathers, `.58 → .50 → .36 → .26` left to right. The critic's suggested `.55 → 0 at 72%` failed `hyperframes check` contrast: the check hides the glyphs and samples the plate under them, and the rightmost digits sat on sunlit fence (1.32:1). So the band keeps about 0.4 alpha under the right-hand digits. It is still only on with `bg = plate`.
- Entrances use expo.out.

**v1 Record badge**
- **Entrance:** no more 0.1 s linear fade on an empty slab. The card rises y 40 → 0 and scales .94 → 1 over 0.38 s expo.out, with opacity 0 → 1 over 0.12 s. The roll starts at 0.15, so the card arrives already showing "20M+" with the chip. Never an empty card.
- **Count by tens:** `order: "rtl"`, so the trailing 0 lands first and the leading digit counts up 10M+ → 20M+ → … → 80M+ → 90M+. It lands at 1.45 with a 1.07 punch.
- **The stamp impact moves to the land.** The 3-frame plate shake (≤ 7 px) now fires when 90 lands instead of on entrance. This keeps the round-1 "stamps slam" decision in the beat where it pays off.
- **The trophy pill is gone (SaaS grammar).** It is replaced by Rockstar date-style caps: Inter 600, 28 px, tracked .35em, with a 2 px #EE08F2 right offset and a soft magenta bloom. It matches 07-release-countdown and 12-location-card. The tracking settles .5 → .35em on entrance.
- **Card:** 840 px wide at x 96–936. That is the critic's "about 80%", kept inside the right-hand safe-zone edge instead of their 860 px at x 110–970. The background is now fully opaque (the MARINA sign no longer ghosts through). The numeral is 380 px, fitted to 728 px.
- **Footer:** centred "GTA 6 · Trailer 1 | Non-music video" with a hairline divider, not the left/right KPI layout.

**Spaced hyphen fix (defect).** `font-feature-settings: "tnum"` is removed from `#root`. It now sits only on `.odo`, and all Inter text uses `normal`, which fixes "Non - music".

**Check notes.** The Lint warning (nested element in `#ov`) is the known template one. Contrast 100% pass. The glint carries `data-layout-allow-overflow`, since it is clipped by the rule on purpose. Hero time: 2.6 s.

## Round 3 (critic r02: v0 7, v1 7; the gap was the count looking glitchy for 1.3 s and the badge never stamping)

**Odometer re-clipped to the cap box (defect: fragments spilled above and below the number line).**
- Root cause: in r02 the window was 1.6 × the digit height and overhung the row, so a digit mid-tick was drawn above the numeral (into the kicker, the rule and the YOUTUBE RECORD caps).
- The window is now the tallest digit's cap box plus 3.5% antialias bleed (`odo.pad`), with `overflow: hidden`. Nothing can render outside the number line. The reel pitch is 1.22 × the digit height, so the next digit sits off-window until it ticks.
- **The mask is per frame, not static.** The critic's literal 14% fade on a cap-tight window would fade the top and bottom of every resting digit, so the fade (up to 30%) applies only while a column moves. A resting digit is unmasked and 100% opaque.
- **Ticks sit on the 30 fps frame grid.** Each tick is 3 whole frames (quint-out) starting on a frame boundary, so a rendered frame samples a tick only at q = 0, 1/3, 2/3: positions 0, .87, .996. A column is either a whole digit or a digit seating its last 13%, slightly low and blurred. It is never a half-and-half slice ("203,1^6,_87"). Ticks shorter than 2 frames become clean flips.
- **Vertical motion blur is back (the critic asked for "masked, blurred digit motion").** It is a per-column SVG `feGaussianBlur` with stdDeviation `0 σ`. σ comes from the glyph's speed this frame (120° shutter) or from the reel's spin rate above 12 cells/s, and is capped at 5% of the digit height. Fast-phase columns read as a spinning reel. Slow-phase digits are crisp at rest.
- **Start digits (`from`).** Columns roll from a fully formed start value instead of a blank cell, so there are no empty slots. v0 starts at "000,000,000" and v1 at "60". The r02 blank-cell rule only existed to avoid "OOM+", and a filled start avoids it as well.

**v0 Count-up**
- **First frame (defect).** The whole block (kicker, a fully formed 000,000,000, rule) fades in together over 2 frames from t = 0. Frame 2 is at full opacity, and the zeros hold crisp until the roll starts at 0.12 s. There is no separate ghosted numeral fade.
- **Dead time cut.** The roll runs 0.12 → 1.1 s on a normalised expo.out (the critic's ease), and 305,372,086 is fully settled at 1.1 s (it was 1.55). "views on YouTube" is in by about 0.25 s. The land beat (punch, sunset rule snap, bloom, glint) moves to 1.1 and the meta line to 1.22.
- **Scrim defaults to `"always"` (concrete defect: bg:none had no contrast of its own).** This reverses the round-1 "no baked band in the transparent export" decision, because the critic named a real failure on daylight clips. The scrim is now a left-anchored smoke: `rgba(10,10,16)` .62 → .52 (45%) → .38 (80%) → .16 at the right edge, over y 500–1100 with 15% feathers. It does not use the critic's ".55 → 0 at 72%", which failed the contrast check in r02 because the right-hand digits sat on sunlit fence. The check passes 69/69. `"plate"` and `"off"` are still available in CONFIG.

**v1 Record badge: its own payoff (the stamp)**
- **Short roll.** Only the leading digit rolls, 60M+ → 70M+ → 80M+ → 90M+, over 0.34 → 0.8 s. The ease accelerates into the land (ease "in", p = 1.6), so the ticks speed up into the hit. The trailing 0 never moves.
- **Stamp at 0.8 s.** "90M+" slams from 1.12 to 1 over 3 frames (power3.out), a brightness flash runs from 1.45 to 1 over 0.32 s, and the footage shakes (≤ 6 px, 4 frames, plate scaled 1.6% so no edge shows). With bg:none there is no footage, so the card takes a 3-frame 6 px jolt instead.
- **No empty card.** The card arrives (0.1 s, 0.08 s fade, rise and settle) already showing the chip and a full-colour "60M+". "views in 24 hours", the hairline and the footer follow at +0.12 s, so the bottom 40% is never empty.
- **Muddy suffix (defect).** The separate suffix fade is gone. "M+" is at full opacity from the first frame and shares the one continuous pink → amber gradient painted across the whole "90M+" word.

**Hero time:** 2.6 s (both settled). **Check:** 0 errors. The lint warnings are the known template nesting warning and a new "file has 353 lines" warning. Contrast passes 69/69.
