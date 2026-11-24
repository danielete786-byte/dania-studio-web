// Lluvia de piezas ligada al scroll (reversible): al bajar, las piezas caen por los laterales y,
// al llegar al pie, cada una vuela a su compartimento del maletín; al subir, todo hace el camino al revés.
// Se dibuja en un canvas fijo detrás del contenido, en coordenadas de píxel de la pantalla.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { buildCase } from './case'
import { TYPES, PartType } from './parts'

type Part = {
  t: PartType; obj: THREE.Object3D; slot: THREE.Vector3; restQ: THREE.Quaternion; side: number
  lane: number; sway: number; ph: number; rot0: THREE.Euler; spin: THREE.Vector3
  s: number; l: number // scroll (px) donde empieza a caer por el lateral y donde empieza a entrar en el maletín
}

const TILT = 0.66, YAW = -0.38, N = 36, PREFILL = 2
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const inOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
let seed = 11
const rnd = (a: number, b: number) => { seed = (seed * 16807) % 2147483647; return a + ((seed - 1) / 2147483646) * (b - a) }

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
    scene.environmentIntensity = 0.5
    // luz general para las piezas que caen + foco de estudio sobre el maletín (con sombras) + contraluz
    const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(-400, 900, 700); scene.add(key)
    const spot = new THREE.SpotLight(0xfff4e6, 3.6, 0, 0.62, 0.65, 0); spot.castShadow = true
    spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -0.0004; spot.shadow.normalBias = 1.2; spot.shadow.radius = 5
    scene.add(spot, spot.target)
    const back = new THREE.DirectionalLight(0x9fb4cc, 0.9); scene.add(back, back.target)

    let W = 1, H = 1, mobile = innerWidth < 768, casePx = 1
    const { root, comps, slot } = buildCase(mobile)
    const caseG = new THREE.Group(); caseG.rotation.set(TILT, YAW, 0); caseG.add(root); scene.add(caseG)
    const pick = (k: string) => comps.filter(c => c.key === k).sort((a, b) => a.used - b.used)[0]
    const restOf = (t: PartType) => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rnd(-0.25, 0.25), 0)).multiply(new THREE.Quaternion().setFromEuler(t.rest))

    // cada compartimento empieza con un par de piezas para que el maletín no se vea vacío
    for (const c of comps) for (let i = 0; i < PREFILL; i++) {
      const t = TYPES.find(x => x.key === c.key)!, o = t.build()
      o.position.copy(slot(c, t, c.used++)); o.quaternion.copy(restOf(t)); o.scale.setScalar(t.rel); root.add(o)
    }
    // las piezas que caen: tipos repartidos y un compartimento reservado para cada una
    const order = TYPES.map((_, i) => i).sort(() => rnd(0, 1) - 0.5)
    const parts: Part[] = Array.from({ length: N }, (_, i) => {
      const t = TYPES[order[i % order.length]], comp = pick(t.key)
      return { t, obj: t.build(), slot: slot(comp, t, comp.used++), restQ: restOf(t), side: i % 2 ? 1 : -1, lane: 0, sway: rnd(6, 16), ph: rnd(0, 6.28),
        rot0: new THREE.Euler(rnd(0, 6), rnd(0, 6), rnd(0, 6)), spin: new THREE.Vector3(rnd(-7, 7), rnd(-6, 6), rnd(-8, 8)), s: 0, l: 0 }
    })
    parts.forEach(p => { p.obj.visible = false; scene.add(p.obj) })

    // reparto de las piezas a lo largo del scroll de la página
    let R = 1, RL = 1, maxScroll = 1
    const measure = () => {
      W = innerWidth; H = innerHeight; mobile = W < 768
      renderer.setSize(W, H, false); cam.left = -W / 2; cam.right = W / 2; cam.top = H / 2; cam.bottom = -H / 2; cam.updateProjectionMatrix()
      const r = anchor.getBoundingClientRect(); casePx = r.width * (mobile ? 0.74 : 0.48); caseG.scale.setScalar(casePx)
      const sc = spot.shadow.camera; sc.near = 50; sc.far = 6000; sc.updateProjectionMatrix()
      const hero = document.querySelector<HTMLElement>('section[aria-label="Presentación"]')
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - H * 0.5 : H
      maxScroll = document.documentElement.scrollHeight - H
      const landStart = Math.min(r.top + scrollY - H * 0.85, maxScroll - 200), landEnd = maxScroll - 8
      R = H * (mobile ? 0.95 : 0.85); RL = Math.min(H * 0.55, (landEnd - landStart) * 0.55)
      const fallEnd = landStart - R * 0.6
      parts.forEach((p, i) => {
        p.s = fallEnd > heroEnd ? heroEnd + (fallEnd - heroEnd) * (i / (N - 1)) + rnd(-40, 40) : Infinity
        p.l = landStart + (landEnd - RL - landStart) * (i / (N - 1))
        const size = fallSize(p.t), gutter = Math.max(mobile ? 22 : 56, (W - 1280) / 2 + (mobile ? 12 : 24))
        const x = size * 0.4 + ((i * 37) % 100) / 100 * Math.max(0, gutter - size * 0.7)
        p.lane = p.side < 0 ? x : W - x
      })
    }
    const fallSize = (t: PartType) => Math.max(mobile ? 26 : 40, t.rel * casePx * (mobile ? 1.8 : 1.6))
    measure()
    let dirty = true
    const remeasure = () => { measure(); dirty = true }
    addEventListener('resize', remeasure)
    const bodyRO = new ResizeObserver(remeasure); bodyRO.observe(document.body)

    const v = new THREE.Vector3(), q = new THREE.Quaternion(), caseQ = new THREE.Quaternion(), fallQ = new THREE.Quaternion(), e3 = new THREE.Euler()
    let raf = 0, lastY = NaN, lastTop = NaN
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const S = reduced ? maxScroll : scrollY, r = anchor.getBoundingClientRect()
      if (S === lastY && r.top === lastTop && !dirty) return
      lastY = S; lastTop = r.top; dirty = false

      // maletín anclado a su hueco del pie de página, con el foco encima
      caseG.position.set(r.left + r.width / 2 - W / 2, H / 2 - (r.top + r.height * 0.7), 0)
      caseG.updateMatrixWorld(true); caseG.getWorldQuaternion(caseQ)
      caseG.localToWorld(spot.position.set(0.15, 2.3, 1.1)); spot.target.position.copy(caseG.position)
      caseG.localToWorld(back.position.set(0.3, 1.2, -2.5)); back.target.position.copy(caseG.position)

      let stored = 0
      for (const p of parts) {
        const pl = clamp((S - p.l) / RL), pf = clamp((S - p.s) / R), size = fallSize(p.t)
        if (pl >= 1) { // guardada en su compartimento
          if (p.obj.parent !== root) root.add(p.obj)
          p.obj.position.copy(p.slot); p.obj.quaternion.copy(p.restQ); p.obj.scale.setScalar(p.t.rel); p.obj.visible = true; stored++
          continue
        }
        if (p.obj.parent !== scene) scene.add(p.obj)
        if (pl > 0) { // entrando en el maletín desde arriba de la pantalla
          const e = inOut(pl)
          caseG.localToWorld(v.copy(p.slot))
          const sx = p.lane - W / 2, sy = H / 2 + size
          p.obj.position.set(sx + (v.x - sx) * e, sy + (v.y - sy) * e + Math.sin(Math.PI * e) * 70, 320 + (v.z - 320) * e)
          e3.set(p.rot0.x + p.spin.x * (1 - e), p.rot0.y + p.spin.y * (1 - e), p.rot0.z + p.spin.z * (1 - e)); fallQ.setFromEuler(e3)
          p.obj.quaternion.slerpQuaternions(fallQ, q.copy(caseQ).multiply(p.restQ), e)
          p.obj.scale.setScalar(size + (p.t.rel * casePx - size) * e); p.obj.visible = true
        } else if (pf > 0 && pf < 1) { // cayendo por el lateral
          const y = -size + (H + 2 * size) * pf ** 1.25
          p.obj.position.set(p.lane + Math.sin(pf * 7 + p.ph) * p.sway - W / 2, H / 2 - y, 320)
          p.obj.rotation.set(p.rot0.x + p.spin.x * pf, p.rot0.y + p.spin.y * pf, p.rot0.z + p.spin.z * pf)
          p.obj.scale.setScalar(size); p.obj.visible = true
        } else p.obj.visible = false
      }
      if (counter) counter.textContent = String(stored)
      renderer.render(scene, cam)
    }
    frame()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', remeasure); bodyRO.disconnect(); pm.dispose(); renderer.dispose() }
  }, [crateId, countId])
  return <canvas ref={cv} aria-hidden className="pointer-events-none fixed inset-0 z-[5] h-[100vh] w-[100vw]" />
}
