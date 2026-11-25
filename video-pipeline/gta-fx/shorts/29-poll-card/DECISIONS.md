# Decisions: 29 This or that (poll)

## v2 concept
- **The one idea:** the result is drawn on the image itself, with no card. **Bars:** each answer's bar is a light beam that runs in from the left frame edge to its share of the frame width. The winner's beam is a sunset beam, and the ink passes through its name: the name turns plum exactly where the beam is. **Split tap:** the frame is split into two live shots, and the seam between them is the chart. It slides from the middle of the safe zone to the vote share (58/42), and the winning pane grows.
- **Shots and cut points:**
  - **Bars:** four cuts, each on a beat.
    - 0–1.05: s078 Jason on the phone (row A lands).
    - 1.05–1.95: s083 the duo in the convertible, blink-free 0.43–1.33 (row B lands, tap at 1.6).
    - 1.95–4.15: s018 golden Lucia at the gate (the payoff cut, then the hold).
    - 4.15–5.0: s092 the duo in the car (the exit).
  - **Split tap:** top pane s012 muscle beach, then s135 skydive over the city (1.7, the payoff cut), then s011 Vice highway towers (3.33). Bottom pane s074 "The Keys" sign, then s026 sunset pier (2.23), then s064 jetski (3.33). Both panes cut together at 3.33.
  - Every shot plays at 1.0×, inside its length, under a slow `Look.push`.
- **Type:**
  - **Bars:** the type sits in the lower third (y 990–1440), under the faces. Each shot is framed so the subject's head is in the upper half and the lower third is shirt, car body or road.
  - **Split tap:** the type rides the seam, because that is where the eye goes. A's numeral and name sit above the seam, and B's name and numeral below it. The question and the ask share one slot at the top over the sky (y 254). Faces are kept clear: the skydiver's head, the jetski riders (reframed this round) and the pier couple.
- **Hero sizes and faces:**
  - Option names: Archivo wide 800 caps at 104 px (Bars) / 96 px (Split tap).
  - Numerals: Inter 800 tabular at 112 px (Bars) / 214 px with `Look.fill` sunset and sheen (Split tap winner); the loser's numeral is 96 px at 86% white.
  - Labels: Archivo wide 600 at 24 px. The ask: Inter 700 at 52 px with white A/B keys.
  - Two families and three working sizes per frame.
- **Payoff hit:**
  - **Bars, at 1.95:** on the cut to Lucia. `Look.expose` on the footage (peak 1.72) + `Look.impact` (flash 0, zoom 1.035) + a 4 px chroma split. The beam's tip flares, and the winner's numeral settles from a scale punch.
  - **Split tap, at 1.7:** on the skydive cut. `Look.expose` on the top pane only (peak 1.5), impact (zoom 1.03), chroma on the 214 px numeral and a seam flare.
  - The light comes from the exposure pulse, never a white flash layer.

## Key decisions
- **Kept from v1:**
  - The job: a comment engine that ends on "Comment [A] or [B]".
  - The content: Jason vs Lucia (Bars) and "Where do you go first?" Vice City vs The Keys (Split tap). These are real names and places from FACTS.md.
  - The fan-poll voice: the percentages are the creator's own placeholders, with no invented vote counts.
  - Plum ink (#160123) on the sunset gradient for contrast.
  - A and B stay readable through the ask.
- **Dropped from v1:** the smoked cards, glass tiles, rolling-digit odometer, touch dot and check badge.
  - The tap is now the key itself: it presses (0.965 scale), fills white with an ink letter, and throws one ring.
  - The numbers count with `Look.count` (0.3 s expo.out), with no digit-roll smear.
- **One accent per frame:** the sunset gradient goes only on the winner. That is the beam in Bars and the numeral in Split tap. Everything else is white, frosted white or plum.
- **Bars are rows, not decoration.** The beams are 128 px tall, the same height as the rows. The frame edge is the 0% line, so the beam length *is* the number (round(1080 × pct)). The loser's beam is frosted white (rgba .30 → .19 with an 18 px backdrop blur), so it reads as the same kind of object, just not lit.
- **Seam math (Split tap):** seam y = 230 + 1250 × share of A (the safe zone), so the chart stays inside the safe zone for any result. The seam breaks around the OR label at the left. The bottom pane is a clip-path inset that follows the seam, and the seam is driven by one proxy, so every frame is seek-safe.
- **Ask placement:** in Bars, the ask sits under the rows (y 1366). In Split tap, the question exits upward and the ask takes the same top slot, so the bottom pane stays image.
- **Hold life:** a sheen across the winner (2.55 / 2.45), each key presses once after the ask (+0.85 s, +1.1 s), the footage keeps cutting and pushing, and the exit at 4.58 blurs the type out and retracts the beams or seam.
- **Determinism:** one paused timeline, `Look.install` last, `tl.seek(0)`. Fonts load with `document.fonts.load` before layout. The names are `visibility: hidden` until their reveal starts, so check never measures hidden text.

## v2 round 3
- First v2 build: a full rebuild from scratch of the visuals; v1 rounds 1–2 were judged 7/7 as "small dark UI cards".
- In-round fixes, from my own frame checks:
  - **Bars:**
    - The bottom scrim was too heavy and turned the lower half to mud; it now peaks at .62.
    - The 18 px bars gave a flat hierarchy; they are now 128 px beams with the ink split.
    - Re-cut: s078 starts at media 0.6, past the empty marina. s083 is cut to 0.43–1.33 to skip both blinks.
    - Row B lands at 1.07, after the convertible cut.
  - **Split tap:**
    - s096 (dark start, blurry walker) was replaced with s012 as the opener.
    - s075 (murky) was replaced with s026 + s064.
    - The ask moved out of the bottom pane into the question's slot.
    - The first exposure peak (1.72) was milky on the sky, so it is now 1.5 and on pane A only. The loser-pane dim was removed (it read as a grey veil).
    - Reframes:
      - s074, so the sign isn't under the type.
      - s011, so the green signs don't collide with the numeral.
      - s135 (x −150), so the skydiver clears the numeral.
      - s064 (y 550 → 850), so the jetski riders' faces stay below "THE KEYS / 42%" as they pass the camera.
  - **Check:** the names were flagged as occluded before their reveal. They are now hidden until revealed, with the layout allow-attributes added on the ink layers.
- **Frames inspected:** both hero PNGs, both strips, the entrance sheet, and ffmpeg pulls from each variant at the entrance, the payoff, the hold and the exit (listed in the summary of this round).
- **Hero time 3.9 s:**
  - Bars: golden Lucia, the full result and the ask.
  - Split tap: the towers and the jetski, the 58/42 seam and the ask in the top slot.
