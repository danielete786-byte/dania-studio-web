# 31 · Clip grid

Several clips play at once, each with a big number and a short label: the "4 scenes in 4 seconds" format, built native to 9:16. There are no cards or tiles. The frame itself is the grid: full-bleed footage divided by thin black seams, with the numbers sitting on the image where it is calm, and one sunset line of light in the seam as the payoff.

The component is 1080×1920, 30 fps and 5 s long. Every clip plays at 1.0x and is one continuous shot.

**Use it for:**
- "4 details you missed" or "3 scenes in 3 seconds" beats in a compilation short;
- the opening hook of a list video, so the voiceover can say "number 3..." before you cut to each clip full screen;
- recaps where viewers should see several shots side by side.

## Variants
| `variant` | Name | What it does |
|---|---|---|
| `0` | 2×2 grid | Scene 1 opens full frame. Every half second the current scene **docks into its quarter** (the frame scales to 0.5 about its own corner) and reveals the next scene behind it. Each number lands at its final place as its scene appears (Archivo wide, 236 px), with its label outward from the seam. The 4th scene pulls back into the last cell at 2.3 s and the grid is complete: a shake, an exposure hit on the footage, a warm flare at the cross and the sunset line drawing out along the horizontal seam. At 3.75 s the type clears and the last cell takes the frame back, so the piece ends on a clean full-screen shot. |
| `1` | 3 stacked | Three full-width 16:9 bands wipe in from alternating sides (0, 0.4, 0.8 s), each with its number ("01"–"03", Inter display, 214 px) and a label in one column at the left. When band 3 lands (1.22 s): shake, exposure hit, and both seams light up in the sunset, left to right. At 3.42 s the type clears, the outer bands wipe away, and the middle band holds as a letterbox between the two lit seams to the end. |

`bg: "plate"` puts the grid on a black stage with film grain and a vignette, and plays the shake and exposure hit. `bg: "none"` turns all of that off and leaves the stage transparent; the clips still show (this is a full-frame component), and the seams, shadow pools and sunset line stay because they are part of the graphic.

## CONFIG fields
- `duration`: seconds (5). If you change it, also change `data-duration` on `#root`.
- `variants["0"|"1"]`:
  - `layout`: `"grid"` (4 cells) or `"stack"` (3 bands).
  - `kicker`: the small tracked line, e.g. `"4 scenes in 4 seconds"`. Grid: bottom-left of cell 3. Stack: top-left (it ends up in the black above the letterbox). Keep it to about 22 characters.
  - `cells`: one entry per clip, in number order (grid: top-left, top-right, bottom-left, bottom-right; stack: top to bottom).
    - `label`: one or two words, all labels the same kind of thing (scenes, places, characters) so they match the kicker. Grid right-column labels have about 320 px (13 characters).
    - `clip`: the clip's path. Grid cells use **vertical 9:16** clips (1080×1920); stack bands use **16:9** clips (1920×1080).
    - `in`: the in-point, in seconds.
    - `grade` (optional): a CSS filter for that clip only, e.g. `"contrast(1.14) saturate(1.14)"` to lift a flat shot.
    - `zoom` / `origin` (grid) or `zoom` / `focus` (stack), optional: scale the clip inside its cell and choose the point it scales from. Use it to frame a subject or push a HUD element out of the cell.
- `timing.grid`: `first` (when cell 1 starts docking, 0.45), `step` (time between docks, 0.5), `dock` (dock length, 0.36), `take` / `takeDur` (when and how fast the last cell takes the frame back, 3.75 / 0.5). The payoff lands at `first + 3 × step + dock`.
- `timing.stack`: `step` (time between bands, 0.4), `wipe` (0.5), `payoff` (1.22, when band 3 has landed), `out` (3.42, when the outer bands leave).

## Shot lengths (important)
Every clip must be long enough for the time it is on screen, because clips play at 1.0x and a frozen last frame is a defect.
- Grid: cell 1 needs 4.25 s from its in-point, cell 2 3.8 s, cell 3 3.3 s, cell 4 3.55 s (it carries the ending).
- Stack: band 1 needs 3.88 s, band 2 4.6 s (it carries the ending), band 3 3.04 s.
- Grid rows: the numbers sit against the middle seam, so put clips with a calm lower half (no face low in frame) in the top row and clips with a calm top (no face high in frame) in the bottom row.

## Render
```bash
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o clip-grid-2x2.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o clip-grid-stacked.mp4
# without the stage, grain and light hits (transparent around the clips):
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o clip-grid-2x2.webm
```

## Swap in your own clips
1. Drop your clips into `assets/` (vertical 1080×1920 for the grid, 16:9 for the stack). Check each one has no cut inside the part you use: `ffmpeg -i clip.mp4 -vf "select='gt(scene,0.25)',showinfo" -f null - 2>&1 | grep pts_time`.
2. In CONFIG, set `clip`, `in` and `label` for each cell, plus `grade`, `zoom` and `origin`/`focus` if a clip needs them.
3. Mirror `src` and `data-media-start` (= `in`) on the matching `<video>` tag (`#v00`–`#v03` for the grid, `#v10`–`#v12` for the stack). The script sets them from CONFIG at load; the static values keep the linter and the renderer's pre-scan in step. Leave `data-start` and `data-duration` as they are unless you change the timing.
4. Change the `kicker` to match.

## Keywords
clip grid, 2x2 grid, four-up, quad split, split screen, multi-clip, stacked clips, triptych, three clips, numbered clips, details you missed, scenes in seconds, list video, compilation, picture in picture, dock, letterbox, seam light, sunset, GTA 6, GTA VI, vertical, shorts, reels, tiktok
