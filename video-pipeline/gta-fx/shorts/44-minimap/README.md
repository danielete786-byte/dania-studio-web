# #44 Minimap route (GTA HUD kit)

A rounded, translucent minimap with abstract roads. A GPS route in the Leonida sunset gradient draws from the player arrow to a destination blip. It is 1080×1920, 30 fps and 7 s, and works as a transparent overlay.

## When to use it in a GTA 6 short
- **"Where is it?" moments.** Use it when the voiceover names a place: "this mission starts in Vice City", "the Keys are right here".
- **Make live action read as GTA.** A blue minimap in the corner (v0) is one of the two HUD pieces, with the wanted stars, that make any clip look like gameplay at a glance.
- **Arrival beats.** Both variants arrive: v0 at 4.6 s and v1 at 5.2 s. On the contact frame the arrow docks into the blip (slides under it in 0.25 s), the blip pops, one ring fires and a white highlight sweeps the finished route. In v0, ARRIVED slides up in Vice teal. In v1, a teal ARRIVED pill pops in beside the title. Cut to the destination shot right after it.
- **Road-trip and travel beats.** Use the GPS card (v1) as a title card before a driving clip, or to set up the next location in a compilation.

## Variants
| `variant` | Name | What it is |
|---|---|---|
| `0` | Corner minimap | The in-game look: a flat translucent blue map (94% opacity) bottom-left in the safe zone. The zone name and remaining distance sit in white in an 80 px header inside the top of the panel; the map's strokes fade out under it. An N disc sits on the bottom edge. The map has three faint major roads, a faint street grid and three block districts, all clipped to the land. A solid deep-blue bay with a 2 px shoreline has a marina cove, two filled keys and a headland. The panel rises and fades in from 0 s. The blip pops, then the route draws from the player arrow to it. The map pans under the fixed arrow as it drives, leaving the trip behind it as a trail, and the distance counts down. When the arrow's nose touches the blip, the map stops and the arrow docks into the blip, sliding under it. On the same frame the blip pops, one ring fires, a white highlight sweeps the finished route and ARRIVED slides up in 44 px Vice teal. The map then eases so the trip sits with the blip at x 560. |
| `1` | GPS card | A smoked-glass card with a label, destination title, dark coastline map and three trip stats aligned left / centre / right. The map has a Grassrivers marsh texture, a Vice City grid, an expressway that stops at the coast, and a chain of four irregular keys plus a destination key along the highway's arc (filled, one tone darker than the mainland, no outline). The route draws from Vice City across the keys and a highlight sweeps it. The arrow then drives the whole route, leaving a muted trail, while DISTANCE and ETA count to 0 in step with it. On contact the arrow docks into the blip, sliding under it. On the same frame the blip pops, one ring fires, a white highlight sweeps the finished route and a solid teal ARRIVED pill with a drawn check pops in beside the title. DISTANCE / ETA then step back to 62%. ARRIVE keeps its time. The card holds, then fades. |

## CONFIG fields (top of the `<script>` in `index.html`)
- **`variants["0"]`**
  - `plate`: the sample footage path.
  - `area`: the zone name, top-left inside the panel.
  - `distance`, `unit`: the remaining distance at the start. It counts down as the arrow drives, rounded up, and never reads 0.0 before ARRIVED.
  - `arrived`: the word shown on arrival.
  - `timing`:
    - `in`: entrance start (y +24 → 0, scale .96 → 1, 0.32 s expo.out, with opacity on power2.out);
    - `blip`;
    - `drawStart`, `drawEnd`: the route draws from the arrow to the blip;
    - `driveStart`, `ramp`: the drive starts and its speed ramps up over `ramp` seconds, then holds constant into contact;
    - `arrive`: the moment of contact, which also fires the dock, the blip pop, the ring, the sweep and the ARRIVED slide;
    - `dock`: how long the arrow takes to slide into the blip (power3.out);
    - `burstDur`, `burstScale`: the arrival ring's length and how far it grows (1 → 2.4 by default);
    - `doneSweep`: how long the white highlight takes to run along the finished route;
    - `settle`: `[start, end]` of the ease that frames the finished trip after arrival;
    - `settleX`: where the blip ends up across the 820 px panel (560 by default);
    - `pulses[]`, `out`, `outDur`.
- **`variants["1"]`**
  - `plate`, `label`, `destination`: the plate path, top label and destination title.
  - `arrived`: the text of the teal pill that pops in beside the title on arrival. `""` hides it. Keep the title short enough to leave room for the pill: "Leonida Keys" plus the pill fills the row.
  - `tag`: an optional chip at the top right, hidden by default (`""`). Set it to `"Route set"` to show it with a 1 px Vice-teal ring.
  - `mapLabels`: `[text, x, y, anchor]` on the 784×500 map. Streets are cut out behind each label automatically.
  - `stats[]`: one entry per column, aligned left / centre / right.
    - `{label, value, decimals, unit, live}` shows its full value from the entrance. With `live: true` it counts down to 0 in step with the arrow, rounded up so it only reads 0 on contact, then steps back to 62% after arrival.
    - `{label, text, unit}` is static and doesn't change on arrival (for example ARRIVE 6:42 PM).
  - **The default trip numbers (24.6 MI / 19 MIN / 6:42 PM) are an example.** Replace them with your own trip before posting.
  - `timing`:
    - `in`: entrance start (y +24 → 0, scale .96 → 1, 0.32 s expo.out, with opacity on power2.out);
    - `blip`, `drawStart`, `drawEnd`, `sweepStart`, `sweepDur` (the pre-drive sweep);
    - `travelStart` to `arrive`: the arrow drives the whole route, with its speed ramping up over `ramp` seconds and then holding constant; `arrive` is the contact;
    - `dock`, `burstDur`, `burstScale`, `doneSweep`: as in v0 (the dock, the ring and the arrival sweep);
    - `push` `[start, end, scale]`;
    - `pulses[]`, `out`, `outDur`.
- **`colors.route`**: the route gradient stops (Leonida sunset core by default).
- **`colors.blip`**: the destination blip fill.
- **`colors.arrived`**: Vice teal, used only for the arrival state. The CSS uses `--teal`.
- **`end`**: the composition length in seconds.

The map geometry lives in `buildCorner()` and `buildCard()`.
- **v0:** the shore control points `SH`, the bay keys (`sliver(...)`), the three `district(...)` block grids, the minor-street fabrics, the three `MAJOR` roads and route `RD`. The water fill is drawn in `#mmWorld`, every stroke in `#mmLines` (clipped to land and faded under the header by `#mmHeadFade`), and the route, arrow and blip in `#mmTop`. All three share one pan transform.
- **v1:** the `COAST` points, `BARRIER` sliver, the city outline, the wetland `WET` shape and marsh pattern, keys path `K`, the island list `[start, end, thickness, side, offset, skew, phase]` and route `RD`. Roads go in the groups clipped to `#gcLand`, so they stop at the coast.

The route is a single SVG path string. Change it to send the GPS somewhere else, and move the `blip(...)` and the `gradient(...)` end to its end point. In v0, keep the route's footprint within about 360×160 so both ends stay in frame.

## Render
```bash
# with sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o minimap-corner.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o minimap-gps-card.mp4

# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o minimap-corner.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o minimap-gps-card.webm
```

## Swap in your own clip
1. Put a 1080×1920 clip in `assets/plates/`.
2. Point the variant's `plate` in CONFIG at it.
3. Set the `src` of `#plateA` (variant 0) or `#plateB` (variant 1) to the same path, so the framework loads it. Keep `muted`, `playsinline` and the `data-*` attributes.

Or render with `bg: "none"` and lay the overlay on your clip in your editor.

## Keywords
GTA 6, GTA VI, minimap, radar, GPS, waypoint, route, blip, arrived, map, HUD, Vice City, Leonida Keys, Grassrivers, navigation, overlay, transparent
