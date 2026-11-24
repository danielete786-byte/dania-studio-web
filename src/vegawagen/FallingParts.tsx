// Lluvia de piezas ligada al scroll (reversible): al bajar, las piezas caen por los laterales; en la
// escena final (fija mientras se hace scroll) cada una vuela a su compartimento del maletín, la tapa
// se cierra, los cierres encajan y se enciende el logo de neón de la tapa. Al subir, todo al revés.
// Se dibuja en un canvas fijo detrás del contenido, en coordenadas de píxel de la pantalla.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { buildCase } from './case'
import { TYPES, PartType } from './parts'
import { studioEnvironment } from './env'
import { sound } from './sound'

type Part = {
  t: PartType; obj: THREE.Object3D; slot: THREE.Vector3; restQ: THREE.Quaternion; side: number
  lane: number; sway: number; ph: number; rot0: THREE.Euler; spin: THREE.Vector3
  s: number; l: number; prev: number // scroll (px) donde cae por el lateral y donde entra en el maletín
}

const TILT = 0.66, YAW = -0.38, N = 36, PREFILL = 2
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const inOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
let seed = 11
const rnd = (a: number, b: number) => { seed = (seed * 16807) % 2147483647; return a + ((seed - 1) / 2147483646) * (b - a) }

export default function FallingParts({ crateId = 'crate', countId = 'crate-count' }: { crateId?: string; countId?: string }) {
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = cv.current!, anchor = document.getElementById(crateId), counter = document.getElementById(countId)
    const finale = document.getElementById('final'), done = document.getElementById('crate-done')
    if (!anchor || !finale) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }) } catch { return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
    const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -3000, 3000)
    scene.environment = studioEnvironment(renderer); scene.environmentIntensity = 0.75
    // luz general para las piezas que caen + foco de estudio sobre el maletín (con sombras) + contraluz + luz del neón
    const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(-400, 900, 700); scene.add(key)
    const spot = new THREE.SpotLight(0xfff4e6, 3.6, 0, 0.62, 0.65, 0); spot.castShadow = true
    spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -0.0004; spot.shadow.normalBias = 1.2; spot.shadow.radius = 5
    scene.add(spot, spot.target)
    const back = new THREE.DirectionalLight(0x9fb4cc, 0.9); scene.add(back, back.target)
    const glow = new THREE.PointLight(0x22e1ee, 0, 0, 0); scene.add(glow)

    let W = 1, H = 1, mobile = innerWidth < 768, casePx = 1
    const { root, comps, slot, lid, levers, logoMat } = buildCase(mobile)
    const caseG = new THREE.Group(); caseG.rotation.set(TILT, YAW, 0); caseG.add(root); scene.add(caseG)
    const pick = (k: string) => comps.filter(c => c.key === k).sort((a, b) => a.used - b.used)[0]
    const restOf = (t: PartType) => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rnd(-0.25, 0.25), 0)).multiply(new THREE.Quaternion().setFromEuler(t.rest))
    const OFF = new THREE.Color(0x3a3d42), ON = new THREE.Color(0xffffff)

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
        rot0: new THREE.Euler(rnd(0, 6), rnd(0, 6), rnd(0, 6)), spin: new THREE.Vector3(rnd(-7, 7), rnd(-6, 6), rnd(-8, 8)), s: 0, l: 0, prev: 0 }
    })
    parts.forEach(p => { p.obj.visible = false; scene.add(p.obj) })

    // reparto a lo largo del scroll: caída por los laterales en el cuerpo de la página;
    // en la escena final: piezas al maletín (0–50 %), tapa (55–80 %), cierres (80–88 %), neón (86–96 %)
    let R = 1, RL = 1, F0 = 0, PIN = 1
    const measure = () => {
      W = innerWidth; H = innerHeight; mobile = W < 768
      renderer.setSize(W, H, false); cam.left = -W / 2; cam.right = W / 2; cam.top = H / 2; cam.bottom = -H / 2; cam.updateProjectionMatrix()
      const r = anchor.getBoundingClientRect(); casePx = r.width * (mobile ? 0.74 : 0.48); caseG.scale.setScalar(casePx)
      const sc = spot.shadow.camera; sc.near = 50; sc.far = 6000; sc.updateProjectionMatrix()
      const hero = document.querySelector<HTMLElement>('section[aria-label="Presentación"]')
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - H * 0.5 : H
      F0 = finale.offsetTop; PIN = Math.max(1, finale.offsetHeight - H)
      const landStart = F0 - H * 0.45, landEnd = F0 + PIN * 0.5
      R = H * (mobile ? 0.95 : 0.85); RL = Math.min(H * 0.6, (landEnd - landStart) * 0.3)
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
    let raf = 0, lastY = NaN, lastTop = NaN, prevLid = 0, prevLatch = 0, prevNeon = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const S = reduced ? F0 + PIN : scrollY, r = anchor.getBoundingClientRect()
      if (S === lastY && r.top === lastTop && !dirty) return
      const forward = S > lastY
      lastY = S; lastTop = r.top; dirty = false

      // escena final: tapa, cierres y neón
      const pin = (S - F0) / PIN
      const pc = inOut(clamp((pin - 0.55) / 0.25)), pk = inOut(clamp((pin - 0.8) / 0.08)), pn = clamp((pin - 0.86) / 0.1)
      lid.rotation.x = lerp(-1.95, 0, pc)
      levers.forEach((lv, i) => { lv.rotation.x = lerp(-0.25, -3.08, clamp(pk * 1.15 - i * 0.15)) })
      const flicker = pn > 0 && pn < 0.6 ? (Math.sin(pn * 90) > -0.2 ? 1 : 0.15) : 1, lit = pn * flicker
      logoMat.color.copy(OFF).lerp(ON, lit); logoMat.opacity = lerp(0.5, 1, lit)
      if (forward && prevLid < 1 && pc >= 1) sound.clunk()
      if (forward && prevLatch < 1 && pk >= 1) sound.latch()
      if (forward && prevNeon === 0 && pn > 0) sound.neon()
      prevLid = pc; prevLatch = pk; prevNeon = pn
      if (done) done.style.opacity = String(pn)

      // maletín anclado a su hueco; al cerrarse gira un poco para enseñar la tapa
      caseG.rotation.set(lerp(TILT, 0.98, pc), lerp(YAW, -0.16, pc), 0)
      caseG.position.set(r.left + r.width / 2 - W / 2, H / 2 - (r.top + r.height * lerp(0.7, 0.62, pc)), 0)
      caseG.updateMatrixWorld(true); caseG.getWorldQuaternion(caseQ)
      caseG.localToWorld(spot.position.set(0.15, 2.3, 1.1)); spot.target.position.copy(caseG.position)
      caseG.localToWorld(back.position.set(0.3, 1.2, -2.5)); back.target.position.copy(caseG.position)
      caseG.localToWorld(glow.position.set(0, 0.95, -0.1)); glow.intensity = lit * 0.9

      let stored = 0
      for (const p of parts) {
        const pl = clamp((S - p.l) / RL), pf = clamp((S - p.s) / R), size = fallSize(p.t)
        if (forward && p.prev < 1 && pl >= 1) sound.clink(0.75 + (0.09 - p.t.rel) * 6)
        p.prev = pl
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
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', remeasure); bodyRO.disconnect(); renderer.dispose() }
  }, [crateId, countId])
  return <canvas ref={cv} aria-hidden className="pointer-events-none fixed inset-0 z-[5] h-[100vh] w-[100vw]" />
}
