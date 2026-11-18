import { Easing, interpolate, spring, SpringConfig } from 'remotion'

/** Presets de muelle (spring) con sensación premium. */
export const springs = {
  smooth: { damping: 200, mass: 1, stiffness: 100 },
  snappy: { damping: 20, mass: 0.6, stiffness: 180 },
  bouncy: { damping: 11, mass: 0.7, stiffness: 140 },
  heavy: { damping: 30, mass: 2, stiffness: 90 },
} satisfies Record<string, Partial<SpringConfig>>

export type SpringName = keyof typeof springs

export const ease = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  inOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  inExpo: Easing.bezier(0.7, 0, 0.84, 0),
}

/** Muelle 0→1 a partir de `delay` frames. */
export const sp = (frame: number, fps: number, delay = 0, name: SpringName = 'smooth', durationInFrames?: number) =>
  spring({ frame: frame - delay, fps, config: springs[name], durationInFrames })

/** Interpolación con clamp y easing por defecto outExpo. */
export const tween = (frame: number, input: [number, number], output: [number, number], easing = ease.outExpo) =>
  interpolate(frame, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing })

/** 1 al principio, se desvanece a 0 en los últimos `frames` del clip. */
export const fadeOut = (frame: number, duration: number, frames = 12) =>
  interpolate(frame, [duration - frames, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
