# 28 · Clip carousel (Three.js)

A top-5 intro for GTA 6 compilation shorts. Five clip cards (your own footage, playing live as WebGL textures) turn on a 3D ring or cycle through a deck. The playing card is 864 px wide (x 72–936, the full safe-zone width) on a clean ink field (#0B0B0E) that carries only a faint glow of the same clip behind the cards, so the clip is the one lit object in the frame. The carousel lands on the next item, and that card comes forward and plays with a play bar under it. A "now playing" label shows the rank numeral, a small caps line and the name. In the last 0.7 s the camera pushes into the chosen card until its clip fills the 9:16 frame, which hands off to the clip itself. The push ends on the part of the clip you choose with `focusX`, so the subject stays in frame.

**Use it** as the opening of a "Top 5 …" short, or between entries to show what is coming next. For a full countdown, render it once per entry and change `items[0]` and `items[1]` each time.

| Variant | Name | What it does |
|---|---|---|
| `0` | **Ring** | Five cards on a turning ring, seen from a low three-quarter angle. The ring fades in as one layer while it scales up and spins, lands on #5 (the label reads by 0.75 s), then turns one step to #4. The far row shows only ~110 px above the playing card, with its own clips on the card backs at low brightness, and the side cards dissolve before the frame edge, so nothing is cut by it or sits under the like/share column. |
| `1` | **Stack flip** | A deck of five cards rises in from below the frame, card by card and fully opaque, with #5 in front. Each card behind shows a ~40 px lip with a 1 px top hairline, stepping darker toward the back, so five clips read in the stack at phone size. The front card hinges on its top edge and flips up toward you, uncovering #4. It then goes over the top of the deck and drops in behind it as the darkest back lip, while #4 comes forward. The deck and its label sit 90 px higher than Ring's (front card y ≈ 667–1143). |

`bg`: `"plate"` fills the frame with a blurred copy of the playing clip at 0.18 gain and saturate 0.8. Its exposure is matched so every clip gives a similar level. A vertical ink grade (#0B0B0E at 55% top, 25% at 45% height, 75% bottom) and a radial ink field (as `radial-gradient(120% 70% at 50% 48%, transparent 0%, #0B0B0E 78%)`) keep the upper third and the edges clean ink, so only a faint glow of the clip's colour sits behind the cards. It crossfades when the carousel turns. `"none"` leaves the area around the cards transparent. The cards always show footage.

## CONFIG

```js
CONFIG.variants["0" | "1"] = {
  kicker: "Top 5 · GTA 6",          // small tracked caps above the title
  title:  "Best trailer moments",   // Barlow Condensed 800; auto-fits to 2 lines inside 864 px
  items: [                          // exactly 5. items[0] is chosen first, items[1] second
    { rank: 5, name: "Leonida's finest", sub: "Florida Man energy",
      clip: "assets/plates/p05-truck-yard-h.mp4", from: 0, focusX: 0.5 },   // from = seconds into the file
    { rank: 4, name: "Jason & Lucia", sub: "Golden hour",
      clip: "assets/plates/p06-lucia-gate-h.mp4", from: 0.95, focusX: 0.70 },
    ...
  ]
}
CONFIG.timing[v] = { enter, enterDur, land, lab0, out0, next, nextDur, land1, lab1, out1, dolly, dollyDur, end }
CONFIG.look = { dim: 0.75, back: 0.28, deck: [0.78, 0.62, 0.48, 0.36], backdrop: 0.18, radius: 28 }
// Ring: unchosen-card and card-back brightness; Stack: brightness of the 1st..4th lip behind the front card;
// backdrop brightness (before the ink grade and radial ink field); corner radius (px at the front position)
```

- `rank`: the 200 px sunset numeral on the label. The cards carry no rank chips, so the rank is stated once.
- `name` / `sub`: the label for `items[0]` and `items[1]`. Name the moment the way you would in the video ("Leonida's finest", "The chase"), not the shot. The other three show only as clips, but give them real names too. For Stack flip, pick a first clip that looks clearly different from the second (the sample goes from a daylight street chase to a car interior), so the flip reads as a change and not as a dissolve.
- `focusX` (0–1, default 0.5): only used on `items[1]`, the clip the camera pushes into. It is the horizontal point of the 16:9 clip that the full-frame 9:16 ending centres on (0 = left edge, 1 = right edge). It is clamped to about 0.15–0.85 so the frame stays inside the clip. Put it on the subject's head, including the back of the head and any cap: 0.70 for Jason under the shelter (p06), 0.80 for Jason at the wheel (p03).
- Stack timing: `next` is 3.561 so the flip's edge-on moment lands exactly on a frame. Near edge-on the card drops under the deck and fades out there, so no frame shows it as a sliver and no frame shows one clip through another: wherever the flipping card is over the deck it is fully opaque. If you move `next`, this still holds.
- Timing: Ring fades in as one layer over 0.25 s from `enter` and spins into place until `enter + enterDur`. Stack never fades its cards: they rise in from below the frame, back card first, until `enter + enterDur` (plus a 0.035 s stagger per card). The first card pushes forward at `land`, and its label comes in at `lab0` and leaves at `out0`. The turn (or flip) runs from `next` for `nextDur`. The second card lands at `land1`, its label comes in at `lab1`, the text clears at `out1`, and the push into the clip starts at `dolly`.

## Swap in your own clips

Clips are 16:9 horizontal files, and 1920×1080 works best.

1. Put your files in `assets/` (or anywhere in the project).
2. In `#bank` in `index.html`, change a `<video>`'s `src` and, if needed, its `data-media-start` (the second to start from). Keep its `id`, `class="clip"`, `muted`, `playsinline` and the `data-*` timing.
3. Point the matching CONFIG item at the same file: `clip` is the same path and `from` is the same number as `data-media-start`.

The card reads that video's frames, so a CONFIG item with no matching `<video>` shows a dark card. Each clip needs at least 7 s of footage after `from`. The cards other than `items[1]` have faded out by 6.42 s, so anything after that point in their files never shows. Choose `from` so that the window where the card is chosen (about 0.6–3.6 s for the first item and 4.1–7.0 s for the second) holds your best shot and no title cards or logos. Keep the first item's label window to one shot: if the clip cuts while its `sub` line names a shot, the label goes wrong. The sample p01 sign shot is only 2.27 s, so it plays as a side card. Then set `items[1].focusX` on the subject in the last second of the clip window, because that is what fills the screen at the end. `items[1]` is staged at full 1920×1080, so a 1080p clip ends as sharp as a native vertical crop.

## Render

```bash
# with footage backdrop (MP4)
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o ring.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o stack.mp4
# transparent around the cards, to drop over your own background in CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o ring.webm
```

Seven seconds at 1080×1920 and 30 fps. All motion comes from the timeline time, so seeking and parallel workers give identical frames. The front card is centred on the safe-zone axis (x = 504) and is 864 px wide at its widest edge (x ≈ 72–936). All text sits inside x 72–936, y 252–1441 (Ring) or y 252–1351 (Stack flip). The rank numeral's baseline matches the name's, at y ≈ 1435 (Ring) or 1345 (Stack flip).

## Keywords

gta 6, top 5, countdown intro, blurred fill, deck cycle, focus crop, push-in, full-frame handoff, clip carousel, 3d carousel, ring, cover flow, card stack, rolodex flip, wallet stack, deck, now playing, rank numeral, compilation, three.js, webgl, video texture, vice city, leonida, shorts, tiktok, reels
