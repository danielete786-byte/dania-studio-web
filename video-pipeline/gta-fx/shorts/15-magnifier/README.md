# 15 · Magnifier zoom (Detail callouts), craft v2

A detail lifts off the footage. A mark draws on one tracked spot of the clip. Then a loupe (v0) or a framed plate (v1) grows out of that spot as an exact copy of the footage under it and flies to its seat while the magnification climbs to 2.5×. It lands on a hit: flash, shake, RGB split and a glass sheen. While the inset is up, the rest of the frame racks out of focus (blurred and darkened, with a sharp hole at the spot), and the hero line rises in the bottom band. At the end the type drops away, the inset flies home and lands as a 1:1 copy of the footage, and the world refocuses. The zoom reads a **native-pixel master** of the same shot (cut from Rockstar's 2160p Trailer 2), so it shows real detail rather than an enlarged blur.

**When to use it in a GTA 6 short:** the "details you missed" beat. The clip keeps playing, with no freeze, while the lens pulls out the small thing worth talking about: a print, a sign, a plate, a tattoo, a reflection or a HUD icon. Use it once per reveal, on a steady shot, for 3–5 s while you say the line.

| Variant | Name | Look |
|---|---|---|
| `0` | Round lens | A 560 px optical loupe over the dark part of the frame: 3 px white rim with bloom, edge falloff, specular and a faint chromatic edge, plus a fine tick ring that turns into place as it lands. A drawn ring with N/E/S/W ticks marks the spot, joined by tangent lines and a faint light cone. The hero is Archivo wide caps, "TINY **BEACH**" (sunset on BEACH), with the kicker "HIS SHIRT · 2.5×". |
| `1` | Inset card | A framed detail plate (580×518) with square corners, a 2 px white frame and viewfinder brackets. The spot is a focus box (corner brackets closing in, plus a hairline), and projection lines carry the light up into the plate. The hero is Inter display, "A whole **beach**", with a JetBrains Mono kicker "TRAILER 2 · 0:14 · 2.5×". |

Both variants are 1080×1920, 30 fps and 5.0 s. Timeline: mark 0.15 s → lift 0.50 s → **hit 1.00 s** → hold → type out 3.90 s → inset home 4.10–4.42 s → mark gone 4.66 s → clean shot to 5.0 s (a handle for your next cut). Hero frame: 2.0 s.

## CONFIG fields (top of the script in `index.html`)
- `clip`: the shot. **Also change the static `src` of `#plate`.**
- `zoomClip { src, x, y, w, h }`: the clip the zoom reads, and the rectangle of the 1080×1920 frame its picture covers. The sample is `assets/zoom/s004-shirt-zoom.mp4` at `x 240, y 800, w 640, h 600` (a 1600×1500 master, exactly 1:1 at 2.5×). With no sharper source, use the shot itself: `{ src: clip, x: 0, y: 0, w: 1080, h: 1920 }`. **Also change the static `src` of `#zoom`.**
- `zoom`: magnification (2.5). The mark is the inset size ÷ zoom.
- `push { from, to }`: the slow camera push on the held shot (1.00 → 1.05). The mark follows it automatically.
- `defocus { blur, dim, contrast, saturate }`: what happens to the world outside the spot while the inset is up (8 px, 0.4, 1.1, 1.06).
- `track { fps, pts }`: the spot centre in frame pixels, sampled `fps` times a second from t = 0, as `[x0,y0, x1,y1, ...]`. Give one point for a still subject.
- `typeTop`: the mark is softly held above this line (1296 px) so it never runs into the type band.
- `variants["0"]` (Round lens): `kicker`, `hero` (two words: the second gets the sunset fill), `lens { x, y, r }` (seat centre and radius; the sample is 378, 556, 280), `nudge [dx, dy]` (shifts the track to frame the detail).
- `variants["1"]` (Inset card): `kicker` (real context, such as the source and timestamp), `hero` (two parts: the second gets the sunset fill), `plate { x, y, w, h }` (the sample is 86, 272, 580, 518; keep the brackets, 14 px outside, inside x 72–936), `nudge`.
- `timing`: `spot`, `lift`, `land` (the hit), `settle`, `typeOut`, `back`, `backDur`, `clear` and `end`, in seconds.

The hero line auto-fits to the 864 px safe width (it steps the size down if a longer line would overflow). Keep it to one short line: two words in v0's wide face, about 13 characters in v1.

## Render
```bash
cd gta6/15-magnifier
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -o magnifier-lens.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -o magnifier-plate.mp4
```
This is a full-frame component: it magnifies and refocuses the footage itself, so it always shows footage. `bg: "none"` keeps the footage but turns off the finishing stack (grain, vignette and the flash), for when you grade and finish in your editor. There is no transparent version.

## Swap in your own clip
1. Use a **steady** vertical clip (1080×1920, at least 5 s) where the detail stays in view. Put it in `assets/`, set `CONFIG.clip`, and change `#plate`'s `src` to match. If the moment starts later in the file, add the same `data-media-start` to `#plate` and `#zoom`.
2. **Make a zoom master** from the sharpest source of the same shot (for example the 4K original your vertical was cropped from): `tools/make-zoom-master.sh <source> <in s> <out s> <vertical crop w:h:x:y> <frame region x:y:w:h> 2.5 assets/zoom/my-zoom.mp4`. The script header walks through the sample's numbers. Set `zoomClip` to the region, and point `#zoom` at the file. Without a sharper source, set `zoomClip` to the clip itself.
3. Track the detail: `/usr/bin/python3 tools/track.py <clip.mp4> <ref frame> <x> <y> <half-size>` prints `{fps, pts}` for `CONFIG.track`. Then tune each variant's `nudge` to frame it.
4. Place the inset over a calm, dark part of your frame that is clear of faces (`lens` / `plate`), and keep the detail above y ≈ 1150 so the type band stays free.
5. Edit `kicker` and `hero`. Say only what is actually visible in the zoom.

## Keywords
magnifier, magnifying glass, loupe, zoom lens, detail zoom, inset zoom, picture-in-picture zoom, callout, details you missed, look closer, easter egg, GTA 6, GTA VI, tracking zoom, focus pull, depth of field, defocus, 2.5x, 4K zoom, native resolution, viewfinder, projection lines, Leonida sunset, craft v2
