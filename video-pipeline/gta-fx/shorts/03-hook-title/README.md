# 03 · Hook title

The opening hook of a GTA 6 short: the line that tells the viewer the payoff before they swipe ("GTA 6 details nobody noticed", "What you missed"). Put it on the first 1–3 clips of a compilation, breakdown or listicle.
- It lands with the first cut, and its keyword hits as the payoff on that cut.
- It reads within about 0.5 s.
- It holds while your footage keeps cutting underneath, then clears with a designed mask-out at `timing.out`.

| Variant | Look | Use it when |
|---|---|---|
| `0` Boxed lines | The TikTok text box, made an object. Warm paper slabs with room around each line (40 / 24 px), TikTok's merged corners, a 1 px lit top edge and a soft plum-black contact shadow under the whole stack: a 72 px lead-in tab over two ~196 px lines of Inter 800 display. Each slab wipes in on a straight edge with motion blur, carrying its line up inside it. On the first cut the keyword's slab slams 1.12 → 1 as it fills with the Leonida sunset (pink → amber) behind a hot light edge. There's an RGB split, a flash, a punch-zoom and a light leak on the footage. Then its light falls outside it: pink off its left end and amber off its right, screened onto the image, plus a bounce on the paper next to it. A sheen crosses it, and it re-hits on every later cut while the stack pushes in. | Casual or reactive compilations, "details nobody noticed", listicles. |
| `1` Official caps | Rockstar's own card language set in the image. A white tracked kicker with the magenta offset sits above wide Archivo caps: "WHAT YOU" (about 104 px, white) and "MISSED" (about 153 px, sunset), locked to one measure. The lockup is set left at x 96 in the sky of full-bleed footage, over a soft plum sky grade. The hook reads by 0.5 s. MISSED slams in on the first cut (flash, shake, RGB split) while an anamorphic light streak travels across just above its caps, then its light comes up on the footage: the bloom is screened onto the image, each letter in its own fill colour. A source stamp bottom-left ("— FEATURES TRAILER · 0:43") names the trailer and time of the shot on screen and rolls on every cut. | "Trailer breakdown", "what you missed", news and premium shorts. |

As a transparent overlay (`bg: "none"`) you get the type only. There is no footage, grain, vignette, flash, leak, light streak, night paper, stamp, stamp spot, bottom smoke or top smoke. The slabs and caps keep their own shadows, glow, RGB split and sheen; Boxed lines' bloom runs at half strength (`bloom.none`). Official caps also bakes in a soft top smoke (`scrimNone` 0.45), so the white caps hold up on pale clips; set it to 0 for none.

## CONFIG fields (top of the `<script>` in `index.html`)
- `duration`: composition length (7 s). If you change it, also change `data-duration` on `#root` and `#ov`.
- `accent`: the sunset gradient used on the keyword only.
- `variants["0"]` (Boxed lines)
  - `lines`: one entry per slab, `{ text, size, padX?, padY? }`. Each line is set at its own `size` (sample: 72 / 200 / 200) and only shrinks if its slab would pass `maxWidth`. `padX` / `padY` override the padding for that line (the sample tab uses 26 / 14).
  - `keyword`: the line whose text equals it gets the slam, sunset ignite, light edge, bloom, sheen and re-hits. `""` means no accent.
  - `maxWidth`: the widest a slab may get (772 px, so the stack stays inside x 936 through the hold push).
  - `top`: y of the first slab (232; keep it at 230 or more). With the sample text the stack ends at y 740; keep faces below it.
  - `centerX`: horizontal centre (540).
  - `padX`, `padY`: padding from the glyph ink to the slab edge (40 / 24 px).
  - `radius`: corner radius (14).
  - `snap`: neighbours whose widths differ by less than `snap × radius` become one width (4). A real step gets square inner corners on the wider slab and concave fillets on the narrower one (TikTok's merged text background).
  - `inkText`: the type colour on every slab (#0B0B0E).
  - `shadow`: `[x, y, blur, alpha]`, the soft plum-black lift under the merged stack (`[0, 24, 48, 0.38]`).
  - `contact`: the tight contact shadow (`[0, 2, 4, 0.18]`).
  - `edge`: alpha of the 1 px lit top edge on every slab (.6).
  - `slam`, `slamDur`: the keyword slab lands from this scale on the hit (1.12, 0.32 s expo.out).
  - `impact`: `{ flash, zoom, amp, color }` on the footage at the hit (plate only).
  - `bloom`: the lit slab's light around it.
    - `colors`: pink left, amber right.
    - `strength`: 1.3. On plate it's screened onto the footage.
    - `hold`: .55, the level it settles to after the hit.
    - `rehit`: .95, where each later cut lifts it.
    - `none`: .5, its strength in a transparent export.
    - `tint`: `{ color, strength, until }`, a plain pink bloom for the payoff shot only (it leaves at `until`). Remove it for none.
  - `bounce`: the lit slab's light on the paper slabs above and below it (.2; 0 = off).
  - `holdPush`: the scale the whole stack reaches by the exit, linear from 0.95 s (1.02).
  - `grain`: Look grain on plate renders (.14).
  - `night`: `{ at, shadowAlpha }`. From `at` (put it on your night cut) the paper dims to street light and the lift deepens to `shadowAlpha`. Plate only. `null` turns it off (the sample has no night shot).
  - `timing`:
    - `in`, `stagger`: entrance start and per-slab offset.
    - `hit`: the payoff (slam, RGB split, flash, leak). Put it on a cut.
    - `ignite`: the start of the sunset fill wipe and its light edge (just before `hit`).
    - `sheen`: when the sheen crosses the lit slab.
    - `rehits`: your later cuts (3.4, 5.5). On each, the lit slab pulses 1 → 1.03 → 1, its light lifts and a sheen crosses it.
    - `leak`, `leakDur`: the one light leak (plate only; on the hit by default).
    - `out`: exit start.
- `variants["1"]` (Official caps)
  - `kicker`: the small tracked line, rendered in caps. Only name a trailer if every clip under it comes from that trailer.
  - `kickerSize`, `kickerTrack`: 30 px, 0.34em.
  - `lines`: `[line 1, keyword line]`. Both lines' glyph ink is fitted to `width` (784 px), so they end on the same right edge. Each is capped at `maxSize` (160).
  - `left`: the x where every line's ink starts (96). Each line is shifted by its measured side bearing, so the G, W and M line up.
  - `top`: y of the kicker (262). The lockup ends at about y 551; keep faces below it.
  - `gapKick`, `gapLines`: 24 / 4 px.
  - `slam`: MISSED's scale as it lands, from its left edge (1.06).
  - `bloom`: `{ color, strength, matchFill }`. MISSED's light, screened onto the footage (1.15). With `matchFill`, each letter's light takes its own colour from the sunset fill; otherwise it uses `color`.
  - `flare`: `{ peak, length, colors, above, travel, travelDur, gone }`. The anamorphic streak on the hit (plate only). It rides `above` px (18) over MISSED's cap line and travels from `travel[0]` to `travel[1]` px (−260 → 200) in `travelDur` (0.22 s). It is gone by `gone` (0.95 s). Set it to `null` for none.
  - `scrim`: opacity of the plum sky grade over footage (1).
  - `scrimNone`: the top smoke baked into a transparent export (0.45; 0 = none).
  - `topScrim`: `{ alpha, to, until }`. An extra `.lk-scrim-top` (.35, down to y 640) over the palest skies, switched off on the `until` cut (1.9). Plate only; `null` for none.
  - `grain`: Look grain on plate renders (.12).
  - `stamps`: `{ size, track, top, smoke, spot, showNone, lead, items: [[trailer, time, at], …] }`.
    - One stamp per shot, bottom-left at `top` (1384).
    - The row enters at the first `at`; each later roll fires `lead` (0.07 s) before its `at`, so the new source is in on the cut's first frame.
    - `smoke` is the bottom smoke (0.62). `spot` is a soft dark ellipse right behind the row (0.5), so it reads over white water.
    - `items: []` hides the row. Stamps are hidden in `bg:none` unless `showNone` is true.
  - `timing`:
    - `kick` (0.0: the kicker is already half-lit on frame 0).
    - `l1`, `l2`: when WHAT YOU and MISSED start rising.
    - `hit`: put it on a cut.
    - `sheen`, `sheenDur`.
    - `leak`.
    - `out`.

The layout is measured only after the exact Inter and Archivo weights have loaded. That way the slab widths, paddings and fits match the type the renderer actually paints.

## Render
```bash
cd gta6/03-hook-title
# transparent overlay to drop on your own clip in CapCut or Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o hook-boxed.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o hook-caps.webm
# preview with the sample 4K trailer shots and the Look finishing (grain, vignette, flash, leak)
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o out.mp4
```
Official caps wants a clip with open sky or dark space in the top-left third, where the lockup sits. Boxed lines works over anything, but it looks best over bright footage with sky or soft detail in y 230–740.

The Boxed lines sample ends on `assets/clips/s001-stilt-house-v.mp4`. That's Trailer 2's opening shot (the Keys stilt house), cut from the 4K master with the shot library's crop and grade and framed so the sky sits behind the stack. The sunset dock plays at 0.79× (`data-playback-rate`) so the payoff holds 2.3 s.

## Swap in your own clip
1. Copy your vertical 1080×1920 clips into `assets/shots/` or `assets/clips/`.
2. Edit the `<video>` tags inside `#push`.
   - `class="v0"` tags play in Boxed lines and `class="v1"` tags in Official caps.
   - Keep `class="clip shot vN" muted playsinline`.
   - Set `data-start`, `data-duration` and `data-media-start` (the in-point) so no clip runs past its own length.
3. Put `timing.hit` on one of your cuts.
   - Boxed lines: put `timing.rehits` on your later cuts. Set `night: { at, shadowAlpha }` if one is a night shot, and move `bloom.tint.until` to the end of your payoff clip.
   - Official caps: keep `timing.l2` about 0.12 s before `hit`, so MISSED lands on the cut. Give `stamps.items` one `[trailer, time, at]` per clip, with your real trailer timestamps.
4. Make the hook text true for your footage. If the kicker names a trailer, every clip must come from that trailer.

## Keywords
hook, title, opening line, top text, TikTok text box, boxed lines, merged text background, type slabs, keyword ignite, lit slab, slab slam, contact shadow, light bounce, light edge, anamorphic streak, lens flare, bloom, sunset gradient, Leonida sunset, RGB split, impact, re-hit, night paper, Rockstar caps, official style, wide type, Archivo, left-aligned title, sky title, full-bleed, trailer timestamp, source stamp, what you missed, every trailer, details nobody noticed, trailer breakdown, skydive, jetski, The Keys, stilt house, sunset dock, Vice City, GTA 6, GTA VI, Trailer 2, Features Trailer, Launch Trailer, shorts, reels
