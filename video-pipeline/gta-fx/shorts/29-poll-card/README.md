# 29 · This or that (poll)

A this-or-that poll for GTA 6 shorts. The two options land, a tap picks one, the result runs in, and the clip ends on **"Comment [A] or [B]"**. It turns the viewer's opinion into a comment, and comments drive the algorithm. Put it in the last 5 s of a comparison or character segment ("Jason or Lucia?", "Vice City or the Keys?").

Craft v2: 4K graded trailer shots cut on the beat, the Look finishing layer (grain, vignette, exposure hit), and type set at title scale on the image. There is no card.

## Variants
| `variant` | Name | What it does |
|---|---|---|
| `0` | Bars | A full-bleed cut sequence: Jason (row A lands), Lucia (row B lands), then the result on the cut to Lucia at the gate. The options are big Archivo wide names with A/B keys in the lower third. On the tap, each result bar runs in from the frame edge to its share of the frame width. The winner's bar is a sunset beam with a light head, and its name turns plum exactly where the beam passes. The loser's bar is frosted white. The percentages count up, and the hit lands on the cut with an exposure pulse, a shake and a punch-in. |
| `1` | Split tap | A would-you-rather split: two live shots, Vice City on top and The Keys below, with a seam of light between them. On the tap, **the seam is the chart**: it slides from the middle of the safe zone to the vote share, and the panes resize with it. The winner's 214 px sunset numeral rises out of the seam, and its pane cuts to its best shot under an exposure pulse. "Where do you go first?" hands its slot to the ask. |

Both are 5 s, 1080×1920, 30 fps.

## CONFIG (top of the `<script>` in `index.html`)
- `variants["0"|"1"]`
  - `style`: `"bars"` or `"split"`.
  - `kicker` (Bars) / `question` (Split tap): the line above the options. In Split tap the ask replaces the question in the same slot.
  - `options`: two `{ key, label, pct }`. `key` is the letter on the key and in the ask. `label` is the option (keep it to about 9 characters: names are 104 px / 96 px wide caps). `pct` is **your own poll result** (e.g. a YouTube community poll or a story sticker). The two should add up to 100. The demo numbers are placeholders.
  - `pick`: the option the tap lands on (0 or 1). It gets the sunset accent and the hit. Make it the winner.
  - `layout` (Bars): `kicker`, `rows` (the tops of the two 128 px rows; the bars are the rows) and `cta`, in px. Keep the winner's `pct` under ~75: above that the beam reaches the percentage on the right.
  - `seam` (Split tap): `top` / `bottom` of the range the seam maps onto (the safe zone, 230–1480) and `gap` (the type's distance from the seam). The seam lands at `top + (bottom − top) × pct of A`.
  - `frame`: how each sample shot sits in the frame, `{ x, y, s }` (offset in px and scale, from the top-left).
  - `timing` (s): `rows` (when each option lands), `press` (the tap), `fill` (bars / seam and count), `hit` (the payoff, on a cut), `sheen`, `cta` (the ask), `keys` (A and B press once, this long after the ask), `out` (exit), `end`.
- `cta.pre` / `cta.or`: the words of the ask ("Comment", "or").
- `look`: grain, vignette and the exposure peak of the hit (per variant).

## Render
```bash
# with the sample footage
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -o poll-bars.mp4
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -o poll-split.mp4

# transparent overlay for CapCut / Premiere (no footage, grain, vignette or exposure hit)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o poll-bars.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o poll-split.webm
```
In Split tap with `bg: "none"`, the seam, the OR and the type still render, so you can line two of your own clips up under the seam.

## Use your own clips
Either render `bg: "none"` and drop the webm over your edit, or swap the sample shots: put your clips in `assets/shots/` and change the `src` of the `<video>` tags (`#a1`–`#a4` for Bars; `#b1`–`#b3` top pane and `#c1`–`#c3` bottom pane for Split tap). Keep each tag's `data-duration` no longer than the clip from its `data-media-start`, so it never freezes on its last frame. Then reframe the clip with its `frame` entry in CONFIG, so faces stay clear of the type.

## Keywords
poll, this or that, would you rather, split screen, vote, A or B, comment A or B, Jason or Lucia, Vice City or the Keys, Leonida Keys, results bars, percentage, count up, tap, engagement, comment bait, fan poll, GTA 6, GTA VI, overlay, transparent, vertical, shorts, reels, tiktok
