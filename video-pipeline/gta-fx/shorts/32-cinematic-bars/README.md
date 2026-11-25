# 32 · Cinematic bars

Letterbox bars that turn a GTA 6 clip into a *moment*. The vertical clip plays full-bleed, the bars close, and the picture opens up into a widescreen band, with the type set in the black above and below it. It runs 5.6 s and is clear by about 5.0 s, so it loops or cuts cleanly. It's an overlay: render it with `bg: "none"` for a transparent WebM.

| Variant | Use it for | Look |
|---|---|---|
| `0` Letterbox + time | A cinematic shot, a story beat, "first night in Vice City", a sunset montage | A 16:9 film gate (band y 656–1264, bars 656 px each). The bars glide in over 0.72 s, carrying `VICE CITY` in Archivo wide 800 at 120 px, centred, with a warm bloom. On the hit (0.9 s) the picture cuts to the wide shot with an impact punch and an exposure hit, and the title's bloom swells with the light. `NOVEMBER 19 · 5:24 PM` then rises under the picture in Rockstar's date style (white wide-tracked Archivo caps with a magenta kiss). Type masks out from 3.92 s and the gate opens at 4.4 s. |
| `1` CCTV stamp | "Caught on camera": a police stop, a getaway, an NPC doing something wild, any clip that could be security footage | A 4:3 security feed (band y 555–1365, bars 555 px each) that snaps shut over the clip. Above the feed is Rockstar's own two-line CCTV on-screen display from Trailer 2 (`FRONT DOOR / 09:58:47`), at poster scale: the camera name over a ticking clock, in JetBrains Mono 600 at 128 px, flush left on its ink. Under the feed is `CAM 06 · THU 11-19-2026`. The feed has fine scanlines, a barrel falloff and a slow roll bar. Every cut is a camera switch: the name and CAM id cut with the picture, the OSD drops for one frame, and the camera's auto-iris pulses. The payoff (2.9 s) is the switch to STREET as the police car turns in: an exposure blowout, a punch zoom, a 4 px chroma tick on the clock, then a slow PTZ push. The monitor snaps open at 4.9 s. |

All type sits in the letterbox black, never on the picture, so it stays legible on any clip and never covers a face.

## CONFIG fields (top of the `<script>` in `index.html`)
- `duration`: the total length (5.6 s).
- `variants["0"]` (letterbox):
  - `aspect`: the band shape. `16/9` gives a 1080×608 picture and 656 px bars. With `2.39` the bars are thicker and the picture becomes a thin strip.
  - `shots`: the ids of the sample `<video>` tags this variant shows.
  - `place`: the hero line, set in uppercase. `placeSize` (120) shrinks by 1 px at a time, down to 110, only if the line would be wider than `placeMaxWidth` (790, centred, so it stays inside x 145–935). `placeTracking` is in em.
  - `placeGap` / `timeGap`: px from the picture's top edge to the bottom of the title, and from its bottom edge to the time line.
  - `time`: the line under the picture, at `timeSize` px. Match it to the light in your clip.
  - `bloom`: the title's two bloom colours (inner, outer).
  - `t`: when the bars start closing (`barsIn`) and how long they take (`barsDur`); when the title starts (`hero`); the payoff cut (`hit`); when the time line starts (`time`); when the type starts to mask out (`out`); and when the bars open (`barsOut`, `barsOutDur`).
  - `pushes`: `[element, start, duration, scale]` slow pushes on the footage, one per shot (plate only).
- `variants["1"]` (CCTV):
  - `aspect`: `4/3` (the classic CCTV frame).
  - `cams`: one entry per camera switch, `{ at, name, id, payoff }`. `name` is the first OSD line and `id` is the CAM number under the feed. Keep `at` equal to the `data-start` of the matching `<video>`. Name each camera after what the clip shows: a fixed-camera name over handheld footage reads as fake.
  - `clock`: `HH:MM:SS` at the first cut. It ticks once a second. Match it to the light (14:07 for daylight).
  - `date`: the date under the feed.
  - `osdSize` / `osdGap` / `metaGap`: the OSD size and its distances from the feed's edges.
  - `grade`: a CSS filter for the sample feed (plate only). `null` keeps full colour.
  - `t`: `barsIn`/`barsDur` (the snap shut), `live` (the cut to the feed), `out` (the OSD powers off and the bars snap open), `barsOutDur`.
  - `pushes`: as above. The payoff shot gets the PTZ push.

## Render
```bash
# transparent overlay for CapCut / Premiere (bars + type; the CCTV variant also keeps its scanlines and lens falloff in the window)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o letterbox.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o cctv.webm

# preview over the sample 4K footage (grain, vignette, exposure hits on)
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -o out.mp4
```
With `bg: "none"` the footage, `Look.install` (grain and vignette), the exposure hits and the pushes are all off. The bars still move, and the title's bloom still swells on the hit.

## Swap in your own clip
- **As an overlay:** render `bg: "none"` and lay the WebM over your edit.
  - Under the band, use a 16:9 clip scaled to the frame width and centred (y 656–1264 for v0, y 555–1365 at 4:3 crop for v1).
  - Or use your vertical clip: the bars crop it.
  - To get the payoff, cut your clip on the hit (0.9 s for v0, the switch times for v1).
- **Inside the project:**
  1. Put your files in `assets/` and point the `<video>` tags at them. Vertical clips go in `#full`; widescreen clips go in `#band`.
  2. Keep each tag's `data-start` / `data-duration` / `data-media-start` inside the clip's real length.
  3. List the ids in that variant's `shots`. For v1, update `cams` so each switch matches a cut.

## Keywords
gta 6 cinematic bars, letterbox, black bars, widescreen, film gate, 16:9 band, cinemascope, place and time stamp, location time, vice city, leonida, golden hour, sunset, cctv, security camera, surveillance, dvr, camera switch, osd, on-screen display, timestamp, front door, trailer 2, caught on camera, police, overlay, transparent, look kit, exposure hit
