import { loadFont } from '@remotion/fonts'
import { staticFile } from 'remotion'

// Fuentes variables auto-alojadas en public/fonts (render sin depender de internet).
loadFont({ family: 'Inter', url: staticFile('fonts/Inter.woff2'), weight: '100 900' })
loadFont({ family: 'Sora', url: staticFile('fonts/Sora.woff2'), weight: '100 800' })

/** Identidad de marca DanIA Studio (igual que tailwind.config.js de la web). */
export const brand = {
  navy: '#0A1330',
  navyDeep: '#050A1C',
  navyLight: '#16244F',
  gold: '#D4A537',
  goldLight: '#F2C94C',
  goldDark: '#B8862B',
  white: '#F7F4EC',
  muted: 'rgba(247,244,236,0.62)',
  goldGradient: 'linear-gradient(100deg,#B8862B 0%,#F2C94C 35%,#FFF1C2 50%,#F2C94C 65%,#B8862B 100%)',
} as const

export const fonts = {
  body: 'Inter, system-ui, sans-serif',
  display: 'Sora, Inter, system-ui, sans-serif',
} as const

export const FPS = 30
