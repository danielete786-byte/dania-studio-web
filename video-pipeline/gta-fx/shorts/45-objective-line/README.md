# 45 · Mission objective (GTA HUD kit)

The GTA "what to do next" beat for a GTA 6 short. Use it when a clip needs a goal on screen: the start of a challenge ("Go to the Vice City Marina."), a "mission" framing for a story edit, or a chapter break styled like the game's own mission title.

- **Variant 0 · Objective line:** the in-game objective box at the top left. It is a square-cornered (8 px), warm frosted HUD panel holding:
  - a wide-tracked "LEONIDA" label;
  - a distance readout;
  - a hollow diamond bullet before the objective line.

  The keyword is filled with the Leonida sunset gradient. The distance counts down ("1.4 MI" → "0.0 MI"). At `timing.arrive` (5.05 s) it swaps to **ARRIVED** at full white. The diamond fills with a quick pop and the panel's hairline catches one sheen: the "you're there" payoff. On exit the panel fades and slides out to the left.
- **Variant 1 · Mission title:** a centred lockup in the upper third (y 380–660). A wide-tracked "LEONIDA" label sits over a big condensed "VICE CITY" title. The sunset sweeps across the title at ~0.8–1.2 s, and the first objective sits right under it in plain white.
  - At `timing.handoff` (3.7 s) the title drains back to white and clears, as the game does.
  - While it fades, the objective glides up under the label, its diamond draws, and it grows to 72 px. The keyword sweep then lands as the payoff (~4.5 s).
  - The card resolves into "LEONIDA / ◇ Go to the Vice City Marina." A light vignette sits behind it in both background modes, so the type holds on bright footage.
  - Only one thing carries the sunset at a time: the title, then the keyword.

1080×1920, 30 fps, 7 s. Clears by 6.7 s so it loops.

## CONFIG (top of the `<script>` in `index.html`)
| Field | Variant | What it does |
|---|---|---|
| `plate` | both | Sample footage shown when `bg` is `"plate"`. |
| `layout` | both | `"card"` (objective HUD panel, top left) or `"title"` (mission title lockup, upper third). |
| `mission` | 0 | Wide-tracked label above the objective (same style as variant 1's `label`). `""` hides it. |
| `objective` | both | The objective sentence. Wrap the keyword in `[brackets]`; it gets the sunset fill. Long lines wrap inside the card. In variant 1, `""` hides the row (and there is no handoff). |
| `distance` | 0 | `{ from, to, unit }`: the readout counts from `from` to `to`, reaching it 0.3 s before `timing.arrive`. It shows in caps, e.g. "1.2 MI" (use `"km"` for metric). `null` hides it; the diamond still fills at arrival. |
| `arrived` | 0 | Word the readout swaps to at `timing.arrive`, e.g. "Arrived". `""` keeps the final number. |
| `label` | 1 | White wide-tracked label above the title, e.g. a region, "Mission 1" or "Chapter 3". |
| `title` | 1 | Mission title. Carries the sunset until the handoff. Starts at 150 px and auto-fits down to `titleMaxWidth` (792 px). |
| `handoffMaxPx` | 1 | Largest font size the objective grows to at the handoff (72). |
| `accent` | both | The three sunset stops: on the keyword (v0), on the title and then the keyword (v1). |
| `timing` | both | `in`: entrance start. `arrive` (v0): the readout swaps to `arrived` and the diamond fills. `handoff` (v1): the title drains and clears, and the objective takes its place and its keyword sweeps; `null` keeps the full lockup with the accent on the title. `out`: exit start. `end`: clip length. |

## Render
From this folder:
```bash
# transparent overlay for CapCut / Premiere (variant 1 keeps its soft alpha vignette behind the type)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o objective.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o mission-title.webm

# preview over the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o out.mp4
```

## Use your own clip
Either render with `bg: "none"` and lay the webm over your clip in the editor, or drop your 1080×1920 clip into `assets/plates/`, point the variant's `plate` at it, and change the matching `<video>` `src` (`#plateA` for variant 0, `#plateB` for variant 1) to the same path.

Variant 1 sits at y 380–660 (after the handoff, y 380–510). It reads best over a clip whose upper third isn't a face; the vignette keeps it legible either way.

## Keywords
gta 6, gta vi, mission objective, objective text, go to, hud, mission title, mission start, mission card, chapter card, rockstar date style, waypoint, diamond bullet, arrived, distance countdown, mission start handoff, arrived, sunset title, vice city, leonida, overlay, transparent, lower third, game ui, rockstar style
