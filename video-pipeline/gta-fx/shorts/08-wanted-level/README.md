# Wanted level (#8, GTA HUD kit), craft v2

Five wanted stars light one by one, 1 → 5, as a clip escalates. Each star lands on a beat. The fifth lands on the big hit, the frame the police SUV's nose lifts off the road. Then the whole flip plays at full speed under the maxed row, on a slow 1.08 push. The hit takes:
- a 2-frame hot-white exposure;
- shake and a punch zoom;
- an RGB split;
- a lens streak across the whole star row;
- hard red/blue police light.

The star fills stay white. The police colour lives only in light: the top-corner washes and the stars' own bloom, which turn red and blue together in 4-frame steps.

A flat oxblood reason badge (witness, 911 call, shots, vehicle, helicopter) joins under each new star. The stars and badges are our own drawing, after the sparse star row and red reason badges in the GTA VI gameplay HUD:
- **Stars:** a 2 px dark keyline, faint facets, a lit top edge and a bloom.
- **Badges:** flat `#8E1620` discs with a 2 px `#3A0A0E` rim and 2.5 px stroke glyphs.

**Use it when** a GTA 6 short escalates: a chase, a "5 stars in 6 seconds" clip, or a compilation where every cut gets wilder. Put each star on a beat (a cut, a crash, gunfire) and the fifth on the biggest one. The HUD corner variant also works as a "real-life GTA" overlay on live-action footage.

## Variants
| `variant` | Name | What it is |
|---|---|---|
| `0` | HUD corner | **Diegetic.** The game HUD at phone scale, top right. 104 px stars on a 42 px gap (row x 242–930, top y 252) light from the right, as in the game. Empty slots are the game's dim star: a .25 white body under a dark rim. Stars 1–4 do the game's double blink, and a 64 px badge blurs in under each new star. Star 5 ignites bigger (1.6 → 1), and a lens streak crosses the row. **Exit:** the stars un-fill right to left, 40 ms apart, each badge drops with its star, and the empty row blurs up and out. A soft corner scrim keeps the HUD legible on bright footage. No type: the game HUD has none. |
| `1` | Centre hero | **Full-bleed lockup.** One unit up top, over a soft top scrim:<br>• a tracked "WANTED LEVEL" label (y 262);<br>• a two-line white level title (Archivo 800 at 132 px, width 112%, y 306–554);<br>• a 112 px star row (56 px below WANTED, y 610–722);<br>• 72 px badges (y 746–818).<br>The title changes through a masked roll: SUSPECT SPOTTED → SHOTS FIRED → MOST WANTED. MOST WANTED starts rising just before the hit, so it slams onto the flash frame with star 5. WANTED takes a 2-frame red or blue offset ghost on each police-light step. |

Both variants run 6.1 s. The full row holds from 4.5 s while the SUV flips; then it exits (v0 from 5.50, v1 from 5.58) and is gone by about 6.05 s. The last frame is clean, so the clip loops.

## CONFIG (top of the `<script>` in `index.html`)
| Field | Meaning |
|---|---|
| `stars` | Five times in seconds, one per star. Default `[0.40, 1.30, 2.35, 3.20, 4.50]`. Move them to your clip's cuts and hits. |
| `reasons` | Five reason badges, in fill order. Glyphs: `witness` (eye), `call` (handset with call waves), `shots` (crosshair), `vehicle` (police car), `heli`. |
| `strobe` | The police light after the fifth star. It runs `from` (4.50) to `to` (5.50), then fades over `fade` (0.30). Red and blue alternate in `stepFrames` (4) frame steps; `shape` is a step's per-frame intensity, and `first` is the colour on the hit. It drives the corner washes (footage renders only) and the colour of the stars' bloom (both renders). |
| `starLight` | The lit stars' bloom: white at `rest` (0.5), police-coloured at `police` (0.6) while the strobe runs; both spike ×`spike` (1.6) on the hit and settle over 0.9 s. |
| `variants[*].strobePeak` | The red and blue corner-wash peak opacity (v0 `.95/.95`; v1 `.8/.8`). |
| `variants["0"].unfill` | The HUD corner exit: stars un-fill from `at` (5.50), one every `stagger` (0.04 s), each over `dur` (0.1 s), star 1 (rightmost) first. Each badge drops with its star. |
| `variants["0"].exit` | Then the empty row blurs out: `at` (5.68), `dur` (0.3), `blur` (6 px), `y` (−12 px), `stagger` (0.012). |
| `variants[*].hit` | The fifth-star exposure (footage renders only). `shot` is the video playing at the hit. `flash` is overlay-white on the hit frame (half on the next). `exposure` is a brightness kick that decays over 4 frames. `grade` is that shot's resting filter and must match the `#d0, #d1` CSS rule. |
| `variants["1"].label` | The small tracked label above the title (default "Wanted level"). |
| `variants["1"].names` | Two-line titles, e.g. `["Shots", "fired"]` (default three). |
| `variants["1"].titleAt` | Which star (index 0–4) each title lands on (default `[0, 2, 4]`). Keep at least 1.4 s between titles. |
| `variants["1"].slamLead` | How early the last title starts rising before the fifth-star hit (0.16 s), so it's up on the flash frame. |
| `variants["1"].titleMax` | The widest a title line may be, in px (default 780). The size steps down from 132 px if your longest line is wider. |
| `variants["1"].ghost` | WANTED's offset ghost on five stars: `px` (3), `frames` per step (2), for `dur` (0.6 s). |
| `variants[*].shots` | Documents the sample cut list. Edit the matching `<video>` tags to change it. |
| `newStarBlink` | HUD corner: the step length of the double blink on stars 1–4 (default 0.1 s, 3 frames). |
| `payoff` | The fifth-star hit: shake `amp` (12 px), punch `zoom` (1.045), `chromaPx` (12). |
| `pushes` | A slow push-in per shot, per variant: `[start, duration, fromScale, toScale]`. From the hit, `s119` pushes on to 1.08. |
| `pushOrigin` | Where the pushes aim (`42% 34%`, toward the flip). |
| `timing` | `out` (Centre hero exit start, 5.58 s), `outDur` (0.42 s), `end` (6.1 s). If you change `end`, also change `data-duration` on `#root` and `#ov`, and keep the exits finishing on or before the last frame. |

Star geometry (inner radius .40, keyline, facets, shade) is in the star block of the CSS and the star-path code (`const D` in the script). Sizes and gaps are in the `.v0` / `.v1` CSS rules.

## Render
A transparent overlay to drop on your own clip in CapCut or Premiere (no grain, vignette, corner washes or flashes; the stars still take the red/blue bloom):
```
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o wanted-corner.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o wanted-hero.webm
```
In `bg:none`, the HUD corner keeps its corner scrim and the Centre hero keeps its top scrim, both at half strength.

With the sample footage and the finishing layer:
```
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o wanted-corner.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o wanted-hero.mp4
```

## Use your own clip
The sample edit uses official trailer shots from `assets/shots/` and is for local preview only. Both variants are full-bleed vertical, and every shot plays at 1×.
- **HUD corner:** `s014` police lights → `s096` patrol car → `s113` Lucia firing → `s119` (`#d0`) from the gunman firing on the charging SUV, through the flip, to the end.
- **Centre hero:** `s096` → `s014` → `s119` (`#d1`), unbroken from 2.35 s.

**Why no slow-mo.** The trailer footage is 30 fps. Slowing it either repeats frames (a visible stutter) or invents them (ghosting or smearing on fast game motion). So the hit lands on a real frame, and the action plays on at full speed. If your clip is 60 fps or higher, a slow-mo hold after the hit works well; set `data-playback-rate` no lower than your frame-rate ratio (0.5 for 60 fps).

To bake in your own footage:
1. Change `src`, `data-start`, `data-duration` and `data-media-start` on those tags. Never run a clip past its length.
2. Move `CONFIG.stars` onto your cuts, and the fifth onto your biggest hit.
3. Update `CONFIG.pushes` and `hit.shot`.

Per-shot CSS (remove it if you swap the clips):
- `#a0` is scaled 1.1 from the top so the black car roof sits behind the empty slots.
- `#c0` (v0) drops Lucia's eyes below the badges.
- In v1, `#a1` and `#b1` are scaled from the top so faces sit below the lockup.

The simplest route is to render `bg:none` and lay the WebM over your edit.

## Keywords
gta 6, gta vi, wanted level, wanted stars, five stars, 5 stars, star blink, reason badges, police, cops, chase, pursuit, shots fired, most wanted, police lights, red and blue, strobe, police bloom, hud, game hud, overlay, full bleed, title lockup, escalation, car flip, impact, rgb split, exposure flash, lens streak, bloom, star un-fill, lost the cops, real life gta, vice city, leonida
