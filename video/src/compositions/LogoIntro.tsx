import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { z } from 'zod'
import { Background } from '../lib/Background'
import { Particles } from '../lib/Particles'
import { KineticText } from '../lib/KineticText'
import { Kicker, LightSweep } from '../lib/Elements'
import { Logo3D } from '../lib/Logo3D'
import { fadeOut, tween } from '../lib/motion'
import { brand, fonts } from '../theme'

export const logoIntroSchema = z.object({
  /** Opcional: el GLB ya incluye el texto "DanIA Studio". */
  title: z.string(),
  tagline: z.string(),
  kicker: z.string(),
})

/** Intro de logo 3D cinematográfica (16:9 o 9:16; se adapta al tamaño). */
export const LogoIntro: React.FC<z.infer<typeof logoIntroSchema>> = ({ title, tagline, kicker }) => {
  const frame = useCurrentFrame()
  const { durationInFrames, width, height } = useVideoConfig()
  const vertical = height > width
  const unit = Math.min(width, height) / 1080
  const out = fadeOut(frame, durationInFrames, 18)
  const camPush = interpolate(frame, [0, durationInFrames], [1.06, 1])
  const flash = interpolate(frame, [62, 66, 80], [0, 0.35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const textLift = tween(frame, [60, 100], [40, 0])
  const halo = tween(frame, [20, 80], [0, 1])
  return (
    <AbsoluteFill style={{ backgroundColor: brand.navyDeep }}>
      <AbsoluteFill style={{ opacity: out, transform: `scale(${camPush})` }}>
        <Background />
        <Particles count={vertical ? 60 : 90} />
        {/* Contraluz cálido para que el texto navy del logo se lea sobre el fondo oscuro */}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateY(${vertical ? -8 : -7}%)` }}>
          <div style={{ width: 1100 * unit, height: 700 * unit, borderRadius: '50%', opacity: halo,
            background: 'radial-gradient(closest-side, rgba(255,236,190,0.55), rgba(242,201,76,0.18) 55%, transparent)', filter: 'blur(30px)' }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateY(${vertical ? -8 : -7}%) scale(${vertical ? 1 : 1.1})` }}>
          <Logo3D delay={4} />
        </AbsoluteFill>
        <LightSweep delay={55} duration={40} />
        <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: (vertical ? 560 : 110) * unit, gap: 22 * unit, transform: `translateY(${textLift}px)` }}>
          {title && <KineticText text={title} delay={62} stagger={2} by="char" size={(vertical ? 120 : 112) * unit} gold variant="blur" />}
          <KineticText text={tagline} delay={82} stagger={3} size={(vertical ? 46 : 40) * unit} weight={600} color={brand.white}
            style={{ fontFamily: fonts.body, letterSpacing: '-0.01em', maxWidth: '86%' }} />
          <div style={{ marginTop: 14 * unit }}><Kicker text={kicker} delay={100} size={20 * unit} /></div>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: brand.goldLight, opacity: flash, mixBlendMode: 'screen' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
