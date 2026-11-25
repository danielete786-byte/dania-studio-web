# Decisions · 49 Follow CTA

## Round 1

### Shared
- **Centred on the frame, not the safe box.** Everything sits in x 144–936 (792 px wide, 73% of the frame), which is centred on x = 540 and still clears the right-hand action rail (x > 936). A centred end card reads as deliberate; a box centred on the safe zone looks 36 px off.
- **Headline type:** Inter 600 caps kicker tracked 0.36em (Rockstar's "PRESENTS" / date-line style, from `refs/official-type/`, without the magenta offset so the frame keeps one accent) over a two-line Barlow Condensed 900 headline at 116 px. Lines rise out of a mask (expo.out, 0.5 s, 90 ms stagger).
- **Three sizes per frame:** 116 / 40 / 28 px (v0) and 116 / 44 / 28 px (v1).
- **Scrim:** a soft top gradient (rgba(4,4,10,.5) → 0 over 980 px) fades in under the headline so white type holds on bright daylight plates. It is gradient-only, so on a transparent render it just darkens the creator's clip, never shows a box edge.
- **Exit:** both blocks lift 28 px and fade over 0.35 s at 6.55 s; 7.0 s total so it loops.
- **References:** the creator end cards (`endcard-arrow-next-video`: "random video" + arrow to the next video; `cta-link-below`: magenta "Link Below!"; `end-screen`: red slash end-screen template) prove the format (a direct "watch next / follow" ask at the end) but are crude. analysis-3 notes nobody in the niche has a native 9:16 CTA or branded end card, and that the cleanest in-world UI is the social card with "avatar + handle + outlined Follow pill". This component takes that social-card language and Rockstar's end-tile colour instead of stickers.

### Variant 0 · Follow button
- **One object:** a smoked-glass profile card (smoke rgba(14,14,20,.62) + blur 20 / saturate 1.4, 1 px inner highlight, contact + soft shadow, radius 36) holding avatar, handle, pitch and a full-width 120 px pill button.
- **The press is the payoff:** a touch indicator (iOS screen-recording style circle) lands on the button at 1.53 s, presses at 1.95 s (button scale .95, 100 ms), releases with back.out(1.6), a ripple spreads from the tap point, and the face swaps Follow → Following on the house clocks (150 ms out / 250 ms in) while the check draws. The "Following" state is a white-outlined glass pill: no teal, so the sunset "PART 2" stays the only accent.
- **Accent:** the sunset core gradient (#F84FA4 → #FE8E4E → #FEB747) on "PART 2", drifting slowly across the word through the hold so the frame never looks frozen.
- **Plate:** p04 drive-by mural (night). The suggested p02 blue-club plate shows the official GTA VI logo full-frame from ~1.8 s to ~5.5 s, which breaks the no-trademarks rule, so it was swapped.

### Variant 1 · Next part card
- **One object:** an ink-navy #1F202B end tile (Rockstar's end-card colour, analysis-3) with a 16:9 preview clip, "PART 2" glass chip, glass play button, handle + "PLAYS IN N" meta row, a 44 px two-line title and a progress bar.
- **Motion that carries the hold:** a YouTube-style autoplay countdown. The bar fills linearly 1.3 → 6.3 s in the sunset gradient (the frame's one accent) while the label ticks 5…1, then reads "PLAYING" as the play button presses.
- **Preview clip:** p06 Lucia gate (16:9) inside the card; the card is the graphic, so it shows even with `bg: "none"`. Title is creator-fill copy that only names real things (Vice City, the Launch Trailer).
- **Plate:** p01 Keys sign, as suggested.

### Changes during round 1 self-check
- p02 → p04 for v0 (trademark logo in p02).
- "PART 2" rendered muddy brown: the shared `.line > span` text-shadow out-specified `.grad`'s `text-shadow: none` and showed through the transparent glyph fill. Fixed the selector; the gradient keeps a `drop-shadow` filter for legibility instead.

## Round 2 (critique r01: v0 7, v1 6; gap: "neither payoff lands")

### Defects fixed
- **v1 `CONFIG.thumb` was dead config.** The script now sets `#thumbClip`'s `src` from `CONFIG.variants["1"].thumb` before the timeline builds, with the same guarded `setAttribute` that 15-magnifier uses. Editing CONFIG now changes the preview in the export.
- **v1 "Playing" held for only 0.25 s.** The countdown now runs 0.9 → 4.9 s (`countStart` 0.9, `countFrom` 4), so the Playing state holds for 1.65 s before the 6.55 s exit.

### Shared
- **Entrance split.** The card's opacity now lands in 0.18 s (power1.out), while y/scale keep the 0.55 s expo.out glide. The body is solid before its contents arrive, so v1 no longer shows a see-through navy slab. Content follows a stagger: v0 runs avatar 0.74 → handle 0.80 → sub 0.86 → **button 0.92**, so the Follow pill never floats alone. v1 runs meta 0.72 → play 0.80 → title 0.79 → chip and bar 0.86.

### Variant 0 · Follow button
- **Solid success state (reverses r01's ghost pill, because the critic named a concrete defect: it read as disabled).** "Following" is now Vice teal #2EC4B6 with ink text and an ink check, and it has the same contact and soft shadow as the white Follow face. DESIGN.md reserves teal for success/check states, which this is; the sunset gradient on "PART 2" stays the frame's one accent.
- **Release becomes the settle.** At P+0.12 the button goes 0.95 → 1.04 in 0.2 s (power2.out), then back to 1 in 0.32 s, so "Following" lands with more weight than "Follow" did.
- **Press earlier:** `tap.at` moves from 1.95 to 1.5 s. The touch indicator arrives at P-0.34, after the button has entered.
- **Second beat at 2.6 s (`subDoneAt`):** the pitch "GTA 6 clips, every day" lifts out and "Part 2 drops on my page" rises in (y 14 → 0, 0.3 s, white 600). The follow now leads to a concrete route to Part 2, and the hold has a second event.
- **Avatar follow badge (answers the "placeholder monogram" note):** TikTok's avatar badge, a white "+" that flips to a teal check with the button (P+0.2 / P+0.3, back.out). It makes the avatar read as real follow UI rather than a bare ring.
- The button's `overflow: hidden` moved to an inner `.fclip`, so the 1.04 settle scales cleanly while the ripple stays clipped to the pill.

### Variant 1 · Next part card
- **Countdown as a ring, not text.** "PLAYS IN N" (the smallest text on screen) is gone. A 6 px sunset ring (SVG, `stroke-dashoffset`, starts at 12 o'clock) fills around the 120 px play button over a 30% white track. The bar fills in sync and is now 12 px tall (radius 6), so it stays visible at 360 px wide. Ring and bar are one countdown signal drawn twice, so the sunset still means one thing in the frame.
- **Route instead of a promise.** The freed meta slot reads "ON MY PAGE ↓" (Inter 600 caps, .22em) with a down arrow that bobs 7 px once a second through the hold. It follows the refs, which all point somewhere (the "random video" arrow in `endcard-arrow-next-video`, "Link Below!" in `cta-link-below`). Down is where the creator's handle sits in the TikTok, Shorts and Reels UI.
- **Chip "PART 2" → "NEXT".** "Part 2" now appears only in the headline.
- **Payoff at 4.9 s:** the play button presses and its icon morphs to pause. The chip widens (tweened width) from "NEXT" to "▮▮▮ PLAYING", with three live equaliser bars driven by deterministic sines. The preview `#thumb` scales 1 → 1.04 (0.45 s power3.out), and the handle, title and bar dim to 0.5 so the clip takes the card. The route line deliberately stays at full opacity: it is the real call to action, so it is not dimmed with the rest of `.nbody` (a small departure from the critic's "fade .nbody").
- Removed CONFIG `countLabel` / `countDone`; added `chipDone` and `route`.

### Hero time
5.4 s. v0 shows solid teal Following with the "Part 2 drops on my page" line. v1 shows the Playing state (pause icon, full ring, chip PLAYING, enlarged preview).

## Round 3 (critique r02: v0 7, v1 6; gap: "both payoffs fall apart at the moment they should land")

### Defects fixed
- **v0 flip no longer goes translucent or double-exposed.** The two faces no longer crossfade, and both stay at opacity 1. At P+0.1 the "Following" face is clipped to `circle(r at tap point)` while the white "Follow" face gets a `radial-gradient` mask with a hole of the same `r`, so every pixel shows exactly one face. `r` runs 0 → R over 0.36 s (power3.out), where R is the distance to the far corner + 8 px, so the wipe stays visible for about 8 frames. The critic suggested 820 px on expo.out, but that covers the button within 2 frames and reads as a flash. A `KitMotion.drive` proxy drives it, so it is seek-safe. Once the circle passes the white label, that label is hidden outright, then the whole white face at R. The ripple element is gone because the wipe is the ripple.
- **v1 payoff no longer dims.** I deleted the tween that took `#by1` / `#ntitle` / `#bar` to 0.5. The title stays #fff at 100%.
- **v1 thumbnail gutters.** The `#thumb` 1 → 1.04 scale is gone. The preview now lifts with `filter: brightness(1) → brightness(1.08)` over 0.25 s on a new `#tv` wrapper around the video. Applying the filter to `#thumb` would also filter the chip and play button.

### Variant 0 · Follow button
- **"Following" is the app's grey-glass state (this reverses r02's solid teal; the critic named a concrete defect: a 711×120 teal slab fighting the sunset "PART 2").** It uses an rgba(255,255,255,.16) fill, a 1 px inset rgba(255,255,255,.22) hairline and white 800 text. Teal appears only on the check glyph and the avatar badge, per DESIGN's "teal = check states". The sunset on "PART 2" is the frame's only accent again.
- **Tap dot moved off the label:** `tap.x` 0.62 → 0.84 (right of "+ Follow"), tinted rgba(11,11,14,.18) with a 2 px white ring and a 1 px ink outline so it reads on the white pill. The release fade is shortened to 0.2 s so it doesn't sit as an empty ring on the glass.
- **Third beat at 3.2 s (`routeAt`), so the hold isn't dead.** A 2 px white underline sweeps under @everestchris6 (0.4 s), turning the handle into a link. A 64 px white ↓ arrow then fades in under the card (centred, 34 px below it) and bobs 8 px twice, then rests 0.7 s, repeating until the exit. The critic asked for a *sunset* underline, but the gradient is already on "PART 2" and DESIGN allows it on one thing per frame. A second sunset element would recreate the two-accent problem the same critique flagged, so the underline is white. I didn't shorten the composition (`timing.out` 5.0) because `timing` is shared and v1 needs its 4 s countdown plus the payoff hold.
- `.pmeta` now flexes to the full row width, so "Part 2 drops on my page" sits inside its container instead of overflowing it (a layout warning in r02/r03 check).

### Variant 1 · Next part card
- **No fake autoplay.** TikTok and Shorts don't autoplay a creator's next part, so the payoff no longer claims to. When the bar completes, the chip goes from "NEXT" (glass) to "OUT NOW" (white chip, ink Barlow 800). This is an opaque left-to-right wipe of the white fill while the old label rolls up and out and the new one rolls up in, with no crossfade, so there's no ghost chip. The play icon stays, and the play button gives one 1 → 1.07 → 1 pulse instead of a press.
- **The route lights up.** The handle and "ON MY PAGE ↓" sit at 62% white through the countdown, then go to 100% white at the payoff, and the arrow makes 2 bobs of 10 px. The old once-a-second bob through the whole hold is gone. The route is the actual instruction, and it now switches on exactly when Part 2 reads "out now".
- **One countdown.** The sunset ring is gone, and the play button keeps a static rgba(255,255,255,.30) track. The 12 px sunset bar is the only countdown, so the gradient appears once per frame.
- CONFIG: `chipDone` is now "Out now". The equaliser markup and the pause icon are removed.

### Shared
- **Headline 116 → 104 px** to sit inside DESIGN's 64–110 px title range. Cards moved up to keep the gaps: v0 card top 790 → 772, v1 card top 650 → 630.

### Changes during round 3 self-check
- The first r03 pass still crossfaded the v1 chip (glass "NEXT" over white "OUT NOW" for 2–3 frames), so I rebuilt it as the wipe + roll described above.
- The touch-dot release was shortened from 0.32 s to 0.2 s, because its white ring lingered as an empty circle on the new glass face.
- **A bug the hero exposed:** the hidden white label re-appeared as a ghost "+ Follow" over "Following". There were two causes. SVG elements have no `offsetLeft`, so the label threshold came out NaN. Also, setting the children to `visibility: visible` overrides a parent's `hidden`. The fix measures from the label span (minus icon + gap) and resets to `""` so the children inherit. This also cleared r03's check warnings (label overlap, #btnTxt contrast, #subB overflow). The only check warning left is the advisory file-length lint.

### Hero time
5.4 s. v0 shows the grey-glass Following with the teal check, the underlined handle, "Part 2 drops on my page" and the ↓ arrow under the card. v1 shows the white "OUT NOW" chip, the full sunset bar, the title at 100% and the route at 100% white mid-bob.
