import React from 'react'
import { AbsoluteFill, Audio, Img, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { loadFont } from '@remotion/fonts'
import { z } from 'zod'
import { sp, tween } from '../lib/motion'
import { fonts } from '../theme'

loadFont({ family: 'Noto Color Emoji', url: staticFile('fonts/NotoColorEmoji.ttf') })

/** Paleta synthwave del vídeo original. */
const c = { cyan: '#00e5ff', pink: '#ff2e93', yellow: '#ffd35c', orange: '#ff7a3c', purple: '#5b1a9e', ink: '#130426' }
const FONT = `${fonts.display}, 'Noto Color Emoji'`
const CAP_FONT = `${fonts.body}, 'Noto Color Emoji'`

export const gtaSchema = z.object({
  scenes: z.array(z.object({ seconds: z.number(), voice: z.string(), caption: z.string(), voiceSeconds: z.number() })).length(5),
  nominations: z.number(),
  categories: z.array(z.string()),
})
type Props = z.infer<typeof gtaSchema>

export const gtaDefaults: Props = {
  scenes: [
    { seconds: 6, voice: 'audio/gta/vo1.wav', voiceSeconds: 5.08, caption: 'GTA 6 es el juego más nominado de The Game Awards. Te lo cuento en menos de un minuto.' },
    { seconds: 7, voice: 'audio/gta/vo2.wav', voiceSeconds: 6.16, caption: 'Ocho nominaciones, entre ellas Juego del Año, y mejor actuación para Manni L. Pérez, que da vida a Lucía.' },
    { seconds: 5.8, voice: 'audio/gta/vo3.wav', voiceSeconds: 5.16, caption: 'Y sale mañana, 19 de noviembre, en PlayStation 5 y Xbox Series.' },
    { seconds: 5, voice: 'audio/gta/vo4.wav', voiceSeconds: 4.4, caption: 'En PC aún no hay fecha. La gala será el 10 de diciembre.' },
    { seconds: 4.4, voice: 'audio/gta/vo5.wav', voiceSeconds: 3.48, caption: '¿Vas a jugarlo el día uno? ¡Cuéntamelo!' },
  ],
  nominations: 8,
  categories: ['🏆 Juego del Año', '🎬 Dirección', '📖 Narrativa', '🎨 Arte', '🎵 Música', '🔊 Audio', '🎭 Actuación', '💥 Acción/Aventura'],
}
export const gtaDuration = (p: Props, fps: number) => Math.round(p.scenes.reduce((a, s) => a + s.seconds, 0) * fps)
const VOICE_DELAY = 4

/* ---------- capas comunes ---------- */

/** Foto oficial a pantalla completa con Ken Burns + tinte synthwave. */
const Photo: React.FC<{ src: string; from?: number; to?: number; x?: string; y?: string; dur: number; tint?: number; blur?: number }> = ({ src, from = 1.12, to = 1.0, x = '50%', y = '50%', dur, tint = 0.55, blur = 0 }) => {
  const f = useCurrentFrame()
  const s = interpolate(f, [0, dur], [from, to], { extrapolateRight: 'clamp' })
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${x} ${y}`, transform: `scale(${s})`, filter: blur ? `blur(${blur}px) saturate(1.2)` : 'saturate(1.15) contrast(1.05)' }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${c.ink}cc 0%, transparent 28%, transparent 45%, ${c.ink}f2 88%), linear-gradient(0deg, ${c.pink}33, ${c.purple}33)`, opacity: 0.6 + tint * 0.4 }} />
    </AbsoluteFill>
  )
}

/** Fondo synthwave: sol degradado + suelo de rejilla en perspectiva. */
const Synthwave: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ opacity, background: `radial-gradient(circle at 50% 78%, ${c.yellow} 0, ${c.orange} 14%, ${c.pink} 34%, ${c.purple} 62%, ${c.ink} 100%)` }}>
      <div style={{
        position: 'absolute', left: '-50%', right: '-50%', bottom: 0, height: '30%', transformOrigin: 'bottom', transform: 'perspective(650px) rotateX(55deg)',
        background: `repeating-linear-gradient(90deg, ${c.cyan}55 0 4px, transparent 4px 97px), repeating-linear-gradient(0deg, ${c.cyan}55 0 4px, transparent 4px 65px), ${c.ink}`,
        backgroundPosition: `0 ${(f * 2.2) % 65}px`,
      }} />
    </AbsoluteFill>
  )
}

const neon = (glow: string) => `0 0 50px ${glow}, 0 0 18px ${glow}, 10px 10px 0 ${c.cyan}`

/** Titular con "pop" elástico y glitch periódico (como el original). */
const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; delay?: number }> = ({ children, size = 250, color = '#fff', delay = 0 }) => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = sp(f, fps, delay, 'bouncy')
  const g = (f - delay) % 40
  const gx = g === 34 ? 16 : g === 36 ? -16 : 0
  const skew = g === 34 ? 6 : 0
  return (
    <div style={{
      fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 0.95, color, textAlign: 'center', letterSpacing: '-0.03em', textTransform: 'uppercase',
      textShadow: neon(c.pink), transform: `scale(${s}) rotate(${(1 - s) * -12}deg) translate(${gx}px, ${gx / -2}px) skewX(${skew}deg)`,
    }}>{children}</div>
  )
}

const Tag: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({ children, delay = 9, size = 80 }) => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = sp(f, fps, delay, 'snappy')
  return (
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, whiteSpace: 'nowrap', background: c.cyan, color: c.ink, padding: '14px 40px', transform: `translateX(${(1 - s) * 1300}px) rotate(-3deg)`, boxShadow: `0 0 40px ${c.cyan}aa` }}>{children}</div>
  )
}

const Sub: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({ children, delay = 16, size = 72 }) => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = sp(f, fps, delay, 'snappy')
  return <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, color: '#fff', textAlign: 'center', textShadow: `0 0 30px ${c.ink}, 0 4px 12px #000`, transform: `translateX(${(1 - s) * 1300}px)` }}>{children}</div>
}

const Chip: React.FC<{ children: React.ReactNode; delay: number; size?: number }> = ({ children, delay, size = 52 }) => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = sp(f, fps, delay, 'bouncy')
  return <span style={{ fontFamily: CAP_FONT, fontWeight: 700, fontSize: size, color: '#fff', background: `${c.ink}d9`, border: `5px solid ${c.pink}`, borderRadius: 999, padding: '12px 32px', transform: `scale(${s})`, display: 'inline-block', boxShadow: `0 0 24px ${c.pink}66` }}>{children}</span>
}

const Stack: React.FC<{ children: React.ReactNode; gap?: number; justify?: 'center' | 'flex-end' }> = ({ children, gap = 36, justify = 'center' }) => (
  <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: justify, gap, padding: '230px 70px 470px' }}>{children}</AbsoluteFill>
)

/** Entrada de escena: flash + zoom-punch + aberración cromática breve. */
const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame()
  const flash = interpolate(f, [0, 2, 9], [0.85, 0.5, 0], { extrapolateRight: 'clamp' })
  const punch = interpolate(f, [0, 8], [1.08, 1], { extrapolateRight: 'clamp' })
  const rgb = interpolate(f, [0, 8], [14, 0], { extrapolateRight: 'clamp' })
  return (
    <AbsoluteFill style={{ transform: `scale(${punch})`, filter: rgb > 0.5 ? `drop-shadow(${rgb}px 0 0 ${c.pink}88) drop-shadow(${-rgb}px 0 0 ${c.cyan}88)` : undefined }}>
      {children}
      <AbsoluteFill style={{ background: '#fff', opacity: flash, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  )
}

/* ---------- escenas ---------- */

const S1: React.FC<{ dur: number }> = ({ dur }) => (
  <SceneIn>
    <Photo src="gta/gta6-1.jpg" dur={dur} from={1.5} to={1.3} y="45%" />
    <Stack justify="flex-end" gap={30}>
      <Big size={110} delay={0}>🚨</Big>
      <Big size={250} delay={3}>GTA VI</Big>
      <Tag>EL MÁS NOMINADO</Tag>
      <Sub>The Game Awards 2026 🏆</Sub>
    </Stack>
  </SceneIn>
)

const Count: React.FC<{ to: number }> = ({ to }) => {
  const f = useCurrentFrame()
  const n = Math.min(to, Math.max(0, Math.floor((f - 6) / 4.5) + 1))
  const pop = f >= 6 ? 1 + 0.18 * Math.max(0, 1 - ((f - 6) % 4.5) / 4.5) : 1
  return <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 300, lineHeight: 0.85, color: c.yellow, textShadow: `0 0 60px ${c.pink}, 12px 12px 0 ${c.cyan}`, transform: `scale(${pop})` }}>{n}</div>
}

const S2: React.FC<{ dur: number; p: Props }> = ({ dur, p }) => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const card = sp(f, fps, 2, 'smooth')
  return (
    <SceneIn>
      <Photo src="gta/gta6-2.jpg" dur={dur} blur={26} tint={1} />
      {/* captura oficial en tarjeta inclinada */}
      <div style={{ position: 'absolute', top: 210, left: 80, right: 80, height: 500, borderRadius: 28, overflow: 'hidden', border: `6px solid ${c.cyan}`, boxShadow: `0 0 60px ${c.cyan}88, 0 30px 80px #000a`, transform: `perspective(1400px) rotateY(${(1 - card) * -35 + Math.sin(f / 30) * 3}deg) rotate(-2deg) scale(${0.85 + card * 0.15})`, opacity: card }}>
        <Img src={staticFile('gta/gta6-2.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, dur], [1.15, 1.02])})` }} />
      </div>
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 30, padding: '760px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Count to={p.nominations} />
          <Tag delay={6 + p.nominations * 4.5} size={74}>NOMINACIONES</Tag>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          {p.categories.map((x, i) => <Chip key={i} delay={8 + i * 4} size={38}>{x}</Chip>)}
        </div>
        <Sub delay={60} size={58}>🎭 Manni L. Pérez es Lucía</Sub>
      </AbsoluteFill>
    </SceneIn>
  )
}

const S3: React.FC<{ dur: number }> = ({ dur }) => (
  <SceneIn>
    <Photo src="gta/gta6-1.jpg" dur={dur} from={1.6} to={1.45} x="50%" y="62%" tint={1} blur={14} />
    <Stack gap={34}>
      <Sub delay={0} size={84}>⏳ MAÑANA</Sub>
      <Big size={300} delay={4} color={c.yellow}>19<br />NOV</Big>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip delay={20}>🎮 PlayStation 5</Chip>
        <Chip delay={26}>🟩 Xbox Series X|S</Chip>
      </div>
    </Stack>
  </SceneIn>
)

const S4: React.FC<{ dur: number }> = ({ dur }) => (
  <SceneIn>
    <Synthwave />
    <Photo src="gta/gta6-2.jpg" dur={dur} from={1.25} to={1.1} x="38%" tint={1} blur={2} />
    <AbsoluteFill style={{ opacity: 0.55 }}><Synthwave /></AbsoluteFill>
    <Stack gap={40}>
      <Big size={260} delay={0}>💻 PC</Big>
      <Tag delay={8}>¿SIN FECHA? 👀</Tag>
      <Sub delay={18}>🏆 Gala: 10 de diciembre</Sub>
    </Stack>
  </SceneIn>
)

const S5: React.FC<{ dur: number }> = ({ dur }) => (
  <SceneIn>
    <Photo src="gta/gta6-1.jpg" dur={dur} from={1.05} to={1.15} y="25%" tint={0.9} />
    <Stack gap={40}>
      <Big size={240} delay={0}>¿DÍA<br />1? 🔥</Big>
      <Tag delay={8}>¿LO JUEGAS?</Tag>
      <Sub delay={16}>Cuéntamelo 👇 y sígueme</Sub>
    </Stack>
  </SceneIn>
)

/* ---------- superposiciones ---------- */

/** Emojis que suben (deterministas). */
const Floaters: React.FC = () => {
  const f = useCurrentFrame()
  const { height } = useVideoConfig()
  const set = ['🎮', '🌴', '🔥', '🏆', '🚗', '⭐']
  const items = Array.from({ length: 45 }, (_, i) => ({ start: i * 19, x: random('fx' + i) * 92, e: set[Math.floor(random('fe' + i) * 6)], s: 64 + random('fs' + i) * 40 }))
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {items.map((it, i) => {
        const t = (f - it.start) / 150
        if (t < 0 || t > 1) return null
        return <span key={i} style={{ position: 'absolute', left: `${it.x}%`, top: height + 60 - t * (height * 1.25), fontFamily: "'Noto Color Emoji'", fontSize: it.s, opacity: (1 - t) * 0.85, transform: `rotate(${t * 40}deg)` }}>{it.e}</span>
      })}
    </AbsoluteFill>
  )
}

/** Subtítulos tipo karaoke: la palabra que suena se ilumina en cian. */
const Caption: React.FC<{ text: string; voiceFrames: number }> = ({ text, voiceFrames }) => {
  const f = useCurrentFrame() - VOICE_DELAY
  const words = text.split(' ')
  const weights = words.map((w) => w.length + 2)
  const total = weights.reduce((a, b) => a + b, 0)
  let acc = 0
  const starts = weights.map((w) => { const s = (acc / total) * voiceFrames; acc += w; return s })
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, bottom: 120, textAlign: 'center', fontFamily: CAP_FONT, fontWeight: 800, fontSize: 52, lineHeight: 1.3, color: '#fff', textShadow: '0 3px 8px #000', background: `${c.ink}b3`, borderRadius: 28, padding: '18px 26px' }}>
      {words.map((w, i) => {
        const on = f >= starts[i]
        const cur = on && (i === words.length - 1 || f < starts[i + 1])
        return <span key={i} style={{ color: cur ? c.cyan : on ? '#fff' : '#ffffff70', display: 'inline-block', marginRight: 14, transform: `scale(${cur ? 1.08 : 1})` }}>{w}</span>
      })}
    </div>
  )
}

/* ---------- composición ---------- */

export const GtaNominado: React.FC<Props> = (p) => {
  const f = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const Scenes = [S1, S2, S3, S4, S5]
  let from = 0
  const timeline = p.scenes.map((s) => { const d = Math.round(s.seconds * fps); const r = { from, d }; from += d; return r })
  const topIn = tween(f, [0, 14], [-140, 0])
  return (
    <AbsoluteFill style={{ backgroundColor: c.ink }}>
      <Synthwave />
      {timeline.map(({ from, d }, i) => {
        const S = Scenes[i]
        return (
          <Sequence key={i} from={from} durationInFrames={d} name={`Escena ${i + 1}`}>
            {i === 1 ? <S2 dur={d} p={p} /> : <S dur={d} p={p} />}
            <Caption text={p.scenes[i].caption} voiceFrames={Math.round(p.scenes[i].voiceSeconds * fps)} />
            <Sequence from={VOICE_DELAY}><Audio src={staticFile(p.scenes[i].voice)} volume={1} /></Sequence>
            <Audio src={staticFile('sfx/whoosh.wav')} volume={0.22} />
            <Audio src={staticFile('sfx/boom.wav')} volume={0.3} />
            {i === 1 && Array.from({ length: p.nominations }, (_, k) => (
              <Sequence key={k} from={6 + Math.round(k * 4.5)} durationInFrames={5}><Audio src={staticFile('sfx/tick.wav')} volume={0.12} playbackRate={1 + k * 0.08} /></Sequence>
            ))}
          </Sequence>
        )
      })}
      <Sequence from={timeline[4].from - 22} durationInFrames={30}><Audio src={staticFile('sfx/riser.wav')} volume={0.1} /></Sequence>
      <Audio src={staticFile('sfx/pad.wav')} volume={(fr) => { let t = 0; for (const s of p.scenes) { const a = t + VOICE_DELAY, b = a + Math.round(s.voiceSeconds * fps); if (fr >= a - 6 && fr <= b + 6) return 0.05; t += Math.round(s.seconds * fps) } return 0.14 }} />
      <Floaters />
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', transform: `translateY(${topIn}px)` }}>
        <span style={{ fontFamily: CAP_FONT, fontWeight: 800, fontSize: 44, color: '#fff', background: c.ink, border: `5px solid ${c.yellow}`, padding: '12px 34px', borderRadius: 999 }}>⏱️ TE LO CUENTO EN MENOS DE UN MINUTO</span>
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 20, width: '100%', background: '#ffffff33' }}>
        <div style={{ height: '100%', width: `${(f / durationInFrames) * 100}%`, background: c.cyan, boxShadow: `0 0 20px ${c.cyan}` }} />
      </div>
      <div style={{ position: 'absolute', right: 30, bottom: 34, fontFamily: CAP_FONT, fontSize: 22, color: '#ffffffaa' }}>Imágenes: Rockstar Games</div>
    </AbsoluteFill>
  )
}
