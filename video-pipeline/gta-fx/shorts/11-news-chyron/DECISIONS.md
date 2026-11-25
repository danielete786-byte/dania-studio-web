# Decisions · 11 News chyron

## v2 concept
- **The idea: a real broadcast break-in, cut like an edit.** v0 opens on a network "special report" wipe: a full-height red slab parks over the footage (tinted police blue), carrying the VCN logo box and SPECIAL REPORT, then sweeps on. The shots cut under it and its trailing edge uncovers bright daylight as a full-bleed VCN chyron chases it in and locks with a slam. v1 is a live feed: aerial and highway B-roll under a LIVE bug with a ticking clock, and a blue slab (Rockstar's own in-world MEGA NOTICIAS bar) whose "1.5M" spins on reels and slams on the first cut, over a crawl.
- **Shots.** v0: s014 drive-by past police under the police-blue duotone (0–1.15, behind the parked wipe) → s096 police street, daylight (1.15–2.15; revealed by the wipe's trailing edge at 1.19–1.35, payoff at 1.66) → s098 Jason and the fireworks (2.15–3.2) → s119 police SUV charging (3.2–5.35) → s064 jetski under a helicopter (5.35–7.0, the bright close). v1: s135 skydive over Vice City (0–1.5) → s011 Vice City highway (1.5–4.6) → s075 marina aerial (4.6–6.3) → s100 biplane over the beach (6.3–7.0). The deck lines (v0) swap on the 3.2 and 5.35 cuts.
- **Where the type sits.** The chyron bleeds off the left edge of the frame and stops hard at x 936 (clear of the like/share rail), bottom at y 1446. The VCN logo box sits on the red band as a tab (y 916–1052). Every shot is cast so its subject sits in the top two thirds (the police car roof, Jason's face, the SUV, the jetski couple and the helicopter), and the lower third falls on road or water. On the wipe, the type sits on the parked slab at the x 72 column, upper third, with the footage visible to its right. The v1 LIVE bug sits top-left at y 236, like a real broadcast bug.
- **Hero size and face.** v0: the headline at 120 px Archivo (normal width, 800), two lines on a paper slab, about 88% of the safe width; SPECIAL REPORT at 108 px Archivo wide 900; the VCN mark at 64 px. v1: "1.5M" at 220 px Inter display 800, locked up with a three-line Archivo condensed block. Labels, deck and ticker 30 px. Two families, at most three sizes per frame.
- **Payoff.** v0 at 1.66 s, on the graphic: the paper slab locks, "TOMORROW" slams in (scale 1.08 → 1, y 16 → 0, 0.28 s expo.out), with shake, a 1.03 punch, an exposure hit on the footage and a 6 px RGB split. v1 at 1.5 s: the reels stop on "1.5M" on the cut to the highway, with the same impact and a scale punch.

## v2 round 4 (critic r03: v0 7, v1 8 and now LOCKED; no defects, no hard caps)
**v1 is frozen.** Every change is behind the v0 branch (new v0-only selectors, elements hidden in v1, the v0 JS branch). The capture's VS-PREV line reads v1 0.99 (unchanged; the per-frame differences are encode noise, the graphics are identical).

**Biggest gap (v0): a stock red-duotone card, a payoff on an empty frame, a murky hold, flat fills and no real network bug.** What changed:
- **The stinger is now a broadcast wipe, not a full-frame card.** A full-height red slab (#F2303C → #C9131F, a paper leading edge, an ink trailing band) enters from the left (0–0.42, expo.out, motion blur), parks with its leading edge at x ≈ 760 and drifts 22 px, then sweeps on to the right (0.92–1.35, power2.in). It carries the open: the VCN logo box and SPECIAL / REPORT at 108 px, plus a tone-on-tone VCN running up its leading edge with a slight parallax, the way network opens carry a giant tonal mark. The tonal mark is drawn as generated content (`::before`), so the lint doesn't read decorative texture as low-contrast text.
- **Shot recast.** s014's dusk murk only shows in the strip to the right of the parked slab, under a police-blue duotone (grey → multiply #5A86FF → screen navy). Blue against the red slab gives a police red/blue frame, where red-on-red duotone had lost the slab's edge. The shots cut at 1.15, while the slab covers the whole frame (it is 1500 px wide), and the trailing edge uncovers s096 in daylight at 1.19–1.35: "the hard cut lands on its trailing edge".
- **s096 can't hold 1.35–3.5.** The file is 1.77 s long, its first 0.45 s has a bin and passers-by crossing the lens, and from 1.5 s silhouettes cross it. So it plays its clean middle (media 0.5–1.5): the police car under blue sky arrives on the payoff. The hold then cuts on rhythm to s098 → s119 (SUV charging) → **s064 jetski under a helicopter**, the brightest, sharpest shot, which closes the piece and gives the hero frame (6.2 s).
- **The payoff is on the graphic.** The chyron chases the wipe's trailing edge in from the left (1.27). The paper slab slides in over 0.34 s and locks at HIT = 1.66, when "TOMORROW" slams in. At the same moment: `Look.impact` (amp 8, zoom 1.03, **flash 0**) with `Look.expose` (peak 1.45) on the footage, and a 6 px, 0.2 s chroma split on the chyron. I kept DESIGN.md's critic-tested limits (a white flash of 0.3 or more reads as a grey veil; chroma above 6 px reads as a stock glitch) rather than the suggested flash .35 / chroma 12. The red-band sheen moved to 1.96 as the light moment after the hit.
- **A real network bug.** It follows Weazel's logo-box structure, in our own mark: an ink block (#1A1C25 → #0B0C11, 1 px lit edge) with VCN at 64 px Archivo 125% 900, a 6 px red underline, and the clock in a 40 px sub-cell. It sits on the red band as a tab, bleeding off the left edge like the bands, with its content on the x 72 column. The same object opens the stinger, so the brand carries from the wipe into the chyron. The clock left the red band and the VCN text left the deck strip, so the deck now has the full 832 px measure.
- **Bands with material.** Paper #FFFFFF → #E8E6E0; red #F2303C → #C9131F with a 1 px rgba(255,255,255,.28) top edge; ink deck #181B24 → #0B0C11; a 2 px ink hairline at the top of the paper and deck bands. The paper is 266 px (was 280) and the deck 64 px, so the stack with the box still ends at y 1446.
- **Timing.** The deck swaps on the 3.2 and 5.35 cuts. v0 exits at 6.5 (a v0-only `out`; v1 keeps 6.42), so the last deck line holds about 1 s. The square blinks from 2.16. The hero frame (6.2) is on the square's on phase.

**Not taken:** v1's numeral 236 px / words 58 px and its sheen (v1 is locked); the shared "both variants" bug and material fixes apply to v0 only for the same reason.

## v2 round 3 (craft-v2 rebuild; v1 r02 scored 7/7 but the owner called v1 "basic, not professional or clean")
**Rebuilt from scratch.** Kept from v1: the VCN station, the real content (FACTS.md), the ticking clock and its fixed min-width, the "already running" ticker, and both variant ideas (Weazel-style breaking bar; Rockstar's MEGA NOTICIAS blue bar with a red rule). Everything visual is new.

**Geometry: broadcast slabs, not cards.** The r02 critic's biggest gap was "rounded web cards with a 46 px shadow". Every band is now flat and square-cornered, bleeds off the left edge of the frame (as real lower thirds do) and stops hard at x 936, clear of the like/share rail. The full-width red band carries both BREAKING NEWS and the clock, so the tab no longer "ends mid-headline and aligns with nothing". The shadow is a 1 px contact plus a soft 30 px drop.

**v0 Breaking bar.**
- **Stinger (0–1.35 s).** s096 police street turned into a red duotone with three blend layers (saturation to grey, multiply by #FF2534, screen a deep maroon into the blacks) plus an edge shade. "BREAKING / NEWS" at 112 px Archivo wide 900 with a soft white bloom, masked char rise, "VCN · SPECIAL REPORT" label and a hairline rule. The block sits in the upper third (top 560) so the police car crosses under it, not behind it.
- **Payoff (1.35 s).** A hard cut to full-colour s014 with a 0.5 flash, shake, 1.045 punch-zoom and a 12 px RGB split on the chyron as the three bands slide in from off-frame with directional motion blur.
- **Chyron.** Red band (64 px: blinking square, BREAKING NEWS in Archivo wide 30 px, clock in Inter 30 px tabular); paper slab #F7F6F2 (280 px) with the headline at 120 px Archivo (normal width, 800), "TOMORROW" spanning about 87% of the safe width; ink deck strip (68 px) with VCN, a hairline and the deck line. Two sizes in the hold frame (120 / 30). One sheen across the red band at 1.85 s.
- **Cuts.** s014 → s098 (3.5) → s119 (4.55). The deck swaps on the 3.5 cut and again at 5.0. s098 stops at 1.05 s of media, because a green laser shot starts at about 1.17 s inside that file.
- **Exit (6.42 s).** The bands leave left, bottom first, with motion blur.

**v1 Live + ticker.**
- **The LIVE bug** sits top-left at y 236, like a real broadcast bug: a red LIVE box with a breathing dot, then an ink box with VICE CITY and the ticking clock.
- **The lock-up.** "1.5M" at 220 px Inter display 800, beside EXPECTED / TO CALL / OUT SICK (Archivo at 80% width, 56 px, line-height 1.07, so the block spans the numeral's cap height to its baseline). Subline in Inter 500 at 84% white (the critic asked for MEGA NOTICIAS' quieter subline). Three sizes: 220 / 56 / 30.
- **Payoff (1.5 s).** The digits are real reels (a hidden placeholder keeps each glyph's advance width; the strip is clipped only vertically). They spin from 0.26 s, stop left to right with "5" exactly on the cut to s011, then flash, shake, a 1.07 scale punch (origin 45%, so it never touches the word block) and a 14 px RGB split. On the first capture the reels slowed to 55% speed with light blur, and "1.4M" read sharp for a frame. Now they keep 80% speed and 18→14 px vertical blur until a hard stop, so no wrong figure ever reads.
- **Ticker.** The separators are ink hairlines, so red stays the only accent. The fade mask is 34 / 40 px. The items are shortened so the first one reads whole in the 670 px window. The crawl speed is solved (clamped 110–220 px/s) so that the strip lands on a whole item ("RATED M FOR MATURE 17+") and reaches "PRE-LOAD IS LIVE NOW" exactly on the hero frame. r02 opened mid-word on "ATED M".
- **Cuts.** s135 skydive (0) → s011 highway (1.5) → s075 marina aerial (4.6) → s100 biplane (6.3). On the first capture the last shot was s057 Ocean Drive, where a bare back filled the exit frames.
- **Blue** #1A41D4 picks up the sky in s011 and s135; the 8 px red rule and LIVE are the accent.

**Finishing.** `Look.install` with grain .12 and vignette .4 (plate only), a per-shot push (1.03–1.08), and a bottom scrim that appears only from the cut, so it doesn't muddy the stinger. With `bg:none` there is no grain, flash, shake, tint or scrim: the stinger sits on an 80% red panel, and the chyron bands are opaque.

**Lint fixes.** Deck lines waiting outside the mask are now `autoAlpha` hidden. The checker had read them as occluded text with 1.24:1 contrast. The bands and sheen carry `data-layout-allow-overflow` for the off-frame slides.

**Hero 3.0 s.** v0: the police car's light bar glows above the red band. v1: the plane, the highway signs and the full lock-up, with the ticker reading "PRE-LOAD IS LIVE NOW".

## v1 history: Round 2 (critic r01: v0 7/10, v1 7/10, both won the blind pick, no hard defects)

**Biggest gap fixed: the network now has an identity.** In round 1, "6 / NEWS" read as a generic local-affiliate numeral bug, and next to "GTA 6" it looked like a double six. It is now **VCN · Vice City News**. The wordmark is built like Weazel's (a stacked name, hairline stripes and a bold clock), but it is our own:
- **v0 bug:** "VCN" in Barlow Condensed 900 at 96 px; three 3 px hairline stripes at 40% white; then VICE CITY / NEWS in Inter 700 at 24 px. Each word line is letter-spaced in JS to exactly the mark's width, so the lockup is one solid block. The mark is the same size as the headline, so the frame keeps three sizes.
- **v1 ticker label:** the same lockup without the word, so "VCN" over its stripes at 36 px. The critic suggested an 18 px word here, but DESIGN.md sets 24 px as the minimum, so the small label carries the mark and stripes only.
- CONFIG: `network: { mark, word: [lines], stripes }`.

**Clock (v0, and v1 for consistency).** Changed from JetBrains Mono 600 26 px at 86% white to **Barlow Condensed 700 36 px, solid white, tabular figures**. The v0 clock row grew from 66 to 74 px, and the white deck strip grew to 74 px with it, so the two rows still line up. The body is now 274 px tall and the top of the tab sits at y 1106. The v1 location clock had the same "disappears on a phone" problem, so it got the same treatment, plus a measured min-width so the tab never jitters as the seconds tick. JetBrains Mono is no longer used.

**v1 ticker.**
- Speed is now 150 px/s (it was 118).
- The run is offset so the first item sits whole at the left edge at `tickerReadAt` (2.5 s, the hero frame). The hero now reads "PRE-LOAD LIVE ON PS5 AND XBOX SERIES X|S ▪ OUT…", where round 1 showed a fragment cut at both ends.
- The crawl opens on the tail of the last item, as if the ticker were already running.
- About 1,200 px of crawl passes in 7 s, so CONFIG holds 4 short items, and every one now appears on screen. The README says to keep it to 3–4.

**Sequencing.**
- v0: the BREAKING NEWS tab now rises at 0.12 s together with the bug, so the context label leads.
- v1: LIVE and the location tab lead together.
- Both cascades were compressed (shorter tweens, 0.05 s staggers) and settle by about 0.55 s. Round 1 settled at 0.75 s and 0.9 s.
- The sheen moved from 1.25 s to 1.1 s, and the blink starts at 0.6 s.

**Radii.** v0 `.bar0` now has `border-radius: 0 10px 0 0`. In v1 the red rule and blue bar are wrapped in one `.block1` with the same 10 px top-right radius and overflow clipping. This works because a 6 px rule alone can't hold a 10 px radius. Every outer corner is now 10 px.

**Type sizes.**
- v0: 96 (headline, VCN), 36 (tab, deck, clock) and 24 (wordmark name).
- v1: 84 (headline) and 36 (LIVE, location, clock, subline, ticker, VCN).

**Copy.**
- "Thursday's" is now "Thursday’s".
- "Pre-load is live on…" became "Pre-load live on…" (chyron-terse). The deck now fits at 36 px instead of shrinking to 35 px, which would have added a fourth size.

**Kept on purpose:** the navy L (tab + bug), the Weazel-style red bar + white deck (v0), the Mega Noticias blue bar with red rule and ▸ (v1), the plates (p04 / p10) and the 0.4 s left-wipe exit.

## v1 history: Round 1
**Network.** Our own station was "6 NEWS" (Leonida). Replaced in round 2 (see above).

**Variant 0 · Breaking bar.** It follows the Weazel chyron (refs `news-lower-third/u1eoe7fM5cM-64`, `news-chyron-weazel-live/QdBZY2fkU-0-67.3`) from the top parody short (7.85M views): a station block on the left, a red glossy bar with white condensed caps, and a white sub-strip with ink caps. Changes for 9:16 and a cleaner look:
- The headline runs on two lines (auto-fit, about 96 px) so it reads on a phone.
- The gloss is a soft gradient plus a 1 px top highlight. There is no hard 2008 glass split.
- The bug is a solid ink-navy (#1F202B) block, and the navy "BREAKING NEWS" tab sits on top of it, so the two form one L shape. Red is the frame's only accent.
- The sub-strip cycles to a second line at 3.7 s, as a real chyron does.

**Variant 1 · Live + ticker.** It follows Rockstar's own in-trailer chyron (the MEGA NOTICIAS segment, `news-lower-third/QdBZY2fkU-0-64.8`): a blue gradient bar with a red top rule, a small ▸ lead, condensed caps over a sentence-case subline. The LIVE box comes from `news-chyron-weazel-live/d1klOApHA_g-140.2`, and the ticker from the Weazel crawl. Police red and blue are kept for the news state, per DESIGN.md. The red LIVE tag and rule are the accent, and the blue is the bar's material.

**Content.** It is all from FACTS.md:
- the release on Thursday, Nov 19, 2026;
- pre-load live on PS5 and Xbox Series X|S;
- Trailer 1 at 305.4M views;
- the ESRB M rating;
- the reported survey that 1.5M will call out sick (paraphrased with "expected").

There are no invented quotes.

**Motion.**
- Masked rises and left-to-right clip wipes with `expo.out` / `power3.out`.
- One sheen crosses the red bar.
- A hard blink on the red square and a breathing LIVE dot.
- The clock ticks through `KitMotion.drive`, so it is seek-safe.
- Exit is a 0.4 s `power3.in` wipe to the left from 6.45 s.

**Plates.** v0 uses p04 (drive-by past police at the mural). v1 uses **p10** (police car street) instead of the suggested p02, because p02 holds a full GTA VI logo card at about 4 s, which breaks the no-trademarks rule.
