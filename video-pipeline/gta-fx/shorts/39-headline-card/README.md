# 39 · Headline card

A real, reported GTA 6 news headline set as a press clipping. One phrase in it is swept with the Leonida sunset marker, so the viewer gets the point of the headline in under a second.

It is publication-neutral. There are no outlet names, logos or mastheads. Each card shows only:
- the kind of source ("Local TV report", "Video report");
- the date;
- on the single card, a neutral `NEWS` tag.

The single card runs like a real article:
1. the headline;
2. a meta row;
3. a one-line dek;
4. a 2:1 still lead image;
5. an image credit.

With sample footage, it sits on a soft vignette stage.

**Use it** in a GTA 6 short when you cite the hype or the news around the launch. For example:
- Open a "people are calling in sick for GTA 6" video with the single card.
- Run through what the news is saying with the stack.

It is an overlay: drop it over your own gameplay clip.

## Variants
| `variant` | Name | What it does |
|---|---|---|
| `"0"` | Single card | A straight warm-paper clipping. **The card grows with its content:** it fades in (0.1 s) as a headline-only card with all three lines already set, then the paper grows down to full height and uncovers the meta row, dek, lead image and credit in reading order through a soft edge. No frame shows blank paper; the card is complete by about 0.43 s. The headline sits in the hook zone (card from y 270). The highlighted phrase is kept on one line, so the sunset marker sweeps "1.5M will call out sick" as one continuous bar, from 0.55 s until it is fully lit at about 0.9 s. Ink appears exactly at the marker's edge, and the marker sits the same 0.08em from the glyph ink on both sides. The card holds on a slow 1→1.01 push while the photo pushes in. |
| `"1"` | Stack of three | Three real stories that land every 0.75 s under a paper "THE HEADLINES" tag, building to the biggest claim. **One rule:** the context cards (1 and 2) are ink-navy glass and unlit; the payoff card (3) is paper with ink and is the only one lit, with "biggest entertainment launch ever" swept by about 2.45 s, then a 4 s hold. Each card shows its headline on its first frame (no empty plate). As each new card lands, the earlier cards' text recedes to 72% while their glass stays solid, so the footage behind them stays blurred. Every card keeps full width, so the cards and the tag share one column (cards x 88–920, text and tag at x 128). A wrapped phrase gets the full pink→amber gradient on each line. The whole stack leaves as one group (0.30 s, lift 26 px). |

`bg`:
- `"plate"` shows the sample trailer footage plus a radial vignette that stages the card (full strength on the single card, 55% on the stack so the footage keeps its colour).
- `"none"` renders a transparent overlay with the cards, their shadows and glass, and the lead image. There is no vignette.

## CONFIG fields (top of the `<script>` in `index.html`)
- `variants["0"]`
  - `plate`: the sample background clip, for preview only.
  - `top`: the card's top edge in px.
  - `tilt`: the resting angle in degrees (`0`, straight). The card lands from 2.5× this angle. Keep it within ±1, or the card leaves the safe zone during the hold push.
  - `vignette`: the stage vignette's peak opacity with `bg: "plate"`, 0–1 (`1`).
  - `maxLines`: the headline auto-fits. It starts at 76 px and steps down until it fits this many lines.
  - `keepPhrase`: `true` keeps the highlighted phrase on one line, so the marker is one bar. The headline steps down (to at most 90%) to make the phrase fit. If it still can't fit, the phrase wraps and the marker flows across the wrap.
  - `card`
    - `tag`, `source`, `date`: the meta row under the headline. Keep these publication-neutral.
    - `headline`: the exact reported headline.
    - `highlight`: an exact whole-word substring of `headline` that gets the marker. It may wrap across lines; each line then gets its own full pink→amber marker.
    - `dek`: one line under the meta row, 28 px (the same size as the meta row and credit). It steps down to 26 px to stay on one line, and wraps only if it is still too long.
      - The sample, "Out Thursday, Nov 19, on PS5 and Xbox Series X|S.", is a fact, not a quote.
      - Paste the article's real dek if you have it, and never invent one in an outlet's voice.
      - Set it to `""` to drop it.
  - `thumb`: `{ src, credit }`, the 2:1 lead image (a 16:9 source is cropped to fit).
    - `src` is a `.jpg`/`.png` still. This is recommended, and the sample is `assets/stills/p05-truck-yard.jpg`. It can also be an `.mp4` that has a matching `<video class="clip thumb-src">` in the HTML (`#thumbA`).
    - `credit` is the muted line under the image. Set it to `""` to hide it.
    - Set `thumb: null` to drop the image.
- `variants["1"]`
  - `plate`: the stack's sample clip (p01, The Keys sign → marina → teal car, which stays in colour behind the stack).
  - `label`: the paper section tag on the first card.
  - `top`: the first card's top edge.
  - `gap`: the spacing between cards.
  - `maxLines`: the auto-fit limit for each card's headline (54 px, stepping down).
  - `dim`: `{ opacity, scale }`, how the earlier cards recede as each new card lands (`0.72` / `1`). `opacity` applies to the card's text (meta and headline), not the glass, so a receded card never turns see-through. Keep `scale: 1` so the receded cards stay on the same edges and text column as the payoff card and the tag. Use `{ opacity: 1, scale: 1 }` to turn it off.
  - `vignette`: the stage vignette's peak opacity with `bg: "plate"` (`0.55`, lighter than the single card's, so the footage keeps its colour behind three cards).
  - `cards[]`: up to three `{ source, date, headline, highlight, paper }` objects.
    - `highlight: ""` leaves a card unlit. The sample lights only the payoff card (cards 1 and 2 are `""`), so the stack has one rule: glass cards are context, the paper card is the point. If you light an earlier card, its marker wipes off left to right as the next card lands, so only one phrase is ever lit.
    - `paper: true` makes a card paper with ink instead of glass. Use it on the payoff card only, so the stack ends on one bright object.
    - The stack's marker covers ascenders and descenders, so a phrase with g, p or y reads cleanly on glass and on paper.
    - Add a `tag` to a card to give it a chip, but on the stack fewer repeats read cleaner. Use one date format on every card, and vary the source words ("Video report", "News video") rather than repeating one.
- `colors`: `ink`, `paper`, and `sunset` (the three gradient stops for the marker).
- `marker`
  - `pad`: the space between the glyph ink and the marker's edge in em (`0.08`), the same on both sides. It is measured from the actual ink, so a "1" or a "T" at the edge gets no extra gap.
  - `gap`: when a neighbouring word sits on the same line, the most of the ink-to-ink gap the marker may cover (`0.3`), so the word space before or after the phrase always stays visible.
- `timing`
  - `in`: when the first card starts to show (0.133 s; the single card's headline lines start rising at 0, so they are set on its first frame).
  - `reveal`: single card: how long the paper takes to grow from headline-only to full height (0.45 s).
  - `sweep`: when the single card's marker starts.
  - `every`: stack interval (0.75 s).
  - `sweepSpeed`: marker speed in px/s.
  - `wipe`: how long the previous marker takes to wipe off on the stack.
  - `hold`: peak hold push. 1.01 keeps the card and the stack inside x 72–936.
  - `out`: exit start.
  - `end`: 7.0 s.

## Render
```bash
cd gta6/39-headline-card
# with sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o headline-single.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o headline-stack.mp4
# transparent overlay for CapCut / Premiere
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o headline-single.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o headline-stack.webm
```

## Use your own clip
- **Background:**
  - **Easiest:** render with `bg: "none"` and lay the `.webm` over your clip in your editor. Add your own vignette there if you want the stage look.
  - **To bake it in:** copy your 1080×1920 clip into `assets/plates/`. Point the variant's `plate` in CONFIG at it and change the matching `<video>` `src` (`#plateA` for variant 0, `#plateB` for variant 1) to the same path. Keep `data-duration` at or under your clip length.
- **Lead image (single card):**
  - **To use a still (recommended):** drop a 16:9 or 2:1 `.jpg` or `.png` into `assets/stills/` and set `thumb.src` to it. The image box is 2:1, so keep faces away from the top and bottom edges. To grab a frame from a clip:
    ```bash
    ffmpeg -ss 1.0 -i clip.mp4 -frames:v 1 -q:v 2 assets/stills/my-frame.jpg
    ```
  - **To use a clip:** copy a 16:9 clip into `assets/plates/`, then set the `src` of `<video id="thumbA">` and `thumb.src` to the same path.
    - Pick one continuous shot that lasts the whole 7 s. A cut inside the card reads as a montage.
    - Use `data-media-start` on `#thumbA` to start at the right moment.

## Swap the headline
1. Paste the real headline into `headline`.
2. Copy the phrase you want to land into `highlight` exactly, word for word.
3. Keep the source line generic ("Local TV report", "Video report", "Gaming site") rather than naming the outlet.

Only use headlines that were actually published. Long headlines shrink automatically to fit `maxLines`.

## Keywords
headline, news card, article, press clipping, clipping, dek, standfirst, lead image, still, thumbnail, image credit, highlight, marker, highlighter sweep, payoff card, paper card, recede, dim, reveal, grow, unroll, vignette, reported, call out sick, biggest launch, excitement, hype, news stack, the headlines, GTA 6, GTA VI, overlay, transparent, 9:16, shorts, reels, tiktok
