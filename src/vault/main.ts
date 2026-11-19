import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import * as T from './textures'
import './vault.css'

/* ───────────────────────── utilidades ───────────────────────── */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
const smooth = (t: number) => t * t * (3 - 2 * t)
const mobile = matchMedia('(pointer: coarse)').matches || innerWidth < 760
const TEX = mobile ? 1024 : 2048

/* ───────────────────────── renderer ───────────────────────── */
const canvas = document.getElementById('scene') as HTMLCanvasElement
let renderer: THREE.WebGLRenderer
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }) }
catch { document.body.classList.add('no-webgl'); throw new Error('WebGL no disponible') }
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75))
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .95
renderer.outputColorSpace = THREE.SRGBColorSpace
const aniso = renderer.capabilities.getMaxAnisotropy()

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050505)
scene.fog = new THREE.Fog(0x050505, 9, 22)
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture
scene.environmentIntensity = 0.55

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.03, 60)

/* ───────────────────────── materiales ───────────────────────── */
const set = (t: THREE.Texture, rx: number, ry: number) => { t.repeat.set(rx, ry); t.anisotropy = aniso; return t }
const conc = T.concrete(TEX, 3, [132, 127, 120])
const wallMat = new THREE.MeshStandardMaterial({ map: conc.map, bumpMap: conc.bump, bumpScale: 2.2, roughnessMap: conc.rough, roughness: 1, color: 0xb8b2a8 })
const concIn = T.concrete(TEX, 7, [120, 118, 114], .8)
const innerWallMat = new THREE.MeshStandardMaterial({ map: concIn.map, bumpMap: concIn.bump, bumpScale: 1.5, roughnessMap: concIn.rough, roughness: 1, color: 0x8a8580 })
const floorT = T.polishedFloor(TEX, 11)
const floorMat = new THREE.MeshStandardMaterial({ map: floorT.map, roughnessMap: floorT.rough, roughness: .9, metalness: 0, color: 0xcfcac2 })
const brushRing = T.brushed(2048, 256, 5, 70, 160, mobile ? 3000 : 6000)
const brushFlat = T.brushed(1024, 1024, 8, 80, 160, 4000)
const steelMat = new THREE.MeshPhysicalMaterial({ color: 0x7d8288, metalness: 1, roughness: .9, roughnessMap: brushRing, bumpMap: brushRing, bumpScale: .25, clearcoat: .15, clearcoatRoughness: .4, side: THREE.DoubleSide })
const frameMat = new THREE.MeshPhysicalMaterial({ color: 0x6c7076, metalness: 1, roughness: 1, roughnessMap: set(brushFlat.clone(), 2, 2), bumpMap: brushFlat, bumpScale: .2, side: THREE.DoubleSide })
const darkSteel = new THREE.MeshStandardMaterial({ color: 0x3a3d42, metalness: .9, roughness: .45, roughnessMap: brushFlat })
const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe8e8ea, metalness: 1, roughness: .1, clearcoat: 1, clearcoatRoughness: .05 })
const brass = new THREE.MeshPhysicalMaterial({ color: 0xd9a84e, metalness: 1, roughness: .28, roughnessMap: brushFlat })
const plate = T.nameplate()
const plateMat = new THREE.MeshPhysicalMaterial({ map: plate.map, bumpMap: plate.bump, bumpScale: 3, metalness: 1, roughness: .35 })
const dialMat = new THREE.MeshPhysicalMaterial({ map: T.dialFace(), metalness: .25, roughness: .35, clearcoat: 1, clearcoatRoughness: .08 })
const woodMat = new THREE.MeshStandardMaterial({ map: T.wood(4), roughness: .85, color: 0x8a7a68 })
const boxes = T.depositBoxes(3)
const boxesMat = new THREE.MeshStandardMaterial({ map: set(boxes.map, 1, 1), bumpMap: boxes.bump, bumpScale: 3, metalness: .75, roughness: .38, color: 0xc4c2bc })
const stamp = T.barStamp(17)
const goldMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(1.0, 0.62, 0.2), metalness: 1, roughness: 1, roughnessMap: stamp.rough,
  bumpMap: stamp.bump, bumpScale: 3.5, specularIntensity: 1, clearcoat: .2, clearcoatRoughness: .3, envMapIntensity: 1.1 })

/* ───────────────────────── geometría base ───────────────────────── */
const C = new THREE.Vector3(0, 1.32, 0) // centro de la puerta
const R_HOLE = 1.15, R_FRAME = 1.48, WALL_T = .6

const add = <O extends THREE.Object3D>(o: O, parent: THREE.Object3D = scene, cast = true, recv = true) => {
  o.traverse(c => { if ((c as THREE.Mesh).isMesh) { c.castShadow = cast; c.receiveShadow = recv } }); parent.add(o); return o
}
const mesh = (g: THREE.BufferGeometry, m: THREE.Material) => new THREE.Mesh(g, m)

// Pared exterior con hueco circular
{
  const s = new THREE.Shape(); s.moveTo(-6, -.5); s.lineTo(6, -.5); s.lineTo(6, 8); s.lineTo(-6, 8); s.closePath()
  const h = new THREE.Path(); h.absarc(C.x, C.y, R_FRAME - .02, 0, Math.PI * 2, true); s.holes.push(h)
  const g = new THREE.ExtrudeGeometry(s, { depth: WALL_T, bevelEnabled: false, curveSegments: 96 })
  // UV planos en metros → textura 12×5.7m
  const uv = g.attributes.uv, pos = g.attributes.position
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + 6) / 12, (pos.getY(i) + .5) / 8.5)
  g.translate(0, 0, -WALL_T); add(mesh(g, wallMat))
}
// Marco de acero escalonado (torno)
{
  const pts = [[R_HOLE, -WALL_T - .02], [R_HOLE, .06], [R_HOLE + .04, .1], [R_FRAME - .14, .1], [R_FRAME - .12, .14],
    [R_FRAME - .04, .14], [R_FRAME, .1], [R_FRAME, 0]].map(([r, z]) => new THREE.Vector2(r, z))
  const g = new THREE.LatheGeometry(pts, 128); g.rotateX(Math.PI / 2)
  const m = add(mesh(g, frameMat)); m.position.copy(C)
  // remaches del marco
  const rv = new THREE.InstancedMesh(new THREE.SphereGeometry(.022, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2), chrome, 48)
  const d = new THREE.Object3D()
  for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; d.position.set(C.x + Math.cos(a) * (R_FRAME - .085), C.y + Math.sin(a) * (R_FRAME - .085), .14); d.updateMatrix(); rv.setMatrixAt(i, d.matrix) }
  add(rv)
}

/* ───────────────────────── puerta ───────────────────────── */
const HINGE = new THREE.Vector3(R_FRAME - .02, C.y, .32)
const doorPivot = new THREE.Group(); doorPivot.position.copy(HINGE); scene.add(doorPivot)
const door = new THREE.Group(); door.position.set(C.x - HINGE.x, 0, -HINGE.z); doorPivot.add(door)
const R_LIP = 1.3
{
  // perfil de la puerta: frente escalonado, labio y tapón trasero que entra en el túnel
  const prof = [[0, .5], [.34, .5], [.36, .49], [.38, .47], [.62, .47], [.64, .46], [.66, .44], [.98, .44], [1.0, .43], [1.02, .41],
    [1.2, .41], [1.24, .4], [R_LIP, .37], [R_LIP, .22], [R_LIP - .03, .2], [1.12, .2], [1.12, -.32], [1.1, -.35], [.5, -.35], [.5, -.3], [0, -.3]]
  const g = new THREE.LatheGeometry(prof.map(([r, z]) => new THREE.Vector2(r, z)), 160); g.rotateX(Math.PI / 2)
  add(mesh(g, steelMat), door)
  // anillo de remaches frontales
  const rv = new THREE.InstancedMesh(new THREE.SphereGeometry(.028, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2), chrome, 36)
  const d = new THREE.Object3D()
  for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; d.position.set(Math.cos(a) * 1.11, Math.sin(a) * 1.11, .41); d.updateMatrix(); rv.setMatrixAt(i, d.matrix) }
  add(rv, door)
  // placa de latón
  const pl = add(mesh(new THREE.BoxGeometry(.86, .17, .012), [darkSteel, darkSteel, darkSteel, darkSteel, plateMat, darkSteel] as unknown as THREE.Material), door)
  pl.position.set(0, -.76, .446)
}
// Cerrojos radiales (se retraen al girar la manivela)
const bolts: THREE.Mesh[] = []
{
  const g = new THREE.CylinderGeometry(.055, .055, .36, 32); g.rotateZ(Math.PI / 2); g.translate(.18, 0, 0)
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2 + Math.PI / 12, b = mesh(g, chrome)
    b.rotation.z = a; b.position.set(Math.cos(a) * 1.0, Math.sin(a) * 1.0, -.08); b.userData.a = a
    bolts.push(add(b, door))
  }
  // mecanismo trasero visible al abrir: placa, barras y engranaje
  const back = add(mesh(new THREE.CylinderGeometry(.95, .95, .04, 96).rotateX(Math.PI / 2), darkSteel), door); back.position.z = -.37
  const gear = new THREE.Group(); door.add(gear); gear.position.z = -.41
  const teeth = 28, gs = new THREE.Shape()
  for (let i = 0; i <= teeth * 2; i++) { const a = i / (teeth * 2) * Math.PI * 2, r = i % 2 ? .3 : .26; i ? gs.lineTo(Math.cos(a) * r, Math.sin(a) * r) : gs.moveTo(r, 0) }
  const gh = new THREE.Path(); gh.absarc(0, 0, .08, 0, 7, true); gs.holes.push(gh)
  add(mesh(new THREE.ExtrudeGeometry(gs, { depth: .05, bevelEnabled: true, bevelSize: .006, bevelThickness: .006, bevelSegments: 2 }).translate(0, 0, -.05), brass), gear)
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2, rod = add(mesh(new THREE.BoxGeometry(.72, .05, .03), chrome), gear)
    rod.position.set(Math.cos(a) * .55, Math.sin(a) * .55, -.02); rod.rotation.z = a
  }
  door.userData.gear = gear
  // brazos de bisagra
  for (const y of [-.62, .62]) {
    const arm = add(mesh(new THREE.BoxGeometry(.5, .16, .12), darkSteel), door); arm.position.set(HINGE.x - .27, y, .3)
  }
}
// Bisagra fija sobre el marco
{
  for (const y of [-.62, .62]) {
    const k = add(mesh(new THREE.CylinderGeometry(.1, .1, .2, 48), chrome)); k.position.set(HINGE.x, C.y + y, HINGE.z)
    const cap = add(mesh(new THREE.CylinderGeometry(.075, .075, .03, 48), chrome)); cap.position.set(HINGE.x, C.y + y + .115, HINGE.z)
    const base = add(mesh(new THREE.BoxGeometry(.3, .32, .2), darkSteel)); base.position.set(HINGE.x + .16, C.y + y, .2)
  }
  const pin = add(mesh(new THREE.CylinderGeometry(.06, .06, 1.6, 32), chrome)); pin.position.copy(HINGE)
}

// Rueda de manivelas (5 radios con pomos)
const wheel = new THREE.Group(); wheel.position.set(0, -.2, .5); door.add(wheel)
{
  add(mesh(new THREE.CylinderGeometry(.13, .15, .1, 64).rotateX(Math.PI / 2).translate(0, 0, .05), chrome), wheel)
  add(mesh(new THREE.CylinderGeometry(.06, .07, .06, 48).rotateX(Math.PI / 2).translate(0, 0, .12), brass), wheel)
  const spoke = new THREE.CylinderGeometry(.022, .03, .38, 24).translate(0, .19 + .1, 0)
  const knob = new THREE.SphereGeometry(.052, 32, 16), neck = new THREE.CylinderGeometry(.03, .04, .08, 24)
  for (let i = 0; i < 5; i++) {
    const g = new THREE.Group(); g.rotation.z = i / 5 * Math.PI * 2 + Math.PI / 5; g.position.z = .06; wheel.add(g)
    add(mesh(spoke, chrome), g)
    const n = add(mesh(neck, chrome), g); n.position.y = .47
    const k = add(mesh(knob, chrome), g); k.position.y = .53
  }
  add(mesh(new THREE.TorusGeometry(.33, .016, 16, 120).translate(0, 0, .06), chrome), wheel)
}
// Dial de combinación
const dial = new THREE.Group(); dial.position.set(0, .62, .47); door.add(dial)
{
  add(mesh(new THREE.CylinderGeometry(.24, .25, .03, 96).rotateX(Math.PI / 2).translate(0, 0, .015), chrome), door).position.copy(dial.position)
  const body = add(mesh(new THREE.CylinderGeometry(.2, .2, .06, 96, 1, true).rotateX(Math.PI / 2).translate(0, 0, .06), chrome), dial)
  body.castShadow = true
  const face = add(mesh(new THREE.CircleGeometry(.2, 96), dialMat), dial); face.position.z = .09
  const knob = add(mesh(new THREE.CylinderGeometry(.075, .085, .08, 64).rotateX(Math.PI / 2).translate(0, 0, .13), chrome), dial)
  // estriado del pomo
  const ridges = new THREE.InstancedMesh(new THREE.BoxGeometry(.01, .012, .07), chrome, 40), d = new THREE.Object3D()
  for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; d.position.set(Math.cos(a) * .082, Math.sin(a) * .082, .13); d.rotation.z = a; d.updateMatrix(); ridges.setMatrixAt(i, d.matrix) }
  add(ridges, dial); void knob
  // índice fijo
  const idx = add(mesh(new THREE.ConeGeometry(.018, .05, 3).rotateZ(Math.PI), brass), door); idx.position.set(0, .62 + .265, .47)
}

/* ───────────────────────── cámara acorazada interior ───────────────────────── */
const ROOM = { x: 3.6, z0: -WALL_T, z1: -8.2, h: 3.3 }
{
  const L = ROOM.z0 - ROOM.z1, mid = (ROOM.z0 + ROOM.z1) / 2
  const fl = add(mesh(new THREE.PlaneGeometry(ROOM.x * 2, L).rotateX(-Math.PI / 2), floorMat), scene, false); fl.position.set(0, 0, mid)
  const ce = add(mesh(new THREE.PlaneGeometry(ROOM.x * 2, L).rotateX(Math.PI / 2), innerWallMat), scene, false); ce.position.set(0, ROOM.h, mid)
  for (const s of [-1, 1]) {
    const w = add(mesh(new THREE.PlaneGeometry(L, ROOM.h).rotateY(-s * Math.PI / 2), boxesMat), scene, false); w.position.set(s * ROOM.x, ROOM.h / 2, mid)
  }
  const bw = add(mesh(new THREE.PlaneGeometry(ROOM.x * 2, ROOM.h), innerWallMat), scene, false); bw.position.set(0, ROOM.h / 2, ROOM.z1)
  // pared interior detrás del muro (cara trasera)
  const fs = new THREE.Shape(); fs.moveTo(-ROOM.x, 0); fs.lineTo(ROOM.x, 0); fs.lineTo(ROOM.x, ROOM.h); fs.lineTo(-ROOM.x, ROOM.h); fs.closePath()
  const fh = new THREE.Path(); fh.absarc(C.x, C.y, R_HOLE + .01, 0, Math.PI * 2, true); fs.holes.push(fh)
  const fg = new THREE.ShapeGeometry(fs, 96), fuv = fg.attributes.uv
  for (let i = 0; i < fuv.count; i++) fuv.setXY(i, (fuv.getX(i) + ROOM.x) / (ROOM.x * 2), fuv.getY(i) / ROOM.h)
  const fw = add(mesh(fg.rotateY(Math.PI), innerWallMat), scene, false); fw.position.set(0, 0, ROOM.z0 - .001)
  // suelo exterior
  const out = add(mesh(new THREE.PlaneGeometry(14, 14).rotateX(-Math.PI / 2), floorMat), scene, false); out.position.set(0, 0, 7)
  // zócalo de acero bajo la puerta
  const sill = add(mesh(new THREE.BoxGeometry(2.4, .03, 1.2), darkSteel)); sill.position.set(0, .02, .2)
  // lámparas de techo
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffe2b0, emissiveIntensity: 6 })
  for (const z of [-2.2, -4.4, -6.6]) for (const x of [-1.6, 1.6]) {
    const housing = add(mesh(new THREE.CylinderGeometry(.22, .26, .1, 48), darkSteel)); housing.position.set(x, ROOM.h - .05, z)
    const lens = add(mesh(new THREE.CircleGeometry(.19, 48).rotateX(Math.PI / 2), lampMat), scene, false, false); lens.position.set(x, ROOM.h - .101, z)
  }
}

/* ───────────────────────── lingotes ───────────────────────── */
const BL = .26, BH = .055, BW = .26 / 3 // 3 de ancho = 1 de largo → capas cruzadas cuadradas
function barGeometry() {
  const g = new RoundedBoxGeometry(BL, BH, BW, 3, .007)
  const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), t = (y + BH / 2) / BH
    // proyección superior para el grabado; base y laterales leen el margen plano
    if (n.getY(i) < -.5) uv.setXY(i, .02, .02); else uv.setXY(i, x / BL + .5, z / BW + .5)
    p.setXYZ(i, x * (1 - .07 * t), y, z * (1 - .2 * t))
  }
  g.computeBoundingSphere(); return g
}
const barGeo = barGeometry()

// Física
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) })
world.broadphase = new CANNON.SAPBroadphase(world); world.allowSleep = true
;(world.solver as CANNON.GSSolver).iterations = 12
const goldPhys = new CANNON.Material('gold'), groundPhys = new CANNON.Material('ground')
world.addContactMaterial(new CANNON.ContactMaterial(goldPhys, goldPhys, { friction: .32, restitution: .05 }))
world.addContactMaterial(new CANNON.ContactMaterial(goldPhys, groundPhys, { friction: .45, restitution: .08 }))
const ground = new CANNON.Body({ mass: 0, material: groundPhys, shape: new CANNON.Plane() })
ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0); world.addBody(ground)
for (const [x, z, sx, sz] of [[ROOM.x, -4.4, .1, 4], [-ROOM.x, -4.4, .1, 4], [0, ROOM.z1, ROOM.x, .1], [-2.4, ROOM.z0, 1.2, .1], [2.4, ROOM.z0, 1.2, .1]]) {
  const w = new CANNON.Body({ mass: 0, material: groundPhys, shape: new CANNON.Box(new CANNON.Vec3(sx, 2, sz)) }); w.position.set(x, 2, z); world.addBody(w)
}

type Stack = { x: number; z: number; layers: number; rot: number }
const stacks: Stack[] = mobile
  ? [{ x: -.68, z: -3.35, layers: 7, rot: .12 }, { x: .68, z: -3.45, layers: 7, rot: -.1 }, { x: 0, z: -4.6, layers: 8, rot: .04 }]
  : [{ x: -1.05, z: -3.0, layers: 7, rot: .12 }, { x: 1.05, z: -3.1, layers: 7, rot: -.1 }, { x: -.55, z: -4.55, layers: 8, rot: .05 }, { x: .9, z: -4.7, layers: 6, rot: -.2 }]
const PALLET_H = .14
type Bar = { body: CANNON.Body; home: { p: CANNON.Vec3; q: CANNON.Quaternion } }
const bars: Bar[] = []
const barHalf = new CANNON.Vec3(BL / 2 * .985, BH / 2, BW / 2 * .96)
for (const s of stacks) {
  // palé de madera
  const pal = new THREE.Group(); pal.position.set(s.x, 0, s.z); pal.rotation.y = s.rot; scene.add(pal)
  for (let i = 0; i < 5; i++) { const b = add(mesh(new THREE.BoxGeometry(.11, .022, .82), woodMat), pal); b.position.set(-.36 + i * .18, PALLET_H - .011, 0) }
  for (const z of [-.36, 0, .36]) { const b = add(mesh(new THREE.BoxGeometry(.82, .1, .1), woodMat), pal); b.position.set(0, .06, z); b.rotation.y = Math.PI / 2 * 0 }
  for (const z of [-.36, .36]) { const b = add(mesh(new THREE.BoxGeometry(.82, .02, .12), woodMat), pal); b.position.set(0, .01, z) }
  const pb = new CANNON.Body({ mass: 0, material: groundPhys, shape: new CANNON.Box(new CANNON.Vec3(.41, PALLET_H / 2, .41)) })
  pb.position.set(s.x, PALLET_H / 2, s.z); pb.quaternion.setFromEuler(0, s.rot, 0); world.addBody(pb)
  const qs = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, s.rot, 0))
  for (let L = 0; L < s.layers; L++) {
    const cross = L % 2 === 1
    for (let a = 0; a < 2; a++) for (let b = 0; b < 6; b++) {
      // 2 a lo largo × 6 a lo ancho; capas alternas giradas 90°
      const along = (a - .5) * (BL + .003), across = (b - 2.5) * (BW + .0025)
      const local = cross ? new THREE.Vector3(across, 0, along) : new THREE.Vector3(along, 0, across)
      local.applyQuaternion(qs)
      const y = PALLET_H + BH / 2 + L * (BH + .0008) + .0005
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, s.rot + (cross ? Math.PI / 2 : 0) + (Math.random() - .5) * .012, 0))
      const body = new CANNON.Body({ mass: 12.4, material: goldPhys, shape: new CANNON.Box(barHalf), allowSleep: true, sleepSpeedLimit: .12, sleepTimeLimit: .5, linearDamping: .05, angularDamping: .08 })
      body.position.set(s.x + local.x, y, s.z + local.z); body.quaternion.set(q.x, q.y, q.z, q.w)
      world.addBody(body); body.sleep()
      bars.push({ body, home: { p: body.position.clone(), q: body.quaternion.clone() } })
    }
  }
}
const barMesh = new THREE.InstancedMesh(barGeo, goldMat, bars.length)
barMesh.castShadow = barMesh.receiveShadow = true; barMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
{
  const col = new THREE.Color()
  for (let i = 0; i < bars.length; i++) { const v = .93 + Math.random() * .07; col.setRGB(v, v * (.97 + Math.random() * .03), v * (.94 + Math.random() * .06)); barMesh.setColorAt(i, col) }
}
scene.add(barMesh)

// Estanterías traseras con más lingotes (decorado estático)
{
  const shelfGroup = new THREE.Group(); shelfGroup.position.set(0, 0, ROOM.z1 + .45); scene.add(shelfGroup)
  const levels = [.55, 1.25, 1.95, 2.65], W = 6.4
  for (const y of levels) add(mesh(new THREE.BoxGeometry(W, .035, .7), darkSteel), shelfGroup).position.y = y
  for (const x of [-W / 2, -W / 6, W / 6, W / 2]) for (const z of [-.33, .33]) add(mesh(new THREE.BoxGeometry(.05, 2.75, .05), darkSteel), shelfGroup).position.set(x, 1.375, z)
  const per: THREE.Matrix4[] = [], d = new THREE.Object3D()
  // filas continuas en pirámide alargada por cada tramo de estantería
  for (const y of levels) for (let sec = 0; sec < 3; sec++) {
    const x0 = -W / 2 + sec * W / 3 + .08, n = Math.floor((W / 3 - .16) / (BW + .003))
    for (let r = 0; r < 3; r++) for (let k = 0; k < n - r; k++) {
      d.position.set(x0 + (k + r / 2 + .5) * (BW + .003), y + .0175 + BH / 2 + r * (BH + .001), (Math.random() - .5) * .01)
      d.rotation.set(0, Math.PI / 2 + (Math.random() - .5) * .03, 0); d.updateMatrix(); per.push(d.matrix.clone())
    }
  }
  const shelfBars = new THREE.InstancedMesh(barGeo, goldMat, per.length); per.forEach((m, i) => shelfBars.setMatrixAt(i, m))
  shelfBars.castShadow = false; shelfBars.receiveShadow = true; shelfGroup.add(shelfBars)
}

/* ───────────────────────── luces ───────────────────────── */
scene.add(new THREE.HemisphereLight(0x8090a0, 0x201810, .25))
const key = new THREE.SpotLight(0xfff0dc, 70, 18, .55, .65, 1.6); key.position.set(-1.6, 4.6, 5.2); key.target.position.copy(C)
key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004; key.shadow.normalBias = .02; key.shadow.camera.near = 2; key.shadow.camera.far = 14
scene.add(key, key.target)
const rim = new THREE.SpotLight(0x9fb8ff, 25, 14, .7, .9, 1.5); rim.position.set(4, 3.5, 3); rim.target.position.copy(C); scene.add(rim, rim.target)
const inside = new THREE.SpotLight(0xffd59a, 0, 9, .95, .55, 1.4); inside.position.set(0, ROOM.h - .15, -3.6); inside.target.position.set(0, 0, -3.8)
inside.castShadow = true; inside.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048); inside.shadow.bias = -.0003; inside.shadow.normalBias = .015
inside.shadow.camera.near = .5; inside.shadow.camera.far = 5; scene.add(inside, inside.target)
const shelfLights: THREE.SpotLight[] = []
for (const x of [-2, 0, 2]) { const s = new THREE.SpotLight(0xffd8a0, 0, 7, .8, .7, 1.5); s.position.set(x, ROOM.h - .1, -6.3); s.target.position.set(x, 1.2, ROOM.z1); scene.add(s, s.target); shelfLights.push(s) }
const glow = new THREE.PointLight(0xffc46b, 0, 6, 1.6); glow.position.set(0, 1.3, -1.6); scene.add(glow)

// Polvo en suspensión
const dust = (() => {
  const n = mobile ? 350 : 800, g = new THREE.BufferGeometry(), p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - .5) * 6.6; p[i * 3 + 1] = Math.random() * 3.1; p[i * 3 + 2] = -.8 - Math.random() * 7 }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3))
  const m = new THREE.PointsMaterial({ size: .018, map: T.dot(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffe2b0 })
  const pts = new THREE.Points(g, m); scene.add(pts); return pts
})()

/* ───────────────────────── postproceso ───────────────────────── */
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), .3, .5, .9)
composer.addPass(bloom); composer.addPass(new OutputPass())

/* ───────────────────────── recorrido de cámara ───────────────────────── */
type Key = { p: number; pos: [number, number, number]; tgt: [number, number, number]; fov: number }
const KEYS: Key[] = [
  { p: 0, pos: [0, 1.55, 10.5], tgt: [0, 1.3, 0], fov: 38 },
  { p: .12, pos: [0, 1.4, 4.9], tgt: [0, 1.3, 0], fov: 38 },
  { p: .22, pos: [-.38, 1.95, 2.05], tgt: [0, 1.86, .4], fov: 34 },
  { p: .33, pos: [.45, 1.28, 2.15], tgt: [0, 1.2, .4], fov: 36 },
  { p: .45, pos: [-.25, 1.45, 4.6], tgt: [0, 1.3, 0], fov: 40 },
  { p: .62, pos: [-1.55, 1.55, 4.7], tgt: [.25, 1.05, -2.2], fov: 42 },
  { p: .76, pos: [-.15, 1.45, 1.7], tgt: [0, .95, -3.2], fov: 46 },
  { p: .9, pos: [0, 1.7, -.9], tgt: [0, .45, -3.9], fov: 48 },
  { p: 1, pos: [0, 1.75, -1.45], tgt: [0, .4, -4.1], fov: 50 },
]
if (innerWidth < innerHeight) KEYS.forEach(k => {
  k.fov += 14
  if (k.p >= .9) { k.pos = [0, k.p === 1 ? 2.6 : 2.4, -.75]; k.tgt = [0, .15, -3.85] }
})
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), camTgt = new THREE.Vector3()
function cameraAt(p: number) {
  let i = 0; while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++
  const A = KEYS[i], B = KEYS[i + 1], t = ease(range(p, A.p, B.p))
  camera.position.copy(_a.fromArray(A.pos).lerp(_b.fromArray(B.pos), t))
  camTgt.copy(_a.fromArray(A.tgt).lerp(_b.fromArray(B.tgt), t))
  camera.fov = A.fov + (B.fov - A.fov) * t
}

/* ───────────────────────── sonido sintetizado ───────────────────────── */
let ac: AudioContext | null = null, muted = false, lastSnd = 0, sndBudget = 0
function clink(v: number) {
  if (!ac || muted) return
  const now = ac.currentTime
  if (now - lastSnd > .06) sndBudget = 0
  if (sndBudget++ > 5) return; lastSnd = now
  const vol = Math.min(1, v / 5) * .22, base = 700 + Math.random() * 900, out = ac.createGain()
  out.gain.value = vol; out.connect(ac.destination)
  for (const [ratio, amp, dec] of [[1, 1, .35], [2.71, .5, .22], [5.15, .3, .12], [8.2, .15, .07]]) {
    const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = base * ratio
    g.gain.setValueAtTime(amp, now); g.gain.exponentialRampToValueAtTime(.0001, now + dec * (.6 + Math.random() * .8))
    o.connect(g).connect(out); o.start(now); o.stop(now + dec * 1.5)
  }
  // golpe sordo de peso
  const th = ac.createOscillator(), tg = ac.createGain(); th.type = 'sine'; th.frequency.setValueAtTime(140, now); th.frequency.exponentialRampToValueAtTime(55, now + .12)
  tg.gain.setValueAtTime(.8, now); tg.gain.exponentialRampToValueAtTime(.0001, now + .16); th.connect(tg).connect(out); th.start(now); th.stop(now + .2)
}
for (const b of bars) b.body.addEventListener('collide', (e: { contact: CANNON.ContactEquation }) => {
  const v = Math.abs(e.contact.getImpactVelocityAlongNormal()); if (v > .6) clink(v)
})

/* ───────────────────────── interacción ───────────────────────── */
const ui = {
  bar: document.getElementById('progress') as HTMLElement,
  steps: [...document.querySelectorAll<HTMLElement>('[data-from]')],
  play: document.getElementById('play') as HTMLElement,
  reset: document.getElementById('reset') as HTMLButtonElement,
  sound: document.getElementById('sound') as HTMLButtonElement,
  count: document.getElementById('count') as HTMLElement,
}
let target = 0, prog = 0, interactive = false
const forced = new URLSearchParams(location.search).get('p')
const readScroll = () => { if (forced) { target = prog = +forced; return } const max = document.documentElement.scrollHeight - innerHeight; target = max > 0 ? clamp(scrollY / max) : 0 }
addEventListener('scroll', readScroll, { passive: true }); readScroll()

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
let down: { x: number; y: number; t: number } | null = null
addEventListener('pointerdown', e => { if ((e.target as HTMLElement).closest('button')) return; down = { x: e.clientX, y: e.clientY, t: performance.now() } })
addEventListener('pointerup', e => {
  if (!down) return; const d = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t; down = null
  if (d > 12 || dt > 600) return
  if (!ac) { try { ac = new AudioContext() } catch { /* sin audio */ } } else if (ac.state === 'suspended') ac.resume()
  if (!interactive) { if (prog > .5) scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }); return }
  knock(e.clientX, e.clientY)
})
const pointer = new THREE.Vector2()
addEventListener('pointermove', e => pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1))

const _m = new THREE.Matrix4(), _p = new THREE.Vector3(), _hit = new THREE.Vector3()
function blast(at: THREE.Vector3, dir: THREE.Vector3, power: number, radius: number, direct?: number) {
  for (let i = 0; i < bars.length; i++) {
    const b = bars[i].body, dx = b.position.x - at.x, dy = b.position.y - at.y, dz = b.position.z - at.z, dist = Math.hypot(dx, dy, dz)
    if (i !== direct && Math.hypot(dx, dz) < .75) b.wakeUp()
    if (i !== direct && dist > radius) continue
    b.wakeUp()
    const f = i === direct ? 1 : (1 - dist / radius) ** 1.5 * .55, k = power * f * b.mass
    const imp = new CANNON.Vec3(dir.x * k + dx / (dist + .05) * k * .5, Math.abs(dir.y) * k * .2 + k * .35, dir.z * k + dz / (dist + .05) * k * .5)
    const rel = new CANNON.Vec3(at.x - b.position.x, at.y - b.position.y, at.z - b.position.z)
    if (rel.length() > .2) rel.scale(.2 / rel.length(), rel)
    b.applyImpulse(imp, rel)
  }
}
function knock(x: number, y: number) {
  ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera)
  barMesh.computeBoundingSphere()
  const hit = ray.intersectObject(barMesh, false)[0]
  const dir = ray.ray.direction.clone(); dir.y = Math.max(dir.y, -.2); dir.normalize()
  if (hit && hit.instanceId !== undefined) { blast(hit.point, dir, 3.2, .38, hit.instanceId); ripple(x, y) }
  else if (ray.ray.intersectPlane(floorPlane, _hit) && _hit.z < -1) { blast(_hit, dir, 2.6, .55); ripple(x, y) }
}
function ripple(x: number, y: number) {
  const r = document.createElement('span'); r.className = 'ripple'; r.style.left = x + 'px'; r.style.top = y + 'px'
  document.body.appendChild(r); setTimeout(() => r.remove(), 700)
}
function resetBars() {
  for (const b of bars) { b.body.position.copy(b.home.p); b.body.quaternion.copy(b.home.q); b.body.velocity.setZero(); b.body.angularVelocity.setZero(); b.body.sleep() }
}
ui.reset.addEventListener('click', resetBars)
ui.sound.addEventListener('click', () => {
  muted = !muted; ui.sound.textContent = muted ? 'Sonido: no' : 'Sonido: sí'
  if (!ac && !muted) { try { ac = new AudioContext() } catch { /* */ } }
})

/* ───────────────────────── bucle ───────────────────────── */
function resize() {
  const w = innerWidth, h = innerHeight
  renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w / 2, h / 2); camera.aspect = w / h; camera.updateProjectionMatrix()
}
addEventListener('resize', resize); resize()

const clock = new THREE.Clock(), look = new THREE.Vector3(), parallax = new THREE.Vector2()
const dustPos = dust.geometry.attributes.position as THREE.BufferAttribute
function frame() {
  const dt = Math.min(clock.getDelta(), 1 / 20), t = clock.elapsedTime
  prog += (target - prog) * Math.min(1, dt * 5)
  const p = prog

  // combinación: derecha, izquierda, derecha
  const dA = range(p, .13, .2), dB = range(p, .2, .27), dC = range(p, .27, .31)
  dial.rotation.z = -ease(dA) * Math.PI * 2 * 2.37 + ease(dB) * Math.PI * 2 * 1.61 - ease(dC) * Math.PI * 2 * .44
  // manivela + cerrojos
  const w = ease(range(p, .32, .42)); wheel.rotation.z = -w * Math.PI * 1.25
  const gear = door.userData.gear as THREE.Group; gear.rotation.z = -w * Math.PI * .5
  const br = ease(range(p, .35, .43)); for (const b of bolts) { const a = b.userData.a as number, r = 1.0 - br * .2; b.position.x = Math.cos(a) * r; b.position.y = Math.sin(a) * r }
  // apertura
  const pop = smooth(range(p, .43, .46)), open = ease(range(p, .45, .64))
  door.position.z = -HINGE.z + pop * .06; doorPivot.rotation.y = open * 1.85
  const lit = smooth(range(p, .43, .6))
  inside.intensity = lit * 17; shelfLights.forEach(s => (s.intensity = lit * 9)); glow.intensity = lit * 4
  ;(dust.material as THREE.PointsMaterial).opacity = lit * .55
  scene.environmentIntensity = .55 - lit * .15
  key.intensity = 70 - smooth(range(p, .6, .85)) * 55
  bloom.strength = .25 + lit * .12

  // polvo
  for (let i = 0; i < dustPos.count; i++) {
    let y = dustPos.getY(i) + Math.sin(t * .3 + i) * .0006 + .0004; if (y > 3.1) y = 0
    dustPos.setY(i, y); dustPos.setX(i, dustPos.getX(i) + Math.cos(t * .2 + i * 1.3) * .0004)
  }
  dustPos.needsUpdate = true

  // cámara
  cameraAt(p)
  parallax.lerp(pointer, Math.min(1, dt * 3))
  const par = interactive ? .25 : .08
  camera.position.x += parallax.x * par; camera.position.y += parallax.y * par * .5
  look.copy(camTgt); camera.lookAt(look); camera.updateProjectionMatrix()

  // modo interactivo
  const nowInteractive = p > .87
  if (nowInteractive !== interactive) { interactive = nowInteractive; document.body.classList.toggle('interactive', interactive) }

  // física
  world.step(1 / 60, dt, 3)
  // despierta lingotes cercanos a los que se mueven (evita que queden flotando)
  for (let i = 0; i < bars.length; i++) {
    const m = bars[i].body; if (m.sleepState !== CANNON.Body.AWAKE || m.velocity.lengthSquared() < .04) continue
    for (let j = 0; j < bars.length; j++) { const o = bars[j].body; if (o.sleepState === CANNON.Body.SLEEPING && o.position.distanceTo(m.position) < .4) o.wakeUp() }
  }
  let fallen = 0
  for (let i = 0; i < bars.length; i++) {
    const b = bars[i].body
    _p.set(b.position.x, b.position.y, b.position.z)
    _m.compose(_p, new THREE.Quaternion(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w), new THREE.Vector3(1, 1, 1))
    barMesh.setMatrixAt(i, _m)
    if (b.position.distanceTo(bars[i].home.p) > .15) fallen++
    if (b.position.y < -2) { b.position.copy(bars[i].home.p); b.velocity.setZero(); b.sleep() }
  }
  barMesh.instanceMatrix.needsUpdate = true
  ui.count.textContent = `${fallen} / ${bars.length}`

  // interfaz
  ui.bar.style.transform = `scaleX(${p})`
  for (const s of ui.steps) {
    const a = +s.dataset.from!, b = +s.dataset.to!, o = Math.min(a === 0 ? 1 : smooth(range(p, a, a + .03)), 1 - smooth(range(p, b - .03, b)))
    s.style.opacity = String(b >= 1 ? smooth(range(p, a, a + .03)) : o); s.style.transform = `translateY(${(1 - o) * 14}px)`
    s.style.visibility = o > .01 || (b >= 1 && p > a) ? 'visible' : 'hidden'
  }
  composer.render()
  requestAnimationFrame(frame)
}
document.body.classList.add('ready')
requestAnimationFrame(frame)
