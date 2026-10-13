import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content } from './content'
import { asset } from './asset'
gsap.registerPlugin(ScrollTrigger)

const TOTAL = 180, FW = 1600, FH = 900
// Puntos (en coordenadas del frame, 0-1) que señalan las etiquetas
const ANCHORS = [ { x: 0.36, y: 0.32, side: -1, dy: -0.06 }, { x: 0.66, y: 0.36, side: 1, dy: -0.08 },
                  { x: 0.27, y: 0.86, side: -1, dy: 0 }, { x: 0.76, y: 0.86, side: 1, dy: 0 } ]

export default function Hero() {
  const wrap = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null)
  const title = useRef<HTMLDivElement>(null), labels = useRef<HTMLDivElement>(null), bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const step = mobile ? 2 : 1
    const idx: number[] = []; for (let i = 1; i <= TOTAL; i += step) idx.push(i)
    if (idx[idx.length - 1] !== TOTAL) idx.push(TOTAL)
    const imgs = idx.map(i => { const im = new Image(); im.decoding = 'async'; im.src = asset(`frames/${String(i).padStart(4, '0')}.jpg`); return im })
    const cv = canvas.current!, ctx = cv.getContext('2d')!
    let cur = reduced ? imgs.length - 1 : 0, rect = { x: 0, y: 0, w: 0, h: 0 }
    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), w = cv.clientWidth, h = cv.clientHeight
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingQuality = 'high'
      // contain en móvil (vertical), cover suave en escritorio
      const s = mobile ? Math.min(w / FW, h / FH) * 1.25 : Math.max(w / FW, h / FH) * 0.92
      rect = { w: FW * s, h: FH * s, x: (w - FW * s) / 2, y: (h - FH * s) / 2 + (mobile ? h * 0.06 : 0) }
      // posiciona etiquetas
      labels.current?.querySelectorAll<HTMLElement>('[data-anchor]').forEach((el, i) => {
        const a = ANCHORS[i]; el.style.left = rect.x + a.x * rect.w + 'px'; el.style.top = rect.y + a.y * rect.h + 'px'
      })
      draw()
    }
    const draw = () => {
      let i = cur; while (i > 0 && !(imgs[i].complete && imgs[i].naturalWidth)) i--
      const im = imgs[i]; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.clientWidth, cv.clientHeight)
      if (im.complete && im.naturalWidth) ctx.drawImage(im, rect.x, rect.y, rect.w, rect.h)
    }
    imgs.forEach(im => im.addEventListener('load', () => draw()))
    layout(); window.addEventListener('resize', layout)

    const tl = gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: 0.6,
      onUpdate: s => { if (bar.current) bar.current.style.transform = `scaleX(${s.progress})` } } })
    const seq = { f: cur }
    if (!reduced) tl.to(seq, { f: imgs.length - 1, ease: 'none', duration: 1, onUpdate: () => { const n = Math.round(seq.f); if (n !== cur) { cur = n; draw() } } }, 0)
    tl.to(title.current, { opacity: 0, y: -60, filter: 'blur(8px)', duration: 0.18, ease: 'power1.in' }, 0.02)
    labels.current!.querySelectorAll('[data-anchor]').forEach((el, i) => {
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.55 + i * 0.07)
      tl.fromTo(el.querySelector('.ln'), { scaleX: 0 }, { scaleX: 1, duration: 0.1, ease: 'power2.out' }, 0.55 + i * 0.07)
    })
    tl.to({}, { duration: 0.1 })
    return () => { window.removeEventListener('resize', layout); tl.scrollTrigger?.kill(); tl.kill() }
  }, [])

  return (
    <section ref={wrap} className="relative h-[250vh] md:h-[400vh]" aria-label="Presentación">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-white">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-label="Logo 3D de DanIA Studio montándose" role="img" />
        <div ref={title} className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
          <p className="kicker mb-5 text-[10px] md:text-[12px]">{content.hero.kicker}</p>
          <h1 className="h-display text-[44px] sm:text-[72px] lg:text-[112px]">
            <span className="block text-navy">{content.hero.title[0]}</span>
            <span className="block gold-text font-[300]">{content.hero.title[1]}</span>
          </h1>
        </div>
        <div ref={labels} className="pointer-events-none absolute inset-0 hidden md:block">
          {content.heroLabels.map((l, i) => { const a = ANCHORS[i]; return (
            <div key={l} data-anchor className="absolute" style={{ opacity: 0 }}>
              <span className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold ring-4 ring-gold/20" />
              <span className="ln absolute top-0 h-px w-[140px] bg-gradient-to-r from-gold to-gold/30"
                style={{ [a.side < 0 ? 'right' : 'left']: 0, transformOrigin: a.side < 0 ? 'right' : 'left' }} />
              <span className="absolute -translate-y-1/2 whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.22em] text-navy"
                style={{ [a.side < 0 ? 'right' : 'left']: 152 }}>{l}</span>
            </div>) })}
        </div>
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-navy/50">
          {content.hero.scrollHint}
          <div className="h-px w-40 overflow-hidden bg-navy/10"><div ref={bar} className="h-full origin-left gold-bg" style={{ transform: 'scaleX(0)' }} /></div>
        </div>
      </div>
    </section>)
}
