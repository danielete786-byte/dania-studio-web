# GTA video components

126 motion-graphics components for GTA videos, all written as code. 76 long-form components, each with a 16:9 version and a 9:16 Shorts version, plus 50 Shorts-only components. They cover what the top GTA channels actually put on screen (captions, counters, wheels, maps, HUDs, title stings, comparison splits) and rebuild each one with real materials, light, depth and physics, in Three.js where that helps.

Every component is a small [HyperFrames](https://hyperframes.heygen.com) project: one HTML file with its CSS, markup and a GSAP timeline. Because it is code, an agent (or you) can change any part of it: the words, the numbers, the colours, the timing, the footage behind it.

## Layout

```
components/NN-slug/        76 long-form components
  long-form/index.html       16:9, 1920x1080
  shorts/index.html          9:16, 1080x1920
  README.md, DECISIONS.md    what it does and why it was built this way
shorts/NN-slug/            50 Shorts-only components (9:16)
shared/fonts, shared/kit   fonts and the look/motion kit the components load from assets/
showcase/                  the gallery page (index.html + a tiny static server)
docs/                      the design guide and the builder/critic briefs used to make them
components.json            index of everything: names, groups, variants
```

## Run one

You need Node 18+.

```bash
# put the shared fonts and kit where the component expects them
./setup.sh components/38-spin-wheel/long-form

cd components/38-spin-wheel/long-form
npx --yes hyperframes@0.9.72 preview        # opens the editor in your browser
npx --yes hyperframes@0.9.72 render . -o out.mp4
```

Shorts-only components pin `hyperframes@0.8.162` in their own `package.json`:

```bash
./setup.sh shorts/27-podium-3d
cd shorts/27-podium-3d && npm run dev
```

Each component takes variables (text, numbers, which variant) through `data-composition-variables` at the top of its `index.html`. Overlay components render with `bg` set to `none` for a transparent file you can drop over your own footage.

## Footage is not included

The sample footage the components were designed over (clips cut from Rockstar's official trailers) is not in this repository, so `assets/shots/`, `assets/plates/` and `assets/clips/` are empty after setup. Either:

- render overlays with `--variables '{"bg":"none"}'` and composite them in your editor, or
- put your own clips in `assets/shots/` with the file names the component references (search its `index.html` for `assets/shots/`).

A few components keep small still images (thumbnails, frames) in their `media/` folder because the component's layout needs them.

## The showcase page

`showcase/` is the gallery you may have seen in the video: every component on a dark stage, in a ranked grid. It expects tile loops in `showcase/media/` built from your renders with `showcase/tools/review_tiles.py`. Serve it with `node showcase/serve.mjs` (plain `python -m http.server` won't do: video seeking needs HTTP range requests).

## How they were made

Each component was briefed from research on what top GTA creators put on screen, built, then judged by a separate blind critic against real frames from those videos, and fixed until it passed. The design guide (`docs/DESIGN-long-form.md`, `docs/DESIGN-shorts.md`) and the briefs (`docs/BUILDER.md`, `docs/CRITIC.md`) are included so you can build new ones the same way.

## Licence

The code is MIT (see `LICENSE`). The fonts in `shared/fonts` are under the SIL Open Font License. Grand Theft Auto is a trademark of Take-Two Interactive; this project is not affiliated with Rockstar Games or Take-Two, and no Rockstar footage, logos or typefaces are included.
