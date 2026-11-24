import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildEmblem, glowTexture, NEON } from './emblem'
import { vw, img } from './content'
import { PhoneIco, WaIco, Wordmark } from './brand'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => 1 - (1 - t) ** 3

export default function Hero() {
  const wrap = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null)
  const intro = useRef<HTMLDivElement>(null), outro = useRef<HTMLDivElement>(null), hint = useRef<HTMLParagraphElement>(null)
  const hud = useRef<HTMLDivElement>(null), count = useRef<HTMLSpanElement>(null), bar = useRef<HTMLDivElement>(null)
  const [noGL, setNoGL] = useState(false)

  useEffect(() => {
    const host = stage.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }) }
    catch { setNoGL(true); return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    scene.background = new THREE.Color(0x07090c)
    const pm = new THREE.PMREMGenerator(renderer)
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.03).texture
    scene.environmentIntensity = 0.75
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 6); scene.add(key)
    const rimL = new THREE.DirectionalLight(0x9ad8ff, 0.8); rimL.position.set(-6, 2, -3); scene.add(rimL)
    const cyanA = new THREE.PointLight(NEON, 0, 9), cyanB = new THREE.PointLight(NEON, 0, 9)
    cyanA.position.set(-2.2, 1.6, 2.4); cyanB.position.set(2.4, -1.4, 2.2); scene.add(cyanA, cyanB)

    const { group, pieces, gear, materials } = buildEmblem()
    const rig = new THREE.Group(); rig.add(group); scene.add(rig)
    // halo de neón detrás del emblema
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: glowTexture(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
    halo.position.z = -1.4; rig.add(halo)
    // polvo en suspensión, como en un taller con luz
    const N = 260, dust = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) { dust[i * 3] = (Math.random() - 0.5) * 14; dust[i * 3 + 1] = (Math.random() - 0.5) * 9; dust[i * 3 + 2] = (Math.random() - 0.5) * 6 }
    const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3))
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xbff6fa, size: 0.022, transparent: true, opacity: 0.45, depthWrite: false })))

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, cam))
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.2, 0.5, 0.92); composer.addPass(bloom)
    composer.addPass(new OutputPass())

    let W = 1, H = 1, mobile = false
    const resize = () => {
      W = host.clientWidth; H = host.clientHeight; mobile = W < 768
      renderer.setSize(W, H); composer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2)); composer.setSize(W, H)
      cam.aspect = W / H; cam.updateProjectionMatrix()
    }
    resize(); const ro = new ResizeObserver(resize); ro.observe(host)

    let target = reduced ? 1 : 0, prog = target
    const st = ScrollTrigger.create({ trigger: wrap.current, start: 'top top', end: 'bottom bottom',
      onUpdate: s => { if (!reduced) target = s.progress } })
    const mouse = { x: 0, y: 0 }, m = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', onMove)

    let visible = true, raf = 0, last = performance.now(), time = 0, gearAngle = 0, lastProg = prog, lastCount = -1
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(host)
    const q = new THREE.Quaternion(), idle = new THREE.Quaternion(), Z = new THREE.Vector3(0, 0, 1)

    const frame = () => {
      raf = requestAnimationFrame(frame)
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now
      if (!visible) return
      if (!reduced) time += dt
      prog += (target - prog) * (1 - Math.exp(-dt * 6))
      m.x += (mouse.x - m.x) * 0.05; m.y += (mouse.y - m.y) * 0.05
      const vel = Math.abs(prog - lastProg) / Math.max(dt, 1e-3); lastProg = prog
      if (!reduced) gearAngle += dt * (0.2 + Math.min(vel * 4, 5))

      // montaje: cada pieza vuela desde su posición inicial hasta su sitio
      const k = mobile ? 0.72 : 0.85
      let placed = 0
      for (const p of pieces) {
        const t = clamp((prog - p.t0) / (p.t1 - p.t0)), e = ease(t), free = 1 - e
        if (t >= 1) placed++
        p.obj.position.set(lerp(p.home.x + (p.from.x - p.home.x) * k, p.home.x, e), lerp(p.home.y + (p.from.y - p.home.y) * k, p.home.y, e), lerp(p.from.z, p.home.z, e))
        p.obj.position.y += Math.sin(time * 0.9 + p.phase) * 0.12 * free
        idle.setFromAxisAngle(p.axis, time * 0.35 * free)
        q.copy(p.fromQ).multiply(idle).slerp(p.homeQ, e)
        p.obj.quaternion.copy(q)
        if (p.kind === 'bolt') p.obj.rotateOnAxis(Z, (1 - e) * Math.PI * 6) // se enrosca al entrar
      }
      gear.rotateOnAxis(Z, gearAngle)

      // encendido del neón con parpadeo, como un rótulo de verdad
      const pw = smooth(0.73, 0.8, prog), flick = pw > 0 && pw < 1 ? (Math.sin(prog * 2400) > -0.3 ? 1 : 0.12) : 1
      const glow = pw * flick
      materials.neon.emissiveIntensity = 0.04 + glow * 2.4
      cyanA.intensity = cyanB.intensity = glow * 1.6
      ;(halo.material as THREE.MeshBasicMaterial).opacity = 0.04 + glow * (mobile ? 0.14 : 0.3)
      bloom.strength = 0.18 + glow * (mobile ? 0.3 : 0.5)

      // composición: a la derecha del título al principio, centrado al montarse, en vitrina al final
      const a = smooth(0.04, 0.3, prog), show = smooth(0.8, 0.95, prog)
      const tv = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), th = tv * cam.aspect
      const D = mobile ? Math.max(2.05 / (th * 0.9), 1.95 / (tv * 0.42)) : Math.max(1.95 / (tv * 0.56), 1.95 / (th * 0.6))
      rig.position.set(lerp(mobile ? 0 : D * th * 0.42, 0, a), lerp(mobile ? -D * tv * 0.42 : 0, D * tv * (mobile ? 0.1 : 0.12), a), 0)
      rig.scale.setScalar(lerp(0.82, 1, a))
      group.rotation.y = m.x * 0.5 + Math.sin(time * 0.5) * 0.32 * show + lerp(-0.35, 0, a)
      group.rotation.x = m.y * 0.3 + lerp(0.15, 0, a) - 0.06 * show
      const ds = dustGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < N; i++) { let y = ds.getY(i) + dt * 0.08; if (y > 4.5) y = -4.5; ds.setY(i, y) }
      ds.needsUpdate = true
      cam.position.set(-m.x * 0.5, -m.y * 0.35, D)
      cam.lookAt(0, 0, 0)
      composer.render(dt)

      // capas HTML
      intro.current!.style.opacity = String(1 - smooth(0.02, 0.12, prog))
      intro.current!.style.transform = `translateY(${-smooth(0.02, 0.12, prog) * 50}px)`
      outro.current!.style.opacity = String(smooth(0.8, 0.9, prog))
      outro.current!.style.transform = `translateY(${(1 - smooth(0.8, 0.9, prog)) * 24}px)`
      hint.current!.style.opacity = String(1 - smooth(0.01, 0.06, prog))
      hud.current!.style.opacity = String(smooth(0.05, 0.12, prog) * (1 - smooth(0.76, 0.82, prog)))
      if (placed !== lastCount) { lastCount = placed; count.current!.textContent = String(placed) }
      bar.current!.style.transform = `scaleX(${placed / pieces.length})`
    }
    frame()
    return () => { cancelAnimationFrame(raf); st.kill(); ro.disconnect(); io.disconnect(); removeEventListener('pointermove', onMove)
      pm.dispose(); composer.dispose(); renderer.dispose(); host.innerHTML = '' }
  }, [])

  return (
    <section ref={wrap} className="relative h-[100svh] motion-safe:h-[440vh]" aria-label="Presentación">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
        {noGL && <img src={img.neon} alt="Rótulo de neón de Vegawagen" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
        <div ref={stage} className="absolute inset-0" role="img" aria-label="Emblema de Vegawagen en 3D que se monta pieza a pieza al hacer scroll y enciende su neón" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_55%,rgba(7,9,12,.85))]" />

        <div ref={intro} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,12,.92)_0%,rgba(7,9,12,.75)_38%,transparent_62%)] max-md:bg-[linear-gradient(180deg,rgba(7,9,12,.92)_0%,rgba(7,9,12,.7)_48%,transparent_70%)]" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-start px-5 pt-24 md:justify-center md:px-8 md:pt-0">
          <p className="kicker mb-4 !tracking-[0.18em] md:mb-6 md:!tracking-[0.28em]">{vw.hero.kicker}</p>
          <h1 className="h-cond text-[50px] leading-[0.9] sm:text-[80px] lg:text-[112px]">
            <span className="block">{vw.hero.title[0]}</span><span className="neon-text block">{vw.hero.title[1]}</span></h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/65 md:mt-7 md:text-[18px]">{vw.hero.text}</p>
          <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-3 md:mt-9">
            <a href={vw.phoneHref} className="btn-neon"><PhoneIco /> {vw.phone}</a>
            <a href={vw.whatsappHref} target="_blank" rel="noopener" className="btn-ghost"><WaIco /> WhatsApp</a>
            <span className="hidden items-center gap-2 text-[14px] text-white/60 sm:flex"><span className="text-neon">★</span> {vw.rating.toLocaleString('es-ES')} en Google</span>
          </div>
        </div></div>

        <div ref={hud} className="pointer-events-none absolute bottom-8 left-1/2 w-[min(340px,84vw)] -translate-x-1/2 text-center opacity-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">Montando pieza a pieza · <span ref={count} className="text-neon">0</span>/43</p>
          <div className="mt-3 h-px overflow-hidden bg-white/10"><div ref={bar} className="h-full origin-left bg-neon shadow-[0_0_12px_#22E1EE]" style={{ transform: 'scaleX(0)' }} /></div>
        </div>

        <div ref={outro} className="pointer-events-none absolute inset-x-0 bottom-20 px-5 text-center opacity-0 md:bottom-14">
          <Wordmark className="mx-auto text-[28px] sm:text-[44px] md:text-[58px]" />
          <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-white/60 md:text-[13px]">{vw.hero.outro}</p>
        </div>

        <p ref={hint} className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/45 motion-reduce:hidden md:text-[11px]" aria-hidden>{vw.hero.scroll}</p>
      </div>
    </section>)
}
