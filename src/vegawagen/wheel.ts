// Rueda + freno + buje + amortiguador modelados por código (sin archivos 3D externos).
// Eje de la rueda = eje X local; el lado exterior de la rueda mira a +X.
import * as THREE from 'three'

export const ACCENT = 0xff6b1a

export type Part = {
  carrier: THREE.Group      // se desplaza en el despiece (no gira)
  spinner: THREE.Group      // gira con la rueda (si spins)
  explode: THREE.Vector3    // desplazamiento cuando el despiece está al 100 %
  spins: boolean
  anchor?: THREE.Object3D   // punto al que apunta la etiqueta
}

const TAU = Math.PI * 2

function treadTexture() {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = '#808080'; g.fillRect(0, 0, c.width, c.height)
  // banda de rodadura (v ≈ 0.38–0.62 del perfil)
  const y0 = 0.36 * c.height, y1 = 0.64 * c.height, h = y1 - y0
  g.fillStyle = '#e6e6e6'; g.fillRect(0, y0, c.width, h)
  g.fillStyle = '#141414'
  for (const f of [0.3, 0.5, 0.7]) g.fillRect(0, y0 + h * f - 4, c.width, 8)
  const n = 72, w = c.width / n
  for (let i = 0; i < n; i++) {
    const x = i * w
    g.beginPath(); g.moveTo(x, y0); g.lineTo(x + 6, y0); g.lineTo(x + w * 0.55 + 6, y0 + h * 0.3); g.lineTo(x + w * 0.55, y0 + h * 0.3); g.fill()
    g.beginPath(); g.moveTo(x + w * 0.5, y1); g.lineTo(x + w * 0.5 + 6, y1); g.lineTo(x + w * 1.05 + 6, y1 - h * 0.3); g.lineTo(x + w * 1.05, y1 - h * 0.3); g.fill()
    g.fillRect(x + w * 0.25, y0 + h * 0.3, 5, h * 0.2); g.fillRect(x + w * 0.75, y0 + h * 0.5, 5, h * 0.2)
  }
  // líneas finas en el flanco
  g.fillStyle = '#6a6a6a'
  for (const v of [0.14, 0.2, 0.8, 0.86]) g.fillRect(0, v * c.height, c.width, 2)
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.anisotropy = 8
  return t
}

// perfil cerrado en sentido antihorario (r, y) para LatheGeometry
function superEllipse(rc: number, a: number, b: number, n: number, steps: number) {
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= steps; i++) {
    const t = Math.PI + (i / steps) * TAU, c = Math.cos(t), s = Math.sin(t)
    pts.push(new THREE.Vector2(rc + a * Math.sign(c) * Math.abs(c) ** (2 / n), b * Math.sign(s) * Math.abs(s) ** (2 / n)))
  }
  return pts
}

const lathe = (pts: THREE.Vector2[], seg = 128) => new THREE.LatheGeometry(pts, seg).rotateZ(-Math.PI / 2) // eje Y → X
const extrudeX = (shape: THREE.Shape, depth: number, bevel = 0.015, curveSegments = 48) =>
  new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 3, curveSegments })
    .translate(0, 0, -depth / 2).rotateY(Math.PI / 2) // extrusión Z → X, centrada
const cylX = (r: number, len: number, seg = 48) => new THREE.CylinderGeometry(r, r, len, seg).rotateZ(Math.PI / 2)
const circlePath = (x: number, y: number, r: number) => { const p = new THREE.Path(); p.absarc(x, y, r, 0, TAU, true); return p }

class Helix extends THREE.Curve<THREE.Vector3> {
  constructor(private r: number, private h: number, private turns: number) { super() }
  getPoint(t: number, o = new THREE.Vector3()) { const a = t * this.turns * TAU; return o.set(this.r * Math.cos(a), this.h * t - this.h / 2, this.r * Math.sin(a)) }
}

export function buildWheel() {
  const mat = {
    rubber: new THREE.MeshStandardMaterial({ color: 0x18191c, roughness: 0.86, metalness: 0, bumpMap: treadTexture(), bumpScale: 3 }),
    face: new THREE.MeshPhysicalMaterial({ color: 0x2c3036, metalness: 1, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.15 }),
    lip: new THREE.MeshStandardMaterial({ color: 0xdfe2e6, metalness: 1, roughness: 0.16 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xf0f0f2, metalness: 1, roughness: 0.1 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xa3a7ad, metalness: 1, roughness: 0.38 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x3b3f46, metalness: 0.85, roughness: 0.45 }),
    paint: new THREE.MeshPhysicalMaterial({ color: ACCENT, metalness: 0.15, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06 }),
  }
  const root = new THREE.Group()
  const parts: Record<string, Part> = {}
  const add = (name: string, explode: [number, number, number], spins: boolean, ...meshes: THREE.Object3D[]) => {
    const carrier = new THREE.Group(), spinner = new THREE.Group()
    carrier.add(spinner); meshes.forEach(m => spinner.add(m)); root.add(carrier)
    return (parts[name] = { carrier, spinner, explode: new THREE.Vector3(...explode), spins })
  }
  const anchor = (p: Part, x: number, y: number, z: number) => { const o = new THREE.Object3D(); o.position.set(x, y, z); p.carrier.add(o); p.anchor = o }

  // ── Neumático
  const tire = new THREE.Mesh(lathe(superEllipse(0.845, 0.175, 0.315, 5, 120), 160), mat.rubber)
  anchor(add('tire', [2.25, 0, 0], true, tire), 0.15, 0.62, 0.72)

  // ── Llanta: barril + cara de 5 radios + tapacubos
  const barrelPts = [[0.615, -0.29], [0.7, -0.29], [0.7, -0.29], [0.705, -0.25], [0.67, -0.225], [0.665, 0.2], [0.665, 0.2], [0.7, 0.24],
    [0.705, 0.29], [0.705, 0.29], [0.615, 0.29], [0.615, 0.29], [0.615, -0.29]].map(([r, y]) => new THREE.Vector2(r, y))
  const barrel = new THREE.Mesh(lathe(barrelPts, 128), mat.lip)
  const face = new THREE.Shape(); face.absarc(0, 0, 0.64, 0, TAU, false)
  face.holes.push(circlePath(0, 0, 0.08))
  for (let k = 0; k < 5; k++) {
    const a = Math.PI / 2 + k * TAU / 5
    face.holes.push(circlePath(Math.cos(a + TAU / 10) * 0.15, Math.sin(a + TAU / 10) * 0.15, 0.026))
    const c = a + TAU / 10, wo = 0.43, wi = 0.24, ro = 0.575, ri = 0.255, w = new THREE.Path()
    w.moveTo(Math.cos(c - wi) * ri, Math.sin(c - wi) * ri)
    w.lineTo(Math.cos(c - wo) * (ro - 0.04), Math.sin(c - wo) * (ro - 0.04))
    w.quadraticCurveTo(Math.cos(c - wo) * ro, Math.sin(c - wo) * ro, Math.cos(c - wo + 0.07) * ro, Math.sin(c - wo + 0.07) * ro)
    w.absarc(0, 0, ro, c - wo + 0.07, c + wo - 0.07, false)
    w.quadraticCurveTo(Math.cos(c + wo) * ro, Math.sin(c + wo) * ro, Math.cos(c + wo) * (ro - 0.04), Math.sin(c + wo) * (ro - 0.04))
    w.lineTo(Math.cos(c + wi) * ri, Math.sin(c + wi) * ri)
    w.absarc(0, 0, ri, c + wi, c - wi, true)
    face.holes.push(w)
  }
  const faceMesh = new THREE.Mesh(extrudeX(face, 0.06, 0.02), mat.face); faceMesh.position.x = 0.2
  const cap = new THREE.Mesh(cylX(0.075, 0.035), mat.dark); cap.position.x = 0.25
  const capRing = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.009, 12, 48).rotateY(Math.PI / 2), mat.paint); capRing.position.x = 0.27
  add('rim', [1.3, 0, 0], true, barrel, faceMesh, cap, capRing)

  // ── Tuercas
  const nuts: THREE.Object3D[] = []
  for (let k = 0; k < 5; k++) {
    const a = Math.PI / 2 + TAU / 10 + k * TAU / 5
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.075, 6).rotateZ(Math.PI / 2), mat.chrome)
    n.position.set(0.27, Math.sin(a) * 0.15, -Math.cos(a) * 0.15); n.rotation.x = a; nuts.push(n)
  }
  add('nuts', [3.1, 0, 0], true, ...nuts)

  // ── Disco de freno perforado + campana
  const disc = new THREE.Shape(); disc.absarc(0, 0, 0.53, 0, TAU, false); disc.holes.push(circlePath(0, 0, 0.21))
  for (let ring = 0; ring < 3; ring++) for (let k = 0; k < 14; k++) {
    const a = (k + ring * 0.33) * TAU / 14, r = 0.3 + ring * 0.07
    disc.holes.push(circlePath(Math.cos(a) * r, Math.sin(a) * r, 0.017))
  }
  const discMesh = new THREE.Mesh(extrudeX(disc, 0.05, 0.008, 64), mat.steel)
  const hat = new THREE.Mesh(lathe([[0.0, 0.1], [0.215, 0.1], [0.215, 0.1], [0.215, -0.02], [0.2, -0.02], [0.2, 0.085], [0.0, 0.085]].map(([r, y]) => new THREE.Vector2(r, y)).reverse(), 64), mat.dark)
  add('disc', [0, 0, 0], true, discMesh, hat)
  parts.disc.carrier.position.x = -0.06

  // ── Pinza de freno (color de marca)
  const cal = new THREE.Shape()
  cal.absarc(0, 0, 0.585, Math.PI * 0.3, Math.PI * 0.7, false); cal.absarc(0, 0, 0.36, Math.PI * 0.7, Math.PI * 0.3, true)
  const calMesh = new THREE.Mesh(extrudeX(cal, 0.2, 0.035), mat.paint)
  const bolt1 = new THREE.Mesh(cylX(0.022, 0.25), mat.chrome); bolt1.position.set(0, Math.sin(Math.PI * 0.36) * 0.47, Math.cos(Math.PI * 0.36) * 0.47)
  const bolt2 = bolt1.clone(); bolt2.position.z *= -1
  const calCarrier = add('caliper', [-0.15, 0.45, 0], false, calMesh, bolt1, bolt2)
  anchor(calCarrier, 0.08, 0.52, 0.05)
  calCarrier.carrier.position.x = -0.06

  // ── Buje con espárragos
  const hub = new THREE.Mesh(cylX(0.13, 0.22), mat.dark); hub.position.x = -0.24
  const flange = new THREE.Mesh(cylX(0.2, 0.035), mat.steel); flange.position.x = -0.13
  const studs: THREE.Object3D[] = [hub, flange]
  for (let k = 0; k < 5; k++) {
    const a = Math.PI / 2 + TAU / 10 + k * TAU / 5
    const s = new THREE.Mesh(cylX(0.012, 0.42, 12), mat.chrome); s.position.set(0.07, Math.sin(a) * 0.15, -Math.cos(a) * 0.15); studs.push(s)
  }
  anchor(add('hub', [-1.15, 0, 0], true, ...studs), -0.2, 0.05, 0.16)

  // ── Mangueta + amortiguador + muelle
  const upright = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.62, 0.2), mat.dark); upright.position.set(-0.42, 0.1, 0)
  const spring = new THREE.Mesh(new THREE.TubeGeometry(new Helix(0.135, 0.78, 6.5), 420, 0.022, 10), mat.paint); spring.position.set(-0.42, 0.86, 0)
  const damper = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.62, 32), mat.dark); damper.position.set(-0.42, 0.66, 0)
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 16), mat.chrome); rod.position.set(-0.42, 1.12, 0)
  const seatLo = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.03, 40), mat.steel); seatLo.position.set(-0.42, 0.46, 0)
  const seatHi = seatLo.clone(); seatHi.position.y = 1.27
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.08, 40), mat.dark); top.position.set(-0.42, 1.33, 0)
  const strut = add('strut', [-2.1, 0.35, 0], false, upright, spring, damper, rod, seatLo, seatHi, top)
  anchor(strut, -0.42, 0.9, 0.16)

  return { root, parts, materials: mat }
}
