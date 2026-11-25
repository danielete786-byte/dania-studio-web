# 39 · Headline card: decisions

## Polish round 6 (after the round 5 critique: v0 7/10, v1 7/10)

The critic's biggest gap was motion: neither entrance had one clear rule. Each variant now has one, and both share the same principle: **a card never shows an empty surface. The headline leads, and the rest arrives with it.**

### Defect fixed: v0 blank white slab on entrance
- **Cause:** at 0.1 s the full 832×906 paper card snapped from opacity 0 to 1. Its body stayed blank paper until the lead image faded in at about 0.33 s.
- **Fix: the card grows with its content.**
  - The paper is now a separate `.sheet` behind the content (`.body`), so its height can grow while it keeps its rounded corners and its full three-layer shadow. A `clip-path` on the card would have clipped the shadow, and removing the clip afterwards would have made the shadow pop.
  - **Start:** the sheet is headline-sized, at the headline's bottom plus padding. It is capped so that it never reaches the meta row.
  - **Grow:** the sheet's height (`--rv`) tweens to full height over `timing.reveal` = 0.45 s (`power3.out`, from T.in + 0.05).
  - **Uncover:** the content is masked by a 20 px feather that ends 10 px above the sheet's edge. The meta row, dek, lead image and credit fade in, in reading order, as the edge passes, and there is always a paper margin under the content.
  - I first tried a hard `clip-path` on the content. It sliced a row of text through the middle on single frames (the dek at frame 5, the credit at frame 12), so I switched to the feather.
  - The fades on the meta row, dek, image and credit are gone, because the sheet's edge now times them.
  - At full height the feather sits inside the 36 px bottom padding, so the finished card is unmasked.
- **Opacity:** the 0.1 s ramp (`power2.out`) the critic asked for: frames at 56%, 89%, then 100%. `cardIn` now takes `fade` separately from `lead`.
- **Headline lines:** `timing.in` is now **0.133**, so the card first shows on frame 5. The lines start rising at 0 (lead = T.in), with a 30 ms stagger over 0.36 s. On the first visible frame all three lines are in place.
- The earlier start height (headline + 36 px) let the top of the NEWS chip show as a faint grey sliver under "for" on the first frame, while the card was still at scale 0.94. The cap at `meta.offsetTop + 4` removes it.

### v0: the card sits straight (tilt 0)
- The critic read the −1° rest tilt (a 15 px slope across the top edge) as misregistration, not as a deliberate clipping, and offered two fixes: a tilt of 0 or a 16:9 lead image.
- A bolder tilt (−2°) would push the card past x 72 / 936 once the hold push is added.
- The 16:9 image would undo round 4's density fix.
- So `tilt` is now **0**, and the card no longer lands with a rotation. It spans about x 86–922 and y 267–1173 in the hero.
- The clipping cues are now carried by the warm paper, the contact shadow, the vignette stage, the dek, the photo and the credit.

### v1: one highlight rule (the critic's option b)
- **Rule:** the context cards are glass and unlit, and only the payoff card is paper and lit. The marker sweeps once, on "biggest entertainment launch ever". The change of material is now the same rule as the highlight, not a second one.
- Card 1's highlight is now `""`. The "call out sick" sweep, and its wipe-off at about 1.6 s, are gone from the sample.
- I didn't take option (a), a marker on every card. Card 2's only candidate phrase, "Excitement builds", was named a dead phrase in round 4.
- The wipe-off code stays: a creator who lights earlier cards still gets the clean hand-off.
- This also makes the critic's "word space before 'and'" fix moot for the sample, but the marker padding below fixes it for any config.

### v1: pacing
- `timing.every` is now **0.75 s** (was 1.2 s). The cards start at 0.18, 0.93 and 1.68 s.
- The payoff is in by about 1.9 s. Its sweep runs from about 2.02 s and finishes by about 2.45 s (frames 61–74), which leaves a hold of about 4.1 s before the 6.55 s exit.

### v1: receded cards (dim)
- `dim.opacity` is now **0.72** (was 0.55). The receded headlines read as dimmed white, not grey. The 26 px meta lands at about #83 on the navy, not #6E.
- **Scale stays 1** (not the suggested 0.965). A scaled card is narrower than the payoff card. That was round 4's named misalignment defect (text column at x 140, the tag lining up with nothing), and round 5 fixed it. Even the critic's constraint ("keep x inside 88–920") can only be met at scale 1.

### v1: no empty plates on entrance either
- In the first r06 render, each stack card showed 1–2 frames of empty glass or paper before its lines rose (frames 6, 30 and 51). This is the same pattern as v0's defect.
- Stack cards now get the same rule: `lead: 0.067`, a 30 ms stagger and 0.36 s lines. On every card's first visible frame the headline is already up.
- This is a timing change only.

### Marker padding (critique fix)
- `marker.pad` is now **0.08em** from the glyph ink (was 0.1em), on both sides. The v0 bar is 6 px from the "1" and the "k".
- **New rule:** `marker.gap` = 0.3. Where a highlighted phrase has a neighbouring word on the same line, the marker may cover at most 30% of the ink-to-ink gap. The word space always stays visible.
  - It applies to "be | biggest" on the payoff card, and it would apply to "sick | and" if card 1 were lit.
  - In the 4.5 s hero, about 10 px of clear paper separates "be" and the marker.

### Kept (no defect named)
- The paper payoff card, the ink-navy glass, the "THE HEADLINES" tag, the clone marker per line, p01 / p04, the vignettes, the 2:1 still, the dek, the 1.01 hold push and the one-group exit.
- Torn edges stay out (round 1).

### Hero time
4.5 s.
- v0: the straight clipping in its hold, with "1.5M will call out sick" lit.
- v1: two receded glass cards at 72% above the lit paper payoff, on p01's watch shot.

### Checked this round (frames pulled from `rounds/r06/v0.mp4` and `v1.mp4`)
- **v0 entrance, frames 2–15:**
  - frames 2–4 are plate only;
  - frame 5 (0.167 s) is a headline-only card at 56% with all three lines set;
  - frame 6 adds the meta row;
  - frames 7–12: the dek and then the lead image fade in under the growing sheet;
  - frame 13 (0.43 s) is the complete card with its credit.
  - There is no blank paper, no hard-sliced row and no chip sliver. A 3× crop of frame 4 in the second render showed the chip sliver, and it is gone after the cap.
- **v1:**
  - frames 5–7, 28–30 and 50–52: each card's first visible frame already carries its headline;
  - frames 61, 68 and 74: the payoff sweep (b… → mid → complete);
  - frames 196–207: the one-group exit, clear by frame 205.
- **Heroes:** v0 card x ≈ 86–922; v1 column x 88–920 with the tag and text at x 128; the "be" space before the marker is clear.
- `hyperframes check` passes: 0 errors, 85/85 contrast checks, 0 layout issues. The only warning is the file length.

---

## Polish round 5 (after the round 4 critique: v0 8/10, v1 7/10; superseded where Polish round 6 says so)

### Defect fixed: v1 misalignment
- **Cause:** receding cards scaled to 0.97 from their top centre, so they were about 12 px narrower per side than the paper payoff card (x 100–908 vs 87–921). Their text column moved to x ≈ 140, and the THE HEADLINES tag box (x 128) lined up with nothing.
- **Fix:** `dim` is now `{ opacity: 0.55, scale: 1 }`. Every card keeps x 88–920, and the text column of every card is x 128, the same as the tag box's left edge.
- **How the cards recede now:** the dim is applied to the card's **text** (meta row and headline), not to the card. In a test render, dimming the whole card to 0.55 let 45% of the *unblurred* footage through the glass: the red "MARINA" sign on the new plate read sharply through "Excitement builds" (3.0–3.9 s). With the plate at full opacity, the glass keeps blurring whatever is behind it, and the receded cards read as grey text on solid glass. `dim.scale` is still supported (the card scales only if it is not 1).
- **Checked in the render:** see "Checked this round" below.

### v1: the footage keeps its colour (biggest gap)
- **Vignette:** the stage vignette is now a per-variant CONFIG value, `vignette`. v1 peaks at **0.55** (v0 stays at 1, its deliberate stage).
- **Plate:** v1's sample plate is now **p01 The Keys** (daylight sign → marina → teal car and wristwatch), not p10.
  - p10 cuts to a near-black olive shot of legs from about 4 s to 6.5 s. That shot is the hero frame and most of the hold, so no vignette setting could bring its colour back.
  - p02 (the critic's alternative) still shows the official logo lockup, so it stays out (round 1 decision).
  - p01 stays in colour through the whole 7 s.
- **Glass kept:** the ink-navy glass `rgba(31,32,43,.84)` stays (round 3 decision: it holds the card edges on dark plates). With the plate fixed, the lighter DESIGN smoke wasn't needed, and at .62 more of the footage would show through the receded cards.

### v1: one full marker per line
- When the phrase wraps, every line's marker now carries the **full** #F84FA4→#FE8E4E→#FEB747 gradient (box-decoration-break: clone behaviour).
- This reverses the round 1 "one gradient across the wrap" choice. The critique named a concrete misread: "launch ever" got only the amber tail and read as a second, different highlight.
- v0 is unaffected, because its phrase is kept on one line.

### v1: the stack leaves as one group
- Every card and the tag now fade on the same frame with the same curve: opacity → 0, y → −26, 0.30 s `power2.in` from 6.55 s. Before, the 0.32 s fades were staggered by 0.03 s per card.
- The tweens are set per element rather than on `#stack`. An ancestor with opacity < 1 cuts the glass cards' backdrop-filter off from the footage mid-fade.
- Because the cards no longer turn see-through when they recede, a card's plate and its text always fade together.

### v0: the headline leads the entrance
- The card **snaps on** at T.in (no opacity ramp), so no translucent frame renders.
- The headline lines start rising **0.1 s before** the card shows, with a 35 ms stagger. The first visible frame already carries all three lines, mostly risen.
- The rest follows in reading order: meta at T.in + 0.08, dek at + 0.13, lead image at **+ 0.22** (fades in over 0.1 s), credit at + 0.32. The photo's slow push starts with its fade.
- `cardIn` takes `lead` and `stagger` for this. The stack keeps its round 4 entrance (no defect named).

### v0: type and marker polish
- **Dek:** 28 px (was 30), the same size as the meta row and the credit. The sizes are now 76 / 28, plus the 26 px chip.
- **Marker padding:** the marker is now padded **0.1em from the glyph ink** on both sides (`CONFIG.marker.pad`), not 0.08em from the advance box.
  - Each end word's ink box is measured with canvas text metrics at the headline's font and letter-spacing, from the word's left edge in the DOM. A "1" with wide side bearings no longer gets extra room on the left.
  - The headline now uses proportional figures (`font-feature-settings: "ss01" 1`, no `tnum`). The tabular "1" carried the widest side bearing, and proportional figures are the right choice in a display headline anyway. Meta rows and dates keep `tnum`.
  - The same measured padding is used on the stack.

### Kept (no defect named)
- Torn edges stay out (round 1).
- Also kept:
  - the −1° tilt;
  - the still lead image;
  - the paper payoff card;
  - the wipe-off hand-off;
  - the 1.2 s interval;
  - the 1.01 hold push;
  - v0's p04 plate and full vignette;
  - v0's 0.36 s exit.

### Hero time
4.5 s.
- v0: the clipping in its hold, with "1.5M will call out sick" lit.
- v1: two receded glass cards (grey text on solid glass) above the paper payoff card, on p01's teal car shot.

### Checked this round (frames pulled from `rounds/r05/v0.mp4` and `v1.mp4`)
- **v1 alignment (4.5 s hero, pixel scan):**
  - Both glass cards and the paper card span x 87/88–920.
  - The tag box's left edge is x 127.
  - The first ink of every meta row and headline is at x 128–131.
- **v1 colour:** the strip and the 2.9 / 3.6 / 4.5 s frames keep The Keys sign's teal, the marina greens and the teal car behind the stack. The red MARINA lettering only shows in the 28 px gaps between cards, never sharp through a card.
- **v1 marker:** in the 4.5 s hero, "be **biggest entertainment**" and "**launch ever**" each run pink → amber.
- **v1 hand-offs:**
  - frame 45 (1.5 s): mid-wipe;
  - frames 50 and 54 (1.67 and 1.8 s): card 1's text dims after the wipe;
  - frames 82–93 (2.73–3.1 s): card 3 lands and its sweep starts.
- **v1 exit (frames 195–208):** all three plates, their text and the tag fade and lift together. The frame is clear by frame 206 (6.87 s), and there is no frame of text without its plate.
- **v0 entrance (frames 2–11):**
  - frame 3 (0.1 s) is the first card frame: opaque, with the headline mostly risen;
  - frame 4 has all three lines;
  - meta and dek follow by frame 7;
  - the photo comes in at frame 10 (0.33 s) and is solid at frame 11.
  - There are no translucent slab frames.
- **v0 marker (4.5 s hero, pixel scan):** the closest ink is 8 px from the marker on the left ("1" flag) and 8 px on the right ("k" leg). In round 4 it was about 10 / 6.
- `hyperframes check` passes: 0 errors, 84/84 contrast checks. The only warning is the file length.

---

## Polish round 4 (after the round 3 critique: v0 7/10, v1 6/10; superseded where Polish round 5 says so)

### Defect fixed: v1 "biggest" read "biaaest"
- **Cause:** on the dark cards the marker was only 0.86em tall (top .11em). It clipped its own ink copy above the descenders. Meanwhile the knock-out mask hid the white g/p/y tails under it, so the descenders disappeared.
- **Fix:** the stack's marker now covers the whole glyph box.
  - I measured Inter 800 in the render browser: the tops of b and l sit .735em above the baseline, and the feet of g, p and y sit .211em below it.
  - The marker's top and height are now CSS variables on `.hed` (`--mt`, `--mh`), and the ink copy uses `top: calc(-1 * var(--mt))`, so the two can't drift apart.
  - The stack uses line-height **1.16** with `--mt: .153em` and `--mh: 1.06em`. This leaves about 3 px of padding above the ascenders and below the descenders, and about 5 px between two wrapped markers.
  - The `.w.knock` mask is removed. The opaque marker covers every glyph, so the white words underneath can never show.
- **Unchanged on v0:** v0 keeps its .11/.86em marker on purpose. On paper the words are ink, so a descender below the marker continues in ink, which is correct.
- **Checked in the render:** the hero at 4.5 s (crop of "be biggest entertainment / launch ever": both g's are whole), plus mid-sweep at 3.1 s ("biggest |entertainment") and 3.25 s.

### v0: the marker is one bar (critique fix)
- The highlighted phrase is now kept on one line (`keepPhrase: true`): its words sit in a `white-space: nowrap` span, so the browser breaks *before* "1.5M".
  - The headline reads "Survey predicts / **1.5M will call out sick** / for GTA 6 release".
  - The marker is one continuous #F84FA4→#FEB747 bar, not a pink "1.5M" chip plus a separate orange bar.
- **Robust for pasted headlines:** `fit()` steps the headline down (to at most 90%) until the kept phrase fits the 752 px measure. If it still can't fit, the phrase is released to wrap, and the marker flows across the wrap as before.
  - In the render the phrase fits at the full 76 px (the marker spans about x 115–866 inside a card that ends at x 915).

### v0: less density (critique fix, cheap)
- The lead image is now **2:1** (was 16:9), 376 px tall instead of 423 px.
- The dek is now **one line at 30 px**: "Out Thursday, Nov 19, on PS5 and Xbox Series X|S."
  - The full "GTA 6 launches Thursday…" line needed two lines even at 30 px. The headline already names GTA 6, so the dek drops the subject and keeps the Thursday fact, which is still from FACTS.md.
  - The dek is `white-space: nowrap` and steps down to 26 px if a pasted dek is too long. Only past that does it wrap.
- The card now spans about y 262–1176 (was 258–1262), so the headline is a larger share of it.

### v1: hierarchy (biggest gap)
- **The payoff card is paper.** Card 3 ("biggest entertainment launch ever") is `paper: true`: warm paper #FAF9F6 with #0B0B0E ink and the paper shadow. The stack now ends on one bright object instead of three equal dark slabs. It also brings back an article cue (paper).
  - All stack cards share radius 28 and the 26 px meta size, so the paper card matches its neighbours.
- **Earlier cards recede.** As each new card lands, the card before it tweens to opacity **.6** and scale **.97** (CONFIG `dim`, 0.45 s `power2.out`, scaled from its top centre).
  - The dim starts only *after* the previous marker has wiped off, so a marker never dims half-lit (round 2's muddy state stays gone).
  - The exit fades each card from its own opacity, so the dimmed cards don't pop back to 1 at 6.55 s.
- **"THE HEADLINES" stays solid.** The tag is now a sibling of the cards, not a child of card 1. It sits at card 1's top edge (x 128, top − 23) and stays at full opacity when card 1 recedes. It still enters with card 1 (y 56 → 0, `expo.out`) and exits with it.
- **Card 2 has no marker** (`highlight: ""`). "Excitement builds" was a dead phrase. Card 1's marker wipes off as card 2 lands, card 2 lands plain, and the sweep returns only on the payoff.
- **Separation on dark plates.** The glass shadow is now `0 2px 4px rgba(0,0,0,.35), 0 18px 48px rgba(0,0,0,.45)` (unclipped, so it darkens the gaps between cards).
  - The hairline stays at .22 and the top highlight at .28. Both are already brighter than the critique's suggested .16 and .10, so lowering them would have weakened the edges.
- **The meta line no longer repeats.** Card 2's source is now "News video", so "Video report" appears once. Both are accurate: FACTS.md lists these stories as news uploads on YouTube.
- The stack now spans y 258 (the tag) to about 1278, inside the 1480 safe line.

### Kept (no defect named)
- Torn edges stay out (round 1 decision; they are named as texture, not as a defect).
- The −1° tilt, the vignette stage, the still lead image and its push.
- The wipe-off hand-off, the 1.2 s interval, the 1.01 hold push and the 6.55 s exit.

### Hero time
4.5 s.
- v0: the clipping in its hold, with the one-bar marker on "1.5M will call out sick".
- v1: two receded glass cards above the paper payoff card, with "biggest entertainment / launch ever" lit.

### Checked this round
- Both heroes and strips.
- Render frames for v1 at 1.0, 1.45 and 1.6 s (wipe edges clean), 1.8 s (dim after the wipe), 2.7 s (paper card entering), 3.1 and 3.25 s (mid-sweep, descenders whole), 6.75 s (exit from dimmed opacity) and 6.95 s (clear).
- Render frames for v0 at 0.2, 0.6 and 0.75 s (the sweep runs as one bar), 6.75 s and 6.95 s.
- `hyperframes check` passes: 0 errors, 85/85 contrast checks. The only warning is the file length.

---

## Round 3 (after the round 2 critique: v0 7/10, v1 6/10; superseded where Polish round 4 says so)

### Defects fixed
- **v1 sweep: words washing out to white-on-gradient.** The marker no longer scales, and words no longer flip colour.
  - Each marker now sits *above* its line and carries an ink copy of the line, offset by `-left` and clipped by the marker box.
  - The marker is revealed with a `clip-path` driven by two CSS variables on the line, `--L` and `--R`. Ink therefore appears exactly at the gradient's leading edge, and no frame shows white on pink or amber.
  - On the dark cards, the white highlighted words are masked out over the same `[--L, --R]` span. A descender ("biggest") never shows as a white tail under the gradient.
  - Checked in the render at 1.47, 1.90, 2.70 and 3.20 s, mid-sweep and mid-wipe: "Excitem|ent", "big|gest" and "call o|ut sick" all show a clean edge.
- **v1 hand-off: muddy grey-on-tint state.** The previous marker no longer fades. It **wipes off left to right** over `timing.wipe` = 0.24 s, starting 0.06 s after the next card begins landing. Behind the edge the words are plain white; ahead of it they are still ink on gradient.
  - The wipe ends before the new sweep starts, so only one phrase is lit in any frame and no frame is half-blended.
- **v0 lead image: hard cuts inside the card.** The lead image is now a **still**, `assets/stills/p05-truck-yard.jpg`. It is the 1.0 s frame of p05: the man in the palm shirt gesturing at the pickup.
  - This matches the reference, which uses a still article photo. The only cuts left are the plate's.
  - The still has a slow, continuous push (1.10 → 1.045 in 0.9 s, then → 1.0 until the exit), so it never freezes.
  - Clip support stays (`thumb.src` .mp4 plus `#thumbA`), and the README says to pick one continuous shot.

### Biggest gap: a press clipping, not a widget
- **v0 now runs like an article.** The order is headline, then the meta row (`[NEWS] Local TV report · Nov 14, 2026`), then a dek, then the lead image, then the credit. This is the reference's order (headline, tag/byline/published, dek, image, image credit).
  - The source row used to sit *above* the headline with the date right-aligned, the way a phone widget does. Now the date sits inline in the meta row.
- **Dek:** "GTA 6 launches Thursday, Nov 19, on PS5 and Xbox Series X|S." in Inter 500 34 px, `#4A4A55`.
  - It is a factual line from FACTS.md (Nov 19, 2026 is a Thursday), not a quote from the article. It explains *why* people would call out sick.
  - README tells creators to paste the article's real dek if they have it. `dek: ""` drops it.
- **Lifted clipping:**
  - warm paper `#FAF9F6`;
  - radius 20 (down from 28, still on the 20/28/36 scale), which reads as a cut sheet more than an app tile;
  - a resting tilt of **-1°**, landing from -2.5°;
  - a sharp `0 2px 3px rgba(0,0,0,.35)` contact shadow, a mid lift and a large soft shadow.
- **Stage (bg:"plate" only):** a `#vig` radial vignette, `ellipse 75% 50% at 50% 38%`, from .06 at 42% to .6 at the edge. It fades in with the card and out with the exit, so the loop stays clean. It is hidden for `bg:"none"`.
- **Torn edges stay out.** Round 1 dropped them on purpose as cheap. The critique names them as part of the reference's texture, not as a defect. The tilt, the contact shadow, the vignette stage, the dek and the still photo carry the clipping cues instead.
- **Safe zone with the tilt:** the card is now 832 wide at x 88, centred on x 504.
  - Rotated -1° and pushed to 1.01, it peaks at about x 75–933 and y 258–1262.
  - In the hero it spans x 77–931.

### v1 material and de-clutter
- **Ink-navy cards:** `rgba(31,32,43,.84)` with blur, an inset hairline at .22, a 1 px top highlight at .28 and a contact shadow. The edges now hold on the dark p10 plate; the hero at 4.5 s shows all three card outlines.
- **"News" no longer repeats.** It appeared six times in round 2. The NEWS chips on stack cards are gone. The meta rows are now "Local TV · Nov 2026" (KGW) and "Video report · Nov 2026" (the two stories with unknown outlets).
  - "Video report" is accurate: FACTS.md lists these as news uploads on YouTube.
  - Meta is Inter 600 26 px at `rgba(255,255,255,.62)`.
- **Section label:** the loose glass pill with 0.36em tracking is replaced by a **solid paper tag**, "THE HEADLINES" in Inter 700 26 px with 0.16em tracking.
  - It sits on the first card's top edge (child of card 1, top -23 px), so it moves with the card, reads on any footage and no longer floats.
- **Spacing:** without the chip, each card is about 20 px shorter. That height went to the gap (24 → 28) and to card 1's top padding for the tag. The stack spans y 258–1232.

### Entrance (v0)
- The card fades in over **0.067 s** `power2.out` (was 0.18 s in round 2): one partial frame, then solid.
- The move starts from **y 56, scale .94, rotation -2.5°** and runs 0.5 s `expo.out` to 0/1/-1°.
- The lead image is solid by 0.067 s while it finishes its rise.
- In `v0-entrance.jpg` the second tile (0.125 s) is already an opaque card with the headline rising: no milky slab.

### Kept (no defect named)
- The real headlines, the sunset marker as the one accent, and its phrase-wide gradient across wraps.
- Inter 800 at 76/54 px with the auto-fit.
- The p04 plate for v0 and the p10 plate for v1 (p02 shows the official logo).
- The 1.01 hold push, the 6.55 s exit and the 1.2 s stack interval.

### Hero time
4.5 s. v0 is the tilted clipping in its hold, with the marker complete and the still lead image. v1 has all three ink-navy cards, with "biggest entertainment launch ever" lit.

### Checked this round
- Both heroes and strips, and the v0 entrance.
- v1 frames at 0.67, 1.5, 1.88, 3.1, 3.3 and 4.5 s from a scratch copy, plus render frames at 1.47, 1.90, 2.70 and 3.20 s.
- `hyperframes check` passes. The marker's ink copy, the masked words and the lead image's push are marked `data-layout-allow-*`, because the overlap is the design.

---

## Round 2 (after the round 1 critique: v0 7/10, v1 6/10; superseded where Round 3 says so)

### Defects fixed
- **v1 gray highlight boxes:** the `.glass .hed .mark` background is now transparent. The marker is only ever the sunset gradient. At hand-off, the whole previous marker fades to opacity 0 over 0.3 s and its words return to white, so only one phrase is lit in any frame. The round-1 "quiet glass mark" idea is gone, because it read as a text selection.
- **v0 misquoted headline:** the 0.0M→1.5M count-up is removed (along with `roll` and the `KitMotion` dependency). "1.5M" is correct on every frame. The marker now starts at 0.55 s (`timing.sweep`) and moves at 2200 px/s, so "1.5M will call out sick" is fully lit by about 0.9 s (round 1: 1.3 s).
- **Safe zone during the hold:** cards are now 840 wide at x 84 (they were 864 at x 72). The hold push is capped at `timing.hold` = 1.01. At peak, the v0 card spans x 80–928 (scaled from its top centre). The v1 stack spans x 80–928, scaled around x 504, the centre of the card column. Both stay inside 936.

### Entrance (no empty slab)
- The card, the kicker and the first headline line all start on the same frame.
- The card fades in over 0.18 s (it was 0.5 s), rising from y 40 instead of 70/90, with scale .96→1 over 0.45 s `expo.out`.
- Lines rise from their masks with a 50 ms stagger.
- On v0, the lead image starts 0.04 s after the card, so the bottom of the card is never blank.

### Reads as news, not a widget (biggest gap)
- **v0 lead image:** the late "GTA 6 · out Nov 19 | PS5 · Xbox Series X|S" footer is replaced by a 16:9 lead image under the headline, the way the reference article clipping works (headline, then image, then credit).
  - The image has radius 16 and a 1 px inner hairline.
  - It is filled from a clip in CONFIG (`thumb.src`). The sample uses p05 truck yard: a man in a palm shirt by a pickup, one continuous shot from 0 to 5.0 s, so the image doesn't cut every second. p07 was tried first and cut four times in 7 s, which read as a montage rather than a lead image.
  - The image eases in from scale 1.08 to 1 inside its mask.
  - Under it is a muted 28 px credit line: "Image: official GTA 6 trailer". The credit is true (every plate is cut from official trailers) and it gives the card the reference's "(Image credit: …)" texture without naming an outlet.
  - `thumb: null` drops the image, and the card then ends 44 px under the headline.
- **Date type:** dates are now Inter 600 28 px with `tabular-nums`. JetBrains Mono made it look like a dev widget.
- **v1 content:** the stack now has three different stories that build to the biggest claim. Every card shows the date as "Nov 2026":
  1. "GTA 6 launch has gamers planning to call out sick and skip work" (KGW, a local TV station), with "call out sick" highlighted.
  2. "Excitement builds ahead of latest Grand Theft Auto release", with "Excitement builds" highlighted.
  3. "'Grand Theft Auto VI' could be biggest entertainment launch ever", with "biggest entertainment launch ever" highlighted. The final sweep is now the biggest claim.

  Cards 2 and 3 have an unknown outlet, so their source line reads "News report" rather than claiming "TV news". v0 keeps the Survey/1.5M story, so the two variants carry different real content.
- **v1 has no per-card thumbnails, on purpose.** I measured a right-side square image (176 px) next to each headline. It forces the 54 px headlines to four lines in about 550 px, so each card grows by about 70 px and the stack runs past y 1480. v1 stays a headline roundup. Its news cues are three real, distinct, dated stories with the source type on each, and one lit phrase per frame.
- **Stack pace:** cards land every 1.2 s (was 1.35 s). The stack is complete with its final sweep by about 3.3 s (was about 3.9 s).

### Robustness
- **Headline auto-fit (`maxLines`):** the render browser sets Inter about 3% wider than the snapshot browser. At 76 px, the v0 headline wrapped to four lines in the real render, with "release" orphaned and the marker split three ways.
  - After fonts load, `fit()` steps the headline size down 2 px at a time (to at most 80% of the CSS size) until it fits `maxLines` (3).
  - v0 now renders three lines: "Survey predicts 1.5M / will call out sick for / GTA 6 release". The same check protects headlines that creators paste in.
- **Lead-image video:** `#ov` is now a plain, untimed div. The framework-owned `<video id="thumbA">` is moved inside the card at build time without nesting a timed video in a timed wrapper. Unused thumb videos are hidden, like the plates.

### Kept from round 1 (no defect named)
- Inter 800 headline with tight tracking; the black-on-sunset marker with its gradient flowing across a wrap.
- The light paper card with its two-layer shadow for v0; the smoked glass for v1.
- The neutral `NEWS` chip; the p04 plate for v0 and p10 for v1 (p02 shows the GTA VI logo).
- The 6.55 s exit.

### Hero time
4.5 s. v0 is in its hold with the marker complete and the lead image showing the palm-shirt shot. v1 has all three cards in, with "biggest entertainment launch ever" lit on the last card.

### Checked this round
- Both heroes and strips, and the v0 entrance (marker complete by 0.875 s).
- Snapshots of v1 at 0.3, 1.5, 1.9, 2.85 and 3.4 s: no leftover marks, and no empty slab on any card's entrance.
- `hyperframes check` passes. Its one info note is the lead image's intentional 1.08 ease-in overflow inside the mask.

---

## Round 1 (superseded where Round 2 says so)

### Format and reference
- **Reference:** `refs/article-headline-card/LTSbTRP97Js-17`, a creator showing an article screenshot. It has a bold condensed headline, a red section tag, a byline and dek, torn paper edges and a vignetted, blurred background.
  - We keep what works: a big dark headline on a light paper surface, a small tag and meta row, and a card that reads as "the press is saying this".
  - We drop what makes it look cheap: torn edges, the outlet's red brand tag, real bylines and the screenshot crop. We use a native-built card instead: radius 28, a sharp contact shadow plus a large soft one, a 1 px hairline, and Inter 800 at 76 px.
- **Publication-neutral:** a neutral `NEWS` chip (ink on paper, or paper on glass) plus the kind of source ("Local TV report", "TV news") and the date in JetBrains Mono. No outlet names, logos or mastheads. This follows the DESIGN.md trademark and real-content rules.
- **Headlines:** all real, from `research/gta6/FACTS.md` (Nov 2026 news uploads).
  - The FOX 13 Seattle piece is the only one with a known exact date (Nov 14, 2026). The others show "Nov 2026" rather than an invented day.
  - The single card's footer uses known facts only: release Nov 19, 2026, on PS5 and Xbox Series X|S.

### The accent
- The one sunset accent per frame is the **highlight marker**: `#F84FA4 → #FE8E4E → #FEB747`, with ink text on top.
  - Ink on the pink end is about 6:1 contrast, so it stays readable at 360×640.
  - When the phrase wraps, each line gets its own marker. The gradient is sized to the whole phrase and offset per line, so it flows pink→amber continuously across the wrap.
- Stack: only the newest card holds the sunset marker. When the next card lands, the previous marker fades to a quiet `rgba(255,255,255,.13)` glass mark and its words go back to white. The emphasis stays readable without three gradients at once.
- No police red or blue, even though this is news. DESIGN.md reserves those for breaking-news or wanted states, and these are feature headlines.

### Variant split
- **v0 Single card (light paper):** the hook, placed at y 318–845 in the upper third.
  - "1.5M" rolls up from 0.0M with tabular numerals, so the width stays fixed. It lands as the marker finishes: "counters roll, highlights sweep".
- **v1 Stack of three (smoked glass):** `rgba(14,14,20,.74)` with blur(20) and saturate(1.4), a 1 px inner highlight and a hairline. It reads on bright daylight and murky footage alike.
  - The stack runs from y 262 to about 1310, inside the safe zone. The headline steps up from "biggest entertainment launch ever" to "1.5M will call out sick" to "skip work".
  - The "IN THE NEWS" label sits on a matching glass pill. As bare white caps it went weak over the pale sky in p10 (about 2.6 s).

### Type
- Three sizes per frame:
  - headline: 76 px (v0) or 54 px (v1, three cards);
  - labels: 28 px;
  - all Inter, with JetBrains Mono for dates.
- Headline: Inter 800, tracking -0.035/-0.03em.

### Motion
- **Card in:** y +70/90 → 0, scale .955 → 1, opacity, 0.5 s `expo.out`.
- **Headline:** lines rise from masks, 65 ms stagger.
- **Marker sweep:** linear at 1900 px/s, line by line. On glass cards, each word flips white → ink as the marker passes about 55% of the word.
- **Hold:** a slow 1 → 1.02/1.03 push so it never freezes.
- **Exit:** 0.32–0.36 s fade and lift at 6.55 s. The frame is clear by 6.95 s, so it loops.
- Every start state is primed with `gsap.set` at build time. An early draft showed the marker, lines and footer before their tweens; this is the fix.

### Plates
- v0 uses p04 (drive-by past a police mural), as the manifest suggests.
- v1 uses **p10 police car street instead of the suggested p02**. p02-blue-club shows the official GTA VI logo lockup for about 2–5 s, which would put a trademark in our render.

### Hero time
4.5 s. v0 is in its hold with the marker complete. v1 has all three cards in, with the third card's "skip work" carrying the accent.

### Checked this round
- Both heroes and strips, the v0 entrance and exit, and the v1 entrance.
- A `bg:"none"` webm frame decodes as rgba with only the cards present.
