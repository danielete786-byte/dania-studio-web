# 20 · Spec card (Comparisons)

A spec block for one item in a GTA 6 evolution or detail compilation: a name plus 3 stats with animated bars. Use it once per item, for example "every police car in GTA history", "GTA eras ranked" or "GTA 6 vehicles we've seen".

Drop it on the clip where that item is on screen, and cut it with that clip. A vehicle card should only ever sit over the vehicle it names.

1080×1920, 30 fps, 5 s. Everything sits inside the 9:16 safe zone (x 72–936, y 230–1480).

What it does over its 5 s:
- **Vehicle:** the card fades in over 0.10 s and lands at the height of its name block. It opens to full height as its three stat rows arrive. Each row (label, value and bar) arrives as one unit, then the bar fills and the number counts. It is done by about 0.86 s.
- **Era:** from 0.18 s the full card fades in over 0.10 s on the previous era: "2013 / GTA V", "Era 07 / 08 · Los Santos" and that year's numbers. It holds for 0.45 s. Then the year, the game name, the meta row, the numbers and the bars all roll together to "2026 / GTA 6", "Era 08 / 08 · Leonida · Vice City", 13 / 24 / 29. It is readable by about 0.83 s.
- **Hold:** one beat at 3.0 s. A soft sheen crosses the bars, and on the era card the year swells 1 → 1.04 → 1.
- **Exit:** a 0.36 s fade from 4.58 s, so the next item can cut in cleanly.

## Variants
| `variant` | Name | Look | Placement | Demo content |
|---|---|---|---|---|
| `0` | Vehicle | Smoked-glass HUD card (dense .80 smoke, 32 px blur), a Barlow Condensed name, and continuous 12 px sunset bars filled exactly to value/max. Each score carries its scale ("8.6/10") | top (y 262–~828); it clears most of a letterboxed 16:9 clip and the car below stays visible | Police Cruiser, Vice City Police Dept. (the livery seen in the official trailers), with the creator's own scores out of 10, labelled "Our rating" |
| `1` | Era | Compact paper card (about 545 px tall): a 196 px sunset-gradient year and a 112 px game name on the same baseline. The year, the name and the meta row roll over from the previous era ("20" stays, "13"→"26", "GTA V"→"GTA 6", "Era 07"→"08", "Los Santos"→"Leonida · Vice City"), with bold ink values and 10 px ink gauges. The numbers and bars count in step with the year, so the card is never self-contradictory | bottom (y ~905–1450) | GTA 6 · 2026 · Leonida · Vice City, era 08 of 08, with a series timeline: 13 yrs since GTA V, 24 yrs since GTA Vice City, 29 yrs since the first GTA |

`bg`: `"plate"` shows sample footage underneath. `"none"` renders a clean transparent overlay; the glass card then gets a slightly denser smoke fill so it still reads without the backdrop blur.

**Sample footage.** The Vehicle variant uses `assets/clips/vcpd-cruiser-v.mp4`, a 5 s cut made only from the two official-trailer shots of the Vice City police cruiser, so the cruiser is on screen for the whole card:
- 0–1.93 s: the drift, at half speed, with every frame a real frame held twice;
- 1.93–5 s: the drive-by past the parked cruiser with its lights on, in real time, reframed to follow it.

`assets/clips/make-vcpd-cruiser.sh` rebuilds it from `research/gta6/plates/`. The Era variant uses the shared `p07-convertible` plate; any GTA 6 footage suits an era card.

## Running the Era card down a whole compilation
The era stats are ones every entry has, so the same card works for eras 01–08. Keep `max: 29` (the 1997–2026 span) on every card so the bars compare across the video. All years are from `research/gta6/FACTS.md`.

| Era | Game | `nameFrom` → `name` | `yearFrom` → `year` | Since the last game (`from` → value) | Since the first GTA (`from` → value) |
|---|---|---|---|---|---|
| 01 | GTA | — → GTA | 1997 → 1997 (no roll) | — | 0 |
| 02 | GTA 2 | GTA → GTA 2 | 1997 → 1999 | 0 → 2 (GTA) | 0 → 2 |
| 03 | GTA III | GTA 2 → GTA III | 1999 → 2001 | 0 → 2 (GTA 2) | 2 → 4 |
| 04 | Vice City | GTA III → Vice City | 2001 → 2002 | 0 → 1 (GTA III) | 4 → 5 |
| 05 | San Andreas | Vice City → San Andreas | 2002 → 2004 | 0 → 2 (Vice City) | 5 → 7 |
| 06 | GTA IV | San Andreas → GTA IV | 2004 → 2008 | 0 → 4 (San Andreas) | 7 → 11 |
| 07 | GTA V | GTA IV → GTA V | 2008 → 2013 | 0 → 5 (GTA IV) | 11 → 16 |
| 08 | GTA 6 | GTA V → GTA 6 | 2013 → 2026 | 0 → 13 (GTA V) | 16 → 29 |

The middle row, "since the last time in this city", applies where the city returns: GTA IV is 7 yrs after GTA III (Liberty City, `from` 3), and GTA 6 is 24 yrs after GTA Vice City (`from` 11). For an era without a return, swap that row for any stat you can source, or your own score (with `from: 0`).

Rule for `from` on a "years since" stat: value − (year − yearFrom), never below 0.

For the meta row, set `metaFrom` to the previous era's count (for example `"Era 07 / 08"`) and `metaRightFrom` to its setting. FACTS.md gives Liberty City (GTA III, GTA IV), Los Santos and Blaine County (GTA V) and Leonida and Vice City (GTA 6).

## CONFIG fields (top of the `<script>` in `index.html`)
Per variant (`CONFIG.variants["0"]` / `["1"]`):
- `style`: `"vehicle"` (glass HUD card) or `"era"` (paper card with year).
- `place`: `"top"` or `"bottom"`.
- `plate`: the sample clip path shown when `bg` is `"plate"`. It must match the `src` of one of the `<video>` elements.
- `meta` / `metaRight`: the small, wide-tracked caps line at the top of the card, for example `"GTA 6 · 2026"` and `"Our rating"`, or `"Era 08 / 08"` and `"Leonida · Vice City"`. If the two are too long together, the row shrinks to fit, down to 24 px.
- `metaFrom` / `metaRightFrom` (era only): the previous era's meta row, for example `"Era 07 / 08"` and `"Los Santos"`. It is on the card from the start and rolls to `meta` / `metaRight` with the year. In lines of the same length, only the characters that differ roll. Leave both out, and the meta row instead fades in once the roll has landed.
- `name`: the item name. Long names shrink to fit automatically.
- `sub` (vehicle only): the second line under the name.
- `yearFrom`, `year` (era only): the digits that differ roll from `yearFrom` to `year`, while shared digits stay still. Only those two years are ever readable. Set `yearFrom` to `null` (or to `year`) for no roll.
- `nameFrom` (era only): the previous era's game, shown beside `yearFrom` and rolled to `name` together with the year, for example `"GTA V"`.
- `max`: the value that fills a bar completely. Use 10 for ratings and 29 for the series timeline.
- `decimals`, `suffix`: number format, for example `1` and `""` gives `8.6`, and `0` and `" yrs"` gives `13 YRS`. Values are set in caps.
- `unit` (vehicle): a small scale after each number, at the label size and 50% white, for example `"/10"` gives "8.6/10". Use `""` for none.
- `segments` (vehicle): `0` draws one continuous bar filled exactly to value/max (the default). `10` brings back HUD blocks, where the boundary block fills partially.
- `sheen`: `"all"` (the hold-beat sheen crosses every bar) or `"lead"` (only the highest).
- `pulse` (era): how far the year swells on the hold beat (`1.04`); remove it for none.
- `stats` (**creator fill**): exactly three `{ label, value, from }` rows. On the era card, `from` is the number shown while `yearFrom` is up (see the rule above). The vehicle card ignores `from` and counts from 0.
- `timing` (optional, per variant): overrides `CONFIG.timing` for that variant only. The era card uses `{ cardIn: 0.18 }`, so the full card is up by about 0.27 s.

`CONFIG.timing` (all in seconds):
- `cardIn`, `cardFade`: when the card appears, and its opacity ramp (0.10, power1.out);
- `textIn`: the vehicle type's delay after the card (0 means with it);
- `barsAt`, `barDur`, `barStagger` (vehicle: 0.24, 0.50 and 0.06): when the rows arrive and how long the bars take to fill;
- `growDur` (vehicle): how long the card takes to open from its name block to full height (0.4). It starts at `barsAt − 0.06`;
- `yearRollAt` (after `cardIn`) and `yearDur` (era): how long the previous era holds (0.45), and how long the year, name, meta row, numbers and bars take to roll (0.45, expo.out);
- `beats`, `beatDur`: start times and length of the hold accent (`[3.0]`, 0.5); use `[]` for none;
- `out`, `outDur`: exit start and length (4.58, 0.36);
- `end`: composition end (5.0).

## Render
```bash
# transparent overlay for CapCut / Premiere (WebM with alpha)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o spec-vehicle.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o spec-era.webm

# with footage underneath
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o spec-vehicle.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o spec-era.mp4
```

## Use your own clip
Either:
- render with `bg: "none"` and put the WebM on top of your clip in your editor, starting where the item appears and ending at that clip's cut; or
- put your clip in `assets/`, then point `CONFIG.variants["0"].plate` and the `src` of the matching `<video>` at it. Keep `object-fit: cover`.

For a longer card, change `data-duration` on the root, on the `<video>` and on `#ov`, plus `CONFIG.timing.out` and `end`. Only do that if your clip keeps the item on screen for the whole card.

## Honesty notes
- The vehicle scores are opinions, so the card says "Our rating" and each score shows its "/10" scale. Replace them with your own scores, or with in-game stats once you have them (set `unit` and `max` to match).
- The era timeline numbers are year differences from the release years in `research/gta6/FACTS.md`. If you add a stat from elsewhere, name its source or date in the stat label or in `metaRight`.
- Bars are drawn exactly to value/max, so items with close scores look as close as they are across a compilation.
- The sample cruiser clip uses official trailer footage only; part of it is slowed, never retouched. Swap in your own clip for publishing.
- No GTA VI logo, Rockstar logo or Pricedown font. "GTA 6" is set in our own type.

## Keywords
spec card, stat bars, vehicle stats, car stats, police car, police cruiser, Vice City police, top speed, acceleration, braking, era card, year card, odometer year, rolling year, evolution, GTA evolution, series timeline, years since GTA V, comparison, rating card, HUD stats, continuous bars, exact bars, score out of 10, rolling meta, sheen, GTA 6, Vice City, Leonida
