import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { asset } from './asset'

export default function Logo3D() {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = host.current!
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }) }
    catch { el.innerHTML = `<img src="${asset('logo/dania-logo-3d.png')}" alt="Logo DanIA Studio" style="width:100%;height:100%;object-fit:contain"/>`; return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace; el.appendChild(renderer.domElement)
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
    const key = new THREE.DirectionalLight(0xfff1d6, 2.2); key.position.set(3, 4, 5); scene.add(key)
    const gold = new THREE.PointLight(0xf2c94c, 0, 6); scene.add(gold)
    const pivot = new THREE.Group(); scene.add(pivot)
    const draco = new DRACOLoader().setDecoderPath(asset('draco/'))
    const loader = new GLTFLoader().setDRACOLoader(draco)
    let ready = false
    loader.load(asset('logo/dania-logo-3d.glb'), g => {
      const m = g.scene, box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
      m.position.sub(c); const s = 2.6 / Math.max(size.x, size.y); pivot.scale.setScalar(s); pivot.add(m)
      cam.position.set(0, 0, 6.2); ready = true; el.dataset.loaded = '1'
    }, undefined, e => console.warn('GLB', e))
    const resize = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix() }
    resize(); const ro = new ResizeObserver(resize); ro.observe(el)
    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }
    const move = (cx: number, cy: number) => { const r = el.getBoundingClientRect()
      target.x = ((cx - r.left) / r.width - 0.5) * 2; target.y = ((cy - r.top) / r.height - 0.5) * 2 }
    const onM = (e: PointerEvent) => move(e.clientX, e.clientY)
    window.addEventListener('pointermove', onM)
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, visible = true; const t0 = performance.now()
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(el)
    const loop = () => { raf = requestAnimationFrame(loop); if (!visible) return
      const t = (performance.now() - t0) / 1000
      cur.x += (target.x - cur.x) * 0.06; cur.y += (target.y - cur.y) * 0.06
      pivot.rotation.y = cur.x * 0.55 + (reduced ? 0 : Math.sin(t * 0.6) * 0.06)
      pivot.rotation.x = cur.y * 0.35; pivot.position.y = reduced ? 0 : Math.sin(t * 1.1) * 0.05
      gold.position.set(cur.x * 2.5, -cur.y * 1.8, 2); gold.intensity = ready ? 14 : 0
      renderer.render(scene, cam) }
    loop()
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onM); draco.dispose(); renderer.dispose(); el.innerHTML = '' }
  }, [])
  return <div ref={host} className="h-full w-full" role="img" aria-label="Logo 3D interactivo de DanIA Studio" />
}
