# #40 Rumor stamp: decisions

## Concept
A card holds a claim, and a verdict stamp slams onto it. The card has a source chip (where the claim came from), a dateline (when), and the claim itself as a two-line headline. The stamp is the payoff. It uses one object grammar for both states, so a creator can cut between a "rumor" beat and a "confirmed" beat in the same short and the viewer reads the difference instantly.

- **Reading order:** source, date, claim, verdict. The source chip is the card's header, the way a post shows its author first. The dateline sits under it, the way the article ref has a byline and date and the terminal ref has a dateline. The claim is Inter 800 at 80 px, the article-headline weight from `refs/article-headline-card`. The verdict lands at 0.40 s (round 3; it was 0.72 s in round 2 and 1.2 s in round 1).
- **The two stamps share one construction** (since round 3): 20 px radius, an inner hairline at 9 px inset, Barlow Condensed 900 verdict word, Inter 600 tracked kicker.
  - **Unconfirmed** is hollow: a clean 4 px rule plus a 1.5 px inner hairline, both in the Leonida sunset (pink `#F84FA4` → `#FE8E4E` → amber `#FEB747`), with the verdict word in the same gradient, on a smoked backing. It is provisional.
  - **Confirmed** is a solid teal seal with navy ink, a navy hairline and a check that draws in. It is clean, official and finished.
  - The hollow-vs-filled contrast carries the meaning even at thumbnail size or for colour-blind viewers.
- **Colour:** one accent per variant. The rumor stamp carries the Leonida sunset gradient (DESIGN: the gradient goes on ONE thing per frame, and here that thing is the stamp). Vice teal `#2EC4B6` marks confirmed, as DESIGN.md reserves it for. The chip icon disc uses the variant's anchor colour (amber or teal).
- **Card styles differ by variant:**
  - v0 is a smoked-glass card in the hook band (top y 272). The stamp hangs off its bottom edge, toward the frame centre, with its right edge flush with the card's (`right: 8px`; the -4° corner reaches about x 934). With `bg:"none"` the smoke goes from .66 to .78 alpha (the stamp backing from .74 to .84), because the transparent export has nothing to blur.
  - v1 is an ink-navy `#1F202B` card with white type (round 3; it was white paper), just above the caption zone (bottom edge at y 1372). The seal sits on its top edge. The card's top padding of 120 px keeps the seal's lowest corner about 45 px above the source chip. `theme: "paper"` is still available in CONFIG.
  - Both stay inside x 72–936 and y 230–1480. The card spans 864 px (80% of the width).
- **Type:** three sizes per frame: 28 px (chip, dateline, stamp kicker), 80 px (claim), 104 px (stamp word). Inter, Barlow Condensed and, for the v0 dateline, JetBrains Mono.
- **Datelines:** v0 uses JetBrains Mono (the terminal ref's dateline: data, unverified). v1 uses the Rockstar date style from DESIGN: white Inter 600 caps tracked 0.35em with a 2 px `#EE08F2` offset on the right and a soft bloom, like the official "COMING 2025" line. The split is deliberate: plain data for the rumor, Rockstar's official date treatment for the confirmed fact.

## Motion
- 0.20 s: the card rises in as one object (y +24 → 0, opacity 0 → 1, expo.out, 0.32 s, `timing.cardDur`). Chip, dateline and claim settle with it (+0.02 / +0.04 / +0.05 s, 0.26–0.28 s), so the card is never empty.
- 0.40 s: the stamp slams in while the card finishes settling. It appears at full opacity on ONE impact frame at scale 1.15 and settles to 1 over 3 frames (power2.out), per DESIGN. There are no approach frames and no echo ring. On that frame the footage shakes 6 px over 5 frames and the card wrapper (`#hit`) takes a 7 px nudge, which is the impact cue that still works with `bg:"none"`.
- v1: the check draws in 0.1 s after the seal lands (0.28 s).
- 6.55 s: the whole unit fades and drifts away from the centre over 0.35 s, so the piece loops cleanly at 7.0 s.

## Content (FACTS.md)
- **v1:** "GTA 6 launches November 19, 2026", sourced to Rockstar Games. This is the confirmed release date in FACTS.md. The dateline reads "Verified · Nov 18, 2026": the day the creator checked it (FACTS.md is checked 2026-11-18). It does not claim when Rockstar announced the date, which FACTS.md doesn't record.
- **v0:** "GTA 6 is coming to PC in 2027", sourced to "Unverified X post", "Posted · Nov 18, 2026". It is a demo of a rumor: it names no leaker, account or outlet. FACTS.md says no PC date has been announced, which is exactly why it is stamped UNCONFIRMED. Claim, source and date are creator-fill CONFIG fields.
- No logos, no Rockstar marks, no Pricedown.

## Plates
- The manifest suggests p02-blue-club / p01-keys-sign.
- **p02 is not used.** It shows the official GTA VI logo full-frame from about 2 s to 6 s, and then the pre-order end card. Under the no-trademarks rule, a critic would rightly flag it.
- **v0 uses p01-keys-sign.** It has a bright sky behind the top card and real cuts at about 2 s and 4 s.
- **v1 uses p06-lucia-gate.** It is golden hour, Lucia's face stays clear above the lower card, and it cuts at about 6 s.
- The plate sits in `#cam` with `inset:-10px`. That 10 px bleed exists only so the 6 px impact shake never shows an edge. Otherwise the plate stays at `object-fit: cover` with no zoom.

## Round 1
- First build of both variants.
- **Self-review fixes before submitting:**
  - The claim went up from 66 to 80 px, because at 66 px it filled only about 55% of the card.
  - The chip and claim now enter with the card. Before, one frame showed an empty smoked box.
  - The ink-wear mask is softer and lower in frequency. The first pass looked sandy.
  - The chip's "?" is now a drawn path on a filled amber disc. The `hyperframes check` contrast lint failed on an SVG `<text>` glyph.
- Checked that `bg:"none"` renders a clean transparent overlay: a VP9 webm composited over a solid colour.

## Round 2
The round 1 critic scored both variants 7. The biggest gap was that the verdict landed late. The critic also named two alignment defects.

- **Defect, v1 (stamp crowded the chip):** the seal's bottom-left corner sat 13 px above the source chip, and its shadow fell on the chip.
  - `#unit.bottom #card` top padding went from 88 to 120 px. The seal stays anchored 60 px into the card, so the gap is now about 45 px.
  - The seal's drop shadow is tighter (`0 12px 26px -12px`, was `0 26px 60px -18px`). The shadow no longer reaches the chip, and a seal pressed onto paper shouldn't float anyway.
- **Defect, v0 (notched silhouette):** the card's rounded corner stuck out about 30 px past the stamp. `#unit.top #stamp` `right` went from 34 to 8 px, so the stamp's edge now meets the card's edge, and the rotated corner stays inside x 936.
- **Biggest gap (both variants, late verdict):**
  - `timing.stamp` went from 1.2 to 0.72 s. The card tween is now 0.36 s (was 0.42 s), via the new `timing.cardDur`.
  - The stamp now lands about 0.16 s after the card settles, instead of after 0.6 s of dead hold.
  - The impact choreography (2 approach frames, one impact frame, 6 px shake, ring, check draw) is unchanged.
- **Biggest gap, v0 (grunge-preset wear):**
  - The full-coverage 420×210 noise tile is gone. The wear mask is now built at the stamp's measured size.
  - Fine grain is gated by low-frequency patches, so the wear clusters instead of peppering.
  - A soft band mask allows wear only within about 26 px of the stamp's outer edge: the 6 px border, the inner rule, the tops of the kicker letters and the feet of the verdict letters.
  - The band is offset 5 px up and right, so the lower-left edge (the heavier side of the press) wears a little more.
  - The letter interiors are solid `#FEB747`. Coverage is about 5% of the ink, judged by eye from a 2x crop. Both seeds are fixed (`stamp.wearSeed`).
  - The rubber-stamp material is a deliberate round 1 decision, so I kept it and fixed how the wear looks rather than dropping it.
- **Content, v0:** the source chip now reads "Fan theory" instead of "Anonymous forum post", so the demo no longer invents a source. The claim is marked as a creator-fill field in CONFIG.
- **v1 card edge on the pale tee:** the inset hairline went from rgba(0,0,0,.06) to .12, and the contact shadow from `0 1px 2px .30` to `0 2px 4px .35`.
- **Unchanged on purpose:** card and stamp materials, colours, type sizes, placements and plates.

## Round 3
The round 2 critic scored both variants 7. The biggest gap was that the status landed about 0.45 s after a card with an obviously empty reserved slot, and that the styling was generic app UI with no Leonida or Rockstar cue. One defect was named.

- **Defect, v1 (echo ring double print):** the slam echo ring (`#ring`) sat about 12 px down-left of the seal for frames 23–28. I removed the ring entirely. I also cut the two approach frames, including the 1-frame ghost at about 1.4x scale and 30% opacity. The stamp now appears at opacity 1 and scale 1.15 on the impact frame and settles to 1 over 3 frames (`impact.scaleFrom` 1.15, `settleFrames` 3), exactly as DESIGN describes. The footage shake and card nudge remain as the impact cues.
- **Biggest gap, timing (both variants):**
  - The card now rises in (y +24 → 0, opacity 0 → 1) over 0.32 s from 0.20 s, replacing the y/scale fade.
  - `timing.stamp` went from 0.72 to 0.40 s. The status reads by 0.43 s, and the reserved padding (92 px in v0, 120 px in v1) is never on screen without the stamp for more than 2 frames.
  - The card nudge moved to a wrapper (`#hit`). The stamp now lands while the card's own entrance tween is still finishing, and the two tweens no longer fight over the same `y`.
- **Biggest gap, v0 (caution-tape grunge stamp):**
  - The seeded `.worn` speckle mask (`--wear`, `wearSeed`) is gone. It was a deliberate round 1 choice, but two critics in a row named it as a cheap preset, which is a concrete styling defect.
  - The stamp now uses v1's construction: a clean 4 px rule plus a 1.5 px inner hairline at 9 px inset.
  - The ink is now the Leonida sunset gradient (pink → amber) instead of flat amber on black. That breaks the caution-tape reading and gives the rumor state the DESIGN signature accent. The hollow material is unchanged.
- **Biggest gap, v1 (stock white notification card):** the card is now ink-navy `#1F202B` with white type, per DESIGN ("Ink-navy for official-style cards"). The dateline uses the Rockstar date style (0.35em tracking, 2 px `#EE08F2` right offset). The teal seal reads harder against navy than it did against white.
- **Evidence (both variants):** I added a 28 px dateline under the chip. v0 says "Posted · Nov 18, 2026" in JetBrains Mono, and v1 says "Verified · Nov 18, 2026" in Rockstar date style. The v0 source is now "Unverified X post" (it was "Fan theory"). The card's claim margin went from 24 to 16 px to absorb some of the new line's height.
- **Radius scale:** the stamp radius went from 16 to 20 px (the inner hairline from 9 to 11 px), so it stays on the 20/28/36 scale.
- **bg:none:** the smoke card alpha goes from .66 to .78 (and the stamp backing from .74 to .84) only when there is no plate to blur.
- **Check fixes during the round:** I moved the masked rule layers behind the stamp text in the DOM. I also removed the 8 px bleed padding on the gradient word, because `hyperframes check` flagged both as text occlusion. The caps sit inside the 0.9 line box, so nothing is clipped.
- **Unchanged on purpose:** placements (top vs bottom), the v0 smoked glass, the hollow-vs-solid contrast, type sizes, plates, the shake, the check draw, the exit and the loop.
