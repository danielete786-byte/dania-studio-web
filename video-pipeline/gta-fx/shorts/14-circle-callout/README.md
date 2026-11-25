# Circle callout (#14, Detail callouts), craft v2

Points out one detail in a clip by drawing on the footage itself. A mark locks onto the detail and follows it, a fine leader line runs to a cinematic label set in the image's own negative space, and the moment the mark closes is the payoff hit.

Use it in "details you missed", "GTA 6 graphics are insane" and side-by-side detail shorts, whenever the voiceover says "look at the…" and the viewer needs to know *where* to look. One callout per shot works best. Number them (`Detail 01`, `Detail 02`…) across a list.

- **Variant 0, Ring + label.** A ring of light in the Leonida sunset gradient draws clockwise around the detail, led by a white-hot pen head. When it closes: a warm exposure bloom on the detail, a specular glint sweeps across the lens inside the ring, the footage punches in on the detail with a short shake, and the ring splits RGB. The leader leaves the ring at 9 o'clock, runs left and drops down the frame's dark edge to a pin, and the label rises out of masks below it: `— DETAIL 01` over **Real-time / reflections** in Inter display (about 150 px). Sample: Jason's mirrored sunglasses in `s008` (Jason driving), which reflect the street going by.
- **Variant 1, Bracket + label.** Four white focus-lock corners fly in from wide with motion blur and snap onto the detail. On the lock: the corners flare white-hot, a warm bloom lands on the detail, the footage punches in with a short shake, the corners split RGB, and the frame outside the brackets dims a touch, like a camera finding focus. A pin on the middle of the box's top edge sends a leader up to the label: `— DETAIL 02` over **CLOTH / PHYSICS** in Archivo wide caps (about 118 px), with PHYSICS in the sunset fill and a specular sheen. Sample: the palm-print sleeve in `s004`, which folds and swings as he gestures.

1080×1920, 30 fps, 5.0 s. The mark is on screen from frame 3, the payoff lands at about 0.6 s, the label reads by about 1.2 s and holds to 4.3 s, then the type drops back into its masks, the leader retracts and the mark un-draws (ring) or opens out (brackets). Everything is clear by about 4.95 s, so the clip loops.

On the sample footage the mark is **motion-tracked** (SSD template tracking, one sample every 0.1 s in `CONFIG`). The label never moves while it's being read; the leader re-aims every frame. The footage push and the punch-zoom both pivot on the detail, so the mark stays locked.

Circle something the viewer can verify at a glance, and make the label say exactly what is inside the mark. Keep the label off faces and hands.

## CONFIG (top of the script in `index.html`)
| Field | What it does |
|---|---|
| `variants[v].shot` | Which `<video>` the variant shows (`shotA` = `assets/clips/s008-jason-driving-slow.mp4`, `shotB` = `assets/shots/s004-palm-shirt-truck-v.mp4`). |
| `kicker` | The small tracked label over the hero (`Detail 01`). |
| `lines` | The two hero lines. v0 fits the widest line to `heroWidth` (740 px) in Inter display; v1 to 600 px in Archivo wide. Size is clamped to `heroMin`/`heroMax`, so long labels never drop under the size floor: shorten them instead (about 12 characters a line for v0, 8 for v1). |
| `accentLine` (v1) | Which hero line carries the sunset fill (v0's accent is the ring). |
| `target {x,y}` | Centre of the detail in px on the 1080×1920 frame at the track's reference frame (or always, if there's no track). The push and punch-zoom pivot here. |
| `radius` (v0) / `box {w,h}`, `arm` (v1) | Ring radius / bracket frame size and corner arm length. |
| `label {left, top}` | Top-left of the label block. Keep it inside x 72–936 and y 230–1480, off faces and hands. |
| `leaderX` (v0) | x of the leader's vertical drop (aligned with the type's left edge). |
| `leaderFrom` (v1) | Where the leader's pin sits under the label (offset from its left edge and bottom). |
| `lift` (v0) | `{brightness, contrast}` lens lift inside the ring (plate only). |
| `defocus` (v1) | `{blur, dim}` focus dim outside the brackets after the lock (plate only). Default `blur: 0`: a blur reads as soft footage on a phone, so only raise it on very sharp clips. |
| `push` | Slow camera push over the clip (1.06 / 1.05). |
| `burst` | Strength of the warm payoff bloom on the detail (v0 0.8, v1 1.0; plate only). |
| `scrim` | `"bottom"` (v0, under a low label) or `"top"` (v1, behind a high label). It's part of the graphic, so it stays with `bg: "none"`. |
| `track` | `[dx, dy]` offsets every `trackStep` (0.1 s) added to `target`. `[]` keeps the mark still. |
| `trackWithoutPlate` | `false` (default): with `bg: "none"` the mark holds still at `target`. |
| `timing.v0` / `timing.v1` | `mark` (draw/fly-in start), `markDur`, `hit` (the payoff), `leader`, `kicker`, `hero` (label reveal), `out` (exit start, 4.3). |

## Render
```bash
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o circle-ring.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o circle-bracket.mp4
# transparent overlay for CapCut / Premiere (mark holds still at `target`; no grain, vignette, payoff bloom, lens lift or focus dim)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o circle-ring.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o circle-bracket.webm
```

## Use your own clip
1. Put your clip in `assets/` (at least 5 s of one shot) and point `<video id="shotA">` (or `shotB`) at it.
2. Set `target` to the detail's centre (px on a 1080×1920 frame) and change `kicker` and `lines`.
3. If the camera or the detail moves, fill `track` with `[dx, dy]` offsets every 0.1 s from any point tracker (CapCut/Premiere tracking data, or nudge by eye), measured from the frame where `target` was taken. Otherwise set `track: []`.
4. Place `label` in your shot's own dark or empty area (sky, shadow, a dark car interior), not over a face.
5. Or render with `bg: "none"` and position or track the transparent overlay in your editor.

## Keywords
circle callout, ring highlight, detail callout, look closer, details you missed, leader line, focus brackets, focus lock, lens glint, motion-tracked annotation, GTA 6 graphics, real-time reflections, sunglasses reflection, cloth physics, Jason Duval, overlay, transparent webm
