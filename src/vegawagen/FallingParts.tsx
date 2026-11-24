// Lluvia de piezas: al bajar por la página caen piezas por los laterales y, al llegar al pie,
// cada una vuela a su compartimento del maletín organizador (tornillos con tornillos, muelles con muelles…).
// Todo se dibuja en un canvas fijo detrás del contenido, en coordenadas de píxel de la pantalla.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { buildCase, Compartment } from './case'
import { TYPES, PartType } from './parts'

type Part = {
  t: PartType; obj: THREE.Object3D; comp: Compartment; slot: THREE.Vector3; restQ: THREE.Quaternion
  phase: 'air' | 'queue' | 'land' | 'done'; side: number
  x: number; y: number; vy: number; ang: number; av: number; tx: number; ty: number; rx: number; ry: number; lane: number; sway: number; ph: number
  t0: number; dur: number; sPos: THREE.Vector3; sQuat: THREE.Quaternion; sScale: number
}

const TILT = 0.66, YAW = -0.38, MAX = 40, PREFILL = 2
const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const inOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

export default function FallingParts({ crateId = 'crate', countId = 'crate-count' }: { crateId?: string; countId?: string }) {
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = cv.current!, anchor = document.getElementById(crateId), counter = document.getElementById(countId)
    if (!anchor) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }) } catch { return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
    const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -3000, 3000)
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.75
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.castShadow = true
    key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0005; key.shadow.normalBias = 1.5; key.shadow.radius = 4
    scene.add(key, key.target)
    const fill = new THREE.DirectionalLight(0xc9d6e6, 0.6); fill.position.set(600, 200, 800); scene.add(fill)

    let W = 1, H = 1, mobile = innerWidth < 768, casePx = 1, heroEnd = 0, step = 1, nextAt = 0
    const { root, comps, slot } = buildCase(mobile)
    const caseG = new THREE.Group(); caseG.rotation.set(TILT, YAW, 0); caseG.add(root); scene.add(caseG)
    const byType = (k: string) => comps.filter(c => c.key === k).sort((a, b) => a.used - b.used)[0]

    const measure = () => {
      W = innerWidth; H = innerHeight; mobile = W < 768
      renderer.setSize(W, H, false); cam.left = -W / 2; cam.right = W / 2; cam.top = H / 2; cam.bottom = -H / 2; cam.updateProjectionMatrix()
      const r = anchor.getBoundingClientRect(); casePx = r.width * (mobile ? 0.78 : 0.56); caseG.scale.setScalar(casePx)
      const sc = key.shadow.camera; sc.left = sc.bottom = -casePx * 1.4; sc.right = sc.top = casePx * 1.4; sc.near = 1; sc.far = 4000; sc.updateProjectionMatrix()
      const hero = document.querySelector<HTMLElement>('section[aria-label="Presentación"]')
      heroEnd = hero ? hero.offsetTop + hero.offsetHeight - H * 0.6 : H
      step = H * (mobile ? 0.34 : 0.24)
    }
    measure(); nextAt = heroEnd
    let dirty = true
    const onResize = () => { measure(); dirty = true }
    addEventListener('resize', onResize)

    const parts: Part[] = []
    let spawned = 0, pending = 0, landed = 0, lastSpawn = 0, lastDrop = 0, lastTop = NaN
    const order = TYPES.map((_, i) => i).sort(() => Math.random() - 0.5)
    const make = (t: PartType, phase: Part['phase']): Part => {
      const comp = byType(t.key), restQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rnd(-0.25, 0.25), 0)).multiply(new THREE.Quaternion().setFromEuler(t.rest))
      const obj = t.build(), p: Part = { t, obj, comp, slot: slot(comp, t, comp.used++), restQ, phase, side: spawned % 2 ? 1 : -1,
        x: 0, y: 0, vy: 0, ang: rnd(0, 6.28), av: rnd(-3, 3), tx: rnd(0, 6), ty: rnd(0, 6), rx: rnd(-3, 3), ry: rnd(-2.5, 2.5), lane: 0, sway: rnd(4, 12), ph: rnd(0, 6.28),
        t0: 0, dur: 0.7, sPos: new THREE.Vector3(), sQuat: new THREE.Quaternion(), sScale: 1 }
      parts.push(p); return p
    }
    const settle = (p: Part) => { root.add(p.obj); p.obj.position.copy(p.slot); p.obj.quaternion.copy(p.restQ); p.obj.scale.setScalar(p.t.rel); p.phase = 'done' }
    // cada compartimento empieza con un par de piezas para que el maletín no se vea vacío
    for (const c of comps) for (let i = 0; i < PREFILL; i++) { const t = TYPES.find(x => x.key === c.key)!, comp = c, restQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rnd(-0.25, 0.25), 0)).multiply(new THREE.Quaternion().setFromEuler(t.rest))
      const o = t.build(); o.position.copy(slot(comp, t, comp.used++)); o.quaternion.copy(restQ); o.scale.setScalar(t.rel); root.add(o) }
    if (reduced) for (let i = 0; i < MAX - 10; i++) { const p = make(TYPES[order[i % order.length]], 'done'); settle(p); landed++ }

    const laneX = (side: number, size: number) => {
      const gutter = Math.max(mobile ? 22 : 56, (W - 1280) / 2 + (mobile ? 12 : 24))
      const x = rnd(size * 0.4, Math.max(size * 0.45, gutter - size * 0.3)); return side < 0 ? x : W - x
    }
    const fallSize = (t: PartType) => Math.max(mobile ? 26 : 40, t.rel * casePx * (mobile ? 1.8 : 1.6))
    const toWorld = (sx: number, sy: number, z: number, out: THREE.Vector3) => out.set(sx - W / 2, H / 2 - sy, z)
    const startLanding = (p: Part, now: number) => {
      scene.add(p.obj); p.obj.visible = true
      p.sPos.copy(p.obj.position); p.sQuat.copy(p.obj.quaternion); p.sScale = p.obj.scale.x
      p.t0 = now; p.dur = 0.6 + Math.min(0.6, p.sPos.distanceTo(caseG.position) / 2400); p.phase = 'land'
    }
    const tmpV = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), caseQ = new THREE.Quaternion()

    let raf = 0, last = performance.now(), time = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt
      const r = anchor.getBoundingClientRect(), visible = r.top < H + 60 && r.bottom > -200
      if (r.top !== lastTop) { dirty = true; lastTop = r.top }
      // el maletín sigue a su hueco en el pie de página
      caseG.position.set(r.left + r.width / 2 - W / 2, H / 2 - (r.top + r.height * 0.7), 0)
      caseG.updateMatrixWorld(true); caseG.getWorldQuaternion(caseQ)
      key.target.position.copy(caseG.position); key.position.copy(caseG.position).add(tmpV.set(-0.45, 0.85, 0.7).normalize().multiplyScalar(1500))

      if (!reduced) {
        while (scrollY > nextAt && spawned + pending < MAX) { pending++; nextAt += step }
        if (pending > 0 && time - lastSpawn > 0.12) {
          pending--; lastSpawn = time
          const p = make(TYPES[order[spawned % order.length]], 'air'), size = fallSize(p.t); spawned++
          p.obj.scale.setScalar(size); p.lane = laneX(p.side, size); p.x = p.lane; p.y = -size; p.vy = rnd(120, 260)
          toWorld(p.x, p.y, 320, p.obj.position); scene.add(p.obj)
          if (visible) startLanding(p, time)
        }
        for (const p of parts) {
          if (p.phase === 'air') {
            p.vy = Math.min(p.vy + 1500 * dt, mobile ? 620 : 760); p.y += p.vy * dt
            p.x = p.lane + Math.sin(time * 1.4 + p.ph) * p.sway; p.ang += p.av * dt; p.tx += p.rx * dt; p.ty += p.ry * dt
            toWorld(p.x, p.y, 320, p.obj.position); p.obj.rotation.set(p.tx, p.ty, -p.ang)
            if (visible) startLanding(p, time)
            else if (p.y > H + 80) { p.phase = 'queue'; p.obj.visible = false }
          }
        }
        // las que pasaron de largo antes de ver el maletín caen ahora desde arriba, una tras otra
        if (visible && time - lastDrop > 0.09) {
          const q = parts.find(p => p.phase === 'queue')
          if (q) { lastDrop = time; const size = fallSize(q.t); q.obj.scale.setScalar(size); toWorld(laneX(q.side, size), -size, 320, q.obj.position); startLanding(q, time) }
        }
      }
      for (const p of parts) if (p.phase === 'land') {
        const t = Math.min(1, (time - p.t0) / p.dur), e = inOut(t)
        caseG.localToWorld(tmpV.copy(p.slot))
        p.obj.position.lerpVectors(p.sPos, tmpV, e); p.obj.position.y += Math.sin(Math.PI * e) * 60 // pequeño arco
        p.obj.quaternion.slerpQuaternions(p.sQuat, tmpQ.copy(caseQ).multiply(p.restQ), e)
        p.obj.scale.setScalar(p.sScale + (p.t.rel * casePx - p.sScale) * e)
        if (t >= 1) { settle(p); landed++ }
      }
      const active = parts.some(p => p.phase === 'air' || p.phase === 'land') || pending > 0
      if (active) dirty = true
      if (!dirty) return
      dirty = false
      if (counter) counter.textContent = String(landed)
      renderer.render(scene, cam)
    }
    frame()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); pm.dispose(); renderer.dispose() }
  }, [crateId, countId])
  return <canvas ref={cv} aria-hidden className="pointer-events-none fixed inset-0 z-[5] h-[100vh] w-[100vw]" />
}
