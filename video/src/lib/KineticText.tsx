import React from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import { sp, SpringName } from './motion'
import { brand, fonts } from '../theme'

type Props = {
  text: string
  /** Frame de inicio. */
  delay?: number
  /** Frames entre cada palabra/letra. */
  stagger?: number
  by?: 'word' | 'char'
  size?: number
  weight?: number
  color?: string
  /** Texto con degradado dorado y brillo que lo recorre. */
  gold?: boolean
  spring?: SpringName
  style?: React.CSSProperties
  align?: 'left' | 'center' | 'right'
  /** Variante de entrada. */
  variant?: 'rise' | 'blur' | 'scale'
}

/** Texto cinético: cada palabra (o letra) entra con máscara + muelle + desenfoque. */
export const KineticText: React.FC<Props> = ({
  text, delay = 0, stagger = 3, by = 'word', size = 96, weight = 800, color = brand.white,
  gold = false, spring = 'snappy', style, align = 'center', variant = 'rise',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const parts = by === 'word' ? text.split(' ') : Array.from(text)
  const shine = ((frame - delay) * 1.6) % 300
  return (
    <div style={{
      fontFamily: fonts.display, fontSize: size, fontWeight: weight, lineHeight: 1.05, letterSpacing: '-0.035em',
      color, textAlign: align, display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
      columnGap: by === 'word' ? '0.26em' : 0, ...style,
    }}>
      {parts.map((p, i) => {
        const s = sp(frame, fps, delay + i * stagger, spring)
        const tr = variant === 'rise' ? `translateY(${(1 - s) * 110}%) rotate(${(1 - s) * 6}deg)`
          : variant === 'scale' ? `scale(${0.4 + s * 0.6})` : `translateY(${(1 - s) * 30}%)`
        const blur = variant === 'blur' ? (1 - s) * 18 : (1 - s) * 6
        return (
          <span key={i} style={{ display: 'inline-block', overflow: variant === 'rise' ? 'hidden' : 'visible', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
            <span style={{
              display: 'inline-block', transform: tr, transformOrigin: '0% 100%', opacity: Math.min(1, s * 1.4), filter: `blur(${blur}px)`,
              whiteSpace: 'pre',
              ...(gold ? {
                backgroundImage: brand.goldGradient, backgroundSize: '300% 100%', backgroundPosition: `${100 - shine / 3}% 0`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                filter: `blur(${blur}px) drop-shadow(0 4px 24px rgba(212,165,55,0.35))`,
              } : {}),
            }}>{p}</span>
          </span>
        )
      })}
    </div>
  )
}
