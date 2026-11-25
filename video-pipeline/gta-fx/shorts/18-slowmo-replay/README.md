# 18 · Slow-mo replay

The "wait, watch that again" moment for GTA 6 compilation shorts. The clip plays at real speed, goes back to the moment and replays it in slow motion at 0.25×. A replay UI shows what is happening: a playhead that drags back and then crawls, a timecode that slows down, and a REPLAY 0.25× label. Every cut is a hard cut with a 3-frame sideways camera hit (no white flash), and no footage frame ever repeats.

Use it on the best beat of a clip: a crash, a flip, a tackle, a near miss, a stunt landing. It works as a mid-clip beat in a "Top 10" compilation or as the payoff of a single-moment short. 1080×1920, 30 fps, 6.0 s. The UI clears by 5.93 s, so it loops cleanly.

## Variants
- **0 · Replay scrubber.** Two parts:
  - **Badge:** at the jump back, a smoked-glass **REPLAY** badge pops in at the top left. Its speed slot shows a ◀◀ glyph while the footage drags back. When the slow-mo starts, the glyph rolls out and the speed rolls in and counts 1.00 → 0.25×. Both the glyph and the number use the sunset gradient (the one accent).
  - **Scrub rail:** a plate-less, race-HUD-style rail across the bottom of the safe zone, over a soft scrim. It has a white condensed timecode (`00:01.43`), one 6 px track, the replay range as a brighter segment with `[` `]` in/out brackets, and a solid white knob that drags back, then crawls.

  Sample: the police truck flip (p09).
- **1 · Rewind.** Rockstar race-HUD language:
  - **Chip:** an ink chip with a pink edge, holding a ▶/◀◀ icon and a 72 px Barlow Condensed timer.
  - **Hero line:** a 150 px line under the chip that rolls up **REWIND**, then **REPLAY 0.25×**.
  - **Tape ruler:** a ruler at the bottom: ticks, a 5 px rail with a solid white fill, and an 8×64 px playhead.

  The footage plays, then rewinds on a spin-up curve (a sideways blur and a pulsing ◀◀), then replays at 0.25×. The timer runs backwards through the rewind, then crawls. Sample: the tackle on the ramp (p08), lifted slightly so the white type stays legible on the fog.

## CONFIG (top of the script)
- `duration`: the composition length (6.0 s). If you change it, also change `data-duration` on `#root` and `#ov`.
- `exit`: `{ at, dur }`, when the UI starts to clear and how long it takes (5.60 s + 0.33 s).
- `hit.px`: the camera hit on the replay cut, as the x offset in px for each frame (default `[6, -4, 2]`, i.e. 3 frames). The footage is scaled just enough to hide the shifted edge. Use `[]` for a plain cut.
- `variants["0" | "1"]`:
  - `clip.src`: your clip, played at real speed from `clip.mediaIn` seconds.
  - `clip.scrubSrc`: the baked reverse segment (the drag-back for 0, the rewind for 1).
  - `clip.slowSrc`: the baked slow-motion segment.
  - `timing.real`: seconds of real speed.
  - `timing.back`: seconds of drag-back or rewind.
  - `timing.backEase`: `"linear"` for a `bake.sh reverse` file, `"inOut"` for a `bake.sh rewind` file.
  - `timing.curve` (rewind only): the length the rewind file was baked over (its `<outLen>`). Defaults to `back`.
  - `timing.trimIn` (rewind only): seconds skipped at the head of the rewind file. A rewind file's first frame repeats (the curve starts at zero speed), so use 0.034 (one frame), with `back = curve − 2 frames` (e.g. 1.0333 → 0.966).
  - `replayIn`: the source second the replay restarts from.
  - `rate`: the slow-mo speed the bake used (0.25 = quarter speed). The playhead, timecode and speed labels follow it.
  - `range`: `[start, end]` in source seconds, the window the scrub rail or tape shows.
  - Variant 0: `word` (the badge word) and `countIn` (how long the badge counts 1.00 → `rate` once the slow-mo starts, 0.4 s).
  - Variant 1: `labels` (`rewind` / `replay`, the hero words) and `grade` (`brightness` / `contrast` on the footage; set both to 1 for no lift).

The script writes `src`, `data-start`, `data-duration` and `data-media-start` onto the active variant's three `<video>` tags (`v0a/v0b/v0c` or `v1a/v1b/v1c`). Mirror the values in those attributes too, so `hyperframes check` and Studio see the same thing.

## Render
```bash
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o replay.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o rewind.mp4
# UI only, transparent (put it over your own clip in CapCut / Premiere)
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o rewind-ui.webm
```
With `bg: "none"` the overlay can't slow your footage, so match it in your editor:
1. At the overlay's replay mark, where the slow-mo starts (1.7 s for variant 0, 1.97 s for variant 1), jump your clip back to the moment.
2. Set it to 25 % speed.
3. Turn on frame blending or optical flow. In CapCut, use "Smooth slow-mo"; in Premiere, use Time Interpolation → Optical Flow, or Frame Blending if the clip has a gameplay reticle.

## Swap in your own clip
Slowing a 30 fps clip down with a lower playback rate repeats frames and stutters. So the slow and reverse parts are baked once with `bake.sh` (it needs ffmpeg):
```bash
# real-speed lead-in: src from mediaIn for timing.real seconds (no bake needed)
# drag-back (v0): the window played backwards at a constant <speed>x
bash bake.sh reverse assets/my-clip.mp4 <replayIn> <realEnd - replayIn> <speed> assets/slow/my-scrub.mp4
# rewind (v1): the window played backwards over <timing.curve> seconds on a spin-up curve
bash bake.sh rewind  assets/my-clip.mp4 <replayIn> <realEnd - replayIn> <timing.curve> assets/slow/my-rewind.mp4
# slow motion from replayIn: (duration - timing.real - timing.back) * rate seconds of source
bash bake.sh slow    assets/my-clip.mp4 <replayIn> <source seconds> 0.25 assets/slow/my-slow.mp4 mci
```
- `realEnd = mediaIn + timing.real`. For `reverse`, set `timing.back = (realEnd − replayIn) / speed`.
- **Avoid repeated frames at the cuts.** A `reverse` file opens on the last frame of its window. If your lead-in ends on that same frame, start `mediaIn` one frame (0.033 s) earlier, as the sample does. For a `rewind`, use `trimIn` and `back = curve − 0.067` (see above).
- **Keep the slow file longer than the replay.** The replay runs `duration − timing.real − timing.back` seconds. If the file ends in a pad hold, the loop ends on frozen frames. To check, compare frames with ffmpeg `tblend=all_mode=difference`.
- **Pick the slow method by what is in the clip:**
  - `mci` (motion-compensated, the default) is best on people, cars and organic motion.
  - `blend` is for clips with a screen-fixed gameplay HUD (a reticle or a minimap) or heavy smoke and rotation. There mci drags the HUD and warps edges, while blend reads as motion blur.
- Keep the slow window before the next cut in your clip. If the shot ends a few frames early, add a `padTo` seconds argument (for example `... mci 4.2`) to hold the last frame.
- Then point `clip.src`, `clip.scrubSrc` and `clip.slowSrc` at the files and set `rate`, `replayIn`, `range` and `timing`.

Sample bakes:
- `v0-p09-scrub.mp4`: p09 2.0–2.6 s, reversed at 2×.
- `v0-p09-slow.mp4`: p09 from 2.0 s at 0.25×, `blend` (the clip has a gameplay reticle). The lead-in runs 1.167 → 2.533 s.
- `v1-p08-rewind.mp4`: p08 1.0 → 0 s over 1.0333 s (31 frames), on the spin-up curve. It plays frames 1–29.
- `v1-p08-slow.mp4`: p08 0–1.03 s at 0.25×, `mci`, padded to 4.2 s. The tackle shot is 31 frames long.

## Keywords
slow motion, slow-mo, replay, instant replay, rewind, run it back, scrubber, playhead, in/out range, timeline, timecode, race timer, speed ramp, 0.25x, quarter speed, camera hit, GTA 6 moments, crash replay, fails, best moments, compilation, HUD, race HUD
