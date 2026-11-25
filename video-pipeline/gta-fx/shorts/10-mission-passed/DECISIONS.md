# Decisions: 10 · Mission passed

## v2 concept (craft v2, from round 7; recast and relaid in round 9)
- **The one idea (unchanged since r07): the result lands on the cut, and the grade tells you which result it was.** A real-speed action shot, then a hard cut on the beat. On a pass, the cut opens into golden hour and the payout lands like a jackpot. On a fail, the cut drains the world to cold mono and only bright red survives: the police lights, the tail lights and the word.
- **Shots and cut points. Every shot plays at 1.0x; there are no slowed clips in the project.**
  - Passed: `s065-biker-plane` (the stunt, 0–1.1 s) → **cut 1.1** to `s026-sunset-pier` (golden hour, 1.1–2.6; the payout lands here at 1.55) → **cut 2.6** to `s135-skydive-city` (the leap over Vice City, 2.6–4.2) → **cut 4.2** to `s064-jetski` (the brightest, most colourful shot, 4.2–5.4).
  - Failed: `s096-police-street` in full colour (0–1.0) → **cut 1.0** to `s014-driveby-police` drained (media 0.6, 1.0–2.6) → **cut 2.6** to `s119-gameplay-shootout` drained (media 1.25, 2.6–5.4: the police SUV charges at camera, flips, and the daylight street clears).
- **Where the type sits and why.** Flush left on one optical column (every line's visible ink edge at x = 96) in the top band, y ≈ 234–494. That band is open sky or dark mass in every shot: teal sky over the biker, the canopy over the pier, the sky over the skyline, the car roof and mural, the SUV's black windshield. Heads stay below it (s065 cap ≥ 432 under a line that ends at 282; s026 faces at 710+; s135 diver ≥ 600; s064 riders below 510 until the lockup has gone). No scene line crosses a hero (s026's pole and wires start at y ≈ 490, under the payout's 460 bottom). Legibility comes from a soft top shade (plum for pass, cold ink for fail) and lift shadows. There is no rule and no card.
- **Hero size and face.**
  - Passed: one block of two lines with one hero. `MISSION PASSED` (Archivo wide 900, about 66 px, sized to the payout's measure) over **`$25,000`** (Inter 800, 216 px, tabular, Leonida sunset gradient; the currency is set at 0.42em and raised to the digit tops). Both lines are about 760 px wide (88% of the safe width). Hero to line 3.3:1.
  - Failed: `MISSION` (Archivo wide 700, 30 px, tracked .5em) / **FAILED** (Archivo wide 900, 164 px, red lit from above, about 765 px) / `The cops got there first.` (Inter 600, 40 px, sentence case: the GTA fail-screen voice). Hero to label 5.5:1.
- **The payoff hit.**
  - Passed, **1.55 s**: the count lands with a 1.07 punch, `Look.expose` (peak 1.6) peaks on the landing frame and holds 2 frames, a warm anamorphic streak (6 px core, 32 px halo, 240 px glow) holds 0.2 s and burns off, a 6 px kick, and the sheen crosses at 1.69 s.
  - Failed, **1.0 s**, on the cut: FAILED slams 1.2 → 1 out of a 12 px blur, the world drains (86% mono on the hit frame, full 2 frames later), `Look.expose` (peak 1.85) peaks on the hit frame and holds 3 frames, with a 10 px shake and a 1.04 punch-zoom.
  - No white flash and no RGB split in either variant.

## v2 round 8 (critic r07: v0 7, v1 7, no hard caps; both won the blind pick)
Fix order: defects first, then the biggest gap for each variant, then the listed fixes that fit the concept. The concept (the result on the cut; colour isolation for the fail) is unchanged.

**Defect: v0 slow-mo ghosting on the dock (2.0–4.5 s).**
- **What I found.** The r07 dock clip was already motion-compensated (`mi_mode=mci`), not blend: a fresh mci render at 0.42x came out the same size to the byte, and the dock frames in the r07 and r08 renders matched. The README's ffmpeg recipe still said `blend`, which is probably what the critic read. Zoomed in, the doubling at 0.42x is mci warping on the man's arm, plus the source's own head-turn (the woman tips her head back and her pale face reads as a second shape inside her hair). Re-rendering with mci at the same rate would have changed nothing.
- **Fix.** Less slow-mo, plus one more cut. s027 now plays at **0.6x** mci (3.0 s, 1.1–4.1 s), so only about 40% of the frames are interpolated, and they sit closer to real frames. At 4.1 s the edit cuts to **`s026-sunset-pier`** at real speed (the couple on the pier at golden hour) as the clean hand-back. The lockup is gone before that cut: the exit now starts at **3.62 s** (payout first), because s026 has faces at y 710–800 under the payout's band. I took the critic's own alternative (0.65x plus a cut to s026), adjusted so no type sits on a face.
- **Checked.** I tiled clip frames 40–99 over the figures: no doubled limbs.

**Defect: v1 doubled tail lights at the slam (1.1–1.3 s).**
- **Cause.** Same story: the r07 clip interpolated straight through the camera whip at about 0.8 s of the source, and that big motion broke the interpolation.
- **Fix.** I rebuilt the truck clip (`s055-truck-ramp.mp4`) as a **speed ramp**. Source frames 24–29 (the truck sliding in, tail light already lit) play at real speed through the slam (1.0–1.2 s), so the hit frames are real frames with nothing interpolated. From source frame 30 it ramps to 0.23x mci until the internal cut at frame 62, which it never reaches.
- **Repair.** At 0.23x, mci smeared the tail light on 22 interpolated frames, every second source pair, where the source motion is uneven. I found them with zoomed tiles of all 137 frames and replaced each with its nearest clean neighbour (a one- or two-frame hold that reads as smooth slow-mo). I also tested wider searches and other `me`, `mb_size` and `mc_mode` settings; each one fixed some pairs and broke others.

**Defect: v0 payoff chroma at 14 px (a rainbow fringe on the gradient numeral).**
- **Fix.** `Look.chroma(cash, 1.7, 0.18, {px: 4})`. The 2.7 s `Look.leak` is gone, and the cut flash drops from 0.3 to 0.2. The landing is now one light moment: the punch, the anamorphic streak, the 4 px split, and the sheen at 1.82 s, which crosses while the streak burns off.

**Biggest gap, v0: the stock four-tier stack and PASSED against the payout.**
- **Change.** The creator label (`CLIP 07 · VICE CITY`) is gone from the default. The lockup is now two beats with one hero each:
  - over the stunt, `MISSION` / **PASSED**;
  - on the cut, a single hairline draws out from the centre under the word, and the payout spins in under it at **150 px** (fitted to ≤ 700 px) as its own block, 40 px below the rule.
- **Result.** It reads like a ledger total under a result, not a fourth tier. The punch drops from 1.16 to 1.12 so the bigger figure stays inside x 72–936 at its peak.
- **Label still optional.** `label` stays in CONFIG. If a creator fills it in, it sits in the rule over shot A, blurs out on the cut, and the rule closes into one hairline as the payout takes over: the critic's "blur the label out as the cash lands".

**Biggest gap, v1: a murky first second and a dead stretch.**
- **Opening.** The shot is now **`s096-police-street`** at media 0.55: daylight Vice City, the Vice City Police car sliding through the junction, palms and blue sky. That gives the slam something vivid to drain from: full colour to cold mono on the cut. The kicker reads cleanly over the yellow building.
- **Dead stretch.** The whip past the dumpster and trees (r07 1.5–2.9 s) is gone. The truck is in every frame from the slam to the end (see the ramp above).
- **Murky hold.** The mono grade has more contrast: `failLift` 1.24 → 1.36 and `failOffset` −0.045 → −0.10. The fog stays bright, the truck becomes a dark silhouette, and the tail light is the only colour.

**Not taken**
- The critic's exact v1 recut (cut at 1.9 s to the old clip at media 2.85, tail at 0.55x). The truck section of s055 is only 1.3 s of source, so 0.55x cannot fill 1.9–5.4 s, and the old clip at 2.85 still interpolated the broken pairs. The ramp does the same job: the truck owns the hold.

**Checked in the render (r08)**
- Cuts are frame-exact:
  - v1 frame 29 is the police car and frame 30 is the drained truck with FAILED at its 1.32 blur;
  - v0 frame 33 is the dock;
  - v0 frame 123 (4.1 s) is s026, clean.
- v0 payoff at 1.70 / 1.73 / 1.77 / 1.80 / 2.0 / 2.2 s: the split is a thin fringe for about 5 frames, the streak is a fine line, and there is no rainbow.
- v0 exit from 3.6 to 4.1 s: the payout clears first, PASSED is a faint blur over the canopy by 4.07 s, and the type never touches s026's faces.
- v1 at 0.3 / 0.7 / 1.0–1.3 / 2.0 / 3.6 / 4.5 / 4.95 / 5.1 / 5.35 s: the truck is in every hold frame, the tail-light shape is intact, and everything is gone by about 5.3 s.
- The type is Archivo and Inter with no fallback. No clipped glyphs; everything sits inside x 72–936 / y 300–770.
- `hyperframes check` passes. The only contrast notes are on the payout at 3.9 s, mid-exit.

**Hero time:** 3.0 s (passed: settled payout over the dusk dock; failed: the truck centred under the word, tail light burning).

## v2 round 7 (craft-v2 redesign; replaces the v1 look)
The owner rejected v1 (rounds 1–6) as "basic, not professional or clean". It was a feathered smoked band across mid-frame on soft 1080p plates, with a condensed Barlow title. That band read as a UI strip on footage. This round rebuilds the visual design from scratch. It keeps the component's job (win sting and fail twin), its content (`+$25,000` count-up, a creator label, a fail reason) and the seek-safe techniques from v1 (driven punches, count, slam).

**What was built**
- **Footage.** New 4K shots from `assets/shots`, cut on the beat, with the old `assets/plates` gone. Each shot gets its own push (1.035 on A, 1.06 on B; the cut hides the reset). Passed gets a static `contrast(1.12) saturate(1.18)` lift on both shots, because the beach haze and the golden-hour haze both read muddy under the scrim without it (my first render looked grey-brown). `Look.install` runs last (grain .14, vignette .5) on plate renders only.
- **The fail grade is colour isolation, built as an SVG filter** (`#iso`) on `#push`. A mono matrix (Rec.709 luma × 1.24 lift, −0.045 offset for contrast, a cold 0.90/0.98/1.12 cast) sits under a red-only layer. Its mask is `alpha = 5R − 5G − 0.6B − 1.7`, which keeps saturated red (tail lights) and rejects the amber fog, the lamp and skin. The mono matrix is driven per frame (`Look.drive`) from identity to full over 0.18 s starting on the hit frame, so the drain is seek-safe. Before the hit the filter is `none`. This makes v1 clearly different from #09 Wasted stamp, which is letterboxed, fully B&W and uses a band.
- **Type.** The lockup is `MISSION` / word / rule with label / payout. The rule is two hairlines that fall off outward, with the label set in the gap. The hairlines are sized so the rule spans the hero's width, and they draw outward from the label. The label tightens its tracking (down to .14em), then its size (down to 24 px) if a creator writes a long one. The word's bloom and lift live on a wrapper (`drop-shadow`), so neither the masked reveal nor the chroma filter clips them.
- **Motion.**
  - Kicker: blur-in while tracking in from .95em to .62em, then a slow drift out through the hold.
  - Passed word: a masked char rise (34 ms stagger).
  - Failed word: a slam on the cut.
  - Label: blur-in with tracking.
  - Payout: rises with motion blur on the cut and counts with power2.out.
  - Hold: the word breathes 1 to 1.018; a warm leak at 0.3 crosses 2.7–4.5 s (passed only).
  - Exit: a staggered bottom-up blur-out at 4.8 s; the scrim lifts and the clean footage plays to 5.4 s.
- **Seek safety (kept from v1).** The punch, slam, count, drain and tracking are all `Look.drive`, so seeking back always restores the resting state. The reveal masks open (`overflow: visible`) after the rise, so the hold breathing can never crop a glyph.

**Fixed inside this round (my own frame checks)**
- **Smoke and wing-walker behind the payout.** The first build counted the payout over shot A. From 0.9 to 1.4 s the pink smoke and the man on the wing sat right behind the pink-orange figure (pink on pink, a figure behind a number). Now the payout enters **on the cut**, so it only ever sits on golden-hour sky. Shot A only carries the kicker, the word and the rule, which hold up over the smoke (white heavy type with a dark lift). The payoff moved from the cut to the landing 0.6 s later, like a jackpot reel: cut, spin, land.
- **Muddy golden hour.** I tinted the scrim plum and added the passed grade lift (above).
- **Amber end of the payout on the orange cloud.** I added a soft plum halo to the payout's drop-shadow stack and tightened the warm glow.
- **Washed hit frame (v1).** The flash came down from .5 to .42, because the fog under the lamp is already bright once drained.
- **Length.** Now 5.4 s (was 5.6). The 4.3 s s027 slow clip has to cover the passed hold from the 1.1 s cut without freezing. I checked the last frame: media 4.27 of 4.30.

**Checked in the render**
- Entrance frames at 0.1, 0.4, 0.95, 1.0, 1.05 and 1.2 s; payoff frames at 1.72 and 2.0 s; hold frames at 3.4 and 4.6 s; exit frames at 4.95–5.35 s.
- Everything is gone by about 5.25 s, with no ghost.
- No clipped glyphs, and everything is inside x 72–936 / y 300–770.
- The type is Archivo and Inter, with no fallback.
- No face is covered.
- The `check` contrast notes are only at 5.1 s, mid exit.

**Known**
- The dock shot's string lights cross behind the lockup (a wire and two bulbs). They're part of the image and read as warm bokeh at phone size. I kept them rather than blur the sky behind the type, because a frosted region was the v1 complaint.

**Hero time:** 3.4 s (passed: settled payout over dusk; failed: the red tail light in the drained fog under the word).

---

# v1 history (rounds 1–6, the rejected look; kept for content, facts and seek-safety lessons)
## Round 1

### Structure: GTA's result band, cleaned up
- **Reference:** `research/gta6/refs/wasted-screen/Xfk0zviSStA-118.png` (GTA V result screen: desaturated frame, dark translucent band across y 39–58%, coloured word centred) and analysis-2 row "WASTED screen". The win sting keeps that proven format: one full-width band, one big word, everything centred.
- The band is full-bleed smoked glass (`rgba(12,12,18,.66)` + `backdrop-filter: blur(22px)`), feathered with an eased mask over the outer ~12% so it has no visible ramp edge, with a 1 px top hairline (`rgba(255,255,255,.2)`) for material. Its height is measured from the content stack, so the band always wraps the content exactly (92 px padding).
- Centred on y 900 so the whole block (y ~605–1195) sits in the safe box and above the caption zone.

### Type
- Title: Barlow Condensed 900 caps, 128 px, tracking .035em, auto-fit to 790 px (73% of width). No Pricedown (trademark rule); the condensed black weight carries the GTA "stamp" feel.
- Sub-line and labels: Inter 600 caps tracked .32em, the Rockstar "PRESENTS" wide-tracked style from `official-type/`.
- Cash: Barlow Condensed 800, 104 px, white with the soft type shadow, like the in-game HUD money in `hud-mission-objective-money-minimap/VrX0-5DdK-s-1.png` (white condensed `$12,500`).
- Exactly 3 sizes per frame: 128 / 104 / 30 (variant 1: 128 / 30).

### Colour: one accent per frame
- Passed: the pink→amber Leonida sunset (`#F84FA4 → #FE8E4E → #FEB747`) fills the title only. It is the GTA 6 answer to GTA V's gold "mission passed". Everything else is white/neutral.
- Failed: police red `#FF3B3B` on the title only. Red is reserved for police/wanted states in DESIGN.md; a fail stamp is the same family (WASTED/BUSTED), and analysis-3 shows the red word is the read creators rely on.

### Motion (one thing leads at a time)
- 0.35 band opens from a hairline (scaleY, `expo.out`).
- Passed: 0.42 the title opens from its centre line (clip-path, scale 1.08→1, 0.5 s). A gentle "win" reveal, not a slam.
- Failed: 0.42 the title slams (scale 1.16→1 in 3 frames), the footage kicks 7/6/4 px and a one-frame soft-light flash, the grade drains to saturate .06 / brightness .74. This follows DESIGN.md's stamp rule.
- 0.86 sub-line rises (KitMotion `fadeUp`), 1.08 hairline draws from the centre, 1.22 label.
- Cash: odometer reels, one per digit, each a two-slot window (digit showing + digit rolling in). Right-hand reels spin further and land later (0.95–1.5 s, expo-out), then a 1.06 number pop. Reels have a fixed tabular width, so nothing shifts. Driven by `KitMotion.drive`, so it is seek-safe.
- Passed: one light sweep across the title at 3.0 s, after the cash lands.
- Failed: the retry ring fills 1.7→5.85 s like a held button, then the prompt presses. It reads as "retrying…" into the loop and keeps the hold alive.
- A 1.8% slow push on the stack through the hold, so there are no dead frames.
- 6.35 everything clears (stack fades up, band collapses to a hairline); the grade returns by 6.8. Loops cleanly at 7.0.

### Content
- Sub-lines are generic, creator-supplied captions ("Top down in Vice City", "Your cover was blown"). They use a real place from FACTS.md and no invented mission names, quotes or official claims. `$25,000` is a demo amount the creator replaces.

### Plates
- p07 convertible (passed) and p08 scuffle (failed), as the manifest suggests. The sample plates are letterboxed (1080×1536 inside 1920), so the footage wrapper is zoomed 1.25 to fill the frame (`CONFIG.plateZoom`, set to 1 for real full-frame clips). The wrapper is also 16 px oversized so the shake never shows an edge.
- Plate mode adds a soft edge scrim and a light grade (passed: brightness .9) so the band sits in shade. In `bg:"none"` the scrim, flash, shake, grade and backdrop blur are all off; the overlay is just the band and type over true transparency (checked over a green matte).

### Fixes made inside round 1
- The first odometer built a 50-digit strip per reel. The hidden digits tripped `hyperframes check` (text_occluded, contrast). It is now a two-slot window per reel: same look, clean check.
- The band first faded over 20% each side and read as a floating box; it is now full-bleed with a short eased feather.
- The grade was too dark at first (it caused near-black frames on p08); it was lifted.
- The letterbox bars on the plates were removed with the 1.25 zoom.

## Round 2 (critic r01: v0 6/10, v1 6/10)

### Defect fixed: the cash reward is now a clean count-up
- **Critique:** the odometer reels showed hard-sliced half-digits from 1.4 to 2.8 s, the last reel crawled, and at rest the reel mask faded the bottoms of the settled digits (`check` also flagged text_box_overflow / escaped_container on `#cash`).
- **Change:** the reels are gone. `#cash` is one line of solid white Barlow Condensed 800, 104 px, `tabular-nums` (the font ships `tnum`, so the figures never jitter). It counts 0 → 25,000 from 0.90 s over 0.80 s (`power3.out`, driven by `KitMotion.drive`, seek-safe), then lands at 1.70 s with a 4-frame pop: 1 frame up to 1.08, 3 frames back to 1 (`power3.out`). There is no mask and no clipping, so nothing slices.
- The row is sized to the final amount and left-anchored, so the `+$` never moves while the figures count. It only grows during the first ~4 frames (from `$0` to 5 digits), while the row is still fading in.
- **Reference:** the HUD money in `hud-mission-objective-money-minimap/VrX0-5DdK-s-1.png` (solid white condensed `$12,500`, no ornament).

### Band tightened from 5 tiers to 3
- **Critique:** about 592 px tall (31% of the frame) with title, sub, rule, label and cash; nearly twice GTA's proportion.
- **Change:** the `CASH REWARD` label and the hairline rule are cut. The payout is one line, `+$25,000`, 24 px under the sub-line (`CONFIG.reward.prefix` adds the `+`). `layout.padY` 92 → 60. The band is now about 447 px tall in v0 and about 413 px in v1 (23% / 22% of the frame, down from 31%).
- **Optical balance (found in my own r02 check):** the title's line box carries about 20 px of air above its caps, so with even padding the band was top-heavy (v1: about 93 px above the caps, 62 px below the hairline). The bottom tier now carries extra padding (cash 8 px, retry hint 22 px) and padY is 60 instead of the suggested 64, so the air above and below the type is within a few px.
- Sizes per frame are still 3: 128 / 104 / 30 (v0) and 128 / 30 / 26 (v1).

### Timing pulled in: the whole message reads by about 1.8 s
- sub 0.86 → 0.62, cash 1.36 → 0.90 (lands 1.70, pop ends 1.83), retry hint at 0.80. The rule and label beats are gone.
- The light sweep stays at 3.0 s (the critic called it well judged); it is now the one beat in the hold, after the cash has landed.

### v1: the retry pill is replaced by a hint
- **Critique:** the 92 px glass pill with a 28 px radius, an icon and a sentence-case label read as a SaaS modal button.
- **Change:** `RETRY FROM CHECKPOINT` in Inter 600 26 px caps, tracked .3em, at `rgba(255,255,255,.7)`, above a 360 × 2 px hairline (track `rgba(255,255,255,.18)`) that fills white left to right from 1.7 to 5.85 s. When it is full, the label comes up to solid white over 0.18 s (the "ready" state), then everything clears at 6.35 s. It is a hint, not a control.
- **Reference:** the wasted-screen band (`wasted-screen/Xfk0zviSStA-118.png`): one bar, one word, nothing interactive.

### v1: the title is a real stamp now
- **Critique:** the title faded from dim red to full red (opacity 0 → 1 over 0.1 s), so it read as a fade.
- **Change:** the word is at full opacity on its first frame (`tl.set` at 0.42 s) and slams 1.12 → 1 over 0.1 s with `power3.out`. The footage kick (7 / 6 / 4 px) and the one-frame soft-light flash now start on the next frame (0.453 s), when the scale has nearly landed, so the hit and the shake are in sync.

### Footage: no zoom
- **Critique:** `plateZoom` 1.25 assumed letterbox bars the plates no longer have, so the footage played upscaled and soft.
- **Change:** `plateZoom` is removed. The plates play at native frame size with `object-fit: cover` and no transform. Only the fail variant keeps the 16 px overscan wrapper, because its shake would otherwise show an edge (about a 3% crop, which the critic accepted). The passed variant has no shake, so it gets the exact frame.

### Kept on purpose
- The full-width smoked band with the eased feather, the sunset gradient on the title only, the clip-open reveal for "passed", the mono drain and red title for "failed", the slow stack push and the 6.35 s clear. The critic called these good; nothing named a defect in them.

## Round 3 (critic r02: v0 7/10, v1 7/10, both won the blind pick)

### Defect fixed: no exit ghost
- **Critique:** after the type faded, the empty blurred band stayed for about 5 frames (v0 6.63–6.80 s on the fire plate, fainter in v1).
- **Change:** the band, its hairline and the type now leave in the same 0.24 s window starting at `T.out` (it was T.out + 0.04 with 0.4 s for the band and 0.32 s for the type). The band's opacity runs slightly ahead (0.22 s, `power1.in`), and its `backdrop-filter` blur is driven 22 px → 0 (saturate 1.25 → 1) over the same window, so there is never an empty blurred strip. Checked frame by frame from 4.7 to 5.3 s in both variants: everything is gone by about 5.13 s, with nothing left behind.

### Biggest gap: the slab is now a soft ribbon
- **Critique:** a 430 px flat slab of 66% ink with hard top and bottom edges, which read as a letterbox box.
- **Change:** `padY` 60 → 36. The fill is lowered to `rgba(12,12,18,.52)`. A vertical feather (eased: transparent at 0%, solid from 22% to 78%) is intersected with the existing horizontal feather (`mask-composite: intersect`), so the ribbon fades out in every direction and hugs the type. The bottom hairline is gone. The one hairline left is the top edge at `rgba(255,255,255,.14)`. It is now its own element (`#rail`) beside the band, because the band's vertical mask would otherwise erase it, and it travels out from the centre line with the band as it opens and back as it closes. The ribbon is now about 375 px tall in v0 and 345 px in v1 (it was about 447 / 413).
- **Reference:** the GTA V result band in `wasted-screen/Xfk0zviSStA-118.png`, a translucent strip that sits in the footage rather than on top of it.

### Hierarchy: one hero
- **Critique:** the 128 px Black title and the 104 px ExtraBold cash line both carried hero weight.
- **Change:** the cash is now Barlow Condensed **700, 84 px, at 96% white** (it was 800 / 104 / 100%). The title clearly leads, and the payout reads as the reward line under it, like the white HUD money in `hud-mission-objective-money-minimap/VrX0-5DdK-s-1.png`. Sizes per frame: 128 / 84 / 30.

### Dead hold: one payoff beat, shorter hold, a breathing sub-line
- **Critique:** after the count landed at 1.70 s, only a 1.8% push and one sheen at 3.0 s happened until 6.35 s.
- **Changes:**
  - The sheen now fires at **1.72 s**, on the cash landing pop, so count, pop and sweep land as one payoff beat. It also takes 0.7 s now (it was 0.8).
  - `out` 6.35 → **4.9**, `end` 7.0 → **5.5**. The root, the plates and the overlay are all 5.5 s.
  - From 1.12 s to the clear, the sub-line tracks out slowly by +.04em (from its fitted tracking, `power1.inOut`), together with the 1.8% stack push, so the hold keeps breathing.
- I chose this over adding more ornament, because a sting should get out of the way. The message reads by 1.8 s and holds for about 3 s.

### v0 entrance: whole letters only
- **Critique:** the centre-out `clipPath` sliced letters in half for about 4 frames ("ISSION PASSE").
- **Change:** the clip is gone. The title fades in wide and settles: opacity 0 → 1, scale 1.06 → 1, and tracking .10em → .035em (with left padding to match, so it stays optically centred), over 0.32 s `expo.out`. No letter is ever cut. At its widest visible frame the word stays inside x 72–1008.

### v1 retry hint: a beat, not a loader
- **Critique:** a 360 × 2 px track filling over 4.15 s read as a web loading bar.
- **Change:** the track now fills over **1.2 s (1.0 → 2.2 s, `power2.inOut`)**, like a held button. At 2.2 s the label snaps from 70% to solid white in 2 frames with a small 1.06 pop (1 frame up, 4 frames back), and the spent hairline fades out over 0.32 s. What is left is just the white label. That is the "pressed" beat, and nothing stays that looks like a progress widget.

### Kept on purpose
- The full-width band format, the sunset gradient on the title only, the red stamp with the 1.12 → 1 slam, the 7 px kick and the drain to mono for "failed", the count-up with its 4-frame pop, Inter tracked caps for the sub-line, and native-size footage. The critic praised these, and nothing named a defect in them.

### Known, not ours
- From about 4.85 s, the p08 sample plate cuts to a phone-video shot that has two thin horizontal lines baked into the source, at about y 640 and y 1280 (they are in `assets/plates/p08-scuffle-v.mp4` itself; checked on the raw plate at 5.3 s). They are not part of the overlay, and they don't appear when you use your own clip.

## Polish round 4 (critic r03: v0 7/10, v1 6/10, no hard defects)

The goal of this round was a clean finish, not a redesign. The concept, layout, band, type families and timing beats are unchanged.

### v1 biggest gap: the fail grade keeps the footage readable
- **Critique:** saturate .06 / brightness .74 / contrast 1.12 under a 0.85 scrim turned the night plate into a near-black slab from 1.3 to 4.6 s. The Wasted reference keeps a bright, readable B&W frame and lets only the band darken.
- **What I measured:** the critic's suggested numbers (`{ s: 0, b: 0.92, c: 1.2 }`, scrim 0.4) only lifted the mean luma of the frame at 2.6 s from 13.5 to 16.7, against 36.8 for the raw plate. CSS `contrast()` pivots at mid-grey, so on a dark plate contrast 1.2 pushes the darks down by about half. I rendered two more candidates and compared them side by side with the raw plate.
- **Change:** failed grade = **`{ s: 0, b: 1.22, c: 1.1 }`**, scrim **0.3** (it was 0.85). The footage is full B&W at about its own brightness: mean luma at 0.7 / 2.0 / 3.0 / 4.6 s is 48 / 32 / 57 / 37 (raw plate: 50 / 36 / 59 / 36; r03: 21 / 14 / 26 / 16). The smoked band is now the only thing that darkens, as in `wasted-screen/Xfk0zviSStA-118.png`. The brightness lift pays for the contrast, so it keeps some B&W punch without crushing. On a bright daytime clip the top highlights clip to white, which matches the blown-out Wasted look.
- Checked over the bright daytime opening (0.4–0.9 s): the red title and white reason line stay clear on the band, and the soft-light flash does not blow the frame.

### Lone hairline removed
- **Critique:** `#rail`, a 1 px line at rgba(255,255,255,.14), floated about 60 px above the caps at y ≈ 718 with nothing below it to close it, so it read as a stray edge.
- **Change:** `#rail` is gone (CSS, element and both tweens). The ribbon is defined only by its four-way feather, the way the reference band is just a shaded strip. This reverses part of the round 3 change, because the critic named a concrete defect.

### v1 hierarchy: two clear levels under the title
- **Critique:** the 30 px reason line and the 26 px retry line were too close in size, and once the retry label snapped to white it outranked the reason.
- **Change:** in the failed state, `#sub` (the reason, which is the joke) is **34 px at solid white**. `#hint .lab` is **22 px at 60% white**, and it **stays at 60%** after the fill: the white snap is gone. The "pressed" beat is now just the 1.06 pop (1 frame up, 4 back) and the spent hairline fading out. Sizes per frame in v1: 128 / 34 / 22. The passed sub-line is unchanged (30 px, 88% white).

### v0 payoff: the cash is the reward beat
- **Critique:** the cash was a plain 84 px number, and the payoff beat was a stock white sweep at 1.72 s that bleached "MISSI" and then "SED".
- **Change:** the title sheen is gone (the sweep layer, its drive and `timing.sheen`). The title is the sunset fill only. `#cash` is now **100 px**, solid white (it was 84 px at 96%), Barlow Condensed 700, margin-top 20 px. It keeps the count-up (0.90 → 1.70 s) and the 4-frame landing pop (1 → 1.08 → 1), so the landing is the one payoff beat. Sizes per frame in v0: 128 / 30 / 100. The title still leads at 128 px Black with the gradient; the cash is lighter (700) and white.
- Checked frame by frame from 1.6 to 2.4 s: the pop is visible at 1.733 s, and nothing passes over the title.

### Exit: 0.36 s instead of 0.24 s
- **Critique:** the 0.24 s fade at 4.9 s felt clipped next to the 0.45 s grade release, and DESIGN asks for a 0.3–0.4 s clear.
- **Change:** the stack fade, the band collapse and the band's backdrop-blur ramp now take **0.36 s**. The band's opacity takes 0.34 s, so it is gone just before the type and never leaves an empty blurred strip (the round 3 fix holds). Checked frame by frame from 4.8 to 5.4 s in both variants: everything is gone by about 5.27 s.

### Kept on purpose
- The full-width feathered smoked ribbon, the sunset gradient title with its wide-to-settled entrance, the red stamp with its slam, kick and flash, the count-up with the pop, the retry fill timing, native-size footage, and the 5.5 s loop.

### Known, not ours (unchanged)
- From about 4.87 s, the p08 sample plate cuts to a phone-video shot with two thin horizontal lines baked into the source. They are not part of the overlay.
- `hyperframes check` gives one contrast warning on `#sub` at 5.19 s. That is mid-fade during the exit (the type is at partial opacity), not a hold frame. The check passes.

## Polish round 5 (critic r04: v0 7/10, v1 7/10, both won the blind pick; one defect)

The goal was a clean finish, not a redesign. The concept, the layout, the three tiers per variant, the type families and the 5.5 s timing are unchanged. I added no new elements.

### Defect fixed: the retry hint is readable at phone size
- **Critique:** `#hint .lab` was 22 px at 60% white, under DESIGN's 24 px small-label floor. At 360×640 `RETRY FROM CHECKPOINT` was about 7 px of grey, and the 2 px track at 18% white could not be seen.
- **Change:** the label is **26 px at 80% white**. The track is **3 px (radius 1.5 px) at 34% white**, and the fill is still solid white. v1 sizes per frame are now 128 / 34 / 26. The reason line (34 px, solid white) still clearly outranks the hint, so the round 4 hierarchy holds.
- **Checked in the render:** at 1.6 s (fill in progress), scaled down to phone size, the label reads and the half-filled track is clearly visible.

### Band: shade, not frost
- **Critique:** the 22 px backdrop blur turned p07's sequins and p08's bright opening into a grey frosted rectangle behind the type.
- **Change:** `#band` is now `rgba(10,10,16,.62)` with `blur(6px) saturate(1.1)` (it was `.52` with `blur(22px) saturate(1.25)`). The exit ramp now drives the blur 6 → 0 px and the saturation 1.1 → 1 in the same 0.36 s window, so the round 3 no-ghost fix holds. The four-way feather is unchanged. The footage behind the type now reads as darkened footage, not a smear. Checked on p07 at 2.6 s and on p08's bright daytime opening at 0.5 s.
- This raises the fill that round 3 lowered (.66 → .52), but the critic named a concrete defect, and the thin blur needs the extra tint to keep the type legible. DESIGN's smoke token is .62.

### v0: the payout lands
- **Critique:** the landing was a ~3% bump, and then nothing happened.
- **Change:** the 4-frame 1.08 pop is replaced. The landing frame (frame 51, 1.70 s) shows the final `+$25,000` at **1.10×**, and it settles to 1 over **0.24 s with `power3.out`**. On the same frame, `#flash` (soft-light white, plate mode only) fires at **0.18** for 2 frames and fades out over the next 3.
- I used power3.out over 0.24 s instead of the suggested expo.out over 0.20 s. At 30 fps, expo.out is already back to 1.03 on the next frame, the same snap as the old pop. Measured in the render, the figure's width over frames 50–56 is 360 / 398 / 385 / 375 / 369 / 365 / 363 px, so the settle reads across 5 frames. Frame luma rises by about 7 on frames 51–52 (the flash), is mostly gone on frame 53 and is back to the plate by frame 54.
- The drive starts one frame early (p = 0 is the resting scale), so the landing frame itself carries the 1.10, and seeking backwards always returns scale 1.

### The hold: a real push
- **Critique:** 3.0 s of near-static hold.
- **Change:** the stack push is now **1 → 1.025 with `sine.inOut`** from the title to the clear (it was 1 → 1.018 linear). It is nearly still under the entrances and does about 80% of its travel in the 1.7–4.9 s hold. I measured the suggested 1.03 first. At 4.85 s it took the red title to x 936, exactly the safe-zone edge, so I capped it at 1.025: the title now spans x 145–934 (v1) and 148–932 (v0) at its largest.
- I did not cut the hold to start the exit at 3.9 s. The round 3 timing (the message reads by 1.8 s, holds, and clears at 4.9 s) was deliberate, and the push plus the stronger landing deal with the dead time.

### Label line: clearly a creator label
- **Critique:** "Top down in Vice City" could be read as a real GTA 6 mission name.
- **Change:** the v0 `sub` is now **"Clip 07 · Vice City"**: a clip number plus a real place from FACTS.md, plainly something the creator fills in. The README now says to use a label, not a mission-style name.

### Not taken (they would add elements)
- The 300 px hairline under the cash and the "MISSION 07" eyebrow / 520 px divider. Both are new elements. Round 4 deliberately removed a lone hairline (`#rail`), and the brief for this round was no new elements unless a defect needs one. The landing beat and the darker band carry the "object" read instead.

### Known, not ours (unchanged)
- From about 4.87 s, the p08 sample plate cuts to a phone-video shot with two thin horizontal lines baked into the source (visible in the exit frames at 5.25 s). They are not part of the overlay.
- `hyperframes check` gives one contrast warning on `#sub` at 5.19 s, mid-fade during the exit. The check passes.

## Round 6 (lead fix, after polish round 5)
- **Defect (r05 critic):** two full-width white hairlines crossed v1's exit and loop frame from about 4.8 s.
- **Cause:** not an overlay bug. p08 cuts at about 4.85 s to Trailer 2's club selfie shot, which carries the in-game phone camera's rule-of-thirds grid.
- **Fix:** `plateB` plays at `data-playback-rate` 0.87, so the 5.5 s window covers only source 0–4.79 s (the night-street shot) and never reaches the grid shot.
