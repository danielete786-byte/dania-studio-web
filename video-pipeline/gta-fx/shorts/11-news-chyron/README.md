# 11 · News chyron

A TV news break-in for leak, rumour and news segments in GTA 6 shorts. It comes from our own fictional station, **VCN · Vice City News**, not Weazel. It frames a clip as breaking or live news, the way top parody shorts use the Weazel chyron and Rockstar's own MEGA NOTICIAS segment, but built as a clean broadcast package. The bands are flat and hard-edged, bleed off the left edge of the frame, and use type at title scale.

Use it over the clip that carries the news beat: a release-date reminder, a leak, a record, or a "people are calling in sick" story.

## The variants

**Variant 0 · Breaking bar**
- Opens on a network "special report" wipe. A full-height red slab parks over the footage (tinted police blue), carrying the VCN logo box and SPECIAL REPORT, then sweeps on to the right.
- The shots cut under the slab, and its trailing edge uncovers the daylight footage. A full-bleed chyron chases it in and locks with a slam on "TOMORROW", with shake, punch, an exposure hit and a small RGB split. It has four parts:
  - a VCN logo box (the network bug: mark, red underline, clock cell) sitting on the bands as a tab;
  - a red band with BREAKING NEWS and a blinking square;
  - a paper slab with a two-line 120 px headline;
  - an ink deck strip with a deck line that changes on the cuts.

**Variant 1 · Live + ticker**
- A LIVE bug sits top-left, with a breathing dot, the location and a clock that ticks every second.
- Below it is a blue slab with a red top rule. Its "1.5M" spins on reels and slams to a stop on the first cut, locked up with EXPECTED / TO CALL / OUT SICK and a quieter subline.
- A paper ticker crawls behind a VCN label.

## Layout and timing

- **Canvas:** 1080×1920, 30 fps, 7 s.
- **Position:** the chyron sits at y 916–1446 (v0, logo box included) or 1040–1434 (v1). It bleeds off the left edge and stops at x 936, clear of the like/share rail.
- **Safe zone:** every glyph is inside x 72–936.
- **Exit:** both variants slide out to the left (v0 from 6.5 s, v1 from 6.42 s), so the clip loops cleanly.

## CONFIG (top of the script in `index.html`)
| Field | What it does |
|---|---|
| `network.mark` | Station mark ("VCN"), shown in the v0 logo box (the stinger and the chyron), the v0 tonal texture and the v1 ticker label |
| `variants[v].shots` | The `<video>` ids this variant shows. The cut points are the `data-start` / `data-duration` / `data-media-start` on those tags. |
| `variants[v].push` | `[from, to, endScale]` slow push for each shot |
| `["0"].stinger` | `lines` (e.g. `["Special", "Report"]`, auto-fit up to 108 px); `cut`, when the shots cut under the wipe (it must cover the whole frame then); `clear`, when its trailing edge leaves the frame |
| `["0"].hit` | The payoff: the paper slab locks and the last headline line slams in |
| `["0"].tag`, `clock` | Red band label, and the clock shown in the logo box's clock cell |
| `["0"].headline` | 1–2 lines at 120 px Archivo; auto-fits an 832 px measure, minimum 88 px. The last line slams on `hit`. |
| `["0"].subs`, `swaps`, `out` | Deck lines, the times they swap (put them on your cuts), and the exit start |
| `["1"].live`, `location`, `clock` | LIVE bug text, and the clock start `{h, m, s, suffix}`. The clock ticks every second. |
| `["1"].figure` | The hero figure ("1.5M"). Its digits spin on reels; other characters stay static. |
| `["1"].words` | Three short lines locked up beside the figure (auto-fit to the space left) |
| `["1"].sub` | Subline under the lock-up |
| `["1"].slam` | Time the last reel stops: flash, shake, scale punch and RGB split. Put it on a cut. |
| `["1"].ticker` | Short ticker items. The first one should fit the 670 px window (about 28 characters). |
| `["1"].tickerOpenAt`, `tickerReadAt`, `tickerSpeed` | The ticker lands with the last item whole at the left edge at `tickerOpenAt`, and reaches the first item at `tickerReadAt`. The speed is solved from those two times and clamped to `tickerSpeed` `[min, max]` px/s. |
| `look.grain`, `look.vignette` | Finishing strength (plate renders only) |
| `timing.out`, `end` | Exit start and composition end |

## Render
```bash
cd gta6/11-news-chyron
# transparent overlay to drop on your own clip in CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o breaking.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o live-ticker.webm
# with the sample footage and the finishing layer
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -o out.mp4
```
With `bg: "none"` there is no grain, vignette, exposure hit, shake or duotone. In variant 0 the red wipe still parks and sweeps over your clip, so the break-in reads, and the chyron bands are opaque, so they read on anything.

## Swap in your own clip
- **Easiest:** render with `bg: "none"` and layer the WebM over your clip.
- **To bake it in:** put vertical clips (1080×1920) in `assets/shots/` and change the `src` on the variant's `<video>` tags (`a1`–`a5` for variant 0, `b1`–`b4` for variant 1).
  - Keep each `data-duration` within the clip's length minus its `data-media-start`.
  - Move `stinger.cut` (the `a1` → `a2` cut, while the wipe covers the frame), `hit` / `slam` and `swaps` onto your own cut points.
  - Cast shots whose subject sits in the top two thirds, so the chyron falls on road, car interior or roofs.

## Keywords
news chyron, breaking news, special report, network open, broadcast wipe, logo box, lower third, broadcast package, news stinger, break-in, live bug, live tag, news ticker, crawl, TV news, Weazel-style, MEGA NOTICIAS, in-world news, Vice City News, VCN, station bug, number slam, slot reel, leak, GTA 6 news, release date, call out sick, headline bar
