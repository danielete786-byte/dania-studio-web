// Maletín organizador negro con la tapa abierta, sobre un suelo de plano técnico
// con piezas ordenadas alrededor (referencia de imagen del cliente). Unidades: ancho del maletín = 1.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { TYPES, TYPE, PartType } from './parts'

export type Compartment = { key: string; x0: number; x1: number; z0: number; z1: number; used: number }
const BASE_Y = 0.03, WALL_TOP = 0.15

const plastic = new THREE.MeshPhysicalMaterial({ color: 0x1c1d20, metalness: 0, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5 })
const plasticIn = new THREE.MeshStandardMaterial({ color: 0x232428, metalness: 0, roughness: 0.7 })
const latchMat = new THREE.MeshStandardMaterial({ color: 0xc9ced5, metalness: 1, roughness: 0.25 })

const box = (w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material = plastic, r = 0.012) => {
  const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.2, h / 2.2, d / 2.2)), m)
  b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; return b
}

function floorTexture() {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 1408
  const g = c.getContext('2d')!, W = c.width, H = c.height
  g.fillStyle = '#2b2d31'; g.fillRect(0, 0, W, H)
  g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 2
  for (let x = 0; x <= W; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke() }
  for (let y = 0; y <= H; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke() }
  g.strokeStyle = 'rgba(255,255,255,.13)'; g.lineWidth = 2.5
  for (let x = 0; x <= W; x += 256) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke() }
  for (let y = 0; y <= H; y += 256) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke() }
  // dibujos técnicos: ejes XYZ, esfera, cotas y un arco de pieza
  g.strokeStyle = 'rgba(235,240,245,.55)'; g.lineWidth = 3; g.fillStyle = 'rgba(235,240,245,.6)'; g.font = '28px monospace'
  const arrow = (x0: number, y0: number, x1: number, y1: number, t: string) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.fillText(t, x1 + 8, y1 + 8) }
  arrow(200, 1000, 200, 860, 'Y'); arrow(200, 1000, 330, 1060, 'X'); arrow(200, 1000, 300, 920, 'Y')
  g.beginPath(); g.ellipse(560, 300, 55, 55, 0, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.ellipse(560, 300, 55, 20, 0, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.ellipse(560, 300, 20, 55, 0, 0, Math.PI * 2); g.stroke()
  g.setLineDash([10, 8]); g.strokeRect(1500, 260, 220, 190); g.beginPath(); g.arc(1610, 450, 90, Math.PI, 0); g.stroke()
  g.beginPath(); g.moveTo(1460, 470); g.lineTo(1760, 470); g.stroke(); g.setLineDash([])
  g.beginPath(); g.moveTo(1460, 500); g.lineTo(1760, 500); g.stroke(); g.fillText('Ø 42', 1585, 540)
  // borde que se funde con la página
  const fade = g.createRadialGradient(W / 2, H / 2, H * 0.18, W / 2, H / 2, H * 0.5)
  fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)')
  g.globalCompositeOperation = 'destination-out'; g.fillStyle = fade; g.fillRect(0, 0, W, H)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

// Compartimentos: 3 filas (fondo, centro, delante); cada uno guarda un tipo de pieza
const LAYOUT: [number, number, number, number, string][] = [
  [-0.46, -0.24, -0.27, -0.09, 'agujas'], [-0.24, 0, -0.27, -0.09, 'bulon'], [0, 0.17, -0.27, -0.09, 'muelle'], [0.17, 0.32, -0.27, -0.09, 'bujia'], [0.32, 0.46, -0.27, -0.09, 'pinon'],
  [-0.46, -0.24, -0.09, 0.09, 'muelle'], [-0.24, 0, -0.09, 0.09, 'pinon'], [0, 0.24, -0.09, 0.09, 'rodamiento'], [0.24, 0.46, -0.09, 0.09, 'tornillo'],
  [-0.46, -0.32, 0.09, 0.27, 'casquillo'], [-0.32, -0.16, 0.09, 0.27, 'tornillo'], [-0.16, 0, 0.09, 0.27, 'cobre'], [0, 0.16, 0.09, 0.27, 'arandela'], [0.16, 0.32, 0.09, 0.27, 'anillo'], [0.32, 0.46, 0.09, 0.27, 'tuerca'],
]

export function buildCase(mobile: boolean) {
  const root = new THREE.Group()
  // suelo de plano técnico
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.2), new THREE.MeshStandardMaterial({ map: floorTexture(), transparent: true, roughness: 0.9, metalness: 0 }))
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; root.add(floor)

  // cuerpo: fondo, paredes, esquinas reforzadas y borde
  const body = new THREE.Group(); root.add(body)
  body.add(box(1, BASE_Y, 0.62, 0, BASE_Y / 2, 0), box(1, 0.16, 0.035, 0, 0.08, 0.2925), box(1, 0.16, 0.035, 0, 0.08, -0.2925),
    box(0.035, 0.16, 0.62, -0.4825, 0.08, 0), box(0.035, 0.16, 0.62, 0.4825, 0.08, 0))
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) body.add(box(0.075, 0.175, 0.075, sx * 0.47, 0.0875, sz * 0.28, plastic, 0.02))
  body.add(box(1.02, 0.022, 0.04, 0, 0.165, 0.3), box(1.02, 0.022, 0.04, 0, 0.165, -0.3), box(0.04, 0.022, 0.64, -0.49, 0.165, 0), box(0.04, 0.022, 0.64, 0.49, 0.165, 0))
  // separadores interiores
  const comps: Compartment[] = LAYOUT.map(([x0, x1, z0, z1, key]) => ({ key, x0, x1, z0, z1, used: 0 }))
  const dh = WALL_TOP - BASE_Y, dy = BASE_Y + dh / 2
  body.add(box(0.93, dh, 0.012, 0, dy, -0.09, plasticIn, 0.004), box(0.93, dh, 0.012, 0, dy, 0.09, plasticIn, 0.004), box(0.016, dh + 0.005, 0.56, 0, dy, 0, plasticIn, 0.005))
  for (const c of comps) if (c.x1 < 0.45 && Math.abs(c.x1) > 0.01) body.add(box(0.012, dh, c.z1 - c.z0, c.x1, dy, (c.z0 + c.z1) / 2, plasticIn, 0.004))
  // cierres metálicos y asa
  for (const sx of [-0.33, 0.33]) {
    body.add(box(0.07, 0.085, 0.014, sx, 0.1, 0.316, latchMat, 0.006), box(0.09, 0.03, 0.03, sx, 0.15, 0.31, plastic, 0.01))
  }
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.016, 10, 30, Math.PI), plastic); handle.rotation.x = Math.PI / 2
  handle.position.set(0, 0.07, 0.315); handle.scale.set(1.3, 0.55, 1); handle.castShadow = true; body.add(handle)
  for (const sx of [-0.12, 0.12]) body.add(box(0.03, 0.04, 0.03, sx, 0.07, 0.315))

  // tapa abierta (bisagra en el borde trasero superior)
  const lid = new THREE.Group(); lid.position.set(0, 0.16, -0.31); lid.rotation.x = -1.95; root.add(lid)
  lid.add(box(1, 0.05, 0.62, 0, 0.025, 0.31, plastic, 0.02))
  for (const sx of [-1, 1]) for (const sz of [0.04, 0.58]) lid.add(box(0.075, 0.06, 0.075, sx * 0.47, 0.03, sz, plastic, 0.02))
  for (let i = 0; i <= 5; i++) lid.add(box(0.012, 0.018, 0.54, -0.44 + i * 0.176, -0.006, 0.31, plasticIn, 0.004))
  for (let i = 0; i <= 3; i++) lid.add(box(0.9, 0.018, 0.012, 0, -0.006, 0.04 + i * 0.18, plasticIn, 0.004))
  for (const sx of [-0.33, 0.33]) lid.add(box(0.08, 0.03, 0.03, sx, 0.02, 0.62, plastic, 0.01))

  // piezas ordenadas alrededor (estáticas, fusionadas por material para que pese poco)
  const decor = new THREE.Group(), place = (key: string, x: number, z: number, yaw = 0, extra?: THREE.Euler) => {
    const t = TYPE[key], o = t.build(), s = t.rel; o.scale.setScalar(s)
    o.quaternion.setFromEuler(new THREE.Euler(0, yaw, 0)).multiply(new THREE.Quaternion().setFromEuler(extra ?? t.rest))
    o.position.set(x, t.h * s / 2 + 0.001, z); decor.add(o)
  }
  const rows = (key: string, x0: number, z0: number, n: number, m: number, dx: number, dz: number, yaw = 0) => { for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) place(key, x0 + i * dx, z0 + j * dz, yaw) }
  rows('tornillo', -1.02, -0.32, 4, 1, 0.075, 0, -0.5); rows('arandela', -1.0, -0.2, 5, 1, 0.055, 0); rows('tuerca', -0.98, -0.1, 5, 1, 0.055, 0)
  rows('tornillo', -1.0, 0.02, 5, 1, 0.07, 0, -0.5); rows('tornillo', -0.94, 0.2, 4, 1, 0.07, 0, -0.5)
  rows('rodamiento', -0.88, 0.38, 2, 2, 0.1, 0.1); rows('agujas', -0.62, 0.44, 2, 1, 0.08, 0); rows('arandela', -0.75, 0.62, 4, 1, 0.06, 0)
  rows('pinon', -0.3, 0.58, 3, 1, 0.11, 0); place('pinon', -0.15, 0.72); rows('casquillo', 0.12, 0.6, 4, 1, 0.06, 0)
  rows('muelle', 0.72, 0.05, 5, 2, 0.065, 0.08); rows('agujas', 0.66, -0.08, 4, 1, 0.065, 0); rows('anillo', 0.92, -0.18, 2, 1, 0.09, 0)
  place('casquillo', 0.55, 0.5); place('casquillo', 0.62, 0.55); place('bulon', 0.6, 0.38, 0.6)
  if (!mobile) { rows('cobre', -1.15, -0.45, 4, 1, 0.055, 0); rows('anillo', 1.0, -0.36, 2, 1, 0.1, 0) }
  decor.updateMatrixWorld(true)
  const byMat = new Map<THREE.Material, THREE.BufferGeometry[]>()
  decor.traverse(o => { const m = o as THREE.Mesh; if (!m.isMesh) return
    const geo = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()).applyMatrix4(m.matrixWorld)
    for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(k)) geo.deleteAttribute(k)
    const mat = m.material as THREE.Material; if (!byMat.has(mat)) byMat.set(mat, []); byMat.get(mat)!.push(geo) })
  for (const [mat, geos] of byMat) { const merged = new THREE.Mesh(mergeGeometries(geos), mat); merged.castShadow = merged.receiveShadow = true; root.add(merged) }

  // posiciones dentro de cada compartimento
  const slot = (c: Compartment, t: PartType, index: number) => {
    const s = t.rel, fx = t.foot[0] * s * 1.12, fz = t.foot[1] * s * 1.12, m = 0.014
    const w = c.x1 - c.x0 - 2 * m, d = c.z1 - c.z0 - 2 * m
    const cols = Math.max(1, Math.floor(w / fx)), rws = Math.max(1, Math.floor(d / fz)), per = cols * rws
    const layer = Math.floor(index / per), i = index % per, col = i % cols, row = Math.floor(i / cols)
    const x = c.x0 + m + (w - cols * fx) / 2 + fx * (col + 0.5) + (layer % 2) * fx * 0.25
    const z = c.z0 + m + (d - rws * fz) / 2 + fz * (row + 0.5) + (layer % 2) * fz * 0.25
    return new THREE.Vector3(x, BASE_Y + t.h * s * (layer + 0.5) + 0.002, z)
  }
  return { root, comps, slot, types: TYPES }
}
