# 13 · Source tag (craft v2)

A per-clip credit for GTA 6 compilation shorts. On the first clip, the credit arrives at title scale, like a trailer end card. On the cut it collapses into a safe corner, where it holds as a quiet credit for the rest of the clip and changes on every cut. Use it on "every detail from the trailers" edits, "best GTA 6 clips" compilations, or any short that reuses someone else's footage. Viewers see where each clip came from, and the credit never fights the footage after its first moment.

| Variant | Name | Look | Docks to | Sample footage |
|---|---|---|---|---|
| `0` | Footage chip | Rockstar end-card credit style: an outlined **FOOTAGE** chip and the source in tracked wide caps; the detail ("TRAILER 2") in wide Archivo caps with Rockstar's magenta offset; a running source timecode in mono. Re-credits on every cut. | top-left (x 72, y 252) | `s055` Trailer 2 night → `s011` Trailer 2 highway → `s135` PlayStation Features Trailer → `s074` Launch Trailer |
| `1` | Handle tag | Creator credit: "CLIP VIA" and the @handle in tight Inter display with a sunset "@"; it docks beside a monogram avatar whose ring draws in | bottom-left (bottom edge y 1460) | golden-hour cut: `s027` → `s084` → `s108` → `s026` → `s036` |

**Timeline (7 s, 30 fps):**
- **0.1 s:** the announce. The chip/label row blurs in, the hero rises out of its mask by character, and the timecode settles.
- **Dock on the cut into clip 2** (1.6 s in v0, 1.85 s in v1). This is the payoff: every row flies to its docked twin (0.5 s `expo.inOut`) with a travel smear. On plate renders there is an exposure flash, a shake and a punch-zoom, and an RGB split on the type. v1 adds a sunset light leak, and its avatar pops in with a drawn ring.
- **Every later cut (v0):** the source and detail hard-swap on the cut frame, settle out of a soft blur and take a decaying RGB split. The timecode jumps to the new clip's real source time.
- **6.35 s:** exit, blurring out row by row. Gone by about 6.85 s.

**Plate renders** use the 4K graded shots, a slow push on every shot, and the Look finishing layer (grain and vignette). **`bg:none`** is a clean transparent overlay: no footage, grain, vignette, flash or leak. Only the soft legibility scrims behind the type remain.

## CONFIG fields (top of the `<script>` in `index.html`)
- `variants["0"]` (Footage chip)
  - `chip`: the outlined label, default `"Footage"`.
  - `timecode`, `tcLabel`: show the running source timecode row, and its label (`"TC"`).
  - `announce`: `{ align: "center", top: 392 }` sets the position of the title-scale credit on the first clip. Set `announce: null` for a corner tag only; it then rises in at `timing.in`.
  - `clips`: one entry per clip, in order: `{ video, source, detail, srcIn }`.
    - `video`: the id of the `<video>` that plays the clip. Its `data-start` is the cut time.
    - `source`: who owns the footage (`"Rockstar Games"`, `"PlayStation"`).
    - `detail`: which video (`"Trailer 2"`, `"Features Trailer"`, `"Launch Trailer"`).
    - `srcIn`: where the shot starts in that source video, in seconds. The TC row shows `srcIn + data-media-start + time into the clip`.
    - When source or detail changes between clips, the tag swaps on that cut. When neither changes, only the timecode jumps.
  - `corner`: `"tl"`, `"tr"`, `"bl"` or `"br"`. Right corners right-align the rows.
  - `size`: `bigRow`, `bigHeroMax`, `bigHeroWidth`, `bigTc`, `dockRow`, `dockHeroMax`, `dockHeroWidth`, `dockTc`. The heroes are measured and fitted, so long details stay inside the safe width.
- `variants["1"]` (Handle tag)
  - `label` (`"Clip via"`), `handle` (`"@everestchris6"`), `initials` (the avatar monogram, `"EC"`).
  - `clips`: the `<video>` ids of the creator's clip. `corner`, `announce` and `size` work as in v0 (`dockRow`, `dockHero`).
- `safe`: the docking insets (`left 72`, `right 936`, `top 252`, `bottom 1460`), inside the 9:16 safe zone.
- `timing`:
  - `in`: the announce start.
  - `dockClip`: the tag docks on the cut into this clip index; default 1.
  - `travel`: the flight time.
  - `out`: the exit start.
  - `end`: the total duration.
- `colors`: `magenta` (the Rockstar offset), `sunset` (the "@" fill), `leak` (the v1 light leak).

## Render
```bash
# transparent overlay to drop on your own clips (CapCut / Premiere)
npx hyperframes render . --variables '{"variant":"0","bg":"none"}' --format webm -o footage-chip.webm
npx hyperframes render . --variables '{"variant":"1","bg":"none"}' --format webm -o handle-tag.webm

# with the 4K sample footage and the finishing layer
npx hyperframes render . --variables '{"variant":"0","bg":"plate"}' -o out.mp4
```

## Use your own clips
- **As an overlay (recommended):** set each `<video>`'s `data-start` and `data-duration` to your edit's cut points, and fill in `clips` with the matching `source`, `detail` and `srcIn`. Render with `bg: "none"` as WebM and place it above your clips. The tag swaps exactly on your cuts. For a different creator, change `handle` and `initials`.
- **Baked in:**
  1. Put your 9:16 clips in `assets/`.
  2. Point the variant's `<video class="clip shot">` tags (`a1`–`a4` or `b1`–`b5`) at them. Keep `data-media-start + data-duration` inside each clip's length, so no frame freezes.
  3. Add or remove `<video>` tags as needed, and list their ids in `clips`.
  4. Render with `bg: "plate"`.
- **Longer or shorter:** change `data-duration` on `#root` and `#ov`, then move `timing.out` and `timing.end` to match.

## Keywords
source tag, footage credit, source credit, per-clip credit, credit chip, courtesy bug, corner bug, trailer credit, timecode, source timecode, "Footage: Rockstar Games · Trailer 2", Launch Trailer, Features Trailer, PlayStation, creator handle, @handle tag, clip via, clip by, attribution, watermark, title-to-bug dock, FLIP, end-card type, magenta offset, compilation scaffolding, GTA 6, GTA VI, overlay, transparent, 9:16, Shorts, TikTok, Reels
