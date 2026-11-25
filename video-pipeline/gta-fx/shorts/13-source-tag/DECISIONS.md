# Decisions: 13 · Source tag

## v2 concept
- **The one idea: the credit arrives like a title, then docks into the corner like a broadcast bug.** On the first clip the source is announced at title scale; on the cut it collapses (FLIP flight, travel smear, RGB split, exposure flash) into a quiet corner credit that holds for the rest of the clip and re-credits on every later cut. This gives the frame a real v2 hero moment and keeps the job: a small, safe-corner credit for each clip.
- **Shots and cuts.**
  - v0 Footage chip, night → day → sky → place, with real sources: `s055` night truck (Trailer 2, in 0.47, 0–1.6) · cut 1.6 `s011` Vice City highway (Trailer 2, 1.6–3.3) · cut 3.3 `s135` skydive (PlayStation Features Trailer, 3.3–4.9) · cut 4.9 `s074` The Keys sign (Launch Trailer, 4.9–7.0).
  - v1 Handle tag, one creator's golden-hour clip: `s027` sunset dock (0–1.85) · `s084` swamp (1.85–3.25) · `s108` balcony (3.25–4.55) · `s026` pier (4.55–6.1) · `s036` beach bar (6.1–7.0).
- **Where the type sits and why.**
  - v0 announce is centred in the upper third (y 392–640) over `s055`'s dark, foggy tree line, above the street lamp and the truck. It docks top-left (x 72, y 252), clear of the hook band and the right-hand button column, over sky in every later shot.
  - v1 announce is left-aligned across the lower third (y 1112–1275) over `s027`'s water, above the people on the dock. It docks bottom-left (bottom edge y 1460) over dark water, shirts and the bar counter.
- **Hero size and face.**
  - v0: "TRAILER 2" in Archivo wide 700 caps, fitted to 820 px (about 117 px, about 93% of the safe width), white with Rockstar's own `#EE08F2` offset and a warm bloom. Over it, an outlined FOOTAGE chip and "ROCKSTAR GAMES" in tracked wide caps at 26 px; under it, a running source timecode in JetBrains Mono at 30 px.
  - v1: "@everestchris6" in Inter 800 display, tight (−0.045em), about 800 px wide, with the "@" as the one sunset accent. "CLIP VIA" sits above it in tracked Inter caps at 26 px.
  - Docked: v0 is 22 / 44 / 22 px (chip row, detail, TC). v1 is a 100 px monogram avatar with a drawn ring, "CLIP VIA" at 22 px and the handle at 48 px.
- **Payoff hit: the dock, on the cut.**
  - v0 at 1.6 s: the lockup collapses into the corner as the picture cuts from night to day. Exposure flash 0.38, shake, a 1.035 punch-zoom, and a 12 px RGB split on the flying type.
  - v1 at 1.85 s: same flight, with a sunset light leak (the one light moment), a 0.26 flash and RGB split; the avatar pops and its ring draws as the handle lands.

## v2 round 5 (rebuild from scratch; v1 rejected by the owner as "basic")
- **What was thrown away:** the navy slab, the paper drawer, the radius 20/12 card system, the sunset bar, `assets/plates/` footage and the small-card-on-soft-footage look. Nothing in v2 is a box except the outlined FOOTAGE chip, which is a credit object, not a container.
- **What was kept from v1:**
  - The job and the grammar: "FOOTAGE · source · detail" and "CLIP · @handle".
  - Per-clip credits that change on the cut (`clips`). They are now honest to the frame: each sample shot really comes from the credited video. I traced every shot to its source in `gta6/_shared/shots/shots.json`: VQRLujxTm3c = Rockstar "Trailer 2", rz1B4B2yBZY = Rockstar "Launch Trailer", 8L0CzL2V72c = PlayStation "Features Trailer | PS5 Games".
  - Safe-corner docking with tl/tr/bl/br support, @everestchris6, no logos.
  - The seek-safety lessons: never show stale text beside a moving edge, never show an empty container, change on the picture cut.
- **Real source timecode.** The TC row shows `srcIn + data-media-start + (t − clip start)` as MM:SS:FF, so it reads the true position in the source trailer and runs with the footage. It jumps on each cut, like a burn-in.
- **Dock mechanics (seek-safe).**
  - Each announce row is a FLIP wrapper. Its docked twin is measured before any transform is applied. The row flies to its twin's rect with transform-origin on the docked edge, `expo.inOut` over 0.5 s, centred just after the cut. A drive-based blur peaks mid-flight.
  - On arrival the twins take over with a `visibility` snap. The hero is split into chars in both copies, so the twins match glyph for glyph and the hand-off is invisible.
  - The reveal masks are unmasked after the rise (`overflow: visible`), so the magenta offset and bloom are never clipped.
- **Swaps on the cut.** A first build rolled values through masks (old up, new in). The frame pulls showed the old credit on the new shot for 2 to 3 frames, and both values clipped mid-roll on top of each other. I replaced it with a hard swap on the cut frame, like the picture. The new value settles 8 px up out of a 3 px blur over 0.3 s, and a 10 px RGB split decays across the tag.
  - In the r05 frames: frame 98 shows the crisp old credit on the old shot; frame 99 (the cut) shows the new credit, slightly soft; frame 100 shows the RGB split; it is settled by about frame 106.
  - Inactive stack values are `autoAlpha: 0`. Off-mask text had tripped `hyperframes check` as "text under an opaque element".
- **Casting changes during the round.**
  - v1 first used `s014` (drive-by) for the announce. The frame was half black (car roof wedge plus dashboard plus scrim), the same murk a critic flagged in #04. I recast to golden hour, which matches the sunset "@" and the leak.
  - The last v1 shot changed from `s047` to `s036` (beach bar), because the docked tag sat on the woman's chest in `s047`; in `s036` it sits on the dark bar counter.
  - `s055` has an internal cut at 2.1 s, so it is used only from media 0.47 to 2.07.
- **Sizes after review.** The docked v0 detail went from 37 to 44 px, because the chip row out-weighed it. The v1 dock went to a 48 px handle and a 100 px avatar (about 500 px, 58% of the safe width). The exit moved to 6.35 s, so both tags are fully gone by about 6.85 s.
- **Scrims, not boxes.**
  - v0: a soft radial spot behind the announce, then a top-left radial on the dock.
  - v1: a soft bottom gradient for the announce, then a bottom-left radial.
  - They stay in `bg:none` as part of the graphic (legibility on unknown footage). Grain, vignette, flashes, leaks and pushes are plate-only.
- **Checks:** `hyperframes check` passes. The remaining warnings are file length, nested `#ov`, and a 4.8 px `.src` trailing-tracking overflow. `freezedetect` on both MP4s finds no frozen frames. The renderer warns about sparse keyframes in the shared `s011`/`s074` files; no freeze is visible.
- **Unresolved / for the critic:** the hero time (1.2 s) shows the announce, not the docked state, because the announce is the designed still. The dock and the swaps are in the strips. The docked tags are deliberately credit-sized (v0 about 545 px wide, v1 about 500 px), in a corner, with no card, not a widget mid-frame.

---

## v1 history (rejected look; kept for its lessons)

### Round 1
- Format proven by the references: `source-credit-tag/d1klOApHA_g-128` (FOX 13 flat white box, black caps "ROCKSTAR GAMES", top-left), `creator-tag-corner/hycyrW-m2ic-60` (solid black tag, heavy white text, corner) and `disclaimer-caption/*` (one-line caption).
- V0 was a smoked-glass chip with a sunset play tile, top-left. V1 was a two-tone ink/paper credit bug, bottom-left (bottom edge y 1460, because bottom-right is under platform UI on 9:16). Both were about 57–63% of the width.
- Fixes: "·" contrast raised; unused variant hidden explicitly.

### Round 2 (critic r01: v0 6, v1 7)
- Defect: the entrance wipe cut or crowded text. Words now wait until the panel edge has cleared them, solved from the `expo.out` curve.
- v0 was rebuilt as a flat ink credit slab with one sunset bar; v1 became one navy rim with an inset paper panel.

### Round 3 (critic r02: v0 7, v1 6)
- Defect: v1 showed an empty white pill. The paper became a drawer carrying its handle, never blank.
- v0 gained the "FOOTAGE" label and per-clip swaps at real cuts (p05 Trailer 2 → p01 Launch Trailer).
- One shared navy material.

### Polish round 4 (critic r03: v0 6, v1 7)
- v0 slab shrank to 56 px tall, with one 24 px size for all words and a `maxWidth` clamp. Swap: the old detail clears first, then the slab re-fits, then the new detail rolls in.
- v0 exit became one-object fade. v1 rim became a drawer too (no empty box); paper fades became snaps.
- v1 kept bottom 1460 (deliberate: out of the caption band).
- Owner verdict after r04: "basic, not professional or clean-looking". Replaced by the v2 rebuild above.
