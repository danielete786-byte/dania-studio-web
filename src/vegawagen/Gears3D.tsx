import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { studioEnvironment } from './env'
import { NEON } from './emblem'
import { gearGeometry, meshPhase as mesh } from './gear'

const MOD = 0.1

export default function Gears3D() {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = host.current!
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace; el.appendChild(renderer.domElement)
    // el lienzo ocupa su hueco por CSS: nunca fija un ancho en píxeles que desborde la pantalla del móvil
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    scene.environment = studioEnvironment(renderer)
    scene.environmentIntensity = 0.9
    const key = new THREE.DirectionalLight(0xffffff, 2); key.position.set(3, 4, 6); scene.add(key)
    const glow = new THREE.PointLight(NEON, 0, 10); glow.position.set(0, 0, 2.5); scene.add(glow)

    const mats = [
      new THREE.MeshStandardMaterial({ color: 0x0f1216, emissive: NEON, emissiveIntensity: 0.0, metalness: 0.9, roughness: 0.35 }),
      new THREE.MeshStandardMaterial({ color: 0xd6d9de, metalness: 1, roughness: 0.22 }),
      new THREE.MeshStandardMaterial({ color: 0x40444b, metalness: 0.9, roughness: 0.4 }),
    ]
    // tres engranajes encadenados (A ↔ B ↔ C) con el reparto de dientes correcto
    const spec = [{ n: 26, d: 0.26 }, { n: 14, d: 0.3 }, { n: 18, d: 0.22 }]
    const group = new THREE.Group(); scene.add(group)
    const gears = spec.map((g, i) => { const m = new THREE.Mesh(gearGeometry(g.n, g.d, MOD), mats[i]); group.add(m); return m })
    // borde de neón en el engranaje grande
    const ring = new THREE.Mesh(new THREE.TorusGeometry(spec[0].n * MOD / 2 * 0.3, 0.02, 12, 96), new THREE.MeshStandardMaterial({ color: 0x0d2b30, emissive: NEON, emissiveIntensity: 2.2 }))
    ring.position.z = spec[0].d / 2 + 0.03; gears[0].add(ring)
    const rp = spec.map(g => g.n * MOD / 2), thAB = 0.42, thBC = -1.05
    gears[1].position.set(Math.cos(thAB) * (rp[0] + rp[1]), Math.sin(thAB) * (rp[0] + rp[1]), 0.06)
    gears[2].position.set(gears[1].position.x + Math.cos(thBC) * (rp[1] + rp[2]), gears[1].position.y + Math.sin(thBC) * (rp[1] + rp[2]), -0.05)
    const box = new THREE.Box3().setFromObject(group), c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3())
    group.children.forEach(o => o.position.sub(c))

    const resize = () => { const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight); renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix()
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
      glow.position.set(cur.x * 2, -cur.y * 1.5, 2.2); glow.intensity = 4 + boost * 5
      renderer.render(scene, cam) }
    loop()
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener('pointermove', onMove); renderer.dispose(); el.innerHTML = '' }
  }, [])
  return <div ref={host} className="relative h-full w-full overflow-hidden" role="img" aria-label="Engranajes 3D que giran con el ratón y el scroll" />
}
