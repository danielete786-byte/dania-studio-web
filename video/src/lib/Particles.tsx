import React, { useMemo } from 'react'
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion'
import { noise3D } from '@remotion/noise'
import { brand } from '../theme'

/** Polvo dorado que flota con ruido Perlin (determinista: render idéntico siempre). */
export const Particles: React.FC<{ count?: number; speed?: number; opacity?: number; seed?: string }> = ({
  count = 70, speed = 1, opacity = 1, seed = 'p',
}) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: random(`${seed}x${i}`) * width,
    y: random(`${seed}y${i}`) * height,
    r: 1 + random(`${seed}r${i}`) ** 3 * 5,
    d: 0.3 + random(`${seed}d${i}`) * 0.7,
  })), [count, width, height, seed])
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
      {items.map((p, i) => {
        const t = frame * 0.006 * speed
        const dx = noise3D(seed, i, 0, t) * 80 * p.d
        const dy = -((frame * 0.6 * speed * p.d) % (height + 40)) + noise3D(seed, 0, i, t) * 60
        const y = ((p.y + dy) % (height + 40) + height + 40) % (height + 40) - 20
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.05 * p.d + i))
        return (
          <div key={i} style={{
            position: 'absolute', left: p.x + dx, top: y, width: p.r * 2, height: p.r * 2, borderRadius: '50%',
            background: brand.goldLight, opacity: tw * p.d, boxShadow: `0 0 ${p.r * 6}px ${brand.gold}`,
            filter: p.r > 4 ? 'blur(1.5px)' : undefined,
          }} />
        )
      })}
    </AbsoluteFill>
  )
}
