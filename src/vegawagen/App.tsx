import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { vw, img } from './content'
import { Mark, Wordmark, PhoneIco, WaIco } from './brand'
const Hero = lazy(() => import('./Hero'))
const Gears3D = lazy(() => import('./Gears3D'))
gsap.registerPlugin(ScrollTrigger)

const ICONS: Record<string, JSX.Element> = {
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  scan: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M6 13l3-4 3 3 2.5-3.5L18 13M8 21h8M12 17v4" /></>,
  disc: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5a8.5 8.5 0 0 1 7.4 4.3l-3.4 2" /><circle cx="8" cy="15" r=".6" /><circle cx="15.5" cy="15.5" r=".6" /><circle cx="7.5" cy="9.5" r=".6" /></>,
  tire: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M5.6 18.4l2.9-2.9M15.5 8.5l2.9-2.9" /></>,
  bolt: <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" />,
  check: <><path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
}
const Icon = ({ n }: { n: string }) => <svg viewBox="0 0 24 24" className="h-9 w-9 text-neon drop-shadow-[0_0_6px_rgba(34,225,238,.5)]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{ICONS[n]}</svg>

function Nav() {
  const [s, setS] = useState(false)
  useEffect(() => { const f = () => setS(scrollY > 40); f(); addEventListener('scroll', f); return () => removeEventListener('scroll', f) }, [])
  return <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${s ? 'border-b border-white/5 bg-ink/80 backdrop-blur-xl' : ''}`}>
    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8" aria-label="Principal">
      <a href="#" className="flex items-center gap-3" aria-label="Vegawagen, inicio"><Mark className="h-8 w-8 md:h-9 md:w-9" /><Wordmark className="text-[12px] sm:text-[15px] md:text-[18px]" /></a>
      <div className="hidden gap-8 text-[14px] text-white/60 lg:flex">
        <a href="#taller-fotos" className="hover:text-white">El taller</a><a href="#servicios" className="hover:text-white">Servicios</a>
        <a href="#opiniones" className="hover:text-white">Opiniones</a><a href="#taller" className="hover:text-white">Dónde estamos</a></div>
      <div className="flex items-center gap-2">
        <a href={vw.whatsappHref} target="_blank" rel="noopener" className="btn-ghost hidden !px-4 !py-2.5 text-[13px] md:inline-flex"><WaIco /> WhatsApp</a>
        <a href={vw.phoneHref} className="btn-neon !px-4 !py-2.5 text-[13px] md:!px-5"><PhoneIco /> <span className="hidden sm:inline">{vw.phone}</span><span className="sm:hidden">Llamar</span></a>
      </div>
    </nav></header>
}

const Head = ({ k, t, center, className = '' }: { k: string; t: string; center?: boolean; className?: string }) =>
  <div className={`reveal mb-12 max-w-3xl md:mb-16 ${center ? 'mx-auto text-center' : ''} ${className}`}><p className="kicker mb-4">{k}</p>
    <h2 className="h-cond text-[44px] leading-[0.92] md:text-[80px]">{t}</h2></div>

function Stat({ s }: { s: typeof vw.trust[number] }) {
  const r = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const fmt = (v: number) => s.plain ? String(Math.round(v)) : v.toLocaleString('es-ES', { minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals })
    if (s.plain) { r.current!.textContent = fmt(s.value); return }
    const o = { v: 0 }
    const st = ScrollTrigger.create({ trigger: r.current, start: 'top 90%', once: true, onEnter: () =>
      gsap.to(o, { v: s.value, duration: 2, ease: 'power3.out', onUpdate: () => { r.current!.textContent = fmt(o.v) } }) })
    return () => st.kill() }, [s])
  return <div className="reveal border-l border-neon/25 pl-5 md:pl-7">
    <div className="h-cond text-[56px] leading-none text-white md:text-[84px]">{s.prefix}<span ref={r}>0</span><span className="ml-1 align-top text-[0.55em] text-neon">{s.suffix}</span></div>
    <p className="mt-2 text-[12px] uppercase tracking-[0.22em] text-white/50">{s.label}</p></div>
}

function Diagnosis() {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = box.current!, rows = el.querySelectorAll<HTMLElement>('.dl'), needle = el.querySelector<SVGGElement>('.needle')!, arc = el.querySelector<SVGPathElement>('.arc')!
    const tl = gsap.timeline({ paused: true })
    tl.fromTo(needle, { rotate: -120, svgOrigin: '100 100' }, { rotate: 70, duration: 1.6, ease: 'power2.inOut' }, 0)
      .fromTo(arc, { strokeDashoffset: 1 }, { strokeDashoffset: 0.21, duration: 1.6, ease: 'power2.inOut' }, 0)
    rows.forEach((r, i) => tl.fromTo(r, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.25 + i * 0.32)
      .fromTo(r.querySelector('.st'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.5 + i * 0.32))
    tl.fromTo(el.querySelector('.scanbar'), { scaleX: 0 }, { scaleX: 1, duration: 0.25 + rows.length * 0.32, ease: 'none' }, 0.25)
    const st = ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: () => tl.play() })
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) tl.progress(1)
    return () => { st.kill(); tl.kill() }
  }, [])
  return <section id="diagnosis" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-28 md:grid-cols-2 md:gap-16 md:px-8 md:py-40">
    <div><Head k={vw.diag.kicker} t={vw.diag.title} className="!mb-8" />
      <p className="reveal max-w-lg text-[17px] leading-relaxed text-white/60">{vw.diag.text}</p>
      <figure className="reveal relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-white/10">
        <img src={img.motor} alt="Mecánico de Vegawagen revisando el motor de un coche" loading="lazy" className="h-full w-full object-cover" />
        <figcaption className="absolute bottom-3 left-3 rounded-full bg-ink/75 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/80 backdrop-blur">En el taller</figcaption></figure></div>
    <div ref={box} className="reveal panel p-5 md:p-7" role="img" aria-label="Ejemplo de pantalla de diagnosis">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/40">
        <span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-neon shadow-[0_0_8px_#22E1EE]" />Diagnosis en curso</span><span className="font-mono">OBD-II</span></div>
      <div className="mt-5 grid grid-cols-[120px_1fr] items-center gap-5 md:grid-cols-[150px_1fr] md:gap-7">
        <svg viewBox="0 0 200 170" className="w-full" aria-hidden>
          <path d="M30 150 A85 85 0 1 1 170 150" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" strokeLinecap="round" />
          <path className="arc" d="M30 150 A85 85 0 1 1 170 150" pathLength={1} strokeDasharray="1" fill="none" stroke="#22E1EE" strokeWidth="10" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgba(34,225,238,.7))' }} />
          {Array.from({ length: 9 }, (_, i) => { const a = (-210 + i * 30) * Math.PI / 180; return <line key={i} x1={100 + Math.cos(a) * 62} y1={100 + Math.sin(a) * 62} x2={100 + Math.cos(a) * 70} y2={100 + Math.sin(a) * 70} stroke="rgba(255,255,255,.35)" strokeWidth="2" /> })}
          <g className="needle"><line x1="100" y1="100" x2="100" y2="38" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></g>
          <circle cx="100" cy="100" r="7" fill="#22E1EE" />
        </svg>
        <div><p className="h-cond text-[40px] leading-none md:text-[52px]">1 <span className="text-[20px] text-white/50 md:text-[24px]">avería localizada</span></p>
          <div className="mt-4 h-1 overflow-hidden rounded bg-white/10"><div className="scanbar h-full origin-left bg-neon" /></div></div>
      </div>
      <ul className="mt-6 space-y-2.5 font-mono text-[12.5px] md:text-[13.5px]">
        {vw.diag.lines.map(l => <li key={l.t} className="dl flex items-baseline justify-between gap-4 border-b border-white/5 pb-2.5">
          <span className={l.warn ? 'text-white' : 'text-white/60'}>{l.t}</span>
          <span className={`st shrink-0 rounded px-2 py-0.5 text-[11px] uppercase tracking-wider ${l.warn ? 'bg-alert text-white' : 'bg-white/5 text-white/70'}`}>{l.s}</span></li>)}
      </ul>
    </div>
  </section>
}

const SPAN: Record<string, string> = { wide: 'col-span-2', tall: 'row-span-2', normal: '' }
function Gallery() {
  return <section id="taller-fotos" className="mx-auto max-w-7xl px-5 pb-28 md:px-8 md:pb-40">
    <Head k={vw.gallery.kicker} t={vw.gallery.title} />
    <div className="grid auto-rows-[170px] grid-cols-2 gap-3 [grid-auto-flow:dense] sm:auto-rows-[220px] md:auto-rows-[250px] md:grid-cols-4 md:gap-4">
      {vw.gallery.items.map(g => <figure key={g.src} className={`ph relative overflow-hidden rounded-3xl border border-white/10 bg-steel ${SPAN[g.span]}`}>
        <img src={img[g.src as keyof typeof img]} alt={g.alt} loading="lazy" className="ph-img h-full w-full object-cover" />
        <figcaption className="absolute bottom-3 left-3 rounded-full bg-ink/75 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/85 backdrop-blur md:text-[11px]">{g.tag}</figcaption></figure>)}
      <div className="ph col-span-2 flex flex-col justify-center rounded-3xl md:col-span-4 md:flex-row md:items-end md:justify-between md:gap-10 border border-neon/20 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(34,225,238,.14),transparent_60%)] p-6 md:p-9">
        <div><p className="kicker mb-3">Trabajamos todas las marcas</p>
        <p className="h-cond text-[30px] leading-[0.95] md:max-w-xl md:text-[44px]">De un clásico de los 90 a un Cupra recién salido.</p></div>
        <p className="mt-3 text-[15px] text-white/55 md:mb-1">{vw.brands.join(' · ')}</p></div>
    </div></section>
}

const Stars = ({ n = 5 }: { n?: number }) => <span className="tracking-[0.15em] text-neon" aria-label={`${n} estrellas`}>{'★'.repeat(n)}</span>

export default function App() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | null = null
    if (!reduced) { lenis = new Lenis({ duration: 1.15, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(t => lenis!.raf(t * 1000)); gsap.ticker.lagSmoothing(0) }
    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.from(el, { opacity: 0, y: 46, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))
      gsap.from('.svc', { opacity: 0, y: 60, duration: 1, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: '#servicios .grid', start: 'top 85%' } })
      gsap.from('.op', { opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '#opiniones .grid', start: 'top 85%' } })
      // fotos: se destapan y hacen un ligero zoom con el scroll
      gsap.utils.toArray<HTMLElement>('.ph').forEach(el => {
        gsap.fromTo(el, { clipPath: 'inset(14% 10% 14% 10% round 24px)', opacity: 0.2 }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
        const im = el.querySelector('.ph-img'); if (im) gsap.fromTo(im, { scale: 1.22, yPercent: -5 }, { scale: 1.04, yPercent: 5, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      gsap.fromTo('.track', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#proceso ol', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 } })
      gsap.fromTo('.track-v', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#proceso ol', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 } })
      gsap.utils.toArray<HTMLElement>('.step').forEach(el => gsap.from(el, { opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
    })
    const onPM = (e: PointerEvent) => { const c = (e.target as HTMLElement).closest<HTMLElement>('.card'); if (!c) return
      const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px') }
    addEventListener('pointermove', onPM)
    const onLoad = () => ScrollTrigger.refresh(); addEventListener('load', onLoad)
    return () => { ctx.revert(); lenis?.destroy(); removeEventListener('pointermove', onPM); removeEventListener('load', onLoad) }
  }, [])

  return <>
    <Nav />
    <main>
      <Suspense fallback={<section className="h-[100svh] bg-ink" />}><Hero /></Suspense>

      <div className="relative overflow-hidden border-y border-neon/15 bg-steel py-5" aria-label="Marcas con las que trabajamos">
        <div className="marquee flex w-max gap-10 whitespace-nowrap">
          {[0, 1, 2, 3].map(r => <div key={r} className="flex gap-10" aria-hidden={r > 0}>{vw.brands.map(t => <span key={t} className="h-cond flex items-center gap-10 text-[28px] uppercase tracking-[0.06em] text-white/80 md:text-[34px]">{t}<span className="text-neon">✦</span></span>)}</div>)}
        </div></div>

      <section aria-label="Cifras" className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 px-5 py-20 md:grid-cols-4 md:px-8 md:py-28">
        {vw.trust.map(s => <Stat key={s.label} s={s} />)}</section>

      <Gallery />

      <section id="servicios" className="border-t border-white/5 bg-steel/50">
        <div className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
          <Head k={vw.services.kicker} t={vw.services.title} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vw.services.items.map((s, i) => <article key={s.title} className="svc card flex min-h-[260px] flex-col p-7 md:p-9">
              <div className="flex items-start justify-between"><Icon n={s.icon} /><span className="font-mono text-xs text-white/30">0{i + 1}</span></div>
              <h3 className="h-cond mt-auto pt-12 text-[30px] leading-none">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/55">{s.text}</p></article>)}
          </div></div></section>

      <div className="border-y border-white/5"><Diagnosis /></div>

      <section id="proceso" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
        <Head k={vw.process.kicker} t={vw.process.title} />
        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-8">
          <span className="absolute left-[23px] top-0 hidden h-full w-px bg-white/10 max-md:block" aria-hidden><span className="track-v block h-full w-px origin-top bg-neon shadow-[0_0_8px_#22E1EE]" /></span>
          <span className="absolute left-0 top-[23px] hidden h-px w-full bg-white/10 md:block" aria-hidden><span className="track block h-px w-full origin-left bg-neon shadow-[0_0_8px_#22E1EE]" /></span>
          {vw.process.steps.map((s, i) => <li key={s.title} className="step relative pl-16 md:pl-0">
            <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full border border-neon bg-ink font-mono text-sm text-neon shadow-[0_0_14px_rgba(34,225,238,.35)] md:relative">0{i + 1}</span>
            <h3 className="h-cond text-[30px] leading-none md:mt-8">{s.title}</h3>
            <p className="mt-3 max-w-[260px] text-[15px] leading-relaxed text-white/55">{s.text}</p></li>)}
        </ol></section>

      <section id="opiniones" className="border-y border-white/5 bg-steel/50 py-28 md:py-40">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <Head k={vw.opinions.kicker} t={vw.opinions.title} className="!mb-0" />
            <a href={vw.mapsLink} target="_blank" rel="noopener" className="reveal flex items-center gap-5 rounded-2xl border border-white/10 bg-ink/60 px-6 py-5 hover:border-neon/60">
              <span className="h-cond text-[64px] leading-none">{vw.rating.toLocaleString('es-ES')}</span>
              <span className="text-[13px] text-white/60"><Stars /><br />+{vw.reviews} reseñas en Google</span></a>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {vw.opinions.items.map(o => <figure key={o.title} className="op card p-7 md:p-9">
              <span className="h-cond block text-[72px] leading-[0.6] text-neon" aria-hidden>“</span>
              <h3 className="h-cond mt-4 text-[28px] leading-none">{o.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">{o.text}</p><Stars /></figure>)}
          </div></div></section>

      <section id="taller" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
        <Head k={vw.location.kicker} t={vw.location.title} />
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="reveal panel flex flex-col gap-8 p-7 md:p-9">
            <p className="text-[16px] leading-relaxed text-white/60">{vw.location.text}</p>
            <div><p className="kicker mb-3">Dirección</p><p className="text-[18px] leading-snug">{vw.address[0]}<br /><span className="text-white/60">{vw.address[1]}</span></p></div>
            <div><p className="kicker mb-3">Horario</p>
              <dl className="space-y-2 text-[15px]">{vw.hours.map(h => <div key={h.d} className="flex justify-between gap-4 border-b border-white/5 pb-2"><dt className="text-white/60">{h.d}</dt><dd className={h.h === 'Cerrado' ? 'text-white/40' : ''}>{h.h}</dd></div>)}</dl></div>
            <div className="mt-auto flex flex-wrap gap-3">
              <a href={vw.phoneHref} className="btn-neon"><PhoneIco /> {vw.phone}</a>
              <a href={vw.whatsappHref} target="_blank" rel="noopener" className="btn-ghost"><WaIco /> {vw.whatsapp}</a>
              <a href={vw.mapsLink} target="_blank" rel="noopener" className="btn-ghost">Cómo llegar ↗</a></div>
          </div>
          <div className="grid gap-4">
            <figure className="ph relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10">
              <img src={img.fachada} alt="Fachada del taller Vegawagen, con la puerta roja y el cartel de Castrol Service" loading="lazy" className="ph-img h-full w-full object-cover" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-ink/75 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/85 backdrop-blur">Nuestra fachada</figcaption></figure>
            <div className="reveal panel map-fallback relative min-h-[240px] overflow-hidden !p-0">
              <a href={vw.mapsLink} target="_blank" rel="noopener" className="absolute inset-0 grid place-items-center text-center text-[14px] text-white/60">
                <span><svg viewBox="0 0 24 24" className="mx-auto mb-3 h-10 w-10 text-neon" fill="currentColor" aria-hidden><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>Ver en Google Maps ↗</span></a>
              <iframe title="Mapa: Vegawagen en Churriana de la Vega" src={vw.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="map absolute inset-0 h-full w-full border-0" />
            </div>
          </div>
        </div></section>

      <section id="contacto" className="relative overflow-hidden border-t border-white/5 pb-32 pt-20 md:pb-28 md:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,225,238,.13),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-5 md:grid-cols-2 md:px-8">
          <div className="h-[300px] md:order-2 md:h-[480px]"><Suspense fallback={null}><Gears3D /></Suspense></div>
          <div className="md:order-1"><h2 className="reveal h-cond text-[56px] leading-[0.9] md:text-[104px]">{vw.cta.title}</h2>
            <p className="reveal mt-5 max-w-md text-[18px] text-white/60">{vw.cta.text}</p>
            <div className="reveal mt-9 flex flex-wrap gap-3"><a href={vw.phoneHref} className="btn-neon !px-8 !py-4 text-[16px]"><PhoneIco /> {vw.cta.button}</a>
              <a href={vw.whatsappHref} target="_blank" rel="noopener" className="btn-ghost !py-4"><WaIco /> WhatsApp</a></div></div>
        </div></section>
    </main>
    <footer className="border-t border-white/5 pb-28 pt-10 text-[13px] text-white/40 md:pb-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 md:px-8">
        <span className="flex items-center gap-2"><Mark className="h-5 w-5" /> {vw.legal} · {vw.address.join(', ')}</span>
        <span>{vw.footer}</span></div></footer>
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-white/10 bg-ink/90 p-3 backdrop-blur-xl md:hidden" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <a href={vw.phoneHref} className="btn-neon flex-1 justify-center"><PhoneIco /> Llamar</a>
      <a href={vw.whatsappHref} target="_blank" rel="noopener" className="btn-ghost flex-1 justify-center"><WaIco /> WhatsApp</a></div>
  </>
}
