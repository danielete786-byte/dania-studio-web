# 46 Cash payout (GTA HUD kit)

Money rolls up for the payoff of a heist, a big sale or any "how much did that make" moment in a GTA 6 short. The count rushes from the first frame: the low digits flicker, the top digits tick up into place, and the total stops dead on an exact frame. That frame gets the hit (flash and punch), never before it.

- **Variant 0, HUD corner.** A game-HUD wallet in the top-right corner: the balance in white condensed numerals, a teal `+$1,250,000` line under it with a bold "HEIST PAYOUT" label, then the balance rolls up and flashes teal on the frame it is credited (2.0 s). Use it over gameplay or trailer footage when you want the "real game" feel.
- **Variant 1, Centre card.** A smoked-glass payout card in the upper half: caps label and place, a big numeral that grows from a centred `$0`, a Leonida-sunset progress rule that fills in sync, a punch and sheen on the landing frame (2.1 s), and a crew split row (Jason / Lucia) that the card expands to reveal. Use it as the headline beat of a "biggest heist payout" or "how much money" short.

Both work as transparent overlays (`bg: "none"`). Length 5.5 s; everything clears by 5.1 s so it loops cleanly.

## CONFIG fields (top of the `<script>` in `index.html`)
| Field | Variant | What it does |
|---|---|---|
| `currency` | both | Currency symbol, default `"$"` |
| `variants["0"].plate` | 0 | Sample footage under the HUD (only with `bg: "plate"`) |
| `variants["0"].balanceFrom` | 0 | Wallet balance before the payout (12500) |
| `variants["0"].payout` | 0 | Amount credited; shown as `+$1,250,000` and added to the balance |
| `variants["0"].label` | 0 | Small caps label beside the `+$` line; `""` hides it |
| `variants["0"].accent` | 0 | Colour of the `+$` line and the credited flash (Vice teal `#2EC4B6`) |
| `variants["1"].plate` | 1 | Sample footage under the card |
| `variants["1"].payout` | 1 | The number the card rolls up to (from a centred `$0`) |
| `variants["1"].label` / `place` | 1 | Top-left label and top-right place; `place: ""` hides it |
| `variants["1"].split` | 1 | `[{ name, amount }, ...]` crew split revealed on landing; `[]` hides the row |
| `timing.*` | both | `in`, `delta`, `count` + `countDur` (V0), `cardCount` + `cardCountDur` (V1), `deltaOut`, `out`, `end` |
| `timing.rush` | both | Roll ease strength (normalised exponential ease-out, default 9). Higher means the top digits settle earlier. It always stops dead on the total. |

The hit fires at `count + countDur` (V0) and `cardCount + cardCountDur` (V1). Keep those sums on the 1/30 s grid (e.g. 0.5 + 1.5) so the flash lands on the same frame as the final value.

The numeral auto-fits the card, so 6- to 8-digit payouts all fit. Digit counts and commas come from the numbers themselves.

## Render
```bash
# transparent overlay to drop on your own clip (CapCut / Premiere)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o cash-hud.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o cash-card.webm

# with the sample footage
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o cash-card.mp4
```

## Swap in your own clip
Put your vertical clip in `assets/` (e.g. `assets/myclip.mp4`). Set the `src` of `#plateA` (variant 0) or `#plateB` (variant 1) in the HTML to it, and set the same path in that variant's `plate` field in CONFIG (the script only shows the `<video>` whose `src` matches). Keep `data-duration` (5.5) at or below the clip length. Or render with `bg: "none"` and layer the webm over the clip in your editor.

## Keywords
gta 6, gta vi, cash, money, payout, count up, cash counter, heist, take, money counter, rolling number, odometer, wallet, hud, balance, plus money, credited, reward, split, jason, lucia, vice city, overlay, transparent
