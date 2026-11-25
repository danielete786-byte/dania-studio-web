# 49 · Follow CTA (Calls to action)

The last 5–7 seconds of a GTA 6 short: ask the viewer to follow for Part 2, or hand them straight to the next part. It is a clean overlay, centred on the frame and inside the 9:16 safe zone (x 144–936, y 300–1340), so it drops onto any end clip.

- **Variant 0 · Follow button.** "THANKS FOR WATCHING / FOLLOW FOR PART 2" (Part 2 in the sunset gradient) over a smoked-glass profile card: an avatar monogram with a TikTok-style "+" follow badge, your handle, a one-line pitch and a full-width white **Follow** pill. At 1.5 s a touch indicator presses the button (to the right of the label). On release, the app's grey-glass **✓ Following** state wipes out from the tap point as one opaque circle, with no crossfade, and only the check and the avatar badge turn teal. At 2.6 s the pitch line changes to "Part 2 drops on my page". At 3.2 s a white underline sweeps under your handle and a ↓ arrow under the card starts bobbing toward your handle in the app UI. Use it when Part 2 isn't posted yet.
- **Variant 1 · Next part card.** "END OF PART 1 / PART 2 IS UP NEXT" over an ink-navy (#1F202B) end tile. The tile holds a 16:9 preview clip of the next part with a "NEXT" chip and a glass play button, your handle, an "ON MY PAGE ↓" route line, the next video's title and a 12 px sunset progress bar, which is the only countdown. When the bar fills, the chip wipes to a white **OUT NOW**, the play button pulses once (it keeps the play icon: nothing pretends to autoplay), the preview brightens slightly, and your handle and the route light up from 62% to 100% white while the arrow bobs twice. Use it when Part 2 is already live on your page.

Timing: entrance 0.15–1.2 s. v0 presses at 1.5 s, changes the pitch line at 2.6 s, and starts the handle underline and arrow at 3.2 s. v1 counts down 0.9–4.9 s and holds OUT NOW 4.9–6.55 s. Clean exit 6.55–6.9 s, 7.0 s total, so it loops.

## CONFIG (top of the script in `index.html`)
| Field | Variant | What it does |
|---|---|---|
| `handle` | both | Channel handle shown on the card (`@everestchris6`). |
| `plate` | both | Sample footage under the overlay; must match a `<video class="plate">` src. |
| `kicker` | both | Small wide-tracked line above the headline. |
| `headline` | both | Two headline lines. In v0, line 2 carries the sunset gradient. |
| `avatar` | 0 | Monogram inside the avatar circle (2 letters). |
| `sub` | 0 | One-line pitch under the handle (before the press). |
| `subDone` / `subDoneAt` | 0 | The line that replaces `sub` after the follow lands ("Part 2 drops on my page") and when (s). |
| `routeAt` | 0 | When the handle underline sweeps and the ↓ arrow under the card starts bobbing (s). |
| `button` / `buttonDone` | 0 | Button label before and after the press. |
| `tap.x` / `tap.at` | 0 | Tap point across the button (0–1; keep it right of the label, default 0.84) and press time in seconds. The Following wipe grows from this point. |
| `thumb` | 1 | Preview clip of the next part. The script sets it on `#thumbClip` at load, so CONFIG is the only place to change it. |
| `chip` / `chipDone` | 1 | Thumbnail chip label during ("Next") and after ("Out now", white chip) the countdown. |
| `route` | 1 | Where Part 2 lives ("On my page"), shown with a down arrow that points at your handle in the app UI. |
| `title` | 1 | Next video's title (2 lines max at 44 px). |
| `countFrom` / `countStart` | 1 | Countdown length (s) for the sunset bar, and its start time. |
| `timing.in/out/end` | both | Entrance start, exit start, composition end. |

## Render
From this folder:

```bash
# transparent overlay for CapCut / Premiere (WebM with alpha)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o follow-cta.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o next-part.webm

# with the sample footage underneath
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o follow-cta.mp4
```

Note: with `bg: "none"`, variant 1 still plays its own preview clip inside the card (that clip is part of the graphic).

## Swap in your own clip
- **Footage under the overlay (preview only):** put your clip in `assets/plates/`, change the `src` on `#plateA` (v0) or `#plateB` (v1) and the matching `plate` in CONFIG. For final edits, render with `bg: "none"` and lay the WebM on your clip instead.
- **Next-part preview (v1):** drop your Part 2 clip (16:9 or any ratio; it is cropped with `object-fit: cover`) into `assets/plates/`, set `CONFIG.variants["1"].thumb` to its path, then change `title`. The script applies it to `#thumbClip`, so you don't need to edit the HTML.

## Keywords
follow cta, follow for part 2, subscribe button, follow button press, end screen, end card, next part, up next, part 2, countdown bar, out now, on my page, link below, following, outro, call to action, gta 6, gta vi, shorts, tiktok, reels
