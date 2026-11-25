# Decisions: 43 Phone message

## Round 1
**References.** The phone references (`phone-call-overlay/g1Z4s2m8qGk-62.5`: a GTA V-style "INCOMING" handset in the bottom-left; `VrX0-5DdK-s-31`: an iPhone mockup with a green call banner) show that the format works. They also look cheap: a low-res handset, a tiny banner and system-green chrome. The chat references (`chat-message-card/agqd…`, `LTSb…`) show that one message per beat, with a round avatar and a bold name, reads instantly. Rockstar's own graphics (`official-type/`) set the colour: ink-navy and plum night surfaces with one sunset accent, and in-world phone and social UI that is clean, flat and white-on-dark.

**Key decisions**
1. **Two different objects, one language.** Variant 0 is a lock-screen banner (glanceable, upper third, leaves the footage clear). Variant 1 is a full handset thread (a story beat, so the phone carries the frame). Both are dark smoked or plum, so they match GTA's night-phone feel and read on bright or dark footage.
2. **One accent per frame.** In the banner it is the sunset app badge. In the thread it is your outgoing bubble, which uses the pink→amber core gradient with ink text, because white on amber fails contrast. Everything else is white at fixed opacities.
3. **Real face, no logos.** The avatar is a still of Lucia cut from the sample trailer plate (p06 at 5.0 s), so "Lucia" reads in under 0.6 s. There is no iFruit, Apple or Rockstar mark. The app glyph is a plain speech bubble, and the phone is a generic slab with a punch-hole camera.
4. **Fan voice, real facts.** The texts are fan-made lines in a fictional character's voice ("Pre-load's done.", "Tomorrow. Vice City."). The only facts are the release date (Nov 19, 2026; the chip reads "Wed, Nov 18 · 11:58 PM", the eve of launch), the live pre-load and Vice City.
5. **Motion.** The banner drops in with `expo.out` (0.5 s), then gives a 4-leg buzz of at most 5 px. The second text lifts the first away through a 3 px blur while a stacked card peeks out beneath, and there is one more buzz. The handset rises with a 3° settle. Each of her texts gets about 0.55 s of seek-safe typing dots (`KitMotion.drive`) before the bubble pops from its tail corner (`back.out(1.2)`). Your reply is typed with `KitMotion.typeText` (24 cps, seeded rhythm), then the send button presses and the text lands as a bubble rising from the composer. Both variants clear by 6.9 s so the clip loops.
6. **Type.** Inter only, at two sizes per frame: 44 px for names and messages, 28–30 px for labels. Tabular figures are switched off in running text, because Inter's tabular hyphen rendered "Pre-load" as "Pre - load".
7. **Plates.** Variant 0 uses p03 (Jason at the door, then driving; someone is texting him). Variant 1 uses p07.

**Self-check fixes in this round**
- The composer placeholder never came back after sending, because `typeText` keeps the placeholder hidden. The placeholder now fades on its own wrapper.
- The hyphen in "Pre-load's" rendered with extra space; switching off `tnum` in message text fixed it.
- The thread left about 300 px of dead screen. I shortened the handset (to 1120 px), raised the type to 44 px and kept every message to one line.
- The banner type went from 40 to 44 px and the avatar from 120 to 136 px for phone legibility. The avatar crop is now tighter on her face.

## Round 2
Critic r01: v0 6/10, v1 7/10, and both won the blind pick. Biggest gap: "a stock iOS banner and an iPhone Messages mock with no in-world GTA identity", and v0's second text crossfaded inside the same card.

**Defect fixed: two strings in one box (v0).** The in-place `.nt-msg` crossfade is gone. Every text is now its own banner, cloned from `#ntTpl`. At each arrival the new card drops in on top (y -60→0 and opacity 0→1, 0.38 s `expo.out`). Every older card steps one level back, scaling from the bottom edge: depth 1 is scale 0.94, y +34 and opacity 0.72, which leaves a visible 34 px lip; depth 2 is 0.88, +62 and 0.42. The old card's content (avatar and text) fades out over 3 frames, timed so its last visible frame is t2 and the new card's first visible frame is t2 + 1 frame. I checked every frame from 1.87 to 2.2 s and from 3.67 to 4.0 s: no frame shows two strings, and no frame is empty. Receded cards get a light veil (`.nt-veil`: white at .20 plus a .30 bottom hairline), so the stack edges read even on dark footage. The r01 22 px `.nt-peek` sliver was removed, because the receded cards are the stack now.

**Biggest gap: in-world identity (both).** Added a fictional network tag, "LEONIDA", set in the Rockstar-style label voice: Inter 600, 24 px, caps, 0.3em tracking, white at .62. v0 shows "LEONIDA · NOW" where "now" was. v1 puts it in the status bar after the clock. v1's other small labels use the same voice: "VICE CITY" under the name, the "WED, NOV 18 · 11:58 PM" stamp and "DELIVERED". That gives the phone one consistent in-world label system rather than iOS grey mixed-case. It still carries no logos. The sunset gradient stays on the badge (v0) and the sent bubble (v1) only.

**Dead time.**
- `timing.in` changed from 0.35 to 0.08 in both variants.
- v1's first typing bubble now starts at 0.30 s (`timing.typingAt`), and `typing` dropped from 0.55 to 0.35 s, so "You still up?" lands at 0.65 s instead of about 1.6 s.
- v1's pacing uses `read` 0.55 s and `cps` 20, so the last text still lands at about 4.3 s.
- In v0, `timing.second` moved from 2.7 to 2.0. Moving it earlier would have made the tail hold longer, so I added a third banner at 3.8 s (`timing.next` 1.8). The texts now land at 0.08, 2.0 and 3.8 s, and the final hold is 2.3 s of reading time rather than 3.8 s of a static card.
- v1 now has a trailing "typing…" row (`typingAfter`) from about 4.85 s to the exit, so the final hold keeps moving.

**Haptic.** Each v0 arrival gets a 2-cycle ±6 px nudge, frame-aligned (one frame per leg). At 30 fps every rendered frame then hits a peak. A 0.12 s sub-frame buzz would alias to almost nothing.

**Legibility in transparent exports.** The `.nt` background changed from .70 to .84, because `backdrop-filter` has nothing to blur in a `bg:"none"` export.

**v1 composer.** The placeholder dropped from 44 to 34 px, at .36 white instead of the critic's .32 (.32 fails 3:1 contrast on the plum screen). The typed draft is also 34 px, so the field reads as one consistent size. `.cmp-plus` went from 80 to 68 px, the send button from 78 to 68 px and the field from 100 to 88 px tall. v1 now uses three sizes: 44 / 34 / 24.

**Copy (v0).** The messages are now "Pre-load's done. You ready for tomorrow?", "Nov 19. Vice City. Just you and me." and "I'm outside. Don't keep me waiting." The last line fits the p03 plate, where Jason is at the door. These are still fan voice. The only facts are Nov 19, the pre-load and Vice City.

**Kept on purpose.** The handset form, the dark plum surfaces, the real-face avatar and the one-accent rule were not named as defects, so they stay.

Hero time: 5.0 s (v0 shows the 3-card stack, v1 the full thread plus the trailing typing dots).
