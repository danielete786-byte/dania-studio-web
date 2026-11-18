import React from 'react'
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { ease, sp, tween } from './motion'
import { brand, fonts } from '../theme'

/** Etiqueta pequeña en mayúsculas con línea dorada que se dibuja. */
export const Kicker: React.FC<{ text: string; delay?: number; size?: number }> = ({ text, delay = 0, size = 26 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = sp(frame, fps, delay, 'smooth')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.7, justifyContent: 'center', opacity: s }}>
      <div style={{ height: 2, width: size * 2.4 * s, background: `linear-gradient(90deg, transparent, ${brand.gold})` }} />
      <div style={{
        fontFamily: fonts.body, fontWeight: 600, fontSize: size, letterSpacing: `${0.1 + (1 - s) * 0.4}em`,
        textTransform: 'uppercase', color: brand.goldLight,
      }}>{text}</div>
      <div style={{ height: 2, width: size * 2.4 * s, background: `linear-gradient(270deg, transparent, ${brand.gold})` }} />
    </div>
  )
}

/** Haz de luz diagonal que barre la pantalla (úsalo encima de logos/títulos). */
export const LightSweep: React.FC<{ delay?: number; duration?: number; angle?: number; opacity?: number }> = ({
  delay = 0, duration = 35, angle = 20, opacity = 0.35,
}) => {
  const frame = useCurrentFrame()
  const x = tween(frame, [delay, delay + duration], [-60, 160], ease.inOutCubic)
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '-50%', left: `${x}%`, width: '10%', height: '200%', transform: `rotate(${angle}deg)`,
        background: 'linear-gradient(90deg, transparent, rgba(255,241,194,0.9), transparent)', filter: 'blur(30px)', opacity,
      }} />
    </AbsoluteFill>
  )
}

/** Contador animado (cifras de impacto). */
export const Counter: React.FC<{ to: number; prefix?: string; suffix?: string; delay?: number; duration?: number; size?: number }> = ({
  to, prefix = '', suffix = '', delay = 0, duration = 45, size = 160,
}) => {
  const frame = useCurrentFrame()
  const v = interpolate(frame, [delay, delay + duration], [0, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.outExpo })
  const shown = to % 1 === 0 ? Math.round(v).toLocaleString('es-ES') : v.toFixed(1)
  return (
    <div style={{
      fontFamily: fonts.display, fontWeight: 800, fontSize: size, letterSpacing: '-0.05em', lineHeight: 1,
      backgroundImage: brand.goldGradient, backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      fontVariantNumeric: 'tabular-nums', filter: 'drop-shadow(0 6px 30px rgba(212,165,55,0.35))',
    }}>{prefix}{shown}{suffix}</div>
  )
}

/** Logo plano (dania-mark.png) con entrada a escala + brillo. */
export const LogoMark: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 360 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = sp(frame, fps, delay, 'bouncy')
  const glow = 0.5 + 0.5 * Math.sin((frame - delay) / 12)
  return (
    <Img src={staticFile('logo/dania-mark.png')} style={{
      width, transform: `scale(${0.6 + s * 0.4})`, opacity: Math.min(1, s * 1.5),
      filter: `drop-shadow(0 0 ${20 + glow * 30}px rgba(242,201,76,${0.35 + glow * 0.25}))`,
    }} />
  )
}

/** Barra de progreso fina (estilo Shorts/Reels). */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  return (
    <div style={{ position: 'absolute', left: 0, bottom: 0, height: 6, width: `${(frame / durationInFrames) * 100}%`, background: brand.goldGradient }} />
  )
}

/** Tarjeta de cristal dorado (para listas de servicios, features, etc.). */
export const GlassCard: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = sp(frame, fps, delay, 'snappy')
  return (
    <div style={{
      transform: `translateX(${(1 - s) * -120}px) scale(${0.92 + s * 0.08})`, opacity: s,
      background: 'linear-gradient(135deg, rgba(22,36,79,0.75), rgba(10,19,48,0.55))',
      border: '1.5px solid rgba(242,201,76,0.28)', borderRadius: 36, padding: '36px 44px',
      boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,241,194,0.12)', backdropFilter: 'blur(14px)', ...style,
    }}>{children}</div>
  )
}
