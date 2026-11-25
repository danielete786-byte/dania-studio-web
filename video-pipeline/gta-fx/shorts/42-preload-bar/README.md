# 42 · Pre-load progress (`preload-bar`)

A diegetic hook for GTA 6 release shorts. It shows a neutral, unbranded launcher-style download card for **Grand Theft Auto VI**.

What happens:
1. The card opens already at **97%** and ticks **98 → 99**, then holds on 99 for a beat before **100**. The holds stay live: a highlight sweeps along the fill (or a comet runs along the ring) every 0.9 s.
2. At 2.75 s the **100** slams (1.12 → 1 in 3 frames), one light sweep crosses the bar or laps the ring, and the card lands on **"Ready to play"**. The date line turns to **"Available now"** (and in Bar the kicker turns from PRE-LOAD to **INSTALLED**).
3. **Play** gets a controller-style press at 4.36 s: it scales 1 → 0.96 → 1 with an inner highlight flash. There's no mouse cursor, because GTA 6 launches on PS5 and Xbox Series only.
4. The card drops away (scale 0.97, expo.in) from 4.55 s.

Use it in the first 2–3 seconds of a release-day or pre-load short ("after 13 years of waiting…"), then cut to gameplay on the press. It's our own UI, with no console, store or Rockstar branding and no GTA VI logo.

1080×1920, 30 fps, 5.0 s. Overlay component: it works over the sample plate or as a transparent overlay.

## Variants
| `variant` | Name | Look | Payoff |
|---|---|---|---|
| `"0"` | **Bar** | Smoked-glass card in the upper third (y 352): a soft-sunset "GTA 6" tile, PRE-LOAD kicker, title, unlock date, a 190 px percent odometer, a 24 px sunset progress bar with a breathing bright leading edge and a sweeping highlight, and a mono speed / ETA row | The 100 slams and a light sweep crosses the bar. The bar then grows into a sunset **Play** button. A 44 px "✓ Ready to play" appears left of the numeral, on its baseline. The kicker becomes INSTALLED and the date becomes "Available now". A sheen crosses Play, then Play is pressed |
| `"1"` | **Ring** | Ink-navy glass launcher panel pinned at the top (y 230–1113): a left-aligned tile, title and date header, a 426 px progress ring (26 px stroke) with a 180 px percent inside and a comet highlight riding the arc, a 44 px "Downloading · 0:03 left" status with a live ETA, and a faint empty slot where Play will appear | The 100 slams, the ring pops 1→1.04→1 and a light band laps it. The status becomes a 44 px "✓ Ready to play" and the date becomes "Available now". The empty slot lights up as a paper-white **Play** pill. A glint laps the ring, then Play is pressed |

Both cards are 768 px wide (x 156–924) and stay inside the 936 safe edge at the end of the push-in. The ring arc (or the bar and its button) is the only pink→amber element in the frame. The tile uses DESIGN's pale soft-sunset card backdrop.

`bg`: `"plate"` shows the sample footage (p01, the Keys sign then the marina then the jet ski) under a light vignette. `"none"` renders only the card on a transparent background. Both cards are 86% opaque glass, so a hint of your clip shows through.

## Timeline (default `timing`)
| Time | Event |
|---|---|
| 0.12 s | The card blurs in already at 97% |
| 0.42 s | Rolls to 98. The live highlight starts (every 0.9 s) |
| 1.3 s | Rolls to 99 (held 1.2 s for the tension, highlight still running) |
| 2.5 s | Rolls to 100; the fill closes; the ETA reaches 0:00; the highlight fades |
| 2.75 s | The 100 slams, the light sweep runs (0.35 s), then "Ready to play", "Available now" / INSTALLED, and the Play state |
| 3.45 s | One ready sheen across Play (Bar) or glint around the ring (Ring) |
| 4.36 s | Play is pressed (1 → 0.96 → 1 in 140 ms, plus an inner flash) |
| 4.55 s | The card drops away (0.35 s, expo.in) |
| 5.0 s | End |

## CONFIG (top of the script in `index.html`)
- `game.title`: the game name on the card (`"Grand Theft Auto VI"`).
- `game.tile`: the text on the square tile (`"GTA 6"`, in our own type on the soft sunset backdrop).
- `progress`: the percent states. The card enters showing the first value, and each later value ticks in at `timing.ticks[i]`. The default is `[97, 98, 99, 100]`. Keep one more value than there are ticks.
- `variants["0"|"1"]`:
  - `plate`: the sample clip used when `bg` is `"plate"`. It must match the `src` of a `<video class="plate">`.
  - `kicker` and `kickerDone` (Bar only): the small caps label above the title while installing (`"Pre-load"`) and at 100% (`"Installed"`). A hyphen in it keeps tight spacing.
  - `sub`: the date line under the title (Bar `"Unlocks Nov 19, 2026"`, Ring `"Launches November 19, 2026"`).
  - `subDone`: what the date line turns into at 100% (`"Available now"`), so it never contradicts the Play button.
  - `status` and `done`: the label while installing (`"Installing"` / `"Downloading"`) and the label at 100% (`"Ready to play"`). Ring shows its status as "Downloading · 0:03 left".
  - `cta`: the Play button label.
  - `speedMBs` (Bar only): the demo speed in the meta row.
  - `etaStart` (both): the seconds left shown on entrance. The ETA counts down to 0:00 as the last tick lands (Bar: in the meta row; Ring: in the status line).
  - `cursor`: an optional mouse arrow, **off by default** (`show: false`) because the game is console-only at launch. If you set `show: true` (for example, for a future PC version), it waits at `rest`, glides during `timing.move` and clicks at `click`. Both are in card pixels from the card's top-left.
- `timing`:
  - `in`: card entrance.
  - `ticks`: when each later percent rolls in.
  - `step`: the fill ease per tick.
  - `live`: the cycle of the live highlight while downloading (0.9 s).
  - `done`: the 100% beat (slam, light sweep, status swap, Play state).
  - `glint`: the one ready sheen or glint.
  - `click`: the press.
  - `move`: the optional cursor's glide (only used when `cursor.show` is true).
  - `out`: when the card starts to drop away.
  - `end`: clip end. If you change `end`, also change `data-duration` on `#root`, `#plateA` and `#ov`.

## Render
```bash
cd gta6/42-preload-bar
# transparent overlay for CapCut / Premiere (WebM with alpha)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o preload-bar.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o preload-ring.webm
# over the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o out.mp4
```

## Use your own clip
- **Easiest:** render with `bg: "none"` to WebM and lay it over your clip in the editor. Cut to your gameplay on the press at 4.36 s, or as the card drops away at about 4.8 s.
- **Inside the composition:**
  1. Drop your 1080×1920 clip in `assets/plates/`.
  2. Set the `src` of `<video id="plateA">` to its path.
  3. Set `CONFIG.variants[...].plate` to the same path.

  The script shows the video whose `src` equals the variant's `plate`. To give each variant its own clip, add a second `<video class="clip plate">` with a unique `id` and the same `data-start`, `data-duration` and `data-track-index`. Keep each clip at least 5.0 s long.

## Keywords
gta 6 pre-load, download bar, installing, progress bar, progress ring, 97 percent, 99 percent, 100 percent, ready to play, installed, play button, button press, console launch, ps5, xbox series, release day, launch hook, diegetic UI, loading screen, november 19 2026, grand theft auto vi, overlay, transparent
