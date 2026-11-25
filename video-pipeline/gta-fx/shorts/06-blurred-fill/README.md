# Blurred fill frame (GTA 6 component #6, Framing) — craft v2

Puts landscape (16:9) footage into a vertical 9:16 short as an **ambient screen**. The shot plays sharp in the frame. The same shot, blown up and blurred, glows around it, and the frame's own edges bleed light past it, like a lit screen in a dark room. Every cut re-colours the whole vertical frame. The type sits in that glow, never on the picture.

**When to use it in a GTA 6 short:** whenever the source is landscape: trailer moments, gameplay captures, a "things you missed in Trailer 2" breakdown or a compilation. It replaces a crop that loses the action, and it replaces dead black bars.
- **Variant 0 "Title + clip"** is for a hook title over a montage. An inset 900x506 screen (x 54-954, y 707, radius 6, lit top edge, contact shadow) sits in the middle of the frame, centred on the safe-zone axis (x 504) so its right edge stays clear of the action rail, and the lit room wraps all four sides. It opens from a 127 px slit of footage on frame 0 and closes back to it on the exit. Its light spills into the room and pools in a soft reflection on the floor. Above it sits the title in **Rockstar's own date-card style**: white wide Archivo caps with a hard `#EE08F2` offset and a soft white and magenta bloom ("Welcome to / LEONIDA", 134 px, about 825 px wide). A source line with a live trailer timecode sits below. **Payoff:** on the 2.1 s cut, LEONIDA becomes a window onto the jetski shot itself (video-in-type). The crop starts 2.3x close on the green hull and pulls back as the jetski arrives. It is graded darker and denser than the white title and has a 1.5 px inner white edge, so the knockout is the only colour event in the piece. A light hit and shake land with it. After 0.62 s, the white wipes back right to left, following the jetski out of frame, and the title gets a bloom swell. The sample montage is highway, jetski, sunset dock (a 0.9 s quick cut), sunset pier, then the Launch Trailer balcony sunset to close. It ends on its brightest, sharpest shot, never a hazy one.
- **Variant 1 "Clip + caption"** is for a clip with an opinion on it. An 864x486 inset frame (radius 8, lit edge) sits on the text grid (x 72-936, clear of the action rail). It resolves out of its own glow and throws light down into the caption hung tight beneath it. The caption has a real hierarchy: a 112 px setup line ("Every frame", Inter 700, 86 % white) and a 184 px payoff line ("is unreal.", Inter 800, sunset word). The payoff line slams in as one unit and is sharp by the 1.4 s cut. A 5 px RGB split then runs on that line only, for 0.15 s. The setup line never splits. One 27 px slate row above the frame carries the source and live timecode on the left and the handle on the right. The source label follows the shot (the sample opens on a Launch Trailer shot, then cuts to Trailer 2).

Both read within about 0.8 s. The hit on each is a 2-frame light hit (an exposure push that keeps blacks black, plus a faint warm veil) with shake (and, in v1, a small 5 px RGB split on the payoff line only).

The glow is graded, not left as raw blur. Below the clip, a soft-light ramp deepens the glow and raises its saturation (navy in v0, black in v1). v0 also has a bottom scrim (y 1350-1920 at .4), so the lower fill reads as falloff. A per-shot multiply `tint` gives white sky or spray in the glow the scene's colour (azure on the water, amber at the bar) instead of milky grey. v0 runs a lighter grain (.10) so it doesn't crawl on the flat blur.

- 1080x1920, 30 fps, 6.6 s. Footage always shows (full-frame component).
- Variables:
  - `variant`: `"0"` Title + clip, `"1"` Clip + caption.
  - `bg`: `"plate"` (default) adds the finishing stack: grain, vignette, light leak and the hit light. `"none"` keeps the footage but drops that stack.

## CONFIG fields (top of the `<script>` in `index.html`)
| Field | What it does |
|---|---|
| `handle` | Channel handle, set at the right end of the v1 slate row |
| `fill.blur`, `.brightness`, `.saturate` | The glow: blur in px (default 64), and its default grade (0.70 / 1.65). The room falloff (`#room`) darkens the far edges, and the floor grade (`#floorDeep`, `#floorTint`) deepens everything below the clip |
| `light.gain`, `.contrast`, `.veil`, `.hold`, `.decay` | The hit light (plate only). An exposure push on the footage (`gain`), with a `contrast` term that holds the blacks, plus a warm screen veil (`veil`). It peaks for `hold` s and decays over `decay` s. `variants[n].gain` overrides `gain`: lower it for bright shots so they flare instead of whiting out |
| `fill.zoom`, `fill.drift`, `fill.bleed` | How far the glow is enlarged, its slow push over the piece, and how far (px on the 1/4-size canvas) the glow copy runs past the frame edge, so a lighter blur never shows dark edges |
| `fill.spillBlur`, `.spillBright`, `.spillMax`, `.spillOpacity` | The edge spill: the shot's own edges stretched past the frame, blurred and screen-blended above the room falloff, so the screen throws light into the room. `spillMax` caps its brightness (v0 uses 0.95, so bright day shots glow instead of washing out). `spillOpacity` sets how much light it throws |
| `variants[n].fill` | Per-variant overrides of any `fill` field. v1 uses blur 36, zoom 1.0 and bleed 18, so the glow keeps the scene's structure |
| `variants[n].shots[]` | One entry per shot. `src`, `start`, `dur` and `in` must mirror the `<video>` tags. The rest are listed in the next rows |
| `shots[].tc`, `.focus`, `.glow` | `tc`: where the shot starts in its source video, in seconds (drives the live timecode). `focus`: which stripe of the frame the glow samples, 0 left to 1 right. `glow: [brightness, saturate]` (optional): that shot's glow. Give dark shots 1.0-1.2 so the room stays lit, and light shots 0.55-0.8 |
| `shots[].tint` | Optional `["#colour", strength]`: a multiply grade on the glow while the shot is up, so white sky or spray takes the scene's colour |
| `shots[].credit` (v0) | Optional. The source text before the timecode while this shot is up (defaults to `credit`). Use it when a shot comes from a different trailer. The sample's last shot reads "Rockstar · Launch Trailer", the short form, so the line stays inside the safe zone |
| `shots[].label`, `.scrim`, `.top` (v1) | Optional. `label`: which trailer the shot is from (defaults to `slate`). `scrim`: 0-1, a soft shadow behind the slate row. `top`: 0-1, a top-of-frame scrim. Use `scrim` and `top` on light shots |
| `variants[n].hit` | Time of the payoff: light hit and shake (v1 adds a 5 px split on the payoff line at hit + 0.12). Put it on a cut. In v0 the title takes the footage; in v1 the payoff line slams in |
| `variants["0"].typeFill` | The v0 video-in-type payoff. `shot`: which shot fills the title (it must match the `#t0b` `<video>`). `hold`: how long the footage fills the whole word, in s. `cross`: the length of the white wipe back. `dir`: `1` wipes in from the left, `-1` from the right (follow the subject's travel). `w`, `x`, `y`: the size and offset of the video behind the 864x240 title box; the glyphs sit at about y 81-177 in it. Aim the footage's most colourful band (here the green hull, frame x .54 / y .60) at the word's centre. `zoom: [from, dur]`: the crop starts that much closer and pulls back on the hit (use it when the subject is still small at the cut). `grade`: a CSS filter on the type's footage (darker and denser than the title). `edge: [px, alpha]`: the inner white edge stroke (half of it falls inside the glyph). End `hold + cross` before the subject leaves the frame |
| `variants[n].beat2` | A second, smaller light beat on a later cut (v0: a bloom swell on the title, on the cut into the last shot; v1: the sheen re-fires) |
| `variants["0"].grain` | v0's grain strength (.10). v1 uses the default .12 |
| `variants[n].leak` | Start of the single warm light leak (plate only) |
| `variants[n].out`, `.end` | Exit start and total length |
| `variants["0"].kicker`, `.title`, `.credit` | The small label, the wide hero title (Rockstar date-card style; keep it to about 7-8 characters at 134 px, or lower `#hero` font-size), and the source text before the timecode |
| `variants["1"].slate` | Default source label before the live timecode (a shot's `label` overrides it) |
| `variants["1"].caption`, `.setupSize`, `.payoffSize` | The caption. `\n` breaks the line. Wrap ONE word in `*...*` for the sunset word. The line holding it is the payoff line (`payoffSize`, 184 px: keep it to about 10 characters) and slams in as one unit on the hit. The other lines are setup lines (`setupSize`, 112 px: about 14 characters) and rise word by word at the start |

## Swap in your own clip
Each shot appears several times in `index.html`, with the same `src`, `data-start`, `data-duration` and `data-media-start`:
- the glow copy `#f0a…` / `#f1a…`;
- the spill copy `#g0a…` / `#g1a…`;
- the sharp screen copy `#s0a…` / `#s1a…`;
- v0 only: the reflection copy `#r0a…`, and `#t0b`, the copy of the hit shot that fills the title.

1. Put your 16:9 clip(s) in `assets/clips/`.
2. For each shot you replace, set the new `src` (and timing) on every copy, and mirror it in `CONFIG.variants[n].shots`.
3. One long clip instead of a montage: keep one shot per layer, with `data-start="0"` and `data-duration` equal to the length. Delete the other copies of each removed shot. Set `hit` to a strong beat in your clip, and give `#t0b` the same in-point the clip has at `hit`.
4. Never let `data-media-start + data-duration` exceed the clip's length (a frozen last frame is a defect). Keep each cut on a frame (multiples of 1/30 s). Trailer rips often have cuts baked in. Check with `ffmpeg -i clip.mp4 -vf "select='gte(scene,0)',metadata=print" -f null -`, which shows a spike of about .15 or more at each cut, and keep each shot between two of them. For example, the sample `s039` plays media 1.1-2.63, between its cuts at 1.067 and 2.667.
5. Set `tc` to where the clip starts in its source video, or `0`. If the middle of the shot is dark, move `focus` toward its bright side. If its sky turns the glow milky, add a `tint`.
6. For a different length, change `data-duration` on `#root` and `#ov`, and set `out` and `end`.

## Render
```bash
cd gta6/06-blurred-fill
# variant 0, Title + clip
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o blurred-fill-title.mp4
# variant 1, Clip + caption
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o blurred-fill-caption.mp4
# footage without grain, vignette, leak or flash
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' -o blurred-fill-clean.mp4
```
This component frames footage, so render it to MP4 with the clip in place. It is not a transparent overlay.

## Keywords
blurred background, blur fill, ambient light, screen glow, light spill, emitted light, floor reflection, 16:9 to 9:16, landscape to vertical, reframe, inset clip, framed clip, aperture open, video in type, knockout title, footage-filled text, Rockstar date style, magenta offset, white wipe, sunset word, montage, cut on beat, trailer breakdown, compilation, slate, handle, caption hierarchy, payoff line, sunset word, light hit, exposure flash, graded floor, colour tint, source credit, live timecode, Trailer 2, Launch Trailer, Leonida, Vice City, Lucia, GTA 6, GTA VI
