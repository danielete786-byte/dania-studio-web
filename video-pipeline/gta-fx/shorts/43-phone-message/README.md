# 43 · Phone message

An in-game-style phone moment: a text from Lucia lands on screen. Use it when a short needs a story beat between clips, for example "Lucia when the pre-load finishes", a release-eve hook, a "who's texting Jason" meme cut, or a setup line before a mission clip. 1080×1920, 30 fps, 7 s, and it loops clean (in at 0.08 s, out by 6.9 s). The first words are readable by about 0.3 s (v0) and 0.65 s (v1).

| Variant | What it shows | Best for |
|---|---|---|
| `0` Notification | Each text drops in as its own smoked-glass banner with a haptic nudge (0.08 s, 2.0 s, 3.8 s). Older banners step back into a visible stack under the newest one. | A quick hook over any clip. It sits in the upper third and leaves the footage clear. |
| `1` Thread | A handset rises into frame. Lucia types ("…" dots), you type a reply in the composer and send it (a sunset bubble plus "Delivered"), she answers, and then she starts typing again until the exit. | A 5–7 s story beat. The phone carries the frame. |

## CONFIG (top of the script in `index.html`)
- `contact.name`, `contact.subtitle`: the name on the banner or header, and the line under it in the thread header ("Vice City").
- `contact.avatar`: a square image (default `assets/avatar/lucia.jpg`, a still from the sample trailer plate). Set it to `""` for a sunset monogram that uses `contact.initial`.
- `contact.carrier`: the fictional in-world network tag (default "Leonida", shown in wide-tracked caps). It appears as "LEONIDA · NOW" on the banner and after the clock in the thread's status bar. Set it to `""` to hide it.
- `variants["0"].messages`: one to four strings, one banner each. The first lands at `timing.in`, the second at `timing.second`, and each later one `timing.next` seconds after that. Keep each to about 40 characters (two lines). `time` is the label after the carrier tag ("now").
- `variants["1"].messages`: an array of `{ from: "them" | "me", text }`. Her texts get a typing indicator for `timing.typing` seconds. Yours are typed into the composer at `timing.cps` characters per second, then sent. Four messages fit the 7 s timeline. Keep each to one line (about 24 characters).
- `variants["1"].statusTime`, `stamp`, `placeholder`, `delivered`: the status-bar clock, the date chip above the thread, the empty-composer text, and the receipt under your last text.
- `variants["1"].typingAfter`: `true` shows her typing again after the last message, so the final hold stays alive.
- `variants[*].plate`: the sample footage path (used only when `bg` is `"plate"`).
- `timing` (seconds unless noted): `in` is the first motion; `second` and `next` time the Notification banners; `typingAt`, `typing` and `read` set when the first typing bubble appears, how long the dots show and the pause after each of her texts; `cps` is your typing speed in characters per second; `out` is when the exit starts; `end` is the end of the clip.

## Render
```bash
# transparent overlay to drop on your own clip (CapCut / Premiere)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o notification.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o thread.webm

# with the sample footage underneath
npx hyperframes render . --variables '{"variant":"1","bg":"plate"}' -q high -o thread.mp4
```

## Use your own clip
Either render with `bg:"none"` and lay the WebM over your footage in your editor, or point `variants[n].plate` at your own 1080×1920 clip in `assets/plates/` and change the matching `<video src>` (plateA is variant 0, plateB is variant 1). Keep `muted`, `class="clip"` and the `data-*` timing attributes.

## Notes
- The messages are fan-made content in a fictional character's voice. They are not Rockstar dialogue. The only facts in them are the real release date (Nov 19, 2026), the live pre-load and Vice City.
- There are no real app or OS logos. The app badge is a plain speech-bubble glyph on the sunset gradient.
- All type is Inter: 44 px for names and messages, 34 px for the composer (Thread only), and 24 px for small labels in the in-world voice (600, caps, 0.3em tracking: LEONIDA, VICE CITY, the date stamp, DELIVERED).
- "LEONIDA" is a fictional network name based on the game's state. It is not a real carrier or logo.

Keywords: GTA 6, GTA VI, phone, text message, notification stack, Leonida, iMessage style, notification, banner, chat thread, Lucia, Jason, typing indicator, in-game phone, overlay, transparent, story beat, hook.
