// Entorno de estudio fotográfico generado por código: sala negra con un softbox cenital,
// dos tiras de luz laterales, un contraluz y un softbox frontal cálido. Da al cromo y al plástico
// los reflejos alargados típicos de una sesión de producto (sin descargar ningún HDRI).
import * as THREE from 'three'

export function studioEnvironment(renderer: THREE.WebGLRenderer, strength = 1) {
  const scene = new THREE.Scene()
  scene.add(new THREE.Mesh(new THREE.BoxGeometry(24, 14, 24), new THREE.MeshBasicMaterial({ color: 0x26282e, side: THREE.BackSide })))
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), new THREE.MeshBasicMaterial({ color: 0x2a2b30 }))
  floor.rotation.x = -Math.PI / 2; floor.position.y = -4; scene.add(floor)
  const panel = (w: number, h: number, pos: [number, number, number], power: number, color = 0xffffff) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power * strength), side: THREE.DoubleSide }))
    m.position.set(...pos); m.lookAt(0, 0, 0); scene.add(m)
  }
  panel(14, 7, [0, 6.8, 1], 2.6)                // softbox cenital grande
  panel(1.6, 9, [-7.5, 1, 2], 5)                 // tira izquierda
  panel(1.6, 9, [7.5, 1, 2], 5)                  // tira derecha
  panel(8, 1.2, [0, 2.5, -9], 3, 0xdbe6f5)       // contraluz frío
  panel(11, 5.5, [0, 1.5, 10], 1.6, 0xfff4e6)    // softbox frontal grande (detrás de la cámara)
  panel(3, 3, [5, 4, 8], 2.2, 0xffffff)          // brillo de acento
  const pm = new THREE.PMREMGenerator(renderer)
  const tex = pm.fromScene(scene, 0.035).texture
  pm.dispose(); scene.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose() } })
  return tex
}
