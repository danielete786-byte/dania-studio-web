# 19 · Name tag (craft v2)

Shows who's on screen, set like a film credit and lit by the shot it labels. Use it the first time a character appears in a GTA 6 short: a trailer breakdown ("this is Lucia Caminos"), a character-reveal compilation, a "who is…" explainer, or a reaction where viewers need the name before the line lands.

- **Variant 0, Leader tag.** A lock-on pin is tracked to the character's collar. An elbow callout runs from the pin down a steep diagonal, then a horizontal leg runs left and ends at the name's left edge. The name hangs under the leg in 124 px wide caps: a white first name, a Leonida-sunset surname (about 770 px, 89% of the safe width), and PROTAGONIST at 28 px. The demo is LUCIA CAMINOS on Lucia at the gate (s018, golden hour), pre-slowed with a slow push.
  - **Payoff (0.98 s, when the last surname glyph seats):** a one-frame warm exposure flash from the sun (upper left, 0.9 peak), one warm gold-to-pink light leak from the sun side (under the tag), a 1.05 kick, a 0.4 s light pulse and ring snap on the pin, a sheen across the sunset, and a warm bloom on CAMINOS.
  - **Exit (3.95 s):** the role blurs out, the name rises out through its masks (each glyph fades as it goes), the callout retracts into the pin, and the pin collapses right behind it. Clean by 4.65 s.
- **Variant 1, Lower third.** The name is born in the blast. One speed-ramped shot: Jason on the rooftop at 0.4x, dropping into a 0.17x ultra-slow as the helicopter explodes behind him, held for the full 5 s. The lockup is a broadcast lower third with its own structure: a small first name (JASON, 64 px wide 600, tracked .22em) over a huge surname (DUVAL, wide 800, fit to 88% of the safe width, about 745 px), then a 2 px sunset hairline drawn under the surname that leads into PROTAGONIST. The role ends flush with the surname's right ink edge, so the block reads as one justified unit. The hairline is the frame's one accent.
  - **Payoff (0.60 s, on the fireball):** a warm additive exposure hit centred on the fireball, a shake and punch on the footage, a 6 px RGB split on the lockup, and the surname rising in it. The fire's measured light then glows on the name for the whole hold.
  - **Exit (4.1 s):** the role blurs out, the hairline retracts, and both name lines leave as whole masked lines (0.06 s apart) with a 6 px blur and a late fade. Clean by 4.7 s.

There are no cards and no boxes. Legibility comes from placement (v0: a dark shirt under the collar; v1: low-left over a bottom scrim) and light. Each variant runs 5 s and has fully left by about 4.7 s, so it loops. Plate renders run the Look finishing layer (grain .16; vignette .5 on v0, .38 on v1).

## CONFIG (top of the `<script>` in `index.html`)

| Field | Variant | What it does |
|---|---|---|
| `first`, `last` | both | The name. v0: both lines in Archivo wide 800 at `block.size` (124 px), with `last` in the sunset gradient. v1: `first` is the small tracked line (`first1.size`, 64 px, wide 600) and `last` is the hero (`size` 190, shrunk until it spans at most `maxWidth`). Both shrink only if a line would pass the max width. |
| `role` | both | The tracked label (Archivo wide 600, pure white), such as "Protagonist": 28 px under the name in v0, 26 px at the end of the hairline in v1 (flush with the surname's right ink edge). Use real facts only (see `research/gta6/FACTS.md`). |
| `shots` | both | Mirrors the `<video>` tags: `id`, `src`, `start`, `dur`, `mediaStart`. v1 shots also take `push: [from, to]` and `origin` (a per-shot push; add more shots for a montage), plus an optional CSS `grade`. Edit `shots` and the tags together. |
| `push {from,to,origin}` | 0 | The slow push on the held shot. `origin` is in frame px, and the pin is mapped through it. |
| `track [[t,x,y]…]` | 0 | The subject's path on the unpushed clip, in frame px. Keys are eased with Catmull-Rom. One key gives a static pin. |
| `pinDy` | 0 | How far below the tracked point the pin sits (12 puts it on the collar band in the demo). |
| `block {left, roleBaseline, gap, size, maxWidth}` | 0 | `left` is the name's left edge. The callout's leg ends on the first glyph's ink edge, measured per name, so it sits flush over the stem. The lockup is anchored by the role's baseline (1458) and builds upward. The leg sits `gap` px above the name. |
| `leader {angle, ringGap, minLeg, draw, blur}` | 0 | The callout: diagonal angle from horizontal (58°), gap from the pin's centre (27), the shortest leg allowed (90 px), draw time (0.28 s, expo.out) and the directional motion blur on the drawing head (6 px). |
| `reveal {stagger, dur, seat}` | both | The masked char rise. In v0, the payoff time is computed from it: `last + (chars−1)·stagger + seat·dur`. |
| `sunset` | 0 | The surname gradient. |
| `payoff.light {at, color, peak, decay, radius}` | both | The exposure hit: its centre as frame fractions (put it on your shot's light: the sun, a fire, a lamp), its colour, its peak for exactly one frame (v0 0.9, v1 0.6), decay (power3.out) and radius in px. Plate only. |
| `payoff.leak {lead, dur, colors, opacity, y, from, to, size}` | 0 | The one light leak: starts `lead` s before the hit, sweeps from `from` to `to` (frame-width fractions) at height `y`. Keep it on your shot's sun side. Plate only. |
| `payoff` (other fields) | both | v0: `zoom` (1.05), `amp`, `snap` (ring scale on the hit), `pinPulse` (s), `sheen` (s), `bloom`. v1: `amp`, `zoom`, `chroma` (px). Shake and punch only play with footage. |
| `left`, `baseline`, `size`, `maxWidth` | 1 | The lockup's ink left edge (80; first name, surname and hairline share it), the surname's baseline (1392), its starting size (190) and fit width (760, 88% of the safe width). |
| `first1 {size, gap, spread}` | 1 | The first name: size (64), the gap from its baseline to the surname's cap top (24), and the per-glyph spread of its tracking-in (10 px). |
| `rule {below, gap, draw, min}` | 1 | The sunset hairline: px under the surname's baseline (32), the gap before the role (24), draw time (0.45 s, expo.out) and minimum length. Its length is computed: it runs from the left edge to the role. |
| `exit {dur, lineStagger, blur}` | 1 | The whole-line masked exit: duration (0.42 s), the delay between the two lines (0.06 s) and the blur (6 px). |
| `scrim {top, opacity, spot}` | 1 | Where the bottom scrim starts (760), its strength (.9), and the strength of the soft spot behind the lockup (.85). |
| `fire {end, glow, luma[]}` | 1 | The scene light on the name: `luma` is one 0–1 value per frame from t = 0 (the demo's is the measured fire brightness of the ramped s098 clip). It drives a warm glow (`glow` = its strength) until `end`. Set `luma` to `[]` or `end` to 0 for a clip without a dominant light. |
| `timing` | both | v0: `pin`, `leader`, `first`, `last`, `roleAfterHit`, `pulse`, `out` (the callout retracts at out+0.25 and the pin collapses by out+0.7). v1: `scrim`, `hit` (put it on your hardest beat; the surname rises there), then relative to `hit`: `first` (the first name's tracking-in, −0.12), `rule` (+0.3) and `role` (+0.62); and `out`. |

## Render

```bash
# transparent overlay (drop on your own clip)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o name-tag-leader.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o name-tag-lower.webm

# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -o name-tag-leader.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -o name-tag-lower.mp4
```

With `bg: "none"`, there's no footage, grain, vignette, exposure hit, leak, shake or fire light. v0 keeps a soft scrim spot behind its type, and v1 keeps its bottom scrim and lockup spot, as part of the graphic; both fade in and out with the tag, so the last frame is empty. The RGB split, sheen, pin pulse and bloom flare still play on the graphic.

## Use your own clip

- **Leader tag as an overlay:** set `track` to your subject's collar or shoulder in 1080×1920 px (one key for a still subject, a key every 0.2–0.5 s for a moving one). Keep `block.roleBaseline` so the lockup sits on a dark, calm area well below their chin. Keep `block.left` on the side where the callout can run from the collar without crossing the face. Render with `bg: "none"`.
- **Lower third as an overlay:** render v1 with `bg: "none"` and set `timing.hit` to the frame of your hardest beat (a cut, a blast, a door). The first name tracks in 0.12 s before it, the surname rises on it, and the hairline and role follow. To move the lockup, change `baseline` (the surname's baseline): the first name sits above it, the hairline and role below. Keep the area behind it dark and calm (a jacket, shadow, night).
- **Baked in:** change the `<video>` `src`, `data-start`, `data-duration` and `data-media-start` in `index.html`, and mirror them in `CONFIG.variants[n].shots`. Move `payoff.light.at` onto your shot's light source.
  - Never let `data-media-start + data-duration` run past the clip's end, or past a hard cut inside it. s098 cuts away at source frame 34 (1.13 s), so the demo's ramped clip only uses frames 2–33.
  - Put the hit on the frame where the action peaks. In the demo, the fireball starts blooming at 0.3 s, the ramp drops into ultra-slow at 0.58 s and the surname lands at 0.6 s.
  - Start a clip about 1/3 frame past a frame boundary (for example 0.01, not 0), so the render never alternates repeated and skipped frames.
  - Hold on a sharp, lit face. The longest hold should show the character clearly, not their back or a shadowed profile.
- **Slowing a short shot smoothly:** below about 0.8x, don't use `data-playback-rate`. Pre-render a motion-compensated clip instead (`mi_mode=mci`, never `blend`, which double-exposes hair and edges). This is how the demo clips were made:

  ```bash
  # v0: s018 from source frame 6, 1.85x slower (exactly 150 frames, 5.0 s)
  ffmpeg -i assets/shots/s018-lucia-gate-v.mp4 \
    -vf "trim=start_frame=6,setpts=PTS-STARTPTS,setpts=PTS*1.85,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" \
    -an -c:v libx264 -crf 14 -preset slow -g 15 -pix_fmt yuv420p assets/clips/s018-lucia-gate-slow.mp4
  # v1: a speed ramp on s098 frames 2–33: frames 2–9 at 0.4x (each source frame lasts 2.5 output frames), then
  # frames 9–33 at ~0.17x (5.85 output frames each), 153 frames / 5.1 s. setpts places each source frame by its index N.
  ffmpeg -i assets/shots/s098-jason-fireworks-v.mp4 \
    -vf "trim=start_frame=2:end_frame=34,setpts=(if(lt(N\,7)\,N*2.5\,17.5+(N-7)*5.85)/30)/TB,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" \
    -an -c:v libx264 -crf 14 -preset slow -g 15 -pix_fmt yuv420p -r 30 assets/clips/s098-jason-fireworks-ramp.mp4
  ```

  Keep clips in `assets/clips/`, because `assets/shots/` and `assets/plates/` are re-synced from `gta6/_shared`. If you re-slow v0's clip, re-track `track` on the new clip.

## Notes
- Plate renders refresh the film grain every frame with their own driver after `Look.install`. The kit's grain picker can land on the previous frame (GSAP's 6-decimal rounding against a `floor`), which repeats frames on still footage. Keep that block if you copy this component.
- Everything that moves on the leader (the pin and the callout, including its motion blur), the exposure hit, the fire light, the v1 hairline and the v1 per-shot push are computed from absolute time in `Look.drive`, so any frame renders correctly when seeked to directly.
- The v1 lockup is placed from measured metrics: canvas ink bearings for the left edges and cap heights, and the split DOM for the right edges (split glyphs are inline-blocks, so kerning is gone; VA alone is about 7 px at hero size). Change the names freely and the alignment holds.

## Keywords
name tag, character name, who is this, character intro, character reveal, lower third, broadcast lower third, hairline, kicker, leader line, elbow callout, callout, pin, tracked label, film credit, Jason Duval, Lucia Caminos, protagonist, GTA 6, GTA VI, trailer breakdown, Rockstar date style, sunset gradient, exposure hit, light flash, fire light, bloom, RGB split, slow motion, speed ramp, explosion, light leak, overlay, transparent
