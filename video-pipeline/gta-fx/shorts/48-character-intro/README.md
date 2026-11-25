# 48 · Character intro (GTA moments)

A full-frame character intro for GTA 6 shorts, 1080×1920, 5.5 s, built in HyperFrames. It always shows footage, taken from the clip paths in CONFIG.

- **Variant 0, "Freeze + name":** the clip plays, then freezes hard on the character: a warm 2-frame flash, a 4-frame shake, a punch-in and a 2-frame grade snap. A big two-line name lands: LUCIA in white and CAMINOS in the Leonida sunset gradient, with one sheen pass, an index row (`01 / 02`) and a role line (`PROTAGONIST · LEONIDA`). The still keeps pushing in (1.06 to 1.14) for a 2.8 s hold, then the name leaves and the footage resumes before the loop.
- **Variant 1, "Switch wheel":**
  - A smoked-glass switch wheel opens over the current character, reading **PLAYING AS / JASON / DUVAL**, and the footage drops to slow motion.
  - The sunset selection arc travels over the top of the wheel to LUCIA, and the centre rolls to **SWITCH TO / LUCIA / CAMINOS**.
  - On confirm, the plate punches 1 to 1.6 into a blur and hard-cuts on a warm 2-frame flash to the new character, who lands 1.25 to 1.
  - The selected portrait then flies up into a **PLAYING AS / LUCIA CAMINOS** HUD chip.

**When to use it:** the first time a character appears in a compilation ("meet Lucia"), at a segment change between the two protagonists, or in "who would you play first" and character-explainer shorts.

## CONFIG fields
`CONFIG` is defined in a `<script>` in `<head>`.

- `duration`: total length in seconds (5.5). It must match `data-duration` on `#root` and `#ov`.
- `freeze.clip`: the clip path for variant 0. It must match every `<video data-cfg="freeze">` src; the script re-applies it.
- `freeze.clipStart`: the second in the clip where playback starts (`data-media-start` of `#v0play`).
- `freeze.freezeAt`: the composition second the picture freezes. The frozen source frame is `clipStart + freezeAt`, which must equal `data-media-start` on the hold and resume tags.
- `freeze.resumeAt` (3.9): when the footage plays again; the overlay is gone by `resumeAt + 0.45`.
  - The hold chain (`#v0hold00..09`: 0.3 s clips, then a final 0.1 s one) must cover `freezeAt` to `resumeAt` exactly.
  - `#v0resume` starts at `resumeAt`.
- `freeze.index`, `freeze.first`, `freeze.last`, `freeze.role`: the text. `last` carries the gradient.
- `freeze.nameSize` (236): the name size. It auto-shrinks so the name fits within `maxWidth` (864, x 72–936).
- `freeze.top`: the y of the index row.
- `freeze.pushOrigin`: where the punch-in aims (the face).
- `wheel.open`, `wheel.select`, `wheel.confirm`, `wheel.out`: the beat times (0.3 / 1.1 / 2.6 / 5.05).
  - The hard cut lands at `confirm + 0.3`; keep it on a frame boundary (2.9 s = frame 87).
  - `#v1lu` should start about 0.1 s before the cut.
- `wheel.playing` ("PLAYING AS"): the kicker while the current character is selected, and the HUD chip label after the switch.
- `wheel.kicker` ("SWITCH TO"): the kicker once the selector reaches the new character.
- `wheel.from` and `wheel.to`: each has `first`, `last`, `plate` (the main footage) and `portrait`:
  - `portrait.clip`;
  - `fx`, `fy`: the face centre in source pixels of a 1080×1920 clip;
  - `span`: how many source pixels fit across the 220 px portrait.

## Render
```
npx hyperframes render . --variables '{"variant":"0"}' -q high -o freeze-name.mp4
npx hyperframes render . --variables '{"variant":"1"}' -q high -o switch-wheel.mp4
```
`bg` is kept for library consistency. This is a full-frame component, so footage always shows: there is no transparent version. Drop your own clip in instead (see below).

## Swap in your own clip
1. Put your vertical 1080×1920 clip in `assets/` and set `freeze.clip`, or `wheel.from.plate` and `wheel.to.plate`, plus the `portrait.clip` values.
2. Do a find and replace of the old path on the `<video data-cfg=…>` tags, so the static `src` matches CONFIG.
3. **Variant 0:** pick the frame to freeze on. Set `data-media-start` on `#v0play` to `clipStart`, and on all `#v0hold..` and `#v0resume` tags to `clipStart + freezeAt`.
4. **Variant 1:**
   - Set `data-media-start` on `#v1jA`, `#v1jB` and `#v1lu` to the moments you want. The `data-playback-rate` values (0.4 for the slow-mo while the wheel is open, 0.65 on landing) can stay.
   - Re-aim the portraits with `fx`, `fy` and `span`.
   - Pick a **well-lit** frame for each portrait (`data-media-start` on `#v1pj` / `#v1pl`): the inactive one is greyed, so a dark frame reads as a black disc.

## Keywords
gta 6, gta vi, character intro, freeze frame, name card, lucia caminos, jason duval, character switch, switch wheel, protagonist, lower third, hud, leonida, vice city, shorts, tiktok, reels
