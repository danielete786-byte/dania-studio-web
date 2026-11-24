// Emblema de Vegawagen (una "W" dentro de un hexágono) modelado por código en 43 piezas:
// engranaje, 12 placas de carbono, 6 tramos de marco cromado, 8 tramos de la W,
// 10 tubos de neón y 6 tornillos. Cada pieza sabe de dónde viene y cuándo se monta.
import * as THREE from 'three'
import { gearGeometry } from './gear'

export const NEON = 0x22e1ee
const TAU = Math.PI * 2
const V2 = THREE.Vector2

export type Piece = {
  obj: THREE.Object3D
  home: THREE.Vector3; homeQ: THREE.Quaternion
  from: THREE.Vector3; fromQ: THREE.Quaternion
  axis: THREE.Vector3; phase: number
  t0: number; t1: number
  kind: 'gear' | 'plate' | 'bezel' | 'w' | 'neon' | 'bolt'
}

// ── texturas procedurales
function carbonTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')!, n = 8, s = c.width / n
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const tw = ((x + y) >> 1) % 2 === 0 // sarga 2x2
    const grd = tw ? g.createLinearGradient(x * s, 0, x * s + s, 0) : g.createLinearGradient(0, y * s, 0, y * s + s)
    grd.addColorStop(0, '#3a3a3a'); grd.addColorStop(0.5, '#bdbdbd'); grd.addColorStop(1, '#3a3a3a')
    g.fillStyle = grd; g.fillRect(x * s, y * s, s, s)
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 5); t.anisotropy = 8
  return t
}
export function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const g = c.getContext('2d')!, r = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  r.addColorStop(0, 'rgba(34,225,238,0.55)'); r.addColorStop(0.35, 'rgba(34,225,238,0.16)'); r.addColorStop(1, 'rgba(34,225,238,0)')
  g.fillStyle = r; g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

// ── utilidades geométricas
const hexPt = (R: number, k: number) => new V2(R * Math.cos(k * TAU / 6), R * Math.sin(k * TAU / 6))
const centroid = (pts: THREE.Vector2[]) => pts.reduce((a, p) => a.add(p), new V2()).divideScalar(pts.length)
// encoge el polígono hacia su centro para dejar una junta visible entre piezas
const inset = (pts: THREE.Vector2[], gap: number) => {
  const c = centroid(pts), r = pts.reduce((m, p) => m + p.distanceTo(c), 0) / pts.length
  return pts.map(p => p.clone().sub(c).multiplyScalar(1 - gap / r).add(c))
}
const cross = (a: THREE.Vector2, b: THREE.Vector2) => a.x * b.y - a.y * b.x
const intersect = (p: THREE.Vector2, d: THREE.Vector2, q: THREE.Vector2, e: THREE.Vector2) => p.clone().addScaledVector(d, cross(q.clone().sub(p), e) / cross(d, e))

// pieza plana extruida, centrada en su centroide (para que gire sobre sí misma al volar)
function slab(pts: THREE.Vector2[], depth: number, z: number, mat: THREE.Material, bevel = 0.02) {
  const c = centroid(pts), shape = new THREE.Shape(pts.map(p => p.clone().sub(c)))
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.75, bevelSegments: 3, curveSegments: 8 })
  geo.translate(0, 0, -depth / 2)
  // UV del frontal en coordenadas del emblema, para que la trama de carbono continúe entre placas
  const uv = geo.attributes.uv as THREE.BufferAttribute, pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + c.x) * 0.5, (pos.getY(i) + c.y) * 0.5)
  const m = new THREE.Mesh(geo, mat); m.position.set(c.x, c.y, z + depth / 2)
  return m
}
function tube(a: THREE.Vector2, b: THREE.Vector2, r: number, z: number, mat: THREE.Material) {
  const d = b.clone().sub(a), len = d.length()
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.01, len - 2 * r), 6, 16), mat)
  m.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, z)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(d.x, d.y, 0).normalize())
  return m
}

// trazado de la W y sus tramos con ingletes en las uniones
export const W_POINTS = [new V2(-0.92, 0.55), new V2(-0.47, -0.59), new V2(0, 0.24), new V2(0.47, -0.59), new V2(0.92, 0.55)]
function wArms(h: number) {
  const P = W_POINTS, seg = P.slice(0, -1).map((p, i) => { const d = P[i + 1].clone().sub(p).normalize(); return { p, d, n: new V2(-d.y, d.x) } })
  const line = (i: number, s: number) => ({ q: seg[i].p.clone().addScaledVector(seg[i].n, s * h), d: seg[i].d })
  const ends = (i: number, s: number) => {
    const L = line(i, s), horiz = new V2(1, 0)
    const start = i === 0 ? intersect(L.q, L.d, P[0], horiz) : (() => { const M = line(i - 1, s); return intersect(M.q, M.d, L.q, L.d) })()
    const end = i === seg.length - 1 ? intersect(L.q, L.d, P[P.length - 1], horiz) : (() => { const M = line(i + 1, s); return intersect(L.q, L.d, M.q, M.d) })()
    return [start, end]
  }
  return seg.map((s, i) => { const [sp, ep] = ends(i, 1), [sm, em] = ends(i, -1); return { sp, ep, sm, em, d: s.d, n: s.n, a: P[i], b: P[i + 1] } })
}

export function buildEmblem() {
  const carbon = carbonTexture()
  const mat = {
    carbon: new THREE.MeshPhysicalMaterial({ color: 0x1b1e23, metalness: 0.55, roughness: 0.38, roughnessMap: carbon, bumpMap: carbon, bumpScale: 1.2, clearcoat: 1, clearcoatRoughness: 0.12 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xf2f4f7, metalness: 1, roughness: 0.07 }),
    satin: new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: 1, roughness: 0.22 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x2b3038, metalness: 0.9, roughness: 0.42 }),
    neon: new THREE.MeshStandardMaterial({ color: 0x0d2b30, emissive: NEON, emissiveIntensity: 0, roughness: 0.25, metalness: 0 }),
  }
  const group = new THREE.Group()
  const pieces: Piece[] = []
  let seed = 7
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  const add = (obj: THREE.Object3D, kind: Piece['kind'], t0: number, dur = 0.13, spread = 1) => {
    group.add(obj)
    const home = obj.position.clone(), homeQ = obj.quaternion.clone()
    const dir = new THREE.Vector3(home.x, home.y, 0)
    if (dir.lengthSq() < 0.04) dir.set(rnd() - 0.5, rnd() - 0.5, 0)
    dir.normalize().applyAxisAngle(new THREE.Vector3(0, 0, 1), (rnd() - 0.5) * 1.2)
    const dist = (2.4 + rnd() * 2.6) * spread
    const from = kind === 'bolt'
      ? home.clone().add(new THREE.Vector3((rnd() - 0.5) * 0.6, (rnd() - 0.5) * 0.6, 3 + rnd() * 2))
      : home.clone().addScaledVector(dir, dist).add(new THREE.Vector3(0, 0, (rnd() - 0.4) * 5 * spread))
    const fromQ = kind === 'bolt' ? homeQ.clone()
      : new THREE.Quaternion().setFromEuler(new THREE.Euler((rnd() - 0.5) * TAU, (rnd() - 0.5) * TAU, (rnd() - 0.5) * TAU)).multiply(homeQ)
    pieces.push({ obj, home, homeQ, from, fromQ, axis: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), phase: rnd() * TAU, t0, t1: t0 + dur, kind })
  }

  // 1 · engranaje trasero (asoma por los lados del hexágono)
  const gear = new THREE.Mesh(gearGeometry(36, 0.14, 2 * 1.68 / 36, false), mat.dark)
  gear.position.z = -0.2; add(gear, 'gear', 0.08, 0.16, 0.8)

  // 2 · placa base de carbono: 6 cuñas partidas en 2 = 12 piezas
  for (let k = 0; k < 6; k++) {
    const c0 = hexPt(1.62, k), c1 = hexPt(1.62, k + 1), f = 0.5
    add(slab(inset([new V2(0, 0), c0.clone().multiplyScalar(f), c1.clone().multiplyScalar(f)], 0.012), 0.12, 0, mat.carbon, 0.012), 'plate', 0.12 + k * 0.022)
    add(slab(inset([c0.clone().multiplyScalar(f), c0, c1, c1.clone().multiplyScalar(f)], 0.01), 0.12, 0, mat.carbon, 0.012), 'plate', 0.2 + k * 0.022)
  }
  // 3 · marco cromado: 6 tramos con inglete
  for (let k = 0; k < 6; k++) {
    const pts = [hexPt(1.56, k), hexPt(1.8, k), hexPt(1.8, k + 1), hexPt(1.56, k + 1)]
    add(slab(inset(pts, 0.006), 0.26, -0.04, mat.chrome, 0.035), 'bezel', 0.3 + k * 0.022)
  }
  // 4 · la W: 4 brazos partidos en 2 = 8 piezas cromadas
  const WH = 0.115, arms = wArms(WH)
  arms.forEach((a, i) => {
    const mid = a.a.clone().add(a.b).multiplyScalar(0.5), mp = mid.clone().addScaledVector(a.n, WH), mm = mid.clone().addScaledVector(a.n, -WH)
    add(slab(inset([a.sp, mp, mm, a.sm], 0.006), 0.15, 0.14, mat.chrome, 0.028), 'w', 0.4 + i * 0.03)
    add(slab(inset([mp, a.ep, a.em, mm], 0.006), 0.15, 0.14, mat.chrome, 0.028), 'w', 0.43 + i * 0.03)
  })
  // 5 · neón: 4 tubos sobre la W y 6 alrededor del hexágono
  arms.forEach((a, i) => add(tube(a.a.clone().addScaledVector(a.d, 0.1), a.b.clone().addScaledVector(a.d, -0.1), 0.02, 0.34, mat.neon), 'neon', 0.5 + i * 0.02, 0.12, 0.8))
  for (let k = 0; k < 6; k++) {
    const p0 = hexPt(1.42, k), p1 = hexPt(1.42, k + 1), d = p1.clone().sub(p0).normalize()
    add(tube(p0.clone().addScaledVector(d, 0.1), p1.clone().addScaledVector(d, -0.1), 0.026, 0.165, mat.neon), 'neon', 0.54 + k * 0.015, 0.12, 0.9)
  }
  // 6 · tornillos que entran de frente y se enroscan en las esquinas del marco
  for (let k = 0; k < 6; k++) {
    const b = new THREE.Group(), p = hexPt(1.68, k)
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.05, 6).rotateX(Math.PI / 2), mat.satin); head.position.z = 0.035
    const washer = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.014, 32).rotateX(Math.PI / 2), mat.satin)
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.32, 12).rotateX(Math.PI / 2), mat.dark); shank.position.z = -0.16
    b.add(head, washer, shank); b.position.set(p.x, p.y, 0.262)
    add(b, 'bolt', 0.6 + k * 0.022, 0.1)
  }
  return { group, pieces, gear, materials: mat }
}
