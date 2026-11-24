// Maletín organizador negro con la tapa abierta en un estudio oscuro, con piezas ordenadas alrededor
// (referencia de imagen del cliente). Unidades: ancho del maletín = 1.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { TYPE, PartType } from './parts'

export type Compartment = { key: string; x0: number; x1: number; z0: number; z1: number; used: number }
const BASE_Y = 0.03, WALL_TOP = 0.15

// grano del plástico (relieve y rugosidad irregulares, como un maletín moldeado)
function grain() {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const g = c.getContext('2d')!, img = g.createImageData(256, 256)
  for (let i = 0; i < img.data.length; i += 4) { const v = 150 + Math.random() * 70; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255 }
  g.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6); return t
}
const G = grain()
const plastic = new THREE.MeshPhysicalMaterial({ color: 0x17181b, metalness: 0, roughness: 0.62, roughnessMap: G, bumpMap: G, bumpScale: 0.6, clearcoat: 0.18, clearcoatRoughness: 0.55 })
const plasticIn = new THREE.MeshStandardMaterial({ color: 0x202125, metalness: 0, roughness: 0.75, roughnessMap: G, bumpMap: G, bumpScale: 0.4 })
const rubber = new THREE.MeshStandardMaterial({ color: 0x0b0b0c, metalness: 0, roughness: 0.92 })
const metal = new THREE.MeshStandardMaterial({ color: 0xbfc4cb, metalness: 1, roughness: 0.24 })
const darkMetal = new THREE.MeshStandardMaterial({ color: 0x55595f, metalness: 1, roughness: 0.35 })

const shade = (o: THREE.Mesh) => { o.castShadow = o.receiveShadow = true; return o }
const box = (w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material = plastic, r = 0.012) =>
  { const b = shade(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.2, h / 2.2, d / 2.2)), m)); b.position.set(x, y, z); return b }
const cylX = (r: number, len: number, x: number, y: number, z: number, m = metal) => { const c = shade(new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 20).rotateZ(Math.PI / 2), m)); c.position.set(x, y, z); return c }
const screwHead = (x: number, y: number, z: number) => { const s = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 16).rotateX(Math.PI / 2), darkMetal)); s.position.set(x, y, z); return s }

function nameplate() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 96
  const g = c.getContext('2d')!, l = g.createLinearGradient(0, 0, 0, 96)
  l.addColorStop(0, '#9aa0a8'); l.addColorStop(0.5, '#d9dde2'); l.addColorStop(1, '#7d838b')
  g.fillStyle = l; g.fillRect(0, 0, 512, 96)
  const font = document.fonts?.check('40px Michroma') ? 'Michroma' : 'sans-serif'
  g.fillStyle = '#16181b'; g.font = `600 40px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'
  ;(g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '6px'
  g.fillText('VEGAWAGEN', 256, 50)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}
// suelo del estudio: negro satinado con un círculo de luz que se funde con el fondo
function floorAlpha() {
  const c = document.createElement('canvas'); c.width = c.height = 512
  const g = c.getContext('2d')!, r = g.createRadialGradient(256, 256, 30, 256, 256, 256)
  r.addColorStop(0, '#fff'); r.addColorStop(0.55, '#888'); r.addColorStop(1, '#000')
  g.fillStyle = r; g.fillRect(0, 0, 512, 512); return new THREE.CanvasTexture(c)
}

// Compartimentos: 3 filas (fondo, centro, delante); cada uno guarda un tipo de pieza
const LAYOUT: [number, number, number, number, string][] = [
  [-0.46, -0.24, -0.27, -0.09, 'agujas'], [-0.24, 0, -0.27, -0.09, 'bulon'], [0, 0.17, -0.27, -0.09, 'muelle'], [0.17, 0.32, -0.27, -0.09, 'bujia'], [0.32, 0.46, -0.27, -0.09, 'pinon'],
  [-0.46, -0.24, -0.09, 0.09, 'muelle'], [-0.24, 0, -0.09, 0.09, 'pinon'], [0, 0.24, -0.09, 0.09, 'rodamiento'], [0.24, 0.46, -0.09, 0.09, 'tornillo'],
  [-0.46, -0.32, 0.09, 0.27, 'casquillo'], [-0.32, -0.16, 0.09, 0.27, 'tornillo'], [-0.16, 0, 0.09, 0.27, 'cobre'], [0, 0.16, 0.09, 0.27, 'arandela'], [0.16, 0.32, 0.09, 0.27, 'anillo'], [0.32, 0.46, 0.09, 0.27, 'tuerca'],
]

export function buildCase(mobile: boolean) {
  const root = new THREE.Group()
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.4), new THREE.MeshStandardMaterial({ color: 0x0e0f11, roughness: 0.42, metalness: 0.35, alphaMap: floorAlpha(), transparent: true }))
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; root.add(floor)

  // ── cuerpo
  const body = new THREE.Group(); root.add(body)
  body.add(box(1, BASE_Y, 0.62, 0, BASE_Y / 2, 0, plastic, 0.012),
    box(1, 0.16, 0.035, 0, 0.08, 0.2925, plastic, 0.016), box(1, 0.16, 0.035, 0, 0.08, -0.2925, plastic, 0.016),
    box(0.035, 0.16, 0.62, -0.4825, 0.08, 0, plastic, 0.016), box(0.035, 0.16, 0.62, 0.4825, 0.08, 0, plastic, 0.016))
  // moldura exterior y borde superior
  body.add(box(0.86, 0.014, 0.012, 0, 0.115, 0.313, plastic, 0.006), box(0.86, 0.014, 0.012, 0, 0.115, -0.313, plastic, 0.006),
    box(0.012, 0.014, 0.5, -0.502, 0.115, 0, plastic, 0.006), box(0.012, 0.014, 0.5, 0.502, 0.115, 0, plastic, 0.006))
  body.add(box(1.015, 0.02, 0.04, 0, 0.165, 0.3, plastic, 0.009), box(1.015, 0.02, 0.04, 0, 0.165, -0.3, plastic, 0.009),
    box(0.04, 0.02, 0.635, -0.4925, 0.165, 0, plastic, 0.009), box(0.04, 0.02, 0.635, 0.4925, 0.165, 0, plastic, 0.009))
  // esquinas reforzadas con tornillo
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    body.add(box(0.085, 0.182, 0.085, sx * 0.475, 0.091, sz * 0.285, plastic, 0.028))
    body.add(screwHead(sx * 0.475, 0.14, sz * 0.285 + sz * 0.0445), screwHead(sx * 0.475, 0.04, sz * 0.285 + sz * 0.0445))
  }
  // separadores interiores
  const comps: Compartment[] = LAYOUT.map(([x0, x1, z0, z1, key]) => ({ key, x0, x1, z0, z1, used: 0 }))
  const dh = WALL_TOP - BASE_Y, dy = BASE_Y + dh / 2
  body.add(box(0.93, dh, 0.012, 0, dy, -0.09, plasticIn, 0.005), box(0.93, dh, 0.012, 0, dy, 0.09, plasticIn, 0.005), box(0.018, dh + 0.006, 0.56, 0, dy + 0.003, 0, plasticIn, 0.006))
  for (const c of comps) if (c.x1 < 0.45 && Math.abs(c.x1) > 0.01) body.add(box(0.012, dh, c.z1 - c.z0, c.x1, dy, (c.z0 + c.z1) / 2, plasticIn, 0.005))
  // cierres metálicos abiertos (placa, eje y palanca colgando)
  for (const sx of [-0.33, 0.33]) {
    body.add(box(0.085, 0.07, 0.012, sx, 0.125, 0.316, darkMetal, 0.006), cylX(0.009, 0.08, sx, 0.112, 0.326))
    const lever = box(0.07, 0.085, 0.01, sx, 0.072, 0.334, metal, 0.006); lever.rotation.x = 0.22; body.add(lever)
    body.add(box(0.04, 0.012, 0.012, sx, 0.035, 0.342, metal, 0.004))
  }
  // asa curvada con soportes
  const path = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.13, 0.08, 0.318), new THREE.Vector3(-0.115, 0.05, 0.37), new THREE.Vector3(0, 0.042, 0.388), new THREE.Vector3(0.115, 0.05, 0.37), new THREE.Vector3(0.13, 0.08, 0.318)])
  body.add(shade(new THREE.Mesh(new THREE.TubeGeometry(path, 48, 0.016, 12), plastic)))
  for (const sx of [-0.13, 0.13]) body.add(box(0.04, 0.05, 0.03, sx, 0.085, 0.318, plastic, 0.01))
  // placa con el nombre
  const plate = shade(new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.038, 0.006, 2, 0.003), [darkMetal, darkMetal, darkMetal, darkMetal, new THREE.MeshStandardMaterial({ map: nameplate(), metalness: 0.9, roughness: 0.3 }), darkMetal]))
  plate.position.set(0, 0.138, 0.314); body.add(plate)
  // bisagras traseras
  for (const sx of [-0.33, 0, 0.33]) body.add(cylX(0.014, 0.12, sx, 0.168, -0.318, darkMetal))

  // ── tapa abierta: carcasa, marco interior, nervios en cuadrícula y junta de goma
  const lid = new THREE.Group(); lid.position.set(0, 0.168, -0.318); lid.rotation.x = -1.95; root.add(lid)
  lid.add(box(1, 0.05, 0.62, 0, 0.025, 0.31, plastic, 0.022))
  for (const sx of [-1, 1]) for (const sz of [0.04, 0.58]) lid.add(box(0.085, 0.062, 0.085, sx * 0.475, 0.031, sz, plastic, 0.026))
  lid.add(box(0.9, 0.016, 0.018, 0, -0.007, 0.045, plasticIn, 0.006), box(0.9, 0.016, 0.018, 0, -0.007, 0.575, plasticIn, 0.006),
    box(0.018, 0.016, 0.53, -0.441, -0.007, 0.31, plasticIn, 0.006), box(0.018, 0.016, 0.53, 0.441, -0.007, 0.31, plasticIn, 0.006))
  for (let i = 1; i <= 4; i++) lid.add(box(0.01, 0.012, 0.5, -0.44 + i * 0.176, -0.005, 0.31, plasticIn, 0.004))
  for (let i = 1; i <= 2; i++) lid.add(box(0.86, 0.012, 0.01, 0, -0.005, 0.045 + i * 0.177, plasticIn, 0.004))
  lid.add(box(0.96, 0.006, 0.008, 0, -0.002, 0.018, rubber, 0.003), box(0.96, 0.006, 0.008, 0, -0.002, 0.602, rubber, 0.003),
    box(0.008, 0.006, 0.58, -0.478, -0.002, 0.31, rubber, 0.003), box(0.008, 0.006, 0.58, 0.478, -0.002, 0.31, rubber, 0.003))
  for (const sx of [-0.33, 0.33]) lid.add(box(0.06, 0.03, 0.02, sx, 0.02, 0.625, darkMetal, 0.006))

  // ── piezas ordenadas alrededor (estáticas, fusionadas por material para que pese poco)
  const decor = new THREE.Group(), place = (key: string, x: number, z: number, yaw = 0) => {
    const t = TYPE[key], o = t.build(), s = t.rel; o.scale.setScalar(s)
    o.quaternion.setFromEuler(new THREE.Euler(0, yaw, 0)).multiply(new THREE.Quaternion().setFromEuler(t.rest))
    o.position.set(x, t.h * s / 2 + 0.001, z); decor.add(o)
  }
  const rows = (key: string, x0: number, z0: number, n: number, m: number, dx: number, dz: number, yaw = 0) => { for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) place(key, x0 + i * dx, z0 + j * dz, yaw) }
  rows('tornillo', -1.0, -0.3, 4, 1, 0.075, 0, -0.5); rows('arandela', -0.98, -0.18, 5, 1, 0.055, 0); rows('tuerca', -0.96, -0.08, 5, 1, 0.055, 0)
  rows('tornillo', -0.98, 0.04, 5, 1, 0.07, 0, -0.5); rows('rodamiento', -0.86, 0.32, 2, 2, 0.1, 0.1); rows('agujas', -0.6, 0.44, 2, 1, 0.08, 0)
  rows('pinon', -0.3, 0.56, 3, 1, 0.11, 0); rows('casquillo', 0.12, 0.58, 4, 1, 0.06, 0)
  rows('muelle', 0.72, 0.05, 5, 2, 0.065, 0.08); rows('agujas', 0.66, -0.08, 4, 1, 0.065, 0); rows('anillo', 0.9, -0.2, 2, 1, 0.09, 0)
  place('casquillo', 0.55, 0.5); place('bulon', 0.62, 0.38, 0.6)
  if (!mobile) rows('cobre', -1.1, -0.42, 4, 1, 0.055, 0)
  decor.updateMatrixWorld(true)
  const byMat = new Map<THREE.Material, THREE.BufferGeometry[]>()
  decor.traverse(o => { const m = o as THREE.Mesh; if (!m.isMesh) return
    const geo = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()).applyMatrix4(m.matrixWorld)
    for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(k)) geo.deleteAttribute(k)
    const mat = m.material as THREE.Material; if (!byMat.has(mat)) byMat.set(mat, []); byMat.get(mat)!.push(geo) })
  for (const [mat, geos] of byMat) root.add(shade(new THREE.Mesh(mergeGeometries(geos), mat)))

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
  return { root, comps, slot }
}
