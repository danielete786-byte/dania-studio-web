# 04 · Word captions (craft v2)

Spoken-word captions for GTA 6 voiceover shorts. They show 1–3 words at a time, and the word being spoken wears the Leonida sunset (pink → orange → amber). Every other word is white.

The captions are built to be cut with the edit, not floated on top of it. In the sample, every caption card or lyric line gets its own 4K trailer shot that cuts on its first word. The type is title-scale, and the number or date that matters lands with a payoff hit.

**When to use it.** Any GTA 6 short with a voiceover: "details nobody noticed", news recaps, character explainers, ranking narration, countdowns. It replaces burned-in auto-captions with one clean type system.

## Variants
| `variant` | Name | Look | Best for |
|---|---|---|---|
| `0` | **Word pop** | Inter 900 caps, stacked and centred low (centre y 1250, inside x 150–930). Each card is sized to its own words, up to 170 px: short cards land big, and long ones step down.<br><br>Each word punches in from big and out of focus to sharp on the frame it's spoken (scale, blur and opacity together). The spoken word is sunset with a soft pink glow.<br><br>Words flagged `"em"` become display words: 340 px numerals, or a card's own `emSize` (e.g. "TODAY?" at about 208 px) with the same out-of-focus punch.<br><br>Each card leaves with a quick lift-and-blur that finishes on the next card's first word. The footage cuts on that word too.<br><br>Payoff: the "305" numeral slams in on a cut with a warm exposure kick, shake, RGB split and sheen, and carries a warm bloom (the scene's sun). The card then floats up 14 px over the hold.<br><br>Legibility comes from a soft, edgeless shade and a lift shadow. There's no box or stroke. | Fast hype and fact compilations, number reveals |
| `1` | **Karaoke line** | Full-bleed vertical footage, with one big line at a time in the lower third: Inter 800, 160 px, sentence case, left-aligned at x 72 (cap-top y 1040). A soft bottom shade and a lift shadow keep it legible, and the footage opens with a focus pull.<br><br>Each line rises in whole through word masks just before its first word. Unsung words wait as crisp white at 38 %. A feathered sunset sweep fills the spoken word with a soft glow, then hands off to white when the next word starts. The old line lifts and blurs away as the next one rises, and the footage cuts on each line's first word.<br><br>Payoff: "19." is its own 360 px sunset numeral under "November". It slams in fully lit on the cut to Lucia under a pink sunset (a pre-slowed shot), with a full-frame warm exposure kick, a light leak, shake, RGB split, bloom and sheen. Then the line and numeral float up 14 px over the hold. | Story narration, character explainers, release dates, anything read at voiceover pace |

## CONFIG (top of the `<script>` in `index.html`)
- **`duration`**: composition length in seconds (7.0). If you change it, also change `data-duration` on `#root` and `#ov`.
- **`sunset`**: the accent gradient (Leonida core).
- **`flash`**: the payoff light on footage: `color` (#FFE2B8, a warm screen flash), `peak` (.16) and `exposure` (1.8, a brightness kick on the footage that keeps the blacks). A variant's `flashPeak` overrides `peak`. Off with `bg: "none"`.
- **`variants["0"]`** (Word pop):
  - `shots`: the ids of the `<video>` tags this variant shows (`a1`–`a5`).
  - `cards`: each card is `{ lines: [ [[text, seconds], ...], ... ], payoff? }`.
    - `seconds` is when that word is spoken.
    - A third item, `"em"`, makes the word a display numeral on its own line.
    - `payoff: true` on a card gives its `"em"` word the exposure kick, shake, RGB split, sheen and bloom. Use it on one card only.
    - A card stays up until the next card's first word.
    - `emSize` on a card caps its `"em"` word's size (e.g. `emSize: 240` for "TODAY?"). The word is also fitted to `pop.maxLine`.
    - `drift: { from, to, y }` floats the card's text by `y` px, linearly, between those times (used on the payoff card).
  - `bloom`: the warm light on the payoff numeral (`color` #FEB747, `strength` .6).
  - `exitAt`: when the last card blurs out (0.4 s).
- **`variants["1"]`** (Karaoke line):
  - `shots`: `b1`–`b7`.
  - `lines`: each line is `[[text, seconds], ...]`. A line rises in just before its first word and leaves just before the next line's first word. Keep each line to about 10 characters ("Meet Jason") so it holds 160 px.
    - A line whose word carries `"em"` (e.g. `[["19.", 5.25, "em"]]`) is the payoff numeral. It doesn't replace the line above it: it slams in underneath, fully sunset on its own frame.
  - `payoff`: the time of the word that gets the hit (it must equal one word's time; normally the `"em"` word).
  - `flashPeak`: this variant's warm flash peak (.12, so the leak does the work).
  - `leak`: the one light leak on the payoff (`dur` .6, `colors`, `opacity` .5, `y` .36 of the frame height). Off with `bg: "none"`.
  - `drift`: the last line and the numeral float by `y` px (−14) from `from` to `to`.
  - `exitAt`: when the last line blurs out.
- **`pop`**:
  - `maxSize`: the caption px ceiling (170). Each card is sized on its own: the largest size at which that card's widest line fits `maxLine`, down to `minSize` (96).
  - `emSize`: numeral px (340).
  - `maxLine`: the widest a line may be (780 px, which keeps a centred line inside x 150–930). Keep lines to about 9 caps.
- **`kara`**:
  - `maxSize`: line px (160). It steps down, to a 120 px minimum, only if a line is wider than `maxLine` (864 px).
  - `emSize`: the payoff numeral px (360).
  - `capTop`: the y of the line's cap-top (1040). `emGap`: the px from the line's baseline to the numeral's cap-top (50). Both are placed from real font metrics, and they keep the numeral's baseline at about 1468, inside the safe zone.
  - `dim`: the opacity of unsung words (.38, crisp white).
  - `feather`: the sweep's soft edge (18 px).
  - `maxSweep`: the longest fill across one word (0.45 s).
  - `rise`: how early a line starts rising before its first word (0.13 s). `out` / `outDur`: the old line leaves from `out` s before the next line's first word, over `outDur` s (0.24 / 0.14).

## Render
From this folder:

```bash
# transparent caption overlay to drop on your own clip (no footage, grain, vignette, shade, leak or flash)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o word-pop.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o karaoke.webm

# with the sample footage and the Look finishing (grain, vignette, cuts, payoff)
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o out.mp4
```

With `bg: "none"`:
- Word pop keeps its soft shade behind the caption block. It's part of the graphic, and fades in and out with the captions.
- Karaoke renders only the lines and the payoff numeral, at the same position (y ≈ 1030–1470, x 72–936), with a soft lift shadow. The bottom shade is footage-only.

## Use your own footage
- **Overlay:** render with `bg: "none"` to WebM and stack it above your clip in CapCut or Premiere.
- **Burned in:**
  1. Point the `<video>` tags at your clips. Word pop uses `a1`–`a5` and Karaoke uses `b1`–`b7`, all vertical and full frame. Keep faces above y ≈ 960 so the caption sits on the body or background: `#a1` and `#b2` show how to lift a low face by scaling from the bottom edge.
  2. Set each tag's `data-start` and `data-duration` to the card or line it belongs to, so the cut lands on that card's first word.
  3. Set `data-media-start` to the in-point.
  4. Never let `data-media-start + data-duration` run past the clip's length, or the last frame freezes.
  5. Fewer clips? Delete tags and remove their ids from `shots`.
  6. Is a shot too short for its hold? Pre-slow it into `assets/clips/` (see `b7`):
     `ffmpeg -i in.mp4 -vf "setpts=PTS/0.37,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -an -g 10 out.mp4`
     Use `mci`; `blend` ghosts faces.
- **Retime:** paste your transcript's word timestamps (CapCut, Premiere or Whisper) into `cards` or `lines`. Use typographic apostrophes (’).

## Sample content (real, from FACTS.md)
- **Word pop:** "GTA 6’s first trailer: 90 million views in 24 hours. Today? 305 million."
  - Trailer 1 drew 90M+ views in its first 24 hours, and has 305.4M views as of 2026-11-18.
- **Karaoke:** "Meet Jason and Lucia. Their story plays out in Vice City, November 19."
  - The leads are Jason Duval and Lucia Caminos, the game is set in Vice City, Leonida, and it's out on November 19, 2026.
- **Sample shots** are from the official trailers (`assets/shots`, plus the pre-slowed `assets/clips/s105-lucia-rooftop-slow-v.mp4`) and are for local preview only.

## Keywords
captions, subtitles, word-by-word, karaoke, lyric line, release date reveal, active word highlight, voiceover captions, TikTok captions, Shorts captions, Reels captions, CapCut style, Hormozi style, kinetic captions, emphasis numerals, full-bleed captions, lower-third subtitles, cinematic subtitles, slow-mo payoff, GTA 6, GTA VI, Leonida sunset, transparent overlay
