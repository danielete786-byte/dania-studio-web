# Minimap route: decisions

## Polish round 6 (current)

**Hero time: 5.9 s.** Both variants are in their arrived state.
- **v0** shows the finished trip with the blip at x 560 and its post-arrival pulse. ARRIVED (44 px teal) sits in a clean 80 px header, with no strokes behind it.
- **v1** shows the trip down the keys with the teal ARRIVED pill, ARRIVE 6:42 PM, and DISTANCE / ETA stepped back to 62%.

Round 5 scored v0 6/10 and v1 7/10. The biggest gap: the arrival was a passive label swap (the arrow vanished, with no dock and no sweep), v0's ARRIVED was jammed against the top edge, and both maps had strokes running into the water. This round fixes all three listed defects, closes the arrival gap in both variants and takes the cheap listed fixes. The concept and layout are unchanged.

### Defects fixed
- **v0 ARRIVED jammed against the top edge.**
  - `.mm-head` is now 80 px tall with 28 px side padding. Its content is centred at y 46, so the zone name, distance and ARRIVED share one centre line.
  - ARRIVED dropped from 56 px to **44 px**, one step up from the 40 px distance. Its cap top now sits about 32 px below the panel edge, where it was about 14 px.
  - Header band: every map stroke (shore, roads, blocks) now sits in its own layer (`#mmLines`) under a gradient mask, `#mmHeadFade`. Strokes are invisible above y 56 and back to full by y 100, so no coastline or street crosses the zone name or ARRIVED.
  - The water fill is not faded. ARRIVED keeps the dark bay behind it for contrast, and the header doesn't become a band.
- **v1 orphan stroke in the water, and highway past the coast.**
  - The north causeway (`M 690 24 L 728 24`) is gone.
  - The Grassrivers expressway sits in a group clipped to the mainland (`#gcLand`), so it stops at the coast instead of running on to the barrier island.
  - The Vice City grid was already clipped to the land and the city outline.
- **v0 pier stubs crossing the coastline.** The four marina piers are removed. The three major roads are now clipped to the land too (`#mmLand`), so the A1 avenue's round cap no longer pokes past the shore.
- **Verified** in single frames from r06 MP4s:
  - The v1 hero has nothing in the water at the top right, and the expressway ends at the coast.
  - The v0 hero and the 4.5 to 5.0 s frames show no stubs by the blip.
  - The header crop at 5.9 s shows ARRIVED with about 32 px of clearance and no strokes behind it.

### Arrival payoff (biggest gap, both variants)
All of these fire on the contact frame (v0 4.6 s, v1 5.2 s).
- **The arrow docks instead of vanishing.**
  - The arrow is now drawn *under* the blip. On contact it slides the last 38 px (v1: 34 px) into the blip's centre over 0.25 s on power3.out and shrinks to 0.6, so it disappears beneath the popped blip.
  - In v0 the map stops at contact and the arrow moves into the blip. Until then the arrow is still fixed while the map pans, a deliberate earlier decision.
  - The v0 arrow now lives in map coordinates (`#mmTop`, the same pan transform as the map), which gives the same on-screen position while driving.
  - The bright route ahead of the arrow is consumed as it docks.
  - This keeps the round-4 defect fixed: the arrow never sits on top of the blip.
  - Checked frame by frame: the arrow is under the blip from the first frame after contact and fully hidden within 3 to 4 frames.
- **One ring.** The arrival burst follows the critic's spec. Its radius (r+10) scales 1 → 2.4 while opacity falls .9 → 0 over **0.5 s** (it was r+10 → r+70 over 0.4 s). The stroke thins from 4 to 1.5. `drawBlip` takes `scale` in place of `grow`.
- **A sweep along the finished route.** A white highlight (an 80 px streak at .6) runs from the start of the trip into the blip over **0.35 s** (sine in-out).
  - v0 uses a new `sweep` path. v1 reuses its pre-drive sweep path in a second time window.
  - It passes under the blip at the end, so it lands on the destination.
  - CONFIG `doneSweep` sets its length.
- **v1 pill** still pops (scale .86 → 1, back.out(1.5)) on the same frame, as in round 5.
- v0's ARRIVED slide and the single 5.75 s pulse are unchanged, as are v1's check draw and the 5.75 s pulse.

### Entrance and pacing (critique fix 4)
- **No opacity pop.** The panel or card rises y +24 → 0 and scales .96 → 1 over **0.32 s** on expo.out.
  - Opacity now runs as its own 0.32 s tween on **power2.out**: about 20% on frame 1, 37% on frame 2 and 90% around frame 7. On expo.out it had reached about 90% in 2 frames.
- **The blip arrives sooner.** It pops at 0.12 s in both variants, and the route draws from 0.2 s (v0 0.2 to 0.65 s, v1 0.2 to 0.9 s).
- **Shorter dead hold.** Both drives now use one `rampEase`: speed ramps up linearly over `ramp` (0.4 s), then holds constant into contact.
  - This replaces v0's ramp over 30% of the drive, and v1's power2.inOut, which crawled for its first ~0.6 s and braked to zero right before contact.
  - v0: the drive starts at 0.85 s, with visible motion by about 1.1 s. The hold is about 0.45 s (it was about 1 s).
  - v1: travel starts at 1.2 s, with visible motion by about 1.3 s. The hold after the draw is about 0.4 s, and the pre-drive sweep runs through it.
  - Contact times are unchanged (4.6 s and 5.2 s), so the settle, the hold and the exit keep their timing.
  - v1's DISTANCE and ETA still use the same progress as the arrow, now counting down at an even rate. v0's 0.1 MI shows for 8 frames (0.27 s).
- The critic's literal suggestion was "drive 1.4 to 5.2 s" for v0. That would have pushed v0's contact into the settle and squeezed the arrival hold. The same goal (a hold of about 0.4 s) is met by starting earlier with a quick ramp instead.

### v0 material (critique fix 5)
- **`.mm-frame` alpha .84 → .94.** Car wheels and bodies no longer show through and muddy the street grid.
- **The two keys are filled shapes with no outline.** Their 2 px leaf outlines are gone, and the ends are blunter (taper exponent .55 → .32), 2 px thicker each.
  - They stay cut out of the water, so they read in the land tone, as all land does on this map.
  - The critic's `rgba(22,52,150,.7)` was not used. It sits within a few levels of the bay colour, so the keys would have vanished.

### v1 map and stats (critique fix 6)
- **Keys.** The nine thin islets that read as a dashed shadow are gone. In their place are **four irregular islands plus the destination key**, filled `#1A2550` with no outline: one tone between land and water, so they stay quiet behind the route.
  - The islands have different lengths (44 to 120 px) and gaps, and the last gap is a long bridge.
  - Each has a low-frequency swell in its width, a drifting centre and blunt ends.
  - The road runs along each island's edge, under its casing.
  - The destination key is the largest (26 px) and straddles the road, so the blip sits on land.
- **Dimmed stats.** After arrival, DISTANCE and ETA step back to **62%** (it was 40%), so 0.0 MI and 0 MIN read as finished, not disabled. The values stay at white .62.

### Verified in the render (single frames from r06 MP4s)
- v0 from 4.50 to 5.03 s, frame by frame: the contact at 4.6 s, the arrow under the blip from 4.633 s, the ring growing and fading by 5.1 s, the sweep running from the pink start into the blip between 4.63 and 4.93 s, and ARRIVED sliding into the 80 px header.
- v1 from 5.10 to 5.63 s: the contact at 5.2 s, the arrow under the blip by 5.283 s, the ring, the sweep from Vice City down to the blip, and the pill popping.
- The first 12 frames of both variants show a gradual fade with the rise.
- The drive-start tiles from 0.6 to 1.3 s (v0) and 1.2 to 1.9 s (v1) show motion from about 1.1 s and 1.3 s.
- **Check:** passed, with 18/18 contrast passes and 0 layout issues. The 2 lint warnings (file size, nested structure) are unchanged from earlier rounds.

### Kept (deliberate)
- One sunset accent, with Vice teal only for ARRIVED.
- v0: the arrow is fixed while the map pans, north-up, with the N disc on the bottom edge, the settle (5.0 to 5.7 s, blip at x 560) and the single 5.75 s pulse.
- v1: the card type scale (26 / 56 / 100), the 3-column stat grid, the pre-drive sweep, the push, the trail and the title-row pill.
- Plates: p10 (v0) and p07 (v1). Every state is a pure function of `t`, with no `Math.random`.

## Polish round 5

**Hero time: 5.9 s.** Both variants are in their arrived state.
- **v0** shows the finished trip with the blip at x 560, the bay and headland on the right, ARRIVED in 56 px teal and the blip's post-arrival pulse.
- **v1** shows the whole trip down the chain of keys, the teal ARRIVED pill beside LEONIDA KEYS, ARRIVE 6:42 PM, and DISTANCE / ETA dimmed to 40%.

Round 4 scored v0 6/10 and v1 7/10. The biggest gap was cartography in both: v0 was a flat blue grid with a dead right quarter, and v1 had lumpy key blobs and squiggle rivers. This round fixes the one listed defect, closes v0's map gap, and takes the cheap listed fixes. The concept and layout are unchanged.

### Defect fixed (v1): ARRIVE / ARRIVED stutter
- On arrival, the ARRIVE column now keeps **6:42 PM**. It no longer swaps to ARRIVED under its own label.
- ARRIVED is now a **solid Vice-teal pill beside the title**: 44 px tall, 26 px Inter 700 ink type, tracked .2em, with a check that draws.
  - It pops in at contact with DESIGN's badge pop: scale .86 → 1 on back.out(1.5) over 0.3 s. The check draws from 0.08 to 0.33 s after contact.
  - The pill sits in a flex title row (`.gc-titlerow`), so a longer destination title pushes it instead of overlapping it.
- **0.0 MI and 0 MIN dim to 40%** between 0.1 and 0.4 s after contact, so the dead data steps back.
- The per-stat `done` field is gone. The variant has a new `arrived` field, which sets the pill text; `""` hides the pill.
- Verified in single frames from r05/v1.mp4 between 5.13 and 5.67 s:
  - The contact frame (5.20 s) reads 0.0 MI / 0 MIN / 6:42 PM.
  - The pill shows from 5.23 s and is fully in by about 5.4 s.
  - ARRIVE never sits over ARRIVED.

### v0: cartography (biggest gap)
- **Water is a feature, not leftover panel.** The bay is solid `#1E3F96` with a 2 px `rgba(255,255,255,.35)` shoreline, as the critic suggested.
- **The coast has a shape.** The shore is now a Hermite curve through 13 control points (`SH`). It runs fairly straight to the north, cuts a marina cove around the blip, then swings east into a headland in the south-east. The bottom right of the arrival frame is now land with blocks, and the top right is bay.
- **Marina detail.** Four short piers (3 px, .22) run into the cove beside the blip. Two thin tapered keys sit in the bay, built as slivers rather than ovals so they don't repeat v1's "lumpy oval" note.
- **Land texture.** There are three block districts (2 px at .10, as the critic suggested), each clipped to its own soft outline and to the land: downtown between the boulevard and the marina (26×30 pitch), the headland (28×26, rotated 9°) and the blocks south-west of the start (30×26). About 15% of segments are dropped, so they read as city blocks, not graph paper.
  - Minor streets went from .06 to .08 and now extend onto the headland.
  - The three major roads are unchanged (5 px, .28).
  - The route is still the only bright line.
- **No dead right quarter at arrival.** The settle now puts the blip at x 560 of the 820 px panel (`settleX`), where it used to be at x 590 with flat water beyond it. The trip stays centred vertically.
- **"Arrow slides across a static map."** The arrow was already fixed at (410,290) with the world panning under it. On an almost empty map that pan was invisible, so it read as a diagram. With blocks, piers, the shore and the keys moving under the arrow, the pan now reads.
  - Heading-up rotation was not added. The north-up map with the N disc on the bottom edge is a deliberate earlier decision that follows Rockstar's HUD, and rotating would mean orbiting the N disc.

### v0: motion fixes (critique fixes 5 and 6)
- **The route draws instead of fading.** The ghost no longer fades in at .5. Ghost and bright route draw together from the arrow to the blip, using stroke-dashoffset over **0.45 s power2.inOut** (0.3 to 0.75 s). The ghost then stays behind the arrow as the trail, as before.
- **No crawl on 0.1 MI.** The drive was sineIO, which crawled through its last 18%. It is now an ease where speed ramps up over the first 30% and then holds constant into contact (1.1 to 4.6 s).
  - The distance rounds **up**, matching v1. So 0.1 MI only shows for the final ~0.21 s, where the critic's target was 0.3 s or less.
- **ARRIVED slides in.** At contact it rises 22 px into place over 0.25 s on power3.out (opacity rides along). This replaces the 1.12 → 1 scale pop.
  - The slide starts one frame early (from `arrive − 1/30`). The first render had a blank header on the contact frame, since ARRIVED started at opacity 0; now that frame already shows it a third of the way in.
  - The burst ring and the single 5.75 s pulse are unchanged: a deliberate round-4 decision.
- **Re-timed to start sooner:** blip 0.15 s, draw 0.3 to 0.75 s, drive from 1.1 s, pulses at 0.8 / 2.0 / 3.2 / 5.75 s. Contact (4.6 s), settle (5.0 to 5.7 s) and exit (6.6 s) are unchanged.

### v1: map redraw (critique fix 3)
- **Keys.** The six lobed key blobs and the oval destination key are gone. There are now **nine thin islets**, 6 to 12 px thick and 36 to 64 px long. Each is built along the highway's own curve, so it rotates with the arc, with tapered tips and a drifting thickest point.
  - They alternate bay and ocean side, with inner edges 9 px or more off the route centreline (clear of the casing).
  - The destination is a longer 18 px islet the route ends on.
- **Grassrivers.** The two dark squiggle "rivers" are gone. The wetland is now a soft `rgba(130,176,146,.10)` tint plus a marsh-dash pattern (26×14 tile) at .18, both feathered through the blurred wetland mask. That gives the critic's soft texture, and the land gets some of the reference's contour feel.
- **Coast.** The mainland edge went from 1 px .22 to 1.5 px .28. Islets use 1 px .28.
- **Barrier island trimmed.** The 33 px pill reaching y 214 is now a 14 px tapered sliver ending at y 178. Its road is gone, and the causeway and expressway now end on it.

### Both: entrance
- The panel or card now starts at **0.0 s**: y +40 → 0, scale .96 → 1 and opacity 0 → 1 over **0.35 s expo.out**. This removes the 0.2 s dead lead and the opacity-only fade.

### Verified in the render (single frames from r05 MP4s)
- **v0, 4.30 to 4.83 s:**
  - 0.1 MI shows for 7 frames, about 0.23 s (it was about 0.7 s).
  - On the contact frame (4.60 s), ARRIVED is already sliding up. It is fully in by about 4.8 s, with the arrow gone by 4.73 s.
- **v0, 0 to 0.8 s:**
  - Frame 0 is empty, and from frame 1 the panel is rising and scaling.
  - The route draws from the arrow to the blip from 0.3 to 0.75 s, with no ghost fade.
- **v1, 0 to 0.5 s:** the card rises and scales from frame 1.
- **Check:** passed, with 18/18 contrast passes and 0 layout issues.

### Kept (deliberate)
- One sunset accent, with Vice teal only for ARRIVED.
- v0: the arrow is fixed while the map pans, north-up, with the N disc on the bottom edge, the arrival burst and the settle.
- v1: the card type scale (26 / 56 / 100), the 3-column stat grid, the sweep, the push and the trail.
- Plates: p10 (v0) and p07 (v1). Every state is a pure function of `t`, with no `Math.random`.

## Polish round 4

**Hero time: 5.9 s.** Both variants are in their arrived state.
- **v0** shows the finished trip centred in the flat blue panel, with a sunset trail, the blip's post-arrival pulse and ARRIVED in 56 px teal.
- **v1** shows the whole trip as a trail into the destination key, with 0.0 MI / 0 MIN / ARRIVED and the blip's pulse ring.

Round 3 scored v0 6/10 and v1 7/10. The biggest gap was that neither variant landed a payoff. This round fixes every listed defect and gives both variants a real arrival, without changing the concept or layout.

### Defects fixed
- **v0 N glyph was 18 px.** `.mm-north` is now a 40 px disc with a 24 px glyph (DESIGN's floor), centred on the panel's bottom edge at left 390, top 500.
- **v0 arrow overlapped the blip from 5.9 to 6.7 s.**
  - The drive now ends at contact: the arrow's nose (22 px) touches the blip's outline, using `GAP = 38` along the route.
  - On contact the arrow scales from 1 to 0 in 0.15 s.
  - The last bright 38 px of the route retracts into the blip, so no stub with a round cap is left behind.
  - Verified in single frames from the MP4 at 4.62, 4.70, 4.85, 5.35 and 6.30 s. The two marks touch for about 2 frames as the hit, and the arrow is a speck by 4.70 s.
- **v1 counters ran ahead of the arrow (37% vs 25%) and the trip never arrived.**
  - `travel: 0.37` is gone. The arrow drives the whole route from 1.4 to 5.2 s on power2.inOut.
  - DISTANCE and ETA are `value × (1 − progress)`, using the same progress that places the arrow, so they agree on every frame.
  - They round *up*, so nothing reads 0 until contact. Round 4's first render showed "0 MIN" at 0.5 MI, and this fixes it.

### v0: arrival beat (biggest gap, follows `uphThaa97ig-12`)
- **Timing.** `arrive` moved from 5.7 to 4.6 s. The drive runs 1.55 to 4.6 s (sineIO), straight into contact.
- **Payoff.**
  - The blip pops 1 → 1.35 → 1 in 0.3 s on back.out(1.5). `bumpScale` went from 0.1 + 0.3 s to 0.08 + 0.22 s.
  - The burst ring grows from r+10 to r+70 while its opacity falls from .9 to 0 over 0.4 s.
  - The ghost trail lifts to .75.
- **ARRIVED.** It went from 40 px Barlow 700 to 56 px Barlow 800 in Vice teal, with the layered type shadow, and still pops 1.12 → 1.
- **Arrival framing.** From 5.0 to 5.7 s (power2.inOut) the map eases so the finished trip's bounding box is centred below the header.
  - It only starts once the arrow is gone, so the deliberate "arrow fixed while the map pans" decision still holds for the whole drive.
  - This replaces the critic's re-route idea, which would have broken that decision. It answers the "right 40% is dead space at arrival" note: the trip now spans the panel's middle.
  - One pulse at 5.75 s carries the hold to the 6.6 s exit.

### v0: blueprint look removed (critique fix 3)
- **Panel.** It's flat `rgba(48,92,196,.84)`, closer to Rockstar's HUD blue. The `.mm-scrim` top shade and the inset vignette on `.mm-edge` are gone, leaving only a 1.5 px .16 hairline. Contrast check: 18/18 pass with no scrim.
- **Streets.** The minor grid is 3 px at **.06** (was .12), at doubled spacing: every other street in each fabric, and doubled steps in the angled west grid.
- **Major roads.** Only three remain: the A1 avenue (now ending at the shore), the diagonal boulevard and the expressway. Each is white .28, 5 px, with no casing. Four arterials were dropped.
- **No island band.** The barrier island, both causeways, the island road and the island cross streets are gone. East of the single shore is one water area at `rgba(14,34,104,.30)`, only a shade deeper than the panel, so it no longer reads as a dark band. The marina blip sits on that shore.

### v1: the trip arrives (critique fix 1)
- **Contact at 5.2 s.**
  - The arrow scales out in 0.15 s.
  - The blip pops 1 → 1.25 → 1, and its ring bursts from r+10 to r+64 while its opacity falls from .9 to 0 over 0.4 s.
  - ARRIVE's value changes to **ARRIVED** in Vice teal, with the unit hidden. This uses the new per-stat `done` field.
  - The card holds 1.4 s, then fades at 6.6 s over 0.35 s.
- **Trail.** The driven part stays as a muted sunset trail (.42, lifted to .72 on arrival), as in v0, so the arrival frame still shows the trip. The highlight sweep is clamped to the route ahead of the arrow.

### v1: keys and stat row (critique fixes 5 and 6)
- **Keys.**
  - The soft pill lenses and the blurred `gcSoft6` shallows are gone.
  - Each key is now a crisp irregular island: `#374055` fill, a 1 px `rgba(255,255,255,.22)` shore and no filter.
  - Each island sits *beside* the highway. Its near shore runs 10–12 px off the route centreline, just clear of the casing, and its far shore has low-frequency lobes. They alternate bay side and ocean side, and the big ones along the bottom sit on the bay side so the map's bottom edge doesn't cut them.
  - The first try used higher-frequency lobes and read as spiky splats, so it was smoothed.
  - The destination is one larger irregular island the route ends on.
- **Stat row.** It's a 3-column grid aligned left / centre / right, so ARRIVE and ARRIVED sit flush with the map's right edge. The ~130 px of dead space is gone.
  - Trailing letter-spacing is compensated, so the right-aligned label lines up with the value.
  - It's a grid rather than `space-between` so the columns don't shift while the digits count down (24.6 → 9.8).

### Kept (deliberate)
- One sunset accent, with Vice teal only for ARRIVED.
- The v0 player arrow stays fixed in the frame while it drives.
- The v1 card type scale (26 / 56 / 100), radii, sweep and slow push.
- Plates: p10 (v0) and p07 (v1).
- Every state is a pure function of `t` through `KitMotion.drive`, with no `Math.random`.

## Round 3

**Hero time: 5.8 s.** v0 has just arrived: the whole trip is on screen as a sunset trail, the blip is at the top of its 1.35 bump, the burst ring is mid-expansion and the corner reads ARRIVED in Vice teal. v1 shows the full route with the arrow 36% of the way down the keys, the stats counting down (15.9 MI / 12 MIN / 6:42 PM) and the destination's end-beat ring pulsing.

Round 2 scored v0 5/10 (lost the blind pick) and v1 7/10 (won). The biggest gap was v0: a busy white blueprint grid inside a black-titlebar window, and an arrival frame with no route on it.

### Defects fixed (v1)
- **"EXAMPLE" pill on screen.** CONFIG `tag` now defaults to `""`, so no chip renders. The honesty note moved to a CONFIG comment ("DISTANCE / ETA / ARRIVE below are EXAMPLE numbers...") and the README. If a creator wants a chip, `tag: "Route set"` shows it with a 1 px Vice-teal ring (a confirmed state, so teal is allowed).
- **Counters rolling up from 0.0 while ARRIVE already said 6:42 PM.** The roll-up is gone (`rollStart` / `rollEnd` removed). DISTANCE and ETA show 24.6 MI / 19 MIN from the entrance and only count down as the arrow drives (to 15.5 / 12), so all three stats agree from the first frame.

### v0: calm the map so the route is the only bright line (follows `uphThaa97ig-12`)
- **Roads.** Local streets went from white .30 / 4 px to .12 / 3 px. Arterials went from .80 / 9 px to .40 / 6 px, and their casing from .35 / 15 px to .20 / 10 px.
  - Each tier is drawn in solid white inside one group carrying the opacity. Crossing semi-transparent lines had been stacking into bright dots at every intersection, which made the grid look like graph paper.
- **Coast.** The jittered sine-sum shores are gone. Each shore (mainland, the island's bay side, the ocean beach) is one smooth low-frequency curve with a 1 px `rgba(255,255,255,.24)` hairline.
- **No title bar.** The opaque `rgba(14,14,20,.72)` bar is removed and the blue fills the whole 820×520 panel (base raised from .72 to .80 so it reads as Rockstar's flat blue). VICE CITY and the distance sit in white inside the top 56 px with the DESIGN.md layered shadow.
  - A soft top shade inside the blue (`rgba(6,14,44,.40)` fading to 0 over 128 px) keeps them legible over a white car. It's a gradient, not a bar. Contrast check: 19/19 pass.
- **N badge.** It shrank from 42 to 32 px and now sits centred on the panel's bottom edge, as on Rockstar's HUD, instead of straddling the bar seam.

### v0: keep the route visible on the hero frame and land the payoff
- **Route re-planned to fit the frame at both ends.** Player (330,404) north on a local street, east on the A1 avenue, a short NE run up the boulevard, then east along a kept local street to a marina blip at (690,248). Its footprint is 360×156 (was 320×290). With the arrow fixed at (410,290), the blip is in frame at the start and the route's start is in frame on arrival.
- **Ghost route is now the trail.** It shows the whole trip at .5 from the blip pop (was .34, and only the part ahead of the arrow). It stays behind the arrow as the path driven and lifts to .75 on arrival. On the hero frame the whole pink-to-amber trip is visible behind the arrow.
- **Arrival.** It moved from 5.4 to 5.7 s, so the static hold is shorter. One more ring pulse at 6.15 s carries the frame into the 6.6 s exit.
- **Payoff.** The burst ring grows from r+10 to r+70 while its stroke thins from 4 to 1 over 0.4 s (cubic out). The blip bumps from 1 to 1.35 in 0.1 s, then back to 1 on back.out(1.5). The pulse and burst rings now sit outside the blip's scaled group, so their sizes are true pixels.
- The distance floors at 0.1 MI until ARRIVED replaces it, so it never reads "0.0 MI" while the arrow is still moving.

### v1: crisp keys and an end beat (follows `hud-map-panel/d9L4dp_4cd4-6`)
- **Land and water.** Land/water went from `#2B3242` / `#101A33` to `#374055` / `#0C1430`. Every shore is a 1 px `rgba(255,255,255,.22)` hairline.
- **Coast.** The seeded midpoint offsets are gone. The mainland is a Catmull-Rom through 18 control points (was 33 plus jitter), giving one cove and one headland: a vector coast, not an ink blob.
- **Keys.** Six smooth elongated islands plus a larger destination key. Each is a tapered lens built along the highway's own curve, with no jitter. The highway runs down the middle, so land shows on both sides of the route, and the gaps read as bridges.
- **Bay islets removed.** At this size they read as pebbles.
- **City grid** uses the same group-opacity fix, so there are no bright dots at crossings.
- **End beat at 5.7 s.** The destination ring pulses (r 14 to 40, opacity .9 to 0) and the blip bumps from 1 to 1.25 and back, so the hold ends on a beat instead of just fading. The 5.0 s pulse moved there.

### Kept (deliberate, not named as defects)
- **One accent.** The Leonida sunset route, with Vice teal only for ARRIVED (and the optional ROUTE SET chip).
- **v0 player arrow fixed in the frame** while the map pans under it, as a real minimap does.
- **v1 card.** Type scale (26 / 56 / 100), 36/20 radii, the highlight sweep, `travel: 0.37`, and the slow push.
- **Seek-safe.** Every state is a pure function of `t` through one `KitMotion.drive`. `hash()` is used only for which v0 street segments are dropped. There's no `Math.random`.
- **Plates.** p10 police car (v0) and p07 convertible (v1).

## Round 2

**Hero time: 5.5 s.** v0 had just arrived (burst ring, ARRIVED). v1 had the route drawn and the arrow driving onto the keys.

### Defects fixed
- **v0 header contrast.** VICE CITY and the distance moved into a 56 px smoked top bar. This round removes that bar.
- **v0 counter direction.** The blip pops at 0.2 s and a ghost route shows the whole path at .34. The route draws over it from 0.45 to 1.3 s, and the readout counts down from 1.2 MI.
- **v0 arrival.** The arrow pulls up 24 px short of the blip, the ring bursts, and the readout reads ARRIVED in teal.
- **v1.** ARRIVE was filled from the entrance, and the counters rolled up over 0.2 to 0.8 s (replaced this round). A label mask kept streets off VICE CITY. An on-screen "EXAMPLE" tag was added (removed this round).

### Biggest gap: map art
- **v0** became a two-tier road network on a jittered coastline: 9 px arterials at .80 and 4 px local streets at .30 in three fabrics, with a park and a barrier island. Calmed this round.
- **v1** became one coastline told as a trip: Vice City grid, Grassrivers slough, bay islets, and jittered-blob keys. Redrawn this round.
- **v1 hold.** The arrow drives 37% of the route from 2.0 to 6.35 s while DISTANCE and ETA tick down.

## Round 1

**Hero time: 3.6 s.**
- **Shared.** A sunset SVG route drew from the player arrow to an amber blip.
- **v0.** A translucent blue rounded map bottom-left, with the zone name and distance floating above it.
- **v1.** A smoked-glass card: "GPS · FROM VICE CITY", a LEONIDA KEYS title, a dark map, and DISTANCE / ETA / ARRIVE.
- **Critique.** v0 read as graph paper, its counter ran upward and it had no arrival. v1's map art was crude, ARRIVE was blank and its stats were unflagged.
