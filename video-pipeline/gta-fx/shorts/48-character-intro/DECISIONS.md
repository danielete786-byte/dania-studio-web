# Decisions: 48 Character intro

## Round 2 (hero t = 2.3 s, 5.5 s long)

The critic gave both variants 7 and named the same gap for each: the payoff was soft. v0's freeze barely registered and then sat dead for 4.7 s; v1's switch was a blur dissolve, and the wheel opened on broken logic. Every listed fix is in.

### v0 Freeze + name
- **The freeze now lands, and the dead hold is gone.**
  - The hold runs from 1.1 to 3.9 s (2.8 s, was 5.1 s). The duration is 5.5 s, so 1.6 s of footage plays after the resume and the loop restarts on motion. The resume plays source 3.7 to 5.3 s, which is still inside the Lucia close-up (it cuts at about 5.4 s).
  - **New: a 2-frame warm flash on the freeze frame.** It is `#FFC88F` (the soft-sunset end colour), 0.35 then 0.175 then 0, and sits under the type.
  - This reverses round 1's "no flash" rule, on purpose. That rule banned full-frame *white* flashes. This flash is low-opacity, warm and lasts 2 frames, and the critique named the concrete defect it fixes: the freeze didn't read.
  - The grade now snaps in over 2 frames, to `saturate(0.55) contrast(1.18) brightness(0.84)` (was a 0.3 s ease to 0.78 / 1.12 / 0.86). The still visibly changes state on the hit.
  - The push runs from 1.06 to 1.14 across the hold (was 1.06 to 1.09), so the still keeps moving on a phone.
- **CAMINOS keeps its sunset.**
  - The gradient is now static: `#F84FA4 → #FE8E4E → #FEB747`, with pink on the C at all times.
  - The motion is one white sheen band (alpha 0.42), a second background layer clipped to the text. It crosses the word once, at T+0.4 to T+1.15, driven by the `--sx` CSS variable.
  - I took this over the critic's mirrored-gradient option. A sweep across a mirrored gradient still passes through an all-amber middle; a static gradient keeps the pink in every frame.
  - The sheen ends before the hero frame, so the hero shows the clean gradient.
- Layout, type and the name ref are unchanged. The critic praised them.

### v1 Switch wheel
- **The wheel logic is fixed.**
  - The wheel opens with Jason selected, under the kicker **PLAYING AS / JASON / DUVAL**.
  - When the selector rotates to Lucia (S = 1.1 s), the kicker rolls to **SWITCH TO** and the names roll to LUCIA / CAMINOS.
  - The kicker is now a roll window (`#kWin`), like the name rows.
  - The chip label is **PLAYING AS**, not "NOW PLAYING" (a music-player idiom). The same CONFIG field (`playing`) feeds the wheel's opening state and the chip, so the two always agree.
- **The switch has a payoff** in place of the crossfade:
  - at C (2.6 s), the Jason plate punches from 1 to 1.6 into a 24 px blur over 0.3 s (power2.in);
  - the wheel is pulled forward with it (scale 1.14 and fade);
  - **hard cut** on frame 87 (C + 0.3 = 2.9 s, kept on a frame boundary so the cut is exactly one frame), with a 2-frame `#FFC88F` flash at 0.4;
  - Lucia lands from 1.25 to 1 over 0.45 s (expo.out), with a 10 px blur that resolves.
- **Legibility:**
  - SWITCH TO / PLAYING AS and the surname went from 26 px at 0.78 alpha to 30 px at 0.92;
  - the chip label went from 26 px at 0.80 to 30 px at 0.92;
  - `#ctr` was re-centred for the taller rows.
- **The inactive avatar is no longer a black disc.**
  - The Jason portrait is re-aimed at the sunlit door shot at the start of p03 (source 0.15 s, rate 0.1 so it's near-still; `fx 275, fy 300, span 440`). It shows his lit profile with the sunglasses and cap.
  - `FACE_OFF` is now `grayscale(0.6) brightness(0.92)` (was 0.75 / 0.7).
- **Material:**
  - the disc is filled with DESIGN's smoke, `rgba(14,14,20,.62)` with `blur(20px) saturate(1.4)`;
  - it has a 1 px inset top highlight (`.18`), a faint top radial sheen, a `.16` hairline and a 1 px dark outer rim, so it separates from the plate;
  - the chevron moved 8 px up, away from the arc end.
- **Timing compressed to 5.5 s**, to match v0's duration:
  - open 0.3 s, select 1.1 s, confirm 2.6 s, out 5.05 s;
  - the Lucia plate plays source 3.0 to 4.76 s at 0.65×.
- **Hero = 2.3 s:** v0 has the full name with the sheen done; v1 shows SWITCH TO / LUCIA with the selection settled, just before the confirm pulse.

## Round 1 (hero t = 2.8 s, 7 s long)

### Shared
- **Plates:** p06 (Lucia at the gate) for the freeze and the landing; p03 (Jason driving, at source 4–8 s) for the wheel.
  - Lucia's frontal close-up runs from source 3.0 to 5.3 s. The shot cuts at about 5.4 s, so every Lucia range stays inside 2.6–5.1 s.
- **One accent per frame:** the Leonida sunset gradient (#F84FA4 → #FE8E4E → #FEB747).
  - v0 puts it on the surname.
  - v1 puts it on the selection system: the arc, the chevron and the selected ring. These read as one element.
- **Type and text:**
  - Barlow Condensed 900 for names.
  - Inter 600 caps tracked 0.42em for labels (Rockstar's wide "official" caps).
  - JetBrains Mono for the `01 / 02` index.
  - All real facts: Jason Duval and Lucia Caminos are the two protagonists, and the state is Leonida (FACTS.md).
  - No stat bars: GTA 6 stats are not public, so we don't invent numbers.
- **No white flash anywhere.** The freeze-detail critique showed the rubric bans full-frame flashes. The freeze hit is a 4-frame shake (≤ 7 px) plus a 1 → 1.06 punch instead.

### v0 Freeze + name
- **Freeze method:** HyperFrames can't freeze mid-source. The freeze is a chain of 0.3 s clips, each starting at the same source frame (3.7 s) at playback rate 0.1, which is the same technique as #17.
  - The footage plays for 1.1 s before the freeze, so the viewer sees her lift her head first.
  - It resumes at 6.2 s, so the loop restarts on moving footage.
  - The freeze is deliberate and dressed: grade, punch, slow push to 1.09, and a bottom scrim. It reads as a stylistic freeze-frame, not a dead plate.
- **Layout:** the name is left-aligned at x 72, 236 px, and sits on her dark shirt below the face (y 900–1450). CAMINOS is about 780 px wide (72% of the frame width).
  - This follows the name-label ref (`_sO4z_omuu0-1`, a white name plus a coloured role line) but drops its green Arial and logo for Rockstar-style type and colour.
- **Motion:**
  - the name lines are mask-revealed, staggered 0.08 s;
  - the role line slides in (a letter-spacing tween was removed because lint flags it as a reflow stutter);
  - a slow sheen runs through the gradient;
  - the block drifts 10 px of parallax against the push.

### v1 Switch wheel
- **Reference:** `hud-character-switcher-stat-bars`: round portraits, with the selected one enlarged under a ring and a V chevron.
  - Our version adds material: a 600 px smoked-glass dial with a 2 px hairline, 12 and 6 o'clock ticks, and a 100° sunset selection arc.
  - The arc rotates over the top of the wheel from Jason (180°) to Lucia (0°).
- **Portraits are live footage crops** from the CONFIG clips, not key art, so there are no trademark or asset issues and the creator's own clip feeds them.
  - The unselected portrait is greyscale at scale 0.8.
- **Game feel:**
  - the footage drops to 0.4× slow motion and dims (saturate 0.55, brightness 0.76, 3 px blur) while the wheel is open, like GTA's switch;
  - the confirm does a scale and blur whip out and in;
  - the chosen portrait becomes the "NOW PLAYING" HUD chip, top right inside the safe zone.
- **Self-review fixes this round:**
  - the name roll-in now overlaps the roll-out, so the centre is never empty;
  - the plate dim was lightened (the first pass was too black);
  - the chip was enlarged (disc 120 px, name 42 px), so the post-switch beat isn't a tiny HUD on bare footage;
  - the v0 name went from 200 to 236 px to reach about 72% of the frame width.
