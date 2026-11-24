import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildBadge } from './badge'
import { vw, img } from './content'
import { PhoneIco, WaIco, Wordmark } from './brand'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const inOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

// Secuencia con el scroll: montado → se desmonta (de fuera hacia dentro) → se vuelve a montar
const EXPLODE = [0.06, 0.3], ASSEMBLE = [0.5, 0.76], DUR = 0.1

export default function Hero() {
  const wrap = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null)
  const intro = useRef<HTMLDivElement>(null), outro = useRef<HTMLDivElement>(null), hint = useRef<HTMLParagraphElement>(null)
  const hud = useRef<HTMLDivElement>(null), count = useRef<HTMLSpanElement>(null), total = useRef<HTMLSpanElement>(null), bar = useRef<HTMLDivElement>(null)
  const [noGL, setNoGL] = useState(false)

  useEffect(() => {
    const host = stage.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }) }
    catch { setNoGL(true); return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)

    // ── estudio negro: sin guías ni cuadrícula, solo un reflejo muy tenue en el suelo
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 0.1, 200)
    scene.background = new THREE.Color(0x020203)
    const pm = new THREE.PMREMGenerator(renderer)
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.02).texture
    scene.environmentIntensity = 0.9
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-3, 5, 5); scene.add(key)
    const fill = new THREE.DirectionalLight(0xd6e0ec, 0.6); fill.position.set(5, 1, 3); scene.add(fill)
    const rim = new THREE.DirectionalLight(0xbfd2e8, 1.6); rim.position.set(0, 3, -6); scene.add(rim)
    const sweep = new THREE.PointLight(0xffffff, 0, 6); scene.add(sweep)

    const FLOOR = -1.75
    if (innerWidth >= 768) {
      const mirror = new Reflector(new THREE.PlaneGeometry(30, 30), { textureWidth: 1024, textureHeight: 1024, color: 0x5a5f66 })
      mirror.rotation.x = -Math.PI / 2; mirror.position.y = FLOOR; scene.add(mirror)
      const tint = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ color: 0x020203, transparent: true, opacity: 0.86, depthWrite: false }))
      tint.rotation.x = -Math.PI / 2; tint.position.y = FLOOR + 0.002; scene.add(tint)
    }

    const { group, pieces } = buildBadge()
    const rig = new THREE.Group(); rig.add(group); scene.add(rig)
    if (total.current) total.current.textContent = String(pieces.length)
    // orden: al montar va de dentro hacia fuera (carcasa → tornillos); al desmontar, al revés
    const t0s = pieces.map(p => p.t0), lo = Math.min(...t0s), hi = Math.max(...t0s)
    const u = pieces.map(p => (p.t0 - lo) / (hi - lo || 1))

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, cam))
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.16, 0.4, 0.96); composer.addPass(bloom)
    composer.addPass(new OutputPass())

    let W = 1, H = 1, mobile = false
    const resize = () => {
      W = host.clientWidth; H = host.clientHeight; mobile = W < 768
      renderer.setSize(W, H); composer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2)); composer.setSize(W, H)
      cam.aspect = W / H; cam.updateProjectionMatrix()
    }
    resize(); const ro = new ResizeObserver(resize); ro.observe(host)

    let target = 0, prog = 0
    const st = ScrollTrigger.create({ trigger: wrap.current, start: 'top top', end: 'bottom bottom', onUpdate: s => { if (!reduced) target = s.progress } })
    const mouse = { x: 0, y: 0 }, m = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', onMove)

    let visible = true, raf = 0, last = performance.now(), time = 0, lastCount = -1
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(host)
    const from = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0)

    const frame = () => {
      raf = requestAnimationFrame(frame)
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now
      if (!visible) return
      if (!reduced) time += dt
      prog += (target - prog) * (1 - Math.exp(-dt * 6))
      m.x += (mouse.x - m.x) * 0.05; m.y += (mouse.y - m.y) * 0.05
      const k = mobile ? 0.7 : 1

      // f = 0 montado, 1 desmontado
      let inPlace = 0
      pieces.forEach((p, i) => {
        const e0 = lerp(EXPLODE[0], EXPLODE[1], 1 - u[i]), a0 = lerp(ASSEMBLE[0], ASSEMBLE[1], u[i])
        const f = inOut(clamp((prog - e0) / DUR)) - inOut(clamp((prog - a0) / DUR))
        if (f < 0.02) inPlace++
        from.set(p.home.x + (p.from.x - p.home.x) * k, p.home.y + (p.from.y - p.home.y) * k, p.home.z + (p.from.z - p.home.z) * k)
        p.obj.position.lerpVectors(p.home, from, f)
        p.obj.position.y += Math.sin(time * 0.8 + p.phase) * 0.035 * f
        p.obj.quaternion.slerpQuaternions(p.homeQ, p.fromQ, f)
        if (p.kind === 'screw') p.obj.rotateOnAxis(Y, f * Math.PI * 8) // se desenrosca / enrosca
      })
      const E = smooth(EXPLODE[0], EXPLODE[1] + DUR, prog) - smooth(ASSEMBLE[0], ASSEMBLE[1] + DUR, prog)
      const show = smooth(0.86, 0.95, prog)
      sweep.intensity = show * 1.4; sweep.position.set(Math.sin(time * 0.6) * 2.8, 1.4, 3.6)

      // composición: a la derecha del título → centrado → de frente al final
      const a = smooth(0.02, 0.2, prog), tv = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), th = tv * cam.aspect
      const Dx = mobile ? Math.max(2.3 * k / th, 2.8 / tv) : Math.max(3.3 / tv, 4.4 / th)
      const Dd = mobile ? Math.max(1.45 / th, 2.2 / tv) : Math.max(2.25 / tv, 2.9 / th)
      const D = lerp(Dd, Dx, E)
      rig.position.set(lerp(mobile ? 0 : Dd * th * 0.5, 0, a), lerp(mobile ? -0.95 : -0.05, lerp(0.05, -0.2, E), a), 0)
      group.rotation.y = lerp(lerp(-0.42, -0.62, E), 0, smooth(0.62, 0.9, prog)) + m.x * 0.45 + Math.sin(time * 0.45) * 0.22 * show
      group.rotation.x = 0.06 * E + m.y * 0.2
      cam.position.set(-m.x * 0.6, 0.85 - m.y * 0.3, D)
      cam.lookAt(0, -0.05, 0)
      composer.render(dt)

      // capas HTML
      intro.current!.style.opacity = String(1 - smooth(0.02, 0.12, prog))
      intro.current!.style.transform = `translateY(${-smooth(0.02, 0.12, prog) * 50}px)`
      outro.current!.style.opacity = String(smooth(0.86, 0.94, prog))
      outro.current!.style.transform = `translateY(${(1 - smooth(0.86, 0.94, prog)) * 24}px)`
      hint.current!.style.opacity = String(1 - smooth(0.01, 0.06, prog))
      hud.current!.style.opacity = String(smooth(0.05, 0.1, prog) * (1 - smooth(0.84, 0.88, prog)))
      if (inPlace !== lastCount) { lastCount = inPlace; count.current!.textContent = String(inPlace) }
      bar.current!.style.transform = `scaleX(${inPlace / pieces.length})`
    }
    frame()
    return () => { cancelAnimationFrame(raf); st.kill(); ro.disconnect(); io.disconnect(); removeEventListener('pointermove', onMove)
      pm.dispose(); composer.dispose(); renderer.dispose(); host.innerHTML = '' }
  }, [])

  return (
    <section ref={wrap} className="relative h-[100svh] motion-safe:h-[460vh]" aria-label="Presentación">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        {noGL && <img src={img.neon} alt="Rótulo de neón de Vegawagen" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
        <div ref={stage} className="absolute inset-0" role="img" aria-label="Emblema cromado que se desmonta y se vuelve a montar al hacer scroll" />

        <div ref={intro} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_36%,transparent_58%)] max-md:bg-[linear-gradient(180deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.5)_46%,transparent_66%)]" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-start px-5 pt-24 md:justify-center md:px-8 md:pt-0">
          <p className="kicker mb-4 !tracking-[0.18em] md:mb-6 md:!tracking-[0.28em]">{vw.hero.kicker}</p>
          <h1 className="h-cond text-[50px] leading-[0.9] sm:text-[80px] lg:text-[112px]">
            <span className="grad-text block">{vw.hero.title[0]}</span><span className="neon-text block">{vw.hero.title[1]}</span></h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/70 md:mt-7 md:text-[18px]">{vw.hero.text}</p>
          <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-3 md:mt-9">
            <a href={vw.phoneHref} className="btn-neon"><PhoneIco /> {vw.phone}</a>
            <a href={vw.whatsappHref} target="_blank" rel="noopener" className="btn-ghost"><WaIco /> WhatsApp</a>
            <span className="hidden items-center gap-2 text-[14px] text-white/65 sm:flex"><span className="text-neon">★</span> {vw.rating.toLocaleString('es-ES')} en Google</span>
          </div>
        </div></div>

        <div ref={hud} className="pointer-events-none absolute bottom-8 left-1/2 w-[min(340px,84vw)] -translate-x-1/2 text-center opacity-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">Piezas en su sitio · <span ref={count} className="text-neon">26</span>/<span ref={total}>26</span></p>
          <div className="mt-3 h-px overflow-hidden bg-white/15"><div ref={bar} className="h-full origin-left bg-neon shadow-[0_0_12px_#22E1EE]" style={{ transform: 'scaleX(1)' }} /></div>
        </div>

        <div ref={outro} className="pointer-events-none absolute inset-x-0 bottom-16 px-5 text-center opacity-0 md:bottom-10">
          <Wordmark className="mx-auto text-[28px] sm:text-[44px] md:text-[56px]" />
          <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-white/65 md:text-[13px]">{vw.hero.outro}</p>
        </div>

        <p ref={hint} className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/50 motion-reduce:hidden md:text-[11px]" aria-hidden>{vw.hero.scroll}</p>
      </div>
    </section>)
}
