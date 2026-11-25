# 38 · X post card

**The post becomes the headline.** An X post from your own account (@everestchris6) lands as a full-width, faithful post card over a cut montage of GTA 6 shots. Its key phrase is highlighted, and then the phrase lifts off the card and flies up into the headline slot in one move (a FLIP), landing on a hard cut with a light hit, a shake and a small RGB split. The card keeps a gap where the words were until they settle back after the hit. The big type is the hook; the card underneath is the receipt.

After the hit the post gets its own second beat: it gets liked, X-style (the heart fills pink and pops with a ring and a dot burst, and the like count rolls up). The other counts tick up digit by digit, the views keep ticking like a live post, and the card drifts slowly through the hold. 6.5 s, 1080×1920, 30 fps.

**When to use it in a GTA 6 short:** for the fact or take you're about to talk over, as the hook at the top of a short or the "source" beat before a reaction. Examples: "pre-load is live", "Trailer 1 did 90M views in 24 hours", or a hot take. Use it for your own posts or a fan-made voice; never fake a post from Rockstar or a real person.

## Variants
| variant | name | look | sample shots |
|---|---|---|---|
| `0` | Light card | X light mode. A warm paper card (#FBF7F4, peach top rim, plum contact shadow) with a sunset highlighter sweep on "Pre-load is live". At 1.17 s the marked phrase splits into two chips, one per headline line ("Pre-load" / "is live"), cut from the band itself; they peel up off the paper with a soft shadow and leave a gap in the post. At 1.43 s they fly, accelerating (power2.in) with growing vertical motion blur, so they are ~90 % home on the last frame before the cut. On the cut the white Archivo headline replaces them at the chips' own width (Archivo's width axis, narrow), lands 1.08× too big and stretches out to the wide 125 % face in 0.5 s, under an exposure pulse on the footage (no white flash), a 5 px RGB split, the shake and a warm leak. The marked phrase settles back into the post 0.3 s later. A warm sheen crosses the card on the hit. | Vice highway, dropped 170 px (the camera cranes out of the windshield; the pickup clears the card early) → biplane with pink smoke from media 0.35 (payoff cut; towers and smoke behind the headline) → sunset dock with string lights (its own slow push) → "Welcome to The Keys" (quick cut) → the jetski, bright and sharp, cut on the exit so the loop ends on it |
| `1` | Dark on blur | X dark mode. The footage racks out of focus (5 px, with lifted contrast so lights bloom into bokeh) as the card racks into focus. The line the number comes from ("Trailer 1 pulled 90M+ on day one.") goes pure white and the rest of the post settles to 60 % white. The post's own "90M+" turns sunset, peels off its line and flies up into the headline as the sunset numeral. It reads 90M+ on every frame (no reel): it lands on the cut 1.14× too big and settles in 0.4 s under the flash and the RGB split. It then settles back into the post in the same sunset fill, so the highlight reads at rest. The card's top rim and a soft wash take each shot's light (purple club, orange fireworks, violet city, sunset), and the numeral blooms warm. The footage racks back to sharp on the exit. | Blue club close-up → Jason with fireworks (payoff cut) → night drive with the Vice City skyline racked to bokeh behind the numeral → sunset pier (trees with fairy lights, posts and lit water) → sunset dock |

**Beats:**
- 0.15 s: the card lands.
- 0.6 s (v0) / 0.72 s (v1): the highlight.
- 1.17 s (v0): the marked phrase splits into two chips that peel off the card, leaving a gap.
- 1.2 s (v1): the post's "90M+" turns sunset and lifts off its line.
- 1.43 s (v0, 0.32 s before the payoff) / 1.48 s (v1, 0.12 s before): the chips (v0) or the number (v1) fly out of the card.
- 1.75 s (v0) / 1.6 s (v1): the payoff cut and the headline hit, as the flight lands (v0's headline lands narrow at 1.08× and stretches to the wide face; v1's numeral slams 1.14 → 1).
- Payoff + 0.3 s (2.05 s / 1.9 s): the marked phrase (v0) or the post's "90M+" in the sunset fill (v1) settles back into its line.
- Payoff + 0.4 s (2.15 s / 2.0 s): the second beat, the like (heart pop and burst, likes roll 22K → 24K).
- Payoff + 0.5 s: the other counts roll. From the payoff to the exit the card drifts up 14 px and tilts back 1.5°.
- 5.75 s (v0) / 5.85 s (v1): the headline and card blur out. v0 exits on a cut to the jetski; v1's footage racks back to sharp.

`bg: "none"` renders a transparent overlay. It has no footage, grain, vignette, flash or leak, and no footage-tied scrims (`scrimBottom`, `shotScrim`). v0 keeps its soft headline scrim; v1 keeps a smoked wash and the warm glow, so the dark card still separates from any clip.

## CONFIG (top of the script in `index.html`)
- `author`:
  - `name`, `handle`: the display name and @handle.
  - `avatar`: a square image path; the sample is `assets/img/avatar-everest.jpg`.
  - `initials`: shown instead when `avatar` is `""`.
- `layout`:
  - `left`, `width`: the card and headline column, `72 / 864` (the full safe width).
  - `titleTop`: the headline's top in px.
  - `gap`: the space between the headline and the card.
  - `maxBottom`: the lowest the card may reach.
- `variants["0" | "1"]`:
  - `style`: `"light"` or `"dark"`.
  - `highlight`: `"marker"` (a sunset highlighter sweep; the ink flips exactly at the edge) or `"light"` (the phrase goes pure white while the rest dims to `dim`).
  - `text`: the post. Wrap the **one** phrase in `[[double brackets]]` and keep it to one line (up to about 34 characters). In marker mode with a `flip`, mark exactly the headline's words (v0: `[[Pre-load is live]] right now.`). It reads best leading the post, followed by `\n`. Keep the post to about 4 lines in total (about 110 characters). Use ` ` to keep words together and `‑` for a hyphen that must not break.
  - `time`, `date`: the meta line.
  - `counts`: `{ views, replies, reposts, likes, saves }` as raw numbers, shown X-style (`862`, `1.2K`, `24K`, `486.2K Views`).
  - `title`: the headline.
    - `kicker`: the small tracked label above it.
    - `lines`: an array of lines, set in Archivo wide caps.
    - `fill`: `"white"` or `"sunset"`.
    - `maxSize`: px.
    - `fit`: the share of the safe width the widest line fills, e.g. `0.90`.
    - `unit`: the label under it, e.g. `"Views in 24 hours"`.
    - `bloom` (optional, white fill): `{ color, strength }`, a soft glow around the headline.
    - `count` (optional): `{ line, from, to, suffix, roll }` makes that line a number (`to` + `suffix`). With `roll: false` (v1) it is static: it flies out of the post and lands reading the same value on every frame. With `roll: true` and no `flip`, it rolls `from` → `to` as it lands (keep both the same digit count). A number that flies out of the post never rolls.
    - `slam` (optional): the headline lands on the payoff cut this many times too big and settles to 1 in 0.4 s (v0: 1.08, v1: 1.14).
    - `stretch` (optional, marker flip): `{ dur }`. Each line lands at its chip's width on Archivo's width axis (measured, 62–125 %) and stretches out to the wide face in `dur` s (v0: 0.5).
  - `flip`: the words in `text` that lift off the card on the payoff. If the headline has a `count`, the number itself flies out of these words (v1: `"90M+"`). Otherwise the highlighted words split into one chip per headline line (by word count of each line in `title.lines`) and each chip lands on its own line: text edge on x 72, baseline on the line's baseline, cap height on the headline's (v0: `"Pre-load is live"` → "Pre-load" | "is live"). Use `""` to turn it off.
  - `highlightAt`, `lift`, `flipLead`, `flipBlur` (optional, per variant): override `timing.highlight`, `timing.lift`, `timing.flipLead` and `timing.flipBlur` (v0: 0.6, 1.17, 0.32 (the whole flight, so it arrives on the cut), 9).
  - `chroma` (optional): `{ px, dur }`, the RGB split on the landing headline (v0: 5 px for 0.18 s; default 14 px for 0.36 s).
  - `expose` (optional, plate only): `{ peak }`, an exposure pulse on the footage at the payoff (`Look.expose`; v0: 1.3). Use it with `flash: 0`.
  - `tokenFill` (count flip only): `true` settles the flip word back into the post in the sunset fill after the number lands, so the highlight still reads at rest.
  - `bodySize` (optional): the post's body size in px (default 50; v1 uses 46 for three even lines). Keep each line of `text` inside the 768 px measure at that size.
  - `shots`: the ids of the `<video>` elements this variant shows.
  - `reframe` (optional): `{ videoId: { from: {…}, to: {…}, ease } }`, any GSAP-settable props on a shot (`scale`, `x`, `y`, `objectPosition`, `filter`), optionally pushed to `to` across the shot. A `transformOrigin` in `from` sets the pivot. Use it to move a shot's subject out from under the card (v1's `b3` scales the night drive 1.25 from its top edge so the skyline fills the headline band and the passenger stays below the card; `b4` shows the right side of the horizontal pier master so the couple never enters the frame), to give one shot its own push (v0's `a1` drops 170 px and scales 1.06 from its bottom edge; v0's `a3` goes 1.0 → 1.05), or to grade one shot (v0's `a2` gets `contrast(1.22) saturate(1.15) brightness(.95)`; v1's `b3` gets an extra `blur(4px) brightness(1.3)` for real bokeh).
  - `shotScrim` (optional, plate only): `{ videoId: strength }`, an extra copy of the headline scrim that cuts in and out with that shot, for a bright sky behind the headline (v0: `a3` 1, `a4` 0.35; v1: `b4` 0.4, `b5` 0.55). A shot that runs past the exit fades it out with the graphic. `shotScrimCss` (optional) gives it its own gradient (v0 uses the firmer r07 scrim there); it defaults to `scrimCss`.
  - `flash`: the white overlay flash on the payoff cut (v0: 0, it uses `expose`; v1: 0.5).
  - `payoff`: when the headline hits, in seconds. Put it on a cut.
  - `out`: this variant's exit time (falls back to `timing.out`).
  - `sheen`: `true` sends a warm light band across the card on the hit.
  - `dim` (light highlight): the alpha of the white post text that isn't the phrase (v1: 0.60, so the white line and the sunset token stand out).
  - `scrim`: 0–1, the strength of the soft top darkening behind the headline. `scrimCss` is its gradient.
  - `scrimBottom` (plate only): the strength of the kit's `.lk-scrim-bottom` under the card (v1: 0.35).
  - `rack`: px of focus blur on the footage behind the card (0 = sharp; v1: 5).
  - `rackGrade`: the filter added in the racked state (v1: `contrast(1.2) saturate(1.15) brightness(1.08)`, so lights bloom into bokeh).
  - `glow`: `[[time, "rgba(...)"], …]`, the light behind the card per shot, or `null`. On the dark card the same colour tints the top rim and a soft wash across its top.
  - `smoke`: the full-frame wash used only with `bg: "none"`.
- `rollFrom`: the counts start from this fraction of their value (0.93), so they tick (452.2K → 486.2K) and never start from 0.
- `likeFrom`: the like count rolls up from this fraction of its value on the like beat (0.9: 22K → 24K).
- `tickAt`: the moments (s) when the views tick up by one more unit during the hold.
- `timing`, all in seconds:
  - `cardIn`, `highlight`, `highlightDur`.
  - `countsAfter`: the time from the payoff to the count roll.
  - `rollDur`, `digitStagger`.
  - `flip`, `flipLead`, `flipBlur`: the flight's duration, how long before the payoff it leaves the card, and its vertical motion blur in px.
  - `lift` (count flip only): when the post's number turns sunset and peels off its line, before the flight.
  - `likeAfter`, `likeDur`: when the like lands after the payoff, and how long the heart pop and the like roll take.
  - `drift`, `driftTilt`: px the card rises and degrees it tilts back across the hold (linear, payoff → exit).
  - `out`: the default exit.
  - `end`: the composition length (6.5; keep the root's `data-duration` in step).

Use one sunset element per frame: the marker *or* a sunset headline, not both (v1's sunset token in the post is the same number as the headline, so it reads as one accent). The pink of the liked heart is X's own like state (`#F91880`), not the sunset accent.

## Render
```bash
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -o post-light.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -o post-dark.mp4
# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o post-light.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o post-dark.webm
```

## Swap in your own clip
- **Your own footage under the graphic.** The shots are the `<video class="clip shot">` elements inside `#focus` (ids `a1`–`a5` for v0, `b1`–`b5` for v1). Change a `src` to your own 1080×1920 clip, and keep its `data-start`, `data-duration` and `data-media-start` inside the clip's length. To use fewer or more shots, list their ids in `CONFIG.variants[n].shots`, and keep `payoff` on a cut. The card covers y ≈ 640–1260 (v0) or 685–1220 (v1) of the frame, so pick clips (or `reframe` them) with the subject above, beside or below it. If you replace `a1`, `a2`, `a3`, `a4`, `b3` or `b4`, delete their `reframe` (and `shotScrim`) entries: they are tuned to the sample biplane, dock, Keys, night-drive and pier shots. Check your clip for hidden cuts (the sample `s039` cuts from a wide floor to the close-up at 1.07 s, so `b1` starts at 1.1 s; `s098` cuts to a different green shot at 1.13 s, so `b2` stops at 1.1 s; `s055` cuts to a bedroom close-up at 2.1 s). A horizontal clip works too; set its `objectPosition` in `reframe` to choose which part of the wide frame shows.
- **The graphic on top of a clip in your editor.** Render with `bg: "none"` and lay the WebM over your clip. For v1's look, also blur that clip in your editor.

## Keywords
x post, tweet card, post becomes headline, split chip flip, variable font width morph, font-stretch animation, like animation, heart burst, flip, phrase to headline, number flies out of post, pull quote, highlighted phrase, highlighter sweep, twitter card, social post overlay, news & social, quote to headline, headline slam, number slam, scale slam, 90M views, pre-load, gta 6 news, trailer record, rolling counts, digit reel, odometer, views counter, rack focus, bokeh, blurred background tweet, dark mode tweet, light mode tweet, cinematic type, transparent overlay
