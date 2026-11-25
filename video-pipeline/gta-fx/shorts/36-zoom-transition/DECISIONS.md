# DECISIONS: #36 Punch zoom transition

## Round 1

### Format
- **Full-frame, footage always shows, no on-screen text.** A transition sits between the creator's own clips. Text would fight their captions and the next component, so the craft goes into the motion and the light. `bg` is kept for parity but ignored, as with the other full-frame components (#06, #34).
- **6.0 s, cut / peak at 2.1 s in both variants**, so the shared hero time shows each variant at peak blur. The cut is at 2.15 s, not 2.1, so the even 8-frame strip doesn't land on the near-white flash frame.

### Variant 0: Punch zoom
- **Reference:** the radial "zoom-in" punch the top compilations use on title cards and rank changes (`refs/title-card-zoom-in`, plus analysis-2's "fan title: radial zoom blur"). Ours is a clean, physically believable version without the cheap CapCut look: a true radial blur, centred on a chosen subject, that grows with the zoom speed.
- **Technique:** 10 stacked copies of the clip (base + 9 echoes) at scales s·(1 + k·i/9), with opacities 1, 1/2, 1/3 … so the average is equal-weighted. That is a real zoom blur, not a gaussian. A small gaussian (≤5 px) smooths the steps. The echo `<video>`s are timed only for the ~0.4–0.6 s blur window, with `data-media-start` offsets so they show the same frame as the base.
- **Curves:** A punches cubic-in from 1.035 to 1.9× over 0.36 s, with blur ∝ u^2.1. B lands from 1.75× with quart-out over 0.52 s, and the blur decays as (1−v)³. Both clips have a slow 3.5% push while they hold, so a still plate never looks frozen.
- **Flash:** warm white (#FFF → #FFF8EF → soft peach edge), centred on the punch point, 0.86 peak at the cut, rising over 0.09 s and decaying exponentially (τ 75 ms). It hides the join without a full-frame white-out.
- **Vignette** up to 0.55 while blurred, to tunnel the eye. I reduced it from 0.9 after round-1 self-review, because the flash over the vignette went grey and murky. Brightness lift went from 0.22 to 0.15 for the same reason.
- **Clips:** the police SUV charging through gunfire (p09 0–2.15 s, focus on the SUV at 64%/45%) punches into "Welcome to The Keys" (p01). That's an action beat into a location reveal.

### Variant 1: Whip pan
- **Reference:** the whip/swish cut in analysis-1 ("directional-blur smear out/in ~0.25 s on whip cut"). Built as a camera whip: A and B sit side by side on one 2160 px strip that slides under a fixed camera with power4 in-out. The blur is an SVG horizontal-only gaussian whose σ = real strip speed × 13 ms shutter (cap 95 px), so the blur follows the motion exactly.
- **Seam light leak:** the one Leonida-sunset accent. It's a vertical band (pink → amber edges, white core) screen-blended over the join. It sits outside the blurred strip, so it reads as light and not as mush. Its width and softness scale with speed. In the first pass it lived inside the strip, got blurred away and couldn't be seen, so I moved it out.
- **Blur strength:** the first pass had a σ cap of 130 and made the hero frame unreadable mush. I lowered it to 95 with a 13 ms shutter, so both shots stay recognisable mid-whip.
- A camera scale bump (+6% at mid-whip) and a soft full-frame flash (0.34 peak, cubic in speed) add impact without a white-out.
- **Clips:** Lucia at the gate at golden hour (p06 from 2.45 s) whips into the drive-by past the Haitian mural with police (p04). Character to location; the drive-by's own lateral motion continues the whip.

### Determinism
- One linear GSAP clock tween (0 → 6 s) writes a getter/setter that calls `render(t)`, so everything is computed from t. There's no onUpdate, no randomness, and `tl.seek(0)` at the end.

## Round 2

The critic scored round 1 at v0 6/10 and v1 7/10. v0 had four defects: stepped echo copies instead of a blur, a milky beige flash, a one-frame hitch at 1.83 s, and a B plate with its own hard cut followed by dead drone footage. Both variants also jump-cut at the loop point.

### Both variants: one WebGL motion-blur pass
- **The echo stack and the SVG gaussian are gone.** Each variant now draws its footage with a single full-screen WebGL fragment shader (raw WebGL, no library). It samples 48 taps per pixel, offset by interleaved-gradient noise and averaged in linear light, so streaks are continuous (no stepped copies) and bright lights smear into bright streaks rather than grey.
- **The blur is a shutter.** It averages the frame across the positions or scales the move covered while the shutter was open, so its length comes from the move's real speed. That makes it a true motion blur that peaks exactly where the move is fastest.
- **Footage:** the clips are framework-owned `<video>`s in an invisible bank (opacity 0). At render time the shader uploads the frame `<img>` that HyperFrames injects after each video. It repaints on every timeline seek and again on `hf-seek`, with `waitUntil(img.decode())` when a frame isn't decoded yet.
- **No hitch:** one continuous source video per shot replaces the 9 echo videos that each started mid-clip. The round-1 duplicate at 1.80–1.83 s came from those echoes. One remaining near-duplicate pair (v0 frames 151–152) is inside the p05 source itself (diff 0.1 at media 3.27 s), not the component.
- **Flash as exposure, not a white veil:** the flash multiplies linear light (`x(1 + 2.5·F)`), so highlights burn first and blacks stay black, and it only mixes toward white as F³. This removes the milky beige wash, and the cut frame (F = 1) is pure #FFFFFF.
- **Seamless loop:** the critic proposed running the transition back, and both variants now do. The second clip uses clip A again (`a2`), timed to end on the frame just before A's in-point. The loop-point frame difference is 19.6 for v0, against 25–35 for A's own motion, and 6.8 for v1, against 6.2 for its neighbouring frames.
- **Hero time 1.75 s** (frame 53): v0 is one frame before the white cut at peak radial blur, and v1 is at mid-whip.

### Variant 0: Punch zoom
- **Timing follows the critic's numbers:** punchIn 0.24 (was 0.36), land 0.30 (was 0.52), flash 1.0, flashDecay 0.05.
  - The flash rule is a whole-frame pattern: 0 → 0.12 exposure on the last frame of A → one pure-white frame → exp(−dt/0.05). In the render, luma is 90/95 on the last two A frames, 235 (white) on the cut frame, then 165 / 142 / 130 / 122 as the exposure falls off.
  - Clip A has no veil before the cut. A punch-grade (saturation +12%, contrast +8%, edge vignette ≤0.32, all multiplied) holds contrast while A accelerates.
- **Blur:** shutter 0.04 s, cap 0.32. That gives ~5 visibly blurred frames (k = 0.04 → 0.08 → 0.13 → 0.17 → 0.21), so it reads as a 4–6 frame punch.
- **B lands from 1.25× (was 1.75×),** with quart-out over 0.30 s. Its blur dies in about 4 frames, so it lands sharp.
- **Clip B changed** from p01 to p05, the man at the truck. p01 hard-cuts at media 2.4 s (pole wipe to MARINA) and can't cover 3.9 s. p05 is one continuous shot from 0 to 5.03 s, and he gestures the whole time, so there's no dead footage. Action → reaction is still a clear compilation beat.
  - A is now p09 from in-point 0.3 s, with the cut at 1.8 s (media 2.1 s, the SUV at its biggest, front-on), focus [0.48, 0.42].
  - Known limit: the vertical p05 plate crops the man's face at the right edge late in the shot. The horizontal plate would need a 1.78× upscale to recentre him, which would cost the sharp landing, so I kept the vertical plate.
- **Return punch at 5.70 s:** B punches into its subject (focus [0.78, 0.40]), flashes white, and A lands on the frame before its own in-point.

### Variant 1: Whip pan (kept: strip under a fixed camera, sunset seam leak, clips p06 → p04)
- **whip 0.40 (was 0.62).** B now settles about 6 frames after the seam passes, not 7+ frames later.
- **Blur:** the SVG gaussian (σ ≤ 95) is replaced by a true box shutter of 0.03 s, capped at 330 px (≈ σ 95), with 48 taps.
  - A small vertical spread (7% of the streak length, a hint of camera shake) breaks up the horizontal striation.
  - It also fixed a scalloped edge that the chain-link fence in A produced against B's black car roof on the first r02 pass.
- **Seam leak:** as the critic asked, the white core runs 47–53% with warmer intermediate stops, the leak always has at least blur(6px) (up to 16 px at speed), and streak is 0.8. The full-frame flash is now the same exposure push, at 0.22.
- **Return whip at 5.55 s:** the picture travels back right into A. It finishes one frame before the loop point, so the camera bump and blur are fully settled. A's in-point moved to 2.95 s so the return clip (media 2.46 → 2.95 s) stays after p06's cut at 2.4 s. The camera drift is now a sine that returns to 1.0 at the loop point.

## Round 3

The critic scored round 2 at v0 7/10 and v1 5/10. The defects were:
- v1's whip left a serrated strip of A and a visible A/B seam for about 5 frames, with a hard white "lightsaber" leak.
- v0's cut frames (n=54/171) were flat #FFFFFF cards.
- v1 had striation in the blur and v0 had barcode copies.

All of these are fixed. Deliberate earlier choices are kept: the clips, the cut times, the return-for-loop, the punch timing (punchIn 0.24, land 0.30, zoomB 1.25), and the whip length (0.40).

### Both variants: sampling
- **96 taps** (was 48) on WebGL2, falling back to WebGL1.
- **Mip pre-filter:** every tap reads a mip level of log2(1 + prefilter × streak length in texels). The v0 barcode turned out to be in the source: the SUV's light bar is a row of discrete LEDs, and any radial smear of them stays striped. Pre-blurring the source in proportion to the streak merges the LEDs into one bar of light before it's smeared. The same pre-filter turns v1's chain-link fence into soft horizontal light instead of striation. The critic's "clamp acc to 1.5" didn't apply, because the samples are already ≤ 1.
- **Tapered shutter:** the tap weights are smoothstep(0, .3, f) · smoothstep(1, .7, f). Box-shutter streaks of bright features, such as A's gold pillar, ended in hard vertical edges that read as strips. With the taper they fade out at both ends.

### Variant 0: Punch zoom
- **Exposure burn, not a white card:** flash 1.0 → 0.75, and the `mix(c, white, F³)` is removed. The flash multiplies linear light by 1 + 2.5·F, adds a warm lift of 0.54·F² (slightly weaker at the edges), and rolls into a soft shoulder, so the burn has gradation.
  - Measured on the cut frame n=54: YMIN 126, YAVG 197 (the target was YMIN > 120, YAVG ~200). B's man, shirt and truck read through the burn. n=171: YMIN 133, YAVG 173.
  - The lift scales with F², so the blacks are back by about frame +3.
- **Two-sided punch:** B now arrives streaked. The radial blur is max(shutter blur, landStreak 0.55 × maxSpread 0.36 ≈ 0.2) × (1 − v)² over the 0.30 s land, which matches the critic's 0.6 × 0.32. The return landing into A2 does the same.
- **More abstract pre-cut frame:** zoomA 1.9 → 2.3 (critic), shutter 0.04 → 0.045, cap 0.32 → 0.36. The streak k climbs 0.07 → 0.14 → 0.21 → 0.25 → 0.29 over the last five A frames, so it still reads as acceleration and not a jump to a smear.

### Variant 1: Whip pan, rebuilt as a true whip
- **No strip, no seam.** A and B no longer sit side by side under the camera.
  - Each clip is drawn full-frame and slides `travel` (0.65 W) on a power4 in-out curve: A accelerates out, B decelerates in.
  - The edges are mirrored, which hides them under the blur. Mirroring was chosen over wrapping because a wrap would bring Lucia's face back in from the right.
- **The cut is a moment in time, inside the shutter.** Each tap carries its own instant in the (centred) shutter window. Taps before the switch (start + whip/2, exactly frame 53) sample A, and taps after it sample B.
  - So frame 52 is 100% A, frame 53 is a ~50/50 mix of two ~500 px smears, and frame 54 is 100% B. No frame contains an A/B boundary.
- **Blur:** shutter 0.05 s (centred, tapered), cap 760 px. Streaks run ~70 → 210 → 400 → 700 (peak, ~500 effective) → 400 → 210 px, against the ≥300 px the critic asked for at the switch.
- **shake 0.07 → 0** (it made the chevron teeth). Vertical softening now comes from the mip pre-filter (0.06/px of streak).
- **Leak:** the white-core CSS band is gone.
  - It is now a #FE8E4E glow added in linear light in the shader, peak 0.3 (critic: 0.35). Its half-width is 120 px plus 0.6 × the streak, and it falls off vertically too, so it's a blob and not a column.
  - It rides the virtual join, which is at frame centre at the switch, and is gated by smoothstep(0.45, 0.95, speed). It only shows on the 1–3 peak frames and is gone before either landing, so it no longer crosses Lucia's face.
  - The full-frame exposure flash is now amber-tinted (1, .8, .55).
- **Return whip:** returnStart 5.55 → 5.5667, so the return switch is at frame 173 and the landing is on frame 179. The loop PSNR from 179 → 0 is 30.8 dB.
- **Bank timing:** each clip is live only while the shutter can see it (A until switch + 0.025 + 1 frame, and so on). A2's in-point is now 2.648 s, still after p06's cut at 2.4 s.

### Hero time 1.66 s (frame 50)
The r02 hero was a peak-blur frame and lost the blind pick to crisp references. Frame 50 shows each effect clearly underway with the subject still readable: the SUV's radial punch with sparks streaking (v0), and Lucia starting to smear out left (v1).
