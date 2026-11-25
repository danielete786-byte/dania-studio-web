# 46 Cash payout: decisions

## Round 1

### Shared
- **Real rolling digits, not text swaps.** Each digit is a 0–9 column in a fixed-width (tabular) cell. The value is a pure function of timeline time, so it is seek-safe (driven through `KitMotion.drive`, never `onUpdate`). A digit that changes faster than ~4 times a second snaps (the GTA-style flicker of the low digits). A slower digit rolls up over 0.16 s, so the top digits visibly tick into place as the count settles. Ease: the kit's house `kit-out` (easeOutQuint): a rush, then a readable settle.
- **The landing gets one hit.** At the land, a short scale punch eases back to rest (1.06 for the HUD, 1.045 for the card). It is computed in a drive function, so seeking backwards never leaves it stuck in the punched state.
- **Fonts are loaded explicitly before measuring.** `document.fonts.ready` alone measured the fallback face and made the digit cells about 20% too wide. The build now calls `document.fonts.load` for the exact faces first.
- **Loop.** Everything clears by 6.1 s, leaving a 0.4 s empty tail in a 6.5 s composition.

### V0 HUD corner (refs: `hud-mission-objective-money-minimap/VrX0-5DdK-s-1`, which has a right-aligned white condensed "$12,500"; `hud-official-gta6-wanted-minimap/uphThaa97ig-12`, Rockstar's real HUD: tiny, solid white, sparse, right column)
- The balance is Barlow Condensed 700 at 120 px and right-aligned to the safe edge (x 936, top y 252). It is scaled up from the game HUD so it reads at phone size. The 08-wanted-level critiques flagged that a game-sized HUD is too small for vertical.
- The `+$` delta sits under the balance, as GTA shows money gains. It is in Vice teal, the system's success/credited colour and the GTA "money in" green analogue. A small Inter 600 caps label ("HEIST PAYOUT") gives the short its context. Sizes: 120 / 80 / 28.
- Motion: the HUD slides in, then the delta slides in, then the balance rolls 12,500 → 1,262,500 and flashes teal → white on landing. The delta fades at 4.9 s like the in-game HUD, and the balance holds until the exit.
- Legibility on the busy sequins plate: a layered drop-shadow on the whole stack, plus a very soft radial dark halo. No visible box, so it still reads as HUD, not a card.

### V1 Centre card (refs: the official sunset language in `official-type/`; DESIGN.md smoked glass)
- Smoked-glass card with a 1 px inner highlight, radius 36, spanning the full safe width (x 72–936) with its top at y 500, so the hero numeral sits in the upper half, away from the gameplay crosshair at centre.
- The numeral is Barlow Condensed 800 and auto-fits the card (about 180 px). It starts as a ghosted `$0,000,000`, so the card reads as a counter in the first frame, and each digit lights up as it becomes significant.
- The one accent is the Leonida sunset (pink → amber) on the progress rule, which fills in sync with the value and gets a white sheen on landing. The numeral stays white, because a gradient numeral reads as a CapCut preset.
- The card stays compact while counting (no empty band), then expands on landing to reveal the crew split, Jason / Lucia $625,000 each (real protagonist names; fan-made example numbers the creator edits).

### Plates
- V0 uses **p07-convertible** (suggested).
- V1 uses **p04-driveby-mural** instead of the suggested p02-blue-club, because p02 shows the official GTA VI logo lockup from about 2 to 6 s, which breaks the no-trademarks rule behind a payout card. p04 (a drive past the mural with police) also reads as a getaway.

### Hero time
- r01: 4.3 s.

## Round 2 (critique: 7 / 7, "the payoff doesn't land": hit before the value, torn final carry, slow crawl)

### Defects fixed
- **The hit lands on the money frame.** `land` is now exactly `count + countDur` (V0, 2.0 s) and `cardCount + cardCountDur` (V1, 2.1 s), not `countDur * 0.94`. Both are on the 1/30 s frame grid. The hit drives start half a frame early (`PRE = 1/60`), so the landing frame itself carries the peak: full teal flash plus the 6% punch in V0, and the 4.5% punch plus the start of the sheen in V1. The frame before still shows a moving number at rest scale. I verified this frame by frame with `hyperframes snapshot` and in the rendered mp4s: V0 goes 1,262,136 to **$1,262,500 teal and punched** at 2.0 s, and V1 goes 1,249,660 to **$1,250,000 punched** at 2.1 s.
- **No torn carry, ever.** The counter's landing state (`tLocal >= dur`) is the exact total with every digit at rest and no tick in flight. A first fix still ticked on the landing frame, because a zero rate read as an infinite interval, so the tick is now gated on `!landed`. The final carry (V1 `49,660 → 50,000`, V0 `136 → 500`) is a clean swap on the hit frame.
- **One glyph per cell.** A digit that changes slowly enough to see no longer rolls a two-glyph column through the mask, which is what showed stacked half-glyphs in still frames. It now *ticks*: only the new glyph is visible, and it rises 0.24 of the cell height into place over 0.08 s (about 2 frames) while fading from .55 to 1. "Counters roll" (DESIGN.md) still reads in motion, and no frame shows two digits in one cell. Fast digits still snap (the GTA flicker).

### Biggest gap: crisp timing
- **No crawl.** The roll ease is now a normalised exponential ease-out (`rush: 9`). Unlike easeOutQuint, or GSAP's expo.out with its limit jump, it is still moving a few hundred dollars per frame on its last frame and reaches the exact total at x = 1. So the low digits spin and then stop dead on the hit, instead of decaying through a one-second crawl. The ease has an exact inverse, so each digit's tick time is still known analytically (seek-safe). Durations follow the critique: 1.5 s (V0) and 1.6 s (V1). The 10,000s digit settles about 0.17 s before the land, so the big number reads before the stop.
- **No wind-up.** V0 shows its HUD at 0.2 s, the `+$` line at 0.3 s, and the roll starts at 0.5 s (was 1.05 s, a static 0.85 s hold). V1 starts at 0.5 s as the card settles.
- **Shorter loop.** The comp is now 5.5 s (was 6.5 s) because the payoff comes 1.4 s earlier. V0: the `+$` line fades at 3.9 s, everything clears 4.75–5.1 s, and there is a 0.4 s empty tail. V1: the split is revealed by about 2.7 s and holds to 4.75 s. The plates' `data-duration` changed to match.

### Smaller fixes
- **V1 ghost removed.** The card opens on a centred, readable `$0` that grows. Insignificant digits and commas take zero width, and a comma now follows the appear state of the digit to its left, so `$1,` widens in on a tick at about 0.4 s. `.ghost` and the ghost code path are gone.
- **V0 label** is Inter 700 30px, .24em tracking, solid white. The halo core went from .42 to .5 (`rgba(6,6,10,.5)`) so the label holds on the sequin plate.
- **V1 type:** the "VICE CITY" opacity went from .46 to .64, and the split names went from 26px to 28px to match `.lbl`, so the card has one label size.

### Kept (deliberate, no defect named)
- The Barlow numerals, the right-column HUD at 120 / 80 / 30, the teal credited flash, the smoked-glass card, the sunset rule as the only accent, the split reveal on landing and both plates.

### Hero time
- **2.8 s:** both totals have landed and rest after the hit, the V0 `+$` line is still up, and the V1 crew split is fully revealed.
