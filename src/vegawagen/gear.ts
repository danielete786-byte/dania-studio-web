import * as THREE from 'three'

const TAU = Math.PI * 2

// Engranaje recto: dientes trapezoidales con el diente 0 centrado en el ángulo 0.
// Radio primitivo = dientes · módulo / 2
export function gearGeometry(teeth: number, depth: number, module = 0.1, holes = teeth >= 16) {
  const rp = teeth * module / 2, ra = rp + module, rr = rp - 1.25 * module, P = TAU / teeth
  const s = new THREE.Shape(), pt = (r: number, a: number) => [Math.cos(a) * r, Math.sin(a) * r] as const
  for (let k = 0; k < teeth; k++) {
    const c = k * P
    const seq: [number, number][] = [[rr, c - 0.5 * P], [rr, c - 0.28 * P], [ra, c - 0.12 * P], [ra, c], [ra, c + 0.12 * P], [rr, c + 0.28 * P]]
    seq.forEach(([r, a], i) => { const [x, y] = pt(r, a); k === 0 && i === 0 ? s.moveTo(x, y) : s.lineTo(x, y) })
  }
  s.closePath()
  const bore = rp * 0.2, hole = new THREE.Path(); hole.absarc(0, 0, bore, 0, TAU, true); s.holes.push(hole)
  if (holes) {
    const n = 6, rc = (rr * 0.82 + bore * 1.6) / 2, rh = (rr * 0.82 - bore * 1.6) / 2 * 0.62
    for (let i = 0; i < n; i++) { const h = new THREE.Path(), a = i * TAU / n + P / 2; h.absarc(Math.cos(a) * rc, Math.sin(a) * rc, rh, 0, TAU, true); s.holes.push(h) }
  }
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.008, bevelSegments: 3, curveSegments: 40 }).translate(0, 0, -depth / 2)
}

// Fase para que dos engranajes engranen: rotB = θ + π − π/nB + (θ − rotA)·nA/nB
export const meshPhase = (th: number, rotA: number, nA: number, nB: number) => th + Math.PI - Math.PI / nB + (th - rotA) * nA / nB
