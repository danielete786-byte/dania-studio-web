// Efectos de sonido sintetizados con Web Audio (sin archivos): clics metálicos, carraca, tintineo,
// golpe de tapa, cierres y zumbido de neón. Empieza en silencio; se activa con el botón de sonido.
type Listener = (on: boolean) => void
let ctx: AudioContext | null = null, master: GainNode | null = null, on = false, last = 0, noiseBuf: AudioBuffer | null = null
const listeners = new Set<Listener>()

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination)
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return ctx
}
// limita la cantidad de sonidos al hacer scroll rápido
const allow = (gap = 0.028) => { if (!on || !ctx) return false; const t = ctx.currentTime; if (t - last < gap) return false; last = t; return true }

function noise(t: number, dur: number, freq: number, q: number, gain: number, type: BiquadFilterType = 'bandpass') {
  const c = ctx!, src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain()
  src.buffer = noiseBuf; f.type = type; f.frequency.value = freq; f.Q.value = q
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(master!); src.start(t); src.stop(t + dur + 0.02)
}
function tone(t: number, freq: number, dur: number, gain: number, type: OscillatorType = 'sine', slide = 1) {
  const c = ctx!, o = c.createOscillator(), g = c.createGain()
  o.type = type; o.frequency.setValueAtTime(freq, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur)
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(master!); o.start(t); o.stop(t + dur + 0.02)
}

export const sound = {
  get on() { return on },
  subscribe(fn: Listener) { listeners.add(fn); return () => { listeners.delete(fn) } },
  async toggle() {
    on = !on
    if (on) { const c = ensure(); await c.resume(); sound.click(1, 1.1) }
    listeners.forEach(f => f(on))
  },
  /** clic metálico al encajar una pieza */
  click(strength = 1, pitch = 1) {
    if (!allow()) return; const t = ctx!.currentTime
    noise(t, 0.035, 3200 * pitch, 9, 0.5 * strength); tone(t, 1900 * pitch, 0.07, 0.12 * strength, 'triangle', 0.7)
  },
  /** diente de carraca (tornillos) */
  tick(pitch = 1) { if (!allow(0.022)) return; const t = ctx!.currentTime; noise(t, 0.018, 4200 * pitch, 12, 0.22) },
  /** tintineo de una pieza al caer en su compartimento */
  clink(pitch = 1) {
    if (!allow(0.035)) return; const t = ctx!.currentTime, f = 1250 * pitch
    tone(t, f, 0.28, 0.08); tone(t, f * 2.76, 0.18, 0.04); tone(t, f * 5.4, 0.1, 0.02); noise(t, 0.02, 6000, 4, 0.12)
  },
  /** golpe sordo (tapa que se cierra, carcasa) */
  clunk(strength = 1) {
    if (!allow(0.05)) return; const t = ctx!.currentTime
    tone(t, 95, 0.3, 0.45 * strength, 'sine', 0.6); noise(t, 0.09, 420, 1.2, 0.5 * strength, 'lowpass')
  },
  /** cierre metálico: dos chasquidos */
  latch() {
    if (!on || !ctx) return; const t = ctx.currentTime; last = t + 0.12
    noise(t, 0.03, 2600, 7, 0.55); tone(t, 1500, 0.05, 0.1, 'triangle')
    noise(t + 0.085, 0.04, 3400, 9, 0.6); tone(t + 0.085, 2100, 0.06, 0.12, 'triangle', 0.8)
  },
  /** zumbido corto del neón al encenderse */
  neon() {
    if (!on || !ctx) return; const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain()
    o.type = 'sawtooth'; o.frequency.value = 100
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900
    g.gain.setValueAtTime(0.0001, t)
    for (let i = 0; i < 5; i++) { g.gain.setValueAtTime(i % 2 ? 0.0001 : 0.05, t + i * 0.06) }
    g.gain.setValueAtTime(0.035, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
    o.connect(f).connect(g).connect(master!); o.start(t); o.stop(t + 0.95)
  },
}
