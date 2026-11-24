// Piezas del maletín organizador (referencia de imagen del cliente) modeladas por código.
// Cada pieza mide ~1 unidad en su lado mayor. `rel` = tamaño real respecto al ancho del maletín;
// `rest` = cómo queda colocada dentro del compartimento; `foot`/`h` = huella y altura en reposo (× rel).
import * as THREE from 'three'
import { gearGeometry } from './gear'

const TAU = Math.PI * 2
export type PartType = { key: string; name: string; rel: number; rest: THREE.Euler; foot: [number, number]; h: number; build: () => THREE.Object3D }

let mats: Record<string, THREE.Material> | null = null
export const M = () => mats ??= {
  steel: new THREE.MeshStandardMaterial({ color: 0xb3b8bf, metalness: 1, roughness: 0.3 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xeef0f3, metalness: 1, roughness: 0.12 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x3a3f46, metalness: 0.85, roughness: 0.42 }),
  ceramic: new THREE.MeshStandardMaterial({ color: 0xf1f1ec, metalness: 0, roughness: 0.28 }),
  copper: new THREE.MeshStandardMaterial({ color: 0xc8794a, metalness: 1, roughness: 0.3 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xc9a55c, metalness: 1, roughness: 0.26 }),
}
const g = (...o: THREE.Object3D[]) => { const r = new THREE.Group(); o.forEach(x => r.add(x)); return r }
const mesh = (geo: THREE.BufferGeometry, m: string) => { const x = new THREE.Mesh(geo, M()[m]); x.castShadow = x.receiveShadow = true; return x }
const cylX = (r: number, l: number, seg = 20) => new THREE.CylinderGeometry(r, r, l, seg).rotateZ(Math.PI / 2)
const ring = (ro: number, ri: number, hex = false) => {
  const s = new THREE.Shape()
  if (hex) { for (let k = 0; k < 6; k++) { const a = k * TAU / 6 + TAU / 12; k ? s.lineTo(Math.cos(a) * ro, Math.sin(a) * ro) : s.moveTo(Math.cos(a) * ro, Math.sin(a) * ro) } s.closePath() }
  else s.absarc(0, 0, ro, 0, TAU, false)
  const h = new THREE.Path(); h.absarc(0, 0, ri, 0, TAU, true); s.holes.push(h); return s
}
const ext = (s: THREE.Shape, d: number, bevel = 0.02, seg = 28) => new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.7, bevelSegments: 2, curveSegments: seg }).translate(0, 0, -d / 2)
class Helix extends THREE.Curve<THREE.Vector3> {
  constructor(private r: number, private len: number, private turns: number) { super() }
  getPoint(t: number, o = new THREE.Vector3()) { const a = t * this.turns * TAU; return o.set(t * this.len - this.len / 2, this.r * Math.cos(a), this.r * Math.sin(a)) }
}
const FLAT = new THREE.Euler(-Math.PI / 2, 0, 0)   // piezas redondas: tumbadas, eje hacia arriba
const LYING = new THREE.Euler(0, 0, 0)            // piezas alargadas: tumbadas a lo largo
const STAND = new THREE.Euler(0, 0, Math.PI / 2)  // muelles: de pie

export const TYPES: PartType[] = [
  { key: 'tornillo', name: 'Tornillos', rel: 0.085, rest: LYING, foot: [1, 0.32], h: 0.32, build: () => {
    const head = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.14, 6).rotateZ(Math.PI / 2), 'chrome'); head.position.x = -0.43
    const shank = mesh(cylX(0.075, 0.8), 'steel'); shank.position.x = 0.07
    const threads = [0.15, 0.25, 0.35].map(x => { const t = mesh(new THREE.TorusGeometry(0.077, 0.012, 5, 14).rotateY(Math.PI / 2), 'steel'); t.position.x = x; return t })
    return g(head, shank, ...threads) } },
  { key: 'tuerca', name: 'Tuercas', rel: 0.045, rest: FLAT, foot: [1, 1], h: 0.36, build: () => mesh(ext(ring(0.5, 0.25, true), 0.34, 0.04, 16), 'chrome') },
  { key: 'arandela', name: 'Arandelas', rel: 0.042, rest: FLAT, foot: [1, 1], h: 0.1, build: () => mesh(ext(ring(0.5, 0.22), 0.08, 0.015), 'steel') },
  { key: 'cobre', name: 'Arandelas de cobre', rel: 0.042, rest: FLAT, foot: [1, 1], h: 0.12, build: () => mesh(ext(ring(0.5, 0.28), 0.1, 0.02), 'copper') },
  { key: 'rodamiento', name: 'Rodamientos', rel: 0.07, rest: FLAT, foot: [1, 1], h: 0.3, build: () => {
    const outer = mesh(ext(ring(0.5, 0.4), 0.28, 0.02, 40), 'chrome'), inner = mesh(ext(ring(0.24, 0.13), 0.28, 0.02), 'chrome')
    const balls = Array.from({ length: 9 }, (_, i) => { const b = mesh(new THREE.SphereGeometry(0.085, 14, 10), 'steel'), a = i * TAU / 9; b.position.set(Math.cos(a) * 0.32, Math.sin(a) * 0.32, 0); return b })
    const cage = mesh(ext(ring(0.37, 0.27), 0.1, 0.01, 40), 'brass')
    return g(outer, inner, cage, ...balls) } },
  { key: 'agujas', name: 'Rodamientos de agujas', rel: 0.05, rest: FLAT, foot: [1, 1], h: 0.7, build: () => {
    const shell = mesh(ext(ring(0.5, 0.42), 0.7, 0.02, 32), 'steel')
    const rollers = Array.from({ length: 14 }, (_, i) => { const r = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.62, 8).rotateX(Math.PI / 2), 'dark'), a = i * TAU / 14; r.position.set(Math.cos(a) * 0.37, Math.sin(a) * 0.37, 0); return r })
    return g(shell, ...rollers) } },
  { key: 'muelle', name: 'Muelles', rel: 0.06, rest: STAND, foot: [0.45, 0.45], h: 1, build: () => mesh(new THREE.TubeGeometry(new Helix(0.19, 0.95, 7), 160, 0.035, 7), 'steel') },
  { key: 'pinon', name: 'Piñones', rel: 0.085, rest: FLAT, foot: [1, 1], h: 0.24, build: () => {
    const gear = mesh(gearGeometry(18, 0.2, 2 * 0.45 / 18, false), 'dark')
    const hub = mesh(ext(ring(0.16, 0.08, true), 0.32, 0.02), 'steel')
    return g(gear, hub) } },
  { key: 'casquillo', name: 'Casquillos de latón', rel: 0.04, rest: FLAT, foot: [1, 1], h: 0.8, build: () => {
    const pts = [[0.2, -0.4], [0.32, -0.4], [0.32, 0.28], [0.5, 0.28], [0.5, 0.4], [0.2, 0.4]].map(([r, y]) => new THREE.Vector2(r, y))
    pts.push(pts[0].clone())
    return mesh(new THREE.LatheGeometry(pts, 28).rotateX(Math.PI / 2), 'brass') } },
  { key: 'bujia', name: 'Bujías', rel: 0.075, rest: LYING, foot: [1, 0.26], h: 0.26, build: () => {
    const pts = [[0, -0.36], [0.1, -0.36], [0.11, -0.2], [0.09, -0.15], [0.11, -0.1], [0.09, -0.05], [0.11, 0], [0.09, 0.05], [0.1, 0.12], [0, 0.12]].map(([r, y]) => new THREE.Vector2(r, y))
    const ins = mesh(new THREE.LatheGeometry(pts, 20).rotateZ(Math.PI / 2), 'ceramic')
    const hex = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 6).rotateZ(Math.PI / 2), 'chrome'); hex.position.x = -0.18
    const thread = mesh(cylX(0.075, 0.22), 'steel'); thread.position.x = -0.35
    const tip = mesh(cylX(0.02, 0.08), 'copper'); tip.position.x = -0.49
    const cap = mesh(cylX(0.045, 0.1), 'steel'); cap.position.x = 0.41
    return g(ins, hex, thread, tip, cap) } },
  { key: 'bulon', name: 'Bulones', rel: 0.06, rest: LYING, foot: [1, 0.42], h: 0.42, build: () => {
    const pts = [[0.12, -0.5], [0.2, -0.5], [0.2, 0.5], [0.12, 0.5], [0.12, -0.5]].map(([r, y]) => new THREE.Vector2(r, y))
    return mesh(new THREE.LatheGeometry(pts, 28).rotateZ(Math.PI / 2), 'chrome') } },
  { key: 'anillo', name: 'Anillos elásticos', rel: 0.065, rest: FLAT, foot: [1, 1], h: 0.06, build: () => {
    const arc = mesh(new THREE.TorusGeometry(0.42, 0.035, 8, 60, TAU * 0.88).rotateZ(TAU * 0.06 + Math.PI / 2), 'dark')
    const eyes = [-1, 1].map(s => { const e = mesh(ext(ring(0.08, 0.035), 0.06, 0.01, 12), 'dark'), a = Math.PI / 2 + s * TAU * 0.06; e.position.set(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0); return e })
    return g(arc, ...eyes) } },
]
export const TYPE = Object.fromEntries(TYPES.map(t => [t.key, t])) as Record<string, PartType>
