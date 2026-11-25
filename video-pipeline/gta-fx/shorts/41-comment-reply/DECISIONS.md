# Decisions: 41 · Comment reply

## Round 1
**Format (from the refs).** `comment-card/0L5i5C46M1s-13` and `-36` show creators scaling a raw YouTube dark comment 3–4× and pushing it in over footage. `chat-message-card/agqd*` and `LTSb*` show one message per beat in a platform chat UI. Both prove the format, "one viewer message, big, then the clip", but they are low-res screenshots with blur-in and torn edges. We keep the format and rebuild the UI natively: real radii, hairlines, a crisp shadow, and Inter.

**Variant 0 · Reply sticker (light card).**
- White speech-bubble sticker: the reply-sticker idiom from short-form apps, built as our own object with no platform logo. Radius 36, a drop-shadow pair (sharp contact plus soft) applied as a `filter` so the bubble tail shares it.
- Hierarchy: a 30 px grey "Reply to" with the handle in ink, then the comment at 92 px Inter 800 (hook size), so it reads at phone size within 0.6 s. The card hugs the text (max 860 px) and centres in the safe zone, so there is no dead space to the right.
- The one accent is the sunset-gradient avatar. The letter is ink, not white: white on the amber end failed the contrast check (1.57:1).
- Motion: a 0.5 s expo rise and scale, the avatar pops, the words fade up with a 55 ms stagger. At 2.35 s the sticker lifts into the hook zone (y 290, scale 0.92, -1.5° tilt like a hand-placed sticker) while the dark blurred hold clears. That clearing is the "video opens to answer it" beat. Fade-out at 6.05 s.
- Plate p01 (the Keys sign, then the marina and water) matches "is the water real?".

**Variant 1 · Comment stack (smoked glass).**
- Three comment rows in smoked glass (rgba(16,16,22,.70), blur 20, inner hairline): avatar, handle and age, comment at 44 px, a heart with a like count, and a Reply pill. They load top to bottom, 0.2 s apart.
- Pick beat: the other two dim to 0.32, the picked row scales 1.03, and its Reply pill is tapped (press, ring) and fills with the sunset gradient. That pill is the only accent.
- The others clear up and down. The pick drops above the caption zone (bottom 1440) so the docked card doesn't cover the subject's face. The pill widens to "Video reply" with a play glyph.
- Plate p06 (Lucia at the gate) matches the picked question "wait… is that Lucia??". Lucia Caminos is from FACTS.md.
- Handles are clearly fan-made viewer handles (@keysboatlife, @leonida.daily, @vicecity.nights, @nov19ready). There are no real people and no official accounts. "Nov 19" is the confirmed release date. Like counts are demo values the creator replaces.

**Fixes made after looking at the captures this round.**
- Avatar text contrast failed the check, so the letter is now ink.
- The V0 card was a fixed 860 px wide with a 72 px comment and a lot of empty space on the right. It now hugs the comment, which is 92 px.
- The first V1 comment wrapped with an orphan word ("unreal"), so it was shortened to "these sunsets are unreal".

**Hero time (round 1) 3.6 s**: both cards docked over clear footage (V0 over the marina, V1 under Lucia's face).

**Not done / open.** The docked hold (about 2.9–6.0 s) is deliberately static, as a real reply sticker is. If a critic calls it dead, the next step is a subtle idle, not more elements. The transparent (`bg: none`) render was not rendered this round. It relies on the plate videos being hidden, and the scrim is a semi-transparent layer.

## Round 2
Critic: V0 7/10, V1 6/10 (both won the blind pick). One defect, plus the biggest gap: V1's docked payoff was a half-empty dark slab with small text, and both variants opened on 2.4 s of heavily dimmed footage.

**Defect fixed: `bg: "none"` no longer bakes a wash.** `#scrim` is now `display: none` when the plate is off. Before, the transparent export laid a flat 52% black layer over the creator's clip until about 3.1 s. Verified on a transparent V1 render: at 0.9 s the frame corners have alpha 0, and the card itself is alpha 0.84.

**Shorter, lighter hold (hook window).** The scrim dropped from rgba(8,8,12,.52) with a 14 px blur to .38 with 10 px. Timing is now per variant: `CONFIG.timing` holds the shared `in`/`out`/`end`, and `timing["0"]` / `timing["1"]` hold each variant's beats.
- V0 docks at 1.4 s (was 2.35), so the footage is clear by about 2.1 s.
- V1 picks at 1.0, docks at 1.6 and swaps the pill at 2.25 (was 1.7 / 2.35 / 3.0).
- `in` moved from 0.2 to 0.08 s, so the overlay is on screen in the first few frames.

**V0 entrance: no empty white box.** The card tween is 0.36 s expo.out. The avatar and label start at in+0.03 and the words at in+0.06 with a 0.045 s stagger, so the first word is visible by about 0.13 s and the full question reads by about 0.4 s (checked in `v0-entrance.jpg`).

**V0 label.** 30 to 34 px, colour #55555F. Docked at scale 0.92 it renders at about 31 px instead of 27.6 px. Everything else about the sticker (white bubble, 92 px question, sunset avatar as the only accent, hook-zone dock with -1.5° tilt) is kept: the critic rated it the stronger variant and named no defect in it.

**V1 payoff: the docked comment is now the hero.**
- Cards hug their content (`width: max-content`, 620–860 px, comment text capped at 680 px) instead of a fixed 860 px slab. In the stack this also gives three different widths, so it reads less like a stock widget row list.
- On dock the pick scales up to `dockMaxScale` (1.3, capped so the card stays within 860 px) from a left-centre origin, with its bottom edge on `dockBottom` 1440. The comment renders at about 57 px (was 44) and the card is about 804 px wide, filled edge to edge.
- Smoke raised from .70 to .84 and the hairline from .14 to .22, so the card separates from Lucia's dark shirt. The denser smoke also gives the card body in the transparent export, where backdrop blur has nothing to blur.
- Kept the plate (p06, Lucia at the gate) and the dock position above the captions: the "is that Lucia??" match is deliberate, and the critique's fix for the shirt was contrast, not a move.

**V1 stack and pick.** The card stagger went from 0.2 to 0.12 s, so all three cards land by about 0.7 s. On pick, the other two dim to .22 and soften with a 2 px blur (seek-safe `fromTo`, `immediateRender: false`), and the pick steps forward to 1.06. The chosen comment reads as the hero before it moves.

**Hero time 3.6 s.** At 3.0 the V1 plate is mid camera move and Lucia's face smears; at 3.6 both plates are sharp (V0 over the marina, V1 under Lucia's face).

**Still open.** The docked hold (about 2.1/2.4–6.05 s) is static on purpose, as a real reply sticker is. If a critic calls it dead, add a subtle idle, not more elements.

## Round 3
Critic: V0 8/10, V1 7/10 (both won the blind pick). One defect, which was V1's pill contrast. The biggest gap was that V1 didn't read as one composed object: the cards had ragged right edges, and the "Video reply" payoff landed after the motion had settled, in a small pill.

**Defect fixed: the pill contrast, decided by a rule rather than a darker gradient.** White on the #FE8E4E→#FEB747 end measured about 1.7–2.3:1. The critic's own option (end the gradient at #FE8E4E) still measures 2.3:1 there, because white on #FE8E4E is about 2.28:1. So the filled pill now carries **ink** (#0B0B0E) type and an ink play glyph. That is the same rule as the V0 avatar letter (round 1): *the sunset fill always carries ink type*. Ink measures about 6.2:1 on #F84FA4 and more than 8:1 on the orange and amber stops, so the full pink→amber core can stay. The fill is now a 90° sweep (`#F84FA4 0% → #FE8E4E 62% → #FEB747 100%`) with a faint white inner hairline. The unpressed "Reply" stays white on glass.

**V1 is one list (biggest gap).**
- Every card now has the same width, `CONFIG.variants["1"].stackWidth` (700 px), set inline from CONFIG. It replaces `max-content`, so the three cards share both edges.
- The stack is **centred** in the safe zone (x 154–854), not left-anchored. A fixed width narrower than the safe zone looked lopsided pinned to x 74.
- The transform origin moved from the left centre to the centre. The docked pick grows symmetrically to exactly x 74–934, at 860/700 = 1.23x, so the comment renders at 54 px and the pill at 74 px.
- The third comment changed from "Nov 19 can't come fast enough" (2 lines at 700) to "counting down to Nov 19" (still the confirmed date). All three cards are now one line and the same height, so they read as uniform rows.
- `.cm-text` gets `text-wrap: balance`, so a creator's longer comment wraps evenly instead of leaving an orphan.

**V1 payoff tied to the tap.**
- `timing["1"]` is now `{ pick: 1.0, swap: 1.2, dock: 1.6 }` (swap was 2.25). The press (pill scale 0.9 → 1, back.out) and the fill land on the same beat as the label change. The label goes from "Reply" to ink "▶ Video reply".
- The dock and un-blur at 1.6 s are the result of the tap, not a separate beat afterwards.
- The pill grew from 52 to 60 px tall, with 30 px text (an 800 weight for the answered label).
- The label change is ordered so it never spills over the edge. The pill widens with a 0.22 s power4.out (about 90% wide by swap+0.1), and only then does the ink label fade in. In the first pass the label faded in while the pill was only about 34% wider, and for about 2 frames it read "Video repl" with the tail over the dark card. I checked frame by frame between 1.17 and 1.40 s.

**V1 tap ring removed.** The 3 px white 120 px circle read as a screen-recording touch dot. The press is now the pill's scale dip plus a 0.1 s `rgba(255,255,255,.25)` inner flash (`.pill-flash`, 0.03 s in and 0.07 s out).

**V0 entrance pops out of its tail.**
- The opacity goes 0 → 1 in 0.03 s from `in` 0.07 (moved from 0.08). The first visible frame (0.1 s) is therefore already at full white, and the milky half-transparent frames are gone.
- The scale goes 0.86 → 1 with back.out(1.5) over 0.42 s. The transform origin is on the tail (84 px, card height + 12 px), so the sticker grows out of its tail as the real sticker does.
- The avatar pops 0.6 → 1 (back.out 2.2) 0.05 s later.
- The label and words are no longer faded separately: the sticker arrives complete.
- Docking now scales about the tail origin. The dock tween adds a computed x/y offset, `dx = (w/2 − ox)(1 − s)` and `dy = dockTop − top0 − oy(1 − s)`, so the top centre still lands on (centre, dockTop 290) exactly as before.
- The tilt, dock position and 92 px type are unchanged. The critic named no defect in them.

**Both, plate mode: the loop no longer jumps.** The scrim ramps in with `tl.fromTo('#scrim', {opacity: 0}, {opacity: 1, duration: 0.18})` from 0 s. The first frames are clear footage that dims under the sticker, and that matches the clear last frame. With `bg: "none"` the scrim is still `display: none`. A transparent V1 render confirmed alpha 0 at the frame corners and 0.84 on the docked card.

**Kept on purpose.**
- V1 still uses plate p06 (Lucia at the gate) rather than the suggested p01/p07, because of the "is that Lucia??" match from round 1.
- V1 still docks above the caption zone (dockBottom 1440).
- The V0 hook-zone dock and its -1.5° tilt stay.
- The docked hold stays static, as a real reply sticker is.

**Hero time 3.6 s.** Both cards are docked over sharp footage: V0 over the marina, V1 under Lucia's face, with the filled "▶ Video reply" pill visible.
