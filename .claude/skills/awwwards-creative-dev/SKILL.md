---
name: awwwards-creative-dev
description: Diseña y programa webs de nivel Awwwards (portfolios, landings de producto, webs de marca o agencia, experiencias interactivas) con dirección de arte propia, coreografía de movimiento GSAP + Lenis, tipografía fluida, microinteracciones y acentos WebGL. Úsala cuando pidan una web "bonita", "premium", "de lujo", "con animaciones", "tipo Awwwards", con scroll suave, texto cinético, secciones fijadas (pin), scroll horizontal, cursor personalizado, botones magnéticos, shaders o Three.js.
---

# Awwwards Creative Dev · v2

Construye webs con el oficio de estudios como Studio Freight, Locomotive, Active Theory, Dennis Snellenberg, Aristide Benoist o Bruno Simon. Esa calidad no sale de "meter animaciones": sale de una **dirección de arte decidida antes de escribir código**, un **sistema de movimiento** con reglas y **una sola idea memorable** ejecutada con precisión.

## 0. Antes de nada: el brief en 5 líneas

Escríbelas (en un comentario al inicio del CSS, no en la respuesta):

1. **Tema y público.** Qué es, para quién y qué tiene que hacer el visitante (comprar, reservar, contactar, explorar).
2. **Tesis visual.** Una frase. Ejemplo: "el café se funde con la leche". Todo el diseño sirve a esa frase.
3. **Momento firma.** La única interacción que alguien recordará y contará: un shader que reacciona al ratón, un tarro que se llena con el scroll, una tipografía que se deforma. Solo una.
4. **Materiales del mundo del tema.** Unidades, términos técnicos, objetos, texturas reales: °C, msnm, pH, lote, lacre. Van como contenido, no como adorno.
5. **Riesgo estético.** Una decisión valiente: un tamaño de tipo extremo, una paleta inesperada, una maquetación asimétrica.

Si el usuario dio dirección visual, manda la suya. Si no, no caigas en los looks por defecto de la IA: crema con serif y terracota, negro con verde ácido, degradado morado-azul, emojis como iconos o todo centrado.

## 1. Dirección de arte (tokens primero)

Define todo como tokens en `:root` antes de maquetar.

- **Color: 5-6 tokens.** Fondo, fondo secundario, texto, texto atenuado, línea y **un único acento**. Los neutros llevan un ligero tinte hacia el acento: nunca uses un gris puro. Diseña los dos temas, claro y oscuro (`prefers-color-scheme` y `[data-theme]`), salvo que el concepto sea de un solo tema a propósito.
- **Tipografía: 3 roles.**
  - *Display*: una fuente con carácter y alto contraste (Bodoni Moda, Instrument Serif, Fraunces, PP Editorial, Syne, Clash, Unbounded).
  - *Texto*: una grotesca legible (Manrope, Inter Tight, General Sans).
  - *Meta*: una monoespaciada para datos, índices y etiquetas (JetBrains Mono, IBM Plex Mono, Space Mono).
- **Escala fluida con `clamp()`.**
  - Display: `clamp(3rem, 8vw, 9.5rem)` con `line-height` .88-.95 y `letter-spacing` de -.04 a -.05em.
  - H2: `clamp(2.4rem, 5.5vw, 6rem)`.
  - Cuerpo: 16-19 px con `line-height` 1.6, y el texto corrido a unos 65 caracteres de ancho como máximo.
  - Meta: 11-12 px en mayúsculas con `letter-spacing` .08-.14em.
- **Retícula.** 12 columnas (`repeat(12, minmax(0,1fr))`), asimétrica a propósito: titular en 1/8 y objeto en 8/13. Mucho aire. Usa `gap` en lugar de márgenes.
- **Textura.** Grano sutil (un SVG `feTurbulence` a ~4-6 % de opacidad), viñeta y líneas finas de 1 px. Nada de sombras genéricas ni `rounded-lg` en todo.
- **Imágenes.** Si no hay fotos con derechos, **dibújalas**: WebGL o canvas para lo orgánico (líquidos, humo, ruido), SVG para objetos e ilustraciones de proceso. Nunca pongas imágenes de stock genéricas.

## 2. Sistema de movimiento (reglas, no efectos sueltos)

### Tokens de movimiento

```css
--ease-out: cubic-bezier(.16,1,.3,1);      /* expo.out: entradas */
--ease-inout: cubic-bezier(.65,0,.35,1);   /* cortinas y transiciones */
--dur-xs: .3s; --dur-s: .6s; --dur-m: 1s; --dur-l: 1.4s;
```

En GSAP: `expo.out` o `power4.out` para entradas, `power2.inOut` para cortinas y `none` en todo lo que vaya ligado al scroll (`scrub`).

### Reglas

1. **Solo `transform`, `opacity`, `clip-path` y `filter` ligero.** Nunca animes `top`, `left`, `width`, `height` ni `margin`.
2. **Escalonado de 40-120 ms** entre los elementos de un grupo. Si es mayor, parece lento; si es menor, parece simultáneo.
3. **Un único timeline de carga** que orqueste todo lo que se ve al entrar: preloader → cortina → titular → meta → objeto → nav.
4. **El movimiento significa algo.** Lo que va ligado al scroll cuenta el progreso de algo real (un proceso, un llenado, una línea de tiempo). Las entradas revelan; no decoran.
5. **Contraste de ritmo.** Alterna secciones muy animadas con secciones quietas. Si todo se mueve, nada destaca.
6. **Física.** Interpola (`lerp`, 0.08-0.2) en el cursor, el botón magnético y el ratón del shader. Que reaccionen con inercia y nunca de golpe.

## 3. Arquitectura técnica

### Single-file HTML (demos y artifacts)

- Carga las librerías por CDN con la versión exacta: `gsap/3.12.5` y `ScrollTrigger` desde cdnjs, y `lenis@1.1.13` desde jsDelivr (`dist/lenis.min.js`).
- Inline todo lo demás: CSS, JS, SVG y shaders.
- En artifacts de claude.ai solo se permiten scripts de cdnjs, jsdelivr, unpkg, tailwindcss y jquery, y fuentes de Google Fonts. Nada de imágenes externas.

### Next.js / React

Usa `@studio-freight/lenis` o `lenis/react`, `gsap` con `useGSAP()` para la limpieza, y React Three Fiber para WebGL. Pon el texto real en el DOM y el canvas detrás.

### Arranque obligatorio (Lenis + GSAP sincronizados)

```js
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ lerp: .085, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
// los enlaces internos usan lenis.scrollTo(el, { duration: 1.4 })
```

### Responsive del movimiento

Usa `gsap.matchMedia()`:

- **Escritorio (≥ 900 px):** pins, scroll horizontal y cursor.
- **Móvil:** secuencias verticales sin pin y revelados simples.
- **`(prefers-reduced-motion: reduce)`:** nada de pins ni scrub. Todo visible y estático.

## 4. Recetas

Están detalladas en `references/recipes.md`:

| Receta | Para qué |
|---|---|
| Preloader con contador y cortina | Ocultar la carga de fuentes y WebGL con un momento de marca. |
| Split de líneas y palabras sin plugins | Revelados con máscara (`overflow:hidden` + `yPercent: 110`). |
| Scroll horizontal fijado | Procesos, timelines y galerías, con `containerAnimation` para animar dentro de cada panel. |
| Trazo SVG que se dibuja con el scroll | Conectar pasos de un proceso (`strokeDasharray`/`strokeDashoffset`). |
| Llenado / morph ligado al scroll | Productos que se construyen por capas con `position: sticky` + `scrub`. |
| Marquee con velocidad del scroll | Cinta infinita que acelera y se inclina (`skewX`) según la velocidad. |
| Cursor contextual + magnéticos | Pastilla que crece con una etiqueta ("Ver", "Arrastra") sobre los elementos interactivos. |
| Shader de fondo | Plano a pantalla completa con fbm y *domain warping*; uniforms de tiempo, ratón y scroll. |
| Cambio de tema por sección | `data-bg` en cada sección y ScrollTrigger que interpola `--bg`/`--fg` del body. |
| Hover que cambia el ambiente | Al pasar por un producto cambian el color de fondo de la sección y el estado del cursor. |

## 5. Rendimiento (presupuesto)

- 60 fps en un portátil normal. Los shaders, a DPR ≤ 1.75; se pausan con `IntersectionObserver` cuando no se ven y van a resolución reducida en móvil.
- Un solo `requestAnimationFrame` global: el de `gsap.ticker`. No abras bucles sueltos por componente.
- No más de 2-3 capas de parallax a la vez. En iOS Safari evita `background-attachment: fixed` y `filter: blur()` grandes animados.
- Fuentes con `display=swap` y fallbacks reales. Nada de librerías de iconos completas.
- `will-change` solo en los elementos que se están animando en ese momento.

## 6. Accesibilidad y robustez

- **El estado inicial es visible.** Los estados ocultos se ponen con `gsap.from()`/`fromTo()` dentro del arranque, nunca en CSS. Si GSAP no carga, la página se ve entera.
- Activa los pins con una clase (`.is-pinned`) solo cuando GSAP está activo. Sin JS, el scroll horizontal se reparte en una retícula que hace *wrap*.
- HTML semántico (`header`, `main`, `section[aria-label]`, `footer`), `:focus-visible` con estilo, enlaces y botones reales, y `aria-hidden` en lo decorativo. Los canvas llevan `role="img"` y `aria-label`.
- Cursor personalizado solo con `(hover:hover) and (pointer:fine)`; sin él, el cursor nativo.
- Contraste AA en el texto. La metadata atenuada nunca baja de 4.5:1 en tamaños pequeños.
- Los formularios de demo no envían nada y lo dicen claramente.

## 7. Flujo de trabajo

1. Brief de 5 líneas y tokens de color, tipo y movimiento.
2. Estructura de secciones con su función: hook → tesis → prueba → producto → cifras → CTA. Cada sección tiene un único trabajo.
3. Maquetación estática completa y bonita **sin animación**: tiene que funcionar así.
4. Timeline de carga, luego el momento firma y después el resto de revelados.
5. Microinteracciones: cursor, magnéticos y hovers.
6. Pase de rendimiento, accesibilidad y responsive.
7. QA visual: captura a 1440 y 390 px, en claro y oscuro, comprobando que no haya scroll horizontal ni texto cortado. Fíjate en los descendentes dentro de las máscaras: `padding-bottom: .2em` + `margin-bottom: -.2em`.

## 8. Checklist antes de entregar

- [ ] Se ve completo sin JS y sin scroll (el primer pantallazo cuenta la tesis).
- [ ] Un solo momento firma, claramente mejor que el resto.
- [ ] Todo el movimiento usa los tokens de easing y duración.
- [ ] Móvil a 390 px sin overflow horizontal; pins desactivados en móvil.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Temas claro y oscuro coherentes; nada de colores literales fuera de los tokens.
- [ ] Copy real y específico del tema, sin lorem ipsum ni frases de relleno.
- [ ] Sin errores en consola y con las versiones de CDN fijadas.

## Anti-patrones

- Animar todo al entrar ("fade-up" en cada párrafo).
- Varias ideas firma compitiendo entre sí.
- Pins en móvil o scroll-jacking que impide avanzar.
- Parallax en 6 capas.
- Cursor personalizado en táctil.
- Textos que dependen de una animación para verse.
- Tipografía display en el cuerpo de texto.
- Numerar secciones (01/02/03) cuando el orden no significa nada.
