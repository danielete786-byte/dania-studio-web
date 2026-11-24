import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildBadge, studioBackdrop, floorTexture, shadowTexture } from './badge'
import { vw, img } from './content'
import { PhoneIco, WaIco, Wordmark } from './brand'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const inOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

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

    // ── estudio: fondo gris azulado, suelo con reflejo y cuadrícula
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 0.1, 200)
    scene.background = studioBackdrop()
    const pm = new THREE.PMREMGenerator(renderer)
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.02).texture
    scene.environmentIntensity = 0.92
    const key = new THREE.DirectionalLight(0xffffff, 1.3); key.position.set(-3, 5, 5); scene.add(key)
    const fill = new THREE.DirectionalLight(0xbcd2ea, 0.9); fill.position.set(5, 1, 3); scene.add(fill)
    const rim = new THREE.DirectionalLight(0x9fb7d4, 1.4); rim.position.set(0, 3, -6); scene.add(rim)
    const sweep = new THREE.PointLight(0xffffff, 0, 6); scene.add(sweep)

    const mobileStart = innerWidth < 768, FLOOR = -2.15
    if (!mobileStart) {
      const mirror = new Reflector(new THREE.PlaneGeometry(30, 30), { textureWidth: 1024, textureHeight: 1024, color: 0x7d8894 })
      mirror.rotation.x = -Math.PI / 2; mirror.position.y = FLOOR; scene.add(mirror)
    }
    const tint = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ color: 0x27303a, transparent: true, opacity: mobileStart ? 1 : 0.74, depthWrite: false }))
    tint.rotation.x = -Math.PI / 2; tint.position.y = FLOOR + 0.002; scene.add(tint)
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ map: floorTexture(), transparent: true, depthWrite: false }))
    grid.rotation.x = -Math.PI / 2; grid.position.y = FLOOR + 0.004; scene.add(grid)
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.3), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false, opacity: 0 }))
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = FLOOR + 0.006; scene.add(shadow)

    const { group, pieces, axes } = buildBadge()
    const rig = new THREE.Group(); rig.add(group); scene.add(rig)
    const lineMats = pieces.map(p => { const m = (p.line!.material as THREE.LineDashedMaterial).clone(); p.line!.material = m; return m })
    const axesMat = (axes.children[0] as THREE.Line).material as THREE.LineDashedMaterial
    if (total.current) total.current.textContent = String(pieces.length)

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

    let target = reduced ? 1 : 0, prog = target
    const st = ScrollTrigger.create({ trigger: wrap.current, start: 'top top', end: 'bottom bottom', onUpdate: s => { if (!reduced) target = s.progress } })
    const mouse = { x: 0, y: 0 }, m = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', onMove)

    let visible = true, raf = 0, last = performance.now(), time = 0, lastCount = -1, shake = 0
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(host)
    const from = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), prevT = pieces.map(() => 0)

    const frame = () => {
      raf = requestAnimationFrame(frame)
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now
      if (!visible) return
      if (!reduced) time += dt
      prog += (target - prog) * (1 - Math.exp(-dt * 6))
      m.x += (mouse.x - m.x) * 0.05; m.y += (mouse.y - m.y) * 0.05
      const k = mobile ? 0.7 : 1

      // montaje: cada pieza vuelve a su sitio siguiendo su línea de despiece
      let placed = 0
      pieces.forEach((p, i) => {
        const t = clamp((prog - p.t0) / (p.t1 - p.t0)), e = inOut(t), free = 1 - e
        if (t >= 1) placed++
        from.set(p.home.x + (p.from.x - p.home.x) * k, p.home.y + (p.from.y - p.home.y) * k, p.home.z + (p.from.z - p.home.z) * k)
        p.obj.position.lerpVectors(from, p.home, e)
        p.obj.position.y += Math.sin(time * 0.8 + p.phase) * 0.035 * free
        p.obj.quaternion.slerpQuaternions(p.fromQ, p.homeQ, e)
        if (p.kind === 'screw') p.obj.rotateOnAxis(Y, free * Math.PI * 8) // se enrosca
        // la línea discontinua une la pieza con su asiento y se acorta al montarse
        const pos = p.line!.geometry.attributes.position as THREE.BufferAttribute
        pos.setXYZ(1, p.obj.position.x, p.obj.position.y, p.obj.position.z); pos.needsUpdate = true; p.line!.computeLineDistances()
        lineMats[i].opacity = 0.42 * smooth(0, 0.25, free)
        if (prevT[i] < 1 && t >= 1 && target > prevT[i]) shake = Math.min(1, shake + (p.kind === 'ring' || p.kind === 'letter' ? 0.35 : 0.12))
        prevT[i] = t
      })
      axesMat.opacity = 0.4 * (1 - smooth(0.62, 0.74, prog))
      const done = smooth(0.66, 0.76, prog), show = smooth(0.76, 0.9, prog)
      ;(shadow.material as THREE.MeshBasicMaterial).opacity = 0.25 + done * 0.5
      sweep.intensity = show * 1.4; sweep.position.set(Math.sin(time * 0.6) * 2.8, 1.4, 3.6)

      // composición: despiece a la derecha del título → emblema centrado y de frente al terminar
      const a = smooth(0.03, 0.3, prog), tv = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), th = tv * cam.aspect
      const Dx = mobile ? Math.max(2.3 * k / th, 2.8 / tv) : Math.max(3.4 / tv, 4.5 / th)
      const Dd = mobile ? Math.max(1.45 / th, 2.2 / tv) : Math.max(2.25 / tv, 2.9 / th)
      const D = lerp(Dx, Dd, smooth(0.35, 0.78, prog))
      rig.position.set(lerp(mobile ? 0 : Dx * th * 0.36, 0, a), lerp(mobile ? -1.2 : -0.35, lerp(-0.3, 0.1, smooth(0.5, 0.8, prog)), a), 0)
      const turn = smooth(0.05, 0.8, prog)
      group.rotation.y = lerp(mobile ? -0.45 : -0.6, 0, turn) + m.x * 0.45 + Math.sin(time * 0.45) * 0.22 * show
      group.rotation.x = lerp(0.12, 0, turn) + m.y * 0.2
      shadow.position.x = rig.position.x
      shake *= Math.exp(-dt * 10)
      cam.position.set(-m.x * 0.6 + (Math.random() - 0.5) * shake * 0.035, 1.05 - m.y * 0.3 + (Math.random() - 0.5) * shake * 0.035, D)
      cam.lookAt(0, -0.05, 0)
      composer.render(dt)

      // capas HTML
      intro.current!.style.opacity = String(1 - smooth(0.02, 0.12, prog))
      intro.current!.style.transform = `translateY(${-smooth(0.02, 0.12, prog) * 50}px)`
      outro.current!.style.opacity = String(smooth(0.8, 0.9, prog))
      outro.current!.style.transform = `translateY(${(1 - smooth(0.8, 0.9, prog)) * 24}px)`
      hint.current!.style.opacity = String(1 - smooth(0.01, 0.06, prog))
      hud.current!.style.opacity = String(smooth(0.05, 0.12, prog) * (1 - smooth(0.74, 0.8, prog)))
      if (placed !== lastCount) { lastCount = placed; count.current!.textContent = String(placed) }
      bar.current!.style.transform = `scaleX(${placed / pieces.length})`
    }
    frame()
    return () => { cancelAnimationFrame(raf); st.kill(); ro.disconnect(); io.disconnect(); removeEventListener('pointermove', onMove)
      pm.dispose(); composer.dispose(); renderer.dispose(); host.innerHTML = '' }
  }, [])

  return (
    <section ref={wrap} className="relative h-[100svh] motion-safe:h-[440vh]" aria-label="Presentación">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#1c232b]">
        {noGL && <img src={img.neon} alt="Rótulo de neón de Vegawagen" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
        <div ref={stage} className="absolute inset-0" role="img" aria-label="Emblema cromado en despiece que se monta pieza a pieza al hacer scroll" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_45%,transparent_60%,rgba(8,10,13,.7))]" />

        <div ref={intro} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,15,.9)_0%,rgba(10,12,15,.65)_36%,transparent_58%)] max-md:bg-[linear-gradient(180deg,rgba(10,12,15,.9)_0%,rgba(10,12,15,.6)_46%,transparent_66%)]" />
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
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">Montando pieza a pieza · <span ref={count} className="text-neon">0</span>/<span ref={total}>26</span></p>
          <div className="mt-3 h-px overflow-hidden bg-white/15"><div ref={bar} className="h-full origin-left bg-neon shadow-[0_0_12px_#22E1EE]" style={{ transform: 'scaleX(0)' }} /></div>
        </div>

        <div ref={outro} className="pointer-events-none absolute inset-x-0 bottom-16 px-5 text-center opacity-0 md:bottom-10">
          <Wordmark className="mx-auto text-[28px] sm:text-[44px] md:text-[56px]" />
          <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-white/65 md:text-[13px]">{vw.hero.outro}</p>
        </div>

        <p ref={hint} className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/50 motion-reduce:hidden md:text-[11px]" aria-hidden>{vw.hero.scroll}</p>
      </div>
    </section>)
}
