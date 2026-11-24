import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { ACCENT } from './wheel'

const TAU = Math.PI * 2
const MOD = 0.1 // módulo del engranaje: radio primitivo = dientes · MOD / 2

function gearGeometry(teeth: number, depth: number) {
  const rp = teeth * MOD / 2, ra = rp + MOD, rr = rp - 1.25 * MOD, P = TAU / teeth
  const s = new THREE.Shape(), pt = (r: number, a: number) => [Math.cos(a) * r, Math.sin(a) * r] as const
  for (let k = 0; k < teeth; k++) {
    const c = k * P
    const seq: [number, number][] = [[rr, c - 0.5 * P], [rr, c - 0.28 * P], [ra, c - 0.12 * P], [ra, c], [ra, c + 0.12 * P], [rr, c + 0.28 * P]]
    seq.forEach(([r, a], i) => { const [x, y] = pt(r, a); k === 0 && i === 0 ? s.moveTo(x, y) : s.lineTo(x, y) })
  }
  s.closePath()
  const bore = rp * 0.2, hole = new THREE.Path(); hole.absarc(0, 0, bore, 0, TAU, true); s.holes.push(hole)
  if (teeth >= 16) {
    const n = 6, rc = (rr * 0.82 + bore * 1.6) / 2, rh = (rr * 0.82 - bore * 1.6) / 2 * 0.62
    for (let i = 0; i < n; i++) { const h = new THREE.Path(), a = i * TAU / n + P / 2; h.absarc(Math.cos(a) * rc, Math.sin(a) * rc, rh, 0, TAU, true); s.holes.push(h) }
  }
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.008, bevelSegments: 3, curveSegments: 40 }).translate(0, 0, -depth / 2)
}

export default function Gears3D() {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = host.current!
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace; el.appendChild(renderer.domElement)
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.9
    const key = new THREE.DirectionalLight(0xffffff, 2); key.position.set(3, 4, 6); scene.add(key)
    const glow = new THREE.PointLight(ACCENT, 0, 10); glow.position.set(0, 0, 2.5); scene.add(glow)

    const mats = [
      new THREE.MeshPhysicalMaterial({ color: ACCENT, metalness: 0.15, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 }),
      new THREE.MeshStandardMaterial({ color: 0xd6d9de, metalness: 1, roughness: 0.22 }),
      new THREE.MeshStandardMaterial({ color: 0x40444b, metalness: 0.9, roughness: 0.4 }),
    ]
    // tres engranajes encadenados (A ↔ B ↔ C) con el reparto de dientes correcto
    const spec = [{ n: 26, d: 0.26 }, { n: 14, d: 0.3 }, { n: 18, d: 0.22 }]
    const group = new THREE.Group(); scene.add(group)
    const gears = spec.map((g, i) => { const m = new THREE.Mesh(gearGeometry(g.n, g.d), mats[i]); group.add(m); return m })
    const rp = spec.map(g => g.n * MOD / 2), thAB = 0.42, thBC = -1.05
    gears[1].position.set(Math.cos(thAB) * (rp[0] + rp[1]), Math.sin(thAB) * (rp[0] + rp[1]), 0.06)
    gears[2].position.set(gears[1].position.x + Math.cos(thBC) * (rp[1] + rp[2]), gears[1].position.y + Math.sin(thBC) * (rp[1] + rp[2]), -0.05)
    const box = new THREE.Box3().setFromObject(group), c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3())
    group.children.forEach(o => o.position.sub(c))
    // fase para que los dientes engranen: rotB = θ + π − π/nB + (θ − rotA)·nA/nB
    const mesh = (th: number, rotA: number, nA: number, nB: number) => th + Math.PI - Math.PI / nB + (th - rotA) * nA / nB

    const resize = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix()
      const tv = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)); cam.position.z = Math.max(size.x / 2 / (tv * cam.aspect), size.y / 2 / tv) * 1.18 + 0.4 }
    resize(); const ro = new ResizeObserver(resize); ro.observe(el)
    const mouse = { x: 0, y: 0 }, cur = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => { const r = el.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2; mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2 }
    addEventListener('pointermove', onMove)
    let lastY = scrollY, boost = 0, rot = 0, raf = 0, visible = false, last = performance.now()
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) el.dataset.ready = '1' }); io.observe(el)
    const loop = () => { raf = requestAnimationFrame(loop)
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now
      if (!visible) return
      boost += (Math.min(Math.abs(scrollY - lastY) * 0.02, 3) - boost) * 0.08; lastY = scrollY
      if (!reduced) rot += dt * (0.35 + boost)
      const rB = mesh(thAB, rot, spec[0].n, spec[1].n), rC = mesh(thBC, rB, spec[1].n, spec[2].n)
      gears[0].rotation.z = rot; gears[1].rotation.z = rB; gears[2].rotation.z = rC
      cur.x += (mouse.x - cur.x) * 0.06; cur.y += (mouse.y - cur.y) * 0.06
      group.rotation.y = -0.35 + cur.x * 0.3; group.rotation.x = 0.18 + cur.y * 0.22
      glow.position.set(cur.x * 2, -cur.y * 1.5, 2.2); glow.intensity = 2.5 + boost * 4
      renderer.render(scene, cam) }
    loop()
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener('pointermove', onMove); pm.dispose(); renderer.dispose(); el.innerHTML = '' }
  }, [])
  return <div ref={host} className="h-full w-full" role="img" aria-label="Engranajes 3D que giran con el ratón y el scroll" />
}
