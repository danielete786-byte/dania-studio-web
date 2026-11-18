# DanIA Studio · Web
Vite + React + TypeScript + Tailwind + GSAP ScrollTrigger + Lenis + three.js.

    npm install
    npm run dev      # desarrollo
    npm run build    # genera dist/

Todos los textos, cifras, email y enlaces se editan en `src/content.ts` (busca `TODO`).
Se publica en GitHub Pages desde la rama `gh-pages` (contenido de `dist/`).
Si cambias el nombre del repo, ajusta `base` en `vite.config.ts`.

## Estudio de vídeo (motion graphics)

En `video/` hay un estudio de vídeo con [Remotion](https://remotion.dev): vídeos hechos con React y exportados a MP4.

    cd video
    npm install
    npm run studio       # editor visual: cambia textos y previsualiza
    npm run render:all   # exporta todo a video/out/

Composiciones incluidas: `LogoIntro` (logo 3D, 16:9), `LogoIntroVertical` (9:16), `BrandPromo` (Short/Reel 9:16),
`TitleCard` y `Thumbnail` (rótulo / miniatura). Para crear vídeos nuevos con Claude Code se usa la skill
`.claude/skills/motion-video` (basta con pedir: "hazme un short de…").
