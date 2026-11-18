# Recetas · awwwards-creative-dev

Fragmentos probados para HTML single-file (GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.13). Todas asumen el arranque Lenis + GSAP de SKILL.md.

## 1. Preloader con contador y cortina

```html
<div class="loader" aria-hidden="true"><span class="loader-n">0</span><span class="loader-word">OMBRA</span></div>
```
```css
.loader{position:fixed;inset:0;z-index:100;background:var(--fg);color:var(--bg);display:flex;align-items:flex-end;justify-content:space-between;padding:32px}
.loader-n{font:400 clamp(4rem,14vw,12rem)/.8 var(--display);font-variant-numeric:tabular-nums}
```
```js
const o = { v: 0 }, n = document.querySelector('.loader-n');
const intro = gsap.timeline();
intro.to(o, { v: 100, duration: 1.6, ease: 'power3.inOut', onUpdate: () => n.textContent = Math.round(o.v) })
     .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power4.inOut' })
     .set('.loader', { display: 'none' })
     .add(heroIn(), '-=.5'); // heroIn() devuelve el timeline del hero
```
Si GSAP no carga, `.loader` debe ocultarse por CSS: aplica el estilo solo con `html.js .loader` y pon `document.documentElement.classList.add('js')` justo después de comprobar `window.gsap`.

## 2. Split de líneas/palabras sin plugin

```js
function splitWords(el){
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => `<span class="mask"><span>${w}</span></span>`).join(' ');
  return el.querySelectorAll('.mask > span');
}
gsap.from(splitWords(h), { yPercent: 110, rotate: 4, stagger: .06, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
```
`.mask{display:inline-block;overflow:hidden;padding-bottom:.2em;margin-bottom:-.2em;vertical-align:top}`

## 3. Scroll horizontal fijado + animaciones dentro

```js
mm.add('(min-width: 900px)', () => {
  section.classList.add('is-pinned');
  const dist = () => track.scrollWidth - innerWidth;
  const h = gsap.to(track, { x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: section, pin: true, scrub: 1, end: () => '+=' + dist(), invalidateOnRefresh: true } });
  panels.forEach(p => gsap.from(p.querySelector('.art'), { scale: .8, opacity: .2,
    scrollTrigger: { trigger: p, containerAnimation: h, start: 'left 80%', end: 'left 40%', scrub: true } }));
  return () => section.classList.remove('is-pinned');
});
```

## 4. Trazo SVG ligado al scroll

```js
const len = path.getTotalLength();
gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none',
  scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + dist(), scrub: true } });
```

## 5. Marquee con velocidad del scroll

```js
let x = 0, v = 0;
ScrollTrigger.create({ onUpdate: s => v = s.getVelocity() / 300 });
gsap.ticker.add(() => {
  v *= .92; x -= 1 + Math.abs(v);
  const w = row.scrollWidth / 2; if (x <= -w) x += w;
  row.style.transform = `translate3d(${x}px,0,0) skewX(${gsap.utils.clamp(-12, 12, -v)}deg)`;
});
```

## 6. Cursor contextual

```js
const c = document.querySelector('.cursor'); let x=0,y=0,cx=0,cy=0;
addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; });
gsap.ticker.add(() => { cx += (x-cx)*.18; cy += (y-cy)*.18; c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; });
document.querySelectorAll('[data-cursor]').forEach(el => {
  el.addEventListener('pointerenter', () => { c.dataset.label = el.dataset.cursor; c.classList.add('is-big'); });
  el.addEventListener('pointerleave', () => c.classList.remove('is-big'));
});
```

## 7. Botón magnético

```js
el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect();
  gsap.to(el, { x: (e.clientX - r.left - r.width/2) * .3, y: (e.clientY - r.top - r.height/2) * .4, duration: .6, ease: 'power3.out' }); });
el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,.4)' }));
```

## 8. Shader de fondo (fbm + domain warping)

```glsl
precision highp float; uniform vec2 r; uniform float t; uniform vec2 m; uniform float s; // s = progreso de scroll
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){ vec2 uv=(gl_FragCoord.xy-.5*r)/min(r.x,r.y);
  vec2 q=vec2(fbm(uv*2.+t*.05),fbm(uv*2.+5.2-t*.04));
  float f=fbm(uv*2.+q*2.5+m); /* mezclar paleta con smoothstep por bandas */ }
```
Pausa con `IntersectionObserver`, DPR ≤ 1.75 y un fallback CSS (`radial-gradient`) en el contenedor.

## 9. Cambio de color por sección

```js
gsap.utils.toArray('[data-bg]').forEach(sec => ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%',
  onToggle: s => s.isActive && gsap.to(document.body, { '--bg': sec.dataset.bg, '--fg': sec.dataset.fg, duration: .8, ease: 'power2.out' }) }));
```
Registra las variables con `@property` para que se interpolen como color si vas a animarlas por CSS.

## 10. Llenado por capas (sticky + scrub)

Sección alta (`height: 260vh`) con un hijo `position: sticky; top: 0`. Con ScrollTrigger (`start: 'top top', end: 'bottom bottom', scrub: true`), en `onUpdate(p)` reparte el progreso entre N capas: `k = clamp(0, 1, p*N - i)` → `scaleY(k)` con `transform-origin` abajo. En móvil y con movimiento reducido, todas las capas llenas y sin sticky.
