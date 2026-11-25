# 41 · Comment reply (News & social)

A reply-to-comment overlay for GTA 6 shorts. A viewer's question ("is the water real?") pops in within the first few frames over a lightly dimmed, blurred hold. The hold eases in over 0.18 s, so the loop is seamless. Then the hold clears and the sticker docks while your clip plays as the answer. Use it to open a "you asked, here's the answer" short, a Q&A follow-up, or any clip that settles a debate from the comments.

- **Variant 0 · Reply sticker**: a white speech-bubble sticker ("Reply to @user" + the comment in big type). It pops out of its tail at full white, then lifts into the hook zone (top third) with a slight hand-placed tilt.
- **Variant 1 · Comment stack**: three smoked-glass comments of one shared width load in as a single list. One gets picked: the others dim and soften. Its Reply pill is tapped (press and flash), fills with the sunset gradient and becomes "▶ Video reply" in ink type on that tap. As the result, the others clear and the pick grows to the full safe width (comment at about 54 px) as it drops just above the caption zone.

1080×1920, 30 fps, 6.5 s. Everything stays inside the 9:16 safe zone (x 72–936, y 230–1480).

## CONFIG fields (top of the `<script>` in `index.html`)
`CONFIG.variants["0"]` (Reply sticker)
- `plate`: sample clip under the overlay (`assets/plates/...`)
- `label`: grey lead-in before the handle ("Reply to")
- `user`: the commenter's handle
- `initial`: the letter in the avatar
- `comment`: the question your video answers (wraps if long; the card hugs the text up to 860 px)
- `dockTop`, `dockScale`, `dockRotate`: where the sticker settles (y px), its docked size, and its tilt in degrees

`CONFIG.variants["1"]` (Comment stack)
- `plate`: sample clip
- `comments[]`: `{ user, initial, tint, time, text, likes, pick }`. Mark exactly one with `pick: true`; it is the one that gets answered. `tint` is the avatar colour (keep it muted; the sunset accent belongs to the pill). At the default width, a comment of about 24 characters stays on one line. Longer ones wrap onto balanced lines, and that card gets taller.
- `replyText` / `answeredText`: pill label before and after the tap ("Reply" → "Video reply"). The filled pill always uses ink type for contrast on the sunset.
- `stackWidth`: the one width every card shares (default 700, centred in the safe zone)
- `stackCenter`: y centre of the stack while it loads
- `dockBottom`: bottom edge of the docked comment (keep ≤ 1480)
- `dockMaxScale`: the upper limit on how much the picked comment grows when it docks (default 1.3). The card is also capped at 860 px wide, so at `stackWidth` 700 it grows 1.23x.

`CONFIG.timing` (seconds)
- Shared: `in` (entrance, 0.07), `out` (fade-out, 6.05), `end` (composition length 6.5; also update `data-duration` on `#root`, the videos and `#ov` if you change it).
- `timing["0"]`: `dock` (1.4): the hold clears and the sticker lifts to the hook zone.
- `timing["1"]`: `pick` (1.0: the others dim and the pick steps forward), `swap` (1.2: the tap, so the pill fills and becomes "▶ Video reply"), `dock` (1.6: the others clear and the pick docks).

## Render
From this folder:
- Transparent overlay to drop on your own clip:
  `npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o reply-sticker.webm`
  `npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o comment-stack.webm`
  The transparent export has no dimmed hold: only the sticker or cards are drawn, so your clip stays untouched underneath. If you want the "dim, then reveal" beat, add it in your editor (or render with `bg: "plate"` and your own clip).
- With the sample footage:
  `npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -q high -o out.mp4`

## Swap in your own clip
Put your vertical clip in `assets/plates/` (e.g. `assets/plates/my-answer.mp4`). Set the variant's `plate` to that path, and change the `src` of `#plateA` (variant 0) or `#plateB` (variant 1) to the same path. The script shows only the video whose `src` matches the variant's `plate`. Keep it muted. Clips should be at least 6.5 s long.

## Keywords
comment reply, reply to comment, replying to, video reply, reply pill, viewer question, Q&A, answer video, comment sticker, comment stack, comment card, speech bubble, social overlay, TikTok reply, Shorts reply, GTA 6, Leonida, transparent overlay
