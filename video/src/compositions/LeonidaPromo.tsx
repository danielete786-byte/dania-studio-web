import React from 'react'
import { AbsoluteFill, Audio, Img, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { loadFont } from '@remotion/fonts'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { slide } from '@remotion/transitions/slide'
import { wipe } from '@remotion/transitions/wipe'
import { fade } from '@remotion/transitions/fade'
import { z } from 'zod'
import { sp, tween, ease } from '../lib/motion'

/* Identidad de Leonida Wire (igual que la web) */
loadFont({ family: 'Anton', url: staticFile('fonts/anton.woff2'), weight: '400' })
loadFont({ family: 'Instrument Serif', url: staticFile('fonts/instrument-serif-italic.woff2'), weight: '400', style: 'italic' })
loadFont({ family: 'Space Grotesk', url: staticFile('fonts/space-grotesk.woff2'), weight: '300 700' })
loadFont({ family: 'Space Mono', url: staticFile('fonts/space-mono-700.woff2'), weight: '700' })
const c = { night: '#150a24', night2: '#21103a', sand: '#fff1e0', pink: '#ff3f8e', sun: '#ffa23f', teal: '#19d3c5', ink: '#1b0f2c', muted: '#c9b3d6' }
const F = { display: 'Anton, Impact, sans-serif', serif: '"Instrument Serif", Georgia, serif', body: '"Space Grotesk", Arial, sans-serif', mono: '"Space Mono", monospace' }

export const leonidaPromoSchema = z.object({
  url: z.string(),
  shortUrl: z.string(),
  sources: z.array(z.string()),
})
type Props = z.infer<typeof leonidaPromoSchema>
export const leonidaDefaults: Props = {
  url: 'https://danielete786-byte.github.io/dania-studio-web/leonida/',
  shortUrl: 'danielete786-byte.github.io/dania-studio-web/leonida',
  sources: ['Rockstar Newswire', 'IGN', 'Vandal', '3DJuegos', 'Eurogamer', 'GameSpot', 'VGC', 'GamesRadar+', 'TechRadar', 'Polygon'],
}
// 120 BPM -> 1 tiempo = 15 frames. Escenas en múltiplos de 2 tiempos.
const SC = [90, 90, 150, 90, 90, 90, 120]
const T = 12
export const LEONIDA_PROMO_DURATION = SC.reduce((a, b) => a + b, 0) - (SC.length - 1) * T

/* ---------- piezas ---------- */
const Grain: React.FC = () => {
  const f = useCurrentFrame(); const seed = Math.floor(f / 2) % 8
  return (
    <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="100%" height="100%"><filter id={`lg${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} /></filter><rect width="100%" height="100%" filter={`url(#lg${seed})`} /></svg>
    </AbsoluteFill>
  )
}

const palmPath = (x: number, base: number, h: number, lean: number, sway: number) => {
  const tx = x + lean * h + sway, ty = base - h
  let d = `M${x} ${base} Q${x + lean * h * 0.2} ${base - h * 0.55} ${tx} ${ty}`
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI + (i / 8) * Math.PI + sway * 0.004
    const len = 120 + (i % 3) * 34
    const ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len * 0.55 + len * 0.35
    d += ` M${tx} ${ty} Q${tx + Math.cos(a) * len * 0.6} ${ty + Math.sin(a) * len * 0.6 - 30} ${ex} ${ey}`
  }
  return d
}

/** Atardecer de Leonida (versión vídeo del momento firma de la web). */
const Sunset: React.FC<{ sunY?: number; night?: number }> = ({ sunY = 0, night = 0 }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig()
  const hz = H * 0.62, r = 230, sy = hz - 70 + sunY
  const mix = (a: string, b: string) => interpolate(night, [0, 1], [0, 1]) > 0.5 ? b : a
  const sway = Math.sin(f / 22) * 14
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix('#3a145e', '#0c051a')} /><stop offset="0.62" stopColor={mix('#ff3f8e', '#46125a')} /><stop offset="1" stopColor={mix('#ffa23f', '#be2878')} /></linearGradient>
          <linearGradient id="sunG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe08a" /><stop offset="1" stopColor="#ff3f8e" /></linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#19a0aa" /><stop offset="1" stopColor={c.night} /></linearGradient>
          <clipPath id="above"><rect x="0" y="0" width={W} height={hz} /></clipPath>
          <filter id="glow"><feGaussianBlur stdDeviation="30" /></filter>
        </defs>
        <rect width={W} height={hz} fill="url(#sky)" />
        <g clipPath="url(#above)">
          <circle cx={W / 2} cy={sy} r={r + 40} fill="#ffa23f" opacity={0.5} filter="url(#glow)" />
          <circle cx={W / 2} cy={sy} r={r} fill="url(#sunG)" />
          {Array.from({ length: 7 }, (_, i) => <rect key={i} x={W / 2 - r} y={sy + r * 0.1 + i * r * 0.14 - ((f * 0.6) % (r * 0.14))} width={r * 2} height={3 + i * 2.2} fill="#ffa23f" />)}
        </g>
        <rect y={hz} width={W} height={H - hz} fill="url(#sea)" />
        {Array.from({ length: 22 }, (_, i) => {
          const yy = hz + 6 + i * i * 1.6; const w = r * (1.7 - i * 0.06) + Math.sin(f / 8 + i) * 22
          return <rect key={i} x={W / 2 - w / 2 + Math.sin(f / 15 + i) * 12} y={yy} width={w} height={3} fill="#ffc79a" opacity={0.6 - i * 0.025} />
        })}
        <g stroke="#12061f" fill="none" strokeLinecap="round">
          {[{ x: 70, h: 760, l: -0.12, s: 1 }, { x: 230, h: 560, l: 0.12, s: 0.8 }, { x: 980, h: 820, l: 0.14, s: 1.1 }, { x: 860, h: 480, l: -0.05, s: 0.7 }].map((p, i) => (
            <path key={i} d={palmPath(p.x, H + 20, p.h, p.l, sway * p.s)} strokeWidth={9 * p.s} />
          ))}
        </g>
      </svg>
      <AbsoluteFill style={{ background: `linear-gradient(0deg, ${c.night}f2 0%, ${c.night}80 30%, transparent 60%)` }} />
    </AbsoluteFill>
  )
}

const Mask: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({ children, delay = 0, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = sp(f, fps, delay, 'snappy')
  return <span style={{ display: 'block', overflow: 'hidden', paddingTop: '0.14em', marginTop: '-0.14em', paddingBottom: '0.06em', ...style }}><span style={{ display: 'block', transform: `translateY(${(1 - s) * 110}%) rotate(${(1 - s) * 4}deg)` }}>{children}</span></span>
}

const Label: React.FC<{ children: React.ReactNode; delay?: number; color?: string }> = ({ children, delay = 0, color = c.sand }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = sp(f, fps, delay, 'smooth')
  return <div style={{ font: `700 24px ${F.mono}`, letterSpacing: '0.14em', textTransform: 'uppercase', color, opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>{children}</div>
}

/** Marco de navegador con la web real dentro. */
const Browser: React.FC<{ shots: string[]; switchAt?: number; scroll?: [number, number]; delay?: number; url: string; tilt?: number }> = ({ shots, switchAt = 999, scroll = [0, 0], delay = 0, url, tilt = 1 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig()
  const s = sp(f, fps, delay, 'heavy')
  const y = tween(f, [delay + 10, delay + 120], scroll, ease.inOutCubic)
  const idx = f >= switchAt ? 1 : 0
  const cross = interpolate(f, [switchAt - 6, switchAt + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return (
    <div style={{ width: 960, borderRadius: 26, overflow: 'hidden', background: c.night2, boxShadow: `0 60px 120px rgba(0,0,0,.55), 0 0 0 2px ${c.pink}55, 0 0 80px ${c.pink}33`,
      transform: `perspective(1800px) rotateX(${(1 - s) * 30 * tilt + 6 * tilt}deg) rotateY(${(1 - s) * -18 * tilt}deg) translateY(${(1 - s) * 400}px) scale(${0.85 + s * 0.15})`, opacity: Math.min(1, s * 1.6) }}>
      <div style={{ height: 58, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', background: '#0f0719' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((col) => <span key={col} style={{ width: 14, height: 14, borderRadius: 7, background: col }} />)}
        <div style={{ marginLeft: 16, flex: 1, height: 34, borderRadius: 17, background: '#1f1230', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', font: `500 19px ${F.body}`, color: c.muted, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <span style={{ color: c.teal }}>🔒</span>{url}
        </div>
      </div>
      <div style={{ position: 'relative', height: 640, overflow: 'hidden' }}>
        {shots.map((src, i) => (
          <Img key={src} src={staticFile(src)} style={{ position: 'absolute', left: 0, top: 0, width: 960, transform: `translateY(${-y}px)`, opacity: i === 0 ? 1 - cross * (idx === 1 ? 1 : 0) : cross }} />
        ))}
      </div>
    </div>
  )
}

/* ---------- escenas ---------- */
const S1Hook: React.FC = () => {
  const f = useCurrentFrame()
  const push = interpolate(f, [0, 90], [1.12, 1])
  return (
    <AbsoluteFill style={{ backgroundColor: c.night }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}><Sunset sunY={tween(f, [0, 90], [120, 0])} /></AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 70px 120px' }}>
        <div style={{ alignSelf: 'flex-start', background: `${c.night}d9`, padding: '12px 18px', borderRadius: 12 }}><Label delay={4} color={c.sun}>Fan site de GTA VI</Label></div>
        <div style={{ font: `400 150px/0.9 ${F.display}`, color: c.sand, textTransform: 'uppercase', marginTop: 18 }}>
          <Mask delay={6}>¿Qué ha</Mask><Mask delay={11}>pasado hoy</Mask><Mask delay={16}>en Leonida?</Mask>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

const S2Brand: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig()
  const letters = 'LEONIDA'.split(''), w2 = 'WIRE'.split('')
  const flash = interpolate(f, [0, 3, 12], [0.7, 0.4, 0], { extrapolateRight: 'clamp' })
  const L = (ch: string, i: number, d: number, col: string) => { const s = sp(f, fps, d + i * 2, 'bouncy'); return <span key={i + ch + d} style={{ display: 'inline-block', color: col, transform: `translateY(${(1 - s) * -160}px) scale(${0.6 + s * 0.4})`, opacity: Math.min(1, s * 2) }}>{ch}</span> }
  return (
    <AbsoluteFill style={{ backgroundColor: c.night, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ opacity: 0.35 }}><Sunset night={1} sunY={200} /></AbsoluteFill>
      <div style={{ textAlign: 'center' }}>
        <div style={{ font: `400 230px/0.86 ${F.display}`, letterSpacing: '0.01em' }}>{letters.map((ch, i) => L(ch, i, 2, c.sand))}</div>
        <div style={{ font: `400 230px/0.86 ${F.display}`, textShadow: `0 0 60px ${c.pink}` }}>{w2.map((ch, i) => L(ch, i, 14, c.pink))}</div>
        <div style={{ marginTop: 30, font: `italic 400 66px ${F.serif}`, color: c.sun, opacity: sp(f, fps, 30), transform: `translateY(${(1 - sp(f, fps, 30)) * 30}px)` }}>todas las noticias de GTA VI</div>
        <div style={{ marginTop: 22 }}><Label delay={40} color={c.muted}>Fan site · gratis · en español</Label></div>
      </div>
      <AbsoluteFill style={{ background: '#fff', opacity: flash, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  )
}

const S3Site: React.FC<{ p: Props }> = ({ p }) => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ backgroundColor: c.night, alignItems: 'center', paddingTop: 110, gap: 50 }}>
      <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 60%, ${c.pink}40, transparent 70%)` }} />
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <Label delay={2} color={c.teal}>La web</Label>
        <div style={{ font: `400 104px/0.92 ${F.display}`, color: c.sand, textTransform: 'uppercase', marginTop: 12 }}>
          <Mask delay={4}>Las noticias del día</Mask><Mask delay={9} style={{ color: c.sun }}>con su fuente</Mask>
        </div>
      </div>
      <div style={{ zIndex: 1, transform: `translateY(${interpolate(f, [0, 150], [10, -10])}px)` }}>
        <Browser shots={['leonida/hero.png', 'leonida/news.png']} switchAt={62} scroll={[0, 0]} delay={8} url={p.shortUrl} />
      </div>
    </AbsoluteFill>
  )
}

const S4Daily: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig()
  const s = sp(f, fps, 6, 'bouncy')
  const minute = Math.min(47, Math.floor(tween(f, [10, 50], [0, 47])))
  const days = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
  return (
    <AbsoluteFill style={{ backgroundColor: c.night, justifyContent: 'center', alignItems: 'center', gap: 44 }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 45% at 50% 45%, ${c.teal}33, transparent 70%)` }} />
      <Label delay={0} color={c.teal}>Se actualiza sola</Label>
      <div style={{ font: `400 300px/0.85 ${F.display}`, color: c.teal, textShadow: `0 0 70px ${c.teal}88`, transform: `scale(${0.6 + s * 0.4})`, fontVariantNumeric: 'tabular-nums' }}>08:{String(minute).padStart(2, '0')}</div>
      <div style={{ font: `400 96px/0.95 ${F.display}`, color: c.sand, textTransform: 'uppercase', textAlign: 'center' }}><Mask delay={14}>Noticias nuevas</Mask><Mask delay={19}>cada mañana</Mask></div>
      <div style={{ display: 'flex', gap: 14 }}>
        {days.map((d, i) => { const k = sp(f, fps, 30 + i * 4, 'snappy'); return (
          <div key={d} style={{ width: 104, height: 104, borderRadius: 22, border: `3px solid ${c.teal}`, background: k > 0.5 ? `${c.teal}26` : 'transparent', display: 'grid', placeItems: 'center', font: `700 22px ${F.mono}`, color: c.sand, transform: `scale(${0.5 + k * 0.5})`, opacity: k }}>
            <span>{d}<br /><span style={{ color: c.teal, fontSize: 30 }}>✓</span></span>
          </div>) })}
      </div>
    </AbsoluteFill>
  )
}

const S5Sources: React.FC<{ p: Props }> = ({ p }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig()
  return (
    <AbsoluteFill style={{ backgroundColor: c.night, justifyContent: 'center', padding: '0 70px', gap: 40 }}>
      <Label delay={0} color={c.pink}>Cero rumores</Label>
      <div style={{ font: `400 118px/0.9 ${F.display}`, color: c.sand, textTransform: 'uppercase' }}><Mask delay={3}>Solo fuentes</Mask><Mask delay={8} style={{ color: c.pink }}>de confianza</Mask></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {p.sources.map((s, i) => { const k = sp(f, fps, 16 + i * 3, 'bouncy'); const rot = (random('r' + i) - 0.5) * 6; return (
          <span key={s} style={{ font: `600 38px ${F.body}`, color: c.ink, background: i % 3 === 0 ? c.sun : i % 3 === 1 ? c.sand : c.teal, padding: '16px 28px', borderRadius: 999, transform: `translateY(${(1 - k) * 120}px) rotate(${rot * (1 - k) * 3 + rot * 0.3}deg) scale(${0.6 + k * 0.4})`, opacity: Math.min(1, k * 1.5) }}>{s}</span>) })}
      </div>
      <div style={{ font: `400 36px/1.35 ${F.body}`, color: c.muted, opacity: sp(f, fps, 50), maxWidth: 880 }}>Cada noticia enlaza a su fuente original. Sin filtraciones, sin foros, sin cebos.</div>
    </AbsoluteFill>
  )
}

const S6Videos: React.FC<{ p: Props }> = ({ p }) => (
  <AbsoluteFill style={{ backgroundColor: c.ink, alignItems: 'center', paddingTop: 110, gap: 50 }}>
    <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 65%, ${c.sun}40, transparent 70%)` }} />
    <div style={{ textAlign: 'center', zIndex: 1 }}>
      <Label delay={2} color={c.sun}>Cine en Vice City</Label>
      <div style={{ font: `400 104px/0.92 ${F.display}`, color: c.sand, textTransform: 'uppercase', marginTop: 12 }}><Mask delay={4}>Todos los tráilers</Mask><Mask delay={9} style={{ color: c.sun }}>oficiales</Mask></div>
    </div>
    <div style={{ zIndex: 1 }}><Browser shots={['leonida/videos.png']} scroll={[0, 220]} delay={6} url={p.shortUrl} tilt={-1} /></div>
  </AbsoluteFill>
)

const S7Cta: React.FC<{ p: Props }> = ({ p }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig()
  const b = sp(f, fps, 22, 'bouncy'); const pulse = 1 + Math.max(0, Math.sin((f - 40) / 6)) * 0.035 * (f > 40 ? 1 : 0)
  return (
    <AbsoluteFill style={{ backgroundColor: c.night }}>
      <AbsoluteFill><Sunset night={1} sunY={tween(f, [0, 120], [40, 160])} /></AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px', gap: 34, textAlign: 'center' }}>
        <div style={{ font: `400 170px/0.86 ${F.display}`, color: c.sand, textTransform: 'uppercase' }}><Mask delay={0}>Entra en</Mask><Mask delay={6} style={{ color: c.pink, textShadow: `0 0 50px ${c.pink}` }}>Leonida Wire</Mask></div>
        <div style={{ transform: `scale(${(0.5 + b * 0.5) * pulse})`, opacity: b, background: c.sand, color: c.ink, borderRadius: 26, padding: '26px 30px', font: `700 29px ${F.mono}`, letterSpacing: '0', whiteSpace: 'nowrap', boxShadow: `0 20px 60px ${c.pink}66`, maxWidth: 960 }}>
          {p.shortUrl}
        </div>
        <div style={{ font: `italic 400 54px ${F.serif}`, color: c.sun, opacity: sp(f, fps, 36) }}>link en el post ↓</div>
        <div style={{ position: 'absolute', bottom: 60, left: 60, right: 60, font: `700 18px ${F.mono}`, letterSpacing: '0.1em', color: c.muted, opacity: sp(f, fps, 30) }}>FAN SITE NO OFICIAL · SIN RELACIÓN CON ROCKSTAR GAMES NI TAKE-TWO · SIN COOKIES NI ANUNCIOS</div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/* ---------- composición ---------- */
export const LeonidaPromo: React.FC<Props> = (p) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig()
  const starts: number[] = []; SC.reduce((acc, d, i) => { starts.push(acc); return acc + d - T }, 0)
  const vol = (fr: number) => interpolate(fr, [0, 10, durationInFrames - 30, durationInFrames], [0, 0.85, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return (
    <AbsoluteFill style={{ backgroundColor: c.night }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SC[0]}><S1Hook /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SC[1]}><S2Brand /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SC[2]}><S3Site p={p} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SC[3]}><S4Daily /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SC[4]}><S5Sources p={p} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: 'from-bottom' })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SC[5]}><S6Videos p={p} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SC[6]}><S7Cta p={p} /></TransitionSeries.Sequence>
      </TransitionSeries>
      <Grain />
      {/* marca persistente y barra de progreso */}
      <div style={{ position: 'absolute', top: 40, left: 50, font: `400 34px ${F.display}`, color: c.sand, opacity: interpolate(f, [80, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>LEONIDA WIRE <span style={{ font: `italic 400 30px ${F.serif}`, color: c.pink }}>noticias de GTA VI</span></div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 10, width: `${(f / durationInFrames) * 100}%`, background: `linear-gradient(90deg, ${c.pink}, ${c.sun}, ${c.teal})` }} />
      <Audio src={staticFile('audio/leonida/music.wav')} volume={vol} />
      {starts.slice(1).map((s, i) => <Sequence key={i} from={s - 4} durationInFrames={20}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.35} /></Sequence>)}
      <Sequence from={starts[1]} durationInFrames={25}><Audio src={staticFile('sfx/boom.wav')} volume={0.6} /></Sequence>
      <Sequence from={starts[6]} durationInFrames={25}><Audio src={staticFile('sfx/boom.wav')} volume={0.6} /></Sequence>
    </AbsoluteFill>
  )
}
