# #27 Top 3 podium (`podium-3d`)

A Three.js podium for the top-3 payoff of a GTA 6 ranking short ("Top 3 moments", "most-viewed trailers", "best cars"...).
- It's one stepped podium in glossy ink-navy on a dusky sunset sky (Rockstar's `#9C7AA8 → #FFC88F` feature-card sky, graded over the blurred clip). The step heights are 1.00 / 0.70 / 0.50, and the winner's step is 1.15x wider.
- Third, second and first grow straight up out of the floor in that order. They are always solid, never see-through. Each step carries an extruded 3D rank numeral and has its clip standing on top as a card, seated with a contact shadow.
  - The "2" and "3" are a near-matched white pair (about 185 / 170 px on screen), with lit top edges so they read as extruded.
- The "1" slams in with a sunset sweep, and a thin sunset rim lights up along the winner's top edge. The winner is the only warm accent on the podium.

When to use it:
- At the end of a countdown compilation, as the "here's the final top 3" recap before the outro.
- As a 6-second hook that teases the winner before the full ranking plays.

1080×1920, 30 fps, 6.0 s. It's a full-frame component, so it always shows footage.

It loops cleanly. From 5.6 s the cards fold back and fade, then the steps sink into the floor, and the last frame shows only the backdrop. The house light is the same on the first and last frames, so the loop point never flashes.

## Variants
| `variant` | Name | What happens |
|---|---|---|
| `"0"` | **Podium** | The build plays on a slight three-quarter wide, with the podium at about 68% of the width. The places rise at 0.25, 0.6 and 0.95 s, and the "1" slams at 1.45 s (scale 1.15→1 in 3 frames, plus a sunset sweep across its face). On the slam, the camera pushes in about 1.17x (expo.out, 1.2 s) and swings square onto #1, then keeps settling through the hold. Every card stays inside the safe zone. Demo: the creator's "Top 3 moments" from Trailer 2, with names only (`meta` left empty for the creator). |
| `"1"` | **Winner spotlight** | The house lights are low from the start (a darker dusk sky) and the camera holds a slightly wider frame. After the slam, a spotlight beam shows below the title, lights #1's card and step, and lands with a short bloom on the "1". #1's number counts up and a record chip pops in. The runners-up drop into shadow (desaturated, darker, a little more at 2.4 s) but keep their names and view counts. Demo: most-viewed GTA 6 trailers (Trailer 1 305.4M, Trailer 2 189.6M, Launch Trailer 82.0M, from Rockstar's YouTube as of 2026-11-18). |

`bg`:
- `"plate"` (default) shows the blurred backdrop clip under a sunset colour grade. The clip gives only soft light and shade, and the sky gives the colour, so any clip reads as the same dusky lilac-to-peach sky. A warm floor glow sits under the podium.
- `"none"` drops only the backdrop. The podium, ground shadows, beam and clip cards render on transparency, so you can lay them over your own background.

## CONFIG fields (top of the `<script>`)
- `variants["0"|"1"].style`: `"podium"` or `"spotlight"` (the camera and light behaviour).
- `.backdrop`: `{ src, in, rate }` for the clip used as the blurred full-frame backdrop. Use your #1 clip, and pick a stretch of it that keeps one colour.
- `.kicker`: small wide-tracked line above the title (e.g. `"GTA 6 · Trailer 2"`).
- `.title`: the hook title (uppercased, balanced over at most two lines).
- `.entries[0..2]`: **rank 1, 2, 3** in that order, each with:
  - `name`: the card title in caps, fitted to at most two lines and never below 44 px on screen. Side cards are about 250 px wide, so keep names short (two short lines).
  - `meta` (optional): a short line under the name, e.g. your own timestamp or note. Leave it `""` to hide it, so the name sits on the card's bottom edge.
  - `count` + `unit`: instead of `meta`, a number that rolls up as the card lands (e.g. `305.4` + `"M views"`).
  - `clip`: `{ src, in, rate, pos? }`.
    - `in` is the in-point in seconds and `rate` the playback speed. Pick them so the card stays on **one shot that matches its label** for its whole time on screen.
    - For slow motion, don't use a live `rate` below 1: it holds frames and judders. Pre-slow the clip with frame blending, play it at `in: 0, rate: 1`, and give the matching `<video>` the same `src`. The demo clips in `assets/clips/card-*.mp4` were made this way:
      `ffmpeg -ss <in> -t <span> -i clip.mp4 -vf "setpts=PTS/<rate>,minterpolate=fps=30:mi_mode=blend" -an out.mp4`
    - `pos` (optional) is the card's crop as a CSS `object-position`, e.g. `"50% 88%"` to drop the crop below a car's sun visor.
      - A vertical (9:16) clip in these cards can only be re-cropped up or down: a higher y% shows more of the bottom of the source, so content moves up in the card.
      - To re-frame left or right, use a horizontal clip. The demo's Jason card uses `p03-jason-door-h.mp4` at `"30% 50%"` to keep him in frame.
  - `chip` (optional, on #1): a smoked-glass pill centred on the top of the winner's card (e.g. `"90M+ in 24h"`). It shrinks to fit, never below 26 px, so keep it under about 12 characters.
- `type`: on-screen type sizes at the settled framing: `name` 52, `small` 32, plus the card radius. The script converts these through the camera, so they hold on screen.
- `timing`:
  - `rise[3|2|1]`: when each place starts to rise. Keep each card `<video>`'s `data-start` equal to it.
  - `riseDur` / `riseDur1`: how long the steps take to rise.
  - `slam`: the "1" hit. The v0 camera push starts here, and the winner's rim lights up.
  - `push`: how long the v0 push-in takes (1.2 s).
  - `spotlight`: when the v1 beam fires. The v1 camera settles from here.
  - `dimMore`: when v1 dims the runners-up further. Their dimmer goes 0.25 → 0.35, on top of a `saturate(.65) brightness(.8)` grade that eases in with the beam.
  - `out` / `end`: when the fade-out starts and when the component ends.

## Swap in your own clips
1. Copy your clips into `assets/clips/`. Vertical or horizontal both work, because cards use `object-fit: cover`.
2. In the HTML, point each card's `<video>` `src` at your file and set `data-media-start` (in-point) and `data-playback-rate` (speed).
   - Each card holds one `<video>` per variant. The script shows the one whose `src` matches CONFIG.
   - The backdrop works the same way, through `<video id="bg0">`/`bg1`.
3. Put the same values in CONFIG (`clip.src/in/rate`, `backdrop`). Keep every `<video>` `muted playsinline` with its `data-*` attributes.
4. Check that no shot cut falls inside a card's window. A card is on screen from `rise[r]` to the end, so it needs about `(6.0 − rise[r]) × rate` seconds of one continuous shot.

## Render
```bash
# with the blurred backdrop
npx hyperframes render . --variables '{"variant":"0"}' -q high -o podium.mp4
npx hyperframes render . --variables '{"variant":"1"}' -q high -o spotlight.mp4
# podium + cards on transparency, to lay over your own clip
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o spotlight.webm
```
Round captures: `bash tools/gta/capture.sh gta6/27-podium-3d <round> 4.2`.

## How it works
- WebGL (three@0.160.0) draws:
  - the steps: opaque rounded extrusions in ink-navy `MeshPhysicalMaterial` with clearcoat. Their origin is at the bottom centre, so they grow up out of the floor and sink back into it, are never clipped, and are never faded.
  - the extruded numerals: Barlow Condensed Black outlines inlined as path data. "2" and "3" have white faces and navy walls, with a soft white highlight on their top-facing walls and bevels. The "1" has a shader face that carries the sunset gradient.
  - the winner's thin sunset rim on its front-top bevel. It is additive.
  - a PMREM neutral ink-navy studio environment, cool-neutral rim lights and a shadow-casting key;
  - a `ShadowMaterial` floor, contact shadows under the steps, and a soft contact shadow under each card on its step top;
  - the spotlight cone, a SpotLight and the pool of light. All three are additive, so `bg: "none"` stays transparent. The cone fades in by screen row (`BEAM_FROM` / `BEAM_FULL`, 540 → 610 px), so it never washes the title. Move these if your title runs longer.
- The clip cards are DOM. Every frame they are pinned onto their 3D quads with a projective `matrix3d` from the camera, so the type stays sharp.
- One paused GSAP timeline drives everything. A proxy property's setter renders the 3D frame for the timeline time, so the component is seek-safe and deterministic, with no rAF and no randomness.

## Keywords
podium, top 3, top three, ranking, leaderboard, winner, first place, reveal, countdown finale, stepped podium, 3D, three.js, extruded numbers, spotlight, compilation, GTA 6, GTA VI, most viewed, best moments
