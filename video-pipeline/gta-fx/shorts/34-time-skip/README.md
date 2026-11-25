# 34 · Time skip card

A full-frame bridge for a jump in time in a GTA 6 short ("3 hours later", "the next day", or stamping a real date such as the GTA 6 launch, Thursday, November 19, 2026). The time skip is carried by the edit itself:

- In **Time skip**, the hours pass through the light, cut by cut.
- In **Date card**, the calendar turns on the cut from night to morning.

Use it in story edits and compilations between two scenes, or as a chapter beat.

1080×1920, 30 fps, 5.8 s. Craft v2: 4K-sourced graded shots at 1.0×, the Look finishing kit (grain, vignette, exposure-pulse hit), with no cards and no tints.

## Variants
| `variant` | Name | What happens |
|---|---|---|
| `0` | Time skip | Full-bleed 9:16. Afternoon highway → **cut** golden-hour pier → **cut** sunset beach bar → **cut** night, with fireworks exploding behind Jason → club. A lockup sits low in frame on a soft floor of shadow:<br>• a giant numeral (Inter display 800, 440 px);<br>• "HOUR(S) / LATER" (Archivo wide 800, 100 px);<br>• "VICE CITY · 16:40" (tracked label).<br>The numeral counts **1 → 2 → 3** in its own clipped window, one step per cut. "HOUR" picks up its S on step 2, and the clock steps one hour per cut. On the night cut (2.1 s) the "3" lands in the Leonida sunset gradient with an exposure-pulse hit, a punch-in, a 5 px RGB whisper and a sheen. The lockup exits at 4.45 s (the numeral rolls up and out, the words drop into their masks), and the club plays on clean. |
| `1` | Date card | Letterbox: 16:9 shots in a 1080×608 band (y 656–1264) that opens like a shutter.<br>• Top black band: the day ("18"), Archivo wide 800 at 465 px.<br>• Bottom band: the weekday in Rockstar date style (white wide-tracked caps, soft magenta offset and bloom) over "NOVEMBER · 2026".<br>On the cut from Wednesday night (club) to Thursday morning (a plane over the Vice City "Downtown" signs, 2.0 s), the changed digit and the weekday roll like an odometer (**18 → 19**, **WEDNESDAY → THURSDAY**). The unchanged "1" turns sunset in place, and the band takes the exposure-pulse hit. The type exits into the band at 5.05 s, over the skydiver shot. |

## CONFIG (top of the script in `index.html`)
- `duration`: 5.8. If you change it, also change `data-duration` on `#root` and `#ov`.
- `sunset`: the gradient used for the landing numeral.
- `variants["0"]` (Time skip)
  - `count`: the numerals shown on each cut (`["1","2","3"]`). The last one is the payoff and lands in sunset.
  - `unit`, `plural`, `later`: the words ("Hour", "s", "Later"). Try "Day" / "s" or "Minute" / "s".
  - `place`: the label's place ("Vice City").
  - `clock`: the time before the skip, then one entry per cut. Only the hour's last digit may change, because that digit is the odometer.
  - `cuts`: the cut times [hour 1, hour 2, payoff]. Keep them on whole frames (multiples of 1/30 s) and equal to the `data-start` of the matching `<video>`.
  - `shotStarts`: the start of every shot (documentation, and the per-shot push).
  - `out`: when the lockup exits.
- `variants["1"]` (Date card)
  - `day`: `[before, after]`. Digits that change roll; digits that stay the same cross-fade into sunset.
  - `weekday`: `[before, after]`.
  - `month`, `year`.
  - `roll`: the cut, roll and hit time. It must equal the `data-start` of `<video id="v1b">`.
  - `nudge`: an optical centring offset for the day numeral in px (−6 for "19", because Archivo's "1" has a wide left bearing).
  - `shotStarts`, `out`.

## Render
```bash
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o time-skip.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o date-card.mp4
# bg "none": still shows footage (this is a full-frame bridge), but without the grain and vignette finishing,
# for when you grade the whole edit yourself
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' -o date-card-clean.mp4
```

## Swap in your own clips
1. Put your clips in `assets/`. Use 9:16 for Time skip (`-v` style) and 16:9 for Date card (the band is 16:9).
2. In `index.html`, change the `src` of the `<video>` tags: `v0a`–`v0f` (Time skip) or `v1a`–`v1c` (Date card). Use `data-media-start` to pick the in-point, and keep `data-start` + `data-duration` inside your clip's length. A frozen last frame is a defect.
3. If you move a cut, update `CONFIG.variants[...].cuts` / `roll` / `shotStarts` to match, so the numeral steps and the hit stay on the cut.
4. Cast the light on purpose for Time skip: afternoon → golden → sunset → night is what makes the count read. For Date card, use a night shot before the roll and a bright morning shot after it.

## Keywords
time skip, hours later, 3 hours later, the next day, date card, calendar, odometer roll, day rollover, letterbox, scene transition, interstitial, chapter beat, clock, Vice City, November 19 2026, GTA 6 release day, Leonida sunset, Rockstar date style, exposure hit, story edit, compilation
