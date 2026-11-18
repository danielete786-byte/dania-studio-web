import React from 'react'
import { AbsoluteFill, useVideoConfig } from 'remotion'
import { z } from 'zod'
import { Background } from '../lib/Background'
import { Particles } from '../lib/Particles'
import { KineticText } from '../lib/KineticText'
import { Kicker, LightSweep } from '../lib/Elements'
import { brand, fonts } from '../theme'

export const titleCardSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  highlight: z.string(),
  subtitle: z.string(),
})

/** Rótulo / miniatura parametrizable. Sirve como vídeo corto o como imagen fija (npm run still). */
export const TitleCard: React.FC<z.infer<typeof titleCardSchema>> = ({ kicker, title, highlight, subtitle }) => {
  const { width, height } = useVideoConfig()
  const u = Math.min(width, height) / 1080
  return (
    <AbsoluteFill>
      <Background seed="title" />
      <Particles count={50} seed="tc" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 28 * u, padding: 80 * u }}>
        <Kicker text={kicker} size={24 * u} />
        <KineticText text={title} delay={4} size={130 * u} />
        <KineticText text={highlight} delay={14} size={150 * u} gold variant="scale" spring="bouncy" />
        <KineticText text={subtitle} delay={28} size={40 * u} weight={500} color={brand.muted} style={{ fontFamily: fonts.body, letterSpacing: 0 }} />
      </AbsoluteFill>
      <LightSweep delay={30} />
    </AbsoluteFill>
  )
}
