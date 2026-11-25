# Decisions: 24 Versus card

## v2 concept
- **The one idea.** Split: a fight-night face-off. Each contender gets one full-frame close-up beat with their name, then the two portraits slide in from opposite edges and the VS crashes onto a steep diagonal blade of sunset light between the two faces: a fight poster. Centre (r10): GTA V vs GTA VI as a matched-pair edit on a full-bleed 50/50 split (GTA V 0–960, GTA VI 960–1920) on a hard seam, cutting together on the beat, with the title as one fight-card lockup on the seam (GTA V on the VS, GTA VI hanging under it) and each picture framed outward.
- **Shots and cuts.** Split: `s083` Lucia on the red convertible (0–1.1, pre-slowed 0.56× between her two blinks) → `s076` Jason at the boat (1.1–2.6) → the portraits slide in 2.3–2.6 and hold to 6.0: `s018` Lucia at the gate (top, pre-slowed 0.68× from the moment her head is up) over `s078` Jason on the phone (bottom, re-cut from the 4K master as a window that pans with his face, 0.56×). Centre (r10), both panes cutting together: the skyline / welcome sign `g33` Los Santos at golden hour / `s074` Keys sign (0–1.0) → the view from the top `g06` hikers / `s135` skydive over Vice City (1.0–2.6, `s135` pre-slowed 0.66× from her leap) → the city `g16` Michael over the LS skyline / `s011` driving into Vice City under the towers (2.6–4.4) → the beach `g01` lifeguard tower at sunset / `s100` biplane over a packed Vice City beach (4.4–6.0).
- **Where the type sits.** Split intros: lower third over the chest, under the face, on a bottom scrim. Split hold: the seam runs from (0, 1080) to (1080, 700). CAMINOS / LUCIA flush left on ink x 96, under Lucia's chin and above the seam; the VS centred on the seam at x 530; DUVAL / JASON flush right on ink x 900, at the foot of Jason's portrait under his beard. Centre (r10): the lockup sits on the seam, in the middle of the safe zone: measured on the r10 hero: label A 688–707, GTA V 734–853, VS 890–1031, GTA VI 1066–1186, label B 1212–1231. That is the foot of A's 16:9 shot (dark ground, a jacket, a tower base) and the top of B's (sky), so the pairs are cast for it and every face sits outward. A soft dark lip on each side of the seam lies under it.
- **Hero size and face.** Archivo wide (125%), caps. Split intro names 146 px; face-off names 168 px (LUCIA 661 px = 77% of the safe width, JASON 755 px = 87%), so the payoff outgrows the setup; the VS 210 px with the sunset fill. Centre names 172 px (GTA VI 744 px = 86%, GTA V 687 px), VS 200 px pure white. Labels Archivo wide 600, 26 px, tracked .34em. One family on screen.
- **Payoff.** Split 2.6 s: the portraits whip in (power2.in, building motion blur), the blade draws across in 0.16 s, the VS falls from 2.6× and lands as the panes meet, with a 0.42 flash, a 12 px shake, punch-zoom, RGB split on the VS and one sunset light leak running down the blade. Centre 1.0 s: the VS slams onto the seam on the first matched cut, with a white seam flash, a picture flash, the blade flaring, shake, and RGB split on the VS and on GTA VI.

## Key decisions (v2)
- **Rebuilt from scratch.** The v1 look (Barlow Condensed names with soft shadows, a flat gradient VS on a hairline, two retimed 1080p trailer clips held for 5 s) is gone. Kept from v1: the job (a head-to-head title that opens a comparison segment), the real content (Lucia Caminos and Jason Duval; GTA V 2013 · Los Santos; GTA VI 2026 · Leonida), a diagonal seam for Split and a level one for Centre, the VS as the one emblem on the seam, and v1's seek-safety lessons (all motion on the paused timeline, no onUpdate, clip lengths never overrun).
- **Split reads Lucia vs Jason.** Lucia (`s018`, looking to camera) is the top portrait; Jason (`s078`, facing left, toward her) is the bottom one. *(r07 used `s008` Jason driving; replaced in r08.)*
- **Pre-slow, not playback rate.** Every slowed clip is rebuilt by `make-clips.sh` with motion-compensated interpolation, never a `data-playback-rate` below 1. In-points are chosen frame by frame so no slowed clip shows a blink or a fast head move under the type (see round 9).
- **The seam is a blade of light.** Split: a 4 px #F84FA4 → #FEB747 sunset edge with a three-layer bloom (Look.bloom's recipe as a box-shadow), a contact shadow under it (the upper plate lies over the lower one), broken around the VS; it draws across left to right in the 0.16 s before the hit and flares on it. Centre: a 4 px white blade with a warm bloom on the hard seam at y 960, growing out from both sides of the VS.
- **One accent per frame.** Split: the VS carries the Leonida sunset fill with an orange bloom (an orange copy under the gradient glyphs carries it); names and labels are white. Centre: GTA VI carries the sunset fill (with a sheen at 1.55 s); the VS is pure white with a soft warm bloom (r10: the magenta offset read as a second accent).
- **Centre is full bleed (r10).** No letterbox black: the two panes fill the frame. The flashes are hosted in `#stripFx` (the picture) and `#seamFx` (a soft band along the seam).
- **`bg` is ignored on purpose.** This is a full-frame component: footage always shows, and the Look finishing stack (grain .15, vignette .5 Split / .42 Centre) is always on.
- **Fonts are loaded before layout.** All type is injected by script, so `document.fonts.ready` alone resolved before Archivo had ever been requested, and the first build measured Inter fallback metrics. The script calls `document.fonts.load` for each Archivo face first.
- **Gaps and edges are measured on the ink.** Names are placed by baseline (a DOM marker) and cap height (canvas `measureText`); flush lines are aligned on `actualBoundingBoxLeft/Right`; each label's cap top sits exactly `gapLabel` px from its name.

## v2 round 7 (first v2 build)
- Built both variants from the v2 concept above. Hero time: **4.0 s** (Split: the column has settled, Lucia is looking to camera, Jason is in profile; Centre: the sunset pair).
- **Fixes found on my own frames before finishing:**
  - Archivo was not loaded when the layout was measured (see Key decisions): the VS's right half was transparent and every gap was off. Fixed with `document.fonts.load`.
  - Label gaps were 55–60 px instead of 26, because they were set as margins on line boxes. They are now measured on the ink (`stackUnder`).
  - The split names were hidden under the intro scrim before the cut, which `hyperframes check` flagged as occluded text. The column blocks are now hidden until the cut.
  - JASON almost touched Jason's nose: his pane box moved 40 px right (x −430) and was enlarged to 1240 px tall.
  - Centre's slam flash turned the whole letterbox grey for 4 frames; the flashes now light only the strips.
  - Centre's first frame was almost all black (the strips opened from 12%); they now open from 45%, so frame 0 already shows both shots.
  - Reordered Centre's pairs (skyline second, sunset third) so the 4.0 s hero shows the sunset pair in both variants' best moment.
- **Checked on the r07 MP4s:** both hero PNGs, both strips, the entrance sheet, and 12 extra frames per variant (Split 1.25, 1.3, 1.34, 2.4, 2.55, 2.6, 2.67, 3.6, 4.6, 5.4, 5.55, 5.95; Centre 0.0, 0.15, 0.4, 0.9, 1.0, 1.04, 1.1, 1.4, 2.7, 5.45, 5.6, 5.95). mpdecimate keeps 180 of 180 frames in both variants, so no plate freezes. `hyperframes check`: 0 errors.
- **Unresolved / for the critic to judge:** Lucia blinks in the first 0.3 s of `s083` (the shot is only 1.33 s, so there is no other in-point); the intro names cut out with their shots rather than exiting (an editorial hard cut); the pink dress behind Jason is graded down but still faintly visible low in the frame around 3.8–4.4 s.

## v2 round 8 (critic r07: v0 7/10, v1 8/10; 2 defects, both v0; biggest gap: v0's face-off was lopsided, and v1's closing pair made GTA VI look murkier than GTA V)
Hero time: **4.0 s** (Split: the poster has settled, Lucia looks to camera, Jason is mid-call facing her way; Centre: the sunset pair).

**Defects fixed (v0).**
- *Jason's face under the action rail (x 770–1000).* `s008` is gone. Jason's pane is now `s078` (Jason on the phone at the marina, daylight, facing left toward Lucia), boxed at 1.13× (2170 × 1221 from y 690) so his face sits at x ≈ 450–790, y ≈ 990–1320, inside the safe zone and mirroring Lucia's x 380–800. The camera arcs round him, so a face track (`b.pane.track`, measured on the slowed clip) moves the clip 80% of the way with his face: it holds near x 620 for the whole hold instead of drifting about 470 px. The pane carries `brightness(1.16) contrast(1.1) saturate(1.06)`, since he is backlit; it is now as readable as Lucia's golden key without blowing the sky.
- *Ragged left edge.* Every flush line is now aligned on its glyph ink with canvas `measureText` (`actualBoundingBoxLeft/Right`, letter-spacing included): CAMINOS, LUCIA and both intro stacks start at ink x 76; DUVAL and JASON end at ink x 935–936 (measured on the r08 frames).

**Biggest gap, v0: a real face-off.**
- The seam rises 380 px (yLeft 1080 → yRight 700, 19°), up from about 150 px.
- The VS is 210 px (from 124), centred on the seam at x 530, between the two faces. It is now the biggest, hottest thing in the frame (names 140 px). A soft dark halo under it keeps it reading over Lucia's shirt and Jason's cap.
- LUCIA is flush left above the seam (under her chin); JASON is flush right, ink edge on 936. Each surname is now a small kicker above its name.
- **Where I departed from the critic's numbers, and why.** The fix asked for JASON directly under the seam with Jason's face below it at y 1100–1400. No Jason close-up in the library has that much headroom: in `s078`, `s076`, `s007` and `s008` the brow sits 270 source px or less below the frame top. The bottom pane's box must reach the seam's high end (y 700), so his brow lands at y ≈ 990 whatever the scale, and a name between the seam and his face would cover it. So JASON sits at the foot of his portrait (baseline 1462, under his chin, inside the safe zone), and the poster reads as a Z: Lucia's face, LUCIA, VS, Jason's face, JASON. The VS overlaps only the top of Jason's dark cap; his brow is about 25 px below it and his eyes 65 px.
- **Why `s078` and not the suggested `s007` / `s076`.** `s007` shows Jason's back from 0.4 s on, so with the suggested in-point (0.3) the B side would be a back. `s076` only shows his face for about 1.4 s, looking down at the boat. `s078` has his face from 0.45 s to the end (1.7 s), so it is pre-slowed to 0.45× (minterpolate, clean on a slow camera arc; checked at full res on synthetic frames) to fill the hold: a slow-motion stare-down. `s076` (face visible, 1.5–2.8 s) now plays Jason's intro beat, so the B side has two different shots instead of `s078` twice.
- **The split arrives instead of hard-cutting in.** From 2.3 s both portraits slide in horizontally from opposite edges (A from the left, B from the right), each box starting just off its own edge so both arrive together (B's box is wider and travels 1905 px). They use `power2.in` so they whip into the hit, with a directional motion blur that builds to 40 px and snaps sharp in 0.1 s on the impact. I chose `power2.in` over the suggested `expo.out` because `expo.out` front-loads the move and leaves the panes creeping on the hit frame. The blade draws across left to right in the last 0.16 s, the VS falls 2.46–2.6, and everything lands on the existing `Look.impact` at 2.6. A first try slid the boxes diagonally along the seam, but that showed the box's hard top edge as a rectangle mid-slide, so the moves are horizontal. The intro B name blurs out at 2.24 s, under the arriving panes.
- `Look.install` and the push/flash stack are unchanged.

**Biggest gap, v1: shot selection.**
- *Closing pair.* `s123` (night gameplay) is replaced by `s083-duo-convertible-h` (Lucia and Jason in the red convertible, daylight), pre-slowed to 0.78× (1.63 s), framed at y 0.36 so both faces and the red door are in the strip. It is a true match for `g07`, and GTA VI wins the last read.
- *Pair 2.* Michael's back over the Los Santos skyline now meets `s135` (a skydive over the Vice City skyline) instead of the highway: city vs city, a figure over each skyline. The VS lands on her sky (no road signs). Cut timing is now 1.0–2.6 (1.6 s, `s135` is 1.63 s) and the sunset pair runs 2.6–4.4.
- *Exit.* The strips now shut back onto the seam (`clip-path` inset to 100%, 5.6–5.95 s, `power3.in`, so the close reads over several frames rather than snapping in the last two). Frame 179 is clean black; no bare plates linger under blurring type.
- The VS halo is a touch darker (.7 centre), and it now sits under all the type in the stacking order (`hyperframes check` flagged it as occluding LUCIA's last letters).

**Checked on the r08 MP4s:** both hero PNGs, both strips, the entrance sheet, and 12 extra frames per variant (Split 2.40, 2.50, 2.57, 2.60, 2.63, 2.70, 2.90, 3.10, 5.45, 5.60, 5.80, plus frames 81/84/90 at full res for Lucia's head-lift against LUCIA; Centre 0.03, 0.20, 0.97, 1.00, 1.03, 2.63, 4.43, 5.45, 5.65, 5.80, 5.88). mpdecimate keeps 180 of 180 frames in both variants. `hyperframes check`: 0 errors (the warnings are the masked-reveal overflow and the blade running past the canvas edge, both intentional).

**Unresolved / for the critic to judge:** Jason's pane is a 1.13× upscale of a 16:9 shot with a shallow depth of field, so the marina behind him is soft next to Lucia's native-resolution portrait. His face itself is sharp. Lucia still blinks early in `s083` (intro A, 1.33 s shot).

## v2 round 9 (critic r08: v0 7/10, v1 7/10; 4 defects; biggest gap: neither payoff frame was bigger than its setup, Jason's pane was soft and ghosted, and Centre was two slivers on 63% dead black)
Hero time: **4.0 s** (Split: the poster has settled, Lucia looks to camera, Jason mid-call facing her way; Centre: the sunset pair). The run paused mid-round; this round was rebuilt and re-captured cleanly from the r08 critique.

**Defects fixed.**
- *v0: Jason's pane was soft and ghosted (a 0.45× blend slow-mo of the 1080p `-h` clip, upscaled 1.13×).* `s078` is now re-cut from the 4K master (`research/gta6/plates/4k/rz1B4B2yBZY.webm`, 11.37–13.52 s): a 1456 × 1920 window of the picture under the letterbox that pans with his face (a 4th-order fit of his eye x, followed 85%), interpolated at that resolution at 0.56×, then downscaled to 1080 × 1424 (0.742× of 4K) and given the library's shot grade. It is a downscale, so it is as sharp as Lucia's pane. The box follows his eye height (`b.pane.track`, his head rises in the first 0.6 s) and holds it at `eyeY` 1000.
- *v0: LUCIA / CAMINOS flush on x 76 and JASON on x 934.* Every flush edge is now on `inkEdge` { left 96, right 900 }. Measured on the r09 hero: LUCIA 96–757, JASON 144–899.
- *v1: the band crops beheaded Michael and the GTA V jetski rider.* The bands are now full native 16:9 (1080 × 608, y 240–848 and 856–1464), so nothing is cropped. The titles now sit inside the bands, so the pairs were re-cast for room: the jetski and Michael pairs (where GTA V would have covered a head) became Vinewood sign / Keys sign and hikers on the mountain / a skydive over Vice City.
- *v1: the white VS lost contrast on the pale skydive sky.* The VS is now the Rockstar date treatment (white, a 4 × 3 px #EE08F2 offset, a soft magenta bloom) over a dark drop-shadow, with a .42 dark lip on both sides of the seam. It reads on every pair, including the skydive sky at the slam.

**Biggest gap, v0: the payoff is now bigger than the setup.**
- Face-off names 168 px (from 140), intro names 146 px (from 196): LUCIA 661 px (77% of the safe width), JASON 755 px (87%).
- *The seam is the light.* The white hairline and the plum `#vsHalo` (a smudge on Jason's cap) are gone. The blade is a 4 px sunset edge with bloom strength .6 that flares (brightness 1.9 → 1) on the hit, the VS carries an orange bloom (`vsBloom` .45), and one `Look.leak` (amber → pink, .55 s) runs down the blade at 2.56 s.
- *Jason's beard is clear of JASON.* With the bigger name, the first r09 render put JASON's cap top (y 1350) on his beard. The re-cut is 1424 px tall (not 1344), so the box can sit 80 px higher, and `eyeY` is 1000 (from 1050). Measured: his beard ends at about y 1270 for the whole hold, about 80 px above JASON; the seam now crops the crown of his cap (tight close-up framing) and the VS sits on the cap, clear of his brow.
- *No ghosting at the hit.* `s018` is re-cut from 0.40 s (source frame 12, head up) at 0.68×: the old clip started on her fast head lift (frames 5–11), which ghosted under interpolation right on the 2.6 s hit. She now looks to camera from the moment the panes land. The motion blur that resolves after the hit is now 2 frames at 16 px (was 0.1 s at 40 px), so the landed panes snap sharp under the flash instead of smearing for 3 frames.
- *No blink.* Intro A is `s083` at 0.56× from 0.433 s: source frames 13–31 sit between her two blinks (3–12 and 32–37) and fill the 1.1 s beat (r08's 0.76× clip from 0.40 s reached the second blink at 0.88 s).
- The blade now retracts last (5.58–5.98 s) after the type and VS, so the card does not end on a bare unlit seam.

**Biggest gap, v1: a frame, not a template.**
- *Full-bleed bands.* Two native 16:9 bands fill y 240–1464; the black is only where the platform UI sits (36% of the canvas, from 63%).
- *A VS that hits.* VS 190 px (333 px wide, from about 200), slammed from 2.4× with a seam flash (.6), a band flash (.3), a 9 px shake and RGB split on the VS and GTA VI.
- *Titles inside the bands.* GTA V in the top of band A, GTA VI in the foot of band B, 46 px from the band edge, each on an in-band grade (`scrimH` 400, `scrim` [.8, .56, .24]; the kit's `.lk-scrim-top` left "2013 · LOS SANTOS" at about 2:1 on the bright street of the convertible pair). Names 172 px (GTA VI 744 px, 86% of the safe width; at 178 it reached x 921).
- *Shots cast for the type.* `s135` is pre-slowed 0.66× from her leap (0.50 s), so she is in the air above the label, not standing behind GTA VI, after the first few frames of the slam. The convertible pair's `s083` is 0.50× from 0.433 s: the 0.78× whole-shot clip blinked at 4.6–5.0 s, mid-read; her eyes now stay open until the bands start to shut.
- *Exit.* The type exits from 5.25 s and the bands shut from 5.55 s (`power2.in`, 0.42 s), so the names are gone before the shutter reaches the band edges they sit on (the r09 first pass left a blurred GTA VI floating on black at 5.9 s).

**Checked on the r09 MP4s:** both hero PNGs, both strips, the entrance sheet, and extra frames per variant: Split 0.3, 0.9, 1.5, 2.4, 2.53–2.9 (frames 74–85 one by one), 3.0, 3.2, 3.4, 3.6, 4.0, 4.5, 4.8, 5.3–5.96, plus 1:1 crops of Jason's pane at 2.62, 2.95, 3.2, 3.6, 4.5 and 5.4; Centre 0.0–0.5, frames 27–32 (the slam), 1.2, 1.5, 2.0, 2.7, 3.5, 4.5, 4.9, 5.3–5.96 and Lucia's eyes every 3rd frame from 4.4 s. mpdecimate keeps 180 of 180 frames in both variants. `hyperframes check`: 0 errors. The layout warnings are the masked reveal's tracked glyph boxes overflowing their containers by about 10 px, and LUCIA's characters, still hidden below their mask at 2.63–2.75 s, overlapping the VS's box; neither is visible.

**Unresolved / for the critic to judge:** the seam crops the crown of Jason's cap (the price of keeping his beard clear of JASON with a close-up that has almost no headroom); the skydiver's legs sit behind "GTA VI" for the first 4–5 frames after the slam, under the flash; Lucia starts to blink in the last 6 frames of Centre, while the bands shut.

## v2 round 10 (critic r09: v0 8/10 pass, v1 7/10; 1 defect, v0; biggest gap: Jason's half greyer than Lucia's in v0, and v1 was stacked 16:9 grabs on 37% dead black with a gamer-sticker VS)
Hero time: **4.0 s** (Split: the poster has settled; Centre: the city pair, Michael over Los Santos vs Vice City's towers).

**Defect fixed (v0): LUCIA no longer passes through the VS.** The kit's `.lk-mask` has .16em of bottom padding, so C-I-A were visible rising through the 59 px under LUCIA's baseline, which is where the VS ink starts (30 px under it). Each mask of `#sAn` is now clipped at its baseline + 8 px (`maskClip`), so the characters rise out of the baseline and never cross the VS; the name block also only shows from `nameA` (2.72 s). Checked frame by frame (frames 80–91): no glyph below LUCIA's baseline. The checker's `content_overlap` warnings at 2.625 / 2.75 s are gone.

**v0 is otherwise unchanged, on purpose.** v0 passed at 8 and is locked (`tools/gta/sticky_status.py`): only a listed defect may change its render. I built the critic's other v0 notes first, then reverted them when the capture's lock check flagged v0 as changed (SSIM .964 vs r09). With only the defect fix, v0 is SSIM .9915 vs r09 (unchanged), so the lock holds. Kept for a later round if v0 ever unlocks:
- *Jason's grade.* `make-clips.sh` now carries `JGRADE` (contrast 1.16, saturation 1.14, a black-point curve, gamma 1.18, a warm balance, more unsharp) and `bash make-clips.sh jason` rebuilds just his pane. It measured face luma 73–81 vs Lucia's 84 with deep blacks; a first try at gamma .96 sank his face to 45. Not used now.
- *Why not 0.75× without interpolation:* the shot is 2.3 s in the master (cuts at 11.23 and 13.53 s), so 0.75× gives 3.07 s at most and the hold needs 3.7 s.
- *VS bloom .65 and labels above the intro names:* also reverted under the lock.

**Biggest gap, v1: a title, not a fan comparison.** Rebuilt as a full-bleed split:
- *Full bleed.* Two 1080×960 panes (GTA V 0–960, GTA VI 960–1920) on a hard seam at y 960, with no letterbox black. Each `-h` shot is cover-scaled to 1707×960 and framed per shot (`fit` x / y / s); the hikers are zoomed 1.125× (the file's native pixels) from the foot, and Michael is framed right (x .72).
- *A white VS.* 200 px pure #FFFFFF Archivo 900 at 125% stretch, with `Look.bloom` #FFE2C4 at .35 and a soft dark drop-shadow. The #EE08F2 offset and the purple bloom are gone, so GTA VI's sunset fill is the only accent. The slam keeps the seam flash, a picture flash, the shake and `Look.chroma` 12 px at 1.0 s, and the 4 px white blade now flares on the hit.
- *Seam-out wipe.* The panes open from the seam (each starts half open, so frame 0 already shows both shots), 0.5 s `expo.out`, and shut back onto it at 5.55 s.
- *The hold pair is crisp and contrasting.* 2.6–4.4: `g16` Michael over the Los Santos skyline (from 0.3) vs `s011` driving into Vice City under the towers and road signs (from 1.5, once the signs have dropped below the GTA VI label). This replaces the hazy `g01` / `s027` sunsets.
- **Where I departed from the critic's numbers, and why: the type is one lockup on the seam, not at y 290 and y 1420.** In a full-bleed pane, y 1420 is 460 px into the GTA VI pane, the middle of a 16:9 picture, where every GTA VI shot keeps its subject: I measured GTA VI there over the Keys sign, the skydiver, the road signs, Lucia's eyes in `s083`, Brian's Marina sign and the jetski riders. In a 16:9 shot the top is sky and the foot is ground, so the title goes where both pictures have room: GTA V on the foot of the top shot, GTA VI on the top of the bottom shot, the VS between them on the seam. It reads as a fight-card lockup (name / VS / name) in the middle of the safe zone, with each picture framed outward.
- *Pairs re-cast for the lockup.* Opening: `g33` downtown Los Santos at golden hour vs `s074` the Keys welcome sign from 0.2 s (the sign stays under the label until the cut; `g39` Vinewood's letters would have sat under GTA V). Slam: `g06` hikers (GTA V over their legs, their heads and packs clear) vs `s135` the skydive (she falls through the picture under the lockup). Hold: as above. Closing: `g01` lifeguard tower at sunset vs `s100` a biplane over a packed Vice City beach (the red convertible pair is gone: GTA VI would have sat on Lucia's forehead, and GTA V on the GTA V car).
- *Lip, not boxes.* A soft dark gradient on each side of the seam (`scrimH` 560; .72 at the seam, .42 at the labels) lies under the lockup inside each pane, so the white labels hold over bright sky.

**Checked on the r10 MP4s:** both hero PNGs, both strips, the entrance sheet; v0 frames 80–91 (the LUCIA rise) at full res; v1 at 0.0, 0.1, 0.3, 0.6, 0.9, 0.95, 1.0, 1.04, 1.07, 1.3, 2.0, 2.55, 2.63, 2.7, 4.37, 4.45, 4.6, 5.2, 5.3, 5.45, 5.6, 5.7, 5.85, 5.95. mpdecimate keeps 180 of 180 frames in both variants. `hyperframes check`: 0 errors; the layout warnings left are v0's tracked glyph boxes overflowing their containers by 9–10 px (the masked reveal).

**Unresolved / for the critic to judge:** in the beach pair, the wing-walker on the biplane climbs to just under "2026 · LEONIDA" from about 5.1 s, as the type exits; GTA V sits over the hikers' legs during the slam pair; v0's Jason half is unchanged from r09 (locked).

---

# v1 history (r01–r06, the rejected look; kept for its content and seek-safety lessons)

## Key design decisions
- **A versus card is a title, not a comparison grid.** Component 05 (labelled split) already labels two clips with era chips. This one is the fight-card moment that opens a head-to-head segment: two clips, one seam, a VS that slams, and two big names. It reads in one glance down the middle of the screen.
- **9:16-native stacked panes in both variants.** All the split references (6pG9 "GAME / REAL LIFE", Fx29) are horizontal 50/50 splits squeezed into a vertical frame. analysis-3 notes there are no native vertical layouts. Both variants stack the clips top and bottom and use 16:9 sources, so each pane keeps about half the original frame width and stays sharp. A first try at side-by-side 540 px columns zoomed the footage about 3x, which looked soft, so it was dropped (round 1).
- **Seam centred at y = 880, not 960.** 880 is the centre of the 230–1480 safe zone, so both clips get about the same visible height above the caption UI, and the VS sits at the optical centre of what the viewer actually sees.
- **Split (v0): a diagonal seam with asymmetric names.** The seam runs from (0, 940) to (1080, 820), about 6.3°. JASON is left-aligned above the seam and LUCIA right-aligned below it, so the eye reads JASON, then VS, then LUCIA down a diagonal. The VS is tilted to the seam angle. Names are fitted to a 470 px maximum so a longer name never collides with the VS.
- **Centre (v1): a straight hairline seam, the bare VS on it, one centred lockup.** Since round 3, GTA VI sits above the VS and GTA V below it, and each year · place label faces the VS, so the lockup is symmetric: name, label, VS, label, name. Every gap is measured on the ink (since round 5: label ↔ name 28 px, label ↔ VS ink 52 px) and GTA VI spans about 70% of the width. Since round 5 there is no chip and no band: the type sits straight on the footage. Since round 6 it is helped by one soft vignette behind the top block and a top-edge grade on the Los Santos pane (see Polish rounds 5 and 6).
- **The seam is a plate edge (since round 6).** It is a fine white rule (2 px at .85 in Split, a 1.5 px hairline at .8 in Centre) with a contact shadow cast by the top pane onto the bottom one, so the split reads as two stacked plates, not a flat cut.
- **Type.** Names use Barlow Condensed 800 caps (188 px in Split, 320 px in Centre since round 4: hero-type scale). Labels use Inter 600 caps at 34 px, tracked 0.30em. The frame uses three sizes: name, VS emblem (168 / 200 px) and label. Names are white with the DESIGN.md layered soft shadow, and Split adds a low seam-side scrim.
- **The VS is the emblem: big, one fill, one shadow (round 3 size, round 4 finish, round 5 unboxed in Centre).** Barlow Condensed 900 caps at 168 px (Split) / 200 px (Centre) with the violet → pink → orange → amber sunset fill, lifted off the footage by a single soft shadow (`drop-shadow(0 6px 18px rgba(0,0,0,.45))`). Round 3's neon rim, plum outer rim and double bloom were cut in round 4 (DESIGN.md: no neon glow soup, no drop-shadow stacks, no cheap strokes; Rockstar keeps glow for the logo only). Its ink box is centred on the seam, and the seam breaks around it in both variants. It is the only gradient in the frame.
- **Motion follows Rockstar's end-card sequence (analysis-3), "the wordmark slams down from oversize", compressed so the lockup reads by about 0.5 s.** See Round 2 for the timings. Since round 3 the seam wipe also reverses at the end (`expo.in`), so the card opens and closes on clip A full-frame and loops without a cut.
- **Real content only:** Jason Duval / Lucia Caminos are the official protagonists; GTA V is 2013, Los Santos and GTA VI is 2026, Leonida (FACTS.md). There are no logos and no Pricedown. All footage is cut from official Rockstar trailers.
- **`bg` is ignored on purpose.** This is a full-frame component that frames footage, so it always shows the CONFIG clips.

## Round 1
- Built both variants, with the hero at 2.4 s.
- Changed Centre from side-by-side columns to stacked bands after seeing soft, over-zoomed footage in the first render.

## Round 2 (critic: v0 6/10, v1 5/10; biggest gap: a late lockup arriving from a black void)
Every listed defect is fixed:
- **Timing: the lockup reads by about 0.5 s.**
  - The seam wipe runs 0 → 0.30 s.
  - The VS slams at 0.16 s and lands at 0.30 s.
  - Name A rises at 0.26 s and name B at 0.36 s; the labels follow at 0.44 s.
  - Reveals were shortened from 0.46 s to 0.36 s. The old 0.2–0.67 s dead hold is gone.
  - The composition went from 6 s to 5 s, because a versus insert is a 2–4 s beat and 5 s is the format minimum.
- **No black void.**
  - Both panes now cover the full canvas on every frame. Frame 0 is clip A full-frame.
  - The seam rises from below the canvas (`expo.out`, 0.30 s), carrying clip B up with it, while clip A pulls back from full height to its pane (a punch-out).
  - It is done with clip-path polygons tweened in the timeline, so it is seek-safe.
  - The exit fades only the type, the VS and the scrims over 4.62–5.0 s. The seam closes back up and the split footage stays full-frame, so there is no black at either compilation cut.
- **No slow-mo stutter.**
  - Every `<video>` now plays at `data-playback-rate="1"`.
  - No plate had a continuous Jason, Lucia, GTA V or GTA VI shot of 5 s or more: the plates cut every 1.5–4 s.
  - So `make-clips.sh` cuts **one continuous shot** per side from the official trailers in `research/gta6/plates/`, removes the letterbox (1920×864, no upscale) and retimes it to 5.2 s with ffmpeg motion-compensated interpolation (`minterpolate` mci/aobmc/bidir).
  - The result: 150 of 150 rendered frames are unique in both variants (checked with mpdecimate) and there are no cuts inside any pane.
  - The clips are:
    - `jason-drive`: Trailer 2, 27.37–32.27 s, x1.06. Jason's face is to camera the whole time, which fixes "Jason is a bare back".
    - `lucia-gate`: Trailer 2, 63.13–66.17 s, x1.71. Lucia lifts her head into a look to camera.
    - `gta5-skyline`: GTA V trailer, 39.41–42.41 s, x1.73. Michael overlooks the Los Santos skyline.
    - `gta6-highway`: Trailer 2, 34.64–38.34 s, x1.41. A POV drive into Vice City under a landing jet, with "VCI Airport" signs.
  - Centre now pairs skyline with skyline, which is a truer "then vs now" than the old red-convertible plate against a five-cut police plate.
- **#subB overflow fixed.** The labels no longer use a negative margin. The last glyph of every label carries no tracking, so right-aligned and centred labels end exactly on their ink. CAMINOS ends at x 936.
- **Scale.**
  - Labels went from 26 px to 34 px, tracked 0.30em.
  - Split names went from 168 px to 188 px, with `nameMaxW` raised from 430 to 470.
  - Centre names went from 156 px to 256 px, so GTA VI spans about 55% of the width (critic asked for at least 55%).
- **VS de-templated.**
  - The flat 132 px gradient disc and its shock ring are gone.
  - VS is now 104 px Barlow Condensed 900 glyphs filled with the Leonida core gradient (#F84FA4 → #FE8E4E → #FEB747), sitting in a gap that the 3 px white seam opens on impact.
  - The impact also gets one soft pink bloom pulse and the ≤7 px footage shake. A white highlight sweeps once across the glyphs at 1.25 s.
- **Rockstar date treatment on the labels.** They are white, wide-tracked caps with a 2 px #EE08F2 right offset and a soft magenta bloom: the "COMING 2025" / "NOVEMBER 19, 2026" style from `refs/official-type`. This treats the type itself and adds no second coloured object, so the VS is still the one accent.
- **Centre label placement changed.** "2026 · LEONIDA" now sits *above* GTA VI, just as "2013 · LOS SANTOS" sits above GTA V, so both sides read year · place, then title.
  - The concrete reason: in the highway shot, the green exit signs pass through the zone under the name, which made a label there illegible for about 1 s.
  - Above the name, the label always sits on clear sky.
- **Kept from round 1 (no defect named):** the stacked panes, the diagonal Z-lockup in Split, the 880 seam centre, Barlow 800 names and the slam-from-oversize motion.
- **Hero time: 3.0 s.** At 3.0 s the lockup has settled, Jason is smiling and Lucia is looking to camera, and in Centre the jet passes over the GTA VI pane with the signs clear below.

## Round 3 (critic: v0 7/10, v1 6/10; biggest gap: the VS was the smallest, flattest thing on screen)

**Defect fixed: the loop pop.**
- From `close` (4.62 s), the wipe reverses over 0.34 s with `expo.in`:
  - pane B's clip-path, the push and the seam all drop off the bottom of the canvas;
  - clip A punches back in to full height;
  - the slow push scale eases from 1.08 back to 1.03.
- The type, VS and scrims fade first (4.56 s, power2.in), and the seam gap closes so a full line travels down.
- Frame 149 is now clip A full-frame, structurally the same as frame 0 (checked frame by frame: 138, 142, 145, 147, 148, 149).

**Biggest gap: the VS is now the emblem in both variants.**
- **Size:** VS went from 104 px to 168 px (Split) and 184 px (Centre). The names were 188 px and 236 px, so the emblem now holds its own between them.
- **Look:** Rockstar's VI language (see Key decisions). The fill adds a violet top to the sunset so it runs cool to warm like the VI mark. There is a 2 px #F84FA4 rim and a 3 px plum outer rim, which separates it from busy footage. The bloom is the critic's spec: `drop-shadow(0 0 3px rgba(248,79,164,.9)) drop-shadow(0 0 26px rgba(163,65,192,.6))`.
- **Split seam:** the seam gap is now half the glyph width + 28 px.
- **Glow scope:** the bloom sits on the glyph group only, never on the chip, so the chip does not glow.

**Centre is now a real style option.**
- The VS sits in an ink-navy #1F202B chip on the seam:
  - radius 20 px;
  - 1 px rgba(255,255,255,.14) inner hairline;
  - `0 2px 2px rgba(0,0,0,.35), 0 18px 40px rgba(0,0,0,.45)` shadow.
- The full-bleed seam is a 1.5 px rgba(255,255,255,.8) hairline under the chip, and it does not split.
- The chip slams from 1.8× (not 2.5×) so a big navy slab never flashes over the frame.

**Centre: the title's backdrop is clear.**
- **Why the critic's fix couldn't work as written.** A 16:9 clip in a 1080-wide pane is height-fitted, so `object-position` y has no vertical slack. Moving the signs down by the ~180 px the critic asked for would have needed about 1.5× extra zoom.
- **The fix: swap the panes.** The Vice City drive is now the top pane, zoomed 1.3× and pinned to the pane's bottom edge (the new `zoom` / `anchor` CONFIG fields).
- **Result for the signs and jet.** The exit signs and the landing jet now travel through y 20–430 for all 5 s, entirely above the lockup. The sign bottoms peak at about 416 at 4.6 s, and the GTA VI glyphs start at about 540. The jet no longer crosses the title.
- **What sits behind the titles.**
  - Behind GTA VI: the dashboard and road early on, then sky.
  - Behind GTA V: the hazy Los Santos skyline. That clip is now framed at `focus: "0% 50%"`, on the towers rather than Michael's head, so no text sits over a face.
- **Reading order.** The demo now reads "GTA VI vs GTA V", the phrasing most comparison videos use ("GTA 6 vs GTA 5"). The years stay with their games: 2026 · Leonida on top, 2013 · Los Santos below.
- **The band.**
  - It now runs .55 / .66 / .55.
  - It spans the lockup plus a 150 px ramp above and below (about 1010 px), rather than a fixed 760 px. The lockup itself is about 710 px tall, so a 760 px band would have left GTA VI on the ramp, over bright cloud.
  - The ramp starts just under the signs, so they keep their colour.
- **Name size.** Centre names went from 256 px to 236 px, so the bigger chip and both blocks fit between the signs and y 1260.

**Split: one divider.**
- Clip A (Jason) is zoomed 1.36× and pinned to its top edge, with focus x set to 74%.
- The car-window edge that read as a crooked second divider now falls below the seam and is clipped away.
- Jason is a tighter, sharper close-up, and his beard and mouth stay clear of "JASON".
- The critic's own options wouldn't have removed it: `object-position` y has no slack (see above), and moving the seam 40 px kept the edge parallel to it.

**Kept (no defect named):**
- the stacked panes and the diagonal Z-lockup;
- the 880 seam centre and Barlow 800 white names;
- the Rockstar date-style labels;
- the 0.30 s seam wipe and the slam with its 3-frame shake.

**Hero time: 3.0 s.**
- Split: the lockup has settled, Jason is grinning in close-up and Lucia is looking to camera.
- Centre: the VCI Airport signs fill the sky above GTA VI.

## Polish round 4 (critic: v0 7/10, v1 6/10; biggest gap: the VS stacked a fill, a stroke, a rim, a double glow and a sheen)

**Defects fixed (all three, checked on the r04 frames):**
- **v1: the VS sat about 10 px low in its chip.** The script now measures the VS ink box (canvas cap ascent + a baseline marker in the DOM) and centres it on the emblem's centre, and the chip is drawn from that ink box + `chipPad` [58, 40]. r04 at 3.0 s: chip y 775–985, VS ink 813–945, so 38 px clear above and 40 px below (centre 879 vs 880). The chip is now 290 × 210. The same centring puts the Split VS on the seam: ink centre 879 vs seam centre 880 (r03: 903).
- **v1: uneven label gaps.** The Centre lockup is now laid out on the ink, not on line boxes: each label baseline ↔ name cap top is `lineGap` 22 px and each facing label ↔ chip edge is `gap` 34 px. Measured on r04: GTA VI → 2026 · LEONIDA 20 px, 2013 · LOS SANTOS → GTA V 21 px (r03: 15 / 33); label → chip 36 px, chip → label 35 px.
- **v1: Michael's dark shoulder sliver on the GTA V plate's right edge.** It drifts in from about 2.3 s and reaches source x≈710 at 3.6 s, so the critic's zoom 1.08 would not have cleared it. The skyline is now `zoom: 1.22, anchor: 0` (left-pinned by `focus: "0% 50%"`, bottom trimmed), which keeps the visible window left of x≈700 through the push. Dark-pixel count in the x 990–1080, y 1440–1920 strip at 2.0 / 3.0 / 3.6 / 4.2 s: r03 672 / 1716 / 2675 / 1408, r04 447 / 398 / 446 / 420 (the r04 numbers are the building's own windows, flat over time).

**Biggest gap: the VS is cut to one effect (both variants, since the emblem is shared).**
- Removed the 2 px pink `-webkit-text-stroke`, the `#vsRim` plum outer rim (the element is gone) and the pink + violet bloom filter. The glyphs keep the sunset fill and get one soft shadow.
- Kept: the size (round 3's fix), the single slam-impact bloom pulse (0.3–0.8 s, motion feedback, not styling) and the one sheen sweep at 1.25 s (motion, not a layer; the critic's fix list didn't remove it).

**Centre: the lockup meets DESIGN.md's rule that the hero object spans 70–88% of the frame width.**
- Names went from 236 px to 320 px: GTA VI now spans x 165–910 (745 px, about 69–70%), GTA V 670 px. The lockup runs y 467–1292, inside the 230–1480 safe zone.
- **Why the top clip changed.** I measured the Vice City highway clip's exit signs frame by frame: at its round-3 framing their bottoms reach y≈473 at 3.5 s and y≈512 at 4.0 s, so they would sit on top of any GTA VI cap that is 70% wide (cap top ≈ 467) and were already within 30–40 px of the round-3 title (the critic's "signs crowd GTA VI"). Zooming the clip further could not lift them enough (it would need about 1.65×). So the top pane now plays **`gta6-sunset`**: Trailer 1 (`QdBZY2fkU-0`), 2.70–4.96 s, the Vice City causeway aerial at sunset, one continuous shot with no letterbox, retimed ×2.30 with the same motion-compensated interpolation (checked: no ghosting on the traffic). The sun and sky sit above the lockup, and the palms and traffic sit behind the band. It is a truer "then vs now" too: a Vice City skyline over a Los Santos skyline. The highway clip stays in `assets/clips/` and `make-clips.sh` as an alternate.
- The band now runs at full strength from the GTA VI cap top to the GTA V baseline, with a 90 px ramp above and a 150 px ramp below.
- Skipped the critic's extra 0 → .35 darkening over y 450–880 on pane A1: the band already covers that zone at .55–.66, and the signs are gone.

**Split: JASON's backdrop and the face-off entrance (v0 fixes, cheap and in keeping).**
- A soft elliptical ink pool (.45 → .3 → 0, 760 × 230 px, centred on JASON at the left edge) is layered into `#scrimA0`, so the light grey car behind JASON is darker. The pool has no hard edge.
- The names still rise out of their mask, and now also slide 40 px in from their own side (JASON from the left, LUCIA from the right, expo.out 0.36 s).

**Kept:** the stacked panes, the seams, the 880 seam centre, the chip, the labels' Rockstar date style, all timings and the loop (frame 0 and frame 149 are both clip A full-frame; checked on r04 v1 at 0 s and 4.966 s).

**Hero time: 3.0 s.** Split: lockup settled, Jason grinning, Lucia looking to camera. Centre: the sunset over Vice City above GTA VI, the jet crossing the sky top-right.

## Polish round 5 (critic: v0 7/10, v1 6/10; no defects; biggest gap: Centre's navy VS chip and flat grey band read as a thumbnail template)

**Biggest gap (v1): nothing is boxed any more.**
- **The chip is gone.** `#vsChip` (navy, radius 20, hairline, shadow) and `chipPad` are removed. The VS is bare sunset-gradient glyphs at 200 px (was 184), its ink centred on the 880 seam so it straddles both clips, exactly like Split's emblem.
- **The hairline breaks around the VS**: `centre.seamGap` 36 px either side of the ink. Measured on r05 at 3.0 s: VS ink x 448–635, hairline gap x 407–672.
- **One soft backlight**: the existing `#bloom` element, in Centre only, is `radial-gradient(closest-side, rgba(248,79,164,.30), transparent)` at 1.4× the ink box. It flares (×1.5) on impact, settles behind the glyphs and fades with the type. Split keeps its impact-only pulse. This is a single quiet radial behind the glyphs, not round 3's drop-shadow glow stack on the glyphs, so round 4's "one effect on the VS" decision stands.
- **No band.** The full-width .55 / .66 / .55 band (the "grey slab" and the bright haze stripe at y 1320–1450 below its ramp) is replaced by one soft ink ellipse per title block, 640 × 300 px radii, layered into `#band1`'s background (no new element). That keeps Vice City pink and Los Santos blue.
  - **Where they sit (a deliberate change to the critic's spec).** The critic asked for one vignette at .42 centred at y 1180. With only that, the "2013 · LOS SANTOS" label sat on near-white haze: measured luma 169 behind it, so white 34 px type was about 2.3:1. Each ellipse is therefore centred where its label meets its name, and the bottom one is .55 (`centre.vignette` [.42, .55]). Measured luma behind the label at 0.45 s (before it fades in): r04 band 68, critic's spec 169, r05 120 (about 4.5:1), with no edge anywhere. The `hyperframes check` contrast pass is 16/16.

**Fixes from the list:**
- **Labels (both variants):** the magenta 14 px bloom is gone and the offset is 1.5 px at .75 (was 2 px at .9). At 360×640, DUVAL / CAMINOS and both year · place lines now read as white type with a faint magenta edge, not pink fringing, so the VS is the one accent.
- **Centre stack opened:** `gap` 34 → 52 (now measured to the VS ink, since the chip is gone) and `lineGap` 22 → 28. Measured on r05: GTA VI 479–702, 2026 · LEONIDA 731–755, VS ink about 810–950, 2013 · LOS SANTOS 1004–1028, GTA V 1057–1280. That gives label ↔ VS 55 / 54 px with nothing in between, and the lockup sits inside the 230–1480 safe zone.
  - **`nameSize` stays 320 (not the suggested 300).** The critic's own goal was "so GTA VI keeps its ~750 px width". At 300 it would shrink to about 700 px (65%), under DESIGN.md's 70% rule that round 4 deliberately met. At 320 it measures 745 px, and the opened stack still fits.
- **Lucia faces the camera before her name lands (v0).** `lucia-gate.mp4` is recut from Trailer 2 at 63.55 s (was 63.13). That is about 0.85 s later in clip time, and the source shot ends at 66.2 s, so the clip is retimed ×1.98 (was ×1.71) with the same motion-compensated interpolation. Checked frame by frame: her face is up from clip frame 0, and the r05 render shows her looking to camera on every frame from 0.2 s to 0.57 s. The fence shows no interpolation ghosting. `make-clips.sh` is updated.
- **A real slam (both variants; the emblem motion is shared).**
  - The VS now falls from 2.5× to 1.18× (`power4.in`, 0.14 s), then snaps 1.18 → 1 in 0.10 s (`expo.out`). Before, it landed at 1 and floated through a soft 1 → 1.1 → 1 rebound.
  - Footage shake is now 6 px ([6,−6], [−6,5], [3,−2], 0).
  - Centre also slams from 2.5× now; 1.8× existed only to keep the navy chip from flashing.
  - **Names moved back so the hit gets its own beat:** `nameA` 0.26 → 0.36, `nameB` 0.36 → 0.44, `tags` 0.44 → 0.52. In r05 the hit is frames 9–10 (0.30–0.33 s) with no name on screen, JASON / GTA VI start rising on frame 11, and the lockup reads by about 0.6 s.

**Checked on the r05 MP4s:**
- Frames 6–17 of both variants (the slam and Lucia).
- Frames 0 / 136–149 (the loop): frame 149 is clip A full-frame in both variants.
- mpdecimate: 150 of 150 frames are unique in both, so no plate freezes.
- Hero PNGs at full size and 360×640, and both strips.

**Kept:** the stacked panes, both seams, the 880 seam centre, the diagonal Z-lockup, Barlow 800 names, the Rockstar date-style labels (quieter), the sheen, the wipe, the close and the clips except Lucia.

**Hero time: 3.0 s.** Split: lockup settled, Jason grinning, Lucia looking to camera. Centre: the bare VS on the seam, Vice City sunset above, blue Los Santos below.

## Polish round 6 (critic: v0 7/10, v1 8/10; one defect; biggest gap: the lockups are built from default parts: soft-shadow Barlow, a flat seam, a VS nearly the size of the names)

**Defect fixed (v0): the car-window edge no longer shows as a second divider on the open and close.**
- **The cause.** In `jason-drive.mp4` the window glass edge sits at source y 634–656 of 864 (measured on every frame across the visible x range). While pane A was taller than its 1278 px settled box, the clip was only as tall as the pane, so the edge rode at about 74% of the pane height: y≈1425 on the full-frame frames, and above the real seam for frames 1–3 and 146–147.
- **The fix.** Clip A now names that line in CONFIG (`a.hide: 0.735`). While the seam travels, clip A's box is `max(settled height, (lowest seam point, capped at the canvas bottom, + 20 px) / hide)`, so the edge rides just under the seam and is off-canvas on the full-frame frames. It is a plain GSAP height tween whose ease is built from the seam's own `expo.out` / `expo.in`, so it tracks the seam exactly and stays seek-safe (no onUpdate). Frame 0 and frame 149 are now a close-up of Jason's face (1.37× the full-frame cover) that punches out to the pane. The settled zoom went from 1.36 to 1.38, which the 20 px margin needs.
- **Why not the critic's other options.** Starting the wipe 360 px above the canvas bottom would show Lucia on frame 0 and still leave the edge (at y≈950) above a seam at 1300, and it would break the "frame 0 is clip A full-frame" loop decision. A fixed 1.75 zoom while the pane is tall would be softer than needed.
- **Checked on the r06 MP4:** frames 0–5 and 144–149 show one divider, frame 0 has no edge, and mpdecimate keeps 150 of 150 frames in both variants.

**Fixes from the list (cheap and in keeping):**
- **Seam material (both variants).** Split's rule is now 2 px at rgba(255,255,255,.85) (was 3 px solid white). Both seams lost their symmetric 18 px glow and gained a contact shadow under the rule: the profile of `drop-shadow(0 6px 18px rgba(0,0,0,.45))` from a straight plate edge (.34 at the rule, gone by 26 px), drawn as a `#seam::after` strip. It rotates and travels with the seam, so it adds no new element and no per-frame filter on the video. It runs under the VS gap too, because the plate edge does.
- **v1: the grey smudge behind "2013 · LOS SANTOS" is gone.** The bottom ink ellipse was replaced by a top-edge grade on pane B (`#scrimB1`, which already existed), the same shape as Split's pane-B scrim: .55 on the seam, .37 at 38%, 0 at 440 px (`centre.grade`). It reads as the shade the top plate casts, not as a patch. I used .55 rather than the critic's .40 because the label sits on near-white haze. Measured luma behind the label at 0.45 s (before it fades in): r05 ellipse 118, r06 grade 122, so legibility is unchanged. The top ellipse behind GTA VI stays (`centre.vignette` is now a single number, .42); the critic didn't flag it.
- **v0: the magenta blob beside the VS is subdued.** A pink object passes behind Jason's chin at about 2.6–3.3 s. A soft local darken (`a.shade`: 230 × 130 px radii at (620, 745), .5 at the centre) is layered into `#scrimA0`. I went above the critic's .35 because at .35 the blob still read pink (mean RGB 56/29/38). At .5 it measures 45/24/31 at 3.0 s, against r05's 73/33/46, so it reads as a dark plum shadow, not a second accent. At other moments the patch is invisible inside the existing seam-side scrim (checked at 1.0, 2.0, 2.8, 3.2 and 4.2 s). I didn't use the focus move to 82%: it would slide Jason's beard over JASON, which round 3 deliberately avoided.
- **Sheen tamed.** The highlight now peaks at .35 white (was .85) and sweeps in 0.5 s (was 0.7). At 1.4–1.6 s the V picks up a soft light band and never blows out to white.

**Not taken: shrinking the VS (168 → 132 in Split, 200 → 168 in Centre).** The critic gave it as taste, not as a defect. Round 3 enlarged the VS on purpose, after that round's critic found it "the smallest, flattest thing on screen", and round 5 set Centre's 200 px when the chip came off. Shrinking it now would flip-flop on that decision. The new seam material and the quieter sheen address the "default parts" gap without changing the hierarchy.

**Kept:** the layout, all type sizes, the labels, the timings, the loop, the clips and the Centre top vignette.

**Hero time: 3.0 s** (unchanged).
