import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { wipe } from '@remotion/transitions/wipe'
import { z } from 'zod'
import { Background } from '../lib/Background'
import { Particles } from '../lib/Particles'
import { KineticText } from '../lib/KineticText'
import { Counter, GlassCard, Kicker, LightSweep, LogoMark, ProgressBar } from '../lib/Elements'
import { sp } from '../lib/motion'
import { brand, fonts } from '../theme'

export const brandPromoSchema = z.object({
  kicker: z.string(),
  hook: z.tuple([z.string(), z.string()]),
  servicesTitle: z.string(),
  services: z.array(z.object({ title: z.string(), text: z.string() })).max(4),
  stats: z.array(z.object({ prefix: z.string(), value: z.number(), suffix: z.string(), label: z.string() })).max(3),
  ctaTitle: z.string(),
  ctaButton: z.string(),
  handle: z.string(),
})
type Props = z.infer<typeof brandPromoSchema>

export const PROMO_SCENES = { hook: 80, services: 140, stats: 110, cta: 120, transition: 16 }
export const PROMO_DURATION = PROMO_SCENES.hook + PROMO_SCENES.services + PROMO_SCENES.stats + PROMO_SCENES.cta - 3 * PROMO_SCENES.transition

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 36 }) => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 90, gap, flexDirection: 'column' }}>{children}</AbsoluteFill>
)

const Hook: React.FC<Props> = ({ kicker, hook }) => (
  <Center gap={30}>
    <Kicker text={kicker} delay={2} size={24} />
    <KineticText text={hook[0]} delay={8} size={98} />
    <KineticText text={hook[1]} delay={24} size={98} gold />
    <LightSweep delay={40} duration={30} />
  </Center>
)

const Services: React.FC<Props> = ({ servicesTitle, services }) => (
  <AbsoluteFill style={{ padding: '200px 80px', gap: 40, justifyContent: 'center' }}>
    <Kicker text="Qué hacemos" delay={0} size={24} />
    <KineticText text={servicesTitle} delay={4} stagger={2} size={76} style={{ marginBottom: 20 }} />
    {services.map((s, i) => (
      <GlassCard key={i} delay={22 + i * 9} style={{ display: 'flex', gap: 34, alignItems: 'center' }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: brand.gold, opacity: 0.9, minWidth: 90 }}>0{i + 1}</div>
        <div>
          <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 46, color: brand.white, letterSpacing: '-0.02em' }}>{s.title}</div>
          <div style={{ fontFamily: fonts.body, fontSize: 30, color: brand.muted, marginTop: 8, lineHeight: 1.3 }}>{s.text}</div>
        </div>
      </GlassCard>
    ))}
  </AbsoluteFill>
)

const Stats: React.FC<Props> = ({ stats }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return (
    <Center gap={70}>
      {stats.map((s, i) => {
        const a = sp(frame, fps, 6 + i * 12, 'snappy')
        return (
          <div key={i} style={{ textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 80}px)` }}>
            <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} delay={6 + i * 12} size={210} />
            <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 40, color: brand.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        )
      })}
    </Center>
  )
}

const Cta: React.FC<Props> = ({ ctaTitle, ctaButton, handle }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const b = sp(frame, fps, 40, 'bouncy')
  const pulse = 1 + Math.max(0, Math.sin((frame - 60) / 7)) * 0.03 * (frame > 60 ? 1 : 0)
  return (
    <Center gap={56}>
      <LogoMark delay={0} width={420} />
      <KineticText text={ctaTitle} delay={14} size={104} />
      <div style={{
        transform: `scale(${(0.5 + b * 0.5) * pulse})`, opacity: b, background: brand.goldGradient, backgroundSize: '200% 100%',
        color: brand.navy, fontFamily: fonts.display, fontWeight: 800, fontSize: 52, padding: '30px 72px', borderRadius: 999,
        boxShadow: '0 20px 60px rgba(212,165,55,0.45)',
      }}>{ctaButton} →</div>
      <div style={{ fontFamily: fonts.body, fontSize: 34, color: brand.muted, opacity: sp(frame, fps, 55) }}>{handle}</div>
      <LightSweep delay={70} duration={30} />
    </Center>
  )
}

/** Short/Reel vertical de marca (9:16): gancho → servicios → cifras → llamada a la acción. */
export const BrandPromo: React.FC<Props> = (props) => {
  const T = PROMO_SCENES.transition
  return (
    <AbsoluteFill style={{ backgroundColor: brand.navyDeep }}>
      <Background />
      <Particles count={55} speed={1.2} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={PROMO_SCENES.hook}><Hook {...props} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={PROMO_SCENES.services}><Services {...props} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={PROMO_SCENES.stats}><Stats {...props} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={PROMO_SCENES.cta}><Cta {...props} /></TransitionSeries.Sequence>
      </TransitionSeries>
      <ProgressBar />
    </AbsoluteFill>
  )
}
