// Emblema cromado en despiece (referencia de imagen del cliente): aro partido en 6 arcos, V, W,
// fondo negro, carcasa trasera, soportes, muelles y tornillos, con líneas de despiece discontinuas.
// Eje del emblema = Z (frente hacia +Z). Radio exterior = 1.
import * as THREE from 'three'

const TAU = Math.PI * 2
const V2 = THREE.Vector2

export type BadgePiece = {
  obj: THREE.Object3D
  home: THREE.Vector3; homeQ: THREE.Quaternion
  from: THREE.Vector3; fromQ: THREE.Quaternion
  t0: number; t1: number; phase: number
  kind: 'ring' | 'letter' | 'field' | 'housing' | 'bracket' | 'screw' | 'spring'
  screwAxis?: THREE.Vector3
}

// ── recorte de polígono contra un polígono convexo (Sutherland–Hodgman)
function clip(poly: THREE.Vector2[], clipPoly: THREE.Vector2[]) {
  let out = poly
  for (let i = 0; i < clipPoly.length; i++) {
    const a = clipPoly[i], b = clipPoly[(i + 1) % clipPoly.length], inp = out; out = []
    const inside = (p: THREE.Vector2) => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) >= 0
    const cut = (p: THREE.Vector2, q: THREE.Vector2) => {
      const d1 = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x), d2 = (b.x - a.x) * (q.y - a.y) - (b.y - a.y) * (q.x - a.x)
      return p.clone().lerp(q, d1 / (d1 - d2))
    }
    for (let j = 0; j < inp.length; j++) {
      const p = inp[j], q = inp[(j + 1) % inp.length]
      if (inside(q)) { if (!inside(p)) out.push(cut(p, q)); out.push(q) } else if (inside(p)) out.push(cut(p, q))
    }
  }
  return out
}
const circlePoly = (r: number, n = 96) => Array.from({ length: n }, (_, i) => new V2(Math.cos(i / n * TAU) * r, Math.sin(i / n * TAU) * r))
const cross = (a: THREE.Vector2, b: THREE.Vector2) => a.x * b.y - a.y * b.x
const meet = (p: THREE.Vector2, d: THREE.Vector2, q: THREE.Vector2, e: THREE.Vector2) => p.clone().addScaledVector(d, cross(q.clone().sub(p), e) / cross(d, e))

// contorno de un trazo grueso con ingletes en las esquinas; los extremos se alargan para recortarlos luego con el aro
function strokeOutline(pts: THREE.Vector2[], h: number) {
  const segs = pts.slice(0, -1).map((p, i) => { const d = pts[i + 1].clone().sub(p).normalize(); return { p, d, n: new V2(-d.y, d.x) } })
  const side = (s: number) => pts.map((P, i) => {
    if (i === 0) return P.clone().addScaledVector(segs[0].d, -0.3).addScaledVector(segs[0].n, s * h)
    if (i === pts.length - 1) { const g = segs[i - 1]; return P.clone().addScaledVector(g.d, 0.3).addScaledVector(g.n, s * h) }
    const a = segs[i - 1], b = segs[i]
    return meet(a.p.clone().addScaledVector(a.n, s * h), a.d, b.p.clone().addScaledVector(b.n, s * h), b.d)
  })
  return [...side(1), ...side(-1).reverse()]
}

function extrude(pts: THREE.Vector2[], depth: number, bevel: number, mat: THREE.Material, curveSegments = 12) {
  const c = pts.reduce((a, p) => a.add(p), new V2()).divideScalar(pts.length)
  const shape = new THREE.Shape(pts.map(p => p.clone().sub(c)))
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 4, curveSegments })
  geo.translate(0, 0, -depth / 2)
  const m = new THREE.Mesh(geo, mat); m.position.set(c.x, c.y, 0); return m
}
function sector(r0: number, r1: number, a0: number, a1: number, n = 28) {
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push(new V2(Math.cos(a) * r1, Math.sin(a) * r1)) }
  for (let i = n; i >= 0; i--) { const a = a0 + (a1 - a0) * i / n; pts.push(new V2(Math.cos(a) * r0, Math.sin(a) * r0)) }
  return pts
}
class Helix extends THREE.Curve<THREE.Vector3> {
  constructor(private r: number, private len: number, private turns: number) { super() }
  getPoint(t: number, o = new THREE.Vector3()) { const a = t * this.turns * TAU; return o.set(this.r * Math.cos(a), this.r * Math.sin(a), t * this.len - this.len / 2) }
}

// Trazado de las letras (radio 1). Ajustado a la proporción clásica: la V arriba, la W abajo, unidas en el centro.
const LETTER_H = 0.078
const V_LINE = [new V2(Math.cos(1.98) * 0.98, Math.sin(1.98) * 0.98), new V2(0, -0.04), new V2(Math.cos(1.16) * 0.98, Math.sin(1.16) * 0.98)]
const W_LINE = [new V2(Math.cos(2.84) * 0.98, Math.sin(2.84) * 0.98), new V2(Math.cos(4.3) * 0.86, Math.sin(4.3) * 0.86), new V2(0, -0.12),
  new V2(Math.cos(5.124) * 0.86, Math.sin(5.124) * 0.86), new V2(Math.cos(0.302) * 0.98, Math.sin(0.302) * 0.98)]

export function buildBadge() {
  const mat = {
    chrome: new THREE.MeshPhysicalMaterial({ color: 0xeef1f5, metalness: 1, roughness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.06 }),
    field: new THREE.MeshPhysicalMaterial({ color: 0x0d0f12, metalness: 0.2, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 }),
    plastic: new THREE.MeshStandardMaterial({ color: 0x17191c, metalness: 0.05, roughness: 0.62 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xa9afb7, metalness: 1, roughness: 0.3 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xc8a25a, metalness: 1, roughness: 0.28 }),
    line: new THREE.LineDashedMaterial({ color: 0xdfe6ee, dashSize: 0.05, gapSize: 0.04, transparent: true, opacity: 0.45, depthWrite: false }),
  }
  const group = new THREE.Group(), pieces: BadgePiece[] = []
  let seed = 3
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  const add = (obj: THREE.Object3D, kind: BadgePiece['kind'], offset: THREE.Vector3, t0: number, dur = 0.12, rot?: THREE.Euler, screwAxis?: THREE.Vector3) => {
    group.add(obj)
    const home = obj.position.clone(), homeQ = obj.quaternion.clone(), from = home.clone().add(offset)
    const fromQ = rot ? new THREE.Quaternion().setFromEuler(rot).multiply(homeQ) : homeQ.clone()
    pieces.push({ obj, home, homeQ, from, fromQ, t0, t1: t0 + dur, phase: rnd() * TAU, kind, screwAxis })
  }

  // 1 · carcasa trasera de plástico negro con nervios, postes y pestañas
  const housing = new THREE.Group()
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.97, 0.95, 0.16, 96).rotateX(Math.PI / 2), mat.plastic); housing.add(shell)
  const rib = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.025, 8, 80), mat.plastic); rib.position.z = 0.09; housing.add(rib)
  for (let k = 0; k < 8; k++) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.05), mat.plastic), a = k * TAU / 8; r.position.set(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0.1); r.rotation.z = a; housing.add(r) }
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + k * TAU / 4, boss = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 24).rotateX(Math.PI / 2), mat.plastic)
    boss.position.set(Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0.1); housing.add(boss)
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 16).rotateX(Math.PI / 2), mat.metal); hole.position.copy(boss.position); hole.position.z += 0.005; housing.add(hole)
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 32).rotateX(Math.PI / 2), mat.plastic); hub.position.z = 0.1; housing.add(hub)
  for (const s of [-1, 1]) { const tab = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.22), mat.plastic); tab.position.set(s * 0.98, 0, -0.04); housing.add(tab) }
  housing.position.z = -0.17
  add(housing, 'housing', new THREE.Vector3(1.55, 0.05, -1.4), 0.08, 0.14, new THREE.Euler(0, -0.7, 0))

  // 2 · muelles entre carcasa y fondo
  for (let k = 0; k < 4; k++) {
    const a = k * TAU / 4, s = new THREE.Mesh(new THREE.TubeGeometry(new Helix(0.045, 0.16, 5), 80, 0.008, 6), mat.metal)
    s.position.set(Math.cos(a) * 0.5, Math.sin(a) * 0.5, -0.1)
    add(s, 'spring', new THREE.Vector3(Math.cos(a) * 0.7 + 0.9, Math.sin(a) * 0.7, -0.9), 0.17 + k * 0.015, 0.1, new THREE.Euler(rnd() * 2, rnd() * 2, 0))
  }
  // 3 · soportes en U (arriba, abajo, izquierda, derecha)
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 2 + k * TAU / 4, u = new THREE.Shape()
    u.moveTo(-0.12, -0.05); u.lineTo(0.12, -0.05); u.lineTo(0.12, 0.08); u.lineTo(0.07, 0.08); u.lineTo(0.07, 0); u.lineTo(-0.07, 0); u.lineTo(-0.07, 0.08); u.lineTo(-0.12, 0.08); u.closePath()
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(u, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 2 }).translate(0, 0, -0.025), mat.metal)
    m.position.set(Math.cos(a) * 0.72, Math.sin(a) * 0.72, -0.02); m.rotation.z = a - Math.PI / 2
    add(m, 'bracket', new THREE.Vector3(Math.cos(a) * 0.75, Math.sin(a) * 0.75, 0.35), 0.24 + k * 0.02, 0.11, new THREE.Euler(0.6, 0, 0))
  }
  // 4 · fondo negro brillante
  const field = new THREE.Mesh(new THREE.CylinderGeometry(0.87, 0.87, 0.04, 96).rotateX(Math.PI / 2), mat.field); field.position.z = 0.02
  add(field, 'field', new THREE.Vector3(0.75, 0, -0.55), 0.32, 0.12, new THREE.Euler(0, -0.4, 0))

  // 5 · letras V y W cromadas, recortadas por el círculo para que encajen bajo el aro
  const disc = circlePoly(0.95)
  const W = extrude(clip(strokeOutline(W_LINE, LETTER_H), disc), 0.12, 0.03, mat.chrome); W.position.z += 0.11
  add(W, 'letter', new THREE.Vector3(-0.25, -0.35, 1.0), 0.4, 0.14, new THREE.Euler(0.2, 0.35, 0))
  const V = extrude(clip(strokeOutline(V_LINE, LETTER_H), disc), 0.12, 0.03, mat.chrome); V.position.z += 0.11
  add(V, 'letter', new THREE.Vector3(-0.15, 0.7, 1.15), 0.47, 0.14, new THREE.Euler(-0.25, 0.3, 0))

  // 6 · aro cromado partido en 6 arcos
  for (let k = 0; k < 6; k++) {
    const a0 = k * TAU / 6 + Math.PI / 6 + 0.012, a1 = (k + 1) * TAU / 6 + Math.PI / 6 - 0.012, am = (a0 + a1) / 2
    const arc = extrude(sector(0.85, 1, a0, a1), 0.2, 0.045, mat.chrome, 24); arc.position.z += 0.05
    add(arc, 'ring', new THREE.Vector3(Math.cos(am) * 0.62, Math.sin(am) * 0.62, (k % 2 ? 0.25 : -0.15)), 0.52 + k * 0.022, 0.13, new THREE.Euler(0, 0, (rnd() - 0.5) * 0.3))
  }
  // 7 · tornillos radiales entre arcos (latón y acero), se enroscan al entrar
  for (let k = 0; k < 6; k++) {
    const a = k * TAU / 6 + Math.PI / 6, s = new THREE.Group()
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16), k % 2 ? mat.brass : mat.metal); head.position.y = 0.11
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 10), mat.metal)
    s.add(head, shank); s.position.set(Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0.0); s.rotation.z = a - Math.PI / 2
    add(s, 'screw', new THREE.Vector3(Math.cos(a) * 1.05, Math.sin(a) * 1.05, 0), 0.67 + k * 0.012, 0.09, undefined, new THREE.Vector3(Math.cos(a), Math.sin(a), 0))
  }

  return { group, pieces, materials: mat }
}

// Fondo de estudio gris azulado, como la imagen de referencia
export function studioBackdrop() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 512
  const g = c.getContext('2d')!, l = g.createLinearGradient(0, 0, 0, 512)
  l.addColorStop(0, '#141a21'); l.addColorStop(0.35, '#2b3540'); l.addColorStop(0.58, '#4a5764'); l.addColorStop(0.62, '#3b4652'); l.addColorStop(1, '#1b2128')
  g.fillStyle = l; g.fillRect(0, 0, 64, 512)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}
// Suelo con cuadrícula fina y cotas discontinuas
export function floorTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 1024
  const g = c.getContext('2d')!
  const r = g.createRadialGradient(512, 512, 60, 512, 512, 512); r.addColorStop(0, 'rgba(120,135,150,0.55)'); r.addColorStop(1, 'rgba(30,36,44,0)')
  g.fillStyle = r; g.fillRect(0, 0, 1024, 1024)
  g.strokeStyle = 'rgba(210,220,230,0.16)'; g.lineWidth = 1.5
  for (let i = 0; i <= 1024; i += 128) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 1024); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(1024, i); g.stroke() }
  g.setLineDash([10, 10]); g.strokeStyle = 'rgba(220,230,240,0.22)'
  g.beginPath(); g.moveTo(0, 512); g.lineTo(1024, 512); g.stroke(); g.beginPath(); g.moveTo(512, 0); g.lineTo(512, 1024); g.stroke()
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}
export function shadowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const g = c.getContext('2d')!, r = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  r.addColorStop(0, 'rgba(0,0,0,0.7)'); r.addColorStop(0.5, 'rgba(0,0,0,0.3)'); r.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = r; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c)
}
