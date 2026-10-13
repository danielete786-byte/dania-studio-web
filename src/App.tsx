import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Hero from './Hero'
import { content as C } from './content'
import { asset } from './asset'
const Logo3D = lazy(() => import('./Logo3D'))
gsap.registerPlugin(ScrollTrigger)

const Icon = ({ n }: { n: string }) => {
  const p: Record<string, JSX.Element> = {
    play: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9.5v5l4.5-2.5z" /></>,
    megaphone: <><path d="M4 10v4h3l7 4V6L7 10z" /><path d="M17.5 9a4 4 0 0 1 0 6" /></>,
    code: <><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" /></>,
    bolt: <><path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" /></> }
  return <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="url(#g)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#F2C94C" /><stop offset="1" stopColor="#B8862B" /></linearGradient></defs>{p[n]}</svg>
}

function Nav() {
  const [s, setS] = useState(false)
  useEffect(() => { const f = () => setS(scrollY > 40); addEventListener('scroll', f); return () => removeEventListener('scroll', f) }, [])
  return <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${s ? 'bg-white/85 backdrop-blur-xl border-b border-navy/5' : ''}`}>
    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6" aria-label="Principal">
      <a href="#" className="flex items-center gap-2.5"><img src={asset('logo/dania-mark.png')} alt="" className="h-7 w-auto" />
        <span className="text-[15px] font-medium tracking-tight">DanIA <span className="gold-text">Studio</span></span></a>
      <div className="hidden gap-9 text-[13px] text-navy/70 md:flex">
        <a href="#servicios" className="hover:text-navy">Servicios</a><a href="#portfolio" className="hover:text-navy">Portfolio</a>
        <a href="#proceso" className="hover:text-navy">Proceso</a></div>
      <a href="#contacto" className="rounded-full gold-bg px-5 py-2 text-[13px] font-medium text-navy">Contacto</a>
    </nav></header>
}

const Head = ({ k, t, center }: { k: string; t: string; center?: boolean }) =>
  <div className={`reveal mb-16 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}><p className="kicker mb-5">{k}</p>
    <h2 className="h-display text-[40px] md:text-[72px]">{t}</h2></div>

function Stat({ s }: { s: typeof C.stats[number] }) {
  const r = useRef<HTMLSpanElement>(null)
  useEffect(() => { const o = { v: 0 }
    const st = ScrollTrigger.create({ trigger: r.current, start: 'top 85%', once: true, onEnter: () =>
      gsap.to(o, { v: s.value, duration: 2.2, ease: 'power3.out', onUpdate: () => { r.current!.textContent = String(Math.round(o.v)) } }) })
    return () => st.kill() }, [s.value])
  return <div className="reveal text-center"><div className="h-display text-[88px] md:text-[128px] gold-text font-[200]">{s.prefix}<span ref={r}>0</span>{s.suffix}</div>
    <p className="mt-2 text-sm uppercase tracking-[0.25em] text-navy/60">{s.label}</p></div>
}

export default function App() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | null = null
    if (!reduced) { lenis = new Lenis({ duration: 1.2, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(t => lenis!.raf(t * 1000)); gsap.ticker.lagSmoothing(0) }
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.from(el, { opacity: 0, y: 50, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
      gsap.from('.svc', { opacity: 0, y: 70, duration: 1.2, ease: 'power3.out', stagger: 0.14, scrollTrigger: { trigger: '#servicios .grid', start: 'top 85%' } })
      gsap.from('.pf', { opacity: 0, y: 60, scale: 0.96, duration: 1.2, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '#portfolio .grid', start: 'top 85%' } })
      gsap.fromTo('.circuit', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#proceso .tl', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 } })
      gsap.utils.toArray<HTMLElement>('.step').forEach((el, i) => gsap.from(el, { opacity: 0, y: 40, duration: 1, delay: i * 0.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }))
    })
    document.querySelectorAll<HTMLElement>('.card').forEach(c => c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px') }))
    const onLoad = () => ScrollTrigger.refresh(); addEventListener('load', onLoad)
    return () => { ctx.revert(); lenis?.destroy(); removeEventListener('load', onLoad) }
  }, [])

  return <>
    <Nav />
    <main>
      <Hero />
      <section id="servicios" className="mx-auto max-w-7xl px-6 py-32 md:py-44">
        <Head k={C.services.kicker} t={C.services.title} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {C.services.items.map((s, i) => <article key={s.title} className="svc card p-8 md:p-10 min-h-[320px] flex flex-col">
            <Icon n={s.icon} /><span className="mt-auto pt-16 text-xs text-navy/40 tabular-nums">0{i + 1}</span>
            <h3 className="mt-2 text-[22px] font-medium tracking-tight">{s.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-navy/60">{s.text}</p></article>)}
        </div></section>

      <section aria-label="Cifras" className="border-y border-navy/5 bg-[#fcfbf8] py-28 md:py-36">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-3">{C.stats.map(s => <Stat key={s.label} s={s} />)}</div></section>

      <section id="portfolio" className="mx-auto max-w-7xl px-6 py-32 md:py-44">
        <div className="flex flex-wrap items-end justify-between gap-6"><Head k={C.portfolio.kicker} t={C.portfolio.title} />
          <p className="reveal mb-16 text-sm text-navy/50">{C.portfolio.hint}</p></div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-12">
          {C.portfolio.items.map((p, i) => <figure key={i} className={`pf group card cursor-pointer ${p.vertical ? 'md:col-span-4 aspect-[9/14]' : 'md:col-span-8 aspect-[16/11]'} ${i % 2 ? 'mt-0' : ''}`}
            onMouseEnter={e => (e.currentTarget.querySelector('video') as HTMLVideoElement).play().catch(() => {})}
            onMouseLeave={e => { const v = e.currentTarget.querySelector('video') as HTMLVideoElement; v.pause() }}>
            <video src={asset(p.src)} muted loop playsInline preload="none" poster={asset('videos/poster-1.jpg')} className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
              <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.2em] backdrop-blur">{p.tag}</span>
              <span className="hidden text-[15px] font-medium md:block">{p.title}</span></figcaption></figure>)}
        </div></section>

      <section id="proceso" className="bg-navy py-32 text-white md:py-44">
        <div className="mx-auto max-w-7xl px-6"><div className="text-white"><Head k={C.process.kicker} t={C.process.title} /></div>
          <div className="tl relative">
            <svg className="absolute left-0 top-[11px] hidden h-6 w-full md:block" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden>
              <path d="M0 12 H230 L245 4 H480 L495 20 H730 L745 12 H1000" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <path className="circuit" d="M0 12 H230 L245 4 H480 L495 20 H730 L745 12 H1000" pathLength={1} strokeDasharray="1" fill="none" stroke="#D4A537" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /></svg>
            <ol className="grid gap-12 md:grid-cols-4">{C.process.steps.map((s, i) => <li key={s.title} className="step relative">
              <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-gold bg-navy text-sm text-goldl tabular-nums">0{i + 1}</span>
              <h3 className="mt-8 text-2xl font-light tracking-tight">{s.title}</h3>
              <p className="mt-3 max-w-[240px] text-[15px] leading-relaxed text-white/60">{s.text}</p></li>)}</ol>
          </div></div></section>

      <section id="contacto" className="relative overflow-hidden px-6 pb-24 pt-28 text-center">
        <div className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(242,201,76,.18),transparent)]" />
        <div className="relative mx-auto h-[360px] max-w-3xl md:h-[460px]"><Suspense fallback={null}><Logo3D /></Suspense></div>
        <h2 className="reveal h-display mx-auto mt-4 max-w-4xl text-[48px] md:text-[104px]">{C.cta.title}</h2>
        <p className="reveal mx-auto mt-6 max-w-md text-lg text-navy/60">{C.cta.text}</p>
        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href={`mailto:${C.email}`} className="rounded-full gold-bg px-9 py-4 text-[15px] font-medium text-navy transition-transform hover:scale-[1.03]">{C.cta.button}</a>
          <a href={C.youtube} className="rounded-full border border-navy/15 px-7 py-4 text-[15px] hover:border-gold">YouTube</a>
          <a href={C.tiktok} className="rounded-full border border-navy/15 px-7 py-4 text-[15px] hover:border-gold">TikTok</a></div>
      </section>
    </main>
    <footer className="border-t border-navy/5 px-6 py-8 text-center text-xs text-navy/45">{C.footer}</footer>
  </>
}
