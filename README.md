# DanIA Studio · Web
Vite + React + TypeScript + Tailwind + GSAP ScrollTrigger + Lenis + three.js.

    npm install
    npm run dev      # desarrollo
    npm run build    # genera dist/

Todos los textos, cifras, email y enlaces se editan en `src/content.ts` (busca `TODO`).
Se publica en GitHub Pages desde la rama `gh-pages` (contenido de `dist/`).
Si cambias el nombre del repo, ajusta `base` en `vite.config.ts`.

## Webs de muestra para clientes
Cada demo es una página más del mismo build (ver `build.rollupOptions.input` en `vite.config.ts`):

- `demos/vegawagen/`: taller Vegawagen (Churriana de la Vega). El código está en `src/vegawagen/`, los textos en `src/vegawagen/content.ts`, y la investigación y los argumentos de venta en `demos/vegawagen/NOTAS.md`.
  En local: `npm run dev` y abre `http://localhost:5173/dania-studio-web/demos/vegawagen/`
  Versión de un solo archivo (para enseñarla sin servidor): `node scripts/build-standalone.mjs vegawagen` → `demos/vegawagen/vegawagen-demo.html`
