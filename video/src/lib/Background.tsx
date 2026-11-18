import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { noise2D } from '@remotion/noise'
import { brand } from '../theme'

/** Fondo de marca: degradado navy, orbes dorados que flotan, rejilla sutil, grano y viñeta. */
export const Background: React.FC<{ glow?: number; grid?: boolean; seed?: string }> = ({ glow = 1, grid = true, seed = 'bg' }) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const t = frame / 140
  const orbs = [0, 1, 2].map((i) => ({
    x: 50 + noise2D(seed + 'x' + i, t, i) * 38,
    y: 50 + noise2D(seed + 'y' + i, i, t) * 38,
    s: [0.9, 0.65, 0.5][i],
    c: [brand.goldDark, brand.goldLight, '#2B4BC4'][i],
    o: [0.22, 0.12, 0.28][i],
  }))
  const big = Math.max(width, height)
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 40%, ${brand.navyLight} 0%, ${brand.navy} 45%, ${brand.navyDeep} 100%)`, overflow: 'hidden' }}>
      {orbs.map((o, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${o.x}%`, top: `${o.y}%`, width: big * o.s, height: big * o.s,
          transform: 'translate(-50%,-50%)', borderRadius: '50%', opacity: o.o * glow,
          background: `radial-gradient(circle, ${o.c} 0%, transparent 65%)`, filter: 'blur(40px)', mixBlendMode: 'screen',
        }} />
      ))}
      {grid && (
        <AbsoluteFill style={{
          backgroundImage: 'linear-gradient(rgba(242,201,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(242,201,76,0.06) 1px, transparent 1px)',
          backgroundSize: `${big / 18}px ${big / 18}px`, backgroundPosition: `0 ${-(frame * 0.4) % (big / 18)}px`,
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 75%)',
        }} />
      )}
      <Grain />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)' }} />
    </AbsoluteFill>
  )
}

/** Grano de película animado (cambia de semilla cada 2 frames). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame()
  const seed = Math.floor(frame / 2) % 12
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  )
}
