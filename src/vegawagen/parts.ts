// Piezas de coche modeladas por código para la lluvia de piezas de los laterales.
// Cada pieza mide ~1 unidad en su lado mayor y trae la silueta 2D que usa la física.
import * as THREE from 'three'
import { gearGeometry } from './gear'
import { NEON } from './emblem'

const TAU = Math.PI * 2
export type Shape2D = { type: 'circle'; r: number } | { type: 'rect'; w: number; h: number }
export type PartDef = { name: string; build: () => THREE.Object3D; shape: Shape2D; scale: number }

let mats: Record<string, THREE.Material> | null = null
const M = () => mats ??= {
  steel: new THREE.MeshStandardMaterial({ color: 0xa4aab2, metalness: 1, roughness: 0.32 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xeef0f3, metalness: 1, roughness: 0.1 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x30353c, metalness: 0.85, roughness: 0.45 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x151618, metalness: 0, roughness: 0.88 }),
  ceramic: new THREE.MeshStandardMaterial({ color: 0xf1f1ec, metalness: 0, roughness: 0.28 }),
  copper: new THREE.MeshStandardMaterial({ color: 0xc27a45, metalness: 1, roughness: 0.3 }),
  cyan: new THREE.MeshStandardMaterial({ color: 0x0e3a40, metalness: 0.7, roughness: 0.3, emissive: NEON, emissiveIntensity: 0.35 }),
}
const g = (...o: THREE.Object3D[]) => { const r = new THREE.Group(); o.forEach(x => r.add(x)); return r }
const mesh = (geo: THREE.BufferGeometry, m: string) => new THREE.Mesh(geo, M()[m])
const cylX = (r: number, l: number, seg = 24) => new THREE.CylinderGeometry(r, r, l, seg).rotateZ(Math.PI / 2)
const ringShape = (ro: number, ri: number, sides = 64) => {
  const s = new THREE.Shape(); if (sides === 6) { for (let k = 0; k < 6; k++) { const a = k * TAU / 6 + TAU / 12; k ? s.lineTo(Math.cos(a) * ro, Math.sin(a) * ro) : s.moveTo(Math.cos(a) * ro, Math.sin(a) * ro) } s.closePath() } else s.absarc(0, 0, ro, 0, TAU, false)
  const h = new THREE.Path(); h.absarc(0, 0, ri, 0, TAU, true); s.holes.push(h); return s
}
const ext = (s: THREE.Shape, d: number, bevel = 0.02) => new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.7, bevelSegments: 2, curveSegments: 32 }).translate(0, 0, -d / 2)
class Helix extends THREE.Curve<THREE.Vector3> {
  constructor(private r: number, private len: number, private turns: number) { super() }
  getPoint(t: number, o = new THREE.Vector3()) { const a = t * this.turns * TAU; return o.set(t * this.len - this.len / 2, this.r * Math.cos(a), this.r * Math.sin(a)) }
}

export const PARTS: PartDef[] = [
  { name: 'tuerca', scale: 0.62, shape: { type: 'circle', r: 0.47 }, build: () => mesh(ext(ringShape(0.5, 0.24, 6), 0.34, 0.04), 'chrome') },
  { name: 'arandela', scale: 0.55, shape: { type: 'circle', r: 0.5 }, build: () => mesh(ext(ringShape(0.5, 0.22), 0.08, 0.02), 'steel') },
  { name: 'engranaje', scale: 0.95, shape: { type: 'circle', r: 0.48 }, build: () => mesh(gearGeometry(14, 0.22, 0.0625, false), 'dark') },
  { name: 'disco de freno', scale: 1.15, shape: { type: 'circle', r: 0.5 }, build: () => {
    const s = ringShape(0.5, 0.2)
    for (let k = 0; k < 12; k++) { const a = k * TAU / 12, h = new THREE.Path(); h.absarc(Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0.035, 0, TAU, true); s.holes.push(h) }
    const hat = mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.16, 32).rotateX(Math.PI / 2), 'dark'); hat.position.z = 0.08
    return g(mesh(ext(s, 0.07, 0.01), 'steel'), hat) } },
  { name: 'rueda', scale: 1.2, shape: { type: 'circle', r: 0.5 }, build: () => {
    const tire = mesh(new THREE.TorusGeometry(0.36, 0.14, 16, 48), 'rubber')
    const rim = mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.16, 32).rotateX(Math.PI / 2), 'chrome')
    const hub = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16).rotateX(Math.PI / 2), 'cyan')
    return g(tire, rim, hub) } },
  { name: 'tornillo', scale: 0.85, shape: { type: 'rect', w: 1, h: 0.3 }, build: () => {
    const head = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.14, 6).rotateZ(Math.PI / 2), 'chrome'); head.position.x = -0.43
    const shank = mesh(cylX(0.075, 0.78), 'steel'); shank.position.x = 0.07
    const threads = Array.from({ length: 9 }, (_, i) => { const t = mesh(new THREE.TorusGeometry(0.075, 0.012, 6, 16).rotateY(Math.PI / 2), 'steel'); t.position.x = 0.1 + i * 0.038; return t })
    return g(head, shank, ...threads) } },
  { name: 'muelle', scale: 1, shape: { type: 'rect', w: 1, h: 0.42 }, build: () => mesh(new THREE.TubeGeometry(new Helix(0.17, 0.92, 6), 200, 0.035, 8), 'cyan') },
  { name: 'pistón', scale: 1, shape: { type: 'rect', w: 0.58, h: 1 }, build: () => {
    const head = mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.42, 32), 'steel'); head.position.y = 0.27
    const rings = [0.4, 0.33, 0.26].map(y => { const r = mesh(new THREE.TorusGeometry(0.283, 0.012, 6, 32).rotateX(Math.PI / 2), 'dark'); r.position.y = y; return r })
    const rod = mesh(new THREE.BoxGeometry(0.12, 0.6, 0.1), 'dark'); rod.position.y = -0.2
    const eye = mesh(new THREE.TorusGeometry(0.1, 0.04, 8, 24), 'dark'); eye.position.y = -0.47
    return g(head, ...rings, rod, eye) } },
  { name: 'bujía', scale: 0.9, shape: { type: 'rect', w: 1, h: 0.24 }, build: () => {
    const pts = [[0, -0.36], [0.1, -0.36], [0.11, -0.2], [0.09, -0.15], [0.11, -0.1], [0.09, -0.05], [0.11, 0], [0.09, 0.05], [0.1, 0.12], [0, 0.12]].map(([r, y]) => new THREE.Vector2(r, y))
    const ins = mesh(new THREE.LatheGeometry(pts, 24).rotateZ(Math.PI / 2), 'ceramic')
    const hex = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 6).rotateZ(Math.PI / 2), 'chrome'); hex.position.x = -0.18
    const thread = mesh(cylX(0.075, 0.22), 'steel'); thread.position.x = -0.35
    const tip = mesh(cylX(0.02, 0.08), 'copper'); tip.position.x = -0.49
    const cap = mesh(cylX(0.045, 0.1), 'steel'); cap.position.x = 0.41
    return g(ins, hex, thread, tip, cap) } },
  { name: 'llave', scale: 1.15, shape: { type: 'rect', w: 1, h: 0.2 }, build: () => {
    const s = new THREE.Shape(); s.moveTo(-0.34, -0.05); s.lineTo(0.32, -0.05); s.lineTo(0.32, 0.05); s.lineTo(-0.34, 0.05); s.closePath()
    // llave de estrella: anillo en cada extremo
    const jaw = (x: number) => { const m = mesh(ext(ringShape(0.12, 0.062), 0.05, 0.012), 'chrome'); m.position.x = x; return m }
    return g(mesh(ext(s, 0.05, 0.012), 'chrome'), jaw(-0.39), jaw(0.39)) } },
  { name: 'válvula', scale: 0.95, shape: { type: 'rect', w: 1, h: 0.36 }, build: () => {
    const stem = mesh(cylX(0.035, 0.82), 'steel'); stem.position.x = 0.07
    const head = mesh(new THREE.CylinderGeometry(0.06, 0.18, 0.1, 32).rotateZ(-Math.PI / 2), 'dark'); head.position.x = -0.38
    return g(stem, head) } },
  { name: 'amortiguador', scale: 1.1, shape: { type: 'rect', w: 1, h: 0.24 }, build: () => {
    const body = mesh(cylX(0.1, 0.55), 'dark'); body.position.x = -0.18
    const rod = mesh(cylX(0.035, 0.4), 'chrome'); rod.position.x = 0.28
    const e1 = mesh(new THREE.TorusGeometry(0.07, 0.025, 8, 20), 'steel'); e1.position.x = -0.5
    const e2 = e1.clone(); e2.position.x = 0.5
    return g(body, rod, e1, e2) } },
]
