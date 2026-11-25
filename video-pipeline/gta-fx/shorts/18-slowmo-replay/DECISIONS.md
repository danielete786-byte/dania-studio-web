# Decisions · 18 Slow-mo replay

## Round 3 (fixes from the r02 critique: v0 6/10, v1 7/10)

**Timecode rollover (defect).** `fmt()` now rounds to whole centiseconds first (`cs = Math.round(s*100)`, then minutes, seconds and hundredths from integers). v1 frame 30 reads `00:01.00` instead of `00:00.100`, and no whole second can roll over in either variant.

**No white flash (defect).** `#flash` is deleted from both variants. Each replay cut is now hard, with a 3-frame sideways camera hit on the footage wrapper: x = 6, −4, 2 px (CONFIG `hit.px`), plus just enough scale to cover the shifted edge. Measured on the r03 renders:
- v1 luma across the cut stays at 68.3–68.9 (frames 56–62). In r02 it jumped from 69 to 92.
- v0 shows no spike at the jump back.
- The edge columns never go black on the hit frames.

**No held frames anywhere (defect).** I diffed every frame against the one before it, in both renders. The lowest diff is now 4.1 in v0 and 1.5 in v1, where r02 had several 0.0 diffs.
- **v0, at the jump back:** the drag-back file opens on source 2.567, the same frame the lead-in ended on. The lead-in now starts one source frame earlier (`mediaIn` 1.167, `range` moved with it) and still runs for 1.4 s. So it ends on 2.533, and the scrub opens on 2.567. T1 and T2 stay at 1.4 and 1.7. I tried the critic's "T1 − 0.033" first, but it pulled T2 earlier, and the replay then ran into the last held frame of `v0-p09-slow.mp4` (frames 129+). With the 1.4/1.7 timing, the replay ends on slow frame 128, its last unique frame.
- **v1, at both ends of the rewind:** the power2.inOut rewind starts and settles at zero speed, so its first and last frames repeat. That gave a 1-frame hold at `00:01.00` and the 2-frame hold on `00:00.00` the critic saw. Changes:
  - I re-baked the rewind over 1.0333 s (31 frames, `timing.curve`).
  - It plays from `trimIn` = one frame in, for its 29 unique frames (`back` 0.966).
  - `srcAt` mirrors the trim.
  - `00:00.00` now shows for exactly one frame (frame 59), the first frame of the replay.

  The longer rewind also pushes the replay start to 1.967 s. The replay then ends on slow frame 120, before the 5-frame pad hold at the end of `v1-p08-slow.mp4`. Making the rewind 0.13 s longer barely changes its peak speed (about 1.9× instead of 2.2×). In an earlier r03 pass, a shorter rewind pushed 4 frozen frames onto the end of the loop.

**v0: the rail now speaks the race-HUD language (biggest gap).** The smoked pill, the JetBrains Mono timecode, the outlined 36 px trim box, the ticks and the "you were here" ghost are all gone. The rail is now plate-less and follows `hud-official-gta6-race-position`:
- **Timecode:** white Barlow Condensed 700, 44 px, tabular, matching Rockstar's `00:22.08`.
- **Track:** one 6 px rail at 26 % white. The replay range is a 6 px segment at 50 % white with 3×28 px `[` `]` in/out brackets. The played fill is solid white, and the knob is a solid 30 px dot.
- **Legibility:** v1's bottom scrim now also sits under v0's rail, and the type uses the DESIGN.md soft shadow, not a plate.

v0 stays different from v1: it is a round-knob scrubber with an editor's in/out range, while v1 is a ruler with ticks and a bar playhead.

**v0: the speed tells the truth.** During the drag-back (T1–T2), the badge's speed slot shows a ◀◀ glyph in the sunset gradient. At T2 the glyph rolls up, and the speed rolls in and counts 1.00 → 0.25× over 0.4 s (power2.out, CONFIG `countIn`), while the footage actually slows. It no longer says "0.83×" over reversing footage. The glyph box fills the 112 px slot, so the −100 % roll clears it completely. My first r03 render left its bottom edge showing above "0.25".

**v0 badge dot.** The 22 px dot with a 6 px halo (it read as a radio button) is now a solid 18 px white dot. The rest of the badge is unchanged, since the critic called it the part that works.

**v1 tape.** The rail is 5 px at 42 % white (was 3 px at 32 %), the fill is 5 px solid white and the playhead is 8×64 px. It holds up at 360×640.

**Kept on purpose:**
- the real speed → jump back → slow replay structure;
- the p09/p08 plates and the 6.0 s loop;
- the blend-mode slow-mo on p09, because of the reticle (round 2);
- the v1 chip, hero roll and rewind smear;
- the exit at 5.60–5.93 s.

**Hero time 4.1 s.** In v0 the truck is on its side with "083" visible, with REPLAY 0.25× and the knob inside the bracketed range. In v1, REPLAY 0.25× is up mid-tackle.

## Round 2 (fixes from the r01 critique: v0 5/10, v1 6/10)

**Slow-mo re-baked without the warping (defect).** In round 1 the reticle stacked into rings and the limbs morphed, because of mci/aobmc + vsbmc plus a `tmix` blend on top. `bake.sh slow` now has no `tmix` and two methods:
- **v1 (p08 tackle): `mci`**, the critic's recipe: `minterpolate=fps=120:mi_mode=mci:mc_mode=obmc:me_mode=bidir:scd=fdiff`, then `setpts=4*PTS,fps=30`. I checked frame by frame: the fighters stay whole.
- **v0 (p09 truck flip): `blend`.** I tested the mci/obmc recipe first: the screen-fixed gameplay reticle still broke into 2–3 rings on 3 of every 4 frames, because mci drags the HUD along with the moving truck. Following the critic's fallback, v0 uses `mi_mode=blend`. The reticle stays one ring, and the in-betweens read as the natural motion blur of a fast roll. I also tested a pure frame-hold (crisp, but stutters at 7.5 fps) and the `framerate` filter (mostly crisp, with an occasional double ring) and rejected both.

**Exit (defect).** The UI fades from 5.60 to 5.93 s (power2.in, 0.33 s). Frames 178 and 179 are clean footage, so the loop no longer pops. The scrims fade with the UI.

**v1 label swaps (defect).** The state labels are now vertical rolls inside overflow-hidden masks (old label to yPercent −100, new one up from 100, 0.14 s power3.out). The ▶/◀◀ icon swaps the same way. Two states never overlap.

**v0: one object.** I deleted the SPEED segmented control and the duplicate "↻ REPLAY" state label. The bottom panel is now an 864×96 smoked rail: timecode in JetBrains Mono 34 px, then the scrub track (replay window, "you were here" mark, playhead, 0.1 s ticks). The top badge is unchanged (REPLAY + sunset 0.25× rolling 1.00 → 0.25), since the critic called it the best part. The speed now reads in one place only.

**v1: the hierarchy is fixed and the speed is honest.**
- **Hero:** 150 px Barlow Condensed 800, under the chip. It is empty during real-speed play, rolls up "REWIND" at the jump back, then rolls to "REPLAY" with "0.25×" in the sunset gradient (the one accent).
- **Timer:** down to 72 px, inside the Rockstar ink chip with the pink edge (the race HUD's "8/16" box), next to the ▶/◀◀ icon.
- **Speed:** now 0.25× as the brief says.
- **Timing:** the tackle shot is only 31 frames (plate 0–1.0 s, cut at frame 31), so at 0.25× the replay can run at most about 4.1 s. v1 is now 1.0 s real speed + a 0.9 s rewind + 4.1 s at 0.25×.
- **The rewind curve:** it eases (power2.inOut). It spins up to about 2.2× and settles on the first frame, like a deck rewinding. `bake.sh rewind` bakes that curve and `srcAt()` mirrors it, so the timer and tape head match the picture.

**v1 rewind look.** The VHS bands, the jitter and the darkening dip are gone. The footage stays at brightness 1.05 throughout. During the rewind it gets:
- a sideways-only blur, peaking at 8 px: an SVG `feGaussianBlur stdDeviation="8 0"` on the footage wrapper, with a matching overscan of up to 3.5 % so the soft edges stay off-frame;
- a light saturation dip (−18 % at peak);
- a pulsing ◀◀ icon (4 Hz).

**v1 plate lift.** The p08 footage gets `brightness(1.05) contrast(1.08)` (CONFIG `grade`), so the white numerals sit on more than fog.

**Kept on purpose:**
- the real speed → jump back → slow replay structure;
- p09/p08 plates and the 6.0 s loop;
- the v0 badge and its rolling speed;
- the race-HUD chip and tape ruler in v1;
- the 6 px HUD radius.

**Hero time 4.1 s:** the v0 truck is on its side with "083" visible, and v1 is mid-tackle with REPLAY 0.25× up.

## Round 1

**Structure: real speed → jump back → slow replay.** A replay only reads as a replay if the viewer sees the moment once first. Each variant plays a short real-speed lead-in, goes back to just before the moment and replays it slowed. The whole loop is 6.0 s (the shortest that fits both sample shots) so the payoff comes fast.

**Real slow motion, baked once.** Wasted (#9) found that `data-playback-rate` below 1 repeats source frames, which stutters at about 8 fps. So the slow and reverse segments are baked with `bake.sh`:
- ffmpeg `minterpolate` (mci/aobmc) motion interpolation, plus a light 1-2-1 `tmix` blend;
- the reverse segments use `reverse` + `tmix`, so the rewind smears like a real scrub.

The three segments play back to back at rate 1. The playhead, timecode and timer are driven from one source-clock function (`srcAt`) that mirrors those segments exactly, so the UI always matches the picture. The baked files live in `assets/slow/`, outside `assets/plates`, because `sync_shared.sh` would delete them there.

**Plates.**
- Variant 0 uses p09: the gameplay chase is continuous from 0 to 4.1 s, and the police truck flips at about 2.2–3.3 s. The lead-in runs 1.2→2.6 s, so the flip starts at real speed. The playhead then drags back to 2.0 over 0.3 s (the footage reverses at 2×) and the flip replays at 0.25× (2.0→3.08 s).
- Variant 1 uses p08 (as the manifest suggests): the ramp tackle is the only usable action in that plate, and it lasts 1.03 s before a cut. To fill the replay from that one second, variant 1 slows to 0.2×, and the box says 0.2× honestly.

**Variant 0, Replay scrubber.** It follows the craft refs (premium player UI) and the DESIGN.md glass material.
- One smoked-glass bar, 864 px wide (80% of the frame), at y 1238–1464.
  - Timecode in JetBrains Mono.
  - A rail with 0.1 s ticks.
  - The replay in/out window bracketed like an editor's range.
  - A "you were here" marker where the playhead jumped from.
  - A segmented control whose white pill slides 1× → 0.25×. The label under the pill is an ink copy clipped to the pill, so it reads as a real control.
- The big REPLAY badge at the top left (y 252, hook zone) is the payoff. Its speed rolls 1.00 → 0.25 (DESIGN: "counters roll"). The sunset gradient is used only on that number (one accent). The fills, knob and pill are white.

**Variant 1, Rewind.** It follows `refs/hud-official-gta6-race-position` (Rockstar's race HUD):
- condensed caps label + ink box (#1F202B) with a pink (#F84FA4) right edge, as in the "LAP 1/2" and "8/16" boxes;
- a big condensed timer like "00:22.08", here 200 px Barlow Condensed 700 as the hero numeral;
- a thin, sparse white tape ruler at the bottom.

The timer counts up, runs backwards through the rewind and then crawls, which is how the slow-down reads even on a still frame. The rewind treatment stays restrained: deterministic per-frame jitter of ≤ 8 px, saturation down 45%, slight contrast, and four thin blurred tracking lines. A soft top/bottom scrim keeps the white HUD legible on p08's bright fog.

The HUD box uses a 6 px radius, not the 20/28/36 card radii. This is deliberate: Rockstar's HUD boxes are nearly square.

**Motion.**
- The panel and HUD enter in 0.4 s (expo.out). The badge pops (0.86→1, back.out(1.5)).
- At each hit, a 2-frame white flash dips to ≤ 0.22.
- A slow 1.0→1.045 push-in on the footage wrapper runs during the replay. The timed `<video>` tags are never transformed.
- Everything clears over the last 0.36 s for the loop.

**Transparent mode.** With `bg: "none"`, the footage and vignette are hidden and the UI renders alone. The README explains how to match the slow-mo in CapCut or Premiere.

**Self-review fixes this round.**
- Fixed `hyperframes check` layout and contrast errors on the segmented control: the overlap is intentional, so it is marked as allowed. The ink layer has its own white background, and the white base label fades out under the pill.
- Tightened the gap between the replay icon and the state label.
- Reduced the push-in from 1.06 to 1.045, because the source is already motion-blurred during the flip.
