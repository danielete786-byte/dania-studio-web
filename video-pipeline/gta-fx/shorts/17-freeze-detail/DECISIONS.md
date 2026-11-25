# Freeze-frame detail: decisions

## v2 concept
- **One idea:** the trailer stops dead on one frame and the camera keeps moving. The world drains to a cold, dim mono, and only the detail keeps its colour, lit like it is the one thing that matters. The word that names it lands big, in the image. Then the colour floods back and the trailer runs on.
- **Shots:** v0 "Spotlight" holds `s014-driveby-police` (Trailer 2 0:47, the police stop in front of the Haitian mural): it plays 0–1.0 s, freezes on frame 60 for 3.35 s, then resumes at 4.35. v1 "Scan reveal" uses our own 4K re-crop of `s011` (Trailer 2 0:37, the jet over the I-35 signs): it plays 0–1.0 s, freezes on frame 80 for 3.3 s, then resumes at 4.3. Each is one held shot with a push, not a cut, because a freeze-frame is one shot by definition.
- **Type:** v0 sits in the lower third (block bottom y 1466), over the drained police car and dashboard. The detail is the top half, so the bottom is dead dark space. v1 sits in the band of open sky between the jet (above) and the sign (below), about 339 px of clear sky that the re-crop was framed to leave.
- **Hero:** Archivo wide 900. v0: "HAITI" at 200 px, white, with a warm bloom from the lit emblem. v1: "AMBROSIA" at 112 px, 114 % stretch (756 px, 87.5 % of the safe width), with the sunset fill and a sheen.
- **Payoff:** v0 hits at 1.0 s, on the freeze itself: impact shake plus a 3 % zoom kick, an exposure pulse (1.7), the camera punching 1.025 to 1.13, and the iris closing onto the coat of arms over 0.72 s. "HAITI" lands at 1.34 s with a 4 px chroma split. v1 hits at about 1.58 s: the scan blade passes the bottom of the sign, the sign cut-out lifts toward camera (1.07, with a contact shadow and an exposure pulse), and "AMBROSIA" reveals in the sky above it.

## Key decisions
### The freeze is a real still (changed from v1)
v1 built the freeze from a chain of 0.1× playback-rate video clips. v2 uses one pre-extracted PNG per variant, which is the method the HyperFrames docs recommend. It is simpler, exact, and lets the same pixels be layered three ways: colour, mono surround, and the cut-out.
- The renderer shows frame floor(t × 30) (measured in v1 r05–r06 against the plates). To freeze on frame N: the play clip ends at `freezeAt` with `data-media-start = N/30 + 0.002 − freezeAt`, the still is `select=eq(n\,N)`, and the resume clip starts at `resumeAt` with `data-media-start = N/30 + 0.002`. So the first resumed frame is the frozen frame, and playback continues from it with no jump.
  - v0: N 60, play media 1.002, resume media 2.002.
  - v1: N 80, play media 1.669, resume media 2.669.
- HyperFrames inlines `<img>` sources as data URIs. That is why `check` warns `duplicate_media_discovery_risk`, which is harmless here, and why the script checks only the `<video>` `src` against CONFIG.
- Each variant's still, mono copy and cut-out sit in one `class="clip hold"` div on one track, so the hold is a single clip.

### Layering: everything that is "the picture" sits inside `#shake > #push`
The play video, the hold stack (still, mono, scan, lifted sign) and the resume video are all inside the push wrapper. The frozen frame, its grey surround and the cut-out are therefore always pixel-registered, through the impact shake and the push. Type and scrims are outside it (`#ov`), so the type never scales with the footage.
- **Push lane:** the scale runs 1 → 1.025 linearly during play, punches to 1.13/1.12 on the freeze (expo.out, 0.8 s), creeps to 1.19/1.17 through the hold (sine.in), then snaps back to 1 on resume (expo.out). Scaling at least 1 about an interior point always covers the frame, so there are no edges.
- **Origins:** v0 scales about (1080, 789), so the emblem rides up and left, away from the type. v1 scales about the sign's top edge (545, 912), so the sign stays put and the jet climbs away from it: the sky band the type sits in opens up during the hold.
- The hold has constant camera motion. In v1 r07 the critic read a static hold as "buffering".

### v0 "Spotlight": the iris
- **Mask:** the still in colour on the bottom layer, with the mono copy above it (`CONFIG.surround`: greyscale, a cool sepia/hue turn, brightness .44, contrast 1.12). The mono copy has a CSS radial mask, an ellipse at (650, 600), rx 404, ry 362, feather .36, so the colour shows through a soft hole.
  - The hole starts at radius 2600 (no surround), so it reads as the world draining from the edges inward, not as a widget popping on.
  - It closes over 0.72 s (power3.out) from 1.06 s.
- **Pool light:** inside the hole, the still gets `brightness 1.2 saturate 1.28 contrast 1.07`, and a warm screen-blend glow sits on the emblem. The coat of arms is the brightest thing on screen, lit as if by a practical light, with no ring, pin or leader line (DESIGN.md: avoid callout idioms).
- **Frame 60** shows the whole emblem under the mirror line, with no A-pillar yet. The resume ends at clip 2.65 s, just before the car's A-pillar sweeps in from the bottom left.
- **Type:**
  - "HAITI" at 200 px. A −0.075 em optical shift puts the H's ink on x 72 with the kicker and the line; this is the intentional overflow `data-layout-allow-overflow` marks.
  - Kicker "TRAILER 2 · 0:47" with a two-bar pause glyph (25 px, .3 em tracking).
  - Line "Its coat of arms, painted on the mural behind the police stop." in Inter 600, 38 px, balanced over two lines.

### v1 "Scan reveal": the blade and the lifted sign
- **Footage:** `assets/clips/s011-vice-highway-signs-v.mp4` is our own re-crop of the 4K master (crop 972×1728 at 1264,216, then scaled to 1080×1920), with the same GRADE chain as `tools/gta/build_shots.py`.
  - It is frame-aligned with stock s011: PSNR 43 dB where the two overlap.
  - The framing puts the "VCI Airport / Ambrosia" sign on the column centre, the jet above it, and clear sky between them.
- **Scan:** a 4 px white blade with a sunset glow and a 260 px screen-blend trail. It sweeps 0 → 1960 in 0.85 s (sine.inOut), so it is on screen for about 24 frames; in v1 r07 the critic counted only about 6.
  - Above the blade, the frame is mono (clip-path inset on the mono layer).
  - The scan layer is behind the lifted sign, so the trail never washes over it.
- **Sign cut-out:** a `clip-path: path()` of the green and yellow panels, measured on frame 80 (top 912.5, bottom 1257, left edge 315 → 310, right edge 776 → 780 → 775), with the path inset about 1 px so no blue sky fringes.
  - It sits in a drop-shadow wrapper, because a clip-path clips its own shadow.
  - The lift time is computed by inverting the scan ease numerically, so the sign pops on the exact frame the blade clears its bottom edge (about 1.58 s).
  - The exposure pulse on the cut-out peaks at about 1.68 with a 2-frame hold, then settles at `brightness 1.06 saturate 1.08`.
- **Type:**
  - "AMBROSIA" in the sunset gradient via `Look.fill`, plus `Look.sheen` at about 2.57 s.
  - Kicker "TRAILER 2 · 0:37".
  - Line "On the 35 North exit for VCI Airport." The VCI Airport is in Ambrosia (FACTS.md places), so the sign is the detail and the hero names it.
- **Exit:** the type leaves first (3.66 s). The sign settles back (3.80 s), and a reverse scan (3.84–4.30 s, power2.in) wipes colour back from the bottom up. Playback resumes on the frame the wipe finishes.

### Finishing and seek-safety
- **Look kit:**
  - `install` (grain .15, vignette .5), only when `bg` is `plate`.
  - `impact` with `flash: 0`: no white flash, per the critic lessons.
  - `expose` on the freeze and on the resume.
  - `reveal` (character masks), `enter`/`exit` with blur, and `chroma` at 4 px (the cap is 6).
- `Look.drive` calls its function with 0 at build time. The reverse drives (iris open, scan back) would leave a wrong initial state, so after all drives the script explicitly resets `setHole(0)` / `setScan(y0)` and clears the filters. Seeking to 0 shows the plain playing clip.
- `Look.exit` replaces `filter`, which would kill the hero's drop-shadow bloom. So the exit targets a `.heroWrap` wrapper instead.
- `bg: "none"` only turns the finishing off (no grain or vignette). This is a full-frame component, so the footage still shows.

### Carried over from v1 (r01–r07, rejected as "basic")
- Freeze frame mapping floor(t × 30), and N/30 + 0.002 (see above).
- The picture never sits frozen without motion or a graphic. In v2 the push never stops, and the type exits overlap the colour return.
- The detail stays at native sharpness. v2 uses 4K-derived shots, and the push tops out at 1.19 on a 1080 master cut from 4K.
- Dropped from v1:
  - the ring/target/leader callout (a stock idiom);
  - the smoked-glass card and corner brackets (a generic card);
  - JetBrains Mono timecodes and the small 76–104 px titles;
  - 16:9 plates with `reframeX`.

## Round log
### v2 round 8
v1 (r01–r07) was rejected by the owner as "basic, not professional or clean-looking". This round rebuilt the component from scratch on the craft-v2 rules.
- **Shots:** new 4K shots. s014 (the mural) replaces the p10 ankle-monitor plate for v0. A custom 4K crop of s011 (the I-35 signs) replaces the p04 mural punch-in for v1, and the mural moved to v0.
- **Freeze:** pre-extracted stills replace the 0.1× playback-rate clip chain.
- **New look:**
  - v0: a cold mono surround with an iris into a warm-lit pool, instead of the ring lens and leader.
  - v1: a full-frame scan blade with the sign lifted out of the frame, instead of the window, brackets and glass card.
  - Both: the Look kit finishing, and v2-scale Archivo wide heroes (200 and 112 px) integrated into the image's own empty space.
- **Fixes during the round:**
  - `template_literal_selector` check error: the selectors are now built by string concatenation.
  - Reverse `Look.drive` build-time state: reset after the drives.
  - The hero bloom killed by `Look.exit`: the exit now targets the wrapper.
  - Blue sky fringes on the sign cut-out: re-measured, path inset 1 px.
  - AMBROSIA at 94 % of the safe width: 114 % stretch.
  - HAITI ink at x 87: −0.075 em shift.
  - v1 freeze exposure 1.72 blew the clouds out to white for 4 frames: now 1.4, and 1.18 on resume.
  - Scan visible about 10 frames: now sine.inOut, 0.85 s from y 0, with the pop time from a numeric ease inversion. The first formula assumed power2 is quadratic; it is cubic.
  - The scan trail washed over the sign: the scan now sits behind the lift.
  - The v0 surround was murky: brightness .34 → .44, and a stronger pool lift.
  - The v0 tail ended on the A-pillar sweep: the hold is now 3.35 s and the resume is cut at clip 2.65 s.
  - The exits are tightened so the colour return never shows a bare freeze.
- **Inspected on the final capture:**
  - the hero PNGs, strips and entrance sheet;
  - frames at 1.1, 1.4, 1.7, 3.9, 4.15, 4.4 and 4.7 s per variant.
  - Clean: no clipping, everything in the safe zone, no orphans, Archivo and Inter only, no faces covered, no frozen frame without motion.
- **Hero time:** 2.6 s.
