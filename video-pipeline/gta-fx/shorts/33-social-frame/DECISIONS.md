# Social video frame: decisions

## Concept
One object made with care: the clip shown as a post in the vertical social feed Rockstar puts inside its GTA VI trailers. It is a rounded clip card (radius 36) over a blurred, bright copy of the same clip. The post UI sits inside the card: an illustrated emblem avatar, a fictional handle, an outlined gold Follow pill, the caption, a counts line, and glass comment and heart buttons at top-right.

References:
- `social-post-overlay-blur-fill/QdBZY2fkU-0-42.2` (Rockstar's "DadBodSquad" post): bright, full-bleed footage with only a thin bottom fade; bottom-left icon avatar + handle + **gold-ringed Follow**; one-line caption; two round icon buttons at top-right.
- `QdBZY2fkU-0-59.1` ("LuchaLibreFan", the LIVE view): gold Follow pill at top-left, a red LIVE badge beside the handle, and a two-line caption.
- `u1eoe7fM5cM-45`: the creator re-use, which puts the post over a blurred side fill.

Those frames are flat screenshots. Ours adds card material (a contact shadow plus a large soft shadow, a 1 px inner highlight), glass buttons, and real states: Follow becomes Following, the like fills, and the counts step.

## Key decisions
- **The footage carries the frame (r02, v1 deepened r03).** Scrims are fades, not veils. The top fade is 150 px with a max of .26. Text legibility comes from `--shadow-type`, a three-layer soft shadow, and the chat rows use the same shadow. Scrim stops are per variant in `CONFIG.variants[n].scrim`:
  - **v0:** 32% of the card, stops 0 / .50 at 60% / .72 (unchanged since r02; the critic called v0 close to shippable).
  - **v1 (r03):** 50% of the card (621 px), stops 0 / .45 at 35% / .78. The critic named a concrete defect: the 3-line live chat sat on the bright palm-print shirt with almost no scrim. This is the one place r02's "thin scrims" call is reversed, and only for v1.
- **One accent, Rockstar's gold Follow ring (r02, tightened r03).** Both variants use the reference's gold `rgba(254,183,71,.92)` only on the Follow pill:
  - **Follow** is a 2.5 px gold ring.
  - **Following** keeps a 1.5 px gold hairline, so the accent never switches off to grey.
  - **r03:** v0's liked heart button now fills **white**, not gold (the reference's icons are white). Chat avatars lost their five pastel tints.
  - The Leonida pink→orange core appears in two small, deliberate places: the 64 px avatar badge (it is the account's "profile picture", like the reference's coloured luchador badge) and the 0.5 s double-tap heart burst, which is v0's one accent moment.
  - Red `#FF3B3B` is used only for the LIVE badge (state colour, per DESIGN.md, and the reference's LIVE is red too).
- **One continuous shot per post (r02).** Every in-world post Rockstar shows is a single shot, so neither variant ever cuts:
  - **v0:** p09's first shot (0–4.1 s: police truck hit and flipped on a bright Vice City street) plays at `data-playback-rate="0.74"`, so 5.5 s of comp uses 0–4.05 s of source.
  - **v1:** p05's palm-shirt shot (0–5.03 s) plays at 0.9, using 0–4.92 s.
  - The fill and the card videos share `src`, `data-media-start` and rate, so they stay frame-locked. The `duplicate_media_discovery_risk` lint warning is expected.
- **Duration 5.5 s (r02, was 6.0).** This is the longest comp both single shots cover without a cut at sane rates.
- **Emblem avatars (r03).** Rockstar's in-world avatars are illustrated badges (a reclining silhouette, a luchador mask), not letters. Each avatar is now a 64 px disc on the Leonida core `#F84FA4` → `#FE8E4E` with a white 42 px SVG glyph and a 1.5 px white .55 ring: a **palm** for LeonidaLarry (v0) and **sunglasses** for GellhornGossip (v1). Glyphs live in the `EMBLEMS` map (24×24 paths), so a creator picks one or pastes their own. Glyphs are SVG, not text, so the r02 white-on-peach contrast problem no longer applies. The letter monograms and `#avInit` were deleted.
- **Neutral chat avatars (r03).** Every v1 commenter gets the same 36 px disc: `rgba(255,255,255,.22)` with a 1 px `rgba(255,255,255,.30)` ring and a small white .72 person silhouette (the generic "default user" badge). `chatTints` was deleted.
- **Stepped counters (r02, masked r03).** Counts rest, then step:
  - v0 likes: +85–96 every 0.6 s from 0.8 s.
  - v1 viewers: +57–64 every 0.9 s from 1.0 s.

  **r03 fix (defect):** r02's stacked glyphs crossfaded with no clip, so for ~3 frames outgoing digits ghosted above the line. Each digit now sits in its own 36 px window (`.rs { overflow: hidden }`, marked `data-layout-allow-overflow`) and moves with translateY only, no crossfade. The old digit slides up and out in 0.11 s (power2.in); the new one rises in just behind it (0.14 s power3.out from +0.06 s), so a column shows about one glyph at a time. The window's 7 px top and bottom margins, outside the resting glyph, carry a soft mask, so a passing glyph feathers rather than hard-cuts. Rightmost digit first, 0.02 s cascade. The shadow is a `filter: drop-shadow` on the parent `.num`, so the clip never cuts it. Figures are tabular, so widths never jitter.
- **Type weights follow Rockstar's in-world UI (r03).** Handle 600 (was 700), caption 400 (was 500) at the same 42 px, meta 500 (was 600), count 600 (was 700), Follow label 500, chat names 600 / text 500, LIVE 700. The reference's caption is regular weight; ours was louder than it.
- **Heart burst is the accent moment (r03).** r02's flat white heart held for ~0.7 s and dissolved into the grey smoke. Now it is a 250 px heart filled `#F84FA4 → #FE8E4E → #FEB747` with `drop-shadow(0 8px 24px rgba(0,0,0,.40))`. It pops 0 → ~1.15 → 1 in 0.18 s (`back.out(2.2)`, which peaks at +15%), rises 40 px, and is fully gone 0.5 s after the tap.
- **Chat window (r03).** `#chat` bleeds 40 px left and right and 20 px down so text shadows are never cut. Its top 24 px is a soft mask, so the oldest line feathers out at its top and a leaving line slides away into nothing. The oldest of the three visible lines sits at `CONFIG.chatOldest` = .75 (was .6).
- **Follow/Following never double-expose (r02).** "Follow" leaves from fa+0.04 to fa+0.18 and "Following" starts at fa+0.20, so one clean empty-pill frame sits between them.
- **Captions balance (r02).** `.caption` is max 700 px with `text-wrap: balance`, and there are no forced breaks. v1 wraps to "He's been arguing with / this truck for an hour".
- **Cheap, bright blur.** The fill is drawn at 1/4 size, blurred 11 px and scaled ×4 (about 44 px of blur), with brightness 1.0 and saturate 1.5. It drifts from 1.12 to 1.19, so it never freezes.
- **Card sizes.** v0 is 864×1152 (3:4) at y 290, with the clip at `object-position: 50% 34%` to keep the flip in frame. v1 is 828×1242 (2:3) at y 236. All text sits inside x 148–932, y 270–1440.
- **Type: 2 sizes.** Inter 600/400 at 42 px for the handle and caption, and Inter 500/600/700 at 30 px for Follow, meta, counts, chat and LIVE (weights lightened in r03).
- **Fictional in-world handles:** `LeonidaLarry` (v0) and `GellhornGossip` (v1; Port Gellhorn is a real Leonida place from FACTS.md). Captions and chat are fan-voiced jokes. Nobody real is quoted, and nothing poses as an official Rockstar post.
- **p02 is rejected:** it is the GTA VI logo lockup (no-trademarks rule).
- **Loop-matched entrance (r03).** The card starts at opacity 0, scale .94 at frame 0, so frame 0 matches the fill-only last frame and the loop does not step. It is visibly there by frame 1 (expo.out) and settles by 0.42 s. This reverses r02's "on screen from frame 0 at 0.4", because the critic named the loop step as a concrete defect.
- **Loop-clean exit.** The UI fades at 5.0 s and the card fades into the fill by 5.44 s, still inside the same shot, so the last frames are fill only.
- **`bg: "none"`** hides the blurred fill. The card, with its footage, stays on a transparent background.

## Variants
- **0 "Reel post"** (p09):
  - Handle row: palm emblem avatar, LeonidaLarry, gold Follow.
  - Caption: "Normal Tuesday in Vice City."
  - Meta: "248,xxx likes · 3,914 comments · 2h", stepping.
  - Beats:
    - A double-tap at 1.5 s pops the Leonida-gradient heart (gone by 2.0 s) and fills the heart button white.
    - The truck flips around 3.6–4.2 s.
    - The gold Follow holds through the hero and is tapped at 4.45 s, becoming a gold-hairline "Following".
- **1 "Live stream"** (p05):
  - Gold Follow at top-left, tapped at 1.4 s, becoming a gold-hairline "Following".
  - Sunglasses emblem avatar, the handle with a red LIVE badge, and a balanced two-line caption.
  - Meta: eye icon and "12,xxx watching", stepping.
  - Six live comments arrive every 0.7 s from 0.9 s, each with the same neutral avatar. Each one lifts the stack: three show at once, the oldest sits at .75 under a 24 px top feather, and then it slides up into the mask and leaves.

## Round log
- **r01:** first build. It used p07 (montage) for v0 and p05 at 0.82 for v1, at 6.0 s. Self-review fixed the Follow pill measurement, the card aspect (4:5 to 3:4), fill brightness and chat avatar letters.
- **r02:** fixes from the critic (both 7/10). Biggest gap: dimmed footage and a switched-off accent.
  - **Defect: v0 plate cut inside the exit (5.7 s), and three cuts in one post.** p07 has no single shot longer than 1.5 s, so v0 moved to p09's single bright 4.1 s shot. This reverses the r01 "montage is the format" call, because the critic named concrete defects: a cut inside the exit, a montage in one post, and an out-of-focus hero. The comp is now 5.5 s, so neither variant cuts.
  - **Defect: Follow/Following double-exposed.** Fixed: "Following" now starts at fa+0.20.
  - **Gap: footage under 50–60% scrims.** The scrims are now 32% / 38% of the card at .50/.72, and the top fade is 150 px at .26.
  - **Gap: grey "Following" in the hero.** The accent is gold for both variants and survives the tap as a hairline. v0 holds "Follow" through the hero.
  - **Avatars:** photo crops became graphic initial discs.
  - **Counters:** per-frame ticking became stepped per-digit rolls.
  - **v1:** dropped the red meta dot. The caption is balanced with no forced break.
  - **Hero time:** 4.1 s (v0: truck mid-tumble over a bright street with police cars behind, gold Follow; v1: settled 3-comment stack, gold-hairline Following, 12,720 watching).
  - **Known limit:** in p05 the man drifts to the right edge after about 3 s, so v1's hero shows his shirt and gesture, but his face is half out of frame. The plate uses its full width, so there is no room to reframe.
- **r03:** fixes from the critic (v0 7/10, v1 6/10; the reference won both blind picks). Biggest gap: letter-monogram avatars and v1's pastel chat dots read as a generic UI kit, not Rockstar's in-world app.
  - **Defect: counter ghosting.** Each digit is now clipped to a 36 px window and slides with translateY only (out, then in, no crossfade), with a feathered window edge. Checked frame by frame at v0 4.4–4.6 s and v1 3.6–3.9 s: nothing renders above or below the line.
  - **Defect: loop step.** The card starts at opacity 0 at frame 0.
  - **Gap: avatars.** Monograms became white SVG emblem badges (palm, sunglasses) on the Leonida core. Chat avatars became one neutral disc with a silhouette, and `chatTints` is gone.
  - **Gap: one accent.** The liked heart button is white, so gold is only on Follow. v1 now carries gold Follow, red LIVE (state) and the small emblem badge, nothing else.
  - **v1 legibility:** the scrim is 621 px with stops 0 / .45 at 35% / .78. The oldest comment sits at .75 with a 24 px top feather.
  - **Heart burst:** gradient fill, a 0.18 s pop, a 40 px rise, gone in 0.5 s, with a soft drop shadow.
  - **Type:** lighter weights throughout (handle 600, caption 400, meta 500).
  - **Lint:** the header comment was shortened to stay under the 300-structural-line lint limit.
  - **Hero time:** 4.1 s again (v0: truck mid-tumble, gold Follow, palm badge; v1: settled 3-comment stack over the deeper scrim, gold-hairline Following, 12,720 watching).
  - **Still a known limit:** in p05 the man's face is half out of frame after about 3 s (see r02).
