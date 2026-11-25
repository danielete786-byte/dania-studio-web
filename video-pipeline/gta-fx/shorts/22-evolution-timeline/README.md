# 22 · Evolution timeline

A "GTA through the years" overlay for evolution and compilation shorts. It steps through the series one game at a time: GTA III 2001 → Vice City 2002 → San Andreas 2004 → GTA IV 2008 → GTA V 2013 → GTA VI 2026. Each entry shows its year, its name and an item counter, so the viewer always knows where the video is and how far it has to go.

Use it at the top of a "GTA evolution" compilation. Each step lands about every 0.9 s, so cut each game's clip to land on its step. It also works as a recap card before a GTA 6 reveal moment: the last step is the climax. The 13-year gap gets a duration of its own and a hard landing at about 5.6 s (rail) or 5.9 s (ticker). Cut your GTA 6 shot on that frame.

## Variants
- **0 · Year rail:** a vertical rail on the left with one hollow ring per year. Cards appear one by one as each year is reached. There are no placeholder rows over the footage. The active card is solid ink-navy with the year in the Leonida sunset gradient. When the next year arrives, that gradient wipes off to muted grey. Earlier cards are neutral smoked glass with "+N YRS" gap chips. **GTA VI payoff:** its year counts 2014 → 2026 while the rail fill travels to its node. Then it lands with everything on one frame: the row steps forward 4%, a 3-frame impact plays, the inverted "+13 YRS" chip slams in, the name rises, and a 2 px sunset hairline sweeps round the card. The 2026 numeral stays white, so the hairline is the only accent. Six entries sit in y 340–1102, so the caption band (y 1100–1400) stays clear. The header pills ("GTA EVOLUTION" and a rolling "03 / 06" counter) share the cards' edges (x 148–904).
- **1 · Year ticker:** one ink-navy card in the upper third (y 250–919). A 320 px odometer year counts up through the years between entries. Every digit rolls inside its own 300 px slot with soft-faded edges. The game name leaves before each roll and arrives as the year settles, so a name never sits beside the wrong year. Below sits a to-scale ruler from 2001 to 2026, with one tick per year and a major tick per game. Its sunset fill and marker travel in lockstep with the year, and a "+N YRS" bubble rides the marker, so the long 2013 → 2026 gap reads as distance. **Payoff:** when 2026 settles, the year punches (1.06 → 1, 3 frames) and the card shakes 6 px. The accent then moves: 2026 sweeps to the sunset gradient while the ruler fill sweeps to white. The marker pings a halo and the bubble pops.

## CONFIG (top of the script in index.html)
| Field | What it does |
|---|---|
| `label` | Header text ("GTA Evolution"); shown as wide-tracked caps. |
| `items[]` | `{ year, name, highlight? }`, in order. 2–8 entries work. The rail keeps its stack above y 1102: up to 6 entries use 112 px cards, and more entries compress the cards and their type. The ticker's ruler and odometer adapt to the min/max year. `highlight: true` gives the payoff treatment. On the rail: the year count-up from the previous entry, the 4% row step, the impact, the inverted chip and the sunset hairline. On the ticker: the punch, the shake, the halo and the bubble pop, plus the sunset sweep onto the year when the highlighted entry is the last one. |
| `gap` | Chip/bubble text: `one` for a 1-year gap, `many` with `{n}`. |
| `variants["0"/"1"]` | `style` ("rail"/"ticker"), the sample `plate`, and the ticker `top` (the y of the card, default 250). |
| `timing` | `intro`, `steps[]` (the second each entry lands; one per item, or `[]` to spread them evenly from `first` to `last`), `out` (fade start), `end`. Ticker steps roll in 0.45 s; a `highlight` step rolls in 0.9 s. On the rail, a `highlight` step's count-up lasts 0.6 s (`RC` in the script). |

## Render
```bash
# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o evolution-rail.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o evolution-ticker.webm
# with the sample footage underneath
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o evolution-ticker.mp4
```

## Swap in your own clip
It's an overlay: render with `bg: "none"` and lay it over your edit. To preview it over your own footage, put the file in `assets/`, then set the variant's `plate` in CONFIG and the matching `<video>` `src` to that path. Keep the clip 1080×1920 and 8 s or longer. Both variants leave the lower half of the frame clear, so the clip and your captions stay visible.

## Keywords
gta evolution, gta through the years, timeline, year by year, history of gta, gta 3 to gta 6, release years, odometer year, year ticker, progress rail, item counter, compilation overlay, comparison, 13 years, year count up, release gap, payoff reveal
