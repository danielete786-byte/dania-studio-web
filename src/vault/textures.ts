// Texturas PBR generadas en tiempo real (canvas): acero cepillado, hormigón, grabados de lingote,
// esfera de combinación, cajas de seguridad, madera y placa de latón. Todo procedural, sin descargas.
import * as THREE from 'three'

type Ctx = CanvasRenderingContext2D
const mk = (w: number, h: number): [HTMLCanvasElement, Ctx] => {
  const c = document.createElement('canvas'); c.width = w; c.height = h
  return [c, c.getContext('2d', { willReadFrequently: false })!]
}
export function rng(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const tex = (c: HTMLCanvasElement, srgb = false, aniso = 8) => {
  const t = new THREE.CanvasTexture(c); t.anisotropy = aniso
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.needsUpdate = true; return t
}

/** Ruido fractal barato: octavas de canvases diminutos ampliados con suavizado bilineal. */
function fbm(ctx: Ctx, w: number, h: number, r: () => number, base = 4, octaves = 7, gain = 0.55, lo = 0, hi = 255) {
  let amp = 1, total = 0
  for (let o = 0; o < octaves; o++) total += amp, amp *= gain
  amp = 1
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'
  for (let o = 0; o < octaves; o++) {
    const s = Math.max(2, Math.round(base * 2 ** o)), sh = Math.max(2, Math.round(s * h / w))
    const [sc, sx] = mk(s, sh), id = sx.createImageData(s, sh)
    for (let i = 0; i < id.data.length; i += 4) { const v = lo + r() * (hi - lo); id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255 }
    sx.putImageData(id, 0, 0)
    ctx.globalAlpha = o === 0 ? 1 : amp / total * 1.6
    ctx.drawImage(sc, 0, 0, w, h); amp *= gain
  }
  ctx.globalAlpha = 1
}

function speckle(ctx: Ctx, w: number, h: number, r: () => number, n: number, maxR: number, light: string, dark: string) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = r() < 0.5 ? light : dark; ctx.globalAlpha = 0.15 + r() * 0.5
    ctx.beginPath(); ctx.arc(r() * w, r() * h, 0.3 + r() * maxR, 0, 7); ctx.fill()
  }
  ctx.globalAlpha = 1
}

/** Hormigón: color, rugosidad y relieve. */
export function concrete(size: number, seed: number, tint = [128, 124, 118], dark = 1) {
  const r = rng(seed)
  const [h, hx] = mk(size, size); fbm(hx, size, size, r, 3, 8, 0.6, 70, 190)
  speckle(hx, size, size, r, size * 6, size / 900, '#ddd', '#222')
  // poros
  for (let i = 0; i < size * 0.8; i++) { hx.fillStyle = '#111'; hx.globalAlpha = 0.6; hx.beginPath(); hx.arc(r() * size, r() * size, 0.5 + r() * size / 700, 0, 7); hx.fill() }
  hx.globalAlpha = 1
  const [c, cx] = mk(size, size); cx.drawImage(h, 0, 0)
  cx.globalCompositeOperation = 'multiply'; cx.fillStyle = `rgb(${tint.map(v => v * dark | 0).join(',')})`; cx.fillRect(0, 0, size, size)
  // manchas de humedad
  cx.globalCompositeOperation = 'multiply'
  for (let i = 0; i < 14; i++) {
    const x = r() * size, y = r() * size, rad = size * (0.05 + r() * 0.2), g = cx.createRadialGradient(x, y, 0, x, y, rad)
    g.addColorStop(0, `rgba(90,85,78,${0.25 + r() * 0.25})`); g.addColorStop(1, 'rgba(255,255,255,0)'); cx.fillStyle = g; cx.fillRect(0, 0, size, size)
  }
  cx.globalCompositeOperation = 'source-over'
  const [ro, rx] = mk(size, size); fbm(rx, size, size, r, 4, 7, 0.55, 150, 255)
  return { map: tex(c, true), bump: tex(h), rough: tex(ro) }
}

/** Hormigón pulido / epoxi para el suelo interior. */
export function polishedFloor(size: number, seed: number) {
  const r = rng(seed)
  const [c, cx] = mk(size, size); fbm(cx, size, size, r, 3, 8, 0.6, 35, 75)
  speckle(cx, size, size, r, size * 10, size / 1400, '#9a958c', '#0d0d0d')
  // juntas de dilatación
  cx.strokeStyle = 'rgba(0,0,0,.65)'; cx.lineWidth = size / 900
  for (let i = 1; i < 4; i++) { cx.beginPath(); cx.moveTo(i * size / 4, 0); cx.lineTo(i * size / 4, size); cx.moveTo(0, i * size / 4); cx.lineTo(size, i * size / 4); cx.stroke() }
  const [ro, rx] = mk(size, size); fbm(rx, size, size, r, 2, 7, 0.65, 40, 170)
  // huellas de pulido (arcos)
  rx.strokeStyle = 'rgba(255,255,255,.05)'
  for (let i = 0; i < 300; i++) { rx.lineWidth = 1 + r() * 6; rx.beginPath(); rx.arc(r() * size, r() * size, 20 + r() * size / 4, r() * 6, r() * 6 + 1.5); rx.stroke() }
  return { map: tex(c, true), rough: tex(ro) }
}

/** Acero cepillado: líneas horizontales (a lo largo de U). */
export function brushed(w: number, h: number, seed: number, lo = 70, hi = 150, lines = 5000) {
  const r = rng(seed)
  const [c, cx] = mk(w, h); cx.fillStyle = `rgb(${(lo + hi) / 2},${(lo + hi) / 2},${(lo + hi) / 2})`; cx.fillRect(0, 0, w, h)
  for (let i = 0; i < lines; i++) {
    const v = lo + r() * (hi - lo), y = r() * h, x = r() * w, len = w * (0.05 + r() * 0.6)
    cx.strokeStyle = `rgba(${v},${v},${v},${0.15 + r() * 0.35})`; cx.lineWidth = 0.5 + r() * 1.5
    cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + len, y); cx.moveTo(x - w, y); cx.lineTo(x - w + len, y); cx.stroke()
  }
  // arañazos y huellas
  for (let i = 0; i < 40; i++) {
    cx.strokeStyle = `rgba(${r() < .5 ? 255 : 30},${r() < .5 ? 255 : 30},${r() < .5 ? 255 : 30},.12)`; cx.lineWidth = 0.7
    const x = r() * w, y = r() * h; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + (r() - .5) * w * .2, y + (r() - .5) * h * .4); cx.stroke()
  }
  for (let i = 0; i < 25; i++) {
    const x = r() * w, y = r() * h, rad = 20 + r() * 80, g = cx.createRadialGradient(x, y, 0, x, y, rad)
    g.addColorStop(0, 'rgba(255,255,255,.09)'); g.addColorStop(1, 'rgba(255,255,255,0)'); cx.fillStyle = g; cx.fillRect(x - rad, y - rad, rad * 2, rad * 2)
  }
  return tex(c)
}

/** Lingote: mapas de relieve (grabado) y rugosidad para la cara superior. */
export function barStamp(serial: number) {
  const W = 1024, H = 352, r = rng(serial)
  const [b, bx] = mk(W, H), [ro, rx] = mk(W, H)
  bx.fillStyle = '#808080'; bx.fillRect(0, 0, W, H)
  // ondulaciones de fundición en la superficie
  bx.globalAlpha = 0.25; fbm(bx, W, H, r, 6, 5, 0.5, 100, 156); bx.globalAlpha = 1
  // margen plano para que los laterales no recojan detalle
  bx.strokeStyle = '#808080'; bx.lineWidth = 60; bx.strokeRect(0, 0, W, H)
  rx.fillStyle = '#3a3a3a'; rx.fillRect(0, 0, W, H)
  rx.globalAlpha = 0.5; fbm(rx, W, H, r, 5, 6, 0.6, 30, 110); rx.globalAlpha = 1
  // huellas dactilares/manchas
  for (let i = 0; i < 6; i++) {
    const x = 100 + r() * (W - 200), y = 60 + r() * (H - 120), rad = 25 + r() * 35
    rx.strokeStyle = 'rgba(140,140,140,.35)'; rx.lineWidth = 1.5
    for (let k = 4; k < rad; k += 4) { rx.beginPath(); rx.ellipse(x, y, k, k * 0.75, r(), 0, 6.3); rx.stroke() }
  }
  rx.strokeStyle = '#3a3a3a'; rx.lineWidth = 60; rx.strokeRect(0, 0, W, H)
  const ink = (ctx: Ctx, fill: string) => {
    ctx.fillStyle = fill; ctx.strokeStyle = fill; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.lineWidth = 6; const x0 = 150, y0 = 70, w = W - 300, h = H - 140, rr = 22
    ctx.beginPath(); ctx.moveTo(x0 + rr, y0); ctx.arcTo(x0 + w, y0, x0 + w, y0 + h, rr); ctx.arcTo(x0 + w, y0 + h, x0, y0 + h, rr)
    ctx.arcTo(x0, y0 + h, x0, y0, rr); ctx.arcTo(x0, y0, x0 + w, y0, rr); ctx.closePath(); ctx.stroke()
    ctx.font = '600 44px Georgia, serif'; ctx.fillText('FINE GOLD', W / 2, 118)
    ctx.font = '700 92px Georgia, serif'; ctx.fillText('999.9', W / 2, 190)
    ctx.font = '500 30px Georgia, serif'; ctx.fillText('DANIA · REFINERÍA · 1 KG', W / 2, 252)
    ctx.font = '500 26px Courier New, monospace'; ctx.fillText('Nº ' + String(100000 + serial * 7919 % 899999), W / 2, 300 - 8)
    // sello circular
    ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(225, H / 2, 46, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(225, H / 2, 34, 0, 7); ctx.stroke()
    ctx.font = '700 36px Georgia, serif'; ctx.fillText('D', 225, H / 2 + 2)
    ctx.beginPath(); ctx.arc(W - 225, H / 2, 46, 0, 7); ctx.stroke(); ctx.font = '700 22px Georgia, serif'; ctx.fillText('AU', W - 225, H / 2 + 1)
  }
  ink(bx, '#2a2a2a'); ink(rx, '#a0a0a0')
  bx.filter = 'blur(1.2px)'; bx.drawImage(b, 0, 0); bx.filter = 'none'
  return { bump: tex(b, false, 16), rough: tex(ro, false, 16) }
}

/** Esfera de la combinación (0–99). */
export function dialFace() {
  const S = 1024, [c, cx] = mk(S, S), m = S / 2
  const g = cx.createRadialGradient(m, m * 0.8, 10, m, m, m); g.addColorStop(0, '#26282c'); g.addColorStop(1, '#0b0c0e')
  cx.fillStyle = g; cx.fillRect(0, 0, S, S)
  // cepillado radial sutil
  const r = rng(9); cx.strokeStyle = 'rgba(255,255,255,.035)'
  for (let i = 0; i < 1400; i++) { const a = r() * 6.283, r0 = 120 + r() * 280; cx.lineWidth = r() * 1.5; cx.beginPath(); cx.arc(m, m, r0, a, a + 0.2 + r()); cx.stroke() }
  cx.fillStyle = '#e9e4d8'; cx.strokeStyle = '#e9e4d8'; cx.textAlign = 'center'; cx.textBaseline = 'middle'
  for (let i = 0; i < 100; i++) {
    const a = i / 100 * Math.PI * 2 - Math.PI / 2, long = i % 10 === 0, mid = i % 5 === 0
    const r1 = 492, r2 = long ? 420 : mid ? 445 : 462
    cx.lineWidth = long ? 7 : 4; cx.beginPath(); cx.moveTo(m + Math.cos(a) * r1, m + Math.sin(a) * r1); cx.lineTo(m + Math.cos(a) * r2, m + Math.sin(a) * r2); cx.stroke()
    if (long) { cx.save(); cx.translate(m + Math.cos(a) * 365, m + Math.sin(a) * 365); cx.rotate(a + Math.PI / 2); cx.font = '600 58px Inter, Arial, sans-serif'; cx.fillText(String(i), 0, 0); cx.restore() }
  }
  cx.strokeStyle = 'rgba(233,228,216,.5)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(m, m, 300, 0, 7); cx.stroke()
  cx.font = '500 34px Inter, Arial, sans-serif'; cx.fillStyle = 'rgba(233,228,216,.7)'; cx.fillText('DANIA · SAFE CO.', m, m + 230)
  return tex(c, true, 16)
}

/** Placa de latón con letras en relieve. */
export function nameplate() {
  const W = 1024, H = 200, [c, cx] = mk(W, H), [b, bx] = mk(W, H)
  const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#7a5a1c'); g.addColorStop(.5, '#4a3511'); g.addColorStop(1, '#6e5018')
  cx.fillStyle = g; cx.fillRect(0, 0, W, H); bx.fillStyle = '#404040'; bx.fillRect(0, 0, W, H)
  for (const [ctx, col] of [[cx, '#e0b860'], [bx, '#ffffff']] as const) {
    ctx.fillStyle = col; ctx.strokeStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.lineWidth = 6; ctx.strokeRect(18, 18, W - 36, H - 36)
    ctx.font = '600 70px Georgia, serif'; ctx.fillText('DANIA  STUDIO', W / 2, 88)
    ctx.font = '500 28px Georgia, serif'; ctx.fillText('SAFE  &  VAULT  ·  MADRID  ·  MCMXXIV', W / 2, 148)
  }
  bx.filter = 'blur(1.5px)'; bx.drawImage(b, 0, 0); bx.filter = 'none'
  return { map: tex(c, true, 16), bump: tex(b, false, 16) }
}

/** Pared de cajas de seguridad. */
export function depositBoxes(seed: number) {
  const W = 2048, H = 1024, cols = 22, rows = 10, r = rng(seed)
  const [c, cx] = mk(W, H), [b, bx] = mk(W, H)
  cx.fillStyle = '#9a9a96'; cx.fillRect(0, 0, W, H); bx.fillStyle = '#7a7a7a'; bx.fillRect(0, 0, W, H)
  const cw = W / cols, ch = H / rows
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const x = i * cw, y = j * ch, tone = 140 + r() * 30
    cx.fillStyle = `rgb(${tone},${tone - 2},${tone - 6})`; cx.fillRect(x + 4, y + 4, cw - 8, ch - 8)
    bx.fillStyle = '#909090'; bx.fillRect(x + 5, y + 5, cw - 10, ch - 10)
    bx.fillStyle = '#202020'; bx.fillRect(x, y, cw, 4); bx.fillRect(x, y, 4, ch)
    cx.fillStyle = 'rgba(0,0,0,.55)'; cx.fillRect(x, y, cw, 3); cx.fillRect(x, y, 3, ch)
    cx.fillStyle = 'rgba(255,255,255,.35)'; cx.fillRect(x + 4, y + 4, cw - 8, 2)
    // cerraduras dobles
    for (const k of [-.18, .18]) {
      const kx = x + cw / 2 + k * cw, ky = y + ch * .58
      cx.fillStyle = '#c9a75a'; cx.beginPath(); cx.arc(kx, ky, 9, 0, 7); cx.fill()
      cx.fillStyle = '#2a1d08'; cx.fillRect(kx - 1.5, ky - 6, 3, 12)
      bx.fillStyle = '#c0c0c0'; bx.beginPath(); bx.arc(kx, ky, 9, 0, 7); bx.fill(); bx.fillStyle = '#303030'; bx.fillRect(kx - 1.5, ky - 6, 3, 12)
    }
    // placa con número
    cx.fillStyle = '#d8d2c0'; cx.fillRect(x + cw / 2 - 22, y + ch * .2, 44, 18)
    cx.fillStyle = '#222'; cx.font = '600 13px Arial'; cx.textAlign = 'center'; cx.textBaseline = 'middle'
    cx.fillText(String(seed * 1000 + i * rows + j + 1), x + cw / 2, y + ch * .2 + 9)
    bx.fillStyle = '#a8a8a8'; bx.fillRect(x + cw / 2 - 22, y + ch * .2, 44, 18)
  }
  bx.filter = 'blur(1px)'; bx.drawImage(b, 0, 0); bx.filter = 'none'
  return { map: tex(c, true, 8), bump: tex(b, false, 8) }
}

/** Madera de palé. */
export function wood(seed: number) {
  const W = 512, H = 128, r = rng(seed), [c, cx] = mk(W, H)
  cx.fillStyle = '#9b7a52'; cx.fillRect(0, 0, W, H)
  for (let i = 0; i < 220; i++) {
    const y = r() * H, v = r()
    cx.strokeStyle = v < .5 ? `rgba(70,45,22,${.15 + r() * .3})` : `rgba(210,180,130,${.1 + r() * .2})`; cx.lineWidth = .5 + r() * 2.5
    cx.beginPath(); cx.moveTo(0, y); for (let x = 0; x <= W; x += 32) cx.lineTo(x, y + Math.sin(x * .01 + i) * 3 * r()); cx.stroke()
  }
  for (let i = 0; i < 3; i++) { const x = r() * W, y = r() * H; cx.fillStyle = 'rgba(60,35,15,.55)'; cx.beginPath(); cx.ellipse(x, y, 10 + r() * 8, 5 + r() * 4, 0, 0, 7); cx.fill() }
  return tex(c, true, 4)
}

/** Sprite suave para el polvo en suspensión. */
export function dot() {
  const [c, cx] = mk(64, 64), g = cx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)')
  cx.fillStyle = g; cx.fillRect(0, 0, 64, 64); return tex(c, true)
}
