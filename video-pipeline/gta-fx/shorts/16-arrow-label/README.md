# 16 · Arrow pointer (`arrow-label`)

A clean drawn pointer that sends the viewer's eye to one detail in the shot, with a short label. Use it in GTA 6 breakdown and compilation shorts at the reveal moment ("Look at her hair", "Look at the rust"), or to name a character the first time they appear. Use one pointer per reveal: the top-performing GTA shorts use a single arrow, only at the reveal.

- **Variant 0, Curved arrow:** the arrow leads. A white arc draws from just above the caption to the spot in 0.30 s (power3.out). The line tapers from 8 px at the tail to 12 px at the tip, like a brush stroke. As it arrives, a 64 px open chevron grows to 1.15 and settles to 1 over 2 frames, so the arrow is complete about 0.32 s into the beat. The caption words rise in from 0.15 s (expo.out). It is Inter 800 at 92 px with one key word in the Leonida sunset gradient. On exit the caption lifts out first, then the arc retracts into the target, so the label is never on screen without its arrow.
- **Variant 1, Pointer + dot:** a sunset dot with a white ring pops onto the spot. A 5 px vertical stem draws out into a smoked-glass card, which wipes open from the edge the stem enters. The card rides the dot sideways, so the stem always lands on the type's column: the left edge of left-aligned text, or the right edge of right-aligned text. The card holds a tracked caps tag (30 px) and a name (84 px, or set per beat). Use it as a detail callout ("DETAIL / Rusted arch") or a name tag ("PROTAGONIST / Lucia Caminos"). On exit the card fades as one layer (its type slightly ahead of the glass), then the stem retracts into the dot, then the dot shrinks away.

Both variants support several **beats**. The demo has two:
1. Lucia's hair, for 0.35–2.55 s.
2. After the hard cut at 2.57 s, the rusty teal car, for 2.7–4.95 s.

Delete a beat to get a single callout. Each beat clears before the next starts, so nothing straddles a cut. Each beat's target is a **track** of keyframes, so the arrow tip or dot follows the subject while the camera moves. Every tip and dot is clamped into the safe zone. With `bg: "none"` (the transparent overlay) there's no sample plate to follow, so each beat holds still on its `still` spot.

## CONFIG fields (top of the script in `index.html`)
| Field | Meaning |
|---|---|
| `duration` | Composition length in seconds (5.0). Also update `data-duration` on `#root`, the video and `#ov`. |
| `safe` | The safe-zone box. Tips, dots and cards are clamped into it (x 72–936, y 236–1480). |
| `beats[].in` / `.out` | When the beat starts and when it has fully cleared, in seconds. |
| `beats[].exit` | How long the clear-out takes, ending at `out` (default 0.37 s). v0: caption first, then the arc. v1: card, then stem, then dot. |
| `tracks` | Named tracks of the sample plate (`hair`, `arch`), shared by both variants. |
| `beats[].track` | The spot being pointed at, as a name from `tracks` or as its own `[[time, x, y], ...]` in 1080×1920 frame pixels, smoothed with a spline. One keyframe gives a fixed spot. Used with `bg: "plate"`. |
| `beats[].still` | `[x, y]`: the fixed spot used for the transparent overlay (`bg: "none"`). Set it to where your detail sits. |
| `variants["0"].strokeTail` / `.strokeHead` | Arrow line weight at the tail and at the tip (8 → 12 px taper). The arrowhead uses `strokeHead`. |
| `variants["0"].head` / `.headAngle` | Arrowhead arm length (64 px) and chevron half-angle (degrees). |
| `beats[].lines` / `.highlight` (v0) | Caption lines, and the one word painted with the sunset gradient. |
| `beats[].label` (v0) | `{align, x, y, follow}`: the caption anchor. With `align: "right"`, `x` is the right edge. `follow` (0–1, default 0) makes the caption and the arrow's tail drift with that fraction of the target's x motion, so a panning shot doesn't slide scenery under the type. The rust beat uses 0.35. |
| `beats[].tail` / `.bend` (v0) | Where the arrow starts (just above the caption), and how much it bows (a fraction of its length; a negative value bows it the other way). |
| `variants["1"].angle` / `.leader` | The leader's diagonal in degrees from vertical (35, side cards only), and the leader line weight (5 px). |
| `beats[].tag` / `.name` / `.nameSize` (v1) | The small tracked caps line ("Detail", "Protagonist"), the name lines (one array entry per line), and an optional name size in px (default 84; the rust beat uses 92). |
| `beats[].card` (v1) | `edge` is the card edge the leader enters.<br>• `"top"` puts the card below the dot and `"bottom"` puts it above. Use `{y, edge, column}`. The leader is a vertical stem, and the card rides the dot sideways so the stem lands on `column`. `"left"` (the default) means left-aligned text with the stem on its left edge. `"right"` means right-aligned text with the stem on its right edge. `"center"` means centred text. `y` is the card's top. If the safe zone stops the card, the stem leans onto the column as the card opens.<br>• `"left"` puts a fixed card to the right of the dot, and `"right"` puts it to the left. Use `{x, y, edge, anchor}`. A 35° diagonal then runs into `anchor`: `"tag"` (the tag's centre line, the default), `"center"`, or a px offset from the card top. |

## Render
```bash
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o arrow-curved.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o arrow-pointer.mp4
# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o arrow-curved.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o arrow-pointer.webm
```

## Use your own clip
- **As an overlay (usual):** render with `bg: "none"` and drop the .webm above your clip.
  - Set each beat's `still` to where your detail sits. Read x/y off a 1080×1920 still of your clip. The overlay holds that spot and doesn't use the sample-plate track.
  - For v1, put the card over a calm part of the frame, above or below the detail (`edge`, `y`), and pick the `column` that keeps it inside the frame. A card left of the detail reads best right-aligned (`"right"`). The transparent export uses a denser smoke (0.82), because there is nothing behind it to blur.
  - If your camera moves and you want the pointer to follow it, bake it in instead (below).
- **Baked in:**
  1. Change the `<video id="plateA">` `src` to your 9:16 clip.
  2. Set `data-media-start` to the in-point in seconds. The demo uses 2.9 to open on Lucia just after the plate's own dissolve.
  3. Retime `beats[].in/out` so each beat sits inside one shot and clears before a cut.
  4. Set each beat's `track` to keyframes on your subject, one every 0.1–0.4 s. The spline smooths between them.

## Keywords
arrow, pointer, callout, look at this, detail, annotation, leader line, pin, tooltip, name tag, character label, dot, tracking, motion tracking, hand-drawn arrow, curved arrow, GTA 6, GTA VI, Lucia Caminos, Jason, hair, rust, rusted arch, brush arrow, tapered arrow, breakdown, trailer analysis, details you missed, shorts, TikTok, Reels, overlay, transparent
