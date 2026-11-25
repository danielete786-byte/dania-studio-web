# 05 · GTA 5 vs GTA 6 split

A full-frame 9:16 comparison: a GTA V clip and a GTA VI clip in one vertical frame, titled in cinematic wide type, with small tracked labels ("2013 · LOS SANTOS" / "2026 · LEONIDA"). The type tells the upgrade: "GTA V" is the smaller name in 86% white, "GTA VI" the big one in the Leonida sunset gradient. The demo edit cuts like-for-like pairs from both trailers, and both sides always switch on the same frame. GTA 6 arrives as the hit, and the seam between the eras is the light source. On the payoff a specular glint runs along it and it blooms warm, with an exposure flash, shake and RGB split, the year rolling 2013 → 2026 (blurred while it rolls, so no wrong year is ever readable), then a sheen. Every later cut gets its own smaller beat: the glint re-runs the seam and the place labels swap to name what that pair compares. 1080×1920, 30 fps, 5.9 s.

**Use it for:**
- "GTA 5 vs GTA 6" graphics, physics, NPC, car and map comparisons;
- "13 years later" or "then vs now" beats in compilation shorts;
- any A/B where viewers must know at a glance which half is which game.

## Variants
| `variant` | Name | What it does |
|---|---|---|
| `0` | Stacked | GTA V on top, GTA VI below a crisp line of light at y=860 (the centre of the safe zone). "GTA V" rises out of the seam. On the first cut (0.867 s) the seam flares and "GTA VI" drops from it in the Leonida sunset with the hit, so both names read inside about 1 s. Four matched pairs: sunset silhouettes, red convertible, landmark sign (Vinewood / The Keys) and city (skyline / Vice City highway). On each later cut (2.133, 3.167 s) the glint re-runs the seam and the labels swap: LOS SANTOS / LEONIDA → VINEWOOD / LEONIDA KEYS → LOS SANTOS / VICE CITY. A small flash marks the 3.167 s cut. At 5.0 s the names sink back into the seam and the seam retracts, just as an airliner descends into the Vice City half: the last half-second is the plane. |
| `1` | Diagonal reveal | GTA V owns the frame ("GTA V" top-left). At 0.45 s a blade of light slashes up from the bottom-right and parks high, so GTA VI gets two thirds of the frame, with the hit ("GTA VI" bottom-right) and a glint running up the blade. Both names read inside the first 0.65 s. A skydiver steps off over Vice City and is spread-eagle by the hero frame (held to 2.05 s). Matched pairs: skyline / skydive over Vice City, then the Los Santos skyline at dusk / the sunset dock (both at 0.68x, the dock framed low so its string lights and cloud edge run under the blade). On the 2.05 s cut a smaller glint runs up the blade and the GTA VI place swaps VICE CITY → LEONIDA. "GTA V" stays pinned at x=72 while the footage pushes and punches (it is counter-transformed). At 3.85 s the blade sweeps on through, wiping GTA V and its name off the frame, the dock shot rises back into frame with it, and the GTA VI title glides to a centred end card over a soft spot scrim. The card lands on its own cut at 4.6 s (Lucia and Jason on the pier at golden hour) and blurs out at 5.5 s, so the last frames are clean footage. |

`bg: "none"` turns off the finishing stack (grain, vignette, flashes, leak). Footage always shows, because the split *is* the footage.

## CONFIG fields
- `duration`: seconds (also change `data-duration` on `#root`).
- `sunset`: the GTA 6 name's gradient.
- `type`: the size hierarchy.
  - `bWidth`: the GTA 6 name is fitted to this width (744 = 86% of the 864 px safe width; clamped 110–200 px).
  - `aRatio`: the GTA V name's size as a fraction of GTA 6's (0.7).
  - `aMin`: GTA V's size floor in px (112). GTA V is also capped at 70% of the safe width, for long names.
- `light`: the seam's light moment.
  - `color`: the bloom colour.
  - `peak` / `rest`: bloom strength at the hit and when settled (rest 0.08 keeps the settled seam a crisp line; a variant can override it with `lightRest`).
  - `alpha`: the settled line's white alpha.
  - `sweep`: the glint's run time.
  - `decay`: the bloom's fall-off time.
- `cutLight`: `peak` / `decay` of the smaller glint on every later paired cut.
- `swap`: seconds for the place-label swap on a cut (the old place lifts out with blur, the new one rises in sharp).
- `a` / `b`: `name` ("GTA V"), `year` ("2013"); `b.countFrom` is the year the GTA 6 label rolls up from (`null` = no roll), in `b.roll` seconds.
- `variants["0"]` (stacked):
  - `seam`: y of the line of light.
  - `payoff`: the cut GTA 6 lands on.
  - `flashCuts`, `flash`: extra small flashes on these cuts (plate renders only).
  - `exit`: when the names sink back into the seam (default `duration - 0.75`).
  - `pairs`: the edit.
- `variants["1"]` (diagonal):
  - `seamLeftY`, `seamRightY`: where the parked blade meets the frame edges.
  - `reveal`: blade-in time, which is also when GTA 6's first shot starts.
  - `takeover`: when the blade sweeps on through and the GTA 6 title rises to the end card. Give each pair at least ~1.6 s before it.
  - `endY`: the end card's vertical centre in px.
  - `aEnd`: when the GTA V side stops (after it is covered). The wedge is fully wiped about 0.4 s after `takeover`, so the last GTA V shot must run at least that long.
  - `lightRest`: the blade's settled bloom (0.2, a little warmer than the stacked seam).
  - `R`: the right edge of the GTA 6 lockup in px (918). `lblInset` pulls the tracked label in so its ink ends under the "I" (measured ink edge x=894, inside the 936 safe line).
  - `cardOut`: when the end card blurs out (`null` = hold to the last frame).
  - `payoffDecay`: the payoff bloom's fall-off (ends before the next cut's glint).
  - `pairs`.
- `pairs`: one entry per cut, `{ at, places, a: { clip, start, focus }, b: { clip, start, focus } }`.
  - Diagonal only: a pair with just `b` (no `a`) is a GTA 6-only cut after the takeover, e.g. the end card's own shot (`at: 4.6` in the demo). The GTA V side's last shot then runs to `aEnd`.
  - `at`: when this pair starts. Both sides cut here on the same frame.
  - `places`: `[GTA V place, GTA 6 place]` shown in the labels while this pair is on screen. When a pair's place differs from the pair before, the label swaps on that cut. Use real places only.
  - `start`: the clip's in-point in seconds (skip slates, ratings and your clip's own cuts).
  - `focus`: CSS object-position, e.g. `"62% 50%"`, to frame the subject.
  - Optional `rate`: playback rate (e.g. `0.68`) to stretch a short shot. It repeats frames, so keep it at 0.6 or above (lower judders; pre-slow instead). The shot uses `duration × rate` seconds of source.
  - Optional `y`: px offset for that one shot.
  - Optional `rise` (diagonal, GTA 6 side): seconds for a shot framed low with `y` to climb back to 0 as the takeover starts. Its empty top strip stays hidden behind the parked blade (keep `y` under `seamRightY`, 220), and a `rise` of about 0.25 s stays ahead of the sweep. The demo's dock shot uses `y: 200, rise: 0.25` to put its string lights under the blade.
  - Optional `box: [top, height]`: size the shot to a band instead of the full frame. In the diagonal, the GTA V side only has to cover the wedge above the blade, so `box: [0, 1000]` shows a 16:9 shot at 0.93x (sharper, with the whole skyline above the blade) instead of a 1.78x full-height crop. Keep `top` at 0 and `height` past the blade's left end (860).
  - Optional `zoom` + `origin`: scale the shot from that point (default the top edge). Stacked halves fit their height exactly, so vertical `focus` does nothing there; zoom from `"50% 100%"` to lift a subject away from the seam.
  - Optional `grade`: a CSS filter for that shot, e.g. `"contrast(1.12) saturate(1.08)"` to lift a hazy shot.
  - Optional `scrim` (stacked, GTA V side): 0–1 extra bottom scrim under the label for that pair, for busy shots.

## Render
```bash
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -o split-stacked.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -o split-diagonal.mp4
# same edit without grain/vignette/flash/leak (for your own grade):
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' -o split-clean.mp4
```

## Swap in your own clips
1. Drop your clips in `assets/` (16:9 1920×1080 or larger works best; the stacked halves crop to cover). For the diagonal, a vertical 1080×1920 clip for the GTA 6 side is sharpest.
2. In CONFIG, edit the variant's `pairs`: one pair per cut, with the same `at` on both sides. Use as many or as few pairs as you like. With one pair, nothing cuts.
3. Mirror each pair on the matching `<video data-side="a0|b0|a1|b1" data-shot="N">` tag:
   - `src` = `clip`;
   - `data-start` = `at`;
   - `data-media-start` = `start`;
   - `data-duration` = the next pair's `at` minus this `at`, or the end.

   The script also corrects these from CONFIG at load. To add a shot, copy a `<video>` in the same side with a new `id` and the next `data-shot`. Never let `start` + duration run past your clip's length.
4. Nudge `focus` so the subject sits away from the names. Stacked: keep faces out of the 200 px either side of the seam. Diagonal: the GTA V subject must sit high in its shot (the upper-left wedge is the top ~30% of the frame), or use `box` to shrink the shot into the wedge; keep the GTA 6 subject between the blade and the name (`y` or a top-origin `zoom` moves it). Grade the two sides apart if both shots share a palette (e.g. two sunsets): `grade: "saturate(.62) contrast(1.12) brightness(.94) hue-rotate(-10deg)"` fades the older game.
   - Every shot must cover its whole slot: `start + (next at − at) × rate` must stay inside the clip. In the diagonal, the GTA V side's last shot runs to `aEnd`, and the GTA 6 shot under the takeover runs to the end-card cut. For a short clip, use `rate` down to 0.6, or add a GTA 6-only pair (`b` only) to cut the end card onto a fresh shot.
5. Watch for bright subjects crossing the small labels during the hold (a white plane, sky glare). Move the in-point or `focus` so they pass after `exit`, as the demo does with the s011 airliner.
6. Comparing other games? Change `a.name`/`a.year`, the places, and `b.countFrom` (e.g. "San Andreas", "2004").

## Keywords
gta 5 vs gta 6, gta v vs gta vi, comparison, split screen, then vs now, 13 years later, matched shots, synced cuts, stacked split, vertical split, diagonal wipe, blade reveal, takeover transition, wide type, sunset gradient, year roll, versus, 9:16
