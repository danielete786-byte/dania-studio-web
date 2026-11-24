// Lluvia de piezas: al bajar por la página caen piezas de coche por los laterales y,
// al llegar al pie, se guardan en la caja con física 2D (matter-js) y aspecto 3D (three.js).
// Fase A: caída libre en coordenadas de pantalla. Fase B: dentro de la caja, en coordenadas de la caja.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import Matter from 'matter-js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { PARTS, PartDef } from './parts'

type Base = { def: PartDef; obj: THREE.Object3D; size: number; tx: number; ty: number; rx: number; ry: number; side: number; z: number }
type Air = Base & { x: number; y: number; vy: number; ang: number; av: number; lane: number; sway: number; phase: number }
type Boxed = Base & { body: Matter.Body; slot: number }

const MAX = 36
const rnd = (a: number, b: number) => a + Math.random() * (b - a)

export default function FallingParts({ crateId = 'crate', countId = 'crate-count' }: { crateId?: string; countId?: string }) {
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = cv.current!, crate = document.getElementById(crateId), counter = document.getElementById(countId)
    if (!crate) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }) } catch { return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000)
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.8
    const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(0.4, 1, 0.8); scene.add(key)

    // ── física de la caja
    const engine = Matter.Engine.create({ enableSleeping: true, positionIterations: 8, velocityIterations: 6 })
    engine.gravity.scale = 0.0011
    let walls: Matter.Body[] = [], bw = 0, bh = 0
    const buildWalls = (w: number, h: number) => {
      if (walls.length) Matter.Composite.remove(engine.world, walls)
      const t = 80, o = { isStatic: true, friction: 0.8 }
      walls = [Matter.Bodies.rectangle(w / 2, h + t / 2, w + 2 * t, t, o), Matter.Bodies.rectangle(-t / 2, h / 2 - 20, t, h + 40, o), Matter.Bodies.rectangle(w + t / 2, h / 2 - 20, t, h + 40, o)]
      Matter.Composite.add(engine.world, walls); bw = w; bh = h
      Matter.Composite.allBodies(engine.world).forEach(b => Matter.Sleeping.set(b, false))
    }

    let W = 1, H = 1, mobile = false, heroEnd = 0, step = 1, nextAt = 0
    const measure = () => {
      W = innerWidth; H = innerHeight; mobile = W < 768
      renderer.setSize(W, H, false); cam.left = -W / 2; cam.right = W / 2; cam.top = H / 2; cam.bottom = -H / 2; cam.updateProjectionMatrix()
      const hero = document.querySelector<HTMLElement>('section[aria-label="Presentación"]')
      heroEnd = hero ? hero.offsetTop + hero.offsetHeight - H * 0.6 : H
      step = H * (mobile ? 0.42 : 0.28)
      const r = crate.getBoundingClientRect(); if (Math.abs(r.width - bw) > 1 || Math.abs(r.height - bh) > 1) buildWalls(r.width, r.height)
    }
    measure(); nextAt = heroEnd
    const onResize = () => { measure(); dirty = true }
    addEventListener('resize', onResize)

    const air: Air[] = [], boxed: Boxed[] = []
    let spawned = 0, pending = 0, queued: Base[] = [], lastSpawn = 0, lastDrop = 0, dirty = true, lastTop = NaN
    const order = PARTS.map((_, i) => i).sort(() => Math.random() - 0.5)

    const make = (): Base => {
      const def = PARTS[order[spawned % order.length]], side = spawned % 2 ? 1 : -1
      const size = (mobile ? 40 : 74) * def.scale * rnd(0.9, 1.15)
      const obj = def.build(); obj.scale.setScalar(size); scene.add(obj); spawned++
      return { def, obj, size, tx: rnd(0, 6), ty: rnd(0, 6), rx: rnd(-3, 3), ry: rnd(-2.5, 2.5), side, z: -spawned * 3 }
    }
    const laneX = (side: number, size: number) => {
      const gutter = Math.max(mobile ? 22 : 48, (W - 1280) / 2 + (mobile ? 12 : 24))
      const x = rnd(size * 0.35, Math.max(size * 0.4, gutter - size * 0.3))
      return side < 0 ? x : W - x
    }
    const toBox = (p: Base, lx: number, ly: number, vx = 0, vy = 3) => {
      const s = p.def.shape, opts = { restitution: 0.12, friction: 0.7, frictionStatic: 0.9, frictionAir: 0.012, density: 0.002, sleepThreshold: 45 }
      const body = s.type === 'circle' ? Matter.Bodies.circle(lx, ly, s.r * p.size, opts)
        : Matter.Bodies.rectangle(lx, ly, s.w * p.size, s.h * p.size, { ...opts, chamfer: { radius: Math.min(s.w, s.h) * p.size * 0.3 } })
      Matter.Body.setAngle(body, rnd(0, Math.PI * 2)); Matter.Body.setVelocity(body, { x: vx, y: vy }); Matter.Body.setAngularVelocity(body, rnd(-0.08, 0.08))
      Matter.Composite.add(engine.world, body)
      boxed.push({ ...p, body, slot: rnd(0.12, 0.88) })
    }

    // con movimiento reducido: la caja ya aparece llena y sin animación
    if (reduced) {
      for (let i = 0; i < MAX - 8; i++) toBox(make(), rnd(30, bw - 30), -i * 40, 0, 0)
      for (let i = 0; i < 600; i++) Matter.Engine.update(engine, 1000 / 60)
    }

    let raf = 0, last = performance.now(), time = 0, acc = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt
      const r = crate.getBoundingClientRect(), boxVisible = r.top < H + 40 && r.bottom > -200
      if (r.top !== lastTop) { dirty = true; lastTop = r.top }

      if (!reduced) {
        // nuevas piezas según se avanza con el scroll (solo pasada la portada)
        while (scrollY > nextAt && spawned + pending < MAX) { pending++; nextAt += step }
        if (pending > 0 && time - lastSpawn > 0.14) {
          pending--; lastSpawn = time
          const p = make(), x = laneX(p.side, p.size)
          if (boxVisible) toBox(p, x - r.left, -r.top - p.size)
          else air.push({ ...p, x, y: -p.size, vy: rnd(120, 260), ang: rnd(0, 6.28), av: rnd(-3, 3), lane: x, sway: rnd(4, 14), phase: rnd(0, 6.28) })
        }
        // fase A: caída libre por el lateral
        for (let i = air.length - 1; i >= 0; i--) {
          const p = air[i]
          p.vy = Math.min(p.vy + 1500 * dt, mobile ? 620 : 760); p.y += p.vy * dt
          p.x = p.lane + Math.sin(time * 1.4 + p.phase) * p.sway; p.ang += p.av * dt; p.tx += p.rx * dt; p.ty += p.ry * dt
          if (boxVisible) { air.splice(i, 1); toBox(p, p.x - r.left, p.y - r.top, 0, p.vy / 60) }
          else if (p.y > H + p.size) { air.splice(i, 1); queued.push(p); p.obj.visible = false }
        }
        // las que bajaron antes de ver la caja caen ahora dentro, una tras otra
        if (boxVisible && queued.length && time - lastDrop > 0.11) {
          lastDrop = time; const p = queued.shift()!; p.obj.visible = true
          toBox(p, laneX(p.side, p.size) - r.left, -r.top - p.size - 20)
        }
      }

      // fase B: guiar hacia la caja lo que aún está por encima y simular
      const g = engine.gravity.y * engine.gravity.scale * (1000 / 60) ** 2
      for (const b of boxed) {
        const { position: pos, velocity: v } = b.body
        if (pos.y < -8) {
          const h = -pos.y, steps = (-v.y + Math.sqrt(Math.max(0, v.y * v.y + 2 * g * h))) / g
          const target = b.slot * bw, vx = (target - pos.x) / Math.max(steps, 6)
          Matter.Body.setVelocity(b.body, { x: v.x + (vx - v.x) * 0.25, y: v.y })
        }
        if (pos.y > bh + 400 || Math.abs(pos.x - bw / 2) > W * 1.5) { Matter.Body.setPosition(b.body, { x: b.slot * bw, y: -120 }); Matter.Body.setVelocity(b.body, { x: 0, y: 0 }) }
      }
      // paso fijo de 1/60 s según el tiempo real (si el móvil va a 30 fps, la física no va a cámara lenta)
      const awake = boxed.some(b => !b.body.isSleeping)
      if (awake) { acc += dt; let n = 0; while (acc >= 1 / 60 && n < 4) { Matter.Engine.update(engine, 1000 / 60); acc -= 1 / 60; n++ } if (n === 4) acc = 0; dirty = true } else acc = 0
      if (air.length || pending) dirty = true
      if (!dirty) return
      dirty = false

      for (const p of air) { p.obj.position.set(p.x - W / 2, H / 2 - p.y, p.z); p.obj.rotation.set(p.tx, p.ty, -p.ang) }
      for (const b of boxed) {
        // al caer en la caja, la pieza se queda de frente (como su silueta física)
        if (b.body.position.y > -b.size) { b.tx += (Math.round(b.tx / Math.PI) * Math.PI - b.tx) * 0.12; b.ty += (Math.round(b.ty / Math.PI) * Math.PI - b.ty) * 0.12 }
        else { b.tx += b.rx * dt; b.ty += b.ry * dt }
        b.obj.position.set(r.left + b.body.position.x - W / 2, H / 2 - (r.top + b.body.position.y), b.z)
        b.obj.rotation.set(b.tx, b.ty, -b.body.angle)
      }
      if (counter) counter.textContent = String(boxed.filter(b => b.body.position.y > 0).length)
      renderer.render(scene, cam)
    }
    frame()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); Matter.Engine.clear(engine); pm.dispose(); renderer.dispose() }
  }, [crateId, countId])
  return <canvas ref={cv} aria-hidden className="pointer-events-none fixed inset-0 z-[5] h-[100vh] w-[100vw]" />
}
