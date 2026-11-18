---
name: motion-video
description: Crea vídeos motion graphics de nivel profesional para DanIA Studio con Remotion (React → MP4). Úsala cuando el usuario pida un vídeo, intro, short, reel, TikTok, anuncio, rótulo, miniatura, animación de logo o motion graphics.
---

# Motion Video · DanIA Studio

Estudio de vídeo programático en `video/` (Remotion 4 + React + Three.js). Todo vídeo nuevo se construye
reutilizando la librería de marca de `video/src/lib/` para que cada pieza tenga el mismo acabado premium.

## Flujo de trabajo

1. **Briefing** (si falta info, pregunta lo mínimo): objetivo, plataforma y formato, duración, textos, CTA.
   - YouTube/web → 1920×1080 · Shorts/Reels/TikTok → 1080×1920 · Post cuadrado → 1080×1080 · Miniatura → 1280×720.
   - 30 fps por defecto. Shorts: 10–20 s, gancho en los primeros 1,5 s.
2. **Guion visual**: divide en escenas (gancho → valor → prueba → CTA). Cada escena 2–5 s.
3. **Código**: crea `video/src/compositions/<Nombre>.tsx` con un esquema `zod` para los textos editables
   y regístralo en `video/src/Root.tsx` (dentro de un `<Folder>`).
4. **Verifica** antes de entregar (obligatorio):
   ```bash
   cd video && npx tsc --noEmit
   npx remotion still <Id> out/check.png --frame=<frame clave>   # revisa 3–4 frames con Read
   npx remotion render <Id> out/<Id>.mp4
   ```
   Para ver varios frames de una vez:
   `ffmpeg -i out/<Id>.mp4 -vf "select='eq(n\,30)+eq(n\,90)',scale=480:-1,tile=2x1" -frames:v 1 out/sheet.png`
   Usa un nombre de archivo nuevo para cada comprobación (el visor de imágenes puede mostrar una versión en caché).
5. **Entrega**: envía el MP4 al usuario y explica qué puede cambiar en Remotion Studio (`npm run studio`).

## Librería disponible (`video/src/lib/`)

| Pieza | Uso |
|---|---|
| `Background` | Fondo de marca: degradado navy, orbes dorados con ruido, rejilla, grano, viñeta. Base de casi todas las escenas. |
| `Particles` | Polvo dorado flotante (determinista). `count`, `speed`, `seed`. |
| `KineticText` | Texto cinético por palabra/letra. `variant`: `rise` (máscara), `blur`, `scale`. `gold` para degradado con brillo. |
| `Kicker` | Etiqueta superior en mayúsculas con líneas doradas. |
| `LightSweep` | Barrido de luz diagonal: úsalo tras revelar logos/títulos. |
| `Counter` | Cifras animadas (+100, 1M…). |
| `GlassCard` | Tarjeta de cristal para listas (servicios, features, pasos). |
| `LogoMark` | Logo plano `dania-mark.png` con rebote y brillo. |
| `Logo3D` | Logo 3D real (GLB, ya incluye el texto "DanIA Studio") con entrada cinematográfica. |
| `ProgressBar` | Barra de progreso estilo Shorts. |
| `motion.ts` | `sp()` muelles (`smooth`, `snappy`, `bouncy`, `heavy`), `tween()`, `ease.*`, `fadeOut()`. |
| `theme.ts` | Colores `brand.*` y fuentes `fonts.display` (Sora) / `fonts.body` (Inter). |

Transiciones entre escenas: `TransitionSeries` de `@remotion/transitions` (`fade`, `slide`, `wipe`; ver `BrandPromo.tsx`).

## Reglas para que quede "nivel top"

- **Todo depende de `useCurrentFrame()`**. Nunca `Math.random()`, `Date.now()`, CSS transitions/animations ni `setTimeout`:
  usa `random('semilla')` de remotion y `noise*` de `@remotion/noise`.
- **Muelles, no lineales**: entradas con `sp()`; escalona elementos 2–6 frames (`stagger`).
- **Capas de profundidad**: fondo → partículas → contenido → luz (`LightSweep`) → grano. Añade un empuje de cámara sutil (`scale` 1.06→1).
- **Jerarquía**: una idea por escena, 1 frase grande + 1 de apoyo. Texto ≥ 40 px en vertical. Dorado solo para lo importante.
  En 1080 px de ancho, titulares de ~100 px como máximo para no dejar palabras huérfanas.
- **Ritmo**: cada escena sale con transición de 12–18 frames; nada quieto más de 2 s.
- **Marca**: solo colores de `brand` y fuentes de `fonts`. Contenido real en `src/content.ts` de la web.
- Assets en `video/public/` y siempre con `staticFile()`. Fuentes auto-alojadas en `public/fonts/` (no Google Fonts: falla sin red).
- 3D: carga modelos fuera del `ThreeCanvas` con `delayRender`, y dentro llama a `advance()` antes de `continueRender` (el lienzo usa `frameloop="never"`). Ver `Logo3D.tsx`.
- Audio: pon la pista en `public/audio/` y usa `<Audio src={staticFile('audio/x.mp3')} />`; sincroniza cortes con los beats.

## Comandos

```bash
cd video
npm install
npm run studio                       # editor visual en el navegador (cambia textos en vivo)
npx remotion render BrandPromo out/promo.mp4
npx remotion render BrandPromo out/promo.mp4 --props='{"ctaButton":"Hablemos"}'
npm run render:all                   # todas las composiciones
npm run still -- Thumbnail out/thumb.png --frame=90
```

En servidores sin GPU (cloud/CI): `export REMOTION_GL=swangle` y, si ya hay Chrome,
`export REMOTION_BROWSER=/ruta/a/chrome-headless-shell`.

## Licencia

Remotion es gratis para personas y empresas de hasta 3 empleados; por encima requiere licencia de empresa (remotion.pro).
