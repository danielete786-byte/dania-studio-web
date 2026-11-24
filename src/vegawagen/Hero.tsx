import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildWheel, ACCENT } from './wheel'
import { vw } from './content'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
// lado de cada etiqueta (-1 izquierda, 1 derecha) y orden: neumático, frenos, suspensión, buje
const SIDES = [1, 1, -1, -1], SIDES_MOBILE = [-1, 1, 1, 1]

export default function Hero() {
  const wrap = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null)
  const intro = useRef<HTMLDivElement>(null), outro = useRef<HTMLDivElement>(null)
  const labels = useRef<HTMLDivElement>(null), bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = stage.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }) }
    catch { host.classList.add('no-webgl'); return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    const pm = new THREE.PMREMGenerator(renderer)
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.85
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 5, 6); scene.add(key)
    const rim = new THREE.PointLight(ACCENT, 40, 12); rim.position.set(-3, 1.5, -2.5); scene.add(rim)
    const fill = new THREE.DirectionalLight(0x9fb4ff, 0.6); fill.position.set(-5, -2, 3); scene.add(fill)

    const { root, parts } = buildWheel()
    const tilt = new THREE.Group(), turn = new THREE.Group()
    tilt.add(turn); turn.add(root); scene.add(tilt)
    const list = Object.values(parts), base = list.map(p => p.carrier.position.clone())
    const anchorParts = [parts.tire, parts.caliper, parts.strut, parts.hub]
    const labelEls = Array.from(labels.current!.querySelectorAll<HTMLElement>('[data-label]'))
    // caja envolvente de cada pieza (coordenadas locales) para encuadrar la cámara automáticamente
    root.updateMatrixWorld(true)
    const boxes = list.map((p, i) => new THREE.Box3().setFromObject(p.carrier).translate(base[i].clone().negate()))
    const corners = list.map(() => Array.from({ length: 8 }, () => new THREE.Vector3()))

    let W = 1, H = 1, mobile = false, tagW: number[] = []
    const measure = () => { tagW = labelEls.map(el => { const l = el.querySelector<HTMLElement>('.hero-line'), t = el.querySelector<HTMLElement>('.hero-tag'); return (l?.offsetWidth ?? 0) + (t?.offsetWidth ?? 0) + 8 }) }
    document.fonts?.ready.then(measure)
    const resize = () => {
      W = host.clientWidth; H = host.clientHeight; mobile = W < 768; measure()
      // en móvil la etiqueta del buje apunta a los espárragos para no chocar con la del amortiguador
      parts.hub.anchor?.position.set(...(mobile ? [0.24, 0.1, 0.12] : [-0.2, 0.05, 0.16]) as [number, number, number])
      renderer.setSize(W, H); cam.aspect = W / H; cam.updateProjectionMatrix()
    }
    resize(); const ro = new ResizeObserver(resize); ro.observe(host)

    // distancia de cámara para que quepa un objeto de semiejes (hx, hy) en pantalla
    const fit = (hx: number, hy: number, margin: number) => {
      const tv = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), th = tv * cam.aspect
      return Math.max(hx / th, hy / tv) / margin
    }

    let target = 0, prog = reduced ? 0 : 0
    const st = ScrollTrigger.create({ trigger: wrap.current, start: 'top top', end: 'bottom bottom',
      onUpdate: s => { target = s.progress; if (bar.current) bar.current.style.transform = `scaleX(${s.progress})` } })
    const mouse = { x: 0, y: 0 }, m = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', onMove)

    let visible = true, raf = 0, last = performance.now(), spin = 0, lastProg = 0
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(host)
    const v = new THREE.Vector3()

    const frame = () => {
      raf = requestAnimationFrame(frame)
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now
      if (!visible) return
      prog += (target - prog) * (1 - Math.exp(-dt * 7))
      m.x += (mouse.x - m.x) * 0.05; m.y += (mouse.y - m.y) * 0.05
      const a = smooth(0.06, 0.36, prog), e = smooth(0.28, 0.66, prog)

      // giro de la rueda: lento en reposo, acelera con el scroll
      const vel = Math.abs(prog - lastProg) / Math.max(dt, 1e-3); lastProg = prog
      if (!reduced) spin += dt * (0.55 * (1 - e * 0.7) + Math.min(vel * 6, 8))

      // despiece
      const k = mobile ? 0.72 : 1, shift = 0.5 * e * k
      list.forEach((p, i) => {
        p.carrier.position.copy(base[i]).addScaledVector(p.explode, e * k); p.carrier.position.x -= shift
        if (p.spins) p.spinner.rotation.x = spin
      })
      // el amortiguador aparece durante el despiece (montado taparía el título)
      const sIn = smooth(0.08, 0.5, e); parts.strut.carrier.scale.setScalar(Math.max(sIn, 0.001)); parts.strut.carrier.visible = sIn > 0.002

      // orientación: de frente → tres cuartos
      turn.rotation.y = lerp(-Math.PI / 2 + 0.5, -0.5, a) + m.x * 0.35
      turn.rotation.x = lerp(0.1, 0.22, a) + m.y * 0.16
      tilt.rotation.z = lerp(mobile ? 0.15 : 0.12, mobile ? 1.25 : 0.08, a)
      tilt.position.set(lerp(mobile ? 0 : 1.75, 0, a), lerp(mobile ? -1.05 : -0.05, 0, a), 0)

      // encuadre: al principio fijo (rueda a la derecha del título); después, la cámara se ajusta a todas las piezas
      tilt.updateMatrixWorld(true)
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
      list.forEach((p, i) => { if (!p.carrier.visible) return
        const b = boxes[i]; corners[i].forEach((c, j) => { c.set(j & 1 ? b.max.x : b.min.x, j & 2 ? b.max.y : b.min.y, j & 4 ? b.max.z : b.min.z); p.carrier.localToWorld(c)
          x0 = Math.min(x0, c.x); x1 = Math.max(x1, c.x); y0 = Math.min(y0, c.y); y1 = Math.max(y1, c.y) }) })
      const tv = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), th = tv * cam.aspect
      const hm = mobile ? 0.9 : 0.86, vm = mobile ? 0.7 : 0.66, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
      let dAuto = 0
      list.forEach((p, i) => { if (p.carrier.visible) corners[i].forEach(c => { dAuto = Math.max(dAuto, c.z + Math.abs(c.x - cx) / (th * hm), c.z + Math.abs(c.y - cy) / (tv * vm)) }) })
      const dA = mobile ? fit(1.12, 1.6, 0.92) : fit(1.25 + 1.75, 1.45, 0.98)
      dAuto = Math.max(dAuto, dA * 0.85)
      const w = smooth(0, 1, a), D = lerp(dA, dAuto, w)
      const tx = lerp(0, cx, w), ty = lerp(mobile ? -0.15 : 0, cy - D * tv * (mobile ? 0.1 : 0.13), w)
      cam.position.set(tx - m.x * 0.4, ty + 0.45 - m.y * 0.3, D)
      cam.lookAt(tx, ty, 0)
      renderer.render(scene, cam)

      // capas HTML
      intro.current!.style.opacity = String(1 - smooth(0.02, 0.14, prog))
      intro.current!.style.transform = `translateY(${-smooth(0.02, 0.14, prog) * 60}px)`
      outro.current!.style.opacity = String(smooth(0.8, 0.9, prog))
      outro.current!.style.transform = `translateY(${(1 - smooth(0.8, 0.9, prog)) * 30}px)`
      anchorParts.forEach((p, i) => {
        const el = labelEls[i]; if (!el || !p.anchor) return
        const o = smooth(0.6 + i * 0.045, 0.66 + i * 0.045, prog)
        p.anchor.getWorldPosition(v).project(cam)
        el.style.opacity = String(o)
        // la etiqueta cambia de lado si no cabe en pantalla
        const sx = (v.x * 0.5 + 0.5) * W, need = tagW[i] + 16
        const side = (mobile ? SIDES_MOBILE : SIDES)[i] < 0 ? (sx < need ? 'r' : 'l') : (sx > W - need ? 'l' : 'r')
        if (el.dataset.side !== side) el.dataset.side = side
        el.style.transform = `translate(${(v.x * 0.5 + 0.5) * W}px, ${(-v.y * 0.5 + 0.5) * H}px)`
        el.style.setProperty('--line', String(o))
      })
    }
    frame()
    return () => { cancelAnimationFrame(raf); st.kill(); ro.disconnect(); io.disconnect(); removeEventListener('pointermove', onMove)
      pm.dispose(); renderer.dispose(); host.innerHTML = '' }
  }, [])

  return (
    <section ref={wrap} className="relative h-[100svh] motion-safe:h-[420vh]" aria-label="Presentación">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="hero-bg absolute inset-0" aria-hidden />
        <div ref={stage} className="absolute inset-0" role="img" aria-label="Rueda, disco y pinza de freno, buje y amortiguador en 3D que se despiezan al hacer scroll" />

        <div ref={intro} className="pointer-events-none absolute inset-0 mx-auto flex max-w-7xl flex-col justify-start px-5 pt-28 md:justify-center md:px-8 md:pt-0">
          <p className="kicker mb-4 !tracking-[0.18em] md:mb-6 md:!tracking-[0.28em]">{vw.hero.kicker}</p>
          <h1 className="h-cond text-[52px] leading-[0.9] sm:text-[80px] lg:text-[116px]">
            <span className="block">{vw.hero.title[0]}</span><span className="block text-ember">{vw.hero.title[1]}</span></h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/65 md:mt-7 md:text-[18px]">{vw.hero.text}</p>
          <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-3 md:mt-9">
            <a href={vw.phoneHref} className="btn-ember">{vw.hero.cta} · {vw.phone}</a>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-[14px] text-white/75 backdrop-blur">
              <span className="text-ember">★</span> {vw.rating.toLocaleString('es-ES')} en Google</span>
          </div>
        </div>

        <div ref={outro} className="pointer-events-none absolute inset-x-0 bottom-24 px-5 text-center opacity-0 md:bottom-28">
          <p className="h-cond text-[40px] leading-[0.92] md:text-[72px]">{vw.hero.outro[0]} <span className="text-ember">{vw.hero.outro[1]}</span></p>
        </div>

        <div ref={labels} className="pointer-events-none absolute inset-0" aria-hidden>
          {vw.heroLabels.map((l, i) => (
            <div key={l} data-label data-side={SIDES[i] < 0 ? 'l' : 'r'} className="hero-label absolute left-0 top-0 opacity-0">
              <span className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember ring-[5px] ring-ember/25" />
              <span className="hero-line" />
              <span className="hero-tag">{l}</span>
            </div>))}
        </div>

        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/45 motion-reduce:hidden md:text-[11px]">
          {vw.hero.scroll}
          <div className="h-px w-40 overflow-hidden bg-white/10"><div ref={bar} className="h-full origin-left bg-ember" style={{ transform: 'scaleX(0)' }} /></div>
        </div>
      </div>
    </section>)
}
