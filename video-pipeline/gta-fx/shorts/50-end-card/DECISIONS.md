# End card: design decisions

## Polish round 6 (current)

Critic r05: v0 6/10, v1 5/10, and both lost the blind pick. One defect was listed: in v1 the peach hairline sat at y 723, but the footage only cleared at y 820, so a 96 px smeared, dark feather of the plate hung under a line that marked nothing. The biggest gap: "Neither variant has Rockstar's single confident move (one heavy, wide-tracked date with a crisp magenta offset set straight on the image or on a silent full tile): v0 reads as a website footer under footage, and v1's seam and flat gradient look templated." This was a polish pass, not a redesign. I fixed the defect, then closed both variants' gaps (both scored 6 or below) with the critic's listed fixes, measured against the safe zone. The concept, the plates, the hero time (3.2 s) and the loop are unchanged.

### Defect fixed: v1's seam is now a hard horizon
- **No feather.** `veil` went from `{edge: 820, fade: 96}` to `{edge: 760, fade: 0}`, as the critic asked. `fade: 0` now means a hard edge: the script sets no mask at all (before, it always built a 12-stop smoothstep mask).
- **The hairline is on the footage edge.** It is drawn at `edge - fade - 2`, so with `fade: 0` it covers rows 758–759, the last two rows of the tile. I sampled the hero at x 100, 540 and 1000: sky (237,137,96) down to y 757, hairline (246,172,125) at 758–759, then footage from y 760 (for example (12,10,13) at x 540). There are no in-between rows.
- **The plate stays under the tile.** `shot.to` is unchanged (1110), so the plate settles 688 px down. I simulated every frame of the eases, the 5% push included. When the tile is in, the plate's top edge sits at least 72 px above the tile's bottom edge. During the entrance and the exit, the plate's edge is never below the tile's edge.
- **Checked in the render.** I pulled crops of y 660–860 from `v1.mp4` at 0.8, 1.5, 2.4, 3.2, 4.2, 5.0, 5.8 and 6.25 s. Each shows solid sky, the hairline, and then clear footage straight away. The smeared band is gone at every time.

### v1 biggest gap and listed fixes
- **No magenta on the title.** "VICE CITY" lost the magenta offset and now has a soft plum shadow: `0 2px 2px rgba(30,0,50,.30), 0 10px 30px rgba(30,0,50,.35)`. This reverses Polish round 5, which added the offset because the r04 critic asked for it. The r05 critic named the reason to reverse it: on the plum sky the offset reads as a colour fringe, and it is a third accent next to the sky and the hairline. DESIGN.md allows one accent per frame. The r04 concern is still met, because the title stays Rockstar-style tracked caps (700, 0.10em), not a tight, heavy web hero. The sky is v1's one accent again, as in Rounds 1–4.
- **Title width.** The title went from 120 px to **136 px**. I measured the white ink at x 147–932, which is 786 px or 72.8% of the frame (it was 64%). That is inside DESIGN's 70–88% hero rule and inside the x 936 safe edge.
- **Title centring bug fixed.** The title was about 7 px right of centre: its inline-block span inherited `text-indent`, so the indent was applied twice. `.sunset .title span` now resets `text-indent: 0`, and the ink centre is x 539.5.
- **Rise mask.** The mask padding went from 6/14 px to 20/44 px, and the rise starts from `yPercent: 160` (it was 120). The whole soft shadow stays inside the mask. I checked the entrance at 0.2–0.7 s: there is no shadow sliver before the rise. In the hero I found no step in the sky colour at the mask's top or bottom edges (y 266 and 466).
- **Layout.** `{eyebrow 250, title 266, date 441, handle 565, fine 633}` (it was 284 / 432 / 556 / 624) keeps the same gaps around the taller title. I measured the ink: eyebrow 256–275, title 303–403, date 447–471, handle 573–610 and fine print 638–658. That leaves 102 px between the two groups and 100 px from the fine print to the horizon.
- **Gradient motion.** The critic read the sky ramp as squashing while the tile drops. The tile has always been a fixed-height layer moved with `translateY`, so its gradient slides; it never resizes. The CSS now says this outright: the sky is `100% × --veil-h`, anchored to the tile's bottom (`0 100%`). I checked the render: the sky 20 px and 300 px above the moving horizon is (233,132,101) and (148,60,109) at 0.27 s, 0.33 s and 3.2 s, the same at every time.
- v1 sizes are still 3: 136 / 40 / 28.

### v0 biggest gap and listed fixes
- **The date is the heaviest thing on screen.** The date went from 56 px / 500 / 0.24em to **58 px / 700 / 0.21em**, and its offset is now Rockstar's `3px 2px 0 #EE08F2, 0 0 18px rgba(238,8,242,.30)`. `BLOOM_ON` and `BLOOM_OFF` were updated to match. The critic's exact 60 px at 0.22em put the ink at x 136–947 in a test render, outside the x 144–936 safe zone. At 58 px and 0.21em, the white ink runs from x 155 to 925 and the offset reaches 929. A 2× zoom shows a crisp offset with no magenta fog on the ink.
- **Line 2 stays 40 px / 600, not 34 px.** At 34 px, v0 would have 4 sizes (58 / 40 / 34 / 28), because the handle is 40 px. DESIGN.md allows 3, and r02 named 4 sizes as a defect. The inversion is fixed by weight and size instead: the date is now 700 at 58 px over 600 at 40 px.
- **Tighter, centred stack.** `veil` went from `{edge: 900, fade: 140}` to `{edge: 860, fade: 120}`, as the critic asked, so the ink is solid from y 980. Then I set the layout to two tight pairs, `{date 1068, line2 1140, handle 1264, fine 1326}` (it was 1064 / 1136 / 1262 / 1424). The critic's numbers (1040 / 1112 / 1236 / 1292) would have left 73 px of ink above the block and 155 px below it, so I moved them all down 28 px to really centre the block. I measured the ink: date 1079–1132 (caps to about 1121), line 2 1149–1177, handle 1272–1309 and fine print 1331–1351. Both pairs have about 28 px from baseline to cap top. The gap between the pairs is 95 px. The block has 99 px of ink above it and 129 px below it, inside y 980–1480.
- **The fine print joins the handle.** This revises Round 3, which set the fine print low (1424) to echo the legal line on Rockstar's "AN EXTENDED LOOK" tile. The r05 critic named the growing gaps (72 → 126 → 162 px) and the drifting stack as part of v0's biggest gap, and the handle plus fine print now read as one sign-off. Below y 1480, the platform caption band still stays empty.
- **No empty slab.** The shared `timing.type` went from 0.5 to 0.38 s (v1 still overrides it to 0.32). In the entrance strip, the slab is empty only from about 0.3 to 0.4 s, as the tile lands. The date is on solid ink by 0.5 s.

### Not taken, and why
- **The handle pill and the "FOLLOW" eyebrow (both variants).** This is the third time a critic has asked. The eyebrow is a new element, and this polish round adds none unless a defect requires it. The pill would put chrome back around the handle, which Round 3 removed on purpose (its hairline dividers read as a web "OR" row). Rockstar's tiles carry no buttons. The handle stays one quiet line, and it is now paired tightly with the fine print, so it reads as a sign-off rather than a stray label.

---

## Polish round 5 (superseded where Polish round 6 says so)

Critic r04: v0 7/10, v1 6/10, and both lost the blind pick. One defect was listed: v1's 200 px seam laid half-opacity pink over the top of the pushed-down p06 plate, which smeared Lucia's head with mauve-brown at y ≈ 700–880. The biggest gap: "Neither variant actually speaks Rockstar's end-tile type: v0's date is tracked too tight and its second line is a tiny afterthought, and v1 swaps the tracked magenta-offset caps for a generic heavy-Inter hero on a flat gradient with a muddy seam." This was a polish pass, not a redesign. I fixed the defect, closed v1's gap (it scored 6), then made the cheap v0 type fix. The concept, the plates, the hero time (3.2 s) and the loop are unchanged.

### Defect fixed: the v1 seam
- **Short seam with a horizon.** `veil` went from `{edge: 900, fade: 200}` to `{edge: 820, fade: 96}`, as the critic asked. The sky is solid down to y 724, then fades into the footage over 96 px. The footage is clear from y 820.
- **Horizon hairline.** A 2 px `rgba(255,200,143,.55)` line (the new CSS token `--sunset-horizon`) sits on the last row of solid sky, at y 723–725. It is a background layer of the tile, not a new DOM element, so it travels with the tile. Its position comes from CONFIG (`edge - fade - 1`). The seam now reads as an intentional horizon edge, not a smudge.
- **The plate stays under solid sky.** `shot.to` went from 1190 to 1110, so the plate settles 688 px down (it was 700, clamped). I simulated every frame of the eases, including the 5% push. The plate's top edge is always at least 38 px above the end of the solid sky; the closest point is at 0.8 s. The `.sunset #back` backing now takes its height from `veil.edge` (the `--veil-h` variable), so it always matches the tile.
- **Checked in the render.** I pulled crops of y 640–900 from `v1.mp4` at 0.8, 1.5, 2.4, 3.2, 4.2, 5.0, 5.8 and 6.25 s. Each one shows solid sky, the hairline, a short soft edge and then clear footage. There is no streaky band across Lucia's head at any time.

### v1 biggest gap: Rockstar's type signature
- **Title.** "VICE CITY" went from Inter 800, 144 px, tracked 0.04em, to Inter **700, 120 px, tracked 0.10em**. It carries Rockstar's date offset: `3px 2px 0 rgba(238,8,242,.85), 0 0 14px rgba(238,8,242,.2)`. Nothing else in v1 gets the offset, so the title is the one type accent. I measured the render: the ink runs from x 199 to 895 (696 px) and from y 305 to 395. The offset is crisp, with no haze.
- **This revises an earlier decision.** Round 1 kept the offset off v1 because "the sky is the one gradient in the frame", and Round 4 called the sky the frame's one accent. The r04 critic named the missing offset as v1's biggest gap. Both variants now share one type voice: tracked caps with the magenta offset. The sky is now v1's surface, the way the ink is v0's.
- **Rise mask.** The title's mask got 14 px of bottom padding (it was 2 px), and the rise now starts from `yPercent: 120` (it was 108). The offset and bloom stay inside the mask, and no glow sliver shows before the rise. I checked the entrance at 0.1 s intervals.
- **Two groups.** The layout went from `{eyebrow 262, title 292, date 466, handle 544, fine 636}` to `{eyebrow 250, title 284, date 432, handle 556, fine 624}`, as the critic gave it. I measured the ink. The first block is eyebrow 256–275, title 305–395 and date 438–462. Then there are 102 px of air. The second block is the handle (564–601) and the fine print (629–649). The fine print ends 75 px above the horizon line.
- v1 sizes are still 3: 120 / 40 / 28.

### v0: Rockstar's two-line date card (cheap, and it follows DESIGN's date style)
- **Date.** It went from 64 px / 600 / 0.14em to **56 px / 500 / 0.24em**, closer to the Nov 19 card's medium caps and wide tracking (`trailer-endcard-logo-date/rz1B4B2yBZY-82.5`). DESIGN.md's "Rockstar date style" asks for wide-tracked caps. At 64 px, any tracking wider than 0.14em pushes the ink outside the x 144–936 safe zone, so the size had to come down. This is a deliberate trade: the 0.24em tracking and the stronger second line give the card more presence than the extra 8 px did. I measured the ink, including the offset: x 162–921 and y 1075–1126.
- **Second line.** "SEE YOU IN LEONIDA" went from 28 px / 500 / 0.42em with no offset to **40 px / 600 / 0.24em** with the same `2px 1px 0 rgba(238,8,242,.85)` offset. That is about 71% of the date, like Rockstar's "PRE-ORDER NOW", and both lines now carry the offset. Its top moved from 1152 to 1136. The ink is at y 1145–1174, which leaves a 29 px gap under the date's caps (about 0.7 of the cap height, Rockstar's tight pairing).
- **Tracking-in.** The date now starts from 0.34em (it was 0.30) and line 2 from 0.40em (it was 0.62). Both settle at 0.24em, so the move reads, and it stays short.
- v0 sizes are still 3: 56 / 40 / 28. Line 2 and the handle now share 40 px.

### Not taken, and why
- **A "FOLLOW" label above the handle, and the tighter v0 layout tied to it (fine print 1424 → 1366).** This would be a new element, which a polish round doesn't add unless a defect requires it. Round 4 declined the same suggestion for the same reason. The low fine print is a deliberate echo of the legal line on Rockstar's "AN EXTENDED LOOK" tile (see Round 3). The empty ink below y 1480 is the platform caption band, which DESIGN.md keeps free of text.
- **"Only the push moves from 1.6 s to 6.3 s" (v0).** This wasn't in the fix list, and the slow push plus live footage is a deliberate "card holds" beat (Round 2).

---

## Polish round 4 (superseded where Polish round 5 says so)

Critic r03: v0 7/10, v1 6/10. No defects were listed. The biggest gap: "The v1 'Sunset card' has no sunset in it: it is a flat plum banner with Inter 800 'VICE CITY', so it reads as a generic template. v0 is faithful to Rockstar's ink tile, but its 52 px date is too small and quiet to give the end card a payoff." This was a polish pass, not a redesign. I closed v1's gap (it scored 6), then made the cheap v0 fixes the critic listed. The concept, the plates, the layout and the hero time (3.2 s) are unchanged.

### v1 biggest gap: the tile is now the sunset
- **Sunset backdrop.** The tile gradient is now `#2C1446 0%, #6B2A6E 45%, #C9566F 80%, #F08A62 100%` (the CSS token `--sunset-sky`), as the critic asked. The whole backdrop burns from plum at the top to rose and peach at the horizon, like Rockstar's PS5 "Immerse Yourself" sunset tile. The 7% seeded grain still dithers it. I sampled the render at x 60: (44,19,70) at y 0, (112,42,110) at y 420 and (198,88,111) at y 720, a smooth ramp with no banding.
- **The accent rule is gone.** The sky is now the frame's one accent, so the 420 × 6 px Leonida rule (and its draw-on tween) was removed, which keeps one accent per frame. With the rule gone, the date, handle and fine print moved up to keep one rhythm. The tops are now date 466, handle 544 and fine print 636 (they were 494, 572 and 664). I measured the ink in the render: title 316–422, date 472–496, handle 552–589 and fine print 641–661. That gives gaps of 50, 56 and 52 px.
- **The seam is long.** `veil` went from `{edge: 820, fade: 48}` to `{edge: 900, fade: 200}`. The tile is solid down to y 700, then its peach horizon melts into the footage over 200 px. The hard horizontal cut through Lucia's hair at y ~780 is gone; I checked a 3.2 s crop of y 600–1000. The shot's clamp now stops at 700 (it was 772), so the plate's top edge always sits under solid tile. I simulated every frame of the eases: the minimum margin is 2 px at 0.8 s, on a mask that is fully opaque there. `.sunset #back` now paints the same gradient over its top 900 px, so a sliver could never show a different colour anyway.
- **Fine print contrast.** `.sunset .fine` went from 62% to 82% white, because it now sits on the rose part of the sky. `hyperframes check` passes 12/12 WCAG AA text checks.
- **No empty tile.** v1 now overrides `timing.type` to 0.32 s (the new per-variant `timing` field, merged over the shared timing). The eyebrow tracks in as the tile lands. "VICE CITY" starts rising at 0.45 s and is fully up by about 0.62 s. I checked frames at 0.33, 0.43, 0.50, 0.60 and 0.67 s. Before this round, the title only started at about 0.63 s.

### v0 fixes (cheap, and consistent with the decisions below)
- **Bigger date.** The date is now 64 px (it was 52), meeting DESIGN's 64 px title floor. The critic's exact spec, 66 px at 0.20em, would put the ink at about x 101–979, outside the x 144–936 safe zone. I worked out Inter's real advance widths with fontTools: 64 px at weight 600 with 0.14em tracking is the largest setting that fits. The render's ink, including the magenta offset, runs from x 151 to 931. I also dropped the weight from 700 to 600, because the critic noted that Rockstar's date is "larger and lighter". The tracking-in now starts from 0.30em (it was 0.40em), so the faded-in date only briefly runs wider than the frame.
- **Crisp offset, no fog.** The date shadow is now `2px 1px 0 rgba(238,8,242,.85), 0 0 12px rgba(238,8,242,.18)`; the bloom was 22px at .38. I kept the right-side offset, and in a zoom of the hero it reads as a crisp edge with no purple haze on the left of the N and O.
- **Line 2 is no longer a hairline.** "SEE YOU IN LEONIDA" is now weight 500 (it was 300). It stays at 28 px rather than the suggested 32 px, which keeps v0 at 3 type sizes: 64 / 40 / 28 (DESIGN: at most 3 per frame; r02 named 4 sizes as a defect). Weight 500 at 28 px gives about the same stroke as 400 at 32 px.
- **Date top 1068 → 1064**, so the larger caps (1077–1124) keep the tight pair gap to line 2 (caps from 1157).

### Not taken, and why
- **"FOLLOW FOR MORE" label above the handle (both variants).** This would be a new element, and this polish round adds none unless a defect requires it. The CTA point wasn't listed as a defect. The handle remains the sign-off; this is the one critic suggestion left open for a future content round.
- **v0 fine print 1424 → 1370.** That fix was tied to the new label. The low fine print is a deliberate echo of the legal line on Rockstar's "AN EXTENDED LOOK" tile (see Round 3), so it stays.

---

## Round 3 (superseded where Polish round 4 says so)

Critic r02: v0 6/10, v1 5/10, and both lost the blind pick. The biggest gap: "Neither variant has Rockstar's single-gesture restraint: v0 is a soft-seamed half tile with a web-style divider handle row, and v1's 'sunset' is a 200px pink smear over the footage, not a sunset card." The answer this round is one gesture per variant: one solid tile, a seam that finishes before any type, and one accent per frame.

### Defects fixed
- **v1 used 4 type sizes (150 / 52 / 30 / 24).** It now uses 3: 144 (title), 40 (handle) and 28 (eyebrow, date and fine print). v0 also uses 3: 52 (date), 40 (handle) and 28 (line 2 and fine print). Both variants share the 40 / 28 sizes, so the library reads as one system.
- **v1's title spanned only ~51% of the width.** "VICE CITY" is now Inter 800 caps, tracked 0.04em, as the critic asked. At the suggested 116 px it would only span ~56% (I checked Inter's real advance widths), so I set it at 144 px. I measured the render: the ink runs from x 158 to x 927, which is 71% of the frame and inside the x 936 safe edge. 148 px reached x 944, outside the safe zone, so I stepped it down.

### Biggest gap: one gesture per variant
- **Divider rules removed (both).** The two 120 × 2 px hairlines around the handle read as a web "OR" divider, so they're gone. The handle is now one quiet line: Inter 600, 40 px, -0.005em. It rises 16 px and fades in, landing by about 1.2 s. It no longer competes with the 52 px date.
- **v0 seam finishes before the type.** The ink seam is now 140 px long (smoothstep, y 900 to 1040), down from 300 px across the date. I measured the hero: the per-row std-dev of the pixels is 0 by y 1040, so the date (caps at y 1078 to 1125) sits on clean `#1F202B`, with no boat hulls showing through. The footage is clear from y 0 to 900.
- **v0 date: bloom, not sticker.** The date is weight 700 with the text shadow `2px 1px 0 rgba(238,8,242,.85), 0 0 22px rgba(238,8,242,.38)`, as the critic specified. This matches the Nov 19 trailer card (`trailer-endcard-logo-date/rz1B4B2yBZY-82.5`). The r01 critic had cut the bloom because it smudged over footage. That no longer happens, because the date now sits on solid ink. The bloom ramps in 0.08 s after the tracking-in, from the same shadow at alpha 0, so the date "lights up". The date's ink runs from x 161 to 919.
- **v0 rhythm.** The tops are date 1068, line 2 1152, handle 1262 and fine print 1424. The date and line 2 are the tight Rockstar pair. The handle sits apart, and the fine print sits low like the legal line on the "AN EXTENDED LOOK" tile (`end-card-rating-card/uphThaa97ig-24`). Below y 1480 is the platform caption band, and it stays empty on purpose (DESIGN.md safe zone). The critic offered moving the fine print into that band, but DESIGN.md says text stays inside y 230–1480, so I didn't.
- **v1: the smear is gone.** I took the critic's first option. The 66–100% veil stops (`#5E2F74` to `#FFC88F`) are deleted. The tile is now one dusk surface (`#2C1446` to `#47235F`, top to bottom), with the 7% seeded grain still on to dither it, and it ends with a 48 px feather (y 772 to 820) into clear footage. The sunset appears once, as the frame's one accent: a 420 × 6 px rule (radius 3) under the title in the Leonida pink-to-amber core, `linear-gradient(90deg,#F84FA4,#FE8E4E,#FEB747)`. The rule draws out from the centre as the title lands. I kept the deep tile rather than the pastel-sky option. The r01 critic named white type at about 3:1 on the pastel as a defect, so going back would be a flip-flop.
- **v1 layout.** The tops are eyebrow 262, title 292 (caps at y 316 to 422), rule 462, date 494, handle 572 and fine print 664. Lucia's face (`shot.to` 1190, clamped so the plate edge stays under solid tile) sits in the clear footage from y 820 down.

### Kept from round 2 (deliberate, not named as defects)
- Full-width footage, never boxed. The tile slides over it (expo.out, 0.15 to 0.75 s) and the shot settles (power3.inOut), always behind the tile's leading edge.
- Tracking-in entrances, one line leading at a time. The type clears at 6.3 s, then the shot returns and the tile slides away, so the first and last frames are both clean full-frame footage. I checked both renders.
- Plates: v0 uses `p01-keys-sign` (the Marina in the hero). v1 uses `p06-lucia-gate`, because p02 carries the official logo and Rockstar's legal card.
- Hero time 3.2 s.
- Fine print at 28 px, `rgba(255,255,255,.62)`, tracked 0.02em. The critic asked for 26 px, but 28 keeps each frame to 3 sizes, and it reads at 360 × 640.

---

## Round 2 (superseded where Round 3 says so)

Critic r01: v0 6/10, v1 5/10, and both lost the blind pick. The biggest gap: "footage in a rounded drop-shadow window over a caption stack reads as a social template, not Rockstar's type-first end tile, and the handle is a 30 px afterthought."

### Defects fixed
- **v1 sky streaks and banding.** The `#sky` blurred-blob layer is gone. The sky is now one CSS gradient with a 7% overlay of seeded `feTurbulence` monochrome grain, which dithers it. I measured the render: the steps are 1–2 levels and the longest flat run is 16 px, so it doesn't band.
- **Handle too small.** The handle is now the payoff: 52 px/700 at -0.01em, with 120 px hairlines (2 px, 40% white) that draw out of it. The lines step in 0.15 s apart, so the handle starts at 0.82 s in v0 and 0.97 s in v1, and has landed by about 1.2 s in both (it landed at about 2.0 s before).

### Biggest gap: the window is gone (a deliberate reversal, because the critique named it as the core defect)
- **Nothing is boxed.** The footage stays full-width at radius 0, and the tile slides over it with a 300 px smoothstep fade on its leading edge (a CSS mask). That is Rockstar's trailer end card, `trailer-endcard-logo-date/rz1B4B2yBZY-82.5`, where the date sits straight on the last aerial. The shadow and edge layers were dropped with the window.
- **v0:** the ink tile rises from the bottom. The footage is clear above y 860 and fades into `#1F202B` by y 1160. As the tile rises, the shot settles 306 px up so the subject sits in the clear area. The date sits on the fade (top 1062), where the footage still shows faintly through it, as in the trailer card.
- **v1:** a dusk sky falls from the top and dissolves into the footage between y 840 and 1140, so the shot reads as "under a sunset". The shot settles 840 px down so Lucia's eyes land at about y 1260 in clear footage, below the fade.
- **No visible seams.** The tile always leads and the shot follows (power3.inOut, starting 0.05 s later). On exit, the shot returns first and the tile leaves last. I simulated every frame's eases: the plate's edge is always under solid tile, so no hard line appears inside the fade.

### Type
- **v0 weight pairing.** This follows the "AN EXTENDED LOOK" tile (`end-card-rating-card/uphThaa97ig-24`). The date is Inter 600, 52 px, tracked 0.28em, in white with the 3/2 px `#EE08F2` offset; its bloom is cut to `0 0 14px rgba(238,8,242,.18)`, so there's no pink halo. Under it, "SEE YOU IN LEONIDA" is Inter **300**, 30 px, tracked 0.42em, in plain white. The magenta is on the date only. At 0.30em the date's offset touched x 936, so the tracking is 0.28em, which keeps it inside x 162–926.
- **v0 sizes.** 52 (date and handle) / 30 / 24 (fine print). The date and the handle share one size on purpose.
- **v1.** A light-over-bold pair, the same pairing: "SEE YOU IN" is Inter 400, 30 px, tracked 0.42em, over "VICE CITY" in **Barlow Condensed 800 at 150 px**, tracked 0.02em (stock Inter 800 read as generic). The date is Inter 600, 30 px, tracked 0.36em. Then the handle and the fine print. The whole stack sits on the deep part of the sky (y 262–700), so white type has about 12:1 contrast. Before, it had about 3:1 on the pastel.
- **v1 sky.** `#2C1446`, then `#3A1C55`/`#3E1F5A` through the first ~56% of the tile (deepened as the critic asked), then orchid, pink, peach and `#FFC88F` just where it fades into the footage. The pastel stops from the official "PLAY HAS NO LIMITS" sky are kept, but only as the horizon band.

### Motion
- **v0 entrance.** Footage plays full-frame from 0 to 0.15 s. The tile slides in from 0.15 to 0.75 s (expo.out) and the shot settles from 0.2 to 0.8 s. The date tracks in at 0.5 s (letter-spacing 0.40em to 0.28em plus opacity, expo.out). This replaces the blur(14px) bloom. Line 2 follows at 0.65 s, and the handle comes in at 0.82 s (rises 18 px, rules draw out).
- **v1 entrance.** The order is eyebrow (tracking-in), title (rises out of a mask), date (tracking-in), then handle.
- **Loop.** The type clears at 6.3 s. The shot returns from 6.42 to 6.92 s, and the tile is fully off by 6.94 s, so the last frame is clean full-frame footage.
- **Life during the hold.** A slow 5% push on the footage, which keeps playing under the tile.

### Plates and layout
- **Plates unchanged.** v0 uses `p01-keys-sign`, so the hero shows the Marina. v1 uses `p06-lucia-gate`; p02 still carries the official logo and Rockstar's own legal card.
- **v0 layout.** The stack moved down (date 1062, line 2 1148, handle 1254, fine print 1424) to give the footage 0–860 and leave less dead ink. Below y 1480 is the platform caption and handle zone, so it stays empty on purpose. The fine print sits low, like the legal line on Rockstar's tiles.
- **Hero time.** 3.2 s: the Marina in v0, and Lucia's face in clear footage in v1.

---

## Round 1 (superseded where Round 2 says so)

### Concept
- **One object: the end tile.** Rockstar's own end sequence goes "date fades in through a bloom, then dissolve to an aerial, then the end tile on #1F202B" (`research/gta6/analysis-3.md`, refs `trailer-endcard-logo-date/rz1B4B2yBZY-82.5`, `end-card-rating-card/uphThaa97ig-24`). This is a full-frame component, so the footage must always show. I merged the two beats: the creator's last shot closes into a rounded window (clip-path iris plus a shrink to 0.8) while the tile is revealed around it. The footage keeps playing inside the window for the whole hold.
- **The window shrinks the shot. It doesn't just crop it.** The plate scales to 0.8 about a focus point while the clip-path closes. The window then shows most of the frame's width, not a tight centre crop, and the move reads as "the clip recedes into the card". The scale is clamped so the plate always covers the window, with no gaps.
- **Loop:** at 6.3 s the type fades out, then the window opens back to the full frame (6.5 to 7.0 s, power3.inOut). The last frame matches the first frame's framing.

### Variant 0: Ink tile + date (Rockstar's end tile)
- Flat `#1F202B` ink-navy, sampled from the Netflix "An Extended Look" tile and the R* glow tile in the official refs. A soft radial lift was tried and dropped because it banded in the render.
- The date line follows Rockstar's date style: Inter 600 caps tracked 0.32em, a 3px/2px `#EE08F2` magenta offset plus a soft magenta bloom, centred. The second line is at about 60% size (48 → 29 px), as in Rockstar's "NOVEMBER 19, 2026 / PRE-ORDER NOW". `text-indent` equal to the tracking keeps the tracked lines optically centred.
- The second line is fan voice ("SEE YOU IN LEONIDA"), not "Pre-order now", so the card never reads as an official Rockstar announcement (DESIGN rule 5).
- The date fades in through a bloom (blur 14 → 0, scale 1.04 → 1, 0.42 s), per the analysis of Rockstar's end motion.
- Type sizes: 48 / 29–30 / 24. That is three sizes, and the only accent is the magenta date treatment.

### Variant 1: Sunset card
- The tile is the sampled sunset sky gradient (`#9C7AA8 → #D689A1 → #FAA08D → #FCB680 → #FFC88F`), following the "PLAY HAS NO LIMITS" sky card in `official-type/8L0CzL2V72c-47.3`. Fixed, blurred cloud streaks drift 110 px over the clip for life, with no randomness. The sky is the one gradient in the frame, so the type has no magenta offset here.
- Layout is flipped from v0. A "big word + tracked subline" lockup (eyebrow 30 / title 108 Inter 800 / date 30 tracked) sits in the upper third, and the window sits below. The title rises out of a mask (expo.out). White type sits on the lavender and orchid top of the sky, where it stays legible. The channel and fine print sit low on the peach, so they're set in deep plum `#2A0F33` instead of white.

### Shared
- The channel sign-off is `@everestchris6` between two hairlines that draw out from the centre. It is the channel owner's handle, as DESIGN.md asks.
- The fine print line, "Fan edit · Not affiliated with Rockstar Games", at 24 px, echoes the legal line on Rockstar's tiles. It is also honest labelling.
- All text is centred on x 540 inside x 144–936 and y 250–1450.

### Plates
- v0 uses `p01-keys-sign` (suggested): the Keys sign, then the marina, then the jet ski.
- v1 uses `p06-lucia-gate` instead of the suggested `p02-blue-club`. p02 contains the official GTA VI logo (2–5 s) and Rockstar's own date and PS5 legal card (7 s+). Both would show inside the window, which breaks the no-trademarks rule, and Rockstar's date would sit next to ours. p06's golden hour suits the sunset tile.
- v1's focus is `[0.45, 0.36]`, so Lucia's face sits in the upper-left of the window rather than being cut by its left edge.

### Round 1 self-check fixes
- Removed the radial lift on the ink tile, because it banded into a visible ring.
- Moved v1's shot focus left (0.5 → 0.45).
- Moved the hero time from 3.0 to 3.5 s, so v1 shows Lucia's face framed rather than cut off at the left edge. v0 still shows the marina shot.
